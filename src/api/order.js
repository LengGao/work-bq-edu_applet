import request from '@/utils/request'
// crm订单列表
export function getCrmOrderList(data) {
    return request({
        url: '/CrmOrder/index',
        method: 'post',
        loading: true,
        data
    })
}
// crm订单详情
export function getCrmOrderDetail(data) {
    return request({
        url: '/CrmOrder/detail',
        method: 'get',
        loading: true,
        data
    })
}