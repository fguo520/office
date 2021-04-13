import createAxios from '@/utils/axios'
const request = createAxios(process.env.LOGISTICS_API)

export function getList(data) {
  return request({
    url: '/lemonLogistics/quote/getLogisticsServeiceQuoteMainList',
    method: 'post',
    data
  })
}

// 运费报价停用启用
export function updateStatus(data) {
  return request({
    url: '/lemonLogistics/quote/updateStatus',
    method: 'post',
    data
  })
}


// 物流日志列表
export function searchLogisticsLogPage(params) {
  return request({
    url: '/lemonLogistics/node/searchLogisticsLogPage',
    method: 'get',
    params
  })
}

// 运费报价导入
export function importServeiceQuoteDetail(data) {
  return request({
    url: '/lemonLogistics/quote/importServeiceQuoteDetail',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

// 查看列表
export function getLogisticsServeiceQuoteDetailPage(data) {
  return request({
    url: '/lemonLogistics/quote/getLogisticsServeiceQuoteDetailPage',
    method: 'post',
    data
  })
}
// 
export function getLogisticsServeiceQuoteDetailList(data) {
  return request({
    url: '/lemonLogistics/quote/getLogisticsServeiceQuoteDetailList',
    method: 'post',
    data
  })
}


// 获取下载模板(intervalPrice:区间价格,craneRenewal:起重续价)
export function getTemplateUrl() {
  return request({
    url: '/lemonLogistics/quote/getTemplateUrl',
    method: 'get',
  })
}
