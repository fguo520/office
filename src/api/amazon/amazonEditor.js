
import createAxios from '@/utils/axios'
const request = createAxios(process.env.AMAZON_API)

// 根据渠道账号id获取分类
export function getCategorylist(params) {
  return request({
    url: `/amazon/product/category/list`,
    method: 'get',
    params
  })
}

// 根据sku获取sku单体或变体信息
export function getSkuinfo(params) {
  return request({
    url: `/amazon/product/sku/info`,
    method: 'get',
    params
  })
}

// 获取渠道账号
export function getAuthorlist(params) {
  return request({
    url: `/amazon/product/author/list`,
    method: 'get',
    params
  })
}

// 根据末级类目id获取属性
export function attribute(params) {
  return request({
    url: `/amazon/product/attribute/info`,
    method: 'get',
    params
  })
}

// 产品图片上传
export function uploadImage(data) {
  return request({
    url: "/amazon/product/image/upload",
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 根据渠道账号id获取品牌
export function getBrand(params) {
  return request({
    url: `/amazon/product/brand/list`,
    method: 'get',
    params
  })
}


// 重新获取UPC
export function refreshUpc(params) {
  return request({
    url: `/amazon/product/refreshUpc`,
    method: 'get',
    params
  })
}

// 重新获取渠道sku
export function refreshSellerSku(params) {
  return request({
    url: `/amazon/product/refreshSellerSku`,
    method: 'get',
    params
  })
}
//
// 保存亚马逊刊登商品数据
export function save(data) {
  return request({
    url: `/amazon/product/save`,
    method: 'post',
    data
  })
}


// 亚马逊刊登回显详情
export function detail(params) {
  return request({
    url: `/amazon/product/detail`,
    method: 'post',
    params
  })
}


// 编辑Listing
export function batchEditListingTitle(data) {
  return request({
    url: `/amazon/amazonListing/batchEditListingTitle`,
    method: 'post',
    data
  })
}