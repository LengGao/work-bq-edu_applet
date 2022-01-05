import request from '@/utils/request'
// 获取小程序信息
export const getVersion = (data) => {
    return request({
        url: 'sign/getVersion',
        method: 'post',
        data,
        auth: false,
        loading: true
    })
}
//根据微信code登录
export const appletLogin = (data) => {
    return request({
        url: '/passport/appletLogin',
        method: 'post',
        data,
        auth: false,
    })
}
//绑定账号登录
export const appletBindPhone = (data) => {
    return request({
        url: '/passport/appletBindPhone',
        method: 'post',
        data,
        auth: false,
    })
}
