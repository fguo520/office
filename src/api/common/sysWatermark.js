import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getList(params) {
  return request({
    url: '/watermarkTemplate/list',
    method: 'get',
    params
  })
}


// 获取授权平台信息
export function getPlatform() {
  return request({
    url: '/watermarkTemplate/getPlatform',
    method: 'get',
  })
}
// 获取创建水印人
export function getCreater() {
  return request({
    url: '/watermarkTemplate/getCreater',
    method: 'get',
  })
}
export function logList(data) {
  return request({
    url: '/watermarkTemplate/logList',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/watermarkTemplate/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/watermarkTemplate/update',
    method: 'post',
    data
  })
}
export function listById(params) {
  return request({
    url: '/watermarkTemplate/listById',
    method: 'get',
    params
  })
}
export function upadteStatus(params) {
  return request({
    url: `/watermarkTemplate/upadteStatus`,
    method: 'get',
    params
  })
}



