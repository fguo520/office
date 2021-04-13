<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" :dropdownDefault="false" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="120px">
        <el-form-item label="热搜词：">
          <el-input clearable v-model="listQuery.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="添加人：">
          <el-select v-model="listQuery.createUser" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.userList" :key="index" :label="item.fullName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="listQuery.isEnable" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value" />
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
      <el-button @click="addDialog = true" size="mini" type="primary" v-if="rolePermissionJudge('/rtsTopsearch/add')">新增热搜词</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="编号" align="center" type="index" width="100" />
        <u-table-column label="热搜词" align="center" width="300">
          <template #default="{ row }">
            <div><span v-copy="row.name">{{ row.name}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="绑定类目" align="center">
          <template #default="{ row }">
            <div style="text-align:left"><span v-copy="row.categoryName">{{ row.categoryName}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="150">
          <template #default="{ row }">
            <div :style="row.isEnable == 0?'color:#FF0000':'color:#67C23A'">{{row.isEnable== 1 ? '启用' : '停用'}}</div>
          </template>
        </u-table-column>
        <u-table-column label="添加人" align="center" width="150">
          <template #default="{ row }">
            <div><span v-copy="row.userName">{{ row.userName}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="添加时间" align="center" prop="createTime" width="180" />
        <u-table-column label="操作" align="center" prop="status" width="120">
          <template #default="{ row }">
            <el-popconfirm :title="`是否将该渠道变为${row.isEnable == 1 ? '停用' : '启用'}状态`" @confirm="editEnable(row)">
              <el-button slot="reference" size="mini" type="text" :style="row.isEnable == 1?'color:#FF0000':'color:#67C23A'">
                {{ row.isEnable == 1 ? '停用' : '启用' }}
              </el-button>
            </el-popconfirm>
            <el-button type="text" @click="handlejournal(row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <AddDialog :visible.sync="addDialog" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import { TabelPageLayout, ShrinkCard, LogView } from "@/components";
import { addHotSearch, editEnable, hotSearchLogPage, hotSearchPage } from "@/api/rts/rtsTopsearch"
import { getUmsAdminList } from "@/api/lazada/lzdPublish";
import AddDialog from "./components/AddDialog"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  createUser: "",
  isEnable: '',
  startTime: "",
  endTime: "",
  name: ''
};
export default {
  name: "rtsTopsearch",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      createTimeAndEndTime: [],
      typeList: {
        userList: [],
        statusList: [
          { label: "启用", value: 1 },
          { label: "停用", value: 0 },
        ]
      },
      addDialog: false,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: hotSearchLogPage,
        param: {
          id: "",
        },
      },
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
        const res = await hotSearchPage({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = getUmsAdminList();
      Promise.all([res]).then((res) => {
        this.typeList.userList = res[0].data
      }).catch((err) => {
        this.typeList.userList = []
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
    async editEnable(row) {
      const res = await editEnable(row.id, { isEnable: row.isEnable == 1 ? false : true })
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: res.message
        })
        this.getList()
      }
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
        id: row.id,
      };
      this.LogDialogVisible = true;
    },
  }
}
</script>