<template>
  <el-dialog title="导入" :visible.sync="visible" width="400px" :before-close="close" @close="$refs.upload.clearFiles()" v-bind="$attrs" >
    <el-form ref="form" label-width="150px" size="mini">
      <el-form-item label="下载模板：">
        <el-button size="mini" @click="downExcel()" v-if="!this.$slots.default">下载模板</el-button>
        <slot />
      </el-form-item>

      <el-form-item label="导入模板：">
        <el-upload ref="upload" action :on-change="handleChange" :auto-upload="false" :limit="1" :on-exceed="limitExceed">
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
export default {
  name: "ImportDialog",
  props: {
    visible: {
      tyle: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({
        uploadApi: "",
        downloadPath: "",
        params: {}
      })
    },
  },
  data() {
    return {
      fileData: "",
      commitLoading: false,
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
      this.fileData = file;
    },
    limitExceed() {
      this.$message({
        type: "warning",
        message: "一次只能上传一个文件"
      })
    },
    downExcel() {
      window.open(this.options.downloadPath, '_self')
    },
    async handleOk() {
      if (this.fileData === "") {
        this.$message.warning("请选择csv文件");
        return false;
      }
      this.commitLoading = true;
      const formData = new FormData();
      formData.append("file", this.fileData);
      if (this.options.params) {
        const paramsObj = this.options.params
        for (let key in paramsObj) { formData.append(key, paramsObj[key]) }
      }
      try {
        const res = await this.options.uploadApi(formData)
        this.close()
        this.$message.success(res.data);
        this.$emit("request")
      } catch (error) { }
      this.commitLoading = false;
    },
    close() {
      const { $refs } = this;
      $refs.upload && $refs.upload.clearFiles()
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
