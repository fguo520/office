<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" :dropdownDefault="false" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="120px">
        <el-form-item label="公司名称">
          <el-input clearable v-model="listQuery.companyName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="平台：">
          <el-select v-model="listQuery.platform" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加人：">
          <el-select v-model="listQuery.addUserId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.userList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间：">
          <el-date-picker @change="timeChange" v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px;">
      <el-button @click="addDialog = true" size="mini" type="primary" v-if="rolePermissionJudge('/selectionLink/add')">添加链接</el-button>
      <el-button @click="batchDelete" size="mini" type="primary" v-if="rolePermissionJudge('/selectionLink/delect')">批量删除</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="40" />
        <u-table-column label="任务单号" align="center" prop="taskNo" width="130" />
        <u-table-column label="公司名称" align="center" width="250">
          <template #default="{ row }">
            <div><span v-copy="row.companyName">{{ row.companyName}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="平台" align="center" prop="platform" width="100" />
        <u-table-column label="URL" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <i v-copy="row.url" class="el-icon-document-copy"></i>
              <el-link :underline="false" type="primary" :href="row.url" target="_blank">{{ row.url }}
              </el-link>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="url来源" align="center" prop="urlSource" width="100" />
        <u-table-column label="抓取条数" align="center" prop="handleCount" width="100" />
        <u-table-column label="状态" align="center" prop="status" width="120">
          <template #default="{ row }">
            <div><span>{{ row.statusCn}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="添加人" align="center" prop="addUser" width="150" />
        <u-table-column label="时间" align="center" width="220">
          <template #default="{ row }">
            <div><span v-show="row.addTime">创建：</span>{{ row.addTime}}</div>
            <div><span v-show="row.dwdUpdateDate">入库：</span>{{ row.dwdUpdateDate}}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" prop="status" width="120">
          <template #default="{ row }">
            <el-button type="text" @click="handlejournal(row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <AddDialog :visible.sync="addDialog" :typeList="typeList" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import { TabelPageLayout, ShrinkCard, LogView } from "@/components";
import { list, getPlatforms, add, batchDelete, getAddUsers, getLogList } from "@/api/selection/selectionLink"
import AddDialog from "./components/AddDialog"
const defaultListQuery = {
  addUserId: "",
  pageNum: 1,
  pageSize: 50,
  companyName: "",
  platform: "",
  status: null,
  addBeginTime: "",
  addEndTime: "",
};
export default {
  name: "selectionLink",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      createTimeAndEndTime: [],
      typeList: {
        platformList: [],
        userList: [],
        statusList: [
          { label: "待处理", value: 0 },
          { label: "跑数中", value: 1 },
          { label: "跑数完毕", value: 2 },
          { label: "清洗完毕", value: 3 },
          { label: "处理失败", value: 4 },
        ]
      },
      addDialog: false,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "跑数据开始时间", property: "runningTime" },
          { label: "跑数据完毕时间", property: "finishRunningTime" },
          { label: "清洗完毕时间", property: "finishTransactionTime" },
          { label: "入库时间", property: "dwdCreateDate" },
        ],
        request: getLogList,
        param: {
          taskNo: "",
        },
      },
    }
  },
  filters: {
    statusFilter(type) {
      switch (type) {
        case 0:
          return "待处理";
        case 1:
          return "处理中"
        case 2:
          return "已处理"
        case 3:
          return "处理失败"
        default:
          return "未知"
      }
    }
  },
  components: {
    TabelPageLayout,
    ShrinkCard,
    LogView,
    AddDialog
  },
  created() {
    this.getList();
    this.getType();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await list({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = getPlatforms();
      const resUser = getAddUsers();
      Promise.all([res, resUser]).then((res) => {
        this.typeList.platformList = res[0].data
        this.typeList.userList = res[1].data
      }).catch((err) => {
        this.typeList.platformList = []
        this.typeList.userList = [];
      });
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.createTimeAndEndTime = []
      this.getList();
    },
    async batchDelete() {
      const { $refs, $message, $confirm } = this;
      const selection = $refs.tableContainer.$refs.singleTable.selection
      if (!selection.length) {
        $message({
          type: "warning",
          message: "请先勾选需要操作的数据"
        })
        return
      }
      try {
        const confirm = await $confirm('是否将选中数据删除？是请按确认按钮！', '确认提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const ids = selection.map(item => item.id);
        const res = await batchDelete(ids)
        if (res.code === 200) {
          $message({
            type: "success",
            message: "删除成功"
          })
          this.getList()
        }
      } catch (error) { }
    },
    timeChange() {
      if (this.createTimeAndEndTime != null) {
        this.listQuery.addBeginTime = this.createTimeAndEndTime[0];
        this.listQuery.addEndTime = this.createTimeAndEndTime[1];
      } else {
        this.listQuery.addBeginTime = "";
        this.listQuery.addEndTime = "";
      }
    },
    handlejournal(row) {
      this.logViewParam.param = {
        taskNo: row.taskNo,
      };
      this.LogDialogVisible = true;
    },
  }
}
</script>