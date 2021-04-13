import createAxios from '@/utils/axios'
const request = createAxios(process.env.AMAZON_API)


// Listing列表
export function getlist(data) {
  return request({
    url: "/amazon/amazonListing/getLmAmazonListingList",
    method: 'post',
    data
  })
}

// Listing渠道
export function getLmAmazonAuthNode() {
  return request({
    url: "/amazon/amazonListing/getLmAmazonAuthNode",
    method: 'post',
  })
}


// 批量上架
export function batchUpperShelf(data) {
  return request({
    url: "/amazon/amazonListing/batchUpperShelf",
    method: 'post',
    data
  })
}

// 批量下架
export function batchLowerShelf(data) {
  return request({
    url: "/amazon/amazonListing/batchLowerShelf",
    method: 'post',
    data
  })
}

// 批量修改价格
export function batchEditListingPrice(data) {
  return request({
    url: "/amazon/amazonListing/batchEditListingPrice",
    method: 'post',
    data
  })
}

// 批量修改库存
export function batchEditListingStock(data) {
  return request({
    url: "/amazon/amazonListing/batchEditListingStock",
    method: 'post',
    data
  })
}

// 批量删除
export function batchDeleteProduct(data) {
  return request({
    url: "/amazon/amazonListing/batchDeleteProduct",
    method: 'post',
    data
  })
}

// 上传图片
export function uploadImage(data) {
  return request({
    url: "/amazon/amazonListing/uploadImage",
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 修改图片
export function updateListingImage(data) {
  return request({
    url: "/amazon/amazonListing/updateListingImage",
    method: 'post',
    data
  })
}


// 根据sku获取图片
export function getLmProductImage(data) {
  return request({
    url: "/amazon/amazonListing/getLmProductImage",
    method: 'post',
    data
  })
}

// Listing日志列表
export function getAmazonListingLogList(params) {
  return request({
    url: "/amazon/amazonListing/getAmazonListingLogList",
    method: 'get',
    params
  })
}

const request2 = createAxios(process.env.BASE_API)

// 获取在线listing的侵权风险类型
export function shApiProperty() {
  return request2({
    url: "/shApi/listing/product/property",
    method: 'get',
  })
}