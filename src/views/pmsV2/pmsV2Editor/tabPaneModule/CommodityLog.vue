<template>
  <div>
    <div v-if="total>0">共搜索到了{{total}}条记录</div>
    <el-table ref="plTable" :data="tableData" height="70vh" use-virtual showBodyOverflow="title" showHeaderOverflow="title" border>
      <el-table-column label="操作时间" width="180" align="center" prop="operationTime" />
      <el-table-column label="操作人" width="150" align="center" prop="operationUser" />
      <el-table-column label="日志类型" width="150" align="center" prop="operationType">
        <template #default="{ row }">
          {{ row.logType }} -- {{ row.operationType }}
        </template>
      </el-table-column>
      <el-table-column label="操作内容" align="center">
        <template slot-scope="scope">
          <div style="text-align: left">
            <el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top">
              <div class="tooltipClass">
                <span v-copy="scope.row.content">{{
                    scope.row.content
                  }}</span>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" />
  </div>
</template>

<script>
import { getProductLogList } from "@/api/pmsV2/pmsV2List"
import { Pagination } from "@/components"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  id: ""
}
export default {
  name: 'CommodityLog',
  components: { Pagination },
  props: {
    home: null
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
    };
  },
  created() {
    // this.getList()
  },
  watch: {
    'home.currentTab': function (newValue) {
      if (newValue === 'commodityLog') this.getList()
    }
  },
  methods: {
    getList() {
      const { $route: { query: { id, copy } }, listQuery } = this
      id && !copy && getProductLogList({ ...listQuery, manageId: id }).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total;
      })
    }
  },
};
</script>

<style scoped lang='scss'>
</style>
