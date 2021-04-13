<template>
  <el-dialog title="导入" :visible.sync="visible" width="400px" :before-close="close" append-to-body>
    <el-form ref="form" label-width="100px" size="mini" :model="ruleForm" :rules="rules">
      <el-form-item label="国家：" prop="country">
        <el-select v-model="ruleForm.country" placeholder="全部" clearable filterable>
          <el-option v-for="item in countryList" :key="item.id" :label="item.parameterName" :value="item.parameterValue" />
        </el-select>
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
import { uploadCategory, checkCategory } from "@/api/amazon/amazonClass"
const defaultRuleForm = {
  country: '',
  fileData: "",
}
export default {
  name: "ImportCategroy",
  props: {
    visible: {
      type: Boolean,
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
      ruleForm: Object.assign({}, defaultRuleForm),
      rules: {
        country: { required: true, message: '此项必填', trigger: ['change', 'blur'] },
        fileData: { required: true, message: '请上传文件', trigger: ['change', 'blur'] },
      },
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (Xls[Xls.length - 1] !== "xls" && Xls[Xls.length - 1] !== "xlsx" && Xls[Xls.length - 1] !== "csv") {
        this.$message.warning("请选择正确格式文件");
        this.$refs.upload.clearFiles();
        return false;
      }
      this.ruleForm.fileData = file;
      this.$refs.form.validateField('fileData')
    },
    handleRemove(file, fileList) {
      this.ruleForm.fileData = '';
      this.$refs.form.validateField('fileData')
    },
    limitExceed() {
      this.$message({
        type: "warning",
        message: "一次只能上传一个文件"
      })
    },
    async handleOk() {
      let validate;
      this.$refs.form.validate((valid) => { validate = valid })
      if (!validate) return
      this.commitLoading = true;
      const formData = new FormData();
      formData.append("file", this.ruleForm.fileData);
      formData.append('marketplaceid', this.ruleForm.country)
      try {
        const detection = await checkCategory({ marketplaceId: this.ruleForm.country })
        if (detection.data) {
          const confirm = await this.$confirm('该国家已导入类目，是否继续导入?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          if (!confirm) return
        }
        const res = await uploadCategory(formData)
        this.close()
        this.$message.success(res.data);
      } catch (error) { }
      this.commitLoading = false;
    },
    close() {
      const { $refs } = this
      setTimeout(() => {
        this.ruleForm = Object.assign({}, defaultRuleForm)
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
