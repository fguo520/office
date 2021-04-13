<template>
  <el-dialog title="导出成本价" :visible.sync="visible" :before-close="close" width="385px">
    <el-radio-group v-model="radioExport">
      <p>
        <el-radio :label="1">当前条件自定义导出</el-radio>
      </p>
      <p style="margin-top:20px">
        <el-radio :label="2">自定义选中数据导出</el-radio>
      </p>
    </el-radio-group>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button type="primary" @click="handExport" size="mini">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addShopeePriceExcelExport } from "@/api/shopee/shopeeListing";
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
      radioExport: 1,
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
      let itemId = this.selectRows.map(i => i.itemId)
      let type = this.radioExport
      if (this.radioExport == 2) {
        if (this.selectRows.length < 1) {
          this.$message.warning("请选中商品")
        } else {
          addShopeePriceExcelExport({ paramValue: itemId, type: type, paramType: 2 }).then(res => {
            this.$message.success(res.message)
            this.close()
            this.$emit("request")
          })
        }
      } else {
        let storeName = []
        if (this.listQuery.storeName === '') {
          storeName = []
        } else {
          storeName = [this.listQuery.storeName]
        }
        addShopeePriceExcelExport({ ...this.listQuery,storeName, type }).then(res => {
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