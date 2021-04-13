
import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)


// 侵权记录列表
export function list(data) {
  return request({
    url: '/public/tort/list',
    method: 'post',
    data
  })
}

// 获取侵权记录查询下拉列表信息
export function getDropDown() {
  return request({
    url: '/public/tort/getDropDown',
    method: 'get',
  })
}

// 根据平台code获取国家下拉框
export function tortCountry(params) {
  return request({
    url: '/public/tort/country',
    method: 'get',
    params
  })
}


export function getDevelopMan(params) {
  return request({
    url: '/public/tort/getDevelopMan',
    method: 'get',
    params
  })
}

// 根据店铺获取销售人员
export function getSaleMan(params) {
  return request({
    url: '/public/tort/getSaleMan',
    method: 'get',
    params
  })
}

// 添加侵权记录
export function saveTortRecordInfo(data) {
  return request({
    url: '/public/tort/saveTortRecordInfo',
    method: 'post',
    data
  })
}


// 导入文件
export function importTortRecord(data) {
  return request({
    url: '/public/tort/importTortRecord',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}


export function getTemplateUrl() {
  return request({
    url: '/public/tort/getTemplateUrl',
    method: 'get',
  })
}
// 
export function exportTortRecordInfo(data) {
  return request({
    url: '/public/tort/exportTortRecordInfo',
    method: 'post',
    data
  })
}

export function getTortRecordTaskList(data) {
  return request({
    url: '/public/tort/getTortRecordTaskList',
    method: 'post',
    data
  })
}

export function getTortRecordLogList(data) {
  return request({
    url: '/public/tort/getTortRecordLogList',
    method: 'post',
    data
  })
}