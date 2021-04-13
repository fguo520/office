import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getCategoryAttributes(data) {
  return request({
    url: '/category/getCategoryAttributes',
    method: 'post',
    data
  })
}
export function getCategoryNodeTree(data) {
  return request({
    url: '/category/getCategoryNodeTree',
    method: 'post',
    data
  })
}
export function getLmShApiProductInfoList(data) {
  return request({
    url: '/product/getLmShApiProductInfoList',
    method: 'post',
    data
  })
}
export function getLmSysPlatformAuthList(data) {
  return request({
    url: '/product/getLmSysPlatformAuthList',
    method: 'post',
    data
  })
}
export function saveProductInfo(data) {
  return request({
    url: '/product/saveProductInfo',
    method: 'post',
    data
  })
}
export function uploadImage(data) {
  return request({
    url: '/product/uploadImage',
    method: 'post',
    data
  })
}
export function getLmExchangeRatePrice(data) {
  return request({
    url: '/product/getLmExchangeRatePrice',
    method: 'post',
    data
  })
}
export function getLmLazadaApiProductDetailNum(data) {
  return request({
    url: '/product/getLmLazadaApiProductDetailNum',
    method: 'post',
    data
  })
}
//刊登编辑回显
export function getLmLazadaApiProductUpdate(data) {
  return request({
    url: '/product/getLmLazadaApiProductUpdate',
    method: 'post',
    data
  })
}
//listing列表回显
export function getProductListingUpdate(params) {
  return request({
    url: '/productListing/getProductListingUpdate',
    method: 'post',
    params
  })
}
//listing列表修改
export function listsaveProductInfo(data) {
  return request({
    url: '/productListing/saveProductInfo',
    method: 'post',
    data
  })
}
//sku是否刊登
export function getSellerSkuIsExist(data) {
  return request({
    url: '/product/getSellerSkuIsExist',
    method: 'post',
    data
  })
}
//推荐类目
export function getCategoryRecommend(params) {
  return request({
    url: '/category/getCategoryRecommend',
    method: 'get',
    params
  })
}

//复制刊登页面查询
export function getCopyLazadaProductDetails(params) {
  return request({
    url: '/product/getCopyLazadaProductDetails',
    method: 'get',
    params
  })
}