import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)


//公告列表
export function getList(data) {
  return request({
    url: "/public/announcement/getPublicAnnouncementList",
    method: "post",
    data
  })
}
//日志列表
export function log(params) {
  return request({
    url: "/public/announcement/getPublicAnnouncementLog",
    method: "post",
    params
  })
}
//删除
export function deleteAnnouncement(params) {
  return request({
    url: "/public/announcement/deleteAnnouncement",
    method: "post",
    params
  })
}
//审核公告
export function reviewAnnouncement(data) {
  return request({
    url: "/public/announcement/reviewAnnouncement",
    method: "post",
    data
  })
}
//公告发布
export function releaseAnnouncement(data) {
  return request({
    url: "/public/announcement/releaseAnnouncement",
    method: "post",
    data
  })
}
//新增修改公告
export function saveAnnouncement(data) {
  return request({
    url: "/public/announcement/saveAnnouncement",
    method: "post",
    data
  })
}
//公告已读
export function readAnnouncement(params) {
  return request({
    url: "/public/announcement/readAnnouncement",
    method: "post",
    params
  })
}
//公告弹窗
export function getPublicAnnouncement() {
  return request({
    url: "/public/announcement/getPublicAnnouncement",
    method: "post",
  })
}