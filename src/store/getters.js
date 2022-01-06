const getters = {
    staffId: state => state.user.userInfo.staff_id,
    token: state => state.user.userInfo.token,
    userInfo: state => state.user.userInfo,
}
export default getters