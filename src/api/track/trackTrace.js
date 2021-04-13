import createAxios from '@/utils/axios'
const request = createAxios(process.env.LOGISTICS_API)

// 物流节点分页
export function getListPage(data) {
  return request({
    url: `/lemonLogistics/track/page`,
    method: 'post',
    data
  })
}
export function getTransportNameList() {
  return request({
    url: `/lemonLogistics/node/getTransportNameList`,
    method: 'get',
  })
}

// 物流追踪自定义导出
export function customExport(data) {
  return request({
    url: `/lemonLogistics/track/customExport`,
    method: 'post',
    data
  })
}

// 物流任务分页
export function logisticsReportPage(params) {
  return request({
    url: `/lemonLogistics/track/logisticsReportPage`,
    method: 'post',
    params
  })
}