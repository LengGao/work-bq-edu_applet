import store from './index'
const getters = {
    staffId: state => state.user.userInfo.staff_id,
    token: state => state.user.userInfo.token,
    userInfo: state => state.user.userInfo,
    checkedStaffIds: state => state.user.checkedStaffIds,
    checkedStaffData: state => state.user.checkedStaffData,
    payStatusOptions: state => state.options.payStatusOptions,
    approveOptions: state => state.options.approveOptions,
    eduOptions: state => state.options.eduOptions,
    projectOptions: state => {
        if (!state.options.projectOptions) {
            store.dispatch('getProjectOptions')
        }
        return state.options.projectOptions || []
    },
    categoryOptions: state => {
        if (!state.options.categoryOptions) {
            store.dispatch('getCategoryOptions')
        }
        return state.options.categoryOptions || []
    },
    staffOptions: state => {
        if (!state.options.staffOptions) {
            store.dispatch('getStaffOptions')
        }
        return state.options.staffOptions || []
    },
    fromOptions: state => {
        if (!state.options.fromOptions) {
            store.dispatch('getFromOptions')
        }
        return state.options.fromOptions || []
    },
    tagOptions: state => {
        if (!state.options.tagOptions) {
            store.dispatch('getCrmTags')
        }
        return state.options.tagOptions || []
    },
    payTypeOptions: state => {
        if (!state.options.payTypeOptions) {
            store.dispatch('getPayTypeOptions')
        }
        return state.options.payTypeOptions || []
    },
    orgOptions: state => {
        if (!state.options.orgOptions) {
            store.dispatch('getOrganizationOptions')
        }
        return state.options.orgOptions || []
    },
    gradeOptions: state => {
        if (!state.options.gradeOptions) {
            store.dispatch('getGradeOptions')
        }
        return state.options.gradeOptions || []
    },
    expenseType: (state) => {
        if (!state.options.expenseType) {
            store.dispatch('getPlanTypeList')
        }
        return state.options.expenseType || {}
    },
}
export default getters