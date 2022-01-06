import request from '@/utils/request'
// crm客户列表
export function getCrmCustomerList(data) {
    return request({
        url: '/CrmCustomer/index',
        method: 'post',
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

// 报名时选择项目
export function getCateProjectOption(params) {
    return request({
        url: '/project/cate_project',
        method: 'get',
        params,
    })
}
// 报名时选择项目-查询已选项目的详情
export function getCateProjectDetail(data) {
    return request({
        url: '/project/mult_detail',
        method: 'post',
        data,
    })
}
// 院校专业列表
export function getUniversityMajorDetailList(data) {
    return request({
        url: '/UniversityMajorDetail/page',
        method: 'get',
        loading: true,
        data,
    })
}
// crm报名 
export function createCrmOrder(data) {
    return request({
        url: '/CrmOrder/create',
        method: 'post',
        showToast: true,
        data
    })
}
/**
 * 上传图片url
 */
export function uploadImage(file) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: `${process.env.VUE_APP_BASE_API}/oss/uploadImage`,
            filePath: file.url,
            name: 'image',
            success: (res) => {
                const data = JSON.parse(res.data)
                resolve(data.data.data)
            },
            fail: reject
        });
    })

}
// 教务开课列表
export function projectUser(data) {
    return request({
        url: '/CrmOrder/projectUser',
        method: 'post',
        data
    })
}
// 一键开课
export function eduOpenCourse(data) {
    return request({
        url: '/CrmOrder/eduOpenCourse',
        method: 'get',
        data
    })
}