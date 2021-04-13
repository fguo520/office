<template>
  <el-dialog title="检测结果详情" :visible.sync="visible" :width="getWidth" :before-close="close" :custom-class="getClassName" v-bind="$attrs">

    <div v-if="result.checkType === 1">
      检测到侵权词：{{ result.resultVO[0].infringingContent }}
    </div>

    <el-table ref="tableContainer" style="width: 100%" :data="result.resultVO" element-loading-text="数据加载中" border max-height="500px" :header-cell-style="{ 'background-color': '#dadde3' }" v-if="result.checkType === 2">
      <el-table-column label="sku" align="center" width="80" prop="sku">
        <template #default="{ row }">
          <el-link type="success" @click.native="getSkuInfo(row.sku)">{{ row.sku }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="产品中文名称" align="center" prop="productNameCn" />
      <el-table-column label="赛盒图片" align="center" width="200">
        <template #default="{ row: { ossImageUrl, referImageUrl } }">
          <el-image :src="ossImageUrl" :preview-src-list="[ossImageUrl, referImageUrl]">
            <div slot="placeholder">加载中...</div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="选品图片" align="center" width="200">
        <template #default="{ row: { referImageUrl, ossImageUrl } }">
          <el-image :src="referImageUrl" :preview-src-list="[referImageUrl, ossImageUrl]">
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
export default {
  name: "checkResultDialog",
  components: {
    SkuInfoView
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    result: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      SkuNum: "",
      SkuDialogVisible: false,
    }
  },
  beforeDestroy() {
    this.close()
  },
  computed: {
    getWidth() {
      return this.result.checkType === 1 ? "400px" : "800px"
    },
    getClassName() {
      return this.result.checkType === 1 ? "" : "resultDailog"
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    getSkuInfo(id) {
      this.SkuDialogVisible = true;
      this.SkuNum = id;
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .resultDailog {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
