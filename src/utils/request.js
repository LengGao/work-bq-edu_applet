import store from '@/store'
const toLogin = () => {
    uni.redirectTo({
        url: "/pages/login/index"
    });
}
const errorHandler = {
    '-1': toLogin,
}
const sleep = (time) => new Promise(resolve => {
    setTimeout(resolve, time);
})

const showToast = (options) => {
    setTimeout(() => {
        uni.showToast(options)
    });
}
const requset = (options) => new Promise(async (resolve, reject) => {
    const { auth = true, loading, data, header = {}, url } = options
    // 需要鉴权的接口必须有token
    if (auth !== false && !store.getters.token) {
        toLogin()
        return
    }
    loading && uni.showLoading({
        title: "加载中",
    });
    console.log(`${url} >>参数：`, data)
    uni.request({
        ...options,
        data: {
            ...data,
        },
        header: {
            ...header,
            token: store.getters.token,
        },
        url: process.env.VUE_APP_BASE_API + url,
        success: (response) => {
            const { data } = response
            console.log(`${url} >>success：`, data)
            if (data.code !== 0) {
                errorHandler[data.code] && errorHandler[data.code]()
                showToast({
                    icon: 'none',
                    title: data.message
                })
                reject(data)
            }
            resolve(data)
        },
        fail: (error) => {
            console.log(`${url} >>error：`, error)
            showToast({
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