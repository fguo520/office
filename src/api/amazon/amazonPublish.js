import createAxios from '@/utils/axios'
const request = createAxios(process.env.AMAZON_API)


// 亚马逊刊登列表分页
export function getlist(data) {
  return request({
    url: `/amazon/product/page`,
    method: 'post',
    data
  })
}


// 刊登商品创建人列表
export function createUser() {
  return request({
    url: `/amazon/product/create/user`,
    method: 'get'
  })
}

// 刊登商品负责人列表
export function accountUser() {
  return request({
    url: `/amazon/product/account/owner`,
    method: 'get'
  })
}