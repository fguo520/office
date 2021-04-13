import createAxios from '@/utils/axios'
const request = createAxios(process.env.RTS_API)


// 获取列表
export function list(params) {
  return request({
    url: "/rts/product/formula/page",
    method: 'get',
    params
  })
}
export function log(params) {
  return request({
    url: "/rts/product/formula/log",
    method: 'get',
    params
  })
}

// 新增\
export function save(data) {
  return request({
    url: "/rts/product/formula/save",
    method: 'post',
    data
  })
}