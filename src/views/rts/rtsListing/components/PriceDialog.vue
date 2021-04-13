<template>
  <el-dialog :visible.sync="visible" width="350px" :before-close="close" @open="open">
    <el-table ref="tableContainer" style="width: 100%" :data="list.bulk_discount_price" border max-height="300" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="最小起订量" align="center">
        <template #default="{ row }">
          {{ row.start_quantity }}
        </template>
      </el-table-column>
      <el-table-column label="产品价格" align="center" width="150">
        <template #default="{ row }">
          <NumberInput v-model="row.price" min="0" float="2" style="width:100px;" clearable />
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button type="primary" size="mini" @click="commit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { NumberInput } from "@/components"
import { updateDiscountPrice } from "@/api/rts/rtsListing"
export default {
  name: "PriceDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      list: {
        bulk_discount_price: []
      }
    }
  },
  components: {
    NumberInput
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    open() {
      this.list.bulk_discount_price = JSON.parse(JSON.stringify(this.rows.discountPrices.bulk_discount_price))
    },
    async commit() {
      const res = await updateDiscountPrice({ authId: this.rows.authId, modifyData: JSON.stringify(this.list.bulk_discount_price), originalData: JSON.stringify(this.rows.discountPrices.bulk_discount_price), productId: this.rows.productId, skuId: this.rows.skuId ,skuCode:this.rows.sku})
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: res.message
        })
      }
      this.close()
      this.$emit("request")
    }
  }
}
</script>