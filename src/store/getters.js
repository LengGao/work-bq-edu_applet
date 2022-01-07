import store from './index'
const getters = {
    staffId: state => state.user.userInfo.staff_id,
    token: state => state.user.userInfo.token,
    userInfo: state => state.user.userInfo,
    payStatusOptions: state => state.options.payStatusOptions,
    approveOptions: state => state.options.approveOptions,
    projectOptions: state => {
        if (!state.options.projectOptions.length) {
            store.dispatch('getProjectOptions')
        }
        return state.options.projectOptions
    },
    categoryOptions: state => {
        if (!state.options.categoryOptions.length) {
            store.dispatch('getCategoryOptions')
        }
        return state.options.categoryOptions
    },
    staffOptions: state => {
        if (!state.options.staffOptions.length) {
            store.dispatch('getStaffOptions')
        }
        return state.options.staffOptions
    }
}
export default getters