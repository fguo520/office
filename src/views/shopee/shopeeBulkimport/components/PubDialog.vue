<template>
  <el-dialog title="批量导入刊登" :visible.sync="visible" width="650px" :before-close="close" @open="open">
    <el-form ref="form" label-width="120px" size="mini" :model="listQuery" :rules="addRules">
      <el-form-item label="渠道：" prop="authId">
        <el-select v-model="listQuery.authId" placeholder="全部" size="mini" clearable filterable class="elform" @change="handldAuth">
          <el-option v-for="(item, index) in typeList.authIdList" :key="index" :label="item.storeNameAs" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="水印模板：">
        <el-select v-model="listQuery.watermarkId" placeholder="全部" size="mini" clearable filterable class="elform">
          <el-option v-for="(item, index) in typeList.watermarkIdList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-radio v-model="listQuery.watermarkType" label="0" v-if="listQuery.watermarkId">添加到主图</el-radio>
        <el-radio v-model="listQuery.watermarkType" label="1" v-if="listQuery.watermarkId">添加到所有图</el-radio>
      </el-form-item>
      <el-form-item prop="categoryId" label="类目：">
        <el-cascader v-model="listQuery.categoryId" size="mini" :options="typeList.categoryList" :placeholder="typeList.categoryList.length?'请选择类目':'选择渠道后获取类目'" style="width:400px" :props="{
                label: 'categoryName',
                value: 'categoryId',
              }" @change="getAttrsList" :key="cdnkey" filterable />
      </el-form-item>
      <DynamicFormItem :addAttrQuery.sync="addAttrQuery" :addFormItemList="typeList.addFormItemList" ref="dynamicForm" />
      <el-form-item label="物流方式：" prop="logisticId">
        <!-- <el-radio v-model="listQuery.logisticId" :label="item.id" v-for="(item,index) in typeList.logisticsList" :key="index">{{item.logisticName}}</el-radio> -->
        <el-checkbox-group v-model="listQuery.logisticId">
          <el-checkbox v-for="(item,index) in typeList.logisticsList" :key="index" :label="item.id">{{item.logisticName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="下载模板：">
        <el-button size="mini" @click="downExcel()">下载模板</el-button>
      </el-form-item>
      <el-form-item label="导入模板：" prop="file">
        <el-upload ref="upload" action :on-change="handleChange" :auto-upload="false" :limit="1" :on-exceed="limitExceed">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="定时刊登：">
        <el-date-picker v-model="listQuery.timingTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择定时刊登时间" :picker-options="pickerOptions" default-time="12:00:00" @change="handle" class="elform">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
const defaultListQuery = {
  authId: "",
  attributes: "",
  categoryId: [],
  file: '',
  logisticId: [],
  timingTime: '',
  watermarkId: "",
  watermarkType: '1',
}
function parseAddAttrQuery(query) {
  return JSON.stringify(Object.keys(query).map(item => ({
    attribute_value: query[item],
    attribute_id: Number(item)
  })))
}
import { getShopeePlatformAuthList, getShopeeApiCategoryNode, getShopeeWatermarkTemplate, getShopeeLogistics, getShopeeCategoryAttributes, getWalmartBrandList, importShopeeProduct } from "@/api/shopee/shopeeBulkimport"
import DynamicFormItem from "./DynamicFormItem";
export default {
  name: "PubDialog",
  components: {
    DynamicFormItem
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
      listQuery: Object.assign({}, defaultListQuery),
      addAttrQuery: {},
      typeList: {
        authIdList: [],
        watermarkIdList: [],
        logisticsList: [],
        categoryList: [],
        addFormItemList: {},
        brandList: [],
      },
      addRules: {
        authId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        logisticId: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        categoryId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        file: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      cdnkey: 0,
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    'listQuery.timingTime': function (newValue) {
      const timeArr = newValue === null ? "" : newValue;
      this.listQuery.timingTime = timeArr;
    },
    'listQuery.logisticId': function (newValue) {
      if (newValue.length == 0 && this.typeList.logisticsList.length > 0) {
        this.listQuery.logisticId = [this.typeList.logisticsList[0].id]
      }
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    async open() {
      const resAuthList = getShopeePlatformAuthList({ type: 1 });
      const resWaterList = getShopeeWatermarkTemplate();
      Promise.all([resAuthList, resWaterList]).then((res) => {
        this.typeList.authIdList = res[0].data
        this.typeList.watermarkIdList = res[1].data
      }).catch((err) => {
        this.typeList.authIdList = []
        this.typeList.watermarkIdList = []
      });
    },
    async handldAuth() {
      const regionCode = this.typeList.authIdList.find(i => { return i.id == this.listQuery.authId }).chooseCountry || '';
      const resLogistics = getShopeeLogistics({ authId: this.listQuery.authId });
      const resCategory = getShopeeApiCategoryNode({ regionCode })
      const resBrand = getWalmartBrandList({ authId: this.listQuery.authId })
      Promise.all([resLogistics, resCategory, resBrand]).then((res) => {
        this.typeList.logisticsList = res[0].data
        const logisticValue = this.typeList.logisticsList.find(i => { return i.logisticName === 'Standard Express' })
        if (!logisticValue) {
          this.listQuery.logisticId = [this.typeList.logisticsList[0].id]
        } else {
          this.listQuery.logisticId = [logisticValue.id]
        }
        this.typeList.categoryList = this.getTreeData(res[1].data)
        this.typeList.brandList = res[2].data
        this.getAttrsList()
        ++this.cdnkey
      }).catch((err) => {
        this.typeList.logisticsList = []
      });
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
    async getAttrsList(hasValue) {
      const regionCode = this.typeList.authIdList.find(i => { return i.id == this.listQuery.authId }).chooseCountry || "";
      const categoryId = this.listQuery.categoryId.slice(-1)[0] || '';
      if (!categoryId) {
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
    commit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const primaryCategory = this.listQuery.categoryId
        const formData = new FormData();
        const query = Object.assign({}, {
          ...this.listQuery,
          primaryCategory: primaryCategory,
          categoryId: this.listQuery.categoryId.slice(-1)[0] || '',
          attributes: parseAddAttrQuery(this.addAttrQuery),
        })
        for (let key in query) { formData.append(key, query[key]) }
        const res = await importShopeeProduct(formData);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功"
          })
          this.close();
          this.$emit("request")
        }
      })
    },
    close() {
      this.$emit("update:visible", false)
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
    },
    downExcel() {
      window.open("https://lemontree-prod.oss-cn-shenzhen.aliyuncs.com/shopee/report/Shopee%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls", '_self')
    },
    limitExceed() {
      this.$message({
        type: "warning",
        message: "一次只能上传一个文件"
      })
    },
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (Xls[Xls.length - 1] !== "xls" && Xls[Xls.length - 1] !== "xlsx" && Xls[Xls.length - 1] !== "csv") {
        this.$message.warning("请选择正确格式文件");
        this.$refs.upload.clearFiles();
        return false;
      }
      this.listQuery.file = file;
    },
    handle() {
      var startAt = new Date(this.listQuery.timingTime) * 1000 / 1000;
      if (startAt < Date.now()) {
        this.listQuery.timingTime = new Date();
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.elform {
  width: 200px;
}
</style>