import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

//分页
export function orderSourceList(data) {
  return request({
    url: "/shApi/orderSource/list",
    method: "post",
    data
  })
}
//更新
export function orderSourcemanualUpdate() {
  return request({
    url: "/shApi/orderSource/manualUpdate",
    method: "post"
  })
}
//日志
export function getOrderSourceLogList(params) {
  return request({
    url: "/shApi/orderSource/getOrderSourceLogList",
    method: "post",
    data: params
  })
}
//销售人员和客服select
export function getSearchType(params) {
  return request({
    url: '/shApi/orderSource/getSearchType',
    method: 'get',
    params
  })
}

//select
export function sysBaseList(params) {
  return request({
    url: '/sysBase/list',
    method: 'get',
    params
  })
}


// 获取渠道列表树状信息
export function getOrderSourceTree(data) {
  return request({
    url: '/shApi/orderSource/getOrderSourceTree',
    method: 'post',
    data
  })
}
