import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function del(id) {
  return request({
    url: `/public/upc/del/${id}`,
    method: 'post',
  })
}
export function importFile(data) {
  return request({
    url: `/public/upc/import`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
export function marker({ id, ...params }) {
  return request({
    url: `/public/upc/marker/${id}`,
    method: 'post',
    params
  })
}
export function page(data) {
  return request({
    url: `/public/upc/page`,
    method: 'post',
    data
  })
}

// 获取店铺信息
export function getLmSysPlatformAuthList() {
  return request({
    url: '/public/product/getLmSysPlatformAuthList',
    method: 'post',
  })
}

// 获取所有平台
export function getPlatforms() {
  return request({
    url: `/public/upc/getPlatforms`,
    method: 'get',
  })
}
export function getChannels(params) {
  return request({
    url: `/public/upc/getChannels`,
    method: 'get',
    params
  })
}