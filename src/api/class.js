import http from '@/utils/request'

// docs  http://showdoc.beiqujy.com/web/#/45

/**
 * 获取班级列表
 * @param {
 *      page: 1,
 *      course_id: number,
 *      category_id: '',
 *      project_id: "",
 *      keyword: string
 * } params 
 * @returns 
 */
export function getClassList(data) {
    return http.request({
        url: '/classroom/index',
        method: 'get',
        loading: true,
        data,
    })
}

/**
 * 编辑兼班级详情
 * @param {
 *  category_id: "",
 *  project_id: "",
 *  classroom_name: "",
 *  master_teacher_id: "",
 *  class_icon: "",
 *  course_id: "", 
 *  classroom_id: category_id
 * } data
 */
 export function editClassroom(data) {
    return http.request({
      url: '/classroom/edit',
      method: 'get',
      data,
    })
  }

/** 
 * 班级详情-班级学生
 * @param {
 *      class_id: this.$route.query?.id,
 *      page: this.pageNum,
 *      limit: this.pageSize,
*       search_box: "",
*       from_organization_id: [],
 * } params 
 * @returns 
 */
export function classroomUserList(data) {
    return http.request({
        url: '/classroom/classroomUserList',
        method: 'get',
        data
    })
}

/**
 * 学生转班
 * @param {
 *  new_classroom_id: '' 
 *  course_id: row.course_id,
 *  uid: [this.uid],
 *  course_students_id: [row.course_student_id],
 *  old_classroom_id: row.classroom_id || 0,
 * } data 
 * @returns 
 */
export function exchangestudents(data) {
    return http.request({
      url: '/classstudents/exchangestudents',
      method: 'post',
      showToast: true,
      data
    })
  }

/**
 * 学生批量转班
 * @param {*} data 
 * @returns 
 */
export function batchchangestudents(data) {
    return http.request({
        url: '/classstudents/batchchangestudents',
        method: 'post',
        showToast: true,
        data
    })
}

/**
 * 移除班级学生
 * @param {
 *  uid: '', 
 *  classroom_id:'',
 * } data 
 * @returns 
 */
export function classstudentsBatchRemove(data) {
    return http.request({
      url: '/classstudents/batchremove',
      method: 'post',
      showToast: true,
      data,
    })
  }

/**
 * 获取机构选项
 * 庸列表的话传 data = { list: true || false  }
 */
 export function getInstitutionSelectData() {
    return http.request({
      url: '/staff/getInstitutionSelectData',
      method: 'get',
    })
  }

/**
 * 班级直播列表
 * @param {
 *  page = ""
 *  live_class_name: "",
 *  cate_id: []
 * } params 
 * @returns 
 */
export function classLiveList(data) {
    return http.request({
        url: '/NewLive/classLiveList',
        method: 'get',
        data,
    })
}

/**
 * 班级直播 -直播场次列表
 * @param {
 *      id: 'live_class_id',
 *      page: 1,
 *      search_box: ''  // 搜索关键字
 * } params
 * @returns 
 */
export function liveSessionList(data) {
    return http.request({
      url: '/NewLive/liveList',
      method: 'get',
      data,
    })
  }

/**
 * 班级直播 -开始直播
 * @param { live_class_id: '' } data 
 * @returns 
 */
export function livestart(data) {
    return http.request({
        url: '/plwlive/livestart',
        method: 'post',
        showToast: true,
        data,
    })
}

/**
 * 班级直播 -关闭直播
 * @param {  live_class_id: '' } data 
 * @returns 
 */
export function closelive(data) {
  return http.request({
      url: '/live/closelive',
      method: 'post',
      showToast: true,
      data,
  })
}

/**
 * 班级详情-更换所属机构
 * @param { institution_id: string, uid_arr: [ uid, ...data]} data 
 * @returns 
 */
export function updateUserFromOrgId(data) {
  return http.request({
    url: '/classroom/updateUserFromOrgId',
    method: 'post',
    data,
  })
}