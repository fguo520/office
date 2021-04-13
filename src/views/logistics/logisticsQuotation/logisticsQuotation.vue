<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="120px">
        <el-form-item label="">
          <el-select v-model="listQuery.type" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:120px">
            <el-option v-for="(item, index) in typeList.typelist" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="请输入" v-model="listQuery.keyword" clearable style="width:200px" />
        </el-form-item>
        <el-form-item label="运费计算类型:">
          <el-select v-model="listQuery.calType" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.calTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <el-button @click="excelVisible=true" type="primary" size="mini" v-if="rolePermissionJudge('/logisticsQuotation/export')">导入</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="index" align="center" label="序号" width='100' />
        <u-table-column label="服务商代码&名称" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.logisticsServeiceCode">{{scope.row.logisticsServeiceCode}}</div>
            <el-tooltip class="item" effect="dark" :content="'运输方式名称：'+scope.row.logisticsTransportName" placement="top">
              <div class="tooltipClass" v-copy="scope.row.logisticsServeiceName">{{scope.row.logisticsServeiceName}}</div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="运输方式代码&名称" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.logisticsTransportCode">{{scope.row.logisticsTransportCode}}</div>
            <el-tooltip class="item" effect="dark" :content="'运输方式名称：'+scope.row.logisticsTransportName" placement="top">
              <div class="tooltipClass" v-copy="scope.row.logisticsTransportName">{{scope.row.logisticsTransportName}}</div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="运费计算类型" align="center" width="150">
          <template slot-scope="scope">
            <div v-copy="scope.row.calType===0?'区间价格':'起重续价'">{{scope.row.calType===0?"区间价格":"起重续价"}}</div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="150">
          <template slot-scope="scope">
            <div v-copy="scope.row.calType===0?'停用':'启用'" :style="scope.row.status==0?'color:red':'color:#52c41a'">{{scope.row.status===0?"停用":"启用"}}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="250">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div v-show="scope.row.createPerson||scope.row.createTime">
                创建: <span v-copy="scope.row.createPerson">{{scope.row.createPerson}}</span>
                <span v-copy="scope.row.createTime">{{scope.row.createTime}}</span>
              </div>
              <div v-show="scope.row.updatePerson||scope.row.updateTime">
                更新: <span v-copy="scope.row.updatePerson">{{scope.row.updatePerson}}</span>
                <span v-copy="scope.row.updateTime">{{scope.row.updateTime}}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="handleLook(scope.row)" v-if="rolePermissionJudge('/logisticsQuotation/see')" size="mini">查看</el-button>
            <el-button type="text" @click="upadteStatus(scope.row)" size="mini" v-if="rolePermissionJudge('/logisticsQuotation/status')" :style="scope.row.status?'color:red':'color:#52c41a'">{{ scope.row.status ? '停用' : '启用' }}</el-button>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <ExcelDialog :visible.sync="excelVisible" @request="getList" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <ViewQuotation :visible.sync="view.visible" :rows="view.rows" />
  </TabelPageLayout>
</template>
<script>
import { LogView, RadioButtonGroup, TabelPageLayout, TextareaInput, ShrinkCard, ScrollSelect } from "@/components";
import ViewQuotation from "./components/ViewQuotation"
import ExcelDialog from "./components/ExcelDialog"
import { getList, updateStatus, searchLogisticsLogPage } from "@/api/logistics/logisticsQuotation"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  type: 2,
  keyword: '',
  status: null,
  calType: null
}
export default {
  name: "logisticsQuotation",
  components: { LogView, RadioButtonGroup, TabelPageLayout, TextareaInput, ShrinkCard, ScrollSelect, ViewQuotation, ExcelDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      LogDialogVisible: false,
      typeList: {
        typelist: [{ label: "服务商名称", value: 1 },
        { label: "运输方式名称", value: 2 },
        { label: "报价单号", value: 3 },],
        calTypeList: [{ label: "区间价格", value: 0 },
        { label: "起重续价", value: 1 }],
        statusList: [{ label: "停用", value: 0 },
        { label: "启用", value: 1 }],
      },
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: searchLogisticsLogPage,
        param: {
          id: "",
          sourceType: 3
        },
      },
      excelVisible: false,
      view: {
        visible: false,
        rows: {}
      }
    }
  },
  created() {
    this.getList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getList({ ...this.listQuery });
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
    upadteStatus(row) {
      this.$confirm(`请确认是否${row.status ? '停用' : '启用'} ${row.logisticsTransportName} 运费报价。${row.status ? '停用后运费报价将无法使用。' : ''}`, `${row.status ? '停用' : '启用'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message({ type: "success", message: res.data })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },

    handleLook(row) {
      this.view = {
        visible: true,
        rows: row
      }
    }
  }
}
</script>