export default {
  state: {
    editNoticeInfo: ''
  },
  mutations: {
    setNoticeInfo: (state, row) => {
      state.editNoticeInfo = row
    }
  }
}