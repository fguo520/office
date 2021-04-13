import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getList(data) {
    return request({
        url: '/shApi/eBayListing/list',
        method: 'post',
        data
    })
}
export function eBayShelfPersonList(params) {
    return request({
        url: `/shApi/eBayListing/eBayShelfPersonList/`,
        method: 'get',
        params
    })
}
export function getLoglist(data) {
    return request({
        url: '/shApi/eBayListing/loglist',
        method: 'post',
        data
    })
}
export function infoByItemID(itemID) {
    return request({
        url: `/shApi/AliexpressListing/infoByItemID/${itemID}`,
        method: 'get'
    })
}
export function getListingStatus(params) {
    return request({
        url: `/shApi/AliexpressListing/getListingStatus`,
        method: 'post',
        params
    })
}
//展示变体
export function showVariation(params) {
    return request({
        url: `/shApi/eBayListing/showVariation`,
        method: 'post',
        params
    })
}
// 日期搜索类型
export function dateSearchType() {
    return request({
        url: `/shApi/eBayListing/dateSearchType`,
        method: 'get'
    })
}


// 批量搜索类型
export function batchSearchType() {
    return request({
        url: `/shApi/eBayListing/batchSearchType`,
        method: 'get'
    })
}
// 站点搜索类型
export function eBaysiteCodeList() {
    return request({
        url: `/shApi/eBayListing/eBaysiteCodeList`,
        method: 'get'
    })
}
//根据站点查询渠道
export function orderSourceBySiteCode(params) {
    return request({
        url: `/shApi/eBayListing/orderSourceBySiteCode`,
        method: 'post',
        params
    })
}
export function getListingData(params) {
    return request({
        url: `/shApi/AliexpressListing/getListingData`,
        method: 'post',
        params
    })
}
