import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)

//店铺
export function getLmSysPlatformAuthList() {
  return request({
    url: '/walmart/product/getLmSysPlatformAuthList',
    method: 'post',
  })
}

// 获取sku产品信息
export function getLmShApiProductInfoList(data) {
  return request({
    url: '/walmart/product/getLmShApiProductInfoList',
    method: 'post',
    data
  })
}
//分类
export function getCategoryPage(data) {
  return request({
    url: '/walmart/category/getCategoryPage',
    method: 'post',
    data
  })
}
export function getWalmartApiCategoryList() {
  return request({
    url: '/walmart/category/getWalmartApiCategoryList',
    method: 'post',
  })
}
// 获取品牌
export function getWalmartBrandList(data) {
  return request({
    url: '/walmart/product/getWalmartBrandList',
    method: 'post',
    data
  })
}
// 获取物流方式
export function getWalmartLogisticsList() {
  return request({
    url: '/walmart/product/getWalmartLogisticsList',
    method: 'post',
  })
}
// 获取发货仓库
export function getWalmartWarehouseList() {
  return request({
    url: '/walmart/product/getWalmartWarehouseList',
    method: 'post',
  })
}
// 获取属性
export function getWalmartApiCategoryAttributes(data) {
  return request({
    url: '/walmart/category/getWalmartApiCategoryAttributes',
    method: 'post',
    data
  })
}
//计算
export function getWalmartProductPrice(data) {
  return request({
    url: '/walmart/product/getWalmartProductPrice',
    method: 'post',
    data
  })
}
//上传图片
export function uploadImage(data) {
  return request({
    url: '/walmart/product/uploadImage',
    method: 'post',
    data
  })
}
// 刊登产品
export function saveLmWalmartProduct(data) {
  return request({
    url: '/walmart/product/saveLmWalmartProduct',
    method: 'post',
    data
  })
}
// 修改回显信息
export function getLmWalmartProductGetUpdate(data) {
  return request({
    url: '/walmart/product/getLmWalmartProductGetUpdate',
    method: 'post',
    data
  })
}
// 获取侵权信息
export function getWalmartTortResult(data) {
  return request({
    url: '/walmart/product/getWalmartTortResult',
    method: 'post',
    data
  })
}

//listing更新

// 编辑刊登修改回显信息
export function getLmWalmartProductupdateGetUpdate(data) {
  return request({
    url: '/walmart/product/update/getLmWalmartProductGetUpdate',
    method: 'post',
    data
  })
}
// 编辑刊登产品
export function saveLmWalmartProductupdate(data) {
  return request({
    url: '/walmart/product/update/saveLmWalmartProduct',
    method: 'post',
    data
  })
}
// 编辑UPC列表
export function getWalmartUpcList() {
  return request({
    url: '/walmart/product/getWalmartUpcList',
    method: 'post',
  })
}
// 重新获取UPC
export function getWalmartUpcCount(params) {
  return request({
    url: '/walmart/product/getWalmartUpcCount',
    method: 'get',
    params
  })
}

//复制刊登回显信息
export function getCopyWalmartProduct(data) {
  return request({
    url: '/walmart/product/getCopyWalmartProduct',
    method: 'post',
    data
  })
}
//同店铺复制刊登
export function saveCopyLmWalmartProduct(data) {
  return request({
    url: '/walmart/product/saveCopyLmWalmartProduct',
    method: 'post',
    data
  })
}
