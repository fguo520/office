<template>
  <el-dialog title="编辑" :visible.sync="visible" width="700px" :before-close="close" @open="open">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="物流名称: " prop="category">
        <el-input v-model="ruleForm.logisticName" size="mini" style="width:200px" :disabled="true" />
      </el-form-item>
      <el-form-item label="出货天数: " prop="shippingDays">
        <NumberInput v-model="ruleForm.shippingDays" min="0" style="width:200px" />
      </el-form-item>
      <el-form-item label="状态: " prop="enabled">
        <el-select v-model="ruleForm.enabled" placeholder="全部" size="mini" style="width:200px">
          <el-option v-for="(item, index) in enabledList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="最小限重: ">
        <el-input v-model="ruleForm.itemMinWeight" size="mini" style="width:200px" :disabled="true" />
      </el-form-item>
      <el-form-item label="最大限重: ">
        <el-input v-model="ruleForm.itemMaxWeight" size="mini" style="width:200px" :disabled="true" />
      </el-form-item>
      <el-form-item label="最大限制长: ">
        <el-input v-model="ruleForm.itemMaxDimensionLength" size="mini" style="width:200px" :disabled="true" />
      </el-form-item>
      <el-form-item label="最大限制宽: ">
        <el-input v-model="ruleForm.itemMaxDimensionWidth" size="mini" style="width:200px" :disabled="true" />
      </el-form-item>
      <el-form-item label="最大限制高: ">
        <el-input v-model="ruleForm.itemMaxDimensionHeight" size="mini" style="width:200px" :disabled="true" />
      </el-form-item>
      <div style="text-align:right">
      <div label-width="0">
        <el-button @click="close" size="mini">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
      </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { getupdate } from "@/api/shopee/shopeeLogistics";
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
    enabledList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      ruleForm: {
        logisticName: "",
        shippingDays: "",
        enabled: null,
        itemMinWeight: "",
        itemMaxWeight: "",
        itemMaxDimensionLength: "",
        itemMaxDimensionWidth: "",
        itemMaxDimensionHeight: "",
      },
      rules: {
        shippingDays: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        enabled: [{ required: true, message: "此项不能为空", trigger: "change" }],
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
        const res = await getupdate({ ...this.ruleForm })
        if (res.code == 200) {
          this.close()
          this.$message.success(res.message)
          this.$emit("request")
        }
      })
    },
    open() {
      this.ruleForm = { ...this.row }
    },
    close() {
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  overflow: hidden;
  .el-form-item {
    width: 320px;
    float: left;
  }
}
</style>
