<template>
  <el-dialog title="提示" :visible.sync="visible" width="1131px" :before-close="close">
    <div slot="title" class="titleContainer">
      <span class="title">批量编辑{{ mode === 1 ? '价格': '库存' }}</span>
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
        <template slot-scope="scope">
          <img slot="reference" :src="scope.row.mainImage" style="width: 100px" />
          <div :style="getProductstate(scope.row.productState)">
            {{ scope.row.productState }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="sku" align="center" width="150">
        <template slot-scope="scope">
          <div style="text-align: left">
            <div>
              <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
              <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
                {{ scope.row.sku }}
              </el-link>
            </div>
            <el-tooltip class="item" effect="dark" :content="'渠道sku:'+scope.row.sellerSku" placement="right-start">
              <div class="tooltipClass">
                <span v-copy="scope.row.sellerSku">{{
                    scope.row.sellerSku
                  }}</span>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ASIN" align="center" width="150">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" :href="scope.row.onlineUrl">{{scope.row.asin1}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="产品信息" align="center" width="400">
        <template slot-scope="scope">
          <div style="text-align: left">
            <el-tooltip class="item" effect="dark" :content="'渠道别名:'" placement="left">
              <div>{{scope.row.storeNameAs}}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'赛盒别名:'" placement="left">
              <div>{{scope.row.shAccount}}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'英文名称:'+scope.row.itemName" placement="top">
              <div class="tooltipClass" v-copy="scope.row.itemName">{{scope.row.itemName}}
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="站点" align="center" width="100">
        <template slot-scope="scope">
          <div>{{scope.row.site}}</div>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" width="200" v-if="mode === 1">
        <template #default="{ row }">
          <div style="text-align: left">
            <div>调整前：{{ row.priceFrom }}</div>
            <div>调整后：
              <NumberInput v-model="row.priceTo" min="0" float="2" style="width:100px;" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" width="200" v-if="mode === 2">
        <template #default="{ row }">
          <div style="text-align: left">
            <div>调整前：{{ row.quantityFrom }}</div>
            <div>调整后：
              <NumberInput v-model="row.quantityTo" min="0" style="width:100px;" />
            </div>
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
import { batchEditListingPrice, batchEditListingStock } from "@/api/amazon/amazonListing";
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
    getProductstate() {
      return function (type) {
        switch (type) {
          case "正常":
            return { backgroundColor: "#16c067", color: "#fff" };
          case "起批量":
            return { backgroundColor: "#00b0f5", color: "#fff" };
          case "暂时缺货":
            return { backgroundColor: "#d4c80a", color: "#fff" };
          case "清库":
            return { backgroundColor: "#fb9320", color: "#fff" };
          case "锁定":
            return { backgroundColor: "#a3a3a3", color: "#fff" };
          case "停产":
            return { backgroundColor: "#e0514d", color: "#fff" };
          default:
            return { backgroundColor: "#e0514d", color: "#fff" };
        }
      };
    },
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
        if (mode === 1) {
          if (operation === "add") item.priceTo = resetMinZero((item.priceFrom + valueToNum).toFixed(2))
          if (operation === "reduce") item.priceTo = resetMinZero((item.priceFrom - valueToNum).toFixed(2))
          if (operation === "") item.priceTo = item.priceFrom
        }
        if (mode === 2) {
          if (operation === "add") item.quantityTo = resetMinZero(item.quantityFrom + valueToNum)
          if (operation === "reduce") item.quantityTo = resetMinZero(item.quantityFrom - valueToNum)
          if (operation === "") item.quantityTo = item.quantityFrom
        }
      })
    },
    async commit() {
      this.commitLoading = true
      const api = this.mode == 1 ? batchEditListingPrice : batchEditListingStock
      const res = await api(this.selectRows);
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
