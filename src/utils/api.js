// 上传图片

const Base_Upload_url = process.env.VUE_APP_BASE_API


export function chooseImage (options) {
    return new Promise(function (resolve, reject) {
        uni.chooseImage({
            ...options,
            success: (res) => resolve(res),
            fail: (err) => reject(err)
        })
    })
}

export function compressImage(options) {
    return new Promise(function (resolve, reject) {
        uni.compressImage({
            ...options,
            success: (res) => resolve(res),
            fail: (err) => reject(err)
        })
    })
}

export function upLoadFile(options) {
    return new Promise(function (resolve, reject) {
        options.url = Base_Upload_url + options.url
        uni.uploadFile({
            ...options,
            success: (res) => resolve(res),
            fail: (err) => reject(err)
        })
    })
}

export function chooseMessageFile(options) {
    return new Promise(function (resolve, reject) {
        uni.chooseMessageFile({
            ...options,
            success: (res) => resolve(res),
            fail: (err) => reject(err)
        })
    })
}