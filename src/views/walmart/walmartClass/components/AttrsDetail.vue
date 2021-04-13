<template>
  <el-dialog title="导入内容详情" :visible.sync="visible" :before-close="close" @open="open" append-to-body custom-class="attrsDialog" width="900px">
    <el-table :data="list" element-loading-text="数据加载中" border height="300px" :header-cell-style="{ 'background-color': '#dadde3' }">

      <el-table-column label="字段" align="center">
        <template #default="{ row }">
          <div style="text-align:left">
            <el-tooltip class="item" effect="dark" :content="row.name" placement="top">
              <div class="tooltipClass">{{ row.label }}</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="数据类型" align="center" width="100">
        <template #default="{ row }">
          <div>{{ row.inputType }}</div>
        </template>
      </el-table-column>

      <el-table-column label="选择项" align="center">
        <template #default="{ row }">
          <div style="text-align:left">
            <el-tooltip class="item" effect="dark" :content="row.options" placement="top">
              <div class="tooltipClass">{{ row.options }}</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <div>{{ row.status | statusValue}}</div>
        </template>
      </el-table-column>

      <el-table-column label="导入人" align="center" width="100">
        <template #default="{ row }">
          <div>{{ row.createUser }}</div>
        </template>
      </el-table-column>

      <el-table-column label="导入时间" align="center" width="180">
        <template #default="{ row }">
          <div>{{ row.createTime }}</div>
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
import { getCategoryAttributesList } from "@/api/walmart/walmartClass";
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
      const res = await getCategoryAttributesList({ ...this.listQuery, ...this.params })
      this.list = res.data.list
      this.total = res.data.total
    },
    open(){
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
/deep/ .attrsDialog{
  .el-dialog__body {
    padding: 0;
    padding-bottom:15px;
  }
}
</style>
