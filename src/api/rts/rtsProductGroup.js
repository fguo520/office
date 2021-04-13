import createAxios from '@/utils/axios'
const request = createAxios(process.env.RTS_API)

export function authList() {
  return request({
    url: `/rts/product/auth/list`,
    method: 'get',
  })
}
export function groupPage(params) {
  return request({
    url: `/rts/product/group/page`,
    method: 'get',
    params
  })
}
export function groupLog(params) {
  return request({
    url: `/rts/product/group/log`,
    method: 'get',
    params
  })
}