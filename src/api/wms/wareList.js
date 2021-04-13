import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

//分页
export function warehouseList(params) {
  return request({
    url: '/shApi/warehouse/list',
    method: 'post',
    data: params
  })
}
//日志
export function getWarehouseListLogList(params) {
  return request({
    url: `/shApi/warehouse/getWarehouseListLogList`,
    method: 'get',
    params
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
export function getWareHouseType() {
  return request({
    url: `/shApi/warehouse/getWareHouseType`,
    method: 'get'
  })
}
//更新
export function manualUpdate() {
  return request({
    url: `/shApi/warehouse/manualUpdate`,
    method: 'get',
  })
}