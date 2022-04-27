import http from '@/utils/request'

// 获取在销售简报数据
export function getBriefing(data) {
    return http.request({
        url: '/index/briefing',
        method: 'post',
        loading: true,
        data
    })
}

export function getBriefingOrg(data) {
    return http.request({
        url: '/index/briefing',
        method: 'post',
        loading: true,
        data
    })
}


// 获取业绩指标数据
export function performanceIndicators(data) {
    return http.request({
        url: '/index/performanceIndicators',
        method: 'post',
        loading: true,
        data
    })
}
// 获取销售趋势数据
export function getTrendData(data) {
    return http.request({
        url: '/index/trend',
        method: 'post',
        loading: true,
        data
    })
}
// 获取销售龙虎榜
export function getSalesRankData(data) {
    return http.request({
        url: '/index/salesRank',
        method: 'post',
        loading: true,
        data
    })
}
// 获取客户录入排行榜
export function getCustomerRankData(data) {
    return http.request({
        url: '/index/customerRank',
        method: 'post',
        loading: true,
        data
    })
}
// 获取查看数据范围选项
export function getGroupWithUser(data) {
    return http.request({
        url: '/index/getGroupWithUser',
        method: 'get',
        data
    })
}
// 根据数据范围选项查询用户ID
export function getUserId(data) {
    return http.request({
        url: '/index/getUserId',
        method: 'post',
        data
    })
}

// 获取机构销售数据排行
export function getOrgSalesRank(data) {
    return http.request({
        url: '/index/orgSalesRank',
        method: 'post',
        data
    })
}
// 获取部门销售数据排行
export function getDepartmentRank(data) {
    return http.request({
        url: '/index/departmentRank',
        method: 'post',
        data
    })
}
// 获取校区销售数据排行
export function getSchoolRank(data) {
    return http.request({
        url: '/index/schoolRank',
        method: 'post',
        data
    })
}
// 获取机构学生数据排行
export function getOrgStudentRank(data) {
    return http.request({
        url: '/index/orgStudentRank',
        method: 'post',
        data
    })
}
// 获取机构学费金额排行
export function getOrgTuitionRank(data) {
    return http.request({
        url: '/index/orgTuitionRank',
        method: 'post',
        data
    })
}
// 获取机构其他金额排行
export function getOrgOtherMoneyRank(data) {
    return http.request({
        url: '/index/orgOtherMoneyRank',
        method: 'post',
        data
    })
}