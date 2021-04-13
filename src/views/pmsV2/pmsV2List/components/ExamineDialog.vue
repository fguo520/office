<template>
  <el-dialog title="检测图片" :visible.sync="visible" :before-close="close" width="1000px">
    <el-upload ref="upload" class="upload" action="" :auto-upload="false" accept=".jpg,.png" multiple :on-change="uploadPriceChange" :file-list="uploadList" :on-remove="onRemove" list-type="picture">
      <!-- :show-file-list="false" -->
      <el-button size="small" type="primary">选择图片</el-button>
    </el-upload>
    <div class="item_foot">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button @click="handleOk()" type="primary" size="mini" :loading="commitLoading">图片检测</el-button>
    </div>
    <el-table ref="tableContainer" style="width: 100%" :data="list" element-loading-text="数据加载中" border max-height="500px" :header-cell-style="{ 'background-color': '#dadde3' }" v-if="list.length>0">
      <el-table-column label="sku" align="center" width="80">
        <template #default="{ row }">
          <el-link type="success" @click.native="getSkuInfo(row.sku)">{{ row.sku }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="产品中文名称" align="center" prop="productNameCn" />
      <el-table-column label="赛盒图片" align="center" width="200">
        <template #default="{ row: { ossImageUrl, referImageUrl } }">
          <el-image :src="ossImageUrl" :preview-src-list="[ossImageUrl, handImg(referImageUrl)]">
            <div slot="placeholder">加载中...</div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="选品图片" align="center" width="200">
        <template #default="{ row: { referImageUrl, ossImageUrl } }">
          <el-image :src="handImg(referImageUrl)" :preview-src-list="[handImg(referImageUrl), ossImageUrl]">
            <div slot="placeholder">加载中...</div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="相似度" align="center" prop="sortValue" width="170" />
    </el-table>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" append-to-body />
  </el-dialog>
</template>
<script>
import { SkuInfoView } from "@/components"
import { imageSearch } from "@/api/selection/selectionManagement"
export default {
  name: "ExamineDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadList: [],
      commitLoading: false,
      list: [],
      SkuNum: "",
      SkuDialogVisible: false,
    }
  },
  components: { SkuInfoView },
  computed: {
    handImg() {
      return (type) => {
        return this.uploadList.find(i => { return i.name == type }).url
      }
    }
  },
  beforeDestroy() {
    this.close();
  },
  watch: {
    uploadList(newValue) {
      if (newValue.length > 3) {
        this.$message.warning("最多上传3张图片！")
        newValue.pop()
      }
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.uploadList = []
      this.list = []
    },
    async uploadPriceChange(file, fileList) {
      this.$refs.upload.handleRemove(file)
      const { $message } = this
      const regExcel = /(\.jpg)|(\.png)/
      if (!regExcel.test(file.raw.name) && (file.size / 1024 / 1024 <= 2)) {
        $message.warning("允许上传png/jpg图片格式,且图片大小于2MB")
        return
      }
      const img = new Image();
      img.src = file.url;
      this.uploadList.push(file)
    },
    onRemove(file, fileList) {
      this.uploadList = this.uploadList.filter(item => item.uid !== file.uid)
    },
    async handleOk() {
      try {
        const { uploadList, $message } = this
        if (uploadList.length === 0) {
          $message.warning("请添加上传图片！")
          return
        }
        if (uploadList.length > 3) {
          $message.warning("最多上传3张图片！")
          return
        }
        this.commitLoading = true
        const formData = new FormData();
        uploadList.forEach(item => {
          formData.append('files', item.raw)
        })
        const res = await imageSearch(formData)
        this.list = res.data.resultVO
        $message.success(res.message)
      } catch (error) { }
      this.commitLoading = false
    },
    getSkuInfo(id) {
      this.SkuDialogVisible = true;
      this.SkuNum = id;
    },
  }
}
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
/deep/ .upload ul {
  display: flex;
  li {
    width: 300px;
  }
}
</style>
