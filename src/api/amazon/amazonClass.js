import createAxios from '@/utils/axios'
const request = createAxios(process.env.AMAZON_API)
export function getCategoryListPage(data) {
  return request({
    url: `/amazon/amazonCatalogs/getCategoryListPage`,
    method: 'post',
    data
  })
}

// 类目日志列表
export function searchCategoryLog(data) {
  return request({
    url: `/amazon/amazonCatalogs/searchCategoryLog`,
    method: 'post',
    data
  })
}
// 上传类目
export function uploadCategory(data) {
  return request({
    url: `/amazon/amazonCatalogs/uploadCategory`,
    method: 'post',
    data
  })
}
// 查询亚马逊国家列表
export function searchSysParameterCode() {
  return request({
    url: `/amazon/amazonCatalogs/searchSysParameterCode`,
    method: 'post',
  })
}
// 验证该国家的类目是否已存在
export function checkCategory(params) {
  return request({
    url: `/amazon/amazonCatalogs/checkCategory`,
    method: 'get',
    params
  })
}
// 添加类目
export function addCategory(data) {
  return request({
    url: `/amazon/amazonCatalogs/addCategory`,
    method: 'post',
    data
  })
}
// 获取类目列表
export function getCategoryList(params) {
  return request({
    url: `/amazon/amazonCatalogs/getCategoryList`,
    method: 'get',
    params
  })
}
// 上传类目属性
export function uploadCategoryAttributes(data) {
  return request({
    url: `/amazon/amazonCatalogs/uploadCategoryAttributes`,
    method: 'post',
    data
  })
}
// 编辑类目中文名称
export function editCategoryName(id, params) {
  return request({
    url: `/amazon/amazonCatalogs/editCategoryName/${id}`,
    method: 'post',
    params
  })
}


// 根据末级类目id或者名称获取类目列表
export function getCategoryNodeTree( params) {
  return request({
    url: `/amazon/amazonCatalogs/getCategoryNodeTree`,
    method: 'get',
    params
  })
}

// 上传类目属性文件Zip
export function uploadCategoryAttributesZip( data) {
  return request({
    url: `/amazon/amazonCatalogs/uploadCategoryAttributesZip`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}