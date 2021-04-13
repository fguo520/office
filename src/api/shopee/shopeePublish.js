
import createAxios from '@/utils/axios'
const request = createAxios(process.env.SHOPPE_API)

// 刊登列表
export function getShopeeProductList(data) {
  return request({
    url: "/shopee/product/getShopeeProductList",
    method: 'post',
    data
  })
}

// 获取渠道信息
export function getShopeePlatformAuthList() {
  return request({
    url: "/shopee/product/getShopeePlatformAuthList",
    method: 'post',
  })
}


// 获取刊登人
export function getUmsAdminList(type, name) {
  return request({
    url: `/shopee/product/getUmsAdminList?type=${type}&name=${name}`,
    method: 'post'
  })
}

// 刊登变体查询列表
export function getShopeeProductById(params) {
  return request({
    url: "/shopee/product/getShopeeProductById",
    method: 'post',
    params
  })
}
// 刊登日志列表
export function getShopeeProductLog(params) {
  return request({
    url: "/shopee/product/getShopeeProductLog",
    method: 'post',
    params
  })
}

// 复制刊登
export function copyShopeeProduct(data) {
  return request({
    url: "/shopee/product/copyShopeeProduct",
    method: 'post',
    data
  })
}

// 批量删除
export function deleteShopeeProduct(data) {
  return request({
    url: "/shopee/product/deleteShopeeProduct",
    method: 'post',
    data
  })
}

// 批量刊登
export function saveShopeeProductAdd(data) {
  return request({
    url: "/shopee/product/saveShopeeProductAdd",
    method: 'post',
    data
  })
}

// 获取水印
export function getShopeeWatermarkTemplate(data) {
  return request({
    url: "/shopee/product/getShopeeWatermarkTemplate",
    method: 'post',
    data
  })
}

// 复制刊登渠道信息
export function getCopyShopeePlatformAuthList(data) {
  return request({
    url: "/shopee/product/getCopyShopeePlatformAuthList",
    method: 'post',
    data
  })
}

