<template>
  <el-card>
    <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
      <el-divider content-position="left"><span class="dividerLabel">编辑刊登商品</span></el-divider>
      <el-form-item prop="authId" label="店铺：">
        <el-select v-model="listQuery.authId" placeholder="请选择" clearable filterable no-data-text="正在获取数据请稍后。。。" @change="handShopId" :disabled="!listQuery.isSpell">
          <el-option v-for="item in typeList.storeList" :key="item.id" :label="item.storeNameAs" :value="item.id" />
        </el-select>
      </el-form-item><br>
      <el-form-item prop="sku" label="sku：">
        <el-input v-model="listQuery.sku" @change="skuChange" :disabled="!listQuery.isSpell" />
      </el-form-item><br>
      <el-form-item prop="brand" label="品牌：">
        <el-select v-model="listQuery.brand" placeholder="请选择" clearable filterable no-data-text="选择店铺获取品牌。。。">
          <el-option v-for="item in typeList.BrandList" :key="item.id" :label="item.brandName" :value="item.id" />
        </el-select>
      </el-form-item><br>
      <el-form-item prop="category" label="类目：">
        <el-select v-model="listQuery.category" placeholder="请选择" clearable filterable no-data-text="正在获取数据请稍后。。。" @change="handCategory" style="width:500px">
          <el-option v-for="item in typeList.categoryList" :key="item.id" :label="item.category" :value="item.category" />
        </el-select>
        <transition name="el-fade-in-linear">
          <span style="color:red;" v-show="getIsMaintain">{{ getIsMaintain }}</span>
        </transition>
      </el-form-item><br>
      <el-form-item prop="productName" label="标题：">
        <el-input v-model="listQuery.productName" maxlength="225" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item prop="keyFeaturesStrOne" label="产品特点1：">
        <el-input v-model="listQuery.keyFeaturesStrOne" maxlength="500" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item prop="keyFeaturesStrTwo" label="产品特点2：">
        <el-input v-model="listQuery.keyFeaturesStrTwo" maxlength="500" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item prop="keyFeaturesStrThree" label="产品特点3：">
        <el-input v-model="listQuery.keyFeaturesStrThree" maxlength="500" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item prop="keyFeaturesStrFour" label="产品特点4：">
        <el-input v-model="listQuery.keyFeaturesStrFour" maxlength="500" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item prop="keyFeaturesStrFive" label="产品特点5：">
        <el-input v-model="listQuery.keyFeaturesStrFive" maxlength="500" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="物流属性：">
        <el-input v-model="listQuery.withbattery" disabled />
      </el-form-item><br>

      <el-divider content-position="left"><span class="dividerLabel">产品信息</span></el-divider>
      <el-form-item label="类目佣金：">
        <el-input v-model="listQuery.categoryCommissionRate" :disabled="true" placeholder="请先选择类目选项">
          <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
        </el-input>
      </el-form-item>
      <el-form-item label="重量：" prop="measure">
        <NumberInput v-model="listQuery.measure" float @change="priceChange">
          <i slot="suffix" style="font-style: normal; margin-right: 10px">lb</i>
        </NumberInput>
      </el-form-item>
      <el-form-item label="物流方式：" prop="logisticsNo">
        <el-select v-model="listQuery.logisticsNo" placeholder="请选择" clearable filterable no-data-text="正在获取数据请稍后。。。" @change="priceChange">
          <el-option v-for="item in typeList.LogisticsList" :key="item.id" :label="item.logisticsCompany" :value="item.logisticsNo" />
        </el-select>
      </el-form-item>
      <el-form-item label="发货仓库：" prop="wareHouseNo">
        <el-select v-model="listQuery.wareHouseNo" placeholder="请选择" clearable filterable no-data-text="正在获取数据请稍后。。。">
          <el-option v-for="item in typeList.WarehouseList" :key="item.id" :label="item.parameterName" :value="item.parameterCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="备货期：" prop="leadTime">
        <NumberInput v-model="listQuery.leadTime" float :disabled="editorType=='update'">
          <i slot="suffix" style="font-style: normal; margin-right: 10px">天</i>
        </NumberInput>
      </el-form-item>
      <el-form-item label="Site StartDate：" prop="siteStartDate">
        <el-date-picker v-model="listQuery.siteStartDate" type="datetime" placeholder="促销开始时间" default-time="00:00:00" value-format="yyyy-MM-dd HH:mm:ss" size="mini" @change="datePickerChange('siteStartDate')" />
      </el-form-item>
      <el-form-item label="Site EndDate：" prop="siteEndDate">
        <el-date-picker v-model="listQuery.siteEndDate" type="datetime" placeholder="促销结束时间" default-time="23:59:59" value-format="yyyy-MM-dd HH:mm:ss" size="mini" @change="datePickerChange('siteEndDate')" />
      </el-form-item>
      <DynamicFormItem :addAttrQuery.sync="addAttrQuery" :addFormItemList="typeList.addFormItemList" ref="dynamicForm" />

      <el-divider content-position="left"><span class="dividerLabel">价格&库存</span></el-divider>
      <el-form-item style="margin-left:40px;margin-right:40px;text-align:center;" class="table">
        <el-table ref="tableForm" :data="tableList" style="max-width: 85vw;font-size:13px" border empty-text="输入正确sku和选择店铺后查询变体sku" size="mini" :header-cell-style="{ 'background-color': '#dadde3' }">
          <el-table-column prop="sellerSku" label="系统SKU" width="100" align="center" />
          <el-table-column prop="productnamecn" label="产品中文名称" width="100" align="center" />
          <el-table-column prop="customSku" label="自定义SKU" width="200" align="center">
            <template #header>
              <div><span style="color:#F56C6C">* </span>自定义SKU</div>
            </template>
            <template #default="{ row }">
              <el-input v-model="row.customSku" clearable style="width:170px" :disabled="editorType=='update'" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="size" label="size" width="100" align="center" v-if="getTableListShow('size')">
            <template #default="{ row }">
              <el-input v-model="row.size" style="width:70px" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="colorCategorys" label="colorCategory" width="150" align="center" v-if="getTableListShow('colorCategory')">
            <template #default="{ row }">
              <!-- <el-autocomplete v-model="row.colorCategory" :fetch-suggestions="(...event)=>{fetchSuggestions(...event, 'colorCategory')}" placeholder="请输入" class="inptTextCenter" /> -->
              <ScrollSelect v-model="row.colorCategorys" :list="getTableListOption('colorCategory')" style="width:125px" allow-create />
            </template>
          </el-table-column>
          <el-table-column prop="pattern" label="Pattern" width="100" align="center" v-if="getTableListShow('pattern')">
            <template #default="{ row }">
              <el-input v-model="row.pattern" style="width:70px" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="isPrimaryVariant" label="Is Primary Variant" width="140" align="center" v-if="getTableListShow('isPrimaryVariant')">
            <template #default="{ row, $index }">
              <el-select v-model="row.isPrimaryVariant" style="width:110px" @change="variantChange($index)" clearable>
                <el-option label="Yes" :value="true" />
                <el-option label="No" :value="false" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="color" label="颜色" width="150" align="center">
            <template #default="{ row }">
              <el-autocomplete v-model="row.color" :fetch-suggestions="(...event)=>{fetchSuggestions(...event, 'color')}" placeholder="请输入" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="productId" label="UPC" width="150" align="center">
            <template #header>
              <div>
                <span style="color:#F56C6C">* </span>
                UPC
                <el-button type="primary" size="mini" icon="el-icon-refresh" round @click="updateProductId" style="padding:3px 7px" />
              </div>
            </template>
            <template #default="{ row }">
              <div>{{row.productId}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="利润率" width="130" align="center">
            <el-tooltip placement="top" slot="header">
              <div slot="content">利润率 = 100 - 汇兑损失率 - 类目佣金率（注意：范围值之间为开区间）</div>
              <div>
                <span style="color:#F56C6C">* </span>
                {{ `利润率(0,${getProfitMax})` }}
                <i class="el-icon-warning-outline" style="color: #d48806;" />
              </div>
            </el-tooltip>
            <template #default="{ row }">
              <div v-if="editorType == 'copy'">{{ row.profitRate }}</div>
              <NumberInput v-model="row.profitRate" min="0" :max="getProfitMax" float @change="priceChange" style="width:100px;" :class="['inptTextCenter', { numberInputWarn: isInputWarn(row.profitRate)}]" v-if="editorType != 'copy'">
                <i slot="suffix" style="line-height: 28px;">%</i>
              </NumberInput>
            </template>
          </el-table-column>
          <el-table-column prop="referenceStock" label="参考库存" width="80" align="center" v-if="editorType !='update'">
            <template #default="{ row }">
              <div style="font-size:18px; font-weight:blod;">{{row.referenceStock}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="库存" width="100" align="center" v-if="editorType !='update'">
            <template #default="{ row }">
              <NumberInput v-model="row.num" min="0" float style="width:70px" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="参考价USD" width="90" align="center">
            <template #default="{ row }">
              <div>{{row.price * 2}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格USD" width="140" align="center">
            <template #header>
              <el-tooltip placement="top">
                <div slot="content">店铺、类目佣金、物流方式、重量都选择或输入后自动计算价格</div>
                <div>价格USD<i class="el-icon-warning-outline" style="color: #d48806;" /></div>
              </el-tooltip>
              <BatchFillPopover :tableList="tableList">
                <el-button type="text" v-if="editorType == 'copy'">批量填充</el-button>
              </BatchFillPopover>
            </template>
            <template #default="{ row }">
              <div v-if="editorType =='publish'">{{row.price}}</div>
              <NumberInput v-if="editorType !='publish'" v-model="row.price" min="0" float style="width:115px" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="freightPrice" label="运费USD" width="90" align="center">
            <template #header>
              <el-tooltip placement="top">
                <div slot="content">店铺、类目佣金、物流方式、重量都选择或输入后自动计算运费</div>
                <div>运费USD<i class="el-icon-warning-outline" style="color: #d48806;"></i></div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="swatchImageUrl" label="Swatch image URL" width="140" align="center">
            <template #default="{ row }">
              <el-input v-model="row.swatchImageUrl" style="width:110px" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handRemove(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="mini" type="primary" @click="addSubSkuVisible=true" v-if="tableList.length&&editorType">添加子sku</el-button>
      </el-form-item>

      <el-divider content-position="left"></el-divider>
      <el-form-item prop="tableList" label="图片：(1~12张)" class="specialFormItem">
        <div v-for="item in tableList" :key="item.name">
          <div style="color:gray; font-size:13px;">{{ item.sellerSku }}&nbsp;&nbsp;{{ item.productnamecn }}</div>
          <UploadImage :fileList.sync="item.images" :sku="listQuery.sku" :watermark="wartermarkInfo" />
        </div>
      </el-form-item>

      <el-divider content-position="left"></el-divider>
      <el-form-item prop="shortDescriptionStr" label="详细描述：(最大4000字符，注意：此次字符限制为HTML文本字符限制，如需要请在下方编辑器导航栏中 “视图” 栏点击 “源代码” 实时查看)" class="specialFormItem specialLabel">
        <Tinymce :height="300" v-model="listQuery.shortDescriptionStr" :resetContent.sync="tinymceReset" :params="{sku:listQuery.sku}" :action="action" limit="4000" showLimit limitHtml :limitReset="false" />
      </el-form-item><br>

      <el-divider />
      <div style="text-align:center; margin-bottom:150px;">
        <el-button @click="onSubmit(0)" :loading="saveButtonLoding" v-if="editorType !=='update'">保存至草稿</el-button>
        <el-button @click="close">关闭页面</el-button>
        <el-button type="primary" @click="onSubmit(1)" :loading="commitButtonLoding">{{ editorType!=='update'?'提交刊登':'更新Listing' }}</el-button>
      </div>

      <el-dialog title="侵权" :visible.sync="dialogFormVisible" width="727px" custom-class="formDiv">
        <el-table ref="tableForm" :data="ResultList" style="width: 100%;font-size:13px" border size="mini" :header-cell-style="{ 'background-color': '#dadde3' }">
          <el-table-column prop="sellerSku" label="sellerSku" width="150" align="center" />
          <el-table-column prop="tortLevel" label="侵权等级" width="150" align="center" />
          <el-table-column prop="dataType" label="数据类型" width="150" align="center">
            <template #default="{ row }">
              <div v-if="row.dataType=='标题侵权'" style="color:red">{{ row.dataType }}</div>
              <div v-else>{{ row.dataType }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="tortContent" label="侵权内容" align="center" />
        </el-table>
        <div style="text-align:center;margin-top:20px">
          <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="submit('nextResult')" size="mini" :loading="nextResultLoading">点击继续</el-button>
        </div>
      </el-dialog>
      <AddSubSku :visible.sync="addSubSkuVisible" :listQuery="listQuery" @addSubSku="handleTableList" />
    </el-form>
  </el-card>
</template>
<script>
import { getLmSysPlatformAuthList, getLmShApiProductInfoList, getCategoryPage, getWalmartBrandList, getWalmartLogisticsList, getWalmartWarehouseList, getWalmartApiCategoryAttributes, getWalmartProductPrice, saveLmWalmartProduct, getLmWalmartProductGetUpdate, getWalmartTortResult, getLmWalmartProductupdateGetUpdate, saveLmWalmartProductupdate, getWalmartUpcList, getWalmartUpcCount, getCopyWalmartProduct, saveCopyLmWalmartProduct } from "@/api/walmart/walmartEditor"

import { Tinymce, NumberInput, ScrollSelect } from "@/components";
import UploadImage from "./components/UploadImage";
import DynamicFormItem from "./components/DynamicFormItem";
import AddSubSku from "./components/AddSubSku";
import BatchFillPopover from "./components/BatchFillPopover";
import { formatDate } from "@/utils/date"

const defaultListQuery = {
  sku: "",
  authId: "",
  productName: "",
  category: "",
  keyFeaturesStrOne: "",
  keyFeaturesStrTwo: "",
  keyFeaturesStrThree: "",
  keyFeaturesStrFour: "",
  keyFeaturesStrFive: "",
  categoryCommissionRate: null,
  logisticsNo: "",
  wareHouseNo: "",
  measure: "",
  leadTime: 1,
  siteStartDate: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
  siteEndDate: formatDate(new Date(new Date().setFullYear((new Date().getFullYear() + 10))), 'yyyy-MM-dd hh:mm:ss'),
  shortDescriptionStr: "",
  isSpell: true,
  brand: "",
  taskNo: "",
  originalSku: "",
  attributes: "",
  withbattery: ""
}
export default {
  name: "walmartEditor",
  components: {
    Tinymce,
    UploadImage,
    DynamicFormItem,
    NumberInput,
    AddSubSku,
    ScrollSelect,
    BatchFillPopover
  },
  data() {
    var shortDescriptionStrValid = (rule, value, callback) => {
      const { shortDescriptionStr } = this.listQuery
      if (shortDescriptionStr === '') {
        callback(new Error('此项不能为空'));
      } else if (shortDescriptionStr.length > 4000) {
        callback(new Error('此项不能超过4000字符'));
      } else {
        callback();
      }
    };
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addAttrQuery: {},
      typeList: {
        storeList: [],
        categoryList: [],
        LogisticsList: [],
        WarehouseList: [],
        colorList: [],
        addFormItemList: {},
        addFormItemFilterList: {},
        BrandList: [],
      },
      tableList: [],
      tinymceReset: true,
      rules: {
        sku: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        authId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        productName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        category: [{ required: true, message: "此项不能为空", trigger: "change" }],
        keyFeaturesStrOne: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        shortDescriptionStr: [{ validator: shortDescriptionStrValid, trigger: "change" }],
        brand: [{ required: true, message: "此项不能为空", trigger: "change" }],
        logisticsNo: [{ required: true, message: "此项不能为空", trigger: "change" }],
        wareHouseNo: [{ required: true, message: "此项不能为空", trigger: "change" }],
        measure: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        leadTime: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        siteStartDate: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        siteEndDate: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      wartermarkInfo: {},
      action: `${process.env.WALMART_API}/walmart/product/uploadImage`,
      saveButtonLoding: false,
      commitButtonLoding: false,
      butSave: "",
      ResultList: [],
      dialogFormVisible: false,
      nextResultLoading: false,
      addSubSkuVisible: false
    }
  },
  props: {
    routeSku: {
      type: undefined,
      default: "",
    },
    routeTaskNo: {
      type: undefined,
      default: "",
    },
    editorType: {
      type: undefined,
      default: "",
    },
    routeStatus: {
      type: undefined,
      default: "",
    }
  },
  watch: {
    'listQuery.shortDescriptionStr': function (value) {
      this.$refs.form.validateField('shortDescriptionStr')
    }
  },
  created() {
    this.getSearchType()
  },
  computed: {
    getProfitMax() {
      const storeListItem = this.typeList.storeList.find(i => i.id == this.listQuery.authId) || {}
      const vatTaxSales = storeListItem.vatTaxSales || 0;
      return 100 - vatTaxSales - this.listQuery.categoryCommissionRate
    },
    getIsMaintain() {
      const storeListItem = this.typeList.categoryList.find(i => i.category == this.listQuery.category)
      const isMaintain = storeListItem ? storeListItem.isMaintain : undefined
      switch (isMaintain) {
        case 0:
          return "温馨提示：该类目为未维护属性，请到平台类目页面先维护";
        default:
          return "";
      }
    },
    isInputWarn() {
      return (value) => {
        return Number(value) === 0 || Number(value) === this.getProfitMax
      }
    },
    getTableListShow() {
      const keyArr = Object.keys(this.typeList.addFormItemFilterList)
      return (key) => keyArr.includes(key)
    },
    getTableListOption() {
      return (key) => {
        const obj = this.typeList.addFormItemFilterList[key]
        return obj ? obj.options.split("; ").map(i => ({ value: i, label: i })) : []
      }
    }
  },
  methods: {
    async getSearchType() {
      if (this.routeSku) {
        // 修改商品时获取所有的产品属性
        const getProdInfoApi = (() => {
          switch (this.editorType) {
            case 'publish':
              return getLmWalmartProductGetUpdate;
            case 'copy':
              return getCopyWalmartProduct;
            case 'update':
              return getLmWalmartProductupdateGetUpdate;
            default:
              return;
          }
        })()
        if (!getProdInfoApi) return
        const res = await getProdInfoApi({
          sku: this.routeSku,
          taskNo: this.routeTaskNo,
        });
        const { skuParamList, attributes, ...query } = res.data;
        this.tableList = skuParamList;
        this.addAttrQuery = JSON.parse(attributes);
        this.tinymceReset = true;
        this.listQuery = {
          ...this.listQuery,
          ...query,
          originalSku: this.routeSku,
          taskNo: this.routeTaskNo,
          isSpell: false,
        };
        this.getWalmartBrand()
      }
      //获取 ‘店铺’ 分类 ‘水印’“物流”“仓库” 选项
      getLmSysPlatformAuthList().then(res => {
        this.typeList.storeList = res.data;
      });
      getCategoryPage({ pageNum: 1, pageSize: 99999999 }).then(res => {
        this.typeList.categoryList = res.data.list;
        this.handCategory()
      });
      getWalmartLogisticsList().then(res => {
        this.typeList.LogisticsList = res.data;
      });
      getWalmartWarehouseList().then(res => {
        this.typeList.WarehouseList = res.data;
      });
    },
    handShopId() {
      this.listQuery.brand = ""
      this.getWalmartBrand()
      this.skuChange();
    },
    getWalmartBrand() {
      if (!this.listQuery.authId) return
      getWalmartBrandList({ authId: this.listQuery.authId }).then(res => {
        this.typeList.BrandList = res.data;
      })
    },
    async skuChange() {
      try {
        this.tinymceReset = true;
        if (this.listQuery.authId == "") {
          this.$message.warning("请选择店铺")
          this.tableList = []
          return
        };
        if (this.listQuery.sku !== '') {
          const res = await getLmShApiProductInfoList(this.listQuery)
          const resData = res.data[0] || {};
          this.listQuery = Object.assign({ ...this.listQuery }, {
            productName: resData.pagetitle || "",
            measure: resData.measure || "",
            shortDescriptionStr: resData.productDescriptionStr || "",
            withbattery: resData.withbattery || "",
            keyFeaturesStrOne: resData.keyFeaturesStrOne || "",
            keyFeaturesStrTwo: resData.keyFeaturesStrTwo || "",
            keyFeaturesStrThree: resData.keyFeaturesStrThree || "",
            keyFeaturesStrFour: resData.keyFeaturesStrFour || "",
            keyFeaturesStrFive: resData.keyFeaturesStrFive || "",
          });
          if (res.data[0]) {
            this.handleTableList(res.data, "reset")
          }
        }
      } catch (error) {
        this.tableList = []
      }
    },
    handleTableList(listParam, reset) {
      const profitRate = this.typeList.storeList.find(i => i.id == this.listQuery.authId).profitRate
      const newList = listParam.map(item => ({
        color: item.productcolor,
        customSku: item.customSku,
        freightPrice: item.freightPrice,
        images: item.images.map(item => {
          return { url: item.imageurl };
        }),
        price: item.price,
        productId: item.productId,
        sellerSku: item.sku,
        num: Number(item.goodnum),
        referenceStock: item.referenceStock,
        profitRate,
        productnamecn: item.productnamecn,
        size: item.productsize,
        colorCategorys: [],
        pattern: '',
        isPrimaryVariant: '',
        swatchImageUrl: ''
      }))
      if (reset) {
        this.tableList = newList
      } else {
        newList.forEach(item => { this.tableList.push(item) })
      }
      this.priceChange()
    },
    async handCategory(hasValue) {
      const category = this.listQuery.category;
      const categoryItem = this.typeList.categoryList.find(i => category == i.category)
      this.listQuery.categoryCommissionRate = categoryItem ? categoryItem.categoryCommissionRate : ""
      if (hasValue) this.priceChange()
      if (!category) {
        this.typeList.addFormItemFilterList = {}
        this.typeList.addFormItemList = {};
      } else {
        const res = await getWalmartApiCategoryAttributes({ category: category, isFilter: true });
        let inputTypeList = {};
        let addAttrQuery = {};
        let filterLabel = ['pattern', 'size', 'isPrimaryVariant', 'colorCategory', 'color'];
        let filterTypeList = {}
        res.data.forEach((item) => {
          if (filterLabel.includes(item.name)) {
            filterTypeList[item.name] = item;
          } else {
            inputTypeList[item.name] = item;
            addAttrQuery[item.name] = "";
            if (item.name === "ProductTaxCode") addAttrQuery[item.name] = 2038346;
          }
        });
        //动态添加提交给后台的字段
        if (hasValue) this.addAttrQuery = addAttrQuery;
        //动态生成form表单
        this.typeList.addFormItemFilterList = filterTypeList;
        this.typeList.addFormItemList = inputTypeList;
      }
    },
    async priceChange() {
      const { authId, categoryCommissionRate, logisticsNo, measure } = this.listQuery;
      try {
        if (!(authId !== '' && categoryCommissionRate !== '' && logisticsNo != '' && measure !== '')) {
          this.tableList.forEach(item => { item.freightPrice = item.price = ""; })
          return
        };
        const params = {
          authId,
          categoryCommissionRate,
          logisticsNo,
          measure,
          sellerSku: this.tableList.map(i => ({
            sellerSku: i.sellerSku,
            profitRate: i.profitRate
          }))
        }
        const res = await getWalmartProductPrice(params)
        res.data.forEach((item, index) => {
          this.tableList[index].price = item.price
          this.tableList[index].freightPrice = item.freightPrice
        })
      } catch (error) { }
    },
    variantChange($index) {
      if (!this.tableList[$index].isPrimaryVariant) return
      this.tableList.filter((item, index) => index !== $index).forEach(item => {
        if (item.isPrimaryVariant) item.isPrimaryVariant = false
      })
    },
    datePickerChange(key) {
      if (this.listQuery[key] === null) {
        this.$nextTick(() => {
          this.listQuery[key] = '';
        })
      }
    },
    handRemove(index) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableList.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    fetchSuggestions(queryString, cb, key) {
      if (!this.typeList.addFormItemFilterList[key]) cb([]); return;
      const { options } = this.typeList.addFormItemFilterList[key]
      var restaurants = options && options.split("; ").map(i => ({ value: i }));
      var results = queryString ? restaurants.filter((restaurant) =>
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      ) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    formsValidate() {
      let dynamicFormValidate;
      let formValidate;
      this.$refs.dynamicForm.validate((valid) => {
        dynamicFormValidate = valid;
      });
      this.$refs.form.validate((valid) => {
        formValidate = valid;
      });
      return dynamicFormValidate && formValidate;
    },
    async onSubmit(butSave) {
      this.butSave = butSave;
      try {
        const { formsValidate, $message, submit, tableList } = this;
        if (!formsValidate()) { $message.warning(`请填完整信息`); return; }
        const pictureValid = tableList.every((item) => item.images.length >= 1);
        if (!pictureValid) { $message.warning(`请为每个变体sku插入至少1张图片`); return; }

        butSave ? (this.commitButtonLoding = true) : (this.saveButtonLoding = true);
        const resResult = await getWalmartTortResult({ sellerSku: tableList.map(i => { return i.sellerSku }) })
        this.ResultList = resResult.data;
        this.ResultList.length > 0 ? this.dialogFormVisible = true : await submit()
      } catch (error) { }
      butSave ? (this.commitButtonLoding = false) : (this.saveButtonLoding = false);
    },
    async submit(nextResult) {
      if (nextResult) this.nextResultLoading = true;
      const { $message, listQuery, butSave, tableList, addAttrQuery, editorType } = this;
      try {
        const query = Object.assign({}, {
          ...listQuery,
          butSave,
          skuParamList: tableList,
          attributes: JSON.stringify(addAttrQuery),
        });
        const submitProdInfoApi = (() => {
          switch (editorType) {
            case 'publish':
              return saveLmWalmartProduct;
            case 'copy':
              return saveCopyLmWalmartProduct;
            case 'update':
              return saveLmWalmartProductupdate;
            default:
              return;
          }
        })()
        if (!submitProdInfoApi) return
        // const editorType = this.editorType === 'publish' ? saveLmWalmartProduct : saveLmWalmartProductupdate
        const res = await submitProdInfoApi(query);
        if (res.code === 200) {
          $message.success(`${butSave ? "刊登" : "保存"}成功`);
          const routeIstureValue = editorType !== 'update' ? "/walmart/walmartPublish" : "/walmart/walmartUpdate"
          this.$router.replace({ path: routeIstureValue, query: { status: this.routeStatus } });
        }
      } catch (error) { }
      if (nextResult) this.nextResultLoading = false;
    },
    close() {
      const routeIstureValue = this.editorType !== 'update' ? "/walmart/walmartPublish" : "/walmart/walmartUpdate"
      this.$router.replace({ path: routeIstureValue, query: { status: this.routeStatus } });
    },
    updateProductId() {
      getWalmartUpcCount({ count: this.tableList.length }).then(res => {
        res.data.forEach((item, i) => {
          this.tableList[i].productId = item
        })
      })
    },
    totalChange() {
      const { mode, operation } = this

      // const valueToNum = Number(this.allValue) || 0;

      // function resetMinZero(num) {
      //   return num < 0 ? 0 : num
      // }

      // this.selectRows.forEach(item => {
      //   if (mode === 2) {
      //     if (operation === "add") item.skuModifyPrice = resetMinZero((item.skuPrice + valueToNum).toFixed(2))
      //     if (operation === "reduce") item.skuModifyPrice = resetMinZero((item.skuPrice - valueToNum).toFixed(2))
      //     if (operation === "") item.skuModifyPrice = item.skuPrice
      //   }
      //   if (mode === 3) {
      //     if (operation === "add") item.skuModifyInventory = resetMinZero(item.skuInventory + valueToNum)
      //     if (operation === "reduce") item.skuModifyInventory = resetMinZero(item.skuInventory - valueToNum)
      //     if (operation === "") item.skuModifyInventory = item.skuInventory
      //   }
      // })
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-select,
.el-input {
  width: 193px;
}
/deep/ .el-card__body {
  font-size: 0px;
  padding: 0px;
}
.dividerLabel {
  font-weight: bold;
  font-size: 14px;
  color: gray;
}
.inptTextCenter {
  /deep/ .el-input__inner {
    text-align: center;
  }
}
.numberInputWarn {
  /deep/ .el-input__inner {
    border-color: red;
  }
}
.specialFormItem {
  width: 100%;
  /deep/ .el-form-item__label {
    text-align: left;
  }
  /deep/ .el-form-item__content {
    width: 100%;
  }
}
/deep/.specialLabel {
  .el-form-item__label {
    width: 100% !important;
  }
}
/deep/ .inputLegth {
  width: 500px;
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}

/deep/.el-table .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #dfe7f5 !important;
}
/deep/.el-table .el-table thead {
  color: #3b3a39 !important;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>