
<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageIndex" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="站点：">
          <el-select v-model="listQuery.chooseCountry" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.chooseCountryList" :key="index" :label="item.parameterName" :value="item.parameterCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流名称：">
          <el-input clearable v-model="listQuery.logisticName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="listQuery.enabled" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in enabledList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px;">
      <el-button @click="getInfo" :loading="ifInfo" :disabled="ifInfo" size="mini" type="primary" v-if="rolePermissionJudge('/shopeeLogistics/info')">手动拉取物流信息</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="物流编号" align="center">
          <template slot-scope="scope">
            <div><span v-copy="scope.row.logisticId">{{scope.row.logisticId}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="物流名称" align="center">
          <template #default="{ row }">
            <div>
              <span v-copy="row.logisticName">{{ row.logisticName }}</span>
              <span style="color:red;">{{ row.isMaintain ? '(已维护)' : '' }}</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div :style="scope.row.enabled === false?'color:#FF0000':'color:#67C23A'">{{scope.row.enabled|statusFilter}}</div>
          </template>
        </u-table-column>
        <u-table-column label="站点" align="center">
          <template slot-scope="scope">
            <div><span v-copy="scope.row.chooseCountryName">{{scope.row.chooseCountryName}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.createTime">{{scope.row.createTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="handleupdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" @click="handExport(scope.row)" size="mini">导入</el-button>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <ExportAttr :visible.sync="exportDialog.visible" :category="exportDialog.id" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <EditDialog :visible.sync="edit.visible" :enabledList="enabledList" :row="edit.row" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import {
  LogView,
  TabelPageLayout,
  ScrollSelect,
  ShrinkCard,
  NumberInput,
} from "@/components";
import { getpage, getSyslist, getlogistics, getinit } from "@/api/shopee/shopeeLogistics"
import ExportAttr from "./components/ExportAttr"
import EditDialog from "./components/EditDialog"
const defaultListQuery = {
  pageIndex: 1,
  pageSize: 50,
  chooseCountry: "",
  enabled: null,
  logisticName: "",
};
export default {
  name: "shopeeLogistics",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        chooseCountryList: [],
      },
      enabledList: [{ label: "停用", value: false },
      { label: "启用", value: true },],
      isFrom: true,
      dialogFormVisible: false,
      LogDialogVisible: false,
      ifInfo: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "type", width: "120" },
          { label: "操作人", property: "createUserName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getlogistics,
        param: {
          id: ""
        },
      },
      exportDialog: {
        visible: false,
        id: ""
      },
      edit: {
        visible: false,
        row: {}
      },
    }
  },
  components: {
    LogView,
    TabelPageLayout,
    ScrollSelect,
    ShrinkCard,
    NumberInput,
    ExportAttr,
    EditDialog
  },
  filters: {
    statusFilter(type) {
      switch (type) {
        case false:
          return "停用";
        case true:
          return "启用"
        default:
          return "未知"
      }
    }
  },
  created() {
    this.getList();
    this.getType()
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getpage({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      getSyslist({
        pageNum: 1,
        pageSize: 50, isTopClass: 0,
        parameterSearchType: "shopee国家"
      }).then(res => {
        this.typeList.chooseCountryList = res.data.list
      })
    },
    getQuery() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    getInfo() {
      this.ifInfo = true;
      getinit().then(res => {
        if (200 == res.code) {
          this.ifInfo = false;
          this.$message.success(res.message);
        }
        this.getList();
      })
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    async handExport(row) {
      this.exportDialog.id = row.id
      this.exportDialog.visible = true
    },
    handleupdate(row) {
      this.edit.row = row
      this.edit.visible = true
    },
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }
}
.formDiv .el-dialog__body {
  .el-form {
    .formDialog {
      overflow: hidden;
      .formDialog_item {
        width: 369px;
        float: left;
        height: 65px;
        .el-form-item /deep/.el-form-item__content {
          width: 200px;
        }
        .formCont /deep/ .el-form-item__content .el-form-item__error {
          margin-top: -15px;
        }
        .el-date-editor {
          width: 200px;
        }
      }
    }
  }
}
</style>