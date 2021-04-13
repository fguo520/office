import createAxios from '@/utils/axios'
const request = createAxios(process.env.SHOPPE_API)

// 获取sku产品信息
export function getLmShApiProductInfoList(data) {
  return request({
    url: "/shopee/product/getLmShApiProductInfoList",
    method: 'post',
    data
  })
}


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

// 获取物流方式
export function getShopeeLogistics(data) {
  return request({
    url: "/shopee/product/getShopeeLogistics",
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


// 获取属性
export function getShopeeCategoryAttributes(data) {
  return request({
    url: "/shopee/category/getShopeeCategoryAttributes",
    method: 'post',
    data
  })
}

// 计算价格
export function getShopeeProductPrice(data) {
  return request({
    url: "/shopee/product/getShopeeProductPrice",
    method: 'post',
    data
  })
}

// 上传图片
export function uploadImage(data) {
  return request({
    url: "/shopee/product/uploadImage",
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

// 刊登产品
export function saveShopeeProduct(data) {
  return request({
    url: "/shopee/product/saveShopeeProduct",
    method: 'post',
    data
  })
}

// 修改回显信息
export function getShopeeProductGetUpdate(data) {
  return request({
    url: "/shopee/product/getShopeeProductGetUpdate",
    method: 'post',
    data
  })
}

// 获取sku产品图片信息
export function getLmShApiProductImageList(data) {
  return request({
    url: "/shopee/product/getLmShApiProductImageList",
    method: 'post',
    data
  })
}