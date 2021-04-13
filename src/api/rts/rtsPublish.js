
import createAxios from '@/utils/axios'
const request = createAxios(process.env.RTS_API)

// rts列表分页
export function getList(data) {
  return request({
    url: "/rts/product/page",
    method: 'post',
    data
  })
}

// RTS刊登日志
export function getlogList(params) {
  return request({
    url: "/rts/product/log",
    method: 'get',
    params
  })
}

// rts获取渠道
export function getauthList() {
  return request({
    url: "/rts/product/auth/list",
    method: 'get',
  })
}

// rts获取刊登人
export function getOwnerpublishUser() {
  return request({
    url: "/rts/product/publishUser/list",
    method: 'get',
  })
}
// 类目Tree
export function getRtsApiCategoryNode() {
  return request({
    url: "/rts/category/getRtsApiCategoryNode",
    method: 'post',
  })
}
