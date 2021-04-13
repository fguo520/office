<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="任务类型:">
          <el-select v-model="listQuery.type" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.list" :key="index" :label="item.parameterValue" :value="item.parameterCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称:">
          <el-input v-model="listQuery.taskName" style="width:193px;" clearable placeholder="模糊搜索" />
        </el-form-item>
        <el-form-item label="创建人:">
          <el-select v-model="listQuery.adminId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.userList" :key="index" :label="item.username" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="编号" align="center" width="150">
          <template #default="{row}">
            <div><span v-copy="row.taskNo">{{row.taskNo}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="任务名称" align="center">
          <template #default="{row}">
            <div><span v-copy="row.name">{{row.name}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="任务类型" align="center" width="280">
          <template #default="{ row }">
            <div><span>{{ getType(row.type) }}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="生成状态" align="center" width="150">
          <template #default="{row}">
            <div><span>{{ getStatus(row.status) }}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="创建人" align="center" width="120">
          <template #default="{row}">
            <div><span v-copy="row.username">{{row.username}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="执行耗时（秒）" align="center" width="120">
          <template #default="{row}">
            <div><span>{{row.takeTime}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="220">
          <template #default="{row}">
            <div v-show="row.createTime">创建: {{row.createTime}}</div>
            <div v-show="row.completeTime">生成: {{row.completeTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="备注" align="center" width="250">
          <template #default="{row}">
            <div><span v-copy="row.errorDec">{{row.errorDec}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="120">
          <template #default="{row}">
            <div v-if="row.downloadUrl">
              <el-link type="primary" :underline="false" :href="row.downloadUrl">下载</el-link>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>
  </TabelPageLayout>
</template>
<script>
import { getExcelExportlcTaskList, addExcelExportlcTask, getExcelReportUserAdmin, searchTaskTypeList } from "@/api/Im/excelTask";
import { TabelPageLayout, ShrinkCard } from "@/components";
const defalutListQuery = {
  pageNum: 1,
  pageSize: 50,
  type: "",
  status: "",
  taskName: '',
  adminId: '',
};
export default {
  name: "excelTask",
  data() {
    return {
      listQuery: Object.assign({}, defalutListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        list: [],
        userList: [],
      },
      status: [
        { label: "待执行", value: 0 },
        { label: "执行中", value: 1 },
        { label: "执行成功", value: 2 },
        { label: "执行失败", value: 3 },
      ],
    };
  },
  components: {
    TabelPageLayout,
    ShrinkCard
  },
  computed: {
    getType() {
      return (type) => {
        console.log(type)
        const result = this.typeList.list.find(item => item.parameterCode === type) || {}
        return result.parameterValue || '未知'
      }
    },
    getStatus() {
      return (status) => {
        const result = this.status.find(item => item.value === status) || {}
        return result.label || '未知'
      }
    }
  },
  created() {
    this.getList();
    this.getTypeList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getExcelExportlcTaskList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.rateData = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getTypeList() {
      getExcelReportUserAdmin().then(res => {
        this.typeList.userList = res.data
      })
      searchTaskTypeList().then(res => {
        this.typeList.list = res.data
      })
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    resetOption() {
      this.listQuery = Object.assign({}, defalutListQuery);
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }
}
</style>