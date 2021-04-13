import createAxios from '@/utils/axios'
const request = createAxios(process.env.SELECT_API)


// 查询店铺链接管理列表
export function list(data) {
  return request({
    url: '/selection/storeLink/list',
    method: 'post',
    data
  })
}

// 获取下拉信息(平台信息)
export function getPlatforms() {
  return request({
    url: '/selection/storeLink/getPlatforms',
    method: 'get',
  })
}

export function getAddUsers() {
  return request({
    url: '/selection/storeLink/getAddUsers',
    method: 'get',
  })
}

// 添加店铺链接
export function add(data) {
  return request({
    url: '/selection/storeLink/add',
    method: 'post',
    data
  })
}
// 批量删除
export function batchDelete(data) {
  return request({
    url: '/selection/storeLink/delete',
    method: 'post',
    data
  })
}
//日志
export function getLogList(data) {
  return request({
    url: '/selection/storeLink/getLogList',
    method: 'post',
    data
  })
}