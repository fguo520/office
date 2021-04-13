import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)

//分页
export function getList(data) {
    return request({
        url: '/shApi/AmazonListing/list',
        method: 'post',
        data
    })
}
//日志
export function getLoglist(data) {
    return request({
        url: '/shApi/AmazonListing/loglist',
        method: 'post',
        data
    })
}


//状态
export function getListingStatus(params) {
    return request({
        url: '/shApi/AmazonListing/getListingStatus',
        method: 'post',
        params
    })
}


//展示变体
export function showVariation(params) {
    return request({
        url: `/shApi/AmazonListing/showVariation`,
        method: 'post',
        params
    })
}
//上家人员
export function getListingData(params) {
    return request({
        url: `/shApi/AmazonListing/getListingData`,
        method: 'post',
        params
    })
}