<template>
  <el-dialog title="拒绝原因" :visible.sync="visible" width="500px" :before-close="close" append-to-body :close-on-click-modal="false">
    <el-form ref="form" label-width="0" size="mini" :model="rows" :rules="rules">
      <el-form-item label="" prop="rejectReason">
        <el-input v-model="rows.rejectReason" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
      </el-form-item>
      <div style="text-align:right">
        <el-form-item label-width="0">
          <el-button @click="close" size="mini">取消</el-button>
          <el-button type="primary" @click="handOk('form')" size="mini" :loading="ifButton">确定</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { checkFeeApplyBill, batchCheckFeeApplyBill } from "@/api/finance/financeCost"
export default {
  name: "RefusePass",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Object,
      default: () => {
      }
    },
    mapList: {
      type: Array,
      default: () => []
    },
    step: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      rules: {
        rejectReason: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      ifButton: false
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.rows.rejectReason = ""
    },
    handOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ifButton = true
          if (this.mapList.length > 0) {
            console.log(this.mapList)
            batchCheckFeeApplyBill({ mapList: this.mapList, isCheck: this.rows.isCheck, rejectReason: this.rows.rejectReason, step: this.step }).then(res => {
              if (res.code == 200) {
                this.$message.success(res.data);
                this.close();
                this.$emit("request")
              }
            })
          } else {
            const mapList = [{ id: this.rows.id, version: this.rows.version }]
            checkFeeApplyBill({ mapList, isCheck: this.rows.isCheck, rejectReason: this.rows.rejectReason }).then(res => {
              if (res.code == 200) {
                this.$message.success(res.data);
                this.close();
                this.$emit("request")
              }
            })
          }
          this.ifButton = false
        }
      })
    }
  }
}
</script>