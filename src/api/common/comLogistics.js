import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getList(data) {
  return request({
    url: '/public/logisticsAttr/list',
    method: 'post',
    data
  })
}


// 获取日志
export function getLogList(params) {
  return request({
    url: '/public/logisticsAttr/getLogList',
    method: 'get',
    params
  })
}

// 获取所有平台
export function getAllPlatform() {
  return request({
    url: '/public/logisticsAttr/getAllPlatform',
    method: 'get',
  })
}

// 获取所有物流方式
export function getAllLogisticMode(params) {
  return request({
    url: '/public/logisticsAttr/getAllLogisticMode',
    method: 'get',
    params
  })
}


// 获取所有物流属
export function getAllWithBattery(params) {
  return request({
    url: '/public/logisticsAttr/getAllWithBattery',
    method: 'get',
    params
  })
}

// 更改物流属性状态
export function updateStatus(data) {
  return request({
    url: '/public/logisticsAttr/updateStatus',
    method: 'post',
    data
  })
}

// 新增物流属性
export function logisticsAttradd(data) {
  return request({
    url: '/public/logisticsAttr/add',
    method: 'post',
    data
  })
}