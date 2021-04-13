import createAxios from '@/utils/axios'
const request = createAxios(process.env.RTS_API)
export function categoryPage(params) {
  return request({
    url: `/rts/category/page`,
    method: 'get',
    params
  })
}
export function attributesSave(params) {
  return request({
    url: `/rts/category/attributes/save`,
    method: 'get',
    params
  })
}
export function categorySave() {
  return request({
    url: `/rts/category/save`,
    method: 'get'
  })
}