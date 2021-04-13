import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
export function getCategoryPageList(data) {
  return request({
    url: '/category/getCategoryByRegionList',
    method: 'post',
    data
  })
}
export function getProductCategoryLog(data) {
  return request({
    url: '/category/getProductCategoryLog',
    method: 'post',
    data
  })
}
///区域列表
export function getRegionList() {
  return request({
    url: '/category/getRegionList',
    method: 'post'
  })
}
//创建属性
export function saveCategoryAttributesAll() {
  return request({
    url: '/category/saveCategoryAttributesAll',
    method: 'post'
  })
}
///创建类目
export function saveLazadaApiCategory() {
  return request({
    url: '/category/saveLazadaApiCategory',
    method: 'post'
  })
}

// 根据类目id找出末级类目更新属性
export function updateAttribute(params) {
  return request({
    url: '/category/updateAttribute',
    method: 'get',
    params
  })
}