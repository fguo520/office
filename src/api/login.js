import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)


export function login(username, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function fetchList(data) {
  return request({
    url: '/admin/list',
    method: 'post',
    data
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data,
  })
}

export function updateAdmin(id, data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
  })
}

export function getRoleByAdmin(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function allocRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}

//用户头像
export function userIcon() {
  return request({
    url: '/admin/userIcon',
    method: 'get'
  })
}
//修改密码
export function updatePassword(data) {
  return request({
    url: '/admin/updatePassword',
    method: 'post',
    data: data
  })
}
//回调页面、
export function callback() {
  return request({
    url: '/callback/lazada',
    method: 'get'
  })
}