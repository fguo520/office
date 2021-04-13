import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getList(data) {
  return request({
    url: '/productListing/searchProductListing',
    method: 'post',
    data
  })
}
export function getLoglist(params) {
  return request({
    url: '/productListing/searchProductListingLog',
    method: 'get',
    params
  })
}
//上架
export function batchUpperShelf(data) {
  return request({
    url: '/productListing/batchUpperShelf',
    method: 'post',
    data
  })
}
//下架
export function batchLowerShelf(data) {
  return request({
    url: '/productListing/batchLowerShelf',
    method: 'post',
    data
  })
}
//批量修改库存
export function updatePriceProductListing(data) {
  return request({
    url: '/productListing/updatePriceProductListing',
    method: 'post',
    data
  })
}
//删除

export function batchDeleteListing(data) {
  return request({
    url: '/productListing/batchDeleteListing',
    method: 'post',
    data
  })
}
// 根据ItemId查询Listing列表
export function getProductListingByItemIdList(data) {
  return request({
    url: '/productListing/getProductListingByItemIdList',
    method: 'post',
    data
  })
}
//变体

export function searchProductListingByItemId(params) {
  return request({
    url: '/productListing/searchProductListingByItemId',
    method: 'post',
    params
  })
}
//站定渠道
export function getRegionList() {
  return request({
    url: '/productListing/getRegionList',
    method: 'post',
  })
}
//导出
export function addLazadaPriceExcelExport(data) {
  return request({
    url: '/productListing/addLazadaPriceExcelExport',
    method: 'post',
    data
  })
}
// 获取店铺
export function getLmSysPlatformAuthList(data) {
  return request({
    url: '/product/getLmSysPlatformAuthList',
    method: 'post',
    data
  })
}

// 锁定库存同步/解除锁定库存同步\
export function setLazadaLock(data) {
  return request({
    url: '/productListing/setLazadaLock',
    method: 'post',
    data
  })
}