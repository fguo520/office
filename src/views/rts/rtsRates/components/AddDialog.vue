<template>
  <el-dialog :title="addList.title" :visible.sync="visible" width="400px" :before-close="close">
    <el-form ref="form" label-width="100px" size="mini" :model="addList.addData" :rules="addRules">
      <el-form-item label="起订量：" prop="productNum">
        <div>
          <b>≥</b>
          <NumberInput v-model="addList.addData.productNum" min="0" float style="width:100px"></NumberInput>
        </div>
      </el-form-item>
      <el-form-item label="产品单价：" prop="unitPriceDivide">
        <div>
          <b>≥</b>
          <NumberInput v-model="addList.addData.unitPriceDivide" min="0" float style="width:100px"></NumberInput>
          <b>RMB</b>
        </div>
      </el-form-item>
      <el-form-item label="费率：" prop="unitPriceDivide">
        <div>
          <span>&nbsp;&nbsp;</span>
          <NumberInput v-model="addList.addData.priceMultiple" min="0" float style="width:100px"></NumberInput>
        </div>
      </el-form-item>
      <el-form-item label="附加费：" prop="unitPriceDivide">
        <div>
          <span>&nbsp;&nbsp;</span>
          <NumberInput v-model="addList.addData.addPrice" min="0" float style="width:100px"></NumberInput>
          <b>USD</b>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { save } from "@/api/rts/rtsRates"
import {
  NumberInput,
} from "@/components";
const defaultListQuery = {
  addPrice: null,
  priceMultiple: null,
  productNum: null,
  unitPriceDivide: null,
}
export default {
  name: "AddDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    addList: {
      type: Object,
      default: () => ({
        title: "",
        addData: {}
      })
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addRules: {
        productNum: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        unitPriceDivide: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        addPrice: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        priceMultiple: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      }
    }
  },
  components: { NumberInput },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, defaultListQuery)
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
    },
    async commit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const res = await save(this.addList.addData);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.message
          })
          this.close();
          this.$emit("request")
        }
      })
    }
  }
}
</script>