<template>
  <el-dialog title="导出成本价" :visible.sync="visible" :before-close="close" width="385px">
    <el-radio-group v-model="radioExport">
      <p>
        <el-radio :label="2">当前条件自定义导出</el-radio>
      </p>
      <p style="margin-top:20px">
        <el-radio :label="1">自定义选中数据导出</el-radio>
      </p>
    </el-radio-group>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button type="primary" @click="handExport" size="mini">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { batchExport } from "@/api/pms/productInfo";
export default {
  name: "ExportDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRows: {
      type: Array,
      default: () => []
    },
    listQuery: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      radioExport: 2,
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    handExport() {
      let dataIds = this.selectRows.map(i => i.id)
      let type = this.radioExport
      if (this.radioExport == 1) {
        if (this.selectRows.length < 1) {
          this.$message.warning("请选中商品")
        } else {
          batchExport({ dataIds: dataIds, paramType:type }).then(res => {
            this.$message.success(res.message)
            this.close()
            this.$emit("request")
          })
        }
      } else {
        const productClass = this.listQuery.productClass.slice(-1)[0];
        batchExport({ ...this.listQuery, paramType:type,productClass }).then(res => {
          this.$message.success(res.message)
          this.close()
          this.$emit("request")
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>