const getters = {
    token: state => state.user.userInfo.token,
    userInfo: state => state.user.userInfo,
    questionBankInfo: state => state.user.questionBankInfo,
    question_bank_id: state => state.user.questionBankInfo.question_bank_id,
}
export default getters