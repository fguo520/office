import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

//分页
export function productInventoryList(params) {
  return request({
    url: '/shApi/productInventory/listWith',
    method: 'post',
    data: params
  })
}
//更新
export function productInventoryManualUpdate() {
  return request({
    url: '/shApi/productInventory/manualUpdate',
    method: 'post'
  })
}
//日志
export function getProductInventoryLogList(params) {
  return request({
    url: '/shApi/productInventory/getProductInventoryLogList',
    method: 'post',
    data: params
  })
}
//参数
export function treeWareHouseName(params) {
  return request({
    url: `/shApi/warehouse/treeWareHouseName`,
    method: 'post',
    params
  })
}