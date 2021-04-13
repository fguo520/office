import createAxios from '@/utils/axios'
const request = createAxios(process.env.AMAZON_API)

//获取列表
export function page(data) {
  return request({
    url: `/amazon/amazonTask/taskPage`,
    method: 'post',
    data
  })
}

//获取操作人列表
export function operator() {
  return request({
    url: `/amazon/amazonTask/operationList`,
    method: 'get',
  })
}
// 查询亚马逊国家列表
export function searchSysParameterCode() {
  return request({
    url: `/amazon/amazonCatalogs/searchSysParameterCode`,
    method: 'post',
  })
}
//任务类型列表
export function searchTaskTypeList() {
  return request({
    url: `/amazon/amazonTask/searchTaskTypeList`,
    method: 'post',
  })
}

