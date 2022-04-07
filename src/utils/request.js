import store from '@/store'
import { appletLogin } from '@/api/user'
const baseUrl = process.env.VUE_APP_BASE_API
const debounce = (fn, delay = 300) => {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay);
    }
}
const toLogin = debounce((openid) => {
    uni.navigateTo({
        url: `/pages/login/index?openid=${openid}`
    });
})
const uniToast = (options) => {
    Promise.resolve().then(() => {
        uni.showToast(options)
    })
}
class Http {
    constructor() {
        this.subscribers = []
        this.isRefrehToken = false

    }
    // 添加订阅
    _addSubScribe(callback) {
        this.subscribers.push(callback)
    }
    // 执行所有并清空
    _onAccessTokenFetched() {
        const subscribers = this.subscribers.splice(0)
        subscribers.forEach((callback) => {
            callback()
        })
    }
    // 重新获取token
    _refreshToken() {
        this.isRefrehToken = true
        uni.login({
            success: async ({ code }) => {
                const res = await appletLogin({ code })
                if (res.code === 5) {
                    // 需要绑定教务账户
                    toLogin(res.data.applet_openid)
                }
                if (res.code === 0) {
                    // 更新token
                    store.dispatch("setUserInfo", {
                        ...res.data.info,
                        token: res.data.token,
                    });
                    // 执行队列里的请求
                    this._onAccessTokenFetched()
                }
                this.isRefrehToken = false
            },
            fail: () => {
                uniToast({
                    icon: "error",
                    title: "获取code失败",
                });
            },
        });
    }
    // 当token失效时 添加当前请求到队列里
    _onTokenExpired(options, resolve, reject) {
        this._addSubScribe(() => {
            this.request(options).then(resolve).catch(reject)
        })
        !this.isRefrehToken && this._refreshToken()
    }
    request(options) {
        const { url, data, loading, header = {}, auth = true, showToast = false } = options
        return new Promise((resolve, reject) => {
            // 需要鉴权的接口必须有token
            if (auth) {
                if (!store.getters.token) {
                    this._onTokenExpired(options, resolve, reject)
                    return
                }
                header.token = store.getters.token
            }
            loading && uni.showLoading({
                title: "加载中",
            });
            // console.log(`${url} >>参数：`, data)
            const _url = (baseUrl + url).replace('\'', '')
            // console.log("_url", _url);
            uni.request({
                ...options,
                url: _url,
                data,
                header,
                success: (response) => {
                    const { data } = response
                    if (data.code === 3001) {
                        this._onTokenExpired(options, resolve, reject)
                        return
                    }
                    if (data.code !== 0 && data.code !== 5) {
                        uniToast({
                            icon: 'none',
                            title: data.message || '请求失败'
                        })
                        // console.log(`${url} >>error：`, data)
                        return reject(data)
                    }
                    if (showToast) {
                        uniToast({
                            icon: 'none',
                            title: data.message
                        })
                    }
                    resolve(data)
                },
                fail: (error) => {
                    // console.log(`${url} >>error：`, error)
                    uniToast({
                        icon: 'error',
                        title: error.errMsg || '稍后再试'
                    })
                    reject(error)
                },
                complete: () => {
                    loading && uni.hideLoading()
                }
            })
        })
    }
}
export default new Http()