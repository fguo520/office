import createAxios from '@/utils/axios'
const request = createAxios(process.env.RTS_API)
export function categoryAttr(params) {
  return request({
    url: `/rts/category/attr/page`,
    method: 'get',
    params
  })
}
export function authList() {
  return request({
    url: `/rts/product/auth/list`,
    method: 'get'
  })
}
export function shippingList(params) {
  return request({
    url: `/rts/product/shipping/list`,
    method: 'get',
    params
  })
}
export function productGroupTree(params) {
  return request({
    url: `/rts/product/group/productGroupTree`,
    method: 'post',
    params
  })
}
export function skuDetail(params) {
  return request({
    url: `/rts/product/sku/detail`,
    method: 'get',
    params
  })
}
export function keyword(params) {
  return request({
    url: `/rts/product/keyword`,
    method: 'get',
    params
  })
}
//动态获取类目
export function categoryPage(param) {
  return request({
    url: `/rts/category/page`,
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 9999999,
      ...param
    }
  })
}
//获取整个类目
export function categoryList() {
  return request({
    url: `/rts/category/getRtsApiCategoryNode`,
    method: 'post',
  })
}
export function uploadImage(data) {
  return request({
    url: `/rts/photo/bank/upload`,
    method: 'post',
    data
  })
}
export function save(data) {
  return request({
    url: `/rts/product/save`,
    method: 'post',
    data
  })
}
//新增康登编辑回显
export function info(data) {
  return request({
    url: `/rts/product/info`,
    method: 'post',
    data
  })
}
//listing编辑回显
export function listingInfo(data) {
  return request({
    url: `/rts/listing/getInfo`,
    method: 'post',
    data
  })
}
//rts动态价格获取
export function calcPrice(data) {
  return request({
    url: `/rts/product/price`,
    method: 'post',
    data
  })
}
