<template>
  <el-dialog title="编辑" :visible.sync="visible" width="400px" :before-close="close" append-to-body @open="open">
    <el-form ref="form" label-width="120px" size="mini" :model="ruleForm">
      <el-form-item label="类目中文名称：" prop="country">
        <el-input v-model="ruleForm.nameCn" style="width:193px;" clearable />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="handleOk" type="primary" size="mini" :loading="commitLoading">修 改</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editCategoryName } from "@/api/amazon/amazonClass"
const defaultRuleForm = {
  nameCn: '',
}
export default {
  name: "ImportCategroy",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      commitLoading: false,
      ruleForm: Object.assign({}, defaultRuleForm),
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    async handleOk() {
      const { row, ruleForm, $message, close } = this
      this.commitLoading = true;
      try {
        const res = await editCategoryName(row.id, ruleForm)
        this.row.productCategoryNameCn = ruleForm.nameCn
        close()
        $message.success(res.data);
      } catch (error) { }
      this.commitLoading = false;
    },
    close() {
      this.$emit("update:visible", false)
    },
    open() {
      this.ruleForm.nameCn = this.row.productCategoryNameCn
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
