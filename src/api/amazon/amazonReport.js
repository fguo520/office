import createAxios from '@/utils/axios'
const request = createAxios(process.env.AMAZON_API)

// Listing渠道
export function getLmAmazonAuthNode() {
  return request({
    url: "/amazon/amazonListing/getLmAmazonAuthNode",
    method: 'post',
  })
}

// 物流推荐的移除报告列表
export function getAmazonRecommendedRemovalList(data) {
  return request({
    url: "/amazon/report/getAmazonRecommendedRemovalList",
    method: 'post',
    data
  })
}

//物流退款报告列表
export function getAmazonReimbursementList(data) {
  return request({
    url: "/amazon/report/getAmazonReimbursementList",
    method: 'post',
    data
  })
}

//库存年龄报告列表
export function getLmAmazonInventoryAgeList(data) {
  return request({
    url: "/amazon/report/getLmAmazonInventoryAgeList",
    method: 'post',
    data
  })
}
//库存分类帐报告列表
export function getAmazonLedgerSummaryViewList(data) {
  return request({
    url: "/amazon/report/getAmazonLedgerSummaryViewList",
    method: 'post',
    data
  })
}
//获取亚马逊物流仓储费报告列表
export function queryFbaStorageFeeChargesPage(data) {
  return request({
    url: "/amazon/report/queryFbaStorageFeeChargesPage",
    method: 'post',
    data
  })
}
//获取亚马逊物流管理库存列表
export function queryLogisticsInventoryPage(data) {
  return request({
    url: "/amazon/report/queryLogisticsInventoryPage",
    method: 'post',
    data
  })
}



