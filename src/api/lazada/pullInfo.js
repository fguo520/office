import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getList(params) {
  return request({
    url: '/admin/platform/pull/getPlatformPullDataList',
    method: 'get',
    params
  })
}

export function addPullDataTask(data) {
  return request({
    url: '/admin/platform/pull/addPullDataTask',
    method: 'post',
    data
  })
}

//获取平台
export function getSysParameterName(params) {
  return request({
    url: '/sysBase/getSysParameterName',
    method: 'get',
    params
  })
}
//店铺

export function getLmSysPlatformAuthList(params) {
  return request({
    url: '/product/getLmSysPlatformAuthList',
    method: 'post',
    params
  })
}