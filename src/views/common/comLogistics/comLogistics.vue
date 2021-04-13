<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="平台:">
          <el-select v-model="listQuery.platformCode" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="addDialog=true" v-if="rolePermissionJudge('/comLogistics/add')">物流属性配置</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="编号" align="center" prop="attrNo" width="120" />
        <u-table-column label="平台" align="center" width="120">
          <template #default="{ row }">
            <span v-copy="row.platform">{{ row.platform }}</span>
          </template>
        </u-table-column>
        <u-table-column label="物流方式" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="row.logisticsMode" placement="top">
                <div class="tooltipClass" v-copy="row.logisticsMode">{{ row.logisticsMode }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="禁止物流属性" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="row.banLogisticsAttr" placement="top">
                <div class="tooltipClass" v-copy="row.banLogisticsAttr">{{ row.banLogisticsAttr }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="刊登提示物流属性" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="row.promptLogisticsAttr" placement="top">
                <div class="tooltipClass" v-copy="row.promptLogisticsAttr">{{ row.promptLogisticsAttr }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="120">
          <template #default="{ row }">
            <div :style="row.status==0?'color:#FF0000':'color:#67C23A'">{{ row.status ? '启用' : '停用' }}</div>
          </template>
        </u-table-column>
        <u-table-column label="配置人" align="center" prop="createUser" width="120" />
        <u-table-column label="配置时间" align="center" prop="updateTime" width="180" />
        <u-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-popconfirm :title="`是否${scope.row.status ? '停用' : '启用'}`" @confirm="updateState(scope.row)">
              <el-button slot="reference" size="mini" type="text" :style="scope.row.status ?'color:#FF0000':'color:#67C23A'">
                {{ !scope.row.status ? '启用' : '停用' }}
              </el-button>
            </el-popconfirm>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <AddDialog :visible.sync="addDialog" :typeList="typeList" @request="getList" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getList, getLogList, getAllPlatform, getAllLogisticMode, updateStatus, logisticsAttradd } from "@/api/common/comLogistics";
import { TabelPageLayout, LogView, ScrollSelect, ShrinkCard } from "@/components";
import AddDialog from "./components/AddDialog";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  platformCode: ""
};
export default {
  name: "comLogistics",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      typeList: {
        platformList: []
      },
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "operationUser", width: "120" },
          { label: "操作时间", property: "operationTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getLogList,
        param: {
          id: "",
        },
      },
      LogDialogVisible: false,
      addDialog: false
    }
  },
  components: {
    TabelPageLayout,
    LogView,
    ScrollSelect,
    ShrinkCard,
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
        const res = await getList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getAllPlatform()
      this.typeList.platformList = res.data
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async updateState(row) {
      const res = await updateStatus({ id: row.id, status: row.status ? 0 : 1 })
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: res.message
        })
        this.getList()
      }
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
  }
}
</script>