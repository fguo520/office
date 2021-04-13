<template>
  <el-dialog title="任务报告" :visible.sync="visible" width="1000px" append-to-body :before-close="close" @open="open">
    <el-table ref="tableContainer" style="width: 100%" :data="list" element-loading-text="数据加载中" border max-height="500px" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="任务编号" align="center" width="200">
        <template slot-scope="scope">
          <div v-copy="scope.row.taskNo">{{scope.row.taskNo}}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" align="center">
        <template slot-scope="scope">
          <div v-copy="scope.row.name">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-copy="scope.row.statusName">{{scope.row.statusName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="100">
        <template slot-scope="scope">
          <div v-copy="scope.row.nickName">{{scope.row.nickName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" width="200">
        <template slot-scope="scope">
          <div><span v-show="scope.row.createTime">创建：</span>{{scope.row.createTime}}</div>
          <div><span v-show="scope.row.completeTime">完成：</span>{{scope.row.completeTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-link v-show="scope.row.downloadUrl" type="primary" :href="scope.row.downloadUrl" target="_blank" :underline="false">下载报告</el-link>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" :total="total" @request="open" />
  </el-dialog>
</template>
<script>
import { logisticsReportPage } from "@/api/track/trackTrace"
import { Pagination } from "@/components"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  type: "10588"
}
export default {
  name: "TaskDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
    }
  },
  components: {
    Pagination
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    async open() {
      this.listLoading = true;
      try {
        const res = await logisticsReportPage(this.listQuery)
        this.list = res.data.list
        this.total = res.data.total
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    }
  }
}
</script>