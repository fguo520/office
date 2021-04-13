import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

export function getList(data) {
    return request({
        url: '/shApi/AliexpressListing/list',
        method: 'post',
        data
    })
}
export function getLoglist(data) {
    return request({
        url: '/shApi/AliexpressListing/loglist',
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
export function getListingData(params) {
    return request({
        url: `/shApi/AliexpressListing/getListingData`,
        method: 'post',
        params
    })
}

//展示变体
export function showVariation(params) {
    return request({
        url: `/shApi/AliexpressListing/showVariation`,
        method: 'post',
        params
    })
}
//搜索条件

export function searchType(itemID) {
    return request({
        url: `/shApi/AliexpressListing/searchType`,
        method: 'get'
    })
}

// 日期搜索类型
export function dateSearchType() {
    return request({
        url: `/shApi/AliexpressListing/dateSearchType`,
        method: 'get'
    })
}


// 批量搜索类型
export function batchSearchType() {
    return request({
        url: `/shApi/AliexpressListing/batchSearchType`,
        method: 'get'
    })
}

//渠道
export function listingOrderSourceType() {
    return request({
        url: "/shApi/AliexpressListing/listingOrderSourceType",
        method: "post",
    })
}
// 获取渠道列表树状信息
export function getOrderSourceTree(data) {
    return request({
      url: '/shApi/orderSource/getOrderSourceTree',
      method: 'post',
      data
    })
  }