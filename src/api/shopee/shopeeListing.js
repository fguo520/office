import createAxios from '@/utils/axios'
const request = createAxios(process.env.SHOPPE_API)
const requestBase = createAxios(process.env.BASE_API)

// shopee-Listing列表
export function searchShopeeListing(data) {
  return request({
    url: "/shopee/listing/searchShopeeListing",
    method: 'post',
    data
  })
}
// shopee-Listing日志列表
export function searchShopeeListingLog(params) {
  return request({
    url: "/shopee/listing/searchShopeeListingLog",
    method: 'get',
    params
  })
}

// shopee-Listing变体列表
export function searchShopeeListingVariations(params) {
  return request({
    url: "/shopee/listing/searchShopeeListingVariations",
    method: 'get',
    params
  })
}


// 根据uuid查询shopee-listing
export function queryShopeeListingByuuid(type, data) {
  return request({
    url: `/shopee/listing/queryShopeeListingByuuid/${type}`,
    method: 'post',
    data
  })
}
// 批量修改价格
export function batchListingPrice(data) {
  return request({
    url: "/shopee/listing/batchListingPrice",
    method: 'post',
    data
  })
}


// 批量修改库存
export function batchListingStock(data) {
  return request({
    url: "/shopee/listing/batchListingStock",
    method: 'post',
    data
  })
}

// 批量删除
export function batchDeleteListing(data) {
  return request({
    url: "/shopee/listing/batchDeleteListing",
    method: 'post',
    data
  })
}
// 批量下架
export function batchLowerShelfListing(data) {
  return request({
    url: "/shopee/listing/batchLowerShelfListing",
    method: 'post',
    data
  })
}
// 批量上架
export function batchUpperShelfListing(data) {
  return request({
    url: "/shopee/listing/batchUpperShelfListing",
    method: 'post',
    data
  })
}

// 添加导出成本价任务
export function addShopeePriceExcelExport(data) {
  return request({
    url: "/shopee/listing/addShopeePriceExcelExport",
    method: 'post',
    data
  })
}


// 查询ShopeeListing图片
export function queryShopeeListingImgUrl(params) {
  return request({
    url: "/shopee/listing/queryShopeeListingImgUrl",
    method: 'get',
    params
  })
}

// 批量查询出货天数
export function queryDaysToShipListing(data) {
  return request({
    url: "/shopee/listing/queryDaysToShipListing",
    method: 'post',
    data
  })
}

// 批量修改出货天数
export function batchDaysToShipListing(data) {
  return request({
    url: "/shopee/listing/batchDaysToShipListing",
    method: 'post',
    data
  })
}

// 添加修改shopee-listing图片任务
export function editShopeeListingImgUrl(data) {
  return request({
    url: "/shopee/listing/editShopeeListingImgUrl",
    method: 'post',
    data
  })
}

// 编辑Listing回显
export function getShopeeListingGetUpdate(data) {
  return request({
    url: "/shopee/listing/getShopeeListingGetUpdate",
    method: 'post',
    data
  })
}

// 保存编辑Listing
export function updateShopeeListing(data) {
  return request({
    url: "/shopee/listing/updateShopeeListing",
    method: 'post',
    data
  })
}


// 导入渠道sku
export function importChannelSku(data) {
  return request({
    url: "/shopee/listing/importChannelSku",
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function getLmSysPlatformAuthList(params) {
  return requestBase({
    url: '/product/getLmSysPlatformAuthList',
    method: 'post',
    params
  })
}
