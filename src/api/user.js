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
