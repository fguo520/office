<template>
  <el-dialog title="提示" :visible.sync="visible" width="1000" :before-close="close">
    <div slot="title" class="titleContainer">
      <span class="title">批量编辑{{ mode === 2 ? '价格': '库存' }}</span>
      <span class="contant">
        统一修改：
        <el-select v-model="operation" placeholder="" size="mini" style="width:60px;" clearable @change="totalChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <NumberInput v-model="allValue" min="0" float="2" style="width:100px;" @input="totalChange" clearable />
      </span>
    </div>

    <el-table ref="tableContainer" style="width: 100%" :data="selectRows" border height="500" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="图片" align="center" width="130">
        <template #default="{ row }">
          <img slot="reference" :src="row.primaryImageUrl" width="100px" />
          <div :style="getColorStatus(row.productState)">{{row.productState}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SKU" align="center" width="200">
        <template #default="{ row }">
          <div style="text-align: left">
            <div>
              <i v-copy="row.sku" class="el-icon-document-copy"></i>
              <el-tooltip :content="`sku：${row.sku}`" placement="top">
                <el-link :underline="false" type="primary" >{{ row.sku }}</el-link>
              </el-tooltip>
            </div>
            <div>
              <i v-copy="row.sellerSku" class="el-icon-document-copy"></i>
              <el-tooltip :content="`sellerSku：${row.sellerSku}`" placement="top">
                <el-link :underline="false" type="primary" >{{ row.sellerSku }}</el-link>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="UPC" align="center" width="120">
        <template #default="{ row }">
          <div style="text-align: left">
            <div class="tooltipClass" v-copy="row.upc">{{row.upc}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品信息" align="center">
        <template #default="{ row }">
          <div style="text-align: left">
            <el-tooltip class="item" effect="dark" :content="`渠道：${row.storeNameAs}`" placement="top">
              <span v-copy="row.storeNameAs">{{row.storeNameAs}}</span>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" :content="`标题：${row.productName}`" placement="top">
              <div class="tooltipClass">
                <span v-copy="row.productName">{{row.productName}}</span>
              </div>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" :content="`产品中文名称：${row.productNameCn}`" placement="top">
              <div class="tooltipClass" v-copy="row.productNameCn">{{ row.productNameCn }}</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="可用库存" align="center" width="80">
        <template #default="{ row }">
          {{ row.availableInventory }}
        </template>
      </el-table-column>
      <el-table-column label="站点" align="center" width="80">
        <template #default="{ row }">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格($)" align="center" width="200" v-if="mode === 2">
        <template #default="{ row }">
          <div style="text-align: left">
            <div>调整前：{{ row.price }}</div>
            <div>调整后：
              <NumberInput v-model="row.skuModifyPrice" min="0" float="2" style="width:100px;" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" width="200" v-if="mode === 3">
        <template #default="{ row }">
          <div style="text-align: left">
            <div>调整前：{{ row.inventoryCount }}</div>
            <div>调整后：<NumberInput v-model="row.skuModifyInventory" min="0" style="width:100px;" /></div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button type="primary" size="mini" @click="commit" :loading="commitLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { operate } from "@/api/walmart/walmartListing";
import { NumberInput } from "@/components"
export default {
  name: "OperationDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRows: {
      type: Array,
      default: () => []
    },
    mode: null
  },
  data() {
    return {
      options: [
        { label: "+", value: "add" },
        { label: "-", value: "reduce" },
      ],
      operation: "",
      allValue: "",
      commitLoading: false
    }
  },
  components: {
    NumberInput
  },
  beforeDestroy() {
    this.close();
  },
  computed: {
    getColorStatus() {
      return function (type) {
        switch (type) {
          case "正常":
            return { backgroundColor: "#16c067", color: "#fff", textAlign: "center" };
          case "起批量":
            return { backgroundColor: "#00b0f5", color: "#fff", textAlign: "center" };
          case "暂时缺货":
            return { backgroundColor: "#d4c80a", color: "#fff", textAlign: "center" };
          case "停产":
            return { backgroundColor: "#e0514d", color: "#fff", textAlign: "center" };
          case "锁定":
            return { backgroundColor: "#a3a3a3", color: "#fff", textAlign: "center" };
          case "清库":
            return { backgroundColor: "#fb9320", color: "#fff", textAlign: "center" };
          default:
            return { backgroundColor: "#e0514d", color: "#fff", textAlign: "center" }
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.operation = this.allValue = ""
    },
    totalChange() {
      const { mode, operation } = this

      const valueToNum = Number(this.allValue) || 0;

      function resetMinZero(num) {
        return num < 0 ? 0 : num
      }

      this.selectRows.forEach(item => {
        if (mode === 2) {
          if (operation === "add") item.skuModifyPrice = resetMinZero((item.skuPrice + valueToNum).toFixed(2))
          if (operation === "reduce") item.skuModifyPrice = resetMinZero((item.skuPrice - valueToNum).toFixed(2))
          if (operation === "") item.skuModifyPrice = item.skuPrice
        }
        if (mode === 3) {
          if (operation === "add") item.skuModifyInventory = resetMinZero(item.skuInventory + valueToNum)
          if (operation === "reduce") item.skuModifyInventory = resetMinZero(item.skuInventory - valueToNum)
          if (operation === "") item.skuModifyInventory = item.skuInventory
        }
      })
    },
    async commit() {
      this.commitLoading = true
      const res = await operate(this.mode, this.selectRows);
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: res.message
        })
      }
      this.commitLoading = false
      this.close()
      this.$emit("request")
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0;
}
/deep/ .gutter {
  width: 0;
}
.titleContainer {
  text-align: center;
  .title {
    position: absolute;
    top: 20px;
    left: 20px;
    line-height: 28px;
  }
  .contant {
    line-height: 28px;
  }
}
</style>
