<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageIndex" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="任务编码" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.taskNo">{{scope.row.taskNo}}</div>
          </template>
        </u-table-column>
        <u-table-column label="任务名称" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.name">{{scope.row.name}}</div>
          </template>
        </u-table-column>
        <u-table-column label="生成状态" align="center">
          <template slot-scope="scope">
            <div v-copy="handStatus(scope.row.status)">{{handStatus(scope.row.status)}}</div>
          </template>
        </u-table-column>
        <u-table-column label="创建任务人" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.username">{{scope.row.username}}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.createTime"><span v-show="scope.row.createTime">创建任务：</span>{{scope.row.createTime}}</div>
            <div v-copy="scope.row.completeTime"><span v-show="scope.row.completeTime">生成报告：</span>{{scope.row.completeTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link v-show="scope.row.downloadUrl" :underline="false" type="primary" :href="scope.row.downloadUrl" target="_blank">
              下载报告
            </el-link>
          </template>
        </u-table-column>
      </u-table>
    </template>
  </TabelPageLayout>
</template>
<script>
import { TabelPageLayout, } from "@/components";
import { getTortRecordTaskList } from "@/api/common/sysTort"
const defaultListQuery = { pageIndex: 1, pageSize: 50 }
export default {
  name: "Task",
  components: { TabelPageLayout },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      statusList:[{label:"未生成",value:0},{label:"生成中",value:1},{label:"生成成功",value:2},{label:"生成失败",value:3},]
    }
  },
  created() {
    this.getList();
  },
  computed:{
    handStatus(){
      return function(type){
        return this.statusList.find(i=>{return i.value==type}).label
      }
    }
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getTortRecordTaskList({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.totalCount;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
  }
}
</script>