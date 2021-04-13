<template>
  <el-dialog title="查看图片" :visible.sync="visible" :before-close="close" width="900px" :close-on-click-modal="false">
    <div>
      <div>
        <el-button size="mini" type="primary" @click="handSet">批量下载</el-button>
      </div>
      <transition-group name="imageContainer" tag="div" class="imageContainer" ref="imageContainer">
        <div class="imageBox" v-for="item in list" :key="item.id">
          <el-image :src="item.imageOssMax" :preview-src-list="list.map(item=>item.imageOssMax)" ref="image" />
        </div>
      </transition-group>
    </div>
  </el-dialog>
</template>
<script>
import { batchDownload } from "@/api/pmsV2/pmsV2List"
export default {
  name: "LookimgDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    productId: {
      type: Number,
      default: null
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.$emit('update:list', [])
    },
    async handSet() {
      batchDownload(this.productId)
    }
  }
}
</script>
<style scoped lang='scss'>
/deep/ .el-dialog__body {
  padding-top: 0px;
}
$imageContainerSize: 852px;
.topBar {
  width: $imageContainerSize;
  height: 50px;
  background-color: rgb(242, 242, 242);
  margin-top: 10px;
  padding: 1px 1px 0;
  display: flex;
}
.topBarItem {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}
.imageContainer {
  border: 1px solid rgb(242, 242, 242);
  margin-bottom: 10px;
  height: 385px;
  width: $imageContainerSize;
  overflow: scroll;
  margin-top: 15px;
}
.imageBox {
  position: relative;
  display: inline-block;
  margin: 10px;

  /deep/ .el-image__inner {
    transition: all 0.3s ease-in-out;
    width: 100px;
    height: 100px;
  }

  .deleteBtn {
    width: 15px;
    height: 15px;
    background-color: rgb(192, 5, 5);
    border-radius: 50%;
    color: white;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    opacity: 0.8;
    position: absolute;
    cursor: pointer;
    right: -5px;
    top: -5px;
    z-index: 1999;
    user-select: none;

    &:hover {
      background-color: red;
    }
  }

  &:hover {
    /deep/ .el-image__inner {
      transform: scale(1.1);
    }
  }
}
.imageContainer-enter-active,
.imageContainer-leave-active {
  transition: all 1s;
}
.imageContainer-enter {
  opacity: 0;
  transform: translateY(-30px);
}
.imageContainer-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>