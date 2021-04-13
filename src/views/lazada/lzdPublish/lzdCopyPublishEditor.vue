<template>
  <el-card>
    <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
      <el-divider content-position="left"><span class="dividerLabel">编辑刊登商品</span></el-divider>
      <el-form-item prop="shopId" label="店铺：">
        <el-select v-model="listQuery.shopId" placeholder="请选择店铺" filterable no-data-text="正在获取数据请稍后。。。" @change="handShopId" style="width:200px;">
          <el-option v-for="(item) in typeList.storeList" :key="item.id" :label="item.storeName" :value="item.id" />
        </el-select>
      </el-form-item><br>
      <el-form-item prop="sku" label="sku：">
        <el-input v-model="listQuery.sku" @change="skuChange" style="width:200px;" disabled />
      </el-form-item><br>

      <el-form-item prop="title" label="标题：">
        <el-input v-model="listQuery.title" style="width:500px" @change="titleChange" maxlength="225" show-word-limit />
      </el-form-item><br>

      <el-form-item prop="primaryCategory" label="类目：">
        <el-cascader v-model="listQuery.primaryCategory" :options="typeList.categoryList" style="width:500px" :props="{label:'name', value:'categoryId' }" clearable filterable @change="getAttrsList" :placeholder="typeList.categoryList.length?'请选择类目':'正在获取类目...'" />
        <el-dropdown v-if="isRecommend" @command="handleCommand">
          <span class="el-dropdown-link">推荐</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in this.typeList.recommendList" :key="index" :command="item.categoryIds">{{item.categoryName}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <el-divider content-position="left"><span class="dividerLabel">产品属性</span></el-divider>

      <el-form-item label="品牌：">
        <el-input v-model="listQuery.brand" placeholder="无品牌" style="width:200px;" />
      </el-form-item>

      <DynamicFormItem :addAttrQuery.sync="addAttrQuery" :addFormItemList="typeList.addFormItemList" ref="dynamicForm" />

      <el-divider content-position="left"><span class="dividerLabel">包装信息</span></el-divider>

      <el-form-item prop="packageWeight" label="包裹重量：">
        <el-input v-model.number="listQuery.packageWeight" style="width:80px" class="inptTextCenter" /> kg
      </el-form-item>
      <el-form-item prop="packageLength" label="包装尺寸：">
        <el-input v-model.number="listQuery.packageLength" placeholder="长(cm)" style="width:80px" class="inptTextCenter" /> *
        <el-input v-model.number="listQuery.packageWidth" placeholder="宽(cm)" style="width:80px" class="inptTextCenter" /> *
        <el-input v-model.number="listQuery.packageHeight" placeholder="高(cm)" style="width:80px" class="inptTextCenter" />
      </el-form-item>

      <el-divider content-position="left"><span class="dividerLabel">价格&库存</span></el-divider>

      <el-form-item style="margin-left:40px;margin-right:40px;" class="table">
        <el-table ref="skuForm" :data="skuList" style="width: 100%;font-size:13px" border empty-text="输入正确sku和选择店铺后查询变体sku" size="mini" :header-cell-style="{ 'background-color': '#dadde3' }">
          <el-table-column prop="sellerSku" label="SellerSKU" width="100" align="center">
            <template #default="{ row }">
              <div>{{ row.sellerSku }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="colorFamily" label="颜色" width="160" align="center">
            <template #default="{ row }">
              <el-autocomplete popper-class="my-autocomplete" v-model="row.colorFamily" :fetch-suggestions="colorSearch" placeholder="请输入颜色" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="lastbuyprice" label="采购价" width="100" align="center" />
          <el-table-column label="调整后采购价" width="120" align="center">
            <template #default="{ row }">
              <el-input v-model.number="row.price" class="inptTextCenter" @change="priceChange(row)" />
            </template>
          </el-table-column>
          <el-table-column prop="unitshipfee" label="采购运费" width="100" align="center" />
          <el-table-column prop="retailPrice" width="140" align="center">
            <template #header>
              <div style="color:#000">价格{{ getSettlementCurrency }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="salesPrice" width="140" align="center">
            <template #header>
              <div style="color:#000">促销价格{{ getSettlementCurrency }} </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="刊登价格" width="140" align="center">
            <template #default="{ row }">
              <el-popover placement="bottom">
                <div v-for="(item,index) in row.prices" :key="index">
                  <div v-if="publishedForPriceShow(item.publishedTo)" class="priceDetail">
                    <div>
                      <span class="label">{{ item.publishedTo }}：</span>
                      <span>{{ getFormula(item.publishedTo, row, item).calculate }}</span>
                    </div>
                    <div>
                      <span>刊登促销价：</span>
                      <span>{{ getFormula(item.publishedTo, row, item).model }}</span>
                    </div>
                    <div>
                      刊登价格 = 促销价*1.9
                    </div>
                  </div>
                </div>

                <div slot="reference">
                  <div class="skuPrice">
                    <div v-for="(item,index) in row.prices" :key="index">
                      <div v-if="publishedForPriceShow(item.publishedTo)">
                        <span class="label">{{ item.publishedTo }}</span> : <span class="value">{{ item.siteRetailPrice }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="刊登促销价格" width="140" align="center">
            <template #default="{ row }">
              <el-popover placement="bottom">
                <div v-for="(item, index) in row.prices" :key="index">
                  <div v-if="publishedForPriceShow(item.publishedTo)" class="priceDetail">
                    <div>
                      <span class="label">{{ item.publishedTo }}：</span>
                      <span>{{ getFormula(item.publishedTo, row, item).calculate }}</span>
                    </div>
                    <div>
                      <span>刊登促销价：</span>
                      <span>{{ getFormula(item.publishedTo, row, item).model }}</span>
                    </div>
                    <div>
                      刊登价格 = 促销价*1.9
                    </div>
                  </div>
                </div>

                <div slot="reference">
                  <div class="skuPrice">
                    <div v-for="(item, index) in row.prices" :key="index">
                      <div v-if="publishedForPriceShow(item.publishedTo)">
                        <span class="label">{{ item.publishedTo }}</span> : <span class="value">{{ item.siteSalesPrice }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="库存数量" width="80" align="center">
            <template #default="scoped">
              <el-tooltip class="item" effect="dark" content="单击修改数量" placement="top">
                <div style="font-size:24px;font-weight:bold;" class="tooltipClass">
                  <Inventory :row.sync="scoped.row" :size="listQuery.publishedTo" />
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="税" width="100" align="center">
            <template #default>default</template>
          </el-table-column>
          <el-table-column label="是否刊登" width="100" align="center">
            <template #default="{ row }"><b>{{ row.skuIsExist }}</b></template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handRemove(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-divider content-position="left"></el-divider>

      <el-form-item prop="watermarkId" label="水印模板:" class="watermark">
        <el-select v-model="listQuery.watermarkId" clearable placeholder="请选择" @change="getWatermarkInfo">
          <el-option v-for="item in typeList.watermarkList" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="skuList" label="图片：(3~8张)" class="specialFormItem">
        <div v-for="item in skuList" :key="item.name">
          <div style="color:gray; font-size:13px;">{{ item.sellerSku }}&nbsp;&nbsp;{{ item.productnamecn }}</div>
          <UploadImage :fileList.sync="item.images" :id="listQuery.shopId" :watermark="wartermarkInfo" />
        </div>
      </el-form-item>

      <el-form-item prop="shortDescriptionStr" label="简短描述：" class="specialFormItem">
        <Tinymce :height="300" v-model="listQuery.shortDescriptionStr" :resetContent.sync="tinymceReset" :params="{shopId:listQuery.shopId}" :action="action" />
      </el-form-item><br>

      <el-form-item prop="descriptionStr" label="详细描述：" class="specialFormItem">
        <Tinymce :height="300" v-model="listQuery.descriptionStr" :resetContent.sync="tinymceReset" :params="{shopId:listQuery.shopId}" :action="action" />
      </el-form-item><br>

      <el-form-item label="包裹里面是什么：" style="margin-top:20px;">
        <el-input v-model="listQuery.packageContent" style="width:500px;" maxlength="1000" show-word-limit></el-input>
      </el-form-item>

      <el-divider />

      <el-form-item prop="publishedTo" label="发布站点：">
        <el-checkbox-group v-model="listQuery.publishedTo">
          <el-checkbox label="MY" disabled>马来西亚</el-checkbox>
          <el-checkbox label="TH">泰国</el-checkbox>
          <el-checkbox label="VN">越南</el-checkbox>
          <el-checkbox label="PH">菲律宾</el-checkbox>
          <el-checkbox label="ID">印度尼西亚</el-checkbox>
          <el-checkbox label="SG">新加坡</el-checkbox>
        </el-checkbox-group>
      </el-form-item><br>

      <el-form-item prop="autoAllocateStock" label="自动调配库存售卖：">
        <el-radio-group v-model="listQuery.autoAllocateStock">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item><br>

      <el-form-item label="促销：">
        <el-radio-group v-model="listQuery.promotion" @change="promotionChange">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>

        <transition name="el-fade-in-linear">
          <div style="margin-left:20px; display:inline-block;" v-if="listQuery.promotion">
            促销时间:
            <el-date-picker v-model="createTimeAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" />
          </div>
        </transition>
      </el-form-item><br>

      <el-divider />

      <div style="text-align:center; margin-bottom:150px;">
        <el-button @click="close">关闭页面</el-button>
        <el-button type="primary" @click="onSubmit(1)" :loading="commitButtonLoding">提交刊登</el-button>
      </div>
    </el-form>
  </el-card>

</template>
<script>
import {
  getCategoryNodeTree,
  getCategoryAttributes,
  getLmSysPlatformAuthList,
  getLmShApiProductInfoList,
  saveProductInfo,
  getLmExchangeRatePrice,
  getSellerSkuIsExist,
  getCategoryRecommend,
  getCopyLazadaProductDetails,
  getLmLazadaApiProductUpdate
} from "@/api/lazada/lzdPublishEditor";
import { getList as getWatermarkList, listById } from "@/api/common/sysWatermark";
import { Tinymce } from "@/components";
import UploadImage from "./components/UploadImage";
import Inventory from "./components/Inventory";
import DynamicFormItem from "./components/DynamicFormItem";
const defaultListQuery = {
  sku: "",
  shopId: "",
  title: "",
  primaryCategory: [],
  brand: "No Brand",
  attributes: "",
  autoTranslatedTo: [
    "Thai",
    "Bahasa Indonesia",
    "Bahasa Malaysia",
    "Vietnamese",
  ],
  packageHeight: "",
  packageWidth: "",
  packageWeight: "",
  packageLength: "",
  packageContent: "",
  watermarkId: "",
  publishedTo: ["SG", "TH", "VN", "PH", "ID", "MY"],
  autoAllocateStock: true,
  promotion: false,
  specialFromDate: "",
  specialToDate: "",
  shortDescriptionStr: "",
  descriptionStr: "",
  taskNo: "",
  butSave: "",
  originalSku: "",
};
function resetChildNode(obj) {
  if (!(obj instanceof Array)) return;
  obj.forEach((item) => {
    if (item.children.length === 0) {
      item.children = null;
      return;
    }
    resetChildNode(item.children);
  });
  return obj;
}
function getStoreName(value) {
  const obj = this.typeList.storeList.find((item) => { return value === item.id; }) || {};
  return obj.storeName || "";
}
export default {
  name: "lzdCopyPublishEditor",
  data() {
    const packageLengthRules = [
      {
        required: true,
        validator: (rules, value, cb) => {
          let { packageWidth, packageHeight } = this.listQuery;
          if (!packageWidth || !packageHeight || !value) {
            return cb(new Error("请输入完整的商品尺寸"));
          }
          cb();
        },
        trigger: "blur",
      },
      {
        validator: (rules, value, cb) => {
          let { packageWidth, packageHeight } = this.listQuery;
          if (isNaN(packageWidth) || isNaN(packageHeight) || isNaN(value)) {
            return cb(new Error("请输入合法数字"));
          }
          cb();
        },
      },
    ];
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addAttrQuery: {},
      skuList: [],
      typeList: {
        categoryList: [],
        storeList: [],
        colorList: [],
        addFormItemList: {},
        recommendList: [],
        watermarkList: [],
      },
      rules: {
        sku: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        shopId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        title: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        primaryCategory: [{ required: true, message: "此项不能为空", trigger: "change" }],
        packageWeight: [{ required: true, message: "此项不能为空", trigger: "blur" }, { type: "number", message: "必须为数字值" }],
        packageLength: packageLengthRules,
        shortDescriptionStr: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        descriptionStr: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        publishedTo: [{ required: true, message: "此项不能为空", trigger: "change" }],
        autoTranslatedTo: [{ required: true, message: "此项不能为空", trigger: "change" }],
        autoAllocateStock: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      wartermarkInfo: {},
      createTimeAndEndTime: ["", ""],
      tinymceReset: true,
      action: `${process.env.BASE_API}/product/uploadImage`,
      saveButtonLoding: false,
      commitButtonLoding: false,
      isRecommend: false,
    };
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
    routeStatus: {
      type: undefined,
      default: "",
    },
  },
  components: {
    Tinymce,
    UploadImage,
    Inventory,
    DynamicFormItem,
  },
  created() {
    this.getSearchType();
  },
  computed: {
    getFormula() {
      return function (key, row, item) {
        switch (key) {
          case "SG":
            return {
              model: `( 成本 / ${item.juheExchangeRate}(汇率) + 运费 ) / (1 - 退换货率 - 利润率 - 佣金 - 付款手续费 - 提现手续费 - 汇率折损率)`,
              calculate: `${item.siteSalesPrice} = (${row.price + row.unitshipfee} / ${item.juheExchangeRate} + ${item.packageWeightPrice}) / (1- ${item.returnRate} - ${item.profitRate} - ${item.commissionRate} - ${item.payFeesRate} - ${item.withdrawalFeesRate} - ${item.exchangeRate})`,
            };
          case "MY":
            return {
              model: `( 成本 / ${item.juheExchangeRate}(汇率) + 运费 ) / (1 - 退换货率 - 利润率 - 佣金 - 付款手续费 - 提现手续费 - 汇率折损率)`,
              calculate: `${item.siteSalesPrice} = (${row.price + row.unitshipfee} / ${item.juheExchangeRate} + ${item.packageWeightPrice}) / (1- ${item.returnRate} - ${item.profitRate} - ${item.commissionRate} - ${item.payFeesRate} - ${item.withdrawalFeesRate} - ${item.exchangeRate})`,
            };
          case "PH":
            return {
              model: `( 成本 / ${item.juheExchangeRate}(汇率) + 运费 ) / (1 - 退换货率 - 利润率 - 佣金 - 付款手续费 - 提现手续费 - 汇率折损率)`,
              calculate: `${item.siteSalesPrice} = (${row.price + row.unitshipfee} / ${item.juheExchangeRate} + ${item.packageWeightPrice}) / (1- ${item.returnRate} - ${item.profitRate} - ${item.commissionRate} - ${item.payFeesRate} - ${item.withdrawalFeesRate} - ${item.exchangeRate})`,
            };
          case "TH":
            return {
              model: `( 成本 / ${item.juheExchangeRate}(汇率) + 运费 ) / (1 - 退换货率 - 利润率 - 佣金 - 付款手续费 - 提现手续费 - 汇率折损率)`,
              calculate: `${item.siteSalesPrice} = (${row.price + row.unitshipfee} / ${item.juheExchangeRate} + ${item.packageWeightPrice}) / (1- ${item.returnRate} - ${item.profitRate} - ${item.commissionRate} - ${item.payFeesRate} - ${item.withdrawalFeesRate} - ${item.exchangeRate})`,
            };
          case "ID":
            return {
              model: `( 成本 / ${item.juheExchangeRate}(汇率) + 运费 ) / (1 - 退换货率 - 利润率 - 佣金 - 付款手续费 - 提现手续费 - 汇率折损率)`,
              calculate: `${item.siteSalesPrice} = (${row.price + row.unitshipfee} / ${item.juheExchangeRate} + ${item.packageWeightPrice}) / (1- ${item.returnRate} - ${item.profitRate} - ${item.commissionRate} - ${item.payFeesRate} - ${item.withdrawalFeesRate} - ${item.exchangeRate})`,
            };
          case "VN":
            return {
              model: `( 成本 / ${item.juheExchangeRate}(汇率) + 运费 ) / (1 - 退换货率 - 利润率 - 佣金 - 付款手续费 - 提现手续费 - 汇率折损率)`,
              calculate: `${item.siteSalesPrice} = (${row.price + row.unitshipfee} / ${item.juheExchangeRate} + ${item.packageWeightPrice}) / (1- ${item.returnRate} - ${item.profitRate} - ${item.commissionRate} - ${item.payFeesRate} - ${item.withdrawalFeesRate} - ${item.exchangeRate})`,
            };
          default:
            return "";
        }
      };
    },
    publishedForPriceShow() {
      return function (site) {
        return this.listQuery.publishedTo.some((item) => {
          return item === site;
        });
      };
    },
    getSettlementCurrency() {
      const item = this.typeList.storeList.find(item => item.id === this.listQuery.shopId) || {}
      return item.settlementCurrency
    }
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.specialFromDate = timeArr[0];
      this.listQuery.specialToDate = timeArr[1];
    },
  },
  methods: {
    async getSearchType() {
      getCopyLazadaProductDetails({ sku: this.routeSku, taskNo: this.routeTaskNo }).then(res => {
        const { skuParamList, attributes, ...query } = res.data;
        // this.skuList = skuParamList;
        this.addAttrQuery = JSON.parse(attributes);
        this.tinymceReset = true;
        this.listQuery = {
          ...this.listQuery,
          ...query,
          autoTranslatedTo: query.autoTranslatedTo.split(","),
          publishedTo: query.publishedTo.split(","),
          originalSku: this.routeSku,
          promotion: query.specialFromDate ? true : false,
        };
        this.createTimeAndEndTime = [
          query.specialFromDate || "",
          query.specialToDate || "",
        ];
        this.getWatermarkInfo();
        this.filterShopList()
      })
      //获取 ‘店铺’ ‘类目’ ‘水印’ 选项
      getLmSysPlatformAuthList().then((res) => {
        this.typeList.storeList = res.data;
        this.filterShopList()
      });
      getCategoryNodeTree({ region: "Malaysia_马来西亚" }).then(res => {
        this.typeList.categoryList = resetChildNode(res.data);
        this.getAttrsList();
      });
      getWatermarkList({ pageSize: 99999, pageNum: 1, status: 1 }).then(res => {
        this.typeList.watermarkList = res.data.list
      })
    },
    async getAttrsList(hasValue) {
      const categoryId = this.listQuery.primaryCategory.slice(-1)[0] || "";
      if (!categoryId) {
        this.typeList.colorList = [];
        this.typeList.addFormItemList = {};
        return;
      }
      const res = await getCategoryAttributes({
        categoryId,
        region: "Malaysia_马来西亚",
        isFilter: true,
      });
      let inputTypeList = {};
      let addAttrQuery = {};
      res.data.forEach((item) => {
        inputTypeList[item.name] = item;
        addAttrQuery[item.name] = "";
        if (item.name === "warranty_type") addAttrQuery[item.name] = "No Warranty";
        if (item.name === "Hazmat") addAttrQuery[item.name] = ["None"];
      });
      //动态添加提交给后台的字段
      if (hasValue) this.addAttrQuery = addAttrQuery;
      //动态生成form表单
      const { color_family, ...otherAttr } = inputTypeList;
      this.typeList.addFormItemList = otherAttr;
      //获取颜色列表
      if (!(color_family instanceof Object)) return;
      this.typeList.colorList = JSON.parse(color_family.options).map((item) => {
        return { value: item.name };
      });
    },
    filterShopList() {
      if (this.listQuery.shopId === "") return;
      if (this.typeList.storeList.length === 0) return;
      this.typeList.storeList = this.typeList.storeList.filter(item => item.id !== this.listQuery.shopId);
      this.listQuery.shopId = "";
    },
    handShopId(value) {
      if (this.listQuery.sku == "") return;
      this.skuChange();
    },
    async skuChange() {
      this.tinymceReset = true;
      if (this.listQuery.shopId == "") return this.$message.warning("请选择店铺");
      if (this.listQuery.sku !== "") {
        const res = await getLmShApiProductInfoList(this.listQuery);
        if (res.data[0] && this.listQuery.shopId) this.SellerSkuIsExist();
        const resData = res.data[0] || {};
        this.createTimeAndEndTime = [
          resData.specialFromDate || "",
          resData.specialToDate || "",
        ];
        this.listQuery = Object.assign({ ...this.listQuery }, {
          title: `${getStoreName.call(this, this.listQuery.shopId)} ${resData.pagetitle}` || "",
          shortDescriptionStr: resData.featureListStr || "",
          descriptionStr: resData.productDescriptionStr || "",
          packageLength: resData.packLength || "",
          packageHeight: resData.packHeight || "",
          packageWidth: resData.packWidth || "",
          packageWeight: resData.packageWeight || "",
          promotion: resData.specialFromDate ? true : false,
        });
        this.isRecommend = true
        getCategoryRecommend({ authId: this.listQuery.shopId, title: this.listQuery.title }).then(res => {
          this.typeList.recommendList = res.data
        })
        if (res.data[0]) {
          this.skuList = [];
          res.data.forEach((item) => {
            this.skuList.push({
              colorFamily: "",
              images: item.images.map((item) => {
                return { url: item.imageurl };
              }),
              sellerSku: item.sku,
              lastbuyprice: item.lastbuyprice,
              price: item.lastbuyprice,
              unitshipfee: item.unitshipfee,
              retailPrice: item.retailPrice,
              salesPrice: item.salesPrice,
              prices: item.prices,
              quantity: item.goodnum,
              productnamecn: item.productnamecn,
              taxClass: "default",
              skuIsExist: "正在查询...",
            });
          });
          return;
        }
      }
      this.skuList = [];
    },
    handleCommand(command) {
      this.listQuery.primaryCategory = command
      this.getAttrsList()
    },
    titleChange() {
      if (this.listQuery.title !== '' && this.listQuery.shopId) {
        this.isRecommend = true;
        getCategoryRecommend({ authId: this.listQuery.shopId, title: this.listQuery.title }).then(res => {
          this.typeList.recommendList = res.data
        })
      }
    },
    handRemove(index) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.skuList.splice(index, 1)
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
    async priceChange(row) {
      if (isNaN(Number(row.price)) || row.price === "") row.price = 0;
      row.price = Math.abs(row.price);
      const params = {
        packageWeight: this.listQuery.packageWeight,
        publishedTo: this.listQuery.publishedTo.join(","),
        price: row.price,
        sellerSku: row.sellerSku,
        shopId: this.listQuery.shopId,
      };
      const res = await getLmExchangeRatePrice(params);
      row.prices = res.data.prices;
      row.retailPrice = res.data.retailPrice;
      row.salesPrice = res.data.salesPrice;
    },
    async SellerSkuIsExist() {
      if (!this.listQuery.shopId) {
        this.skuList.forEach((item) => {
          item.skuIsExist = "正在查询...";
        });
        return;
      }
      const res = await getSellerSkuIsExist({
        shopId: this.listQuery.shopId,
        sku: this.listQuery.sku,
      });
      this.skuList.forEach((skuItem) => {
        const isExist = res.data.some((item) => skuItem.sellerSku === item.sku);
        this.$set(skuItem, "skuIsExist", isExist ? "产品已刊登" : "产品未刊登");
      });
    },
    colorSearch(queryString, cb) {
      var restaurants = this.typeList.colorList;
      var results = queryString
        ? restaurants.filter((restaurant) => {
          return (
            restaurant.value
              .toLowerCase()
              .indexOf(queryString.toLowerCase()) === 0
          );
        })
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    async getWatermarkInfo() {
      if (!this.listQuery.watermarkId) {
        this.wartermarkInfo = {}
        return
      }
      const res = await listById({ id: this.listQuery.watermarkId })
      this.wartermarkInfo = res.data || {}
    },
    promotionChange(value) {
      if (!value) this.createTimeAndEndTime = null;
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
      try {
        const { formsValidate, $message } = this;
        if (!formsValidate()) {
          $message({ type: "warning", message: `请填完整信息` });
          return;
        }
        const pictureValid = this.skuList.every((item) => {
          return item.images.length >= 3;
        });
        if (!pictureValid) {
          $message({
            type: "warning",
            message: `请为每个变体sku插入至少3张图片`,
          });
          return;
        }
        const quantityValid = this.skuList.every((item) => {
          return item.quantity > 0;
        });
        if (!quantityValid) {
          $message({ type: "warning", message: `每个变体sku分配库存必须大于0` });
          return;
        }
        butSave ? (this.commitButtonLoding = true) : (this.saveButtonLoding = true);
        const query = Object.assign({}, {
          ...this.listQuery,
          autoTranslatedTo: this.listQuery.autoTranslatedTo.join(","),
          butSave,
          brand: this.listQuery.brand ? this.listQuery.brand : "No Brand",
          publishedTo: this.listQuery.publishedTo.join(","),
          skuParamList: this.skuList,
          attributes: JSON.stringify(this.addAttrQuery),
        });
        const res = await saveProductInfo(query);
        if (res.code === 200) {
          $message({
            type: "success",
            message: `${butSave ? "刊登" : "保存"}成功`,
          });
          this.$router.replace({ path: '/lazada/lzdPublish', query: { status: this.routeStatus }  });
        }
      } catch (error) { }
      butSave ? (this.commitButtonLoding = false) : (this.saveButtonLoding = false);
    },
    close() {
      this.$router.replace({ path: "/lazada/lzdPublish", query: { status: this.routeStatus }  });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-card__body {
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
.watermark {
  /deep/ .el-form-item__label {
    width: 80px !important;
    text-align: left;
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
.priceDetail {
  padding: 5px 0;
}

.skuPrice {
  text-align: left;

  /deep/ .label {
    display: inline-block;
    width: 22px;
  }
  .value {
    display: inline-block;
    width: 78px;
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