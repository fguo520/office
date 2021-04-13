<template>
  <vueScroll>
    <el-form ref="form" :model="listQuery" label-width="100px" inline size="mini" :disabled="this.check">
      <el-form-item label="">
        <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :on-exceed="maxChange" :auto-upload="false" :show-file-list="false" multiple :limit="10" :on-remove="onRemove" :file-list="listQuery.fileUploads">
          <el-button size="mini" type="primary" :loading="isLoading">上传文件</el-button>
          <el-tooltip placement="top" effect="light">
            <div slot="content">最多可上传10个文件。仅支持使用以下格式的文件上传<br />1. 图片格式：jpg、jpeg、png<br />2. 文件格式：txt、xls、xlsx、doc、docx、csv、pdf<br />3. 压缩包格式：rar、zip</div>
            <i class="el-icon-question" style="color:green"></i>
          </el-tooltip>
        </el-upload>
      </el-form-item>
      <el-table style="width:100%" v-if="listQuery.fileUploads.length>0" :data="listQuery.fileUploads" border max-height="480px" :header-cell-style="{ 'background-color': 'rgb(218, 221, 227)' }">
        <el-table-column width="360" align="center">
          <template #header>
            <div style="color:black"><span>文件名称</span></div>
          </template>
          <template #default="{ row }">
            <div style="text-align:left">{{row.fileName}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="260">
          <template #header>
            <div style="color:#D9001B"><span>文件说明</span></div>
          </template>
          <template #default="{ row }">
            <div>
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="row.fileRemarks" maxlength="5000" show-word-limit />
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center">
          <template #header>
            <div style="color:black"><span>操作人 / 操作时间</span></div>
          </template>
          <template #default="{ row }">
            <div>{{row.createPerson}} {{row.createTime}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="125">
          <template #header>
            <div style="color:black"><span>操作</span></div>
          </template>
          <template slot-scope="scope">
            <span style="color:#41AF7C;font-size:12px;cursor: pointer;;margin-right:10px" @click="down(scope.row)" v-if="rolePermissionJudge('/supplierData/file')">下载</span>
            <el-button size="mini" type="text" @click="remove(scope.$index)" v-if="rolePermissionJudge('/supplierData/filedelect')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div style="text-align:center; position: absolute; bottom:0px; width: 100%;">
      <el-button @click="home.close">取消</el-button>
      <el-button @click="home.submit" type="primary" :loading="home.submitLoading" v-if="!this.check">保存</el-button>
    </div>
  </vueScroll>
</template>
<script>
import { uploadImage } from "@/api/supplier/supplierData"
export default {
  name: 'File',
  props: {
    home: null,
    check: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listQuery: {},
      typeList: {},
      isLoading: false
    }
  },
  created() {
    this.listQuery = this.home.listQuery
    this.typeList = this.home.list
  },
  methods: {
    maxChange(files, fileList) {
      console.log(files, fileList)
      if (files.length > 10) {
        this.$message.warning("最多上传10个文件");
      }
      if (fileList.length == 10) {
        this.$message.warning("最多上传10个文件");
      }
    },
    async handleChange(e, fileList) {
      const isLt20M = e.size / 1024 / 1024 < 10;
      if (!isLt20M) {
        this.$message.warning('上传的附件大小不能超过10M!');
        return false;
      }
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (Xls[Xls.length - 1] !== "jpg" && Xls[Xls.length - 1] !== "jpeg" && Xls[Xls.length - 1] !== "png" && Xls[Xls.length - 1] !== "txt" && Xls[Xls.length - 1] !== "xls" && Xls[Xls.length - 1] !== "xlsx" && Xls[Xls.length - 1] !== "doc" && Xls[Xls.length - 1] !== "docx" && Xls[Xls.length - 1] !== "csv" && Xls[Xls.length - 1] !== "rar" && Xls[Xls.length - 1] !== "zip") {
        this.$message.warning("请选择正确格式文件");
        if (this.$refs.upload) { this.$refs.upload.clearFiles(); }
        return false;
      }
      const arr = []
      arr.push(file)
      if (arr.length > 10) {
        this.$message.warning("最多上传10个文件");
        return
      }
      this.isLoading = true
      for (let i in arr) {
        const formData = new FormData();
        formData.append("file", arr[i]);
        const res = await uploadImage(formData)
        this.listQuery.fileUploads.push(res.data)
      }
      this.isLoading = false
    },
    onRemove(file, fileList) {
      this.listQuery.fileUploads = this.listQuery.fileUploads.filter(item => item.uid !== file.uid)
    },
    down(row) { window.open(row.fileUrl, '_blank') },
    remove(index) {
      this.listQuery.fileUploads.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .upload-demo {
  .el-upload-list {
    display: none !important;
  }
}
</style>