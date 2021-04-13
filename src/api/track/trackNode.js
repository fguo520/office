import createAxios from '@/utils/axios'
const request = createAxios(process.env.LOGISTICS_API)

// 物流节点分页
export function getListPage(data) {
  return request({
    url: `/lemonLogistics/node/page`,
    method: 'post',
    data
  })
}

// 物流节点创建人列表
export function adminUserList() {
  return request({
    url: `/lemonLogistics/node/adminUserList`,
    method: 'get',
  })
}

// 物流运输方式名称列表
export function getTransportNameList() {
  return request({
    url: `/lemonLogistics/node/getTransportNameList`,
    method: 'get',
  })
}


// 物流日志列表
export function searchLogisticsLogPage(params) {
  return request({
    url: `/lemonLogistics/node/searchLogisticsLogPage`,
    method: 'get',
    params
  })
}

// 添加或编辑物流节点
export function editLogisticsNode(data) {
  return request({
    url: `/lemonLogistics/node/editLogisticsNode`,
    method: 'post',
    data
  })
}

// 物流节点停用
export function delLogisticsNode(params) {
  return request({
    url: `/lemonLogistics/node/delLogisticsNode`,
    method: 'post',
    params
  })
}