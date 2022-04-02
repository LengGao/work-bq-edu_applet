import http from '@/utils/request'
// 工作通知-标为已读
export function readStaffNotice(data) {
    return http.request({
        url: '/StaffNotice/read',
        method: 'get',
        data
    })
}
// 获取工作通知
export function getStaffNotice(data) {
    return http.request({
        url: '/StaffNotice/index',
        method: 'get',
        data
    })
}
// 获取回款计划提醒
export function getReceivablePlan(data) {
    return http.request({
        url: '/index/receivablePlan',
        method: 'post',
        data
    })
}
// 获取系统公告
export function getSystemMsgList(data) {
    return http.request({
        url: '/index/getSystemAnnouncementList',
        method: 'post',
        data
    })
}
// 获取系统公告详情
export function getAnnouncementInfo(data) {
    return http.request({
        url: '/Workbench/getAnnouncementInfo',
        method: 'get',
        data,
        loading: true
    })
}
// 获取待跟进客户
export function staffFollow(data) {
    return http.request({
        url: '/index/staffFollow',
        method: 'post',
        data
    })
}
// 通知
export function getNoticeData(params) {
    return http.request({
        url: '/StaffNotice/notice',
        method: 'get',
        params,
        loading: false
    })
}