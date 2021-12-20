import request from '@/utils/request'

// 获取工作通知
export function getStaffNotice(data) {
    return request({
        url: '/StaffNotice/index',
        method: 'get',
        data
    })
}
// 获取回款计划提醒
export function getReceivablePlan(data) {
    return request({
        url: '/index/receivablePlan',
        method: 'post',
        data
    })
}
// 获取系统公告
export function getSystemMsgList(data) {
    return request({
        url: '/index/getSystemAnnouncementList',
        method: 'post',
        data
    })
}
// 获取系统公告详情
export function getAnnouncementInfo(data) {
    return request({
        url: '/Workbench/getAnnouncementInfo',
        method: 'get',
        data,
        loading: true
    })
}
// 获取待跟进客户
export function staffFollow(data) {
    return request({
        url: '/index/staffFollow',
        method: 'post',
        data
    })
}