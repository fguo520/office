import createAxios from '@/utils/axios'
const request = createAxios(process.env.SELECT_API)

// 列表
export function list(data) {
  return request({
    url: "/selection/productManage/list",
    method: 'post',
    data
  })
}
export function getPlatforms() {
  return request({
    url: "/selection/storeLink/getPlatforms",
    method: 'get',
  })
}
export function getCheckResult(data) {
  return request({
    url: "/selection/productManage/getCheckResult",
    method: 'post',
    data
  })
}
export function batchJoinProLib(data) {
  return request({
    url: "/selection/productManage/batchJoinProLib",
    method: 'post',
    data
  })
}
export function batchDeleteProduct(data) {
  return request({
    url: "/selection/productManage/batchDeleteProduct",
    method: 'post',
    data
  })
}
export function imageSearch(data) {
  return request({
    url: '/selection/imageSearch/getCheckResult',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}