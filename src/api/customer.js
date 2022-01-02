import request from '@/utils/request'
// crm客户列表
export function getCrmCustomerList(data) {
    return request({
        url: '/CrmCustomer/index',
        method: 'post',
        loading: true,
        data
    })
}
// crm获取自定义字段的选项
export function getCustomfieldOptions(data) {
    return request({
        url: '/Customfield/getInfo',
        method: 'get',
        data
    })
}
// crm添加客户
export function createCrmCustomer(data) {
    return request({
        url: '/CrmCustomer/create',
        method: 'post',
        showToast: true,
        data
    })
}