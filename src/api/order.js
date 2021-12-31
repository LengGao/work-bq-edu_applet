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
        data
    })
}
// 订单操作 1、通过，2：拒绝 , 3:撤销/作废订单，4、删除订单
export function crmOrderApprove(data) {
    return request({
        url: '/CrmOrder/approve',
        method: 'post',
        showToast: true,
        data
    })
}
// 订单催办
export function hurryUp(data) {
    return request({
        url: '/CrmOrder/hurryUp',
        method: 'post',
        showToast: true,
        data
    })
}
// 获取招生审批订单列表
export function getCrmApproveOrder(data) {
    return request({
        url: '/CrmOrder/authorize',
        method: 'post',
        data
    })
}