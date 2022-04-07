import http from '@/utils/request'
import store from '@/store'

// crm客户列表
export function getCrmCustomerList(data) {
    return http.request({
        url: '/CrmCustomer/index',
        method: 'post',
        data
    })
}
// crm获取自定义字段的选项
export function getCustomfieldOptions(data) {
    return http.request({
        url: '/Customfield/getInfo',
        method: 'get',
        data
    })
}
// crm添加客户
export function createCrmCustomer(data) {
    return http.request({
        url: '/CrmCustomer/create',
        method: 'post',
        showToast: true,
        data
    })
}

// 报名时选择项目
export function getCateProjectOption(data) {
    return http.request({
        url: '/project/cate_project',
        method: 'get',
        data,
    })
}
// 获取届别下拉选项
export function getGradeOptions(data) {
    return http.request({
        url: '/Crm/jieBieXiaLaLieBiao',
        method: 'get',
        data,
    })
}
// 获取届别下拉项目 新
export function categoryGetSessionList(data) {
    return http.request({
        url: '/Crm/categoryGetSessionList',
        method: 'get',
        data,
    })
}
// 报名时选择项目-查询已选项目的详情
export function getCateProjectDetail(data) {
    return http.request({
        url: '/project/mult_detail',
        method: 'post',
        data,
    })
}
// 院校专业列表
export function getUniversityMajorDetailList(data) {
    return http.request({
        url: '/UniversityMajorDetail/page',
        method: 'get',
        loading: true,
        data,
    })
}
// crm报名 
export function createCrmOrder(data) {
    return http.request({
        url: '/CustomerOrder/create',
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
    return http.request({
        url: '/CrmOrder/projectUser',
        method: 'post',
        data
    })
}
// 用户中心列表
export function studentUsers(data) {
    return http.request({
        url: '/StudentUsers/index',
        method: 'get',
        data
    })
}
// 启用/金庸用户 1 为启用状态 0 为禁用状态
export function studentUsersClear(data) {
    return http.request({
        url: '/StudentUsers/clear',
        method: 'post',
        showToast: true,
        loading: true,
        data
    })
}
// 一键开课
export function eduOpenCourse(data) {
    return http.request({
        url: '/CrmOrder/eduOpenCourse',
        method: 'get',
        data
    })
}
// 获取客户标签
export function getCrmTags(data) {
    return http.request({
        url: '/CrmTags/index',
        method: 'get',
        data
    })
}
// 获取招生公海客户列表
export function getCrmList(data) {
    return http.request({
        url: '/HighSeas/getCrmList',
        method: 'get',
        data
    })
}
// 获取机构公海客户列表
export function getOrgAppletList(data) {
    return http.request({
        url: '/HighSeas/orgApplet',
        method: 'get',
        data
    })
}
// 获取东培公海客户列表
export function getDpAppletList(data) {
    return http.request({
        url: '/HighSeas/dpApplet',
        method: 'get',
        data
    })
}

// 领取公海客户
export function receiveHighSeas(data) {
    return http.request({
        url: '/HighSeas/receive',
        method: 'post',
        showToast: true,
        loading: true,
        data
    })
}
// 客户基本信息
export function getUserInfo(data) {
    return http.request({
        url: '/UserArchives/detail',
        method: 'get',
        data
    })
}
/**
 * 客户证件资料
 * @param {uid: number} data 
 * @returns 
 */
export function getCertificateInfo(data) {
    return http.request({
        url: '/userArchives/getCertificateInfo',
        method: 'get',
        data
    })
}
/**
 * 客户证件资料 相关资料
 * @param {uid: number, page: 1, search_box: string} data 
 * @returns 
 */
export function getUserFileList(data) {
    return http.request({
        url: '/User/getUserFileList',
        method: 'get',
        data
    })
}
/**
 * 客户证件资料 其他资料上传
 * @param {file_name: string, uid: number, file: (binary)} data 
 * @returns 
 */
 export function createFile(file) {
    // console.log("formData", file);
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: `${process.env.VUE_APP_BASE_API}/User/createFile`,
            filePath: file.url,
            name: `${file.file_name}`,
            formData: {},
            success: (res) => {
                const data = JSON.parse(res.data)
                resolve(data.data.data)
            },
            fail: reject
        });
    })
}
/**
 * 
 * @param {*} data 
 * @returns 
 */
 export function modifyCertificate(data) {
    return http.request({
        url: '/userArchives/modifyCertificate',
        method: 'post',
        loading: true,
        data
    })
}
/**
 * 客户证件资料 线管资料修改
 * @param {file_name: string, id: number, file ?: (binary) } data 
 * @returns 
 */
export function updateFileName(data) {
    return http.request({
        url: '/User/updateFile',
        method: 'post',
        loading: true,
        data
    })
}
/**
 * 客户证件资料 线管资料删除
 * @param {id: number} data 
 * @returns 
 */
export function deleteFile(data) {
    return http.request({
        url: '/User/deleteFile',
        method: 'post',
        showToast:true,
        loading: true,
        data
    })
}
// 客户订单记录
export function getOrderRecond(data) {
    return http.request({
        url: '/CrmOrder/index',
        method: 'post',
        loading: true,
        data
    })
}
// 报读班级
export function getStudendclass(data) {
    return http.request({
        url: '/classstudents/getstudendclass',
        method: 'get',
        loading: true,
        data
    })
}
// 报读项目
export function getUserProject(data) {
    return http.request({
        url: '/classstudents/getuserproject',
        method: 'get',
        loading: true,
        data
    })
}
// 学生课程
export function getUserCourseList(data) {
    return http.request({
        url: '/Crm/userCourseList',
        method: 'get',
        loading: true,
        data
    })
}
// 客户学习进度
export function getStudyProgress(data) {
    return http.request({
        url: '/CourseVideo/userCourseVideoStatisticsList',
        method: 'get',
        loading: true,
        data
    })
}
// 修改用户信息
export function modifyUserInfo(data) {
    return http.request({
        url: '/UserArchives/modify',
        method: 'post',
        showToast: true,
        data
    })
}
// 获取题库进度
export function getBuyQuestionBank(data) {
    return http.request({
        url: '/questionBank/getBuyQuestionBank',
        method: 'get',
        loading: true,
        data
    })
}

// 修改所属机构
export function updateUserFromOrgId(data) {
    return http.request({
        url: '/classroom/updateUserFromOrgId',
        method: 'post',
        showToast: true,
        data
    })
}
// 更换所属老师 
export function changeStaffId(data) {
    return http.request({
        url: '/CrmCustomer/changeStaffId',
        method: 'post',
        showToast: true,
        data,
    })
}