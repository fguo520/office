import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

// 列表
export function getLm1688PlatformList(data) {
  return request({
    url: '/openapiApiToken/getLm1688PlatformList',
    method: 'post',
    data
  })
}

// 采购人员列表
export function getBuyPersonList() {
  return request({
    url: '/openapiApiToken/getBuyPersonList',
    method: 'post',
  })
}


// 新增1688授权
export function addLm1688Platform(data) {
  return request({
    url: '/openapiApiToken/addLm1688Platform',
    method: 'post',
    data
  })
}


// 删除1688授权
export function deleteLm1688Platform(params) {
  return request({
    url: '/openapiApiToken/deleteLm1688Platform',
    method: 'get',
    params
  })
}


// 启用禁用
export function updateIsEnable(data) {
  return request({
    url: '/openapiApiToken/updateIsEnable',
    method: 'post',
    data
  })
}
//shopee授权回调地址
export function getAuthRequestUrl(id) {
  return request({
    url: `/openapiApiToken/getAuthRequestUrl?id=${id}`,
    method: 'get',
  })
}
export function lzaAuthorizationWs(id) {
  return `${process.env.WS_API}/websocket/platform/auth/${id}`
}

// 刷新授权
export function refreshToken(params) {
  return request({
    url: '/openapiApiToken/refreshToken',
    method: 'get',
    params
  })
}
//日志
export function getLoglist(params) {
  return request({
    url: '/admin/operate/log/list',
    method: 'get',
    params
  })
}
