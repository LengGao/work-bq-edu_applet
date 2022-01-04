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
export function getStaffList(data) {
    return request({
        url: '/staff/index',
        method: 'get',
        data,
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
            url: `${process.env.VUE_APP_BASE_API}/oss/uploadImage`, // 仅为示例，非真实的接口地址
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
