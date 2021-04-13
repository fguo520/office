<template>
  <el-dialog title="提示" :visible.sync="visible" width="700px" :before-close="close" @open="queryShopeeListing">
    <div slot="title" class="titleContainer">
      <span class="title">批量编辑出货天数</span>
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
      <el-table-column label="item ID" align="center" width="150">
        <template #default="{ row }">
          {{ row.itemId }}
        </template>
      </el-table-column>
      <el-table-column label="seller sku" align="center">
        <template #default="{ row }">
          <span>{{ row.shopSku }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200">
        <template #header>
          <el-tooltip effect="light" content="修改范围5-10天" placement="top">
            <div><i class="el-icon-warning-outline" style="color: rgb(245,189,0);"></i>出货天数</div>
          </el-tooltip>
        </template>
        <template #default="{ row }">
          <div style="text-align: left">
            <div>调整前：{{ row.daysToShip }}</div>
            <div>调整后：
              <NumberInput v-model="row.skuModifyNum" min="0" float="2" style="width:100px;" />
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
import { queryDaysToShipListing, batchDaysToShipListing, } from "@/api/shopee/shopeeListing";
import { NumberInput } from "@/components"
export default {
  name: "DayDialog",
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
      const { selectRows } = this
      this.uuid = selectRows.map(i => i.uuid)
      const res = await queryDaysToShipListing(this.uuid)
      this.list = res.data.map(item => {
        return {
          ...item,
          skuNum: item.daysToShip,
          skuModifyNum: item.daysToShip
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
        return num < 5 ? 5 : num
      }
      function resetMinZero(num) {
        return num > 10 ? 10 : num
      }
      this.list.forEach(item => {
        if (operation === "add") item.skuModifyNum = resetMinZero((item.skuNum + valueToNum))
        if (operation === "reduce") item.skuModifyNum = resetMinZero((item.skuNum - valueToNum))
        if (operation === "") item.skuModifyNum = item.skuNum
      })
    },
    async commit() {
      this.commitLoading = true
      const res = await batchDaysToShipListing(this.list);
      this.commitLoading = false
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
