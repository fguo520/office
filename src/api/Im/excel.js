import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

//删除报表
export function deleteData(id) {
  return request({
    url: '/lmtask/delete/' + id,
    method: 'post',
  })
}

//数据类型
export function getSysParameterCodeList(params) {
  return request({
    url: '/sysBase/getSysParameterCodeList',
    method: 'get',
    params: params
  })
}

// 查询分页列表
export function getLmTaskList(data) {
  return request({
    url: '/lmtask/getLmTaskList',
    method: 'post',
    data
  })
}