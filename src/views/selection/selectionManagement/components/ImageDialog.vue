<template>
  <el-dialog :title="`产品中文名称：${row.prodNameCn || '暂无'}`" :visible.sync="visible" width="600px" :before-close="close" custom-class="imageDialog">
    <el-image class="imageClass" v-for="(src, index) in row.imgList" :key="index" :src="src" :preview-src-list="row.imgList" fit="cover">
      <div slot="placeholder">
        加载中...
      </div>
    </el-image>
  </el-dialog>
</template>

<script>
export default {
  name: "imageDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0;
}
.imageClass {
  width: 150px;
  height: 150px;
  padding: 5px;
}
/deep/ .imageDialog {
  .el-dialog__title {
    width: 95%;
    display: inline-block;
    font-size: 16px;
  }
}
</style>
