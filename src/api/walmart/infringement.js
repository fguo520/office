import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)

export function getWalmartTortList(params) {
  return request({
    url: '/walmart/tort/getWalmartTortList',
    method: 'get',
    params
  })
}
export function getWalmartTortTypeList() {
  return request({
    url: '/walmart/tort/getWalmartTortTypeList',
    method: 'get',
  })
}
export function importWalmartTort(data) {
  return request({
    url: '/walmart/tort/importWalmartTort',
    method: 'post',
    data
  })
}