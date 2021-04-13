import createAxios from '@/utils/axios'
const request = createAxios(process.env.RTS_API)


// 添加rts热搜词
export function addHotSearch(data) {
  return request({
    url: "/rts/hotSearch/addHotSearch",
    method: 'post',
    data
  })
}


// 更改rts热搜词启用状态
export function editEnable(id, params) {
  return request({
    url: `/rts/hotSearch/editEnable/` + id,
    method: 'post',
    params
  })
}

// rts热搜词日志列表
export function hotSearchLogPage(params) {
  return request({
    url: "/rts/hotSearch/hotSearchLogPage",
    method: 'get',
    params
  })
}


// rts热搜词列表
export function hotSearchPage(data) {
  return request({
    url: "/rts/hotSearch/hotSearchPage",
    method: 'post',
    data
  })
}

// 类目Tree
export function getRtsApiCategoryNode() {
  return request({
    url: "/rts/category/getRtsApiCategoryNode",
    method: 'post',
  })
}