<template>
  <el-dialog title="上传末级类目属性" :visible.sync="visible" width="600px" :before-close="close" append-to-body>
    <el-form ref="form" label-width="120px" size="mini" :model="listQuery" :rules="rules">
      <el-form-item label="国家：" prop="marketplaceid">
        <el-select v-model="listQuery.marketplaceid" placeholder="请选择" filterable style="width:200px" @change="getCascader">
          <el-option v-for="item in countryList" :key="item.id" :label="item.parameterName" :value="item.parameterValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="末级类目：" prop="parentId">
        <!-- <el-cascader :props="categoryProps" v-model="listQuery.parentId" filterable :key="cdnkey" :placeholder="listQuery.marketplaceid?'请选择':'请先选择国家'" clearable :show-all-levels="false" >
          <template #default="{ data }">
            <el-tooltip class="item" effect="dark" :content="data.productCategoryNameEn" placement="right">
              <span>{{ data.productCategoryNameCn }}</span>
            </el-tooltip>
            <span style="color:red;" v-if="data.isChild && data.ossUrl">(已维护)</span>
          </template>
        </el-cascader> -->
        <el-cascader v-model="listQuery.parentId" :placeholder="categoryList.length>0?'请选择':'当前无数据'" :options="categoryList" style="width:400px" :props="{label:'productCategoryNameCn', value:'id',children: 'children' }" clearable filterable ref="myCascader" :before-filter="getCateValue" @change="parentIdChange">
          <template #default="{ data }">
            <el-tooltip class="item" effect="dark" :content="data.productCategoryNameEn" placement="top">
              <span>{{ data.productCategoryNameCn }}</span>
            </el-tooltip>
            <span style="color:red;" v-if="data.isChild && data.ossUrl">(已维护)</span>
            <span style="color:red;" v-if="data.isChild && !data.ossUrl">(未维护)</span>
          </template>
        </el-cascader>
        <div style="color:red;">{{label}}</div>
      </el-form-item>
      <el-form-item label="导入模板：" prop="fileData">
        <el-upload ref="upload" action :on-change="handleChange" :on-remove="handleRemove" :auto-upload="false" :limit="1" :on-exceed="limitExceed">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="handleOk" type="primary" size="mini" :loading="commitLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCategoryList, addCategory, uploadCategoryAttributes, getCategoryNodeTree } from "@/api/amazon/amazonClass"
const defaultRuleForm = {
  marketplaceid: '',
  parentId: [],
  fileData: '',
  categoryName: ""
}
export default {
  name: "AddCategroy",
  props: {
    visible: {
      tyle: Boolean,
      default: false
    },
    countryList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      commitLoading: false,
      listQuery: Object.assign({}, defaultRuleForm),
      cdnkey: 0,
      // categoryProps: {
      //   lazy: true,
      //   label: 'productCategoryNameCn',
      //   value: 'id',
      //   leaf: 'isChild',
      //   lazyLoad: async (node, resolve) => {
      //     const { marketplaceid: marketplaceId } = this.listQuery
      //     if (!marketplaceId) { resolve([]); return }
      //     const res = await getCategoryList({ marketplaceId, parentCategory: node.data && node.data.productCategoryId })
      //     resolve(res.data)
      //   }
      // },
      rules: {
        marketplaceid: { required: true, message: '此项必填', trigger: ['change', 'blur'] },
        parentId: { required: true, message: '此项必填', trigger: ['change', 'blur'] },
        fileData: { required: true, message: '请上传文件', trigger: ['change', 'blur'] },
      },
      categoryList: [],
      label: ""
    }
  },
  beforeDestroy() {
    this.close()
  },
  watch: {
    'listQuery.parentId'(newValue) {
      if (newValue.length == 0) {
        this.label = ""
      }
    }
  },
  methods: {
    async getCateValue(value) {
      this.listQuery.categoryName = value
      if (!this.listQuery.categoryName) return
      try {
        const res = await getCategoryNodeTree({ categoryName: this.listQuery.categoryName, marketplaceid: this.listQuery.marketplaceid })
        this.categoryList = this.getTreeData(res.data)
      } catch (error) {
        console.log(error)
      }
    },
    async getCascader() {
      this.listQuery.parentId = []
      this.categoryList = []
      this.label = ""
      this.$refs.myCascader.$refs.panel.clearCheckedNodes(); // 清空级联选择器选中状态
      this.$refs.myCascader.$refs.panel.activePath = [];
    },
    parentIdChange() {
      const code = this.listQuery.parentId.slice(-1)[0]
      this.filterCate(code, this.categoryList)
    },
    filterCate(code, arr) {
      for (const item of arr) {
        if (item.id === code) {
          if (item.isChild && item.ossUrl) {
            this.label = "已维护"
          } else if (item.isChild && !item.ossUrl) {
            this.label = "未维护"
          }
        }
        if (item.children && item.children.length) {
          const _item = this.filterCate(code, item.children)
          if (_item) return _item
        }
      }
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
    async handleOk() {
      const { $refs, listQuery, $message, close } = this;
      let validate;
      $refs.form.validate((valid) => { validate = valid })
      if (!validate) return
      this.commitLoading = true;
      const formData = new FormData();
      formData.append("id", listQuery.parentId.slice(-1)[0])
      formData.append("file", listQuery.fileData)
      try {
        const res = await uploadCategoryAttributes(formData)
        if (res.code === 200) {
          this.$emit("request")
          close()
          $message.success(res.data)
        }
      } catch (error) { }
      this.commitLoading = false;
    },
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (Xls[Xls.length - 1] !== "xls" && Xls[Xls.length - 1] !== "xlsx" && Xls[Xls.length - 1] !== "csv" && Xls[Xls.length - 1] !== "xlsm") {
        this.$message.warning("请选择正确格式文件");
        this.$refs.upload.clearFiles();
        return false;
      }
      this.listQuery.fileData = file;
      this.$refs.form.validateField('fileData')
    },
    handleRemove(file, fileList) {
      this.listQuery.fileData = '';
      this.$refs.form.validateField('fileData')
    },
    limitExceed() {
      this.$message({
        type: "warning",
        message: "一次只能上传一个文件"
      })
    },
    close() {
      const { $refs } = this
      setTimeout(() => {
        this.listQuery = Object.assign({}, defaultRuleForm)
        this.categoryList = []
        this.$refs.upload && $refs.upload.clearFiles();
        this.$nextTick(() => { $refs.form && $refs.form.clearValidate() })
      }, 100)
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
