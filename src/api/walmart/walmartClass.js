import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)

export function getCategoryPage(data) {
  return request({
    url: '/walmart/category/getCategoryPage',
    method: 'post',
    data
  })
}
export function getCategoryAttributesList(data) {
  return request({
    url: '/walmart/category/getCategoryAttributesList',
    method: 'post',
    data
  })
}
//分类
export function getWalmartApiCategoryTree() {
  return request({
    url: '/walmart/category/getWalmartApiCategoryTree',
    method: 'post',
  })
}

export function getWalmartApiCategoryList() {
  return request({
    url: '/walmart/category/getWalmartApiCategoryList',
    method: 'post',
  })
}
//导入
export function saveCategoryAttributes(data) {
  return request({
    url: '/walmart/category/saveCategoryAttributes',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 类目日志列表
export function getWalmartCategoryLog(params) {
  return request({
    url: '/walmart/category/getWalmartCategoryLog',
    method: 'get',
    params
  })
}

// 修改类目
export function updateItemsTaxonomy(data) {
  return request({
    url: '/walmart/category/updateItemsTaxonomy',
    method: 'post',
    data
  })
}

// 获取类目模板
export function getCategoryTemplate(params) {
  return request({
    url: '/walmart/category/getCategoryTemplate',
    method: 'get',
    params
  })
}

export function getCategoryExcelTaskList(data) {
  return request({
    url: '/walmart/category/getCategoryExcelTaskList',
    method: 'post',
    data
  })
}