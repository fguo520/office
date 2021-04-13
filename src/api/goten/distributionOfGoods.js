import createAxios from '@/utils/axios'
const request = createAxios(process.env.GOTEN_API)

//获取列表
export function getGotenProductList(data) {
  return request({
    url: '/goten/product/getGotenProductList',
    method: 'post',
    data
  })
}
//获取分类
export function getCategoryList(data) {
  return request({
    url: '/goten/product/getCategoryList',
    method: 'post',
    data
  })
}
//批量加入分销库
export function batchUpdateDistribution(data) {
  return request({
    url: '/goten/product/batchUpdateDistribution',
    method: 'post',
    data
  })
}
//获取商品图片
export function getGotenImageList(params) {
  return request({
    url: '/goten/product/getGotenImageList',
    method: 'post',
    params
  })
}
//获取区域列表
export function getGotenWarehouseList() {
  return request({
    url: '/goten/product/getGotenWarehouseList',
    method: 'post',
  })
}