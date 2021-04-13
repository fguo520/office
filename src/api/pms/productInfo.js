import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function productInfoList(data) {
  return request({
    url: '/shApi/productInfo/list',
    method: 'post',
    data
  })
}
export function productInfoSku(id) {
  return request({
    url: `/shApi/productInfo/item/${id}`,
    method: 'get',
  })
}
//日志
export function getProductInfoLogList(params) {
  return request({
    url: '/shApi/productInfo/getProductInfoLogList',
    method: 'post',
    data: params
  })
}
//select参数状态
export function getSearchStatus(params) {
  return request({
    url: `/shApi/productInfo/getSearchStatus`,
    method: 'post',
    params
  })
}
//下拉条件搜索
export function searchType() {
  return request({
    url: `/shApi/productInfo/searchType`,
    method: 'get',
  })
}

// 获取产品侵权风险
export function getProductPropertyList() {
  return request({
    url: `/shApi/productInfo/getProductPropertyList`,
    method: 'post'
  })
}



// 获取产品物流属性
export function getWithBatterys() {
  return request({
    url: `/shApi/productInfo/getWithBatterys`,
    method: 'post',
  })
}
// 批量导出

export function batchExport(data) {
  return request({
    url: `/shApi/productInfo/batchExport`,
    method: 'post',
    data
  })
}


// 创建自定义导出产品信息模板
export function createProductInfoTemp(data) {
  return request({
    url: `/shApi/productCustomTemp/createProductInfoTemp`,
    method: 'post',
    data
  })
}

// 查询自定义导出产品信息模板
export function queryProductInfoTemp(params) {
  return request({
    url: `/shApi/productCustomTemp/queryProductInfoTemp`,
    method: 'get',
    params
  })
}



// 删除自定义导出产品信息模板
export function delProductInfoTemp(id) {
  return request({
    url: `/shApi/productCustomTemp/delProductInfoTemp/${id}`,
    method: 'post',
  })
}
// 编辑自定义导出产品信息模板
export function editProductInfoTemp(id, data) {
  return request({
    url: `/shApi/productCustomTemp/editProductInfoTemp/${id}`,
    method: 'post',
    data
  })
}

// 添加自定义导出产品信息任务
export function importProductInfo(id, data) {
  return request({
    url: `/shApi/productCustomTemp/importProductInfo/${id}`,
    method: 'post',
    data
  })
}


// 获取翻译内容
export function getTranslateData(sku) {
  return request({
    url: `/shApi/productInfo/getTranslateData?sku=${sku}`,
    method: 'post',
  })
}

// 提交翻译
export function translateProductInfo(data) {
  return request({
    url: `/shApi/productInfo/translateProductInfo`,
    method: 'post',
    data
  })
}

// 获取语种
export function getTranslateLanguages() {
  return request({
    url: `/shApi/productInfo/getTranslateLanguages`,
    method: 'post',
  })
}

// 查看翻译日志
export function getTranslateLogList(params) {
  return request({
    url: `/shApi/productInfo/getTranslateLogList`,
    method: 'get',
    params
  })
}

// 多语言翻译确定
export function batchTranslate(data) {
  return request({
    url: `/shApi/productInfo/batchTranslate`,
    method: 'post',
    data
  })
}