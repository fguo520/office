import createAxios from '@/utils/axios'
const request = createAxios(process.env.PMSV2_API)
const baseRequest = createAxios(process.env.BASE_API)
// 获取商品类别
export function productClassList() {
  return baseRequest({
    url: '/shApi/productClass/listAll',
    method: 'get'
  })
}
//获取ClientSku
export function getClientSku() {
  return request({
    url: '/lemonProduct/baseInfo/getClientSku',
    method: 'get',
  })
}
//获取商品属性
export function getProductCombType(params) {
  return request({
    url: '/lemonProduct/baseInfo/getProductCombType',
    method: 'get',
    params
  })
}
//获取人员信息
export function getDepartMentUseByCode(params) {
  return request({
    url: '/lemonProduct/baseInfo/getDepartMentUseByCode',
    method: 'post',
    params
  })
}
//获取推荐类别
export function getRecommClass(params) {
  return request({
    url: '/lemonProduct/baseInfo/getRecommClass',
    method: 'post',
    params
  })
}
//上传图片
export function upload(data) {
  return request({
    url: '/lemonProduct/baseInfoPic/upload',
    method: 'post',
    data
  })
}
//添加产品变体
export function addProductVariants(id, data) {
  // /lemonProduct/variants/addProductVariants/${id}/${muSku}/${muSkuName}
  return request({
    url: `/lemonProduct/variants/addProductVariants/${id}`,
    method: 'post',
    data
  })
}
//获取产品变体列表
export function searchVariants(params) {
  return request({
    url: `/lemonProduct/variants/searchVariants`,
    method: 'get',
    params
  })
}
//产品信息审核
export function reviewProduct(data) {
  return request({
    url: `/lemonProduct/variants/reviewProduct`,
    method: 'post',
    data
  })
}
//获取省份相关信息
export function getProvinceInfo(params) {
  return request({
    url: `/lemonProduct/appProduct/price/getProvinceInfo`,
    method: 'post',
    params
  })
}
//采集产品
export function collectProduct(params) {
  return request({
    url: `/lemonProduct/aliababa/collectProduct`,
    method: 'post',
    params
  })
}

// 商品备注上传文件
export function uploadFile(data) {
  return request({
    url: `/lemonProduct/baseInfo/upload`,
    method: 'post',
    data
  })
}

// 查看语言翻译
export function getTranslateData(params) {
  return request({
    url: `/lemonProduct/translate/getTranslateData`,
    method: 'post',
    params
  })
}
// 语言翻译提交
export function submitTranslation(data) {
  return request({
    url: `/lemonProduct/translate/submitTranslation`,
    method: 'post',
    data
  })
}
// 上传CE附件
export function uploadCeAttachment(data) {
  return request({
    url: `/lemonProduct/baseInfo/uploadCeAttachment`,
    method: 'post',
    data
  })
}
// 获取流程节点
export function getCircuit(params) {
  return request({
    url: `/lemonProduct/baseInfo/getCircuit`,
    method: 'get',
    params
  })
}

//商品库整合接口
export function commitSave(data) {
  return request({
    url: `/lemonProduct/integrate/save`,
    method: 'post',
    data
  })
}
//信息回显
export function reviewInfo(id) {
  return request({
    url: `/lemonProduct/integrate/view/${id}`,
    method: 'post',
  })
}
//编辑保存
export function editInfo(data) {
  return request({
    url: `/lemonProduct/integrate/edit`,
    method: 'post',
    data
  })
}
//新增商品价格
export function addSupplyPrice(data) {
  return request({
    url: `/lemonProduct/integrate/addSupplyPrice`,
    method: 'post',
    data
  })
}
//编辑商品价格
export function editSupplyPrice(data) {
  return request({
    url: `/lemonProduct/integrate/editSupplyPrice`,
    method: 'post',
    data
  })
}
//编辑商品价格
export function copyProduct(id) {
  return request({
    url: `/lemonProduct/integrate/copyProduct/${id}`,
    method: 'post',
  })
}
//获取翻译语种
export function getlanguagesApi() {
  return request({
    url: `/lemonProduct/integrate/getlanguages`,
    method: 'get',
  })
}
//删除文件
export function deleteOssFile(params) {
  return request({
    url: `/lemonProduct/integrate/deleteOssFile`,
    method: 'post',
    params
  })
}

//获取商品品牌
// export function getbrandTree() {
//   return request({
//     url: `/lemonProduct/integrate/getbrandTree`,
//     method: 'post',
//   })
// }
export function getbrandTree() {
  return baseRequest({
    url: `/public/brandInfo/getPublicBrandList`,
    method: 'get',
  })
}



// 供应商列表
export function getSupplierNameList() {
  return request({
    url: `/lemonProduct/aliababa/getSupplierNameList`,
    method: 'post',
  })
}
// 供应商名称查询
export function getSupplierDataMainName(params) {
  return request({
    url: `/lemonProduct/aliababa/getSupplierDataMainName`,
    method: 'post',
    params
  })
}
// 获取用户部门编号
export function getUserDepartMentCode() {
  return request({
    url: `/lemonProduct/integrate/getUserDepartMentCode`,
    method: 'post',
  })
}