const mixin = {
  computed: {
    rolePermission() {
      return this.$store.state.user.rolePermission
    }
  },
  methods: {
    // 判断权限
    rolePermissionJudge(role) {
      // const routePath = this.$route.path+'/'
      // const roleVal = routePath+role
      // console.log(roleVal)
      let flag = false
      this.rolePermission.forEach(item => {
        if (item.uri === role) {
          flag = true
        }
      })
      return flag
    }
  }

}
export default mixin
