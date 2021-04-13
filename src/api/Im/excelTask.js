import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
export function getExcelExportlcTaskList(params) {
  return request({
    url: '/export/getExcelExportlcTaskList',
    method: 'get',
    params
  })
}

// 添加Excel任务报告
export function addExcelExportlcTask(params) {
  return request({
    url: '/export/addExcelExportlcTask',
    method: 'post',
    params
  })
}
// 获取创建人列表
export function getExcelReportUserAdmin() {
  return request({
    url: '/export/getExcelReportUserAdmin',
    method: 'get',
  })
}
// 查询Excel任务报告导出任务类型列表
export function searchTaskTypeList() {
  return request({
    url: '/export/searchTaskTypeList',
    method: 'get',
  })
}