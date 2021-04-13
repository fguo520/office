<template>
  <el-card>
    <el-form ref="form" :model="listQuery" label-width="80px" inline :rules="rules" size="mini">
      <el-divider content-position="left"><span class="dividerLabel">编辑刊登商品</span></el-divider>
      <el-form-item prop="authId" label="渠道：">
        <el-select v-model="listQuery.authId" placeholder="请选择渠道" filterable no-data-text="正在获取数据请稍后。。。" @change="handShopId" :disabled="!listQuery.isSpell">
          <el-option v-for="item in typeList.storeList" :key="item.id" :label="item.storeNameAs" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item prop="sku" label="sku：">
        <el-input v-model.trim="listQuery.sku" @change="skuChange" :disabled="!listQuery.isSpell" />
      </el-form-item><br>
      <el-form-item prop="categoryId" label="类目：">
        <el-cascader v-model="listQuery.categoryId" size="mini" :options="typeList.categoryList" :placeholder="typeList.categoryList.length?'请选择类目':'选择渠道后获取类目'" style="width:500px" :props="{
                label: 'categoryName',
                value: 'categoryId',
              }" @change="getAttrsList" :key="cdnkey" clearable filterable />
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
        <el-date-picker v-model="listQuery.timingTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择定时刊登时间" :picker-options="pickerOptions" default-time="12:00:00" @change="handle" class="elform">
        </el-date-picker>
      </el-form-item><br>
      <el-form-item label="产品物流属性：">
        <el-input v-model="listQuery.withbattery" disabled /><span v-if="listQuery.isContraband" style="color:red;margin-left:15px">该产品可能违禁，刊登请注意</span>
      </el-form-item><br>
      <el-divider content-position="left"><span class="dividerLabel">产品属性</span></el-divider>
      <DynamicFormItem :addAttrQuery.sync="addAttrQuery" :addFormItemList="typeList.addFormItemList" ref="dynamicForm" />
      <el-divider content-position="left"><span class="dividerLabel">重量尺寸</span></el-divider>
      <div style="display: contents;">
        <el-form-item label="重量：" prop="packageWeight">
          <NumberInput v-model="listQuery.packageWeight" @change="priceChange(listQuery.packageWeight)" min="0" max="999999" float style="width:100px"><i slot="suffix" style="font-style: normal; margin-right: 10px">kg</i></NumberInput>
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
          <el-table-column prop="sellerSku" label="系统Sku" width="150" align="center">
            <template #default="{ row }">
              <div>{{ row.sellerSku }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="customSku" width="220" align="center">
            <template #header>
              <div><span style="color:#F56C6C">* </span>渠道Sku</div>
            </template>
            <template #default="{ row }">
              <el-input v-model="row.customSku" clearable style="width:180px" class="inptTextCenter" />
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
          <el-table-column prop="referenceStock" label="参考库存" width="100" align="center">
            <template #default="{ row }">
              <div><b>{{row.referenceStock}}</b></div>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100" align="center">
            <template #default="{ row }">
              <NumberInput v-model="row.stock" min="0" float style="width:75px" class="inptTextCenter"></NumberInput>
            </template>
          </el-table-column>
          <el-table-column prop="isPublish" label="是否刊登" width="100" align="center">
            <template #default="{ row }">
              <div v-if="row.isPublish">是</div>
              <div v-else>否</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handRemove(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="this.warmPrompt.length>0">
          <div style="color:red">温馨提示：刊登售价/刊登原价不能超过规定价格{{warmPrompt}}</div>
        </div>
      </el-form-item>
      <el-divider content-position="left"></el-divider>
      <el-form-item prop="watermarkId" label="水印模板:" class="watermark">
        <el-select v-model="listQuery.watermarkId" clearable placeholder="请选择" @change="getWatermarkInfo">
          <el-option v-for="item in typeList.watermarkList" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" @click="handImgbank" size="mini" v-if="this.images.length>0">图片银行</el-button>
      </el-form-item>
      <el-form-item prop="images" label="图片：(3~9张)" class="specialFormItem">
        <UploadImage :fileList.sync="images" :sku="listQuery.sku" :watermark="wartermarkInfo" />
      </el-form-item>
      <ImgBank :visible.sync="imgBank.visible" :list="imgBank.imgsAll" :imgs="imgBank.imgs" @commit="requestImg" />
      <el-form-item prop="testStr" label="产品描述：" class="specialFormItem">
        <Tinymce :height="300" v-model="listQuery.testStr" :resetContent.sync="tinymceReset" :params="{sku:listQuery.sku}" :action="action" limit="3000" showLimit limitHtml :limitReset="false" />
      </el-form-item><br>
      <div style="text-align:center; margin-bottom:150px;">
        <el-button @click="onSubmit(0)" :loading="saveButtonLoding" v-if="routeIsture">保存至草稿</el-button>
        <el-button @click="close">关闭页面</el-button>
        <el-button type="primary" @click="onSubmit(1)" :loading="commitButtonLoding" v-if="routeIsture">提交刊登</el-button>
      </div>
    </el-form>
  </el-card>
</template>
<script>     
import { getLmShApiProductInfoList, getShopeePlatformAuthList, getShopeeApiCategoryNode, getShopeeLogistics, getWalmartBrandList, getShopeeCategoryAttributes, getShopeeProductPrice, getShopeeWatermarkTemplate, saveShopeeProduct, getShopeeProductGetUpdate, getLmShApiProductImageList } from "@/api/shopee/shopeeEditor"
import { listById } from "@/api/common/sysWatermark";
import { Tinymce, NumberInput, ScrollSelect } from "@/components";
import DynamicFormItem from "./components/DynamicFormItem";
import UploadImage from "./components/UploadImage";
import ImgBank from "./components/ImgBank";
const defaultListQuery = {
  authId: "",
  sku: "",
  productName: "",
  categoryId: '',
  logisticId: [],
  daysToShip: null,
  withbattery: "",
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
  name: "ShopeeEditor",
  data() {
    var testStrValid = (rule, value, callback) => {
      const { testStr } = this.listQuery
      if (testStr === '') {
        callback(new Error('此项不能为空'));
      } else {
        callback();
      }
    };
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
        testStr: [{ validator: testStrValid, trigger: "change" }],
      },
      maxlength: 0,
      saveButtonLoding: false,
      commitButtonLoding: false,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
      images: [],
      imagesAll: [],
      imgBank: {
        visible: false,
        imgsAll: [],
        imgs: []
      },
      warmPrompt: ""
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
    routeIsture: {
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
    UploadImage,
    ImgBank,
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
    },
    'listQuery.testStr': function (value) {
      this.$refs.form.validateField('testStr')
    }
  },
  created() {
    this.getType()
  },
  methods: {
    async getType() {
      if (this.routeSku) {
        const res = await getShopeeProductGetUpdate({
          sku: this.routeSku,
          taskNo: this.routeTaskNo,
        });
        const { skuParamList, attributes, images, primaryCategory, descriptionStr, ...query } = res.data;
        this.tableList = skuParamList;
        this.images = images;
        this.addAttrQuery = parseAddAttrQuery(attributes, 'obtain')
        this.tinymceReset = true;
        this.listQuery = {
          ...this.listQuery,
          ...query,
          originalSku: this.routeSku,
          taskNo: this.routeTaskNo,
          isSpell: false,
          categoryId: primaryCategory,
          testStr: descriptionStr
        };
        const resImg = await getLmShApiProductImageList({ sellerSku: this.tableList.map(item => item.sellerSku) })
        this.imagesAll = resImg.data
      }

      this.getWatermarkInfo();
      let resAuth;
      if (this.routeSku) {
        resAuth = getShopeePlatformAuthList();
      } else {
        resAuth = getShopeePlatformAuthList({ type: 1 });
      }
      const resWater = getShopeeWatermarkTemplate()
      Promise.all([resAuth, resWater]).then((res) => {
        this.typeList.storeList = res[0].data
        this.warmPrompt = this.typeList.storeList.find(i => { return i.id == this.listQuery.authId }).priceLimit
        if (this.routeSku && this.typeList.storeList.length > 0) {
          this.getUpdate()
        }
        this.typeList.watermarkList = res[1].data
      }).catch((err) => { });
    },
    async handShopId() {
      if (this.typeList.storeList.length > 0) {
        this.getUpdate()
        this.warmPrompt = this.typeList.storeList.find(i => { return i.id == this.listQuery.authId }).priceLimit
      }
      if (this.listQuery.sku == "") return false;
      this.skuChange();
      this.listQuery.logisticId = []
      this.listQuery.daysToShip = null
    },
    async getUpdate() {
      const regionCode = this.typeList.storeList.find(i => { return i.id == this.listQuery.authId }).chooseCountry || '';
      const res = getShopeeApiCategoryNode({ regionCode })
      const resLogistics = getShopeeLogistics({ authId: this.listQuery.authId })
      const resBrand = getWalmartBrandList({ authId: this.listQuery.authId })
      Promise.all([res, resLogistics, resBrand]).then((res) => {
        this.typeList.categoryList = this.getTreeData(res[0].data)
        this.typeList.logisticList = res[1].data
        const logisticValue = this.typeList.logisticList.find(i => { return i.logisticName === 'Standard Express' })
        if (!this.routeSku) {
          if (!logisticValue) {
            this.listQuery.logisticId = [this.typeList.logisticList[0].id]
          } else {
            this.listQuery.logisticId = [logisticValue.id]
          }
          this.handLogistic(this.listQuery.logisticId)
        }
        this.typeList.brandList = res[2].data
        this.getAttrsList()
        ++this.cdnkey
      }).catch((err) => { });
    },
    async skuChange() {
      this.tinymceReset = true;
      this.images = []
      if (this.listQuery.authId == "") return this.$message.warning("请选择渠道");
      if (this.listQuery.sku !== "") {
        const categoryId = this.listQuery.categoryId.slice(-1)[0] || '';
        const res = await getLmShApiProductInfoList({ ...this.listQuery, categoryId })
        const resData = res.data[0] || {};
        const authName = this.typeList.storeList.find(i => { return i.id == this.listQuery.authId }).storeNameAs
        this.listQuery = Object.assign({ ...this.listQuery }, {
          productName: authName + " " + resData.pagetitle || "",
          withbattery: resData.withbattery || "",
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
              customSku: item.sku,
              isPublish: item.isPublish,
              referenceStock: item.referenceStock,
              stock: item.stock,
              variationName: item.variationName,
              price: 0,
              saleprice: 0
            })
          })
          this.images = res.data[0].images.map((item) => ({ url: item.ossimageurl, isWatermark: false }))
          this.priceChange(this.listQuery.authId)
          const resImg = await getLmShApiProductImageList({ sellerSku: this.tableList.map(item => item.sellerSku) })
          this.imagesAll = resImg.data
          return;
        }
      }
    },
    handImgbank() {
      this.imgBank = {
        visible: true,
        imgsAll: this.imagesAll.map(item => { return { ...item, isAll: false } }),
        imgs: this.images
      }
    },
    requestImg(e) {
      this.images = e
    },
    handLogistic(value) {
      if (value[0] && this.typeList.logisticList.length > 0) {
        this.listQuery.daysToShip = this.typeList.logisticList.find(i => { return i.id == this.listQuery.logisticId[0] }).shippingDays || "";
        if (this.listQuery.packageWeight) {
          this.priceChange(value)
        }
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
    handRemove(index) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableList.splice(index, 1)
        getLmShApiProductImageList({ sellerSku: this.tableList.map(item => item.sellerSku) }).then(res => {
          this.images = res.data
        })
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
    async priceChange(value) {
      if (value && this.listQuery.logisticId.length > 0) {
        const params = {
          authId: this.listQuery.authId,
          logisticId: this.listQuery.logisticId,
          packageWeight: this.listQuery.packageWeight,
          sellerSku: this.tableList.map(i => i.sellerSku) || []
        }
        const res = await getShopeeProductPrice(params)
        res.data.forEach((item, index) => {
          this.tableList[index].price = item.price
          this.tableList[index].sellsPrice = item.sellsPrice
        })
      }
    },
    async getWatermarkInfo(reset) {
      if (!this.listQuery.watermarkId) {
        this.wartermarkInfo = {}
        return
      }
      const res = await listById({ id: this.listQuery.watermarkId })
      this.wartermarkInfo = res.data || {}
      if (reset) this.images.forEach(item => { item.isWatermark = true })
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
        const { formsValidate, $message } = this;
        if (!formsValidate()) {
          $message({ type: "warning", message: `请填完整信息` });
          return;
        }
        const pictureValid = Boolean(this.images.length >= 3);
        if (!pictureValid) {
          $message({
            type: "warning",
            message: `请为每个变体sku插入至少3张图片`,
          });
          return;
        }
        butSave ? (this.commitButtonLoding = true) : (this.saveButtonLoding = true);
        const query = Object.assign({}, {
          ...this.listQuery,
          categoryId: this.listQuery.categoryId.slice(-1)[0] || '',
          primaryCategory: this.listQuery.categoryId,
          butSave,
          images: this.images,
          skuParamList: this.tableList,
          attributes: parseAddAttrQuery(this.addAttrQuery, 'commit'),
          descriptionStr: this.listQuery.testStr
        });
        const res = await saveShopeeProduct(query);
        if (res.code === 200) {
          $message({
            type: "success",
            message: `${butSave ? "刊登" : "保存"}成功`,
          });
          this.$router.replace({ path: '/shopee/shopeePublish', query: { status: this.routeStatus } });
        }
        this.listQuery.isSpell = false;
      } catch (error) { }
      butSave ? (this.commitButtonLoding = false) : (this.saveButtonLoding = false);
    },
    handle() {
      var startAt = new Date(this.listQuery.timingTime) * 1000 / 1000;
      if (startAt < Date.now()) {
        this.listQuery.timingTime = new Date();
      }
    },
    close() {
      this.$router.replace({ path: "/shopee/shopeePublish", query: { status: this.routeStatus } });
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
/deep/ .el-form-item__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
