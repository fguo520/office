import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)
const baseRequest = createAxios(process.env.BASE_API)

export function getList(data) {
  return request({
    url: '/walmart/brandMaintain/list',
    method: 'post',
    data
  })
}
export function getChannelList(params) {
  return request({
    url: '/walmart/brandMaintain/getChannelList',
    method: 'get',
    params
  })
}
export function getLoglist(params) {
  return request({
    url: '/walmart/brandMaintain/getLoglist',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: '/walmart/brandMaintain/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/walmart/brandMaintain/update',
    method: 'post',
    data
  })
}

// 获取授权平台信息
export function getPlatform() {
  return request({
    url: '/walmart/brandMaintain/getPlatform',
    method: 'get',
  })
}


// 获取创建品牌维护人
export function getCreater() {
  return request({
    url: '/walmart/brandMaintain/getCreater',
    method: 'get',
  })
}

// 获取创建品牌维护人
export function brandInfoList(data) {
  return baseRequest({
    url: '/public/brandInfo/list',
    method: 'post',
    data
  })
}
// 获取添加人列表
export function getAddlist() {
  return baseRequest({
    url: '/public/brandInfo/getAddlist',
    method: 'get',
  })
}
// 获取添加人列表
export function getBrandTypeApi() {
  return baseRequest({
    url: '/public/brandInfo/getBrandType',
    method: 'get',
  })
}
// 添加/修改品牌
export function saveBrand(data) {
  return baseRequest({
    url: '/public/brandInfo/saveBrand',
    method: 'post',
    data
  })
}
// 修改品牌状态
export function updateBrandStatus(params) {
  return baseRequest({
    url: '/public/brandInfo/updateBrandStatus',
    method: 'post',
    params
  })
}

// 

export function getBrandTypeByName(params) {
  return request({
    url: '/walmart/brandMaintain/getBrandTypeByName',
    method: 'get',
    params
  })
}

export function getPublicBrandLogList(data) {
  return baseRequest({
    url: '/public/brandInfo/getPublicBrandLogList',
    method: 'post',
    data
  })
}