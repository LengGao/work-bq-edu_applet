import request from '@/utils/request'

// 获取在销售简报数据
export function getBriefing(data) {
    return request({
        url: '/index/briefing',
        method: 'post',
        loading: true,
        data
    })
}
// 获取业绩指标数据
export function performanceIndicators(data) {
    return request({
        url: '/index/performanceIndicators',
        method: 'post',
        loading: true,
        data
    })
}
// 获取销售趋势数据
export function getTrendData(data) {
    return request({
        url: '/index/trend',
        method: 'post',
        loading: true,
        data
    })
}
// 获取销售龙虎榜
export function getSalesRankData(data) {
    return request({
        url: '/index/salesRank',
        method: 'post',
        loading: true,
        data
    })
}
// 获取客户录入排行榜
export function getCustomerRankData(data) {
    return request({
        url: '/index/customerRank',
        method: 'post',
        loading: true,
        data
    })
}
// 获取查看数据范围选项
export function getGroupWithUser(data) {
    return request({
        url: '/index/getGroupWithUser',
        method: 'get',
        data
    })
}
// 根据数据范围选项查询用户ID
export function getUserId(data) {
    return request({
        url: '/index/getUserId',
        method: 'post',
        data
    })
}