<template>
  <el-dialog title="图片上传" :visible.sync="visible" :before-close="close" width="600px" :close-on-click-modal="false">
    <el-form ref="form" inline size="mini">
      <el-form-item label="图片类型：" prop="imageType">
        <el-radio-group v-model="imageType">
          <el-radio label="2">白底封面图</el-radio>
          <el-radio label="3">非白底封面图</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-upload ref="upload" action="" :auto-upload="false" accept=".jpg,.png" multiple :on-change="uploadPriceChange" :file-list="uploadList" :on-remove="onRemove" list-type="picture">
      <!-- :show-file-list="false" -->
      <el-button size="small" type="primary">选择图片</el-button>
    </el-upload>

    <div class="item_foot">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button @click="handleOk()" type="primary" size="mini" :loading="commitLoading">点击上传</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upload } from "@/api/pmsV2/pmsV2Editor"
export default {
  name: 'UpLoadImageDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    home: null,
    limit: Number
  },
  data() {
    return {
      imageType: '',
      uploadList: [],
      commitLoading: false
    };
  },
  created() {
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      setTimeout(() => {
        this.imageType = ''
        this.uploadList = []
      })
      this.$emit("update:visible", false)
    },
    async handleOk() {
      try {
        const { uploadList, imageType, $message, close, $route: { query }, home: { listQuery: { clientSku, baseInfoPic } }, limit } = this
        if (imageType == '') {
          $message.warning("请选择图片类型！")
          return
        }
        if (uploadList.length === 0) {
          $message.warning("请添加上传图片！")
          return
        }
        if (baseInfoPic.length + uploadList.length > limit) {
          $message.warning(`上传图片总数不能超过${limit}张，还可上传${limit - baseInfoPic.length}张`)
          return
        }
        this.commitLoading = true
        const formData = new FormData();
        uploadList.forEach(item => {
          formData.append('files', item.raw)
        })
        formData.append('imageType', imageType)
        formData.append('clientSku', clientSku)
        const res = await upload(formData)
        $message.success('上传成功！')
        this.$emit("callback", res.data.map(item => ({
          imageUrl: item.imageOssMax,
          imageType: imageType,
          imageSize: item.imageSize,
          id: Math.round(Math.random() * 10000)
        })))
        close()
      } catch (error) { }
      this.commitLoading = false
    },
    async uploadPriceChange(file, fileList) {
      this.$refs.upload.handleRemove(file)
      const { $message } = this
      const regExcel = /(\.jpg)|(\.png)/
      if (!regExcel.test(file.raw.name) && (file.size / 1024 / 1024 <= 2)) {
        $message.warning("允许上传png/jpg图片格式,且图片不大于2MB")
        return
      }
      // const img = new Image();
      // img.src = file.url;
      // img.onload = () => {
      //   //只允许图片尺寸为 800*800 1000*1000 1600*1600
      //   function checkSize(size) {
      //     switch (size) {
      //       case 800:
      //         return true
      //       case 1000:
      //         return true
      //       case 1600:
      //         return true
      //       default:
      //         return false
      //     }
      //   }
      //   if (!checkSize(img.height) || !checkSize(img.width)) {
      //     $message.warning("图片允许上传尺寸为800*800、1000*100、1600*1600")
      //     return
      //   }

      // }
      this.uploadList.push(file)
    },
    onRemove(file, fileList) {
      this.uploadList = this.uploadList.filter(item => item.uid !== file.uid)
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 0px;
}
/deep/ .el-upload-list {
  max-height: 300px;
  overflow-y: scroll;
}
.item_foot {
  margin-top: 15px;
  text-align: right;
}
</style>
