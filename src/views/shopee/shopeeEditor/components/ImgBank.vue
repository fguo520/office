<template>
  <el-dialog :visible.sync="visible" width="870px" :before-close="close" title="图片银行">
    <div class="item_div">
      <div v-for="(item,index) in list" :key="index" class="item_box">
        <input type="checkbox" v-if="item.isAll" :checked="item.isAll">
        <img :src="item.url" @click="handImg(item,index)" />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button type="primary" size="mini" @click="commit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "ImgBank",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    imgs: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      imgList: []
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    handImg(item, index) {
      this.list[index].isAll = !this.list[index].isAll;
      this.imgList = this.list.filter(item => { return item.isAll == true })
    },
    async commit() {
      if (this.imgList.length + this.imgs.length > 9) {
        this.$message.warning("最多支持9张图片")
        return false
      }
      const arr = this.imgs.concat(this.imgList)
      this.$emit("commit", arr)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px;

  .el-tabs__content {
    padding: 0;
  }
}

.item_div {
  display: flex;
  justify-content: right;
  flex-wrap: wrap;
  height: 500px;
  overflow-y: auto;
  .item_box {
    width: 120px;
    height: 120px;
    padding: 10px 0;
    vertical-align: middle;
    position: relative;
    input {
      top: 19px;
      left: -3px;
      position: absolute;
    }
    img {
      width: 120px;
      height: 120px;
      padding: 10px;
    }
  }
}
</style>