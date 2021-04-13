import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from "@/router"
import { encrypt, decrypt } from "@/utils/rsaEncrypt";

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    rolePermission: [],
    diffTime: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TIME: (state, diffTime) => {
      state.diffTime = diffTime
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLEPERMISSION: (state, rolePermission) => {
      state.rolePermission = rolePermission
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = encrypt(userInfo.password)//密码加密
      return new Promise((resolve, reject) => {
        login(username, password).then(response => {
          const data = response.data
          if (data.effectiveTime !== "") {

            let date1 = new Date(data.effectiveTime)
            let date2 = new Date();
            const diff = date1.getTime() - date2.getTime(); //目标时间减去当前时间
            const diffDate = diff / (24 * 60 * 60 * 1000);  //计算当前时间与结束时间之间相差天数
            let diffTime = {
              time: data.effectiveTime,
              diffDate: diffDate
            };
            commit('SET_TIME', diffTime)
          }
          const tokenStr = data.tokenHead + data.token
          setToken(tokenStr)
          commit('SET_TOKEN', tokenStr)
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_ROLEPERMISSION', data.rolePermission)
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
