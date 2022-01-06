import request from '@/utils/request'
// crm订单列表
export function getCrmOrderList(data) {
    return request({
        url: '/CrmOrder/index',
        method: 'post',
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
// crm创建回款计划
export function createOrderPayPlan(data) {
    return request({
        url: '/OrderPayPlan/create',
        method: 'post',
        showToast: true,
        data
    })
}
// 教务开课-获取机构
export function getOrganizationOptions(data) {
    return request({
        url: '/Organization/switchList',
        method: 'get',
        data
    })
}
// 教务开课-获取机构项目班型
export function getInstitutionClassType(data) {
    return request({
        url: '/CrmCourse/classType',
        method: 'post',
        loading: true,
        data
    })
}
// 教务添加学生开课
export function orderOpen(data) {
    return request({
        url: '/CrmOrder/orderOpen',
        method: 'post',
        showToast: true,
        data
    })
}
