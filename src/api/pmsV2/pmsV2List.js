import createAxios from '@/utils/axios'
const request = createAxios(process.env.PMSV2_API)
const baseRequest = createAxios(process.env.BASE_API)
export function lemonProductList(data) {
  return request({
    url: '/lemonProduct/integrate/list',
    method: 'post',
    data
  })
}
export function getProductPropertyList() {
  return request({
    url: `/lemonProduct/baseInfo/getProductPropertyList`,
    method: 'post'
  })
}
export function getWithBatterys() {
  return request({
    url: `/lemonProduct/baseInfo/getWithBatterys`,
    method: 'post',
  })
}
export function getSearchStatus() {
  return request({
    url: `/lemonProduct/baseInfo/getSearchStatus`,
    method: 'post',
  })
}
export function classListAll() {
  return request({
    url: '/lemonProduct/baseInfo/classListAll',
    method: 'get'
  })
}
export function getProductLogList(data) {
  return request({
    url: "/lemonProduct/appProduct/log/getProductLogList",
    method: "post",
    data
  })
}
// 多语言翻译确定
export function batchTranslate(data) {
  return request({
    url: `/lemonProduct/translate/batchTranslate`,
    method: 'post',
    data
  })
}

// 批量上传图片
export function batchUpload(data) {
  return request({
    url: '/lemonProduct/baseInfoPic/batchUpload',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}
// 创建自定义导出产品信息模板
export function createProductInfoTemp(data) {
  return request({
    url: `/lemonProduct/productCustomTemp/createProductInfoTemp`,
    method: 'post',
    data
  })
}

// 查询自定义导出产品信息模板
export function queryProductInfoTemp(params) {
  return request({
    url: `/lemonProduct/productCustomTemp/queryProductInfoTemp`,
    method: 'get',
    params
  })
}



// 删除自定义导出产品信息模板
export function delProductInfoTemp(id) {
  return request({
    url: `/lemonProduct/productCustomTemp/delProductInfoTemp/${id}`,
    method: 'post',
  })
}
// 编辑自定义导出产品信息模板
export function editProductInfoTemp(id, data) {
  return request({
    url: `/lemonProduct/productCustomTemp/editProductInfoTemp/${id}`,
    method: 'post',
    data
  })
}

// 添加自定义导出产品信息任务
export function importProductInfo(id, data) {
  return request({
    url: `/lemonProduct/productCustomTemp/importProductInfo/${id}`,
    method: 'post',
    data
  })
}

// 获取产品图片列表
export function getPictureList(data) {
  return request({
    url: `/lemonProduct/baseInfoPic/getPictureList`,
    method: 'post',
    data
  })
}
// 批量下载图片
export function batchDownload(id) {
  window.open(`${process.env.PMSV2_API}/lemonProduct/baseInfoPic/batchDownload?productId=${id}`, '_self')
}

//同步商品信息至赛盒
export function callProduct(data) {
  return request({
    url: `/lemonProduct/api/callProduct`,
    method: 'post',
    data
  })
}

//获取商品属性
export function getProductCombType(params) {
  return request({
    url: '/lemonProduct/baseInfo/getProductCombType',
    method: 'get',
    params
  })
}
// 获取商品类别
export function productClassList() {
  return baseRequest({
    url: '/shApi/productClass/listAll',
    method: 'get'
  })
}
