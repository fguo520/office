<template>
  <el-dialog :title="`产品中文名称：${row.cnName || '暂无'}`" :visible.sync="visible" width="600px" :before-close="close" custom-class="imageDialog">
    <vueScroll>
      <el-image class="imageClass" v-for="(item, index) in row.imgList" :key="index" :src="item.imageUrl" :preview-src-list="row.imgList.map(imgItem => imgItem.imageUrl)" fit="cover">
        <div slot="placeholder">加载中...</div>
        <div slot="error" class="image-slot">此商品无图片</div>
      </el-image>
    </vueScroll>
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
  computed: {
    getContainer() {
      const scroll = this.$refs.scroll || { $refs: { scrollPanel: { $el: null } } }
      return scroll.$refs.scrollPanel.$el
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
  height: 500px;
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
