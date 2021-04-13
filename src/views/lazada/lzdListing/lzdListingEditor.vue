<template>
  <el-card>
    <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
      <el-divider content-position="left">编辑刊登商品</el-divider>
      <el-form-item label="sku：">
        <el-input v-model="listQuery.sku" disabled style="width:200px;" />
      </el-form-item><br />
      <el-form-item label="店铺：">
        <el-select v-model="listQuery.shopId" placeholder="请选择店铺" clearable filterable disabled no-data-text="正在获取数据请稍后。。。">
          <el-option v-for="item in typeList.storeList" :key="item.id" :label="item.storeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item><br />
      <el-form-item prop="name" label="标题：">
        <el-input v-model="listQuery.name" style="width: 500px" maxlength="225" /><span style="margin-left:10px;color:#C0C4CC">{{maxlength+'/225'}}</span>
      </el-form-item><br />
      <el-form-item prop="primaryCategory" label="类目：">
        <el-cascader v-model="listQuery.primaryCategory" :options="typeList.categoryList" style="width: 500px" :props="{ label: 'name', value: 'categoryId' }" clearable filterable @change="getAttrsList(true)" :placeholder="typeList.categoryList.length ? '请选择类目' : '正在获取类目...'" />
      </el-form-item>

      <el-divider content-position="left">产品属性</el-divider>
      <el-form-item label="品牌：">
        <el-input v-model="listQuery.brand" placeholder="无品牌" style="width:200px;" />
      </el-form-item>

      <DynamicFormItem :addAttrQuery.sync="addAttrQuery" :addFormItemList="typeList.addFormItemList" ref="dynamicForm" />

      <el-divider content-position="left">包装信息</el-divider>
      <el-form-item prop="packageWeight" label="包裹重量：">
        <el-input v-model="listQuery.packageWeight" style="width: 80px" class="inptTextCenter" />
        kg
      </el-form-item>
      <el-form-item prop="packageLength" label="包装尺寸：">
        <el-input v-model="listQuery.packageLength" placeholder="长(cm)" style="width: 80px" class="inptTextCenter" />
        *
        <el-input v-model="listQuery.packageWidth" placeholder="宽(cm)" style="width: 80px" class="inptTextCenter" />
        *
        <el-input v-model="listQuery.packageHeight" placeholder="高(cm)" style="width: 80px" class="inptTextCenter" />
      </el-form-item>
      <el-divider content-position="left">价格&库存</el-divider>

      <el-form-item style="margin-left: 40px; margin-right: 40px" class="el-table-form">
        <el-table ref="skuForm" :data="skuList" style="width: 100%;font-size:13px" border empty-text="输入正确sku后查询变体sku" size="mini" :header-cell-style="{ 'background-color': '#dadde3' }">
          <el-table-column prop="sellerSku" label="SellerSKU" width="100" align="center" />
          <el-table-column prop="colorFamily" label="颜色" width="160" align="center">
            <template #default="{ row }">
              <el-select v-model="row.colorFamily" placeholder="暂无颜色" clearable filterable no-data-text="请先选择类目" class="inptTextCenter">
                <el-option v-for="item in typeList.colorList" :key="item.name" :label="item.name" :value="item.name" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="" label="刊登价格" width="140" align="center">
            <template #default="{ row }">
              <el-input v-model="row.price" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="date" label="刊登促销价格" width="140" align="center">
            <template #default="{ row }">
              <el-input v-model="row.specialPrice" class="inptTextCenter" />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="库存数量" width="120" align="center">
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
          <div style="color: gray; font-size: 13px">
            {{ item.sellerSku }}
          </div>
          <UploadImage :fileList.sync="item.images" :id="listQuery.shopId" :watermark="wartermarkInfo" />
        </div>
      </el-form-item>

      <el-form-item prop="shortDescriptionStr" label="简短描述：" class="specialFormItem">
        <Tinymce :height="300" v-model="listQuery.shortDescriptionStr" :resetContent.sync="tinymceReset" :params="{ shopId: listQuery.shopId }" />
      </el-form-item><br />

      <el-form-item prop="descriptionStr" label="详细描述：" class="specialFormItem">
        <Tinymce :height="300" v-model="listQuery.descriptionStr" :resetContent.sync="tinymceReset" :params="{ shopId: listQuery.shopId }" />
      </el-form-item><br />

      <el-form-item label="包裹里面是什么：" style="margin-top: 20px">
        <el-input v-model="listQuery.packageContent" style="width: 500px" maxlength="225" show-word-limit></el-input>
      </el-form-item>

      <el-divider />

      <div style="text-align: center; margin-bottom: 150px">
        <el-button @click="close">关闭页面</el-button>
        <el-button type="primary" @click="onSubmit()">更新listing刊登</el-button>
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
  getLmExchangeRatePrice,
  getProductListingUpdate,
  listsaveProductInfo,
} from "@/api/lazada/lzdPublishEditor";
import { getList as getWatermarkList, listById } from "@/api/common/sysWatermark";
import { Tinymce } from "@/components";
import UploadImage from "../lzdPublish/components/UploadImage";
import Inventory from "../lzdPublish/components/Inventory";
import DynamicFormItem from "../lzdPublish/components/DynamicFormItem";
const defaultListQuery = {
  sku: "",
  shopId: "",
  title: "",
  primaryCategory: [],
  brand: "",
  attributes: "",
  packageHeight: "",
  packageWidth: "",
  packageWeight: "",
  packageLength: "",
  packageContent: "",
  watermarkId: "",
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
export default {
  name: "lzdPublishEditor",
  data() {
    const primaryCategoryRules = [
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
    ];
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addAttrQuery: {},
      skuList: [],
      typeList: {
        categoryList: [],
        storeList: [],
        colorList: {},
        addFormItemList: {},
        watermarkList: [],
      },
      rules: {
        name: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        primaryCategory: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        packageWeight: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        packageLength: primaryCategoryRules,
        shortDescriptionStr: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        descriptionStr: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        autoAllocateStock: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
      },
      createTimeAndEndTime: ["", ""],
      tinymceReset: true,
      wartermarkInfo: {},
      maxlength: "0"
    };
  },
  props: {
    routeItemId: {
      type: undefined,
      default: "",
    },
    routeSku: {
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
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.specialFromDate = timeArr[0];
      this.listQuery.specialToDate = timeArr[1];
    },
    "listQuery.primaryCategory": function (newValue) {
      if (!newValue && !(newValue instanceof Array)) return;
      if (!newValue.length) {
        this.typeList.colorList = [];
        this.typeList.addFormItemList = {};
      }
    },
    'listQuery.name': function (newValue) {
      this.maxlength = newValue.length
    }
  },
  methods: {
    async getSearchType() {
      // 修改商品时获取所有的产品属性
      getProductListingUpdate({ itemId: this.routeItemId }).then((res) => {
        const { skuParamList, attributes, ...query } = res.data;
        this.skuList = skuParamList;
        this.addAttrQuery = JSON.parse(attributes);
        this.tinymceReset = true;
        this.listQuery = {
          ...this.listQuery,
          ...query,
        };
        if (this.listQuery.region) {
          getCategoryNodeTree({ region: this.listQuery.region }).then((res) => {
            this.typeList.categoryList = resetChildNode(res.data);
            this.getAttrsList();
          });
        }
        this.getWatermarkInfo();
        this.listQuery.sku = this.routeSku;
      });
      //获取 ‘店铺’ ‘水印’ 选项
      getLmSysPlatformAuthList().then((res) => {
        this.typeList.storeList = res.data;
      });
      getWatermarkList({ pageSize: 999999, pageNum: 1, status: 1 }).then(res => {
        this.typeList.watermarkList = res.data.list
      })
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
    async getAttrsList(reset) {
      const categoryId = this.listQuery.primaryCategory.slice(-1)[0] || "";
      if (!categoryId) return;
      const res = await getCategoryAttributes({
        categoryId,
        region: this.listQuery.region,
        isFilter: true,
      });
      let inputTypeList = {};
      let addAttrQuery = {};
      res.data.forEach((item) => {
        inputTypeList[item.name] = item;
        addAttrQuery[item.name] = "";
      });
      //动态添加提交给后台的字段
      if (reset) this.addAttrQuery = addAttrQuery;
      //动态生成form表单
      const { color_family, ...otherAttr } = inputTypeList;
      this.typeList.addFormItemList = otherAttr;
      //获取颜色列表
      if (!(color_family instanceof Object)) return;
      this.typeList.colorList = JSON.parse(color_family.options);
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
      const { formsValidate, $message } = this;
      if (!formsValidate()) {
        $message({ type: "warning", message: `请填完整信息` });
        return;
      }
      const pictureValid = this.skuList.every(item => {
        return item.images.length >= 3;
      });
      if (!pictureValid) {
        this.$message({
          type: "warning",
          message: `请为每个变体sku插入3张图片`,
        });
        return;
      }
      // this.listQuery.primaryCategory=this.listQuery.primaryCategory[this.listQuery.primaryCategory.length-1]
      const query = Object.assign({}, {
        ...this.listQuery,
        brand: this.listQuery.brand ? this.listQuery.brand : "No Brand",
        skuParamList: this.skuList,
        primaryCategory: this.listQuery.primaryCategory[
          this.listQuery.primaryCategory.length - 1
        ],
        attributes: JSON.stringify(this.addAttrQuery),
      }
      );
      const res = await listsaveProductInfo(query);
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: `保存成功`,
        });
      this.$router.replace({ path: "/lazada/lzdListing" });
      }
    },
    close() {
      this.$router.replace({ path: "/lazada/lzdListing" });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-card__body {
  padding: 0px;
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
</style>