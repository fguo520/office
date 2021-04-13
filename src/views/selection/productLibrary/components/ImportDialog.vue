<template>
  <el-dialog title="导出产品信息" :visible.sync="visible" width="250px" :before-close="close">
    <el-radio v-model="radio" :label='1'>自定义选中数据导出</el-radio>
    <el-radio v-model="radio" :label='2'>当前条件自定义导出</el-radio>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addExcelTask } from "@/api/selection/productLibrary"
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
      const { $message, close } = this
      if (this.radio === "") {
        $message.warning("请先选择导出类型！")
        return
      }
      if (this.radio === 1 && this.query.dataIds === "") {
        $message.warning("请在列表中勾选需要导入数据的产品")
        return
      }
      const res = await addExcelTask({ ...this.query, exportType: this.radio })
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
