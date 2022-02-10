import store from '@/store'
const debounce = (fn, delay = 300) => {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay);
    }
}
const toLogin = debounce(() => {
    uni.navigateTo({
        url: "/pages/login/index"
    });
})
const errorHandler = {
    '3001': toLogin,
}
const uniToast = (options) => {
    Promise.resolve().then(() => {
        uni.showToast(options)
    })
}
const requset = (options) => new Promise(async (resolve, reject) => {
    const { auth = true, loading, data, header = {}, url, showToast = false } = options
    // 需要鉴权的接口必须有token
    if (auth) {
        if (!store.getters.token) {
            toLogin()
            return
        }
        header.token = store.getters.token
    }
    loading && uni.showLoading({
        title: "加载中",
    });
    console.log(`${url} >>参数：`, data)
    uni.request({
        ...options,
        data,
        header,
        url: process.env.VUE_APP_BASE_API + url,
        success: (response) => {
            const { data } = response
            if (data.code !== 0 && data.code !== 5) {
                errorHandler[data.code] && errorHandler[data.code]()
                uniToast({
                    icon: 'none',
                    title: data.message || '请求失败'
                })
                console.log(`${url} >>error：`, data)
                return reject(data)
            }
            if (showToast) {
                uniToast({
                    icon: 'success',
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
export default requset