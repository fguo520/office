<template>
  <el-dialog title="编辑产品信息" :visible.sync="visible" width="800px" :before-close="close" append-to-body center custom-class="selectionDialog">
    <el-tabs tab-position="left" style="height: 500px;" type="border-card">
      <el-tab-pane label="基本信息">
        <!-- <el-form ref="form" :model="listQuery" label-width="80px" inline :rules="rules" size="mini">
          
        </el-form> -->
      </el-tab-pane>
      <el-tab-pane label="产品价格">产品价格</el-tab-pane>
      <el-tab-pane label="产品图片">产品图片</el-tab-pane>
      <el-tab-pane label="产品编辑">产品编辑</el-tab-pane>
      <el-tab-pane label="报关信息">报关信息</el-tab-pane>
      <el-tab-pane label="产品参数">产品参数</el-tab-pane>
    </el-tabs>

    <span slot="footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addExcelTask } from "@/api/selection/productLibrary"
export default {
  name: "EditorDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      radio: "",
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    async commit() {
      const { $message, close } = this
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .selectionDialog .el-dialog__body {
  padding: 0;
  overflow: hidden;
}
</style>
