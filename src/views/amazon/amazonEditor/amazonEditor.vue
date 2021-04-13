<template>
  <div class="allMain">
    <el-row :gutter="20">
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <div style="margin-top:15px"></div>
          <li class="filter-nav filter-li" v-for="(item,index)  in  navTab" :key="index" :class="{'active':currentSort==index}" @click="active(index,item.value)">
            <span>{{item.label}}</span>
          </li>
        </div>
      </el-col>
      <el-col :span="22">
        <div class="grid-content bg-purple-light">
          <div class="main-title" v-if="this.routeStatus==0||this.routeStatus==1||this.routeStatus==2">查看刊登商品</div>
          <div class="main-title" v-else>编辑刊登商品</div>
          <div style="margin-top:15px"></div>
          <div class="main" id="main">
            <div class="main_top">
              <li class="filter-nav" id="A">
                <el-divider content-position="left">基本信息</el-divider>
              </li>
            </div>
            <div>
              <el-form ref="form" :model="listQuery" label-width="120px" inline :rules="rules" size="mini">
                <el-form-item label="渠道：" prop="authId">
                  <el-select v-model="listQuery.authId" placeholder="请选择" @change="authIdChange" filterable>
                    <el-option v-for="(item,index) in typeList.authIdList" :key="index" :label="item.storeNameAs" :value="item.id" />
                  </el-select>
                </el-form-item><br />
                <el-form-item label="系统SKU：" prop="sku">
                  <el-input v-model="listQuery.sku" style="width:193px;" @change="skuChange" />
                  <span v-show="listQuery.productstate" style="margin-left:10px">产品状态：<span :style="getProductstate(listQuery.productstate)" v-html="listQuery.productstate"></span></span>
                  <span v-show="listQuery.productproperty" style="margin-left:10px">侵权风险：<span :style="getProductproperty(listQuery.productproperty)" v-html="listQuery.productproperty"></span></span>
                </el-form-item><br />
                <el-form-item label="产品语种：">
                  <el-select v-model="listQuery.languageChoose" placeholder="请选择" filterable @change="languageChooseChange">
                    <el-option v-for="(item,index) in typeList.languageChooseList" :key="index" :label="item" :value="item" />
                  </el-select>
                </el-form-item><br />
                <el-form-item label="负 责 人：" prop="accountOwner">
                  <span v-copy="listQuery.accountOwner" class="title_style">{{listQuery.accountOwner}}</span>
                </el-form-item><br />
                <el-form-item label="白底校验：" prop="isCheckPic">
                  <el-radio-group v-model="listQuery.isCheckPic">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                  </el-radio-group>
                </el-form-item><br />
                <el-form-item label="是否变体：" prop="fullClassNameEn">
                  <!-- <el-radio-group v-model="listQuery.isVariation" disabled>
                    <el-radio :label="false">单体</el-radio>
                    <el-radio :label="true">多变体</el-radio>
                  </el-radio-group> -->
                  <span v-copy="listQuery.isVariation?'多变体':'单体'" class="title_style">{{listQuery.isVariation?"多变体":"单体"}}</span>
                </el-form-item><br>

                <div v-if="listQuery.isVariation">
                  <el-form-item label="母体SKU：" prop="parent_sku">
                    <!-- <el-input v-model="listQuery.parent_sku" style="width:193px;" disabled /> -->
                    <span v-copy="listQuery.parent_sku" class="title_style">{{listQuery.parent_sku}}</span>
                  </el-form-item><br />
                </div>
                <el-form-item label="中文名称：" prop="productnamecn">
                  <!-- <el-input v-model="listQuery.productnamecn" maxlength="200" show-word-limit class="inputLegth" disabled /> -->
                  <span v-copy="listQuery.productnamecn" class="title_style">{{listQuery.productnamecn}}</span>
                </el-form-item><br>
                <el-form-item label="英文名称：" prop="productname">
                  <!-- <el-input v-model="listQuery.productname" maxlength="200" show-word-limit class="inputLegth" disabled /> -->
                  <span v-copy="listQuery.productname" class="title_style">{{listQuery.productname}}</span>
                </el-form-item><br>
                <el-form-item label="产品分类：" prop="fullClassNameEn">
                  <!-- <el-input v-model="listQuery.fullClassNameEn" disabled class="inputLegth" /> -->
                  <span v-copy="listQuery.fullClassNameEn" class="title_style">{{listQuery.fullClassNameEn}}</span>
                </el-form-item><br />
                <el-form-item label="平台类目：" prop="owenCatagory">
                  <el-cascader :props="categoryProps" v-model="listQuery.owenCatagory" filterable ref="categoryCascader" @change="categoryChange" :key="cascaderKey" style="width:500px">
                    <template #default="{ data }">
                      <el-tooltip class="item" effect="dark" :content="data.productCategoryNameEn" placement="left">
                        <span>{{ data.productCategoryNameCn }}</span>
                      </el-tooltip>
                      <span style="color:red;" v-if="data.isChild && !data.ossUrl">(未维护)</span>
                    </template>
                  </el-cascader>
                </el-form-item><br />
                <div v-if="listQuery.owenCatagory.length>0">
                  <div v-if="listQuery.isVariation">
                    <el-form-item label="变体类型：" prop="variationTheme">
                      <el-select v-model="listQuery.variationTheme" placeholder="请选择" filterable>
                        <el-option v-for="(item,index) in typeList.variationThemeList" :key="index" :label="item" :value="item" />
                      </el-select>
                    </el-form-item><br />
                  </div>
                  <el-form-item label="产品品牌：" prop="brand_name">
                    <el-select v-model="listQuery.brand_name" placeholder="请选择" filterable @change="brandChange">
                      <el-option v-for="(item,index) in typeList.brandList" :key="index" :label="item.brandName" :value="item.brandName" />
                    </el-select>
                    <span style="margin-left:10px">
                      <el-checkbox v-model="checked" @change="checkedChange">是否带入标题</el-checkbox>
                    </span>
                  </el-form-item><br />
                  <el-form-item label="关 键 词：" prop="generic_keywords">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="listQuery.generic_keywords" maxlength="250" show-word-limit class="inputLegth" />
                  </el-form-item><br />
                  <el-form-item label="产品特点1：">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="listQuery.bullet_point1" maxlength="500" show-word-limit class="inputLegth" />
                  </el-form-item><br />
                  <el-form-item label="产品特点2：">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="listQuery.bullet_point2" maxlength="500" show-word-limit class="inputLegth" />
                  </el-form-item><br />
                  <el-form-item label="产品特点3：">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="listQuery.bullet_point3" maxlength="500" show-word-limit class="inputLegth" />
                  </el-form-item><br />
                  <el-form-item label="产品特点4：">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="listQuery.bullet_point4" maxlength="500" show-word-limit class="inputLegth" />
                  </el-form-item><br />
                  <el-form-item label="产品特点5：">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="listQuery.bullet_point5" maxlength="500" show-word-limit class="inputLegth" />
                  </el-form-item><br />
                </div>
              </el-form>
            </div>
            <div class="main_bottom">
              <li class="filter-nav" id="B">
                <el-divider content-position="left">刊登信息</el-divider>
              </li>
            </div>
            <div v-if="!listQuery.isVariation" key="1">
              <AttributeForm :formObj="listQuery.productInfoDetailParams[0]" ref="attributeForm" />
            </div>
            <div v-else key="2">
              <el-tabs tab-position="left">
                <el-tab-pane :label="item.title" v-for="(item,index) in listQuery.productInfoDetailParams" :key="index">
                  <AttributeForm :formObj="item" :ref="`attributeForm${index}`" @upc="upcChange" />
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div style="text-align:center; margin:30px 0;">
            <el-button @click="onSubmit(0)" :loading="saveButtonLoding" v-if="handRoute(this.routeStatus)">保存至草稿</el-button>
            <el-button @click="close">关闭页面</el-button>
            <el-button type="primary" @click="onSubmit(1)" :loading="commitButtonLoding" v-if="handRoute(this.routeStatus)">提交刊登</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getAuthorlist, getCategorylist, getSkuinfo, attribute, getBrand, save, detail } from "@/api/amazon/amazonEditor"
import { Tinymce } from "@/components";
import AttributeForm from './components/AttributeForm'
import DynamicFormItem from "./components/DynamicFormItem"
import UploadImage from "./components/UploadImage"
const defaultListQuery = {
  authId: null,
  sku: "",
  productnamecn: "",
  productname: "",
  fullClassNameEn: "",
  productstate: "",
  productproperty: "",
  owenCatagory: "",
  isVariation: false,
  languageChoose: "",
  productInfoDetailParams: [],
  variationTheme: "",
  parent_sku: "",
  id: null,
  accountOwner: "",
  isCheckPic: false,
  brand_name: "",
  generic_keywords: "",
  bullet_point1: "",
  bullet_point2: "",
  bullet_point3: "",
  bullet_point4: "",
  bullet_point5: "",
}
const defaultFormObj = {
  addFormItemList: {},
}
export default {
  name: "amazonEditor",
  props: {
    routeId: {
      type: undefined,
      default: "",
    },
    routeStatus: {
      type: undefined,
      default: "",
    },
  },
  data() {
    return {
      navTab: [{ label: "基本信息", value: "A" }, { label: "刊登信息", value: "B" },],
      currentSort: 0,
      listQuery: Object.assign({}, defaultListQuery),
      typeList: {
        authIdList: [],
        categoryList: [],
        languageChooseList: [],
        brandList: [],
        isCheckPicList: [{ label: "是", value: true }, { label: "否", value: false }],
        variationThemeList: []
      },
      rules: {
        authId: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        sku: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        productname: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        productnamecn: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        fullClassNameEn: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        owenCatagory: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        fullClassNameEn: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        variationTheme: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        parent_sku: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        accountOwner: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        isCheckPic: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        brand_name: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        generic_keywords: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        bullet_point1: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        bullet_point2: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        bullet_point3: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        bullet_point4: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        bullet_point5: [{ required: true, message: '此项为必填项', trigger: 'change' }],
      },
      cascaderKey: 1,
      categoryProps: {
        lazy: true,
        label: 'productCategoryNameCn',
        value: 'productCategoryId',
        leaf: 'isChild',
        lazyLoad: async (node, resolve) => {
          const { value } = node;
          if (this.listQuery.sku && this.listQuery.authId) {
            const res = await getCategorylist({ parentCategory: value || 0, platformAuthId: this.listQuery.authId, sku: this.listQuery.sku })
            resolve(res.data)
          } else {
            resolve([])
            return
          }
        }
      },
      formObj: Object.assign({}, defaultFormObj),
      unitObj: {},
      submitType: 0,
      saveButtonLoding: false,
      commitButtonLoding: false,
      amazonImg: [
        // { filedName: "main_image_url", localLabelName: "Main Image URL", value: "" },
        // { filedName: "other_image_url1", localLabelName: "Other Image Url1", value: "" },
        // { filedName: "other_image_url2", localLabelName: "Other Image Url2", value: "" },
        // { filedName: "other_image_url3", localLabelName: "Other Image Url3", value: "" },
        // { filedName: "other_image_url4", localLabelName: "Other Image Url4", value: "" },
        // { filedName: "other_image_url5", localLabelName: "Other Image Url5", value: "" },
        // { filedName: "other_image_url6", localLabelName: "Other Image Url6", value: "" },
        // { filedName: "other_image_url7", localLabelName: "Other Image Url7", value: "" },
        // { filedName: "other_image_url8", localLabelName: "Other Image Url8", value: "" },
      ],
      checked: false
    }
  },
  components: { Tinymce, DynamicFormItem, UploadImage, AttributeForm },
  // beforeDestroy() {
  //   document.getElementById("main").removeEventListener("scroll")
  // },
  computed: {
    handRoute() {
      return function (type) {
        switch (type) {
          case 0: return false;
          case 1: return false;
          case 2: return false;
          case 3: return true;
          case 4: return true;
          default: return true;
        }
      }
    },
    getProductstate() {
      return function (type) {
        switch (type) {
          case "正常":
            return { backgroundColor: "#16c067", color: "#fff", padding: "5px 10px", borderRadius: "5px" };
          case "起批量":
            return { backgroundColor: "#00b0f5", color: "#fff", padding: "5px 10px", borderRadius: "5px" };
          case "暂时缺货":
            return { backgroundColor: "#d4c80a", color: "#fff", padding: "5px 10px", borderRadius: "5px" };
          case "清库":
            return { backgroundColor: "#fb9320", color: "#fff", padding: "5px 10px", borderRadius: "5px" };
          case "锁定":
            return { backgroundColor: "#a3a3a3", color: "#fff", padding: "5px 10px", borderRadius: "5px" };
          case "停产":
            return { backgroundColor: "#e0514d", color: "#fff", padding: "5px 10px", borderRadius: "5px" };
          default:
            return { backgroundColor: "#e0514d", color: "#fff", };
        }
      };
    },
    getProductproperty() {
      return function (type) {
        switch (type) {
          default:
            return { backgroundColor: "rgba(0, 139, 139, 1)", color: "#fff", padding: "5px 10px", borderRadius: "5px" }
        }
      }
    },
  },
  created() {
    this.getType()
  },
  mounted() {
    document.getElementById("main").addEventListener("scroll", () => {
      var offset_top = document.getElementById("main").scrollTop;
      if (offset_top == 0) { this.currentSort = 0 } else if (offset_top > 450) { this.currentSort = 1 }
    })
  },
  methods: {
    active(index, value) {
      this.currentSort = index;
      if (!this.listQuery.isVariation) {
        if (value == "B") { document.getElementById("main").scrollTop = 450 } else { document.getElementById("main").scrollTop = 0 }
      } else {
        if (value == "B") { document.getElementById("main").scrollTop = 550 } else { document.getElementById("main").scrollTop = 0 }
      }
    },
    async getType() {
      const productId = this.routeId ? this.routeId : ""
      const resAll = await Promise.all([getAuthorlist({ productId })])
      this.typeList.authIdList = resAll[0].data
      if (this.routeId) {
        const res = await detail({ id: this.routeId })
        const { owenCatagory, ...query } = res.data
        this.listQuery = {
          ...this.listQuery,
          ...query,
          authId: res.data.platformAuthDetailId,
          owenCatagory: JSON.parse(owenCatagory),
          fullClassNameEn: res.data.platfromCatagory,
          parent_sku: res.data.parentSku,
          id: this.routeId,
          brand_name: res.data.productInfoDetailParams[0].required.find(i => { return i.filedName == "brand_name" }).value,
          bullet_point1: res.data.productInfoDetailParams[0].discovery.find(i => { return i.filedName == "bullet_point1" }).value,
          bullet_point2: res.data.productInfoDetailParams[0].discovery.find(i => { return i.filedName == "bullet_point2" }).value,
          bullet_point3: res.data.productInfoDetailParams[0].discovery.find(i => { return i.filedName == "bullet_point3" }).value,
          bullet_point4: res.data.productInfoDetailParams[0].discovery.find(i => { return i.filedName == "bullet_point4" }).value,
          bullet_point5: res.data.productInfoDetailParams[0].discovery.find(i => { return i.filedName == "bullet_point5" }).value,
          generic_keywords: res.data.productInfoDetailParams[0].discovery.find(i => { return i.filedName == "generic_keywords" }).value,
        }
        this.typeList.languageChooseList = res.data.translateLanguages
        this.typeList.variationThemeList = res.data.variantTemple
        this.amazonImg = res.data.productInfoDetailParams[0].images
        console.log(this.amazonImg)
        this.listQuery.productInfoDetailParams.forEach((item, index) => {
          item.productdescription = item.basic.find(i => { return i.filedName == 'product_description' }).value
          item.addFormItemList = {
            required: item.required || [],
            b2b: item.b2b || [],
            basic: item.basic || [],
            compliance: item.compliance || [],
            dimensions: item.dimensions || [],
            discovery: item.discovery || [],
            fulfillment: item.fulfillment || [],
            offer: item.offer || [],
          }
          item.addFormItemList['required'].unshift(item.addFormItemList.required.splice(item.addFormItemList.required.findIndex(text => { return text.filedName == "item_name" }), 1)[0])
          item.title = `${item.sku} ${item.productState} ${item.productSize} ${item.productColor}`
          item.skuObject = {
            sku: JSON.parse(JSON.stringify(item.sku)),
            authId: this.listQuery.authId,
            length: this.listQuery.productInfoDetailParams.length,
            id: this.listQuery.id
          }
          item.basic.splice(item.basic.findIndex(i => i.filedName == "product_description"), 1)
          if (this.listQuery.isVariation) {
            this.$nextTick(() => {
              this.$refs[`attributeForm${index}`].tinymceReset = true
            })
          } else {
            this.$refs.attributeForm.tinymceReset = true
          }
        })
        ++this.cascaderKey
        if (this.listQuery.productInfoDetailParams[0].addFormItemList.required.find(i => { return i.filedName == "item_name" }).value.indexOf(this.listQuery.brand_name) != -1) {
          this.checked = true
        } else {
          this.checked = false
        }
        const resBrand = await Promise.all([getBrand({ platformAuthId: this.listQuery.authId })])
        this.typeList.brandList = resBrand[0].data
      }
    },
    async authIdChange() {
      this.formObj = Object.assign({}, defaultFormObj)
      this.listQuery.owenCatagory = []
      this.listQuery.productInfoDetailParams = []
      this.listQuery.accountOwner = this.typeList.authIdList.find(i => { return i.id == this.listQuery.authId }).accountOwner || ""
      const resBrand = getBrand({ platformAuthId: this.listQuery.authId })
      const res = await Promise.all([resBrand])
      this.typeList.brandList = res[0].data
      this.listQuery.brand_name = this.typeList.brandList.length > 0 ? this.typeList.brandList[0].brandName : ""
      if (!this.listQuery.sku) return
      this.skuChange()
    },
    async languageChooseChange() {
      this.skuChange()
    },
    async categoryChange(value) {
      const owenCatagory = value.slice(-1)[0]
      const res = await attribute({ categoryId: owenCatagory, platformAuthId: this.listQuery.authId })
      res.data.required.splice(res.data.required.findIndex(item => { return item.filedName == "main_image_url" }), 1)
      res.data.required.splice(res.data.required.findIndex(item => { return item.filedName == "brand_name" }), 1)
      res.data.discovery.splice(res.data.discovery.findIndex(item => { return item.filedName == "bullet_point1" }), 1)
      res.data.discovery.splice(res.data.discovery.findIndex(item => { return item.filedName == "bullet_point2" }), 1)
      res.data.discovery.splice(res.data.discovery.findIndex(item => { return item.filedName == "bullet_point3" }), 1)
      res.data.discovery.splice(res.data.discovery.findIndex(item => { return item.filedName == "bullet_point4" }), 1)
      res.data.discovery.splice(res.data.discovery.findIndex(item => { return item.filedName == "bullet_point5" }), 1)
      res.data.discovery.splice(res.data.discovery.findIndex(item => { return item.filedName == "generic_keywords" }), 1)
      res.data.basic.splice(res.data.basic.findIndex(item => { return item.filedName == "product_description" }), 1)
      for (let i in res.data) {
        res.data[i].forEach((item, index) => {
          item.showType = item.attributeValues == "" ? "input" : "select"
          item.value = ""
          item.attributeValues = item.attributeValues
          item.required = item.required
        })
      }
      this.formObj.addFormItemList = res.data
      this.amazonImg = res.data.images
      this.typeList.variationThemeList = JSON.parse(res.data.variation.find(i => { return i.filedName == "variation_theme" }).attributeValues)
      this.listQuery.productInfoDetailParams = this.listQuery.productInfoDetailParams.map((item, index) => ({
        ...item,
        skuObject: {
          sku: JSON.parse(JSON.stringify(this.listQuery.sku)),
          authId: JSON.parse(JSON.stringify(this.listQuery.authId)),
          length: this.listQuery.productInfoDetailParams.length
        },
        addFormItemList: JSON.parse(JSON.stringify(res.data)),
        usedSellerSku: this.unitObj[index].usedSellerSku
      }))
      this.listQuery.productInfoDetailParams.forEach((i, index) => {
        i.addFormItemList['required'].unshift(i.addFormItemList.required.splice(i.addFormItemList.required.findIndex(text => { return text.filedName == "item_name" }), 1)[0])
        delete i.addFormItemList['variation']
        delete i.addFormItemList['images']
        for (let j in i.addFormItemList) {
          i.addFormItemList[j].forEach((item) => {
            switch (true) {
              case item.filedName == "item_sku": item.value = this.unitObj[index].sellerSku; break;
              case item.filedName == "external_product_id_type": item.value = "UPC"; break;
              case item.filedName == "quantity": item.value = 100; break;
              case item.filedName == "condition_type": item.value = "New"; break;
              case item.filedName == "recommended_browse_nodes": item.value = JSON.parse(item.attributeValues)[0] || ''; break;
              case item.filedName == "fulfillment_center_id": item.value = "DEFAULT"; break;
              case item.filedName == "feed_product_type": item.value = JSON.parse(item.attributeValues)[0] || ''; break;
              case item.filedName == "item_name": item.value = this.unitObj[index].productname.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()) || ""; break;
              case item.filedName == "item_length": item.value = this.unitObj[index].length; break;
              case item.filedName == "item_width": item.value = this.unitObj[index].width; break;
              case item.filedName == "item_height": item.value = this.unitObj[index].height; break;
              case item.filedName == "item_weight": item.value = this.unitObj[index].weight; break;
              case item.filedName == "item_length_unit_of_measure": item.value = "CM"; break;
              case item.filedName == "item_width_unit_of_measure": item.value = "CM"; break;
              case item.filedName == "item_height_unit_of_measure": item.value = "CM"; break;
              case item.filedName == "item_weight_unit_of_measure": item.value = "GR"; break;
              case item.filedName == "package_length": item.value = this.unitObj[index].packLength; break;
              case item.filedName == "package_width": item.value = this.unitObj[index].packWidth; break;
              case item.filedName == "package_height": item.value = this.unitObj[index].packHeight; break;
              case item.filedName == "package_weight": item.value = this.unitObj[index].packWeight; break;
              case item.filedName == "package_length_unit_of_measure": item.value = "CM"; break;
              case item.filedName == "package_width_unit_of_measure": item.value = "CM"; break;
              case item.filedName == "package_height_unit_of_measure": item.value = "CM"; break;
              case item.filedName == "package_weight_unit_of_measure": item.value = "GR"; break;
              case item.filedName == "color_name": item.value = this.unitObj[index].productcolor; break;
              case item.filedName == "size_name": item.value = this.unitObj[index].productsize; break;
              case item.filedName == "offering_start_date": item.showType = "time"; break;
              case item.filedName == "sale_end_date": item.showType = "time"; break;
              case item.filedName == "sale_from_date": item.showType = "time"; break;
              case item.filedName == "restock_date": item.showType = "time"; break;
              case item.filedName == "merchant_release_date": item.showType = "time"; break;
              case item.filedName == "product_site_launch_date": item.showType = "time"; break;
              case item.filedName == "offering_end_date": item.showType = "time"; break;
              case item.filedName == "manufacturer": item.value = this.listQuery.brand_name; break;
              case item.filedName == "part_number": item.value = i.addFormItemList['required'].find(text => { return text.filedName == "item_sku" }).value || ""; break;
              default: break;
            }
          })
        }
      })
    },
    checkedChange() {
      if (this.checked) {
        this.listQuery.productInfoDetailParams.forEach((i, index) => {
          const value = i.addFormItemList.required.find(j => { return j.filedName == "item_name" }).value
          i.addFormItemList.required.find(j => { return j.filedName == "item_name" }).value = this.listQuery.brand_name + value
        })
      } else {
        this.listQuery.productInfoDetailParams.forEach((i, index) => {
          const value = i.addFormItemList.required.find(j => { return j.filedName == "item_name" }).value
          i.addFormItemList.required.find(j => { return j.filedName == "item_name" }).value = value.split(this.listQuery.brand_name).join('')
        })
      }
    },
    async skuChange() {
      ++this.cascaderKey
      if (!this.listQuery.authId) return this.$message.warning("请选择渠道")
      this.formObj = Object.assign({}, defaultFormObj)
      this.listQuery.owenCatagory = []
      this.listQuery.productInfoDetailParams = []
      const { listQuery, formObj, typeList } = this;
      try {
        const res = await getSkuinfo({ sku: this.listQuery.sku, platformAuthDetailId: this.listQuery.authId, languageChoose: this.listQuery.languageChoose })
        this.unitObj = res.data.skuInfoList
        const data = res.data.skuInfoList[0]
        listQuery.productnamecn = data.productnamecn || ""
        listQuery.productname = data.productname || ""
        listQuery.fullClassNameEn = data.fullClassNameEn || ""
        listQuery.productstate = data.productstate || ""
        listQuery.productproperty = data.productproperty || ""
        listQuery.parent_sku = `${data.sellerSku}-p` || ""
        listQuery.isVariation = res.data.skuInfoList.length > 1 ? true : false
        listQuery.generic_keywords = data.searchKeyword || ""
        listQuery.bullet_point1 = data.featureList[0] || ""
        listQuery.bullet_point2 = data.featureList[1] || ""
        listQuery.bullet_point3 = data.featureList[2] || ""
        listQuery.bullet_point4 = data.featureList[3] || ""
        listQuery.bullet_point5 = data.featureList[4] || ""
        typeList.languageChooseList = res.data.translateLanguages
        res.data.skuInfoList.forEach((item, index) => {
          listQuery.productInfoDetailParams.push({
            images: JSON.parse(JSON.stringify(item.images.slice(0, 9).map(i => ({ value: i })))),
            productdescription: JSON.parse(JSON.stringify(item.productdescription)),
            addFormItemList: JSON.parse(JSON.stringify(formObj.addFormItemList)),
            title: `${item.sku} ${item.productstate} ${item.productsize} ${item.productcolor}`,
            sku: item.sku
          })
          if (this.unitObj.length > 1) {
            this.$nextTick(() => {
              this.$refs[`attributeForm${index}`].tinymceReset = true
            })
          } else {
            this.$refs.attributeForm.tinymceReset = true
          }
        })
        // switch (true) {
        //   case data.productsize !== "": listQuery.variationTheme = "size"; break;
        //   case data.productcolor !== "": listQuery.variationTheme = "color"; break;
        //   case data.productsize !== "" && data.productcolor !== "": listQuery.variationTheme = "color-size"; break;
        //   default: listQuery.variationTheme = ""; break;
        // }
      } catch (error) { }
    },
    async onSubmit(submitType) {
      this.submitType = submitType;
      try {
        const { $message, amazonImg, listQuery } = this;
        let productInfoDetailParams = JSON.parse(JSON.stringify(listQuery.productInfoDetailParams))
        let imagesArr = []
        let productdescriptionArr = []
        productInfoDetailParams.forEach(item => {
          imagesArr.push(item.images.map(i => i.value).length)
          productdescriptionArr.push(item.productdescription.length)
        })
        const imgTrue = imagesArr.every(i => { return i >= 1 })
        const productdescriptionTrue = productdescriptionArr.every(i => { return i <= 2000 })
        if (!imgTrue) {
          $message.warning(`请为每个变体sku插入至少1张图片`);
          return
        }
        if (!productdescriptionTrue) {
          $message.warning(`变体商品描述最多为2000字`);
          return
        }
        productInfoDetailParams.forEach(item => {
          amazonImg.forEach((i, j) => {
            i.value = item.images[j] ? item.images[j].value : ''
          })
          console.log(1)
          item.addFormItemList['images'] = JSON.parse(JSON.stringify(amazonImg))
          console.log(1)
          item.addFormItemList['brand'] = this.listQuery.brand_name || ""
          console.log(1)
          const feed_product_type = item.addFormItemList.required.find(i => { return i.filedName == "feed_product_type" })
          item.addFormItemList['feedProductType'] = feed_product_type ? feed_product_type.value : ""
          console.log(1)
          const currency = item.addFormItemList.required.find(i => { return i.filedName == "currency" })
          item.addFormItemList['currency'] = currency ? currency.value : ""
          console.log(1)
          const fulfillment_center_id = item.addFormItemList.required.find(i => { return i.filedName == "fulfillment_center_id" })
          item.addFormItemList['fulfillmentCenterId'] = fulfillment_center_id ? fulfillment_center_id.value : ""
          console.log(1)
          const main_image_url = item.addFormItemList.images.find(i => { return i.filedName == "main_image_url" })
          item.addFormItemList['mainImage'] = main_image_url ? main_image_url.value : ""
          console.log(1)
          const manufacturer = item.addFormItemList.required.find(i => { return i.filedName == "manufacturer" })
          item.addFormItemList['manufacturer'] = manufacturer ? manufacturer.value : ""
          console.log(1)
          const quantity = item.addFormItemList.required.find(i => { return i.filedName == "quantity" })
          item.addFormItemList['onInventory'] = quantity ? quantity.value : ""
          console.log(1)
          const external_product_id = item.addFormItemList.required.find(i => { return i.filedName == "external_product_id" })
          item.addFormItemList['productId'] = external_product_id ? external_product_id.value : ""
          console.log(1)
          const item_name = item.addFormItemList.required.find(i => { return i.filedName == "item_name" })
          item.addFormItemList['productName'] = item_name ? item_name.value : ""
          console.log(1)
          const external_product_id_type = item.addFormItemList.required.find(i => { return i.filedName == "external_product_id_type" })
          item.addFormItemList['pruductType'] = external_product_id_type ? external_product_id_type.value : ""
          console.log(1)
          const sale_price = item.addFormItemList.offer.find(i => { return i.filedName == "sale_price" })
          item.addFormItemList['salePrice'] = sale_price ? sale_price.value : ""
          console.log(1)
          const item_sku = item.addFormItemList.required.find(i => { return i.filedName == "item_sku" })
          item.addFormItemList['sellerSku'] = item_sku ? item_sku.value : ""
          console.log(1)
          item.addFormItemList['sku'] = item.sku || ""
          console.log(1)
          const standard_price = item.addFormItemList.required.find(i => { return i.filedName == "standard_price" })
          item.addFormItemList['standardPrice'] = standard_price ? standard_price.value : ""
          console.log(1)

          const text = item.productdescription.replace(/<(?!\/?strong|b|br\/?p)[^<>]*>/ig, '').split("\n").join("")
          item.addFormItemList['basic'].push({ filedName: "product_description", localLabelName: "Product Description", value: text })
          console.log(1)
          if (this.routeId) {
            item.addFormItemList['required'].find(i => { return i.filedName == "brand_name" }).value = listQuery.brand_name || ""
            item.addFormItemList['discovery'].find(i => { return i.filedName == "bullet_point1" }).value = listQuery.bullet_point1.split("\n").join("") || ""
            item.addFormItemList['discovery'].find(i => { return i.filedName == "bullet_point2" }).value = listQuery.bullet_point2.split("\n").join("") || ""
            item.addFormItemList['discovery'].find(i => { return i.filedName == "bullet_point3" }).value = listQuery.bullet_point3.split("\n").join("") || ""
            item.addFormItemList['discovery'].find(i => { return i.filedName == "bullet_point4" }).value = listQuery.bullet_point4.split("\n").join("") || ""
            item.addFormItemList['discovery'].find(i => { return i.filedName == "bullet_point5" }).value = listQuery.bullet_point5.split("\n").join("") || ""
            item.addFormItemList['discovery'].find(i => { return i.filedName == "generic_keywords" }).value = listQuery.generic_keywords.split("\n").join("") || ""
          } else {
            item.addFormItemList['discovery'].push({ filedName: "bullet_point1", localLabelName: "Bullet Point", value: listQuery.bullet_point1.split("\n").join("") || "" },
              { filedName: "bullet_point2", localLabelName: "Bullet Point", value: listQuery.bullet_point2.split("\n").join("") || "" },
              { filedName: "bullet_point3", localLabelName: "Bullet Point", value: listQuery.bullet_point3.split("\n").join("") || "" },
              { filedName: "bullet_point4", localLabelName: "Bullet Point", value: listQuery.bullet_point4.split("\n").join("") || "" },
              { filedName: "bullet_point5", localLabelName: "Bullet Point", value: listQuery.bullet_point5.split("\n").join("") || "" },
              { filedName: "generic_keywords", localLabelName: "Search Terms", value: listQuery.generic_keywords || "" })
            item.addFormItemList['required'].push({ filedName: "brand_name", localLabelName: "Brand", value: this.listQuery.brand_name })
          }
        })
        productInfoDetailParams = productInfoDetailParams.map(i => i.addFormItemList)
        submitType ? (this.commitButtonLoding = true) : (this.saveButtonLoding = true);
        const query = Object.assign({}, {
          ...listQuery,
          submitType,
          accountNameAs: this.typeList.authIdList.find(i => { return i.id == listQuery.authId }).storeNameAs || '',
          platformAuthDetailId: listQuery.authId,
          owenCatagory: JSON.stringify(listQuery.owenCatagory),
          lastCategoryId: listQuery.owenCatagory.slice(-1)[0] || '',
          platfromCatagory: listQuery.fullClassNameEn,
          parentSku: listQuery.parent_sku,
          sellerSku: listQuery.parent_sku,
          productInfoDetailParams,
        })
        console.log(query, 4)
        save(query).then(res => {
          if (res.code === 200) {
            $message({
              type: "success",
              message: `${submitType ? "刊登" : "保存"}成功`,
            });
            this.$router.replace({ path: '/amazon/amazonPublish', query: { publishStatus: this.routeStatus } });
          }
        });

      } catch (error) {
        console.log(error)
        submitType ? (this.commitButtonLoding = false) : (this.saveButtonLoding = false);
      }
    },
    upcChange(e) {
      this.listQuery.productInfoDetailParams.forEach((item, index) => {
        item.addFormItemList.required.find(i => { return i.filedName == "external_product_id" }).value = e[index]
      })
    },
    brandChange() {
      this.listQuery.productInfoDetailParams.forEach(item => {
        item.addFormItemList['required'].find(i => { return i.filedName == "manufacturer" }).value = this.listQuery.brand_name
      })
    },
    close() {
      this.$router.replace({ path: "/amazon/amazonPublish", query: { publishStatus: this.routeStatus } });
    },
  }
}
</script>
<style lang="scss" scoped>
.allMain {
  font-size: 15px;
}
.filter-nav {
  list-style: none;
  padding: 10px 0;
  cursor: pointer;
}
.filter-li {
  text-align: center;
}
.active {
  color: #41af7c;
  padding: 8px 0;
  text-align: center;
  border-right: 2px solid #41af7c;
}
.main-title {
  padding: 10px 0;
  font-family: "Arial Negreta", "Arial Normal", "Arial";
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
}
.main {
  height: 800px;
  overflow-y: scroll;
}
/deep/ .inputLegth {
  width: 800px;
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}
/deep/ .el-textarea .el-input__count {
  position: absolute;
  right: -55px;
  bottom: 0;
}
/deep/ .el-tabs__content {
  overflow-y: scroll;
  height: 700px;
}
.title_style {
  color: rgb(96, 98, 102);
  width: 800px;
  display: inline-block;
}
</style>