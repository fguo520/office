import createAxios from '@/utils/axios'
const request = createAxios(process.env.SELECT_API)

export function getPlatforms() {
  return request({
    url: "/selection/storeLink/getPlatforms",
    method: 'get',
  })
}
export function list(data) {
  return request({
    url: "/selection/productLibrary/list",
    method: 'post',
    data
  })
}
export function batchRemove(data) {
  return request({
    url: "/selection/productLibrary/batchRemove",
    method: 'post',
    data
  })
}
export function addExcelTask(data) {
  return request({
    url: "/selection/productLibrary/addExcelTask",
    method: 'post',
    data
  })
}
export function reportList(data) {
  return request({
    url: "/selection/productLibrary/reportList",
    method: 'post',
    data
  })
}
export function downReport(id) {
  return request({
    url: `/selection/productLibrary/downReport/${id}`,
    method: 'get',
  })
}

export function getCheckResult(data) {
  return request({
    url: "/selection/productManage/getCheckResult",
    method: 'post',
    data
  })
}