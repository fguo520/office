<template>
  <el-dialog title="导入" :visible.sync="visible" width="400px" append-to-body :before-close="close">
    <el-form ref="resourceForm" label-width="100px" size="mini">
      <el-form-item label="下载模板：">
        <el-button size="mini" class="btn-add" @click="downExcel()">下载模板</el-button>
      </el-form-item>
      <el-form-item label="导入模板：">
        <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :auto-upload="false" multiple :limit="1" :file-list="fileList">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getTemplateUrl, importTortRecord } from "@/api/common/sysTort";
export default {
  name: "ExcelDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      fileList: [],
      formData: {
        file: "", //文件
      },
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      if (this.$refs.upload) this.$refs.upload.clearFiles()
    },
    downExcel() {
      getTemplateUrl().then(res => {
        window.open(res.data)
      })
    },
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (
        Xls[Xls.length - 1] !== "xls" &&
        Xls[Xls.length - 1] !== "xlsx" &&
        Xls[Xls.length - 1] !== "csv"
      ) {
        this.$message.warning("请选择正确格式文件");
        if (this.$refs.upload) this.$refs.upload.clearFiles();
        return false;
      }
      this.formData.file = file;
    },
    async handleOk() {
      if (this.formData.file == "") {
        this.$message.warning("请选择csv文件");
        return false;
      } try {
        const formData = new FormData();
        formData.append("file", this.formData.file);
        const res = await importTortRecord(formData)
        if (res.code == 200) {
          this.$message.success(res.message);
          this.close();
          this.$emit("request")
        }
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>