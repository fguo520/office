import createAxios from '@/utils/axios'
const request = createAxios(process.env.RTS_API)


// 获取列表
export function list(data) {
  return request({
    url: "/rts/task/list",
    method: 'post',
    data
  })
}
export function getTaskTypes() {
  return request({
    url: "/rts/task/getTaskTypes",
    method: 'get',
  })
}
export function getCreateUsers() {
  return request({
    url: "/rts/task/getCreateUsers",
    method: 'get',
  })
}