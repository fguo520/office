import createAxios from '@/utils/axios'
const request = createAxios(process.env.GOTEN_API)

//获取列表
export function getList(data) {
  return request({
    url: '/goten/product/getGotenDistributionProductList',
    method: 'post',
    data
  })
}
//获取报告
export function reportList(data) {
  return request({
    url: '/goten/product/getGotenExcelTaskList',
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
//生成报告
export function exportProductInfo(data) {
  return request({
    url: '/goten/product/exportProductInfo',
    method: 'post',
    data
  })
}
//生成报告
export function getGotenProductExcelUrl(params) {
  return request({
    url: '/goten/product/getGotenProductExcelUrl',
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


