import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getLazadaProductTaskList(data) {
  return request({
    url: '/product/getLazadaProductTaskList',
    method: 'post',
    data
  })
}

export function getLazadaProductTaskTypeList() {
  return request({
    url: '/product/getLazadaProductTaskTypeList',
    method: 'post'
  })
}