import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)

export function getList(data) {
  return request({
    url: '/walmart/listing/page',
    method: 'post',
    data
  })
}
export function operate(requestType, data) {
  return request({
    url: `/walmart/listing/operate/${requestType}`,
    method: 'post',
    data
  })
}
export function log(params) {
  return request({
    url: `/walmart/listing/operate/log`,
    method: 'get',
    params
  })
}
// 获取店铺信息
export function getLmSysPlatformAuthList() {
  return request({
    url: '/walmart/product/getLmSysPlatformAuthList',
    method: 'post',
  })
}
//获取类目
export function getWalmartApiCategoryList() {
  return request({
    url: '/walmart/category/getWalmartApiCategoryList',
    method: 'post',
  })
}