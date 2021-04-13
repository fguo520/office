import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
// 创建axios实例
export default function createAxios(URL) {
  const service = axios.create({
    // process.env.BASE_API
    baseURL: URL || process.env.BASE_API, // api的base_url
  })

  // request拦截器
  service.interceptors.request.use(config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  }, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  })

  // respone拦截器
  service.interceptors.response.use(
    response => {
      /**
      * code为非200是抛错 可结合自己业务进行修改
      */
      const res = response.data
      if (res.code !== 200) {
        Message({
          message: res.message,
          type: 'error',
          duration: 3 * 1000
        })

        // 401:未登录;
        if (res.code === 401) {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
        return Promise.reject('error')
      } else {
        return response.data
      }
    },
    error => {
      console.log('err' + error)// for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject("系统错误")
    }
  )

  return service
}
