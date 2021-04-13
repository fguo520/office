import createAxios from '@/utils/axios'
const request = createAxios(process.env.LOGISTICS_API)

// 获取列表
export function page(data) {
  return request({
    url: '/lemonLogistics/reportingRules/page',
    method: 'post',
    data
  })
}
// 服务商,运输方式下拉列表
export function getServiceProvider() {
  return request({
    url: '/lemonLogistics/reportingRules/getServiceProvider',
    method: 'post',
  })
}
// 币种下拉列表
export function getCurrency() {
  return request({
    url: '/lemonLogistics/reportingRules/getCurrency',
    method: 'post',
  })
}
// 获取国家下拉
export function getCountry() {
  return request({
    url: '/lemonLogistics/reportingRules/getCountry',
    method: 'post',
  })
}
// 新增/编辑申报规则
export function insert(data) {
  return request({
    url: '/lemonLogistics/reportingRules/insert',
    method: 'post',
    data
  })
}
// 新增/编辑申报规则
export function updateStatus(data) {
  return request({
    url: '/lemonLogistics/reportingRules/updateStatus',
    method: 'post',
    data
  })
}
// 校验申报名称是否存在
export function checkRuleName(params) {
  return request({
    url: '/lemonLogistics/reportingRules/getRuleName',
    method: 'post',
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