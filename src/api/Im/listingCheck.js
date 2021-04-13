import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
export function getList(data) {
  return request({
    url: '/shApi/listing/online/check/num',
    method: 'post',
    data
  })
}

export function getType(params) {
  return request({
    url: '/shApi/listing/platform/info',
    method: 'get',
    params
  })
}