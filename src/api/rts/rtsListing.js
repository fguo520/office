import createAxios from '@/utils/axios'
const request = createAxios(process.env.RTS_API)

// Listing列表
export function getlist(data) {
  return request({
    url: "/rts/listing/list",
    method: 'post',
    data
  })
}
// 获取日志
export function getLogList(params) {
  return request({
    url: "/rts/listing/getLogList",
    method: 'get',
    params
  })
}


// 获取渠道信息
export function getRtsChannels() {
  return request({
    url: "/rts/listing/getRtsChannels",
    method: 'get',
  })
}


// 获取刊登人
export function getOwnerMemberDisplayNames() {
  return request({
    url: "/rts/listing/getOwnerMemberDisplayNames",
    method: 'post',
  })
}


// 更新价格
export function updateDiscountPrice(data) {
  return request({
    url: "/rts/listing/updateDiscountPrice",
    method: 'post',
    data
  })
}

// 获取产品分组
export function productGroupTree(data) {
  return request({
    url: "/rts/product/group/productGroupTree",
    method: 'post',
    data
  })
}


// 类目Tree
export function getRtsApiCategoryNode() {
  return request({
    url: "/rts/category/getRtsApiCategoryNode",
    method: 'post',
  })
}

// 批量上下架
export function batchDisplay(data) {
  return request({
    url: "/rts/listing/batchDisplay",
    method: 'post',
    data
  })
}

// 批量更新库存
export function updateInventorys(data) {
  return request({
    url: "/rts/listing/updateInventorys",
    method: 'post',
    data
  })
}
// listing编辑保存
export function listingSave(data) {
  return request({
    url: "/rts/listing/save",
    method: 'post',
    data
  })
}