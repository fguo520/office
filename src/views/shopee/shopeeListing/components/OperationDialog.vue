<template>
  <el-dialog title="提示" :visible.sync="visible" width="1000" :before-close="close" @open="queryShopeeListing">
    <div slot="title" class="titleContainer">
      <span class="title">批量编辑{{ mode === 'price' ? '价格': '库存' }}</span>
      <span class="contant">
        统一修改：
        <el-select v-model="operation" placeholder="" size="mini" style="width:60px;" clearable @change="totalChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <NumberInput v-model="allValue" min="0" float="2" style="width:100px;" @input="totalChange" clearable />
      </span>
    </div>

    <el-table ref="tableContainer" style="width: 100%" :data="list" border height="500" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="图片" align="center" width="130">
        <template slot-scope="scope">
          <img slot="reference" :src="scope.row.imageUrl" style="width: 100px" />
          <div :style="getProductstate(scope.row.productState)">
            {{ scope.row.productState }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="sku" align="center" width="200">
        <template slot-scope="scope">
          <div style="text-align: left">
            <div>
              <i v-copy="scope.row.variationSku" class="el-icon-document-copy"></i>
              <el-link :underline="false" type="primary">
                {{ scope.row.variationSku }}
              </el-link>
            </div>
            <el-tooltip class="item" effect="dark" :content="'渠道sku:'+scope.row.shopSku" placement="top">
              <div class="tooltipClass">
                <span v-copy="scope.row.shopSku">{{
                    scope.row.shopSku
                  }}</span>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类目&分类" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.fullclassnamecn" placement="top">
            <div class="tooltipClass">
              <span v-copy="scope.row.fullclassnamecn"> {{ scope.row.fullclassnamecn }}</span>
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="scope.row.categoryName" placement="top">
            <div class="tooltipClass">
              <span v-copy="scope.row.categoryName"> {{ scope.row.categoryName }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="可用库存" align="center" width="100">
        <template #default="{ row }">
          {{ row.goodNum }}
        </template>
      </el-table-column>
      <el-table-column label="站点" align="center" width="100">
        <template #default="{ row }">
          <span>{{ row.site }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格($)" align="center" width="200" v-if="mode === 'price'">
        <template #default="{ row }">
          <div style="text-align: left">
            <div>调整前：{{ row.price }}</div>
            <div>调整后：
              <NumberInput v-model="row.skuModifyPrice" min="0" float="2" style="width:100px;" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" width="200" v-if="mode === 'stock'">
        <template #default="{ row }">
          <div style="text-align: left">
            <div>调整前：{{ row.stock }}</div>
            <div>调整后：
              <NumberInput v-model="row.skuModifyNum" min="0" style="width:100px;" />
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
import { queryShopeeListingByuuid, batchListingPrice, batchListingStock } from "@/api/shopee/shopeeListing";
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
      commitLoading: false,
      list: [],
      type: null,
      uuid: []
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
    async queryShopeeListing() {
      const { mode, selectRows } = this
      this.type = mode === 'price' ? 1 : 2
      this.uuid = selectRows.map(i => i.uuid)
      const res = await queryShopeeListingByuuid(this.type, this.uuid)
      this.list = res.data.map(item => {
        if (mode === 'price') return {
          ...item,
          skuPrice: item.price,
          skuModifyPrice: item.price
        }
        if (mode === 'stock') return {
          ...item,
          skuNum: item.stock,
          skuModifyNum: item.stock
        }
      })
    },
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
      this.list.forEach(item => {
        if (mode === 'price') {
          if (operation === "add") item.skuModifyPrice = resetMinZero((item.skuPrice + valueToNum).toFixed(2))
          if (operation === "reduce") item.skuModifyPrice = resetMinZero((item.skuPrice - valueToNum).toFixed(2))
          if (operation === "") item.skuModifyPrice = item.skuPrice
        }
        if (mode === 'stock') {
          if (operation === "add") item.skuModifyNum = resetMinZero(item.skuNum + valueToNum)
          if (operation === "reduce") item.skuModifyNum = resetMinZero(item.skuNum - valueToNum)
          if (operation === "") item.skuModifyNum = item.skuNum
        }
      })
    },
    async commit() {
      this.commitLoading = true
      const router = this.mode === 'price' ? batchListingPrice : batchListingStock
      const res = await router(this.list);
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
