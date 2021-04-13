import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)

//列表
export function getLmWalmartProductList(data) {
  return request({
    url: '/walmart/product/update/getLmWalmartProductList',
    method: 'post',
    data
  })
}
// 日志
export function getWalmartProductLog(params) {
  return request({
    url: '/walmart/product/update/getWalmartProductLog',
    method: 'get',
    params
  })
}

// 刊登变体查询列表
export function getLmWalmartProductById(params) {
  return request({
    url: '/walmart/product/update/getLmWalmartProductById',
    method: 'post',
    params
  })
}
//分类
export function getWalmartApiCategoryList() {
  return request({
    url: '/walmart/category/getWalmartApiCategoryList',
    method: 'post',
  })
}
// 获取店铺信息
export function getLmSysPlatformAuthList() {
  return request({
    url: '/walmart/product/getLmSysPlatformAuthList',
    method: 'post',
  })
}
// 获取刊登人
export function getUmsAdminList() {
  return request({
    url: '/walmart/product/getUmsAdminList',
    method: 'post',
  })
}