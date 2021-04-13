import createAxios from '@/utils/axios'
const request = createAxios(process.env.SUPPLIER_API)


export function getSupplierDataMainList(data) {
  return request({
    url: "/lemonSupplier/data/getSupplierDataMainList",
    method: 'post',
    data
  })
}

// 获取省份相关信息
export function getProvinceInfo(params) {
  return request({
    url: "/lemonSupplier/data/getProvinceInfo",
    method: 'post',
    params
  })
}

export function getDepartMentUseByCode(params) {
  return request({
    url: "/lemonSupplier/data/getDepartMentUseByCode",
    method: 'post',
    params
  })
}

// 仓库列表
export function getLmShApiWarehouseList(params) {
  return request({
    url: "/lemonSupplier/data/getLmShApiWarehouseList",
    method: 'post',
    params
  })
}

export function uploadImage(data) {
  return request({
    url: "/lemonSupplier/data/uploadImage",
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

// 供应商新增修改
export function saveSupplierDataMain(data) {
  return request({
    url: "/lemonSupplier/data/saveSupplierDataMain",
    method: 'post',
    data
  })
}

// 供应商启用/停用
export function updateStatus(params) {
  return request({
    url: "/lemonSupplier/data/updateStatus",
    method: 'post',
    params
  })
}
// 
export function getLmSupplierDataMainDetail(params) {
  return request({
    url: "/lemonSupplier/data/getLmSupplierDataMainDetail",
    method: 'get',
    params
  })
}

export function searchSupplierLogPage(params) {
  return request({
    url: "/lemonSupplier/data/searchSupplierLogPage",
    method: 'get',
    params
  })
}