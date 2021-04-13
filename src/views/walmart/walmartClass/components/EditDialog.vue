<template>
  <el-dialog title="编辑" :visible.sync="visible" width="400px" :before-close="close" @open="open">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">

      <el-form-item label="类目名称: " prop="category">
        <el-input v-model="ruleForm.category" size="mini" style="width:200px" :disabled="true" />
      </el-form-item>

      <el-form-item label="类目佣金: " prop="categoryCommissionRate">
        <NumberInput v-model="ruleForm.categoryCommissionRate" min="0" max="100" float style="width:200px">
          <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
        </NumberInput>
      </el-form-item>

      <el-form-item label="状态: " prop="status">
        <el-select v-model="ruleForm.status" placeholder="全部" size="mini" style="width:200px">
          <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <div style="text-align:right">
        <el-button @click="close" size="mini">取消</el-button>
        <el-button type="primary" @click="submitForm" size="mini">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { updateItemsTaxonomy } from "@/api/walmart/walmartClass";
import { NumberInput } from "@/components"
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    },
    statusList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      ruleForm: {
        category: "",
        categoryCommissionRate: "",
        status: null
      },
      rules: {
        categoryCommissionRate: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        status: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
    }
  },
  beforeDestroy() {
    this.close();
  },
  components: {
    NumberInput
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        const res = await updateItemsTaxonomy({ ...this.ruleForm })
        if (res.code == 200) {
          this.close()
          this.$message.success(res.message)
          this.$emit("request")
        }
      })
    },
    open() {
      const { category, categoryCommissionRate, status } = this.row
      this.ruleForm = { category, categoryCommissionRate, status }
    },
    close() {
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
