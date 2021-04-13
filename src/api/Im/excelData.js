import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
const request_ex = createAxios(process.env.EXCEL_BASE_API)

// 数据导出列表
export function getShDataExportlList(data) {
  return request({
    url: '/export/getShDataExportlList',
    method: 'post',
    data
  })
}
//获取下载模板
export function getLmShExcelTemplate(params) {
  return request({
    url: '/export/getLmShExcelTemplate',
    method: 'get',
    params
  })
}
//日志
export function getLmShDataExportLogList(data) {
  return request({
    url: "/export/getLmShDataExportLogList",
    method: "post",
    data
  })
}

//下载报告
export function getExportlcCompleteUrl(id) {
  return request({
    url: '/export/getExportlcCompleteUrl/' + id,
    method: 'get'
  })
}
//下载源报告
export function getExportlUrl(id) {
  return request({
    url: '/export/getExportlUrl/' + id,
    method: 'get'
  })
}
//数据导出提交任务
export function saveLmDataExportTask(params) {
  return request({
    url: "/export/saveLmDataExportTask",
    method: "post",
    params
  })
}
//状态
export function getSysParameterCodeList(params) {
  return request({
    url: '/sysBase/getSysParameterCodeList',
    method: 'get',
    params
  })
}
//创建人
export function getUmsAdmin() {
  return request({
    url: '/export/getUmsAdmin',
    method: 'get'
  })
}
//数据类型条件
export function queryLmSysParameterCodeTree() {
  return request({
    url: '/export/queryLmSysParameterCodeTree',
    method: 'get'
  })
}
// 数据任务类型条件
export function getLmSysParameterCodeTree() {
  return request({
    url: '/export/getLmSysParameterCodeTree',
    method: 'get'
  })
}


//删除重复数据
export function delRepeatData(params) {
  return request_ex({
    url: "/lmshexcel/delRepeatData",
    method: "post",
    params
  })
}
//  导入模板
export function getLmExcelsaveOrderRefundCsv(data) {
  return request_ex({
    url: "/lmshexcel/saveOrderRefundCsv",
    headers: { 'Content-Type': 'multipart/form-data' },
    method: "post",
    data
  })
}