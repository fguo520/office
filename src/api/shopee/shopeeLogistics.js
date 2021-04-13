import createAxios from '@/utils/axios'
const request = createAxios(process.env.SHOPPE_API)
const requestBase = createAxios(process.env.BASE_API)


// 物流分页展示
export function getpage(data) {
  return request({
    url: "/shopee/logistics/page",
    method: 'post',
    data
  })
}

// 物流获取日志信息
export function getlogistics(params) {
  return request({
    url: '/shopee/logistics/log',
    method: 'get',
    params
  })
}
export function getofferpage(params) {
  return request({
    url: '/shopee/logistics/offer/page',
    method: 'get',
    params
  })
}



// 导入运费报价
//获取站点
export function getimport(data) {
  return request({
    url: '/shopee/logistics/import',
    method: 'post',
    data
  })
}

// 获取导入列表详情
export function getofferdetail(params) {
  return request({
    url: '/shopee/logistics/offer/detail',
    method: 'get',
    params
  })
}

// 编辑物流信息
export function getupdate(data) {
  return request({
    url: '/shopee/logistics/update',
    method: 'post',
    data
  })
}

// 手动拉取物流方式
export function getinit() {
  return request({
    url: '/shopee/logistics/init',
    method: 'get',
  })
}


//获取站点
export function getSyslist(params) {
  return requestBase({
    url: '/sysBase/list',
    method: 'get',
    params
  })
}