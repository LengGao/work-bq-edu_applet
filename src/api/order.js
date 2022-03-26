import http from '@/utils/request'
// crm订单列表 渠道订单 channel: 1 招生订单 channel: 2
export function getCrmOrderList(data) {
    return http.request({
        url: '/CrmOrder/index',
        method: 'post',
        data
    })
}
// crm订单详情
export function getCrmOrderDetail(data) {
    return http.request({
        url: '/CrmOrder/detail',
        method: 'get',
        data
    })
}
export function orderCancel(data) {
    return http.request({
        url: '/order/cancel',
        method: 'get',
        showToast: true,
        data
    })
}
// 订单操作 1、通过，2：拒绝 , 3:撤销/作废订单，4、删除订单
export function crmOrderApprove(data) {
    return http.request({
        url: '/CrmOrder/approve',
        method: 'post',
        showToast: true,
        loading: true,
        data
    })
}
// 订单催办
export function hurryUp(data) {
    return http.request({
        url: '/CrmOrder/hurryUp',
        method: 'post',
        showToast: true,
        loading: true,
        data
    })
}
// 订单异动-审批
export function orderUnusualApprove(data) {
    return http.request({
        url: '/CrmOrder/action',
        method: 'post',
        showToast: true,
        loading: true,
        data
    })
}
// 获取招生审批订单列表
export function getCrmApproveOrder(data) {
    return http.request({
        url: '/CrmOrder/authorize',
        method: 'post',
        data
    })
}
// 教务开课-获取机构
export function getOrganizationOptions(data) {
    return http.request({
        url: '/Organization/switchList',
        method: 'get',
        data
    })
}
// 教务开课-获取机构项目班型
export function getInstitutionClassType(data) {
    return http.request({
        url: '/CrmCourse/classType',
        method: 'post',
        loading: true,
        data
    })
}
// 教务添加学生开课
export function orderOpen(data) {
    return http.request({
        url: '/CrmOrder/orderOpen',
        method: 'post',
        showToast: true,
        data
    })
}
// 获取项目选项
export function getProjectOptions(data) {
    return http.request({
        url: '/project/getproject',
        method: 'get',
        data,
    })
}
// 获取分类选项
export function getCateList(data) {
    return http.request({
        url: '/courseCategory/getcategorytree',
        method: 'get',
        data,
    })
}
// 获取员工选项
export function getStaffList(data) {
    return http.request({
        url: '/staff/index',
        method: 'get',
        data,
    })
}
// 异动审批列表
export function getUnusualList(data) {
    return http.request({
        url: '/CrmOrder/unusual',
        method: 'post',
        data
    })
}
// 招生回款审批列表
export function getReturnPaymentList(data) {
    return http.request({
        url: '/CrmOrder/log',
        method: 'post',
        data
    })
}
// 渠道回款审批列表
export function getOrgReceivableList(data) {
    return http.request({
        url: '/OrgReceivable/getList',
        method: 'get',
        data
    })
}
// 渠道回款详情
export function getReceivableInfo(data) {
    return http.request({
        url: '/OrgReceivable/getInfo',
        method: 'get',
        data
    })
}
// 招生回款-入账、驳回
export function entryLog(data) {
    return http.request({
        url: '/CrmOrder/entryLog',
        method: 'post',
        showToast: true,
        loading: true,
        data
    })
}
// 渠道回款审批
export function reviewReceivableOrder(data) {
    return http.request({
        url: '/OrgReceivable/reviewReceivableOrder',
        method: 'post',
        showToast: true,
        loading: true,
        data
    })
}
// 根据订单id获取学籍异动详情
export function getOrderTransactionList(data) {
    return http.request({
        url: '/Crm/getOrderTransactionList',
        method: 'get',
        data
    })
}
// 订单申请作废退款
export function refundInvalid(data) {
    return http.request({
        url: '/CrmOrder/refundInvalid',
        method: 'post',
        showToast: true,
        data
    })
}

// 获取计划费用类型
export function getPlanTypeList(params) {
    return http.request({
        url: '/CustomerOrder/planTypeList',
        method: 'get',
        params,
    })
}

// crm 创建回款计划
export function createOrderPayPlan(data) {
    return http.request({
        url: '/OrderPayPlan/create',
        method: 'post',
        showToast: true,
        data
    })
}

// crm创建回款记录
export function payLogCreate(data) {
    return http.request({
        url: '/CrmOrder/payLogCreate',
        method: 'post',
        showToast: true,
        data
    })
}

// 订单申请异动
export function orderReshuffle(data) {
    return http.request({
        url: '/CrmOrder/reshuffle',
        method: 'post',
        data
    })
}