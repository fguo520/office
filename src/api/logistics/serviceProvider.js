import createAxios from '@/utils/axios'
const request = createAxios(process.env.LOGISTICS_API)

// 获取列表
export function getLogisticsServiceList(data) {
  return request({
    url: 'lemonLogistics/service/getLogisticsServiceList',
    method: 'post',
    data
  })
}
// 获取产品物流属性
export function getDropDown() {
  return request({
    url: 'lemonLogistics/service/getDropDown',
    method: 'get',
  })
}
// 获取负责人下拉列表
export function getUmsAdminListByUserId() {
  return request({
    url: 'lemonLogistics/service/getUmsAdminListByUserId',
    method: 'get',
  })
}
// 保存服务商
export function saveLogisticsService(data) {
  return request({
    url: 'lemonLogistics/service/saveLogisticsService',
    method: 'post',
    data
  })
}
// 启用/停用服务商
export function updateLogisticsServiceStatus(params) {
  return request({
    url: 'lemonLogistics/service/updateLogisticsServiceStatus',
    method: 'post',
    params
  })
}
// 获取产品物流属性
export function getWithBatterys() {
  return request({
    url: 'lemonLogistics/service/getWithBatterys',
    method: 'get',
  })
}
// 新增/修改运输方式
export function saveLogisticsTransport(data) {
  return request({
    url: 'lemonLogistics/service/saveLogisticsServiceTransportation',
    method: 'post',
    data
  })
}
// 启用/停用服务商运输方式
export function updateLogisticsService(params) {
  return request({
    url: 'lemonLogistics/service/updateLogisticsServiceTransportationStatus',
    method: 'post',
    params
  })
}
// 根据运输方式id获取运输方式详细信息
export function getLogisticsTransport(params) {
  return request({
    url: 'lemonLogistics/service/getLogisticsTransportationById',
    method: 'get',
    params
  })
}
// 根据运输方式id获取运输方式详细信息
export function searchLogisticsLogPage(params) {
  return request({
    url: '/lemonLogistics/node/searchLogisticsLogPage',
    method: 'get',
    params
  })
}