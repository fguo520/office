
import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

// 公共敏感词列表
export function list(data) {
  return request({
    url: '/public/sensitiveword/list',
    method: 'post',
    data
  })
}


// 删除敏感词
export function deleteSensitiveWord(data) {
  return request({
    url: '/public/sensitiveword/deleteSensitiveWord',
    method: 'post',
    data
  })
}

// 获取授权平台信息
export function getSensitiveWordPlatform() {
  return request({
    url: '/public/sensitiveword/getSensitiveWordPlatform',
    method: 'get',
  })
}

// 获取敏感词类型
export function getSensitiveWordType() {
  return request({
    url: '/public/sensitiveword/getSensitiveWordType',
    method: 'get',
  })
}


// 获取敏感词模板
export function getTemplateUrl() {
  return request({
    url: '/public/sensitiveword/getTemplateUrl',
    method: 'get',
  })
}

// 添加敏感词
export function saveSensitiveWord(data) {
  return request({
    url: '/public/sensitiveword/saveSensitiveWord',
    method: 'post',
    data
  })
}
// 导入文件
export function importSensitiveWord(data) {
  return request({
    url: "/public/sensitiveword/importSensitiveWord",
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}