import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

//收费
export function getRateList(data) {
  return request({
    url: '/rateMaintenance/rateList',
    method: 'post',
    data
  })
}
//运费
export function geTemplateList(data) {
  return request({
    url: '/rateMaintenance/templateList',
    method: 'post',
    data
  })
}
//日志
export function getLoglist(data) {
  return request({
    url: '/rateMaintenance/loglist',
    method: 'post',
    data
  })
}
//编辑
export function getUpdate(data) {
  return request({
    url: '/rateMaintenance/update',
    method: 'post',
    data
  })
}
//导入
export function getImport(data) {
  return request({
    url: '/rateMaintenance/import',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}