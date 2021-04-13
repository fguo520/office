<template>
  <el-dialog title="上传末级类目属性" :visible.sync="visible" width="600px" :before-close="close" append-to-body>
    <el-form ref="form" label-width="120px" size="mini" :model="listQuery" :rules="rules">
      <el-form-item label="国家：" prop="marketplaceid">
        <el-select v-model="listQuery.marketplaceid" placeholder="请选择" filterable style="width:200px">
          <el-option v-for="item in countryList" :key="item.id" :label="item.parameterName" :value="item.parameterValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="导入模板：" prop="fileData">
        <el-upload ref="upload" action :on-change="handleChange" :on-remove="handleRemove" :auto-upload="false" :limit="1" :on-exceed="limitExceed">
          <el-tooltip content="只能上传zip，rar压缩包格式。" placement="top" effect="light">
            <i class="el-icon-question" style="color:green;margin-right:10px"></i>
          </el-tooltip>
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
import { uploadCategoryAttributesZip, } from "@/api/amazon/amazonClass"
const defaultRuleForm = {
  marketplaceid: '',
  fileData: '',
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
      rules: {
        marketplaceid: { required: true, message: '此项必填', trigger: ['change', 'blur'] },
        fileData: { required: true, message: '请上传文件', trigger: ['change', 'blur'] },
      },
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    async handleOk() {
      const { $refs, listQuery, $message, close } = this;
      let validate;
      $refs.form.validate((valid) => { validate = valid })
      if (!validate) return
      this.commitLoading = true;
      const marketplaceIdName = this.countryList.find(i => { return i.parameterValue == listQuery.marketplaceid }).parameterName
      const formData = new FormData();
      formData.append("marketplaceid", listQuery.marketplaceid)
      console.log(formData)
      formData.append("marketplaceIdName",marketplaceIdName)
      formData.append("file", listQuery.fileData)
      console.log(formData)
      try {
        const res = await uploadCategoryAttributesZip(formData)
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
      if (Xls[Xls.length - 1] !== "zip" && Xls[Xls.length - 1] !== "rar") {
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
        $refs.upload && $refs.upload.clearFiles();
        this.$nextTick(() => { $refs.form && $refs.form.clearValidate() })
      }, 100)
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
