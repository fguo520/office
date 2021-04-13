import createAxios from '@/utils/axios'
const request = createAxios(process.env.SHOPPE_API)

export function page(data) {
  return request({
    url: "/shopee/task/page",
    method: 'post',
    data
  })
}
export function operator() {
  return request({
    url: "/shopee/task/operator",
    method: 'get',
  })
}
export function type() {
  return request({
    url: "/shopee/task/type",
    method: 'get',
  })
}