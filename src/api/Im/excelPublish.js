import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

// 数据导出列表
export function list(data) {
  return request({
    url: '/newProduct/list',
    method: 'post',
    data
  })
}
export function getOrderSourceTypeName() {
  return request({
    url: '/newProduct/getOrderSourceTypeName',
    method: 'post',
  })
}
export function getPlatformChannelAuth(params) {
  return request({
    url: '/newProduct/getPlatformChannelAuth',
    method: 'post',
    params
  })
}
export function getPublishedTo(params) {
  return request({
    url: '/newProduct/getPublishedTo',
    method: 'post',
    params
  })
}
