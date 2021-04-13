<template>
  <el-card>
    <el-form ref="form" :model="listQuery" label-width="80px" inline :rules="rules" size="mini">
      <el-divider content-position="left"><span class="dividerLabel">编辑刊登商品</span></el-divider>
      <el-form-item prop="authId" label="渠道：">
        <el-select v-model="listQuery.authId" placeholder="请选择渠道" clearable filterable no-data-text="正在获取数据请稍后。。。" :disabled="!listQuery.isSpell">
          <el-option v-for="item in typeList.storeList" :key="item.id" :label="item.storeNameAs" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item prop="sku" label="sku：">
        <el-input v-model="listQuery.sku" @change="skuChange" :disabled="!listQuery.isSpell" />
      </el-form-item><br>
      <el-form-item prop="categoryId" label="类目：">
        <el-cascader v-model="listQuery.categoryId" size="mini" :options="typeList.categoryList" :placeholder="typeList.categoryList.length?'请选择类目':'选择渠道后获取类目'" style="width:500px" :props="{ label: 'categoryName', value: 'categoryId' }" @change="getAttrsList" :key="cdnkey" clearable filterable />
      </el-form-item><br>
      <el-form-item prop="productName" label="标题：">
        <el-input v-model="listQuery.productName" style="width:500px" maxlength="200" /><span style="margin-left:10px;color:#C0C4CC">{{maxlength+'/200'}}</span>
      </el-form-item><br>
      <el-form-item prop="logisticId" label="物流方式：">
        <ScrollSelect v-model="listQuery.logisticId" :list="typeList.logisticList" :prop='{label:"logisticName",value:"id"}' placeholder="可多选" @input="handLogistic" />
      </el-form-item><br>
      <el-form-item prop="daysToShip" label="出货天数：">
        <NumberInput v-model="listQuery.daysToShip" min="0" float></NumberInput>
      </el-form-item><br>
      <el-form-item label="定时刊登：">
        <el-date-picker v-model="listQuery.timingTime" type="datetime" placeholder="选择定时刊登时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" default-time="12:00:00" @change="handle" class="elform">
        </el-date-picker>
      </el-form-item><br>
      <el-divider content-position="left"><span class="dividerLabel">产品属性</span></el-divider>
      <DynamicFormItem :addAttrQuery.sync="addAttrQuery" :addFormItemList="typeList.addFormItemList" ref="dynamicForm" />
      <el-divider content-position="left"><span class="dividerLabel">重量尺寸</span></el-divider>
      <div style="display:contents">
        <el-form-item label="重量：" prop="packageWeight">
          <NumberInput v-model="listQuery.packageWeight" min="0" max="999999" float style="width:100px"><i slot="suffix" style="font-style: normal; margin-right: 10px">kg</i></NumberInput>
        </el-form-item>
        <el-form-item label="长：" prop="packageLength">
          <NumberInput v-model="listQuery.packageLength" min="0" max="999999" float style="width:100px"><i slot="suffix" style="font-style: normal; margin-right: 10px">cm</i></NumberInput>
        </el-form-item>
        <el-form-item label="宽：" prop="packageWidth">
          <NumberInput v-model="listQuery.packageWidth" min="0" max="999999" float style="width:100px"><i slot="suffix" style="font-style: normal; margin-right: 10px">cm</i></NumberInput>
        </el-form-item>
        <el-form-item label="高：" prop="packageHeight">
          <NumberInput v-model="listQuery.packageHeight" min="0" max="999999" float style="width:100px"><i slot="suffix" style="font-style: normal; margin-right: 10px">cm</i></NumberInput>
        </el-form-item>
      </div>
      <el-divider content-position="left"><span class="dividerLabel">价格&库存</span></el-divider>
      <el-form-item style="margin-left:40px;margin-right:40px;" class="table">
        <el-table ref="skuForm" :data="tableList" style="width: 100%;font-size:13px" border empty-text="输入正确sku和选择店铺后查询变体sku" size="mini" :header-cell-style="{ 'background-color': '#dadde3' }">
          <el-table-column prop="sellerSku" label="系统Sku" width="200" align="center">
            <template #default="{ row }">
              <div>{{ row.sellerSku }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="customSku" width="250" align="center">
            <template #header>
              <div><span style="color:#F56C6C">* </span>渠道Sku</div>
            </template>
            <template #default="{ row }">
              <el-input v-model="row.customSku" clearable style="width:220px" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="variationName" label="规格名称" width="220" align="center">
            <template #default="{ row }">
              <div>
                <el-input size="mini" v-model="row.variationName" maxlength="20" style="width:180px" class="inptTextCenter"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="saleprice" label="刊登售价" width="100" align="center">
            <template #default="{ row }">
              <div>{{row.sellsPrice}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="刊登原价" width="100" align="center">
            <template #default="{ row }">
              <div>{{row.price}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100" align="center">
            <template #default="{ row }">
              <div>{{row.stock}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="this.warmPrompt.length>0">
          <div style="color:red">温馨提示：刊登售价/刊登原价不能超过规定价格{{warmPrompt}}</div>
        </div>
      </el-form-item>
      <el-divider content-position="left"></el-divider>
      <el-form-item prop="productdescription" label="产品描述：" class="specialFormItem">
        <Tinymce :height="300" v-model="listQuery.testStr" :resetContent.sync="tinymceReset" :params="{sku:listQuery.sku}" :action="action" />
      </el-form-item><br>
      <div style="text-align:center; margin-bottom:150px;">
        <el-button @click="close">关闭页面</el-button>
        <el-button type="primary" @click="onSubmit()" :loading="commitButtonLoding">提交至平台</el-button>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import { getLmShApiProductInfoList, getShopeePlatformAuthList, getShopeeApiCategoryNode, getShopeeLogistics, getWalmartBrandList, getShopeeCategoryAttributes, getShopeeProductPrice, getShopeeWatermarkTemplate, saveShopeeProduct, getShopeeProductGetUpdate } from "@/api/shopee/shopeeEditor"
import { getShopeeListingGetUpdate, updateShopeeListing } from "@/api/shopee/shopeeListing";
import { listById } from "@/api/common/sysWatermark";
import { Tinymce, NumberInput, ScrollSelect } from "@/components";
import DynamicFormItem from "./components/DynamicFormItem";
const defaultListQuery = {
  authId: "",
  sku: "",
  productName: "",
  categoryId: '',
  logisticId: [],
  daysToShip: null,
  packageWeight: null,
  packageLength: null,
  packageWidth: null,
  packageHeight: null,
  watermarkId: "",
  testStr: "",
  isSpell: true,
  isContraband: false
}
function parseAddAttrQuery(query, type) {
  if (type === 'obtain') {
    const addAttrQuery = {}
    JSON.parse(query).forEach(item => {
      addAttrQuery[item.attribute_id] = item.attribute_value
    })
    return addAttrQuery
  }

  if (type === 'commit') {
    return JSON.stringify(Object.keys(query).map(item => ({
      attribute_value: query[item],
      attribute_id: Number(item)
    })))
  }
}
export default {
  name: "shopeeEditor",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addAttrQuery: {},
      cdnkey: 0,
      typeList: {
        storeList: [],
        categoryList: [],
        logisticList: [],
        brandList: [],
        colorList: [],
        addFormItemList: {},
        watermarkList: []
      },
      tableList: [],
      tinymceReset: true,
      action: `${process.env.SHOPPE_API}/shopee/product/uploadImage`,
      wartermarkInfo: {},
      rules: {
        sku: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        authId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        productName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        categoryId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        logisticId: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        daysToShip: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        packageWeight: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        packageLength: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        packageWidth: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        packageHeight: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      maxlength: 0,
      commitButtonLoding: false,
      images: [],
      addAttrData: [],
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
      warmPrompt: ""
    }
  },
  props: {
    routeitemId: {
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
    NumberInput,
    DynamicFormItem,
    ScrollSelect
  },
  watch: {
    'listQuery.productName': function (newValue) {
      this.maxlength = newValue.length
    },
    'listQuery.logisticId': function (newValue) {
      if (newValue.length == 0 && this.typeList.logisticList.length > 0) {
        this.listQuery.logisticId = [this.typeList.logisticList[0].id]
        this.handLogistic(this.listQuery.logisticId)
      }
    }
  },
  created() {
    this.getType()
  },
  methods: {
    async getType() {
      const res = await getShopeeListingGetUpdate({
        itemId: this.routeitemId,
      });
      const { skuParamList, attributes, images, primaryCategory, descriptionStr, ...query } = res.data;
      this.tableList = skuParamList;
      this.addAttrQuery = parseAddAttrQuery(attributes, 'obtain')
      this.tinymceReset = true;
      this.listQuery = {
        ...this.listQuery,
        ...query,
        isSpell: false,
        categoryId: primaryCategory,
        testStr: descriptionStr
      };
      const resAuth = getShopeePlatformAuthList();
      const resWater = getShopeeWatermarkTemplate()
      Promise.all([resAuth, resWater]).then((res) => {
        this.typeList.storeList = res[0].data
        this.warmPrompt = this.typeList.storeList.find(i => { return i.id == this.listQuery.authId }).priceLimit
        if (this.routeitemId && this.typeList.storeList.length > 0) {
          this.getUpdate()
        }
        this.typeList.watermarkList = res[1].data
      }).catch((err) => {
        console.log(err)
      });
    },
    async getUpdate() {
      const regionCode = this.typeList.storeList.find(i => { return i.id == this.listQuery.authId }).chooseCountry || '';
      const res = getShopeeApiCategoryNode({ regionCode: regionCode })
      const resLogistics = getShopeeLogistics({ authId: this.listQuery.authId })
      const resBrand = getWalmartBrandList({ authId: this.listQuery.authId })
      Promise.all([res, resLogistics, resBrand]).then((res) => {
        this.typeList.categoryList = this.getTreeData(res[0].data)
        this.typeList.logisticList = res[1].data
        const logisticValue = this.typeList.logisticList.find(i => { return i.logisticName === 'Standard Express' })
        if (!this.routeitemId) {
          if (!logisticValue) {
            this.listQuery.logisticId = [this.typeList.logisticList[0].id]
          } else {
            this.listQuery.logisticId = [logisticValue.id]
          }
        }
        this.typeList.brandList = res[2].data
        this.getAttrsList()
        ++this.cdnkey
      }).catch((err) => {
      });
    },
    async skuChange() {
      this.tinymceReset = true;
      this.images = []
      if (this.listQuery.authId == "") return this.$message.warning("请选择渠道");
      if (this.listQuery.sku !== "") {
        const categoryId = this.listQuery.categoryId.slice(-1)[0] || '';
        const res = await getLmShApiProductInfoList({ ...this.listQuery, categoryId })
        const resData = res.data[0] || {};
        this.listQuery = Object.assign({ ...this.listQuery }, {
          productName: resData.pagetitle || "",
          packageWeight: resData.packageWeight || "",
          packageLength: resData.packLength || "",
          packageWidth: resData.packWidth || "",
          packageHeight: resData.packHeight || "",
          testStr: resData.productDescriptionStr + "<br>" + resData.mateKeywordStr || "",
          isContraband: resData.isContraband || "",
        });
        if (res.data[0]) {
          this.tableList = [];
          res.data.forEach((item) => {
            this.tableList.push({
              sellerSku: item.sku,
              customSku: item.customSku,
              isPublish: item.isPublish,
              stock: item.stock,
              variationName: item.variationName,
              price: 0,
              saleprice: 0
            })
          })
          return;
        }
      }
    },
    handLogistic(value) {
      if (value[0] && this.typeList.logisticList.length > 0) {
        this.listQuery.daysToShip = this.typeList.logisticList.find(i => { return i.id == this.listQuery.logisticId[0] }).shippingDays || "";
      }
    },
    async getAttrsList(hasValue) {
      const regionCode = this.typeList.storeList.find(i => { return i.id == this.listQuery.authId }).chooseCountry || "";
      const categoryId = this.listQuery.categoryId.slice(-1)[0] || '';
      if (!categoryId) {
        this.typeList.colorList = [];
        this.typeList.addFormItemList = {};
        return;
      }
      const res = await getShopeeCategoryAttributes({ categoryId, regionCode });
      let inputTypeList = {};
      let addAttrQuery = {};
      res.data.forEach(item => {
        if (item.attributeName === 'Brand') {
          const brandList = this.typeList.brandList.reduce((arr, item) => {
            arr.push(item.brandName)
            return arr
          }, ["No Brand"])
          item.options = JSON.stringify(brandList)
        }
        inputTypeList[item.attributeId] = item;
        addAttrQuery[item.attributeId] = JSON.parse(item.options)[0] || "";
      });
      //动态添加提交给后台的字段
      if (hasValue) this.addAttrQuery = addAttrQuery;
      //动态生成form表单
      this.typeList.addFormItemList = inputTypeList;
    },
    //递归
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children) break;
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    async getWatermarkInfo() {
      if (!this.listQuery.watermarkId) {
        this.wartermarkInfo = {}
        return
      }
      const res = await listById({ id: this.listQuery.watermarkId })
      this.wartermarkInfo = res.data || {}
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
    async onSubmit() {
      try {
        const { formsValidate, $message } = this;
        if (!formsValidate()) {
          $message({ type: "warning", message: `请填完整信息` });
          return;
        }
        const query = Object.assign({}, {
          ...this.listQuery,
          categoryId: this.listQuery.categoryId.slice(-1)[0] || '',
          primaryCategory: this.listQuery.categoryId,
          skuParamList: this.tableList,
          attributes: parseAddAttrQuery(this.addAttrQuery, 'commit'),
          descriptionStr: this.listQuery.testStr
        });
        const res = await updateShopeeListing(query);
        if (res.code === 200) {
          $message({ type: "success", message: `提交成功` });
          this.$router.replace({ path: '/shopee/shopeeListing', query: { status: this.routeStatus } });
        }
        this.listQuery.isSpell = false;
      } catch (error) { }
      this.commitButtonLoding
    },
    handle() {
      var startAt = new Date(this.listQuery.timingTime) * 1000 / 1000;
      if (startAt < Date.now()) {
        this.listQuery.timingTime = new Date();
      }
    },
    close() {
      this.$router.replace({ path: "/shopee/shopeeListing", query: { status: this.routeStatus } });
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
  padding: 0px;
}
/deep/ .el-form-item__label {
  width: 150px !important;
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
