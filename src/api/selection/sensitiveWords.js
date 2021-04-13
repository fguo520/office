import createAxios from '@/utils/axios'
const request = createAxios(process.env.SELECT_API)

export function list(data) {
  return request({
    url: '/selection/sensitiveWord/list',
    method: 'post',
    data
  })
}
export function getSensitiveWordType() {
  return request({
    url: '/selection/sensitiveWord/getSensitiveWordType',
    method: 'get',
  })
}
export function deleteOption(data) {
  return request({
    url: '/selection/sensitiveWord/delete',
    method: 'post',
    data
  })
}
export function importOption(data) {
  return request({
    url: '/selection/sensitiveWord/import',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/selection/sensitiveWord/add',
    method: 'post',
    data
  })
}
export function getTemplateUrl() {
  return request({
    url: '/selection/sensitiveWord/getTemplateUrl',
    method: 'get',
  })
}