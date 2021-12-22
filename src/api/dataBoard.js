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