import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)

//列表
export function getLmWalmartProductList(data) {
  return request({
    url: '/walmart/product/getLmWalmartProductList',
    method: 'post',
    data
  })
}
//分类
export function getWalmartApiCategoryList() {
  return request({
    url: '/walmart/category/getWalmartApiCategoryList',
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

// 获取店铺信息
export function getLmSysPlatformAuthList() {
  return request({
    url: '/walmart/product/getLmSysPlatformAuthList',
    method: 'post',
  })
}


// 批量刊登
export function saveWalmartProductAdd(data) {
  return request({
    url: '/walmart/product/saveWalmartProductAdd',
    method: 'post',
    data
  })
}


// 批量删除
export function deleteWalmartProduct(data) {
  return request({
    url: '/walmart/product/deleteWalmartProduct',
    method: 'post',
    data
  })
}
// 日志
export function getWalmartProductLog(params) {
  return request({
    url: '/walmart/product/getWalmartProductLog',
    method: 'get',
    params
  })
}


// 刊登变体查询列表
export function getLmWalmartProductById(params) {
  return request({
    url: '/walmart/product/getLmWalmartProductById',
    method: 'post',
    params
  })
}

// 批量刊登不同店铺
export function copyProductInfo(data) {
  return request({
    url: '/walmart/product/copyProductInfo',
    method: 'post',
    data
  })
}




