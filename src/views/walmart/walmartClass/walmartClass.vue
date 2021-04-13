
<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="类目：">
          <el-select v-model="listQuery.category" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in categoryList" :key="index" :label="item.category" :value="item.category">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="类目名称" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <span v-copy="row.category">{{ row.category }}</span>
              <span style="color:red;">{{ row.isMaintain ? '(已维护)' : '' }}</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="类目佣金" align="center">
          <template #default="{ row }">
            <div>
              <span>{{ row.categoryCommissionRate }} %</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center">
          <template #default="{ row }">
            <div>
              <span :style="row.status==0?'color:#FF0000':'color:#67C23A'">{{ row.status|statusFilter }}</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="拉取时间" align="center">
          <template #default="{ row }">
            <div>{{ row.createTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="handleeditor(row)" size="mini">编辑</el-button>
            <el-button type="text" @click="handleEXport(row)" size="mini">导入属性</el-button>
            <el-button type="text" @click="handlejournal(row)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <ExportAttr :visible.sync="exportDialog.visible" :category="exportDialog.category" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <EditDialog :visible.sync="edit.visible" :statusList="statusList" :row="edit.row" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import {
  getCategoryPage,
  getWalmartApiCategoryList,
  getWalmartCategoryLog,
} from "@/api/walmart/walmartClass";
import { TabelPageLayout, ShrinkCard, LogView } from "@/components";
import ExportAttr from "./components/ExportAttr"
import EditDialog from "./components/EditDialog"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  category: "",
  status: ""
};
export default {
  name: "walmartClass",
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      statusList: [{ label: "启用", value: 1 }, { label: "停用", value: 0 }],
      categoryList: [],
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getWalmartCategoryLog,
        param: {
          category: "",
        },
      },
      LogDialogVisible: false,
      exportDialog: {
        visible: false,
        category: ""
      },
      edit: {
        visible: false,
        row: {}
      },
    };
  },
  components: {
    TabelPageLayout,
    ShrinkCard,
    LogView,
    ExportAttr,
    EditDialog
  },
  filters: {
    statusFilter(type) {
      switch (type) {
        case 1:
          return "启用";
        case 0:
          return "停用";
        default:
          return "未知"
      }
    },
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
        const res = await getCategoryPage(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getType() {
      const res = await getWalmartApiCategoryList();
      this.categoryList = res.data
    },
    handlejournal(row) {
      this.logViewParam.param = {
        category: row.category,
      };
      this.LogDialogVisible = true;
    },
    handleeditor(row) {
      this.edit.row = row
      this.edit.visible = true
    },
    handleEXport(row) {
      this.exportDialog.category = row.category
      this.exportDialog.visible = true
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

.productClassDialog {
  .el-dialog__body {
    padding: 0 20px 10px;
    overflow: hidden;
  }

  .el-dialog__footer {
    text-align: center;
    padding: 10px 20px 20px;
  }
}
</style>