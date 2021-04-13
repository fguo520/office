import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
const request_WAL = createAxios(process.env.WALMART_API)

export function getList(params) {
  return request({
    url: '/admin/platform/channel/auth/page',
    method: 'get',
    params
  })
}
//获取站点
export function getSyslist(params) {
  return request({
    url: '/sysBase/list',
    method: 'get',
    params
  })
}
export function getDelete(id) {
  return request({
    url: `/admin/platform/channel/auth/delete?id=` + id,
    method: 'get'
  })
}

export function getSave(data) {
  return request({
    url: '/admin/platform/channel/auth/save',
    method: 'post',
    data
  })
}

export function getUpdate(data) {
  return request({
    url: '/admin/platform/channel/auth/update',
    method: 'post',
    data
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
//获取平台
export function getSysParameterName(params) {
  return request({
    url: '/sysBase/getSysParameterName',
    method: 'get',
    params
  })
}
export function lzaAuthorizationWs(id) {
  return `${process.env.WS_API}/websocket/platform/auth/${id}`
}
export function callBackUrl(params) {
  let encodeURI;
  switch (process.env.NODE_ENV) {
    case "development":
      encodeURI = encodeURIComponent(`http://test.lemontreegood.com/callback/lazada?id=${params.id}&operateName=${params.operateName}`)
      return `http://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&client_id=123429&redirect_uri=${encodeURI}`
    case "test":
      encodeURI = encodeURIComponent(`http://test.lemontreegood.com/callback/lazada?id=${params.id}&operateName=${params.operateName}`)
      return `http://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&client_id=123429&redirect_uri=${encodeURI}`
    case "production":
      encodeURI = encodeURIComponent(`https://admin.lemontreegood.com/callback/lazada?id=${params.id}&operateName=${params.operateName}`)
      return `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&client_id=123429&redirect_uri=${encodeURI}`
  }
}
//shopee授权回调地址
export function getAuthRequestUrl(id) {
  return request({
    url: `/admin/platform/channel/auth/shopee/getAuthRequestUrl?id=${id}`,
    method: 'get',
  })
}
//rts授权回调地址
export function getAuthRequestUrlRts(id) {
  return request({
    url: `/admin/platform/channel/auth/rts/getAuthRequestUrl?id=${id}`,
    method: 'get',
  })
}
//amazon授权回调地址
export function getAuthRequestUrlAmazon(id) {
  return request({
    url: `/admin/platform/channel/auth/amazon/getToken?id=${id}`,
    method: 'post',
  })
}

// 获取亚马逊回调地址
export function getCallbackRequestUrl(params) {
  return request({
    url: '/admin/platform/channel/auth/amazon/getCallbackRequestUrl',
    method: 'get',
    params
  })
}

// amazon刷新token
export function refreshTokenAmazon(params) {
  return request({
    url: '/admin/platform/channel/auth/amazon/refreshToken',
    method: 'get',
    params
  })
}
export function refreshToken(params) {
  return request({
    url: '/lazadaApiToken/refreshToken',
    method: 'post',
    params
  })
}
//启用停用
export function updateState(params) {
  return request({
    url: '/admin/platform/channel/auth/update/state',
    method: 'get',
    params
  })
}
//清空Listing
export function cleanListingData(params) {
  return request({
    url: '/lazadaApiToken/cleanListingData',
    method: 'post',
    params
  })
}
//沃尔玛授权
export function getWalmarttoken(params) {
  return request_WAL({
    url: '/walmart/token/get',
    method: 'post',
    params
  })
}

export function channelname(params) {
  return request({
    url: '/admin/platform/channel/auth/store/name',
    method: 'get',
    params
  })
}

// 亚马逊获取渠道区域对应的国家
export function getSysParameterCountry(params) {
  return request({
    url: '/sysBase/getSysParameterCountry',
    method: 'get',
    params
  })
}

// 渠道授权新增亚马逊数据
export function saveAmazon(data) {
  return request({
    url: '/admin/platform/channel/auth/amazon/saveAmazon',
    method: 'post',
    data
  })
}

// 渠道授权修改亚马逊数据
export function updateAmazon(data) {
  return request({
    url: '/admin/platform/channel/auth/amazon/updateAmazon',
    method: 'post',
    data
  })
}

export function getCountryChannelTree(params) {
  return request({
    url: 'admin/platform/channel/auth/getCountryChannelTree',
    method: 'post',
    params
  })
}

export function checkAmazonDetail(data) {
  return request({
    url: 'admin/platform/channel/auth/checkAmazonDetail',
    method: 'post',
    data
  })
}
//校验渠道别名等信息
export function getUmsAdminByPlatform(params) {
  return request({
    url: '/admin/platform/channel/auth/getUmsAdminByPlatform',
    method: 'post',
    params
  })
}