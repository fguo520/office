import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getList(data) {
  return request({
    url: '/shApi/listing/page',
    method: 'post',
    data
  })
}
export function getType(params) {
  return request({
    url: '/shApi/listing/platform/info',
    method: 'get',
    params
  })
}
export function getPropertyType(params) {
  return request({
    url: '/shApi/listing/product/property',
    method: 'get',
    params
  })
}
export function getTableDetail(params) {
  return request({
    url: '/shApi/listing/online/table',
    method: 'get',
    params
  })
}
export function getTableDetailOrder(params) {
  return request({
    url: '/shApi/listing/online/order/table',
    method: 'get',
    params
  })
}
export function getTableDetailIncomes(params) {
  return request({
    url: '/shApi/listing/online/incomes/table',
    method: 'get',
    params
  })
}
export function getTableDetailOrderrate(params) {
  return request({
    url: '/shApi/listing/online/order/rate/table',
    method: 'get',
    params
  })
}
export function detail(params) {
  return request({
    url: '/shApi/listing/item/detail',
    method: 'get',
    params
  })
}
export function getSysParameterCodeList() {
  return request({
    url: '/sysBase/getSysParameterCodeList?isTopClass=0&parameterName=&parameterSearchType=赛盒产品状态',
    method: 'get',
  })
}
//导出报表
export function exportReport(data) {
  return request({
    url: '/shApi/listing/export/task/add',
    method: 'post',
    data
  })
}
