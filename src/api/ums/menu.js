import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function fetchList(parentId, params) {
  return request({
    // url: '/menu/list/' + parentId,//原接口
    url: '/menu/treeListByPage/',
    method: 'get',
    params: params
  })
}
export function treeListMenu() {
  return request({
    url: '/menu/treeListMenu',
    method: 'get',
  })
}
export function deleteMenu(uuid) {
  return request({
    url: '/menu/delete/' + uuid,
    method: 'post'
  })
}

export function createMenu(data) {
  return request({
    url: '/menu/create',
    method: 'post',
    data: data
  })
}

export function updateMenu(uuid, data) {
  return request({
    url: '/menu/update/' + uuid,
    method: 'post',
    data: data
  })
}

export function getMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'get',
  })
}

export function updateHidden(uuid, params) {
  return request({
    url: '/menu/updateHidden/' + uuid,
    method: 'post',
    params: params
  })
}

export function fetchTreeList() {
  return request({
    url: '/menu/treeList',
    method: 'get'
  })
}

// export function fetchTreeList() {
//   return request({
//     url: '/permission/treeList',
//     method: 'get'
//   })
// }

export function createPermissionBtn(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: data
  })
}

export function updatePermissionBtn(id, data) {
  return request({
    url: '/permission/update/' + id,
    method: 'post',
    data: data
  })
}
export function queryPermissionById(id, params) {
  return request({
    url: '/permission/queryPermissionById/' + id,
    method: 'get',
    params: params
  })
}


