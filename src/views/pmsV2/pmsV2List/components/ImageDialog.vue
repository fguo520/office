<template>
  <el-dialog title="批量上传图片" :visible.sync="visible" :before-close="close" width="1000px" :close-on-click-modal="false">
    <el-form ref="form" label-width="130px" size="mini" :model="listQuery" :rules="Rules">
      <el-form-item label="上传图片压缩包：">
        <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :on-remove="onRemove" :auto-upload="false" multiple :limit="1" :file-list="fileList">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片验证：" prop="checkImages">
        <el-checkbox-group v-model="listQuery.checkImages">
          <el-checkbox v-for="(item,index) in checkImagesList" :key="index" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div>
        提示：<br />
        只支持zip格式压缩包(限制100M)；<br />
        根据自定义SKU一个文件夹，每个商品文件夹直接放商品图片；<br />
        每个图片命名格式为：数字【123456789】的顺序命名，数字1将会作为首图；
      </div>
      <div>
        <div v-show="this.text.length>0" style="color:red">{{this.text}}</div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="handleOk" type="primary" size="mini" :loading="addLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { batchUpload } from "@/api/pmsV2/pmsV2List"
const defaultListQuery = {
  checkImages: [],
}
export default {
  name: "ImageDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      Rules: {
        checkImages: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      checkImagesList: [{ label: "任意尺寸", value: 0 }, { label: "800*800", value: 1 }, { label: "1000*1000", value: 2 }, { label: "1600*1600", value: 3 }, { label: "覆盖产品图片", value: 4 }, { label: "图片审核通过", value: 5 }],
      fileList: [],
      formData: {},
      text: "",
      addLoading: false,
      fileData: ""
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, defaultListQuery)
      this.text = ""
      this.fileList = []
    },
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (Xls[Xls.length - 1] !== "zip" || (e.size / 1024 / 1024 > 100)) {
        this.$message.warning("请选择zip格式文件，且文件大小不超过100MB");
        this.$refs.upload.clearFiles();
        return false;
      }
      if (e.size) this.fileData = file;
      if (this.fileData.length == 0) { this.addLoading = false }
    },
    onRemove() {
      this.fileData = ''
    },
    async handleOk() {
      if (!this.fileData) {
        this.$message.warning("请选上传文件");
        return false;
      }
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.addLoading = true;
          const formData = new FormData();
          formData.append("files", this.fileData);
          formData.append("checkImages", this.listQuery.checkImages);
          const res = await batchUpload(formData)
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: res.message
            })
            this.text = res.data
          }
        } catch (error) { }
        this.addLoading = false;
      })
    }
  }
}
</script>