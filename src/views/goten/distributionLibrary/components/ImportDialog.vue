<template>
  <el-dialog title="导出产品信息" :visible.sync="visible" width="250px" :before-close="close">
    <el-radio v-model="radio" :label='1'>自定义选中数据导出</el-radio>
    <el-radio v-model="radio" :label='0'>当前条件自定义导出</el-radio>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { exportProductInfo } from "@/api/goten/distributionLibrary"
export default {
  name: "ImportDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    query: {
      type: Object,
      default: () => ({})
    }
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
      this.radio = ""
    },
    async commit() {
      const { $message, close, radio } = this
      if (radio === "") {
        $message.warning("请先选择导出类型！")
        return
      }
      if (radio === 1 && this.query.selectSkus === "") {
        $message.warning("请在列表中勾选需要导入数据的产品")
        return
      }
      const query = radio ? { ...this.query, sku: this.query.selectSkus } : this.query
      const res = await exportProductInfo(query)
      if (res.code === 200) {
        $message.success("导出成功")
        close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio:first-of-type {
  margin-bottom: 10px;
}
</style>
