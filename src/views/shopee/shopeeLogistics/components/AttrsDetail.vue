<template>
  <el-dialog title="内容详情" :visible.sync="visible" :before-close="close" @open="open" append-to-body custom-class="attrsDialog" width="800px">
    <el-table :data="list" element-loading-text="数据加载中" border height="290px" :header-cell-style="{ 'background-color': '#dadde3' }">

      <el-table-column label="重量区间kg" align="center">
        <template slot-scope="scope">
          <div><span>{{scope.row.minWeight}} ~ {{scope.row.maxWeight}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">
          <div><span>{{scope.row.unitPrice}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="币种" align="center">
        <template slot-scope="scope">
          <div><span>{{scope.row.currency}}</span></div>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getAttrsDetail" />

    <div slot="footer" style="margin-top: 40px;text-align: center">
      <el-button @click="close" size="mini"> 关 闭 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getofferdetail } from "@/api/shopee/shopeeLogistics";
import { Pagination } from "@/components"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
}
export default {
  name: "AttrsDetail",
  props: {
    params: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      total: 0,
      list: [],
    }
  },
  components: {
    Pagination
  },
  beforeDestroy() {
    this.close();
  },
  filters: {
    statusValue(type) {
      switch (type) {
        case 1:
          return "启用";
        case -1:
          return "停用";
        default:
          return "未知"
      }
    },
  },
  methods: {
    async getAttrsDetail() {
      const res = await getofferdetail({ ...this.listQuery, ...this.params })
      this.list = res.data.list
      this.total = res.data.total
    },
    open() {
      this.listQuery.pageNum = 1;
      this.getAttrsDetail()
    },
    close() {
      this.$emit("update:visible", false)
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .attrsDialog {
  .el-dialog__body {
    padding: 0;
    padding-bottom: 15px;
  }
}
</style>
