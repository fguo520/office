import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
export function fetchList() {
  return request({
    url: '/shApi/productClass/listAll',
    method: 'get'
  })
}
//更新
export function updateAll() {
  return request({
    url: '/shApi/productClass/manualUpdate',
    method: 'post'
  })
}
//日志
export function getProductClassLogList(params) {
  return request({
    url: "/shApi/productClass/getProductClassLogList",
    method: "post",
    data: params
  })
}