import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)

//列表
export function getWalmartTaskList(data) {
  return request({
    url: '/walmart/queue/getWalmartTaskList',
    method: 'post',
    data
  })
}
// 获取刊登人
export function getUmsAdminList() {
  return request({
    url: '/walmart/product/getUmsAdminList',
    method: 'post',
  })
}