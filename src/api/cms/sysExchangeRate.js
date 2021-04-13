import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
//分页
export function juheList(params) {
  return request({
    url: '/juhe/list',
    method: 'post',
    data: params
  })
}
//日志
export function juhegetLogList(params) {
  return request({
    url: '/juhe/getLogList',
    method: 'post',
    data: params
  })
}
//更新
export function juheSave() {
  return request({
    url: '/juhe/save',
    method: 'post',
  })
}

//货币列表
export function juhegetJuheNameList() {
  return request({
    url: '/juhe/getJuheNameList',
    method: 'post',
  })
}