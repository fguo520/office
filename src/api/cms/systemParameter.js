import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

// 查询
export function fetchList(params) {
  return request({
    url: '/sysBase/list',
    method: 'get',
    params: params
  })
}

// 添加
export function addData(data) {
  return request({
    url: '/sysBase/add',
    method: 'post',
    data
  })
}

// 获取顶级类型
export function getType() {
  return request({
    url: '/sysBase/listAll',
    method: 'get'
  })
}

//停用
export function updateStatus(params) {
  return request({
    url: `/sysBase/updateStatus`,
    method: 'post',
    params
  })
}


// 删除
export function deleteData(id) {
  return request({
    url: `/sysBase/delete/${id}`,
    method: 'post'
  })
}

// 日志
export function getSysParameterCodeLogList(params) {
  return request({
    url: `/sysBase/getSysParameterCodeLogList`,
    method: 'post',
    params
  })
}
