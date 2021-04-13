import createAxios from '@/utils/axios'
const request = createAxios(process.env.FINANCE_API)

export function showFeeBillNo() {
  return request({
    url: '/fmsBill/showFeeBillNo',
    method: 'post',
  })
}

// 显示平台
export function listPlatform() {
  return request({
    url: '/fmsBill/listPlatform',
    method: 'post',
  })
}

export function listFeeType(params) {
  return request({
    url: '/fmsBill/listFeeType',
    method: 'post',
    params
  })
}

// 查询所有系统有效用户
export function selectAllEffectiveUmsAdmin() {
  return request({
    url: '/fmsBill/selectAllEffectiveUmsAdmin',
    method: 'post',
  })
}

// 根据平台带出渠道
export function queryChannelByPlatformCode(params) {
  return request({
    url: '/fmsBill/queryChannelByPlatformCode',
    method: 'post',
    params
  })
}

// 根据币种获取最新汇率
export function queryExchangeRateByName(params) {
  return request({
    url: '/fmsBill/queryExchangeRateByName',
    method: 'post',
    params
  })
}

// 上传申请单附件
export function uploadFile(data) {
  return request({
    url: '/fmsBill/uploadFile',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

// 创建费用申请单
export function addFeeApplyBill(data) {
  return request({
    url: '/fmsBill/addFeeApplyBill',
    method: 'post',
    data
  })
}


// 显示部门
export function listDepartment(params) {
  return request({
    url: '/fmsBill/listDepartment',
    method: 'post',
    params
  })
}

// 
export function queryApplyBill(data) {
  return request({
    url: '/fmsBill/queryApplyBill',
    method: 'post',
    data
  })
}


// 根据平台订单号查询金额
export function queryOrderAmount(params) {
  return request({
    url: '/fmsBill/queryOrderAmount',
    method: 'post',
    params
  })
}


// 作废申请单
export function discardBill(params) {
  return request({
    url: '/fmsBill/discardBill',
    method: 'post',
    params
  })
}

// 审核费用申请单
export function checkFeeApplyBill(data) {
  return request({
    url: '/fmsBill/checkFeeApplyBill',
    method: 'post',
    data
  })
}

// 
export function batchCheckFeeApplyBill(data) {
  return request({
    url: '/fmsBill/batchCheckFeeApplyBill',
    method: 'post',
    data
  })
}

// 查看申请单的日志
export function queryBillLog(params) {
  return request({
    url: '/fmsBill/queryBillLog',
    method: 'post',
    params
  })
}

// 取消费用申请单
export function cancelFeeBill(params) {
  return request({
    url: '/fmsBill/cancelFeeBill',
    method: 'post',
    params
  })
}

// 生成excel报告
export function exportFeeBill(data) {
  return request({
    url: '/fmsBill/exportFeeBill',
    method: 'post',
    data
  })
}
// 
export function departmentlist(params) {
  return request({
    url: '/fmsBill/department/list',
    method: 'get',
    params
  })
}