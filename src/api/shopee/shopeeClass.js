import createAxios from '@/utils/axios'
const request = createAxios(process.env.SHOPPE_API)

// 类目列表
export function getLmShopeeCategoryList(data) {
  return request({
    url: "/shopee/category/getLmShopeeCategoryList",
    method: 'post',
    data
  })
}


// 站点
export function getRegionList() {
  return request({
    url: "/shopee/category/getRegionList",
    method: 'post',
  })
}



// 类目Tree
export function getShopeeApiCategoryNode(data) {
  return request({
    url: "/shopee/category/getShopeeApiCategoryNode",
    method: 'post',
    data
  })
}
// 根据类目id找出末级类目更新属性
export function updateAttribute(params) {
  return request({
    url: '/shopee/category/updateAttribute',
    method: 'get',
    params
  })
}

// 更新属性
export function saveShopeeApiAttributes(params) {
  return request({
    url: "/shopee/category/saveShopeeApiAttributes",
    method: 'post',
    params
  })
}

// 更新类目
export function saveShopeeApiCategory(params) {
  return request({
    url: "/shopee/category/saveShopeeApiCategory",
    method: 'post',
    params
  })
}

// 导入属性翻译
export function importCategoryAttributes(data) {
  return request({
    url: "/shopee/category/importCategoryAttributes",
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}