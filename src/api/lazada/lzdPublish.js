import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
//列表
export function searchProductList(data) {
  return request({
    url: '/product/searchProductList',
    method: 'post',
    data
  })
}
//日志
export function getLazadaProductLog(params) {
  return request({
    url: '/product/getLazadaProductLog',
    method: 'get',
    params
  })
}
//刊登人
export function getUmsAdminList() {
  return request({
    url: '/product/getUmsAdminList',
    method: 'post',
  })
}

//批量刊登
export function saveProductInfoAddList(data) {
  return request({
    url: '/product/saveProductInfoAddList',
    method: 'post',
    data
  })
}
//批量删除
export function deleteLazadaProduct(data) {
  return request({
    url: '/product/deleteLazadaProduct',
    method: 'post',
    data
  })
}
//批量刊登成功
export function updateLazadaProductStatus(data) {
  return request({
    url: '/product/updateLazadaProductStatus',
    method: 'post',
    data
  })
}
//站点详情
export function getLmLazadaApiProductUpdate(data) {
  return request({
    url: '/product/getLmLazadaApiProductUpdate',
    method: 'post',
    data
  })
}
//批量复制刊登
export function copyProductInfo(data) {
  return request({
    url: '/product/copyProductInfo',
    method: 'post',
    data
  })
}
//获取店铺
export function getLmSysPlatformAuthList(data) {
  return request({
    url: '/product/getLmSysPlatformAuthList',
    method: 'post',
    data
  })
}

