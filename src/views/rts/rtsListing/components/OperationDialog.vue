<template>
  <el-dialog title="提示" :visible.sync="visible" width="1200px" :before-close="close">
    <div slot="title" class="titleContainer">
      <span class="title">批量编辑库存</span>
      <span class="contant">
        统一修改：
        <el-select v-model="operation" placeholder="" size="mini" style="width:60px;" clearable @change="totalChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <NumberInput v-model="allValue" min="0" float="2" style="width:100px;" @input="totalChange" clearable />
      </span>
    </div>
    <el-table ref="tableContainer" style="width: 100%" :data="rows" border height="500" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="图片" align="center" width="130">
        <template slot-scope="scope">
          <img slot="reference" :src="scope.row.mainImage" style="width: 100px" />
          <div :style="getProductstate(scope.row.productState)">
            {{ scope.row.productState }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="sku" align="center" width="220">
        <template #default="{ row }">
          <div style="text-align: left">
            <div v-for="(item,index) in row.modifyData.special_skus" :key="index">
              <el-link :underline="false" type="primary">
                {{ item.sku_code }}
              </el-link>
            </div>
            <el-tooltip class="item" effect="dark" :content="'渠道sku:'+row.productId" placement="right-start">
              <div class="tooltipClass">
                <span v-copy="row.productId">{{
                    row.productId
                  }}</span>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ItemID" align="center" width="150">
        <template slot-scope="scope">
          <div style="text-align: left">
            <div>
              <i v-copy="scope.row.pid" class="el-icon-document-copy"></i>
              <el-link :underline="false" type="primary" :href="scope.row.pcDetailUrl" target="_blank">
                {{ scope.row.pid }}
              </el-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品信息" align="center">
        <template slot-scope="scope">
          <div style="text-align: left">
            <div>
              <span v-copy="scope.row.storeNameAs">{{scope.row.storeNameAs}}</span>
            </div>
            <el-tooltip class="item" effect="dark" :content="'类目:'+scope.row.category" placement="top">
              <div class="tooltipClass">
                <span v-copy="scope.row.category"> {{ scope.row.category }}</span>
              </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'商品名称:'+scope.row.subject" placement="top">
              <div class="tooltipClass">
                <span v-copy="scope.row.subject">{{scope.row.subject}}</span>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="语种&币种" align="center" width="100">
        <template slot-scope="scope">
          <div style="text-align: left">
            <div>
              <span v-copy="scope.row.language">{{scope.row.language}}</span>
            </div>
            <div>USD</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="参考库存" align="center" width="100">
        <template slot-scope="scope">
          <div>{{scope.row.goodNum }}</div>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" width="180">
        <template #default="{ row }">
          <div v-for="(item,index) in row.modifyData.special_skus" :key="index">
            <div style="text-align: left">
              <div>调整前：{{ item.inventory_dto_list[0].defaultValue}}</div>
              <div>调整后：
                <NumberInput v-model="item.inventory_dto_list[0].current_inventory" min="0" style="width:90px;" />
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button type="primary" size="mini" @click="commit" :loading="commitLoading">确定</el-button>
    </span>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" append-to-body />
  </el-dialog>
</template>
<script>
import { NumberInput, SkuInfoView } from "@/components"
import { updateInventorys } from "@/api/rts/rtsListing"
// import { delete } from 'vue/types/umd'
export default {
  name: "OperationDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => []
    },
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
      SkuNum: "",
      SkuDialogVisible: false,
    }
  },
  components: {
    NumberInput,
    SkuInfoView
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
    close() {
      this.$emit("update:visible", false)
      this.operation = this.allValue = ""
    },
    totalChange() {
      const { operation } = this
      const valueToNum = Number(this.allValue) || 0;
      function resetMinZero(num) {
        return num < 0 ? 0 : num
      }
      this.rows.forEach(item => {
        item.modifyData.special_skus.forEach(i => {
          if (operation === "add") i.inventory_dto_list[0].current_inventory = resetMinZero(i.inventory_dto_list[0].defaultValue + valueToNum)
          if (operation === "reduce") i.inventory_dto_list[0].current_inventory = resetMinZero(i.inventory_dto_list[0].defaultValue - valueToNum)
          if (operation === "") i.inventory_dto_list[0].current_inventory = i.inventory_dto_list[0].defaultValue
        })
      })
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    async commit() {
      this.commitLoading = true
      this.rows.map(item => {
        const modifyData = item.modifyData['special_skus'].forEach(modifyDataItem => {
          modifyDataItem['inventory_dto_list'].forEach(listItem => {
            delete listItem.defaultValue
          })
        })
        return {
          ...item,
          modifyData
        }
      })
      this.rows.forEach(item => { item.modifyData = JSON.stringify(item.modifyData) })
      console.log(this.rows)
      const res = await updateInventorys(this.rows);
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
  