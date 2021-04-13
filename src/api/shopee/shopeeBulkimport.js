import createAxios from '@/utils/axios'
const request = createAxios(process.env.SHOPPE_API)

// 获取渠道信息
export function getShopeePlatformAuthList(params) {
  return request({
    url: "/shopee/product/getShopeePlatformAuthList",
    method: 'post',
    params
  })
}
// 类目Tree
export function getShopeeApiCategoryNode(data) {
  return request({
    url: "/shopee/category/getShopeeApiCategoryNode",
    method: 'post',
    data
  })
}

// 获取水印模板
export function getShopeeWatermarkTemplate() {
  return request({
    url: "/shopee/product/getShopeeWatermarkTemplate",
    method: 'post',
  })
}
// 获取物流方式
export function getShopeeLogistics(data) {
  return request({
    url: "/shopee/product/getShopeeLogistics",
    method: 'post',
    data
  })
}
// 获取属性
export function getShopeeCategoryAttributes(data) {
  return request({
    url: "/shopee/category/getShopeeCategoryAttributes",
    method: 'post',
    data
  })
}
// 获取品牌
export function getWalmartBrandList(data) {
  return request({
    url: "/shopee/product/getWalmartBrandList",
    method: 'post',
    data
  })
}

// 导入刊登
export function importShopeeProduct(data) {
  return request({
    url: "/shopee/product/importShopeeProduct",
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}