import createAxios from '@/utils/axios'
const request = createAxios(process.env.WALMART_API)

//分页
export function getmainList(data) {
  return request({
    url: '/walmart/logisticsQuote/mainList',
    method: 'post',
    data
  })
}
export function getWareHouseList() {
  return request({
    url: '/walmart/logisticsQuote/getWareHouseList',
    method: 'get',
  })
}
//币种
export function getCurrencylList() {
  return request({
    url: '/walmart/logisticsQuote/getCurrencylList',
    method: 'get',
  })
}

// 添加物流渠道
export function getlogisticsQuote(data) {
  return request({
    url: '/walmart/logisticsQuote/add',
    method: 'post',
    data
  })
}


// 获取日志列表
export function getLoglist(params) {
  return request({
    url: '/walmart/logisticsQuote/getLoglist',
    method: 'get',
    params
  })
}

// 启/停用物流渠道
export function updateStatus(params) {
  return request({
    url: '/walmart/logisticsQuote/updateStatus',
    method: 'post',
    params
  })
}

// 编辑物流渠道
export function getlogisticsQuoteupdate(data) {
  return request({
    url: '/walmart/logisticsQuote/update',
    method: 'post',
    data
  })
}


// 运费报价列表
export function childList(params) {
  return request({
    url: '/walmart/logisticsQuote/childList',
    method: 'post',
    params
  })
}

// 运费报价查看详情
export function logisticsQuoteInfo(params) {
  return request({
    url: '/walmart/logisticsQuote/info',
    method: 'post',
    params
  })
}

// 导入运费报价
export function logisticsQuoteImport(data) {
  return request({
    url: '/walmart/logisticsQuote/import',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}


// 获取物流属性
export function getLogisticsProperty() {
  return request({
    url: '/walmart/logisticsQuote/getLogisticsProperty',
    method: 'get'
  })
}
export function getTemplateUrl(params) {
  return request({
    url: '/walmart/logisticsQuote/getTemplateUrl',
    method: 'get',
    params
  })
}

