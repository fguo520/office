<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout" :dropdownDefault="false">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="平台:">
          <el-select v-model="listQuery.platformName" placeholder="全部" size="mini" clearable class="input-width" filterable @change="platformNameChange">
            <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.parameterName" :value="item.parameterName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型:">
          <!-- <ScrollSelect v-model="listQuery.feeTypeCodeList" :list="typeList.feeTypeList" :prop="{label:'parameterValue',value:'parameterCode'}" aria-placeholder="请选择平台" /> -->
          <el-select v-model="listQuery.feeTypeCode" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option label="全选" value="" />
            <el-option v-for="(item, index) in typeList.feeTypeList" :key="index" :label="item.parameterValue" :value="item.parameterCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺:">
          <ScrollSelect v-model="listQuery.channelIdList" :list="typeList.channelIdList" :prop="{label:'storeNameAs',value:'id'}" />
        </el-form-item>
        <!-- <el-form-item label="费用审核号:">
          <TextareaInput v-model="listQuery.applyNoList" />
        </el-form-item>
        <el-form-item label="平台订单号:">
          <TextareaInput v-model="listQuery.platformOrderNoList" />
        </el-form-item> -->
        <el-form-item label="销售负责人:">
          <ScrollSelect v-model="listQuery.chargeSalerIdList" :list="typeList.chargeSalerIdList" :prop="{label:'fullName',value:'id'}" />
        </el-form-item>
        <el-form-item label="费用承担人:">
          <ScrollSelect v-model="listQuery.feeTakerIdList" :list="typeList.chargeSalerIdList" :prop="{label:'fullName',value:'id'}" />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="listQuery.remark" clearable size="mini" placeholder="模糊搜索"></el-input>
        </el-form-item>
        <el-form-item label="订单&审核号:">
          <el-select v-model="listQuery.numberType" placeholder="全部" size="mini" filterable style="width:120px">
            <el-option v-for="(item, index) in typeList.numberTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <TextareaInput v-model="listQuery.numberList" />
        </el-form-item>
        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.billStatus" :ButtonTypes="states" @request="getList" :doubleCancle="false"></RadioButtonGroup>
    <div>
      <el-button @click="add()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/financeCost/found')">创建</el-button>
      <el-button @click="handBatch()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/financeCost/batchReview')" v-show="this.listQuery.billStatus==1||this.listQuery.billStatus==2">批量审核</el-button>
      <el-button @click="exportexcel()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/financeCost/export')">下载</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="审核类型" align="center" width="150">
          <template slot-scope="scope">
            <div v-copy="scope.row.feeTypeName">{{scope.row.feeTypeName}}</div>
          </template>
        </u-table-column>
        <u-table-column label="审核状态" align="center" width="120">
          <template slot-scope="scope">
            <div v-copy="scope.row.billStatusCN"><i :class="handIcon(scope.row.billStatus)" :style="handStyle(scope.row.billStatus)"></i><span style="margin-left:10px">{{scope.row.billStatusCN}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="单号" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="'费用审核号:'" placement="left">
                <div v-copy="scope.row.applyNo">{{scope.row.applyNo }}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'平台订单号:'" placement="left">
                <div v-copy="scope.row.platformOrderNo">{{scope.row.platformOrderNo }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="账号信息" align="center" width="180">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="'平台:'" placement="left">
                <div>{{scope.row.platformName}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'店铺:'" placement="left">
                <div>{{scope.row.channelName}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="费用详情" align="center" min-width="200">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div v-if="scope.row.totalPayAmountCny">支出总金额: {{scope.row.totalPayAmountCny}} CNY</div>
              <div v-if="scope.row.rate">退款率: {{((scope.row.rate)*100).toFixed(4)}} %</div>
              <div v-if="scope.row.totalLossAmountRmb">总耗损金额: {{scope.row.totalLossAmountRmb}} CNY</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="人员" align="center" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="'销售负责人:'" placement="left">
              <div v-copy="scope.row.chargeSalerName">{{scope.row.chargeSalerName  }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'费用承担人:'" placement="left">
              <div v-copy="scope.row.feeTakerName">{{scope.row.feeTakerName}}</div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="操作人&时间" align="center" width="280">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div>创建：<span style="margin-right:10px">{{scope.row.applyUserName}}</span><span>{{scope.row.createTime  }}</span></div>
              <div v-show="scope.row.billStatus!==1">更新：<span style="margin-right:10px">{{scope.row.operatorName}}</span><span>{{scope.row.updateTime  }}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="text" @click="handLook(scope.row)" size="mini" v-if="rolePermissionJudge('/financeCost/look')">查看</el-button>
            <el-button type="text" @click="handCopy(scope.row)" size="mini" v-if="rolePermissionJudge('/financeCost/copy')" v-show="scope.row.billStatus==1||scope.row.billStatus==3||scope.row.billStatus==4||scope.row.billStatus==5">复制</el-button>
            <el-button type="text" @click="handPass(scope.row)" size="mini" v-if="rolePermissionJudge('/financeCost/departmentAudit')" v-show="scope.row.billStatus==1">部门审核</el-button>
            <el-button type="text" @click="handPass(scope.row)" size="mini" v-if="rolePermissionJudge('/financeCost/financialAudit')" v-show="scope.row.billStatus==2">财务审核</el-button>
            <el-button type="text" @click="handDelect(scope.row)" size="mini" v-if="rolePermissionJudge('/financeCost/cancellation')" v-show="scope.row.billStatus==1||scope.row.billStatus==2">作废</el-button>
            <el-button size="mini" type="text" @click="handlejournal(scope.row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <AddDialog :visible.sync="addDialog.visible" :addDialog="addDialog" :typeList="typeList" @request="getList" />
    <BatchReview :list="batch.list" :visible.sync="batch.visible" :status="listQuery.billStatus" @request="getList" />
    <ExportExcel :typeList="typeList" :visible.sync="exportDialog.visible" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import { listPlatform, queryApplyBill, selectAllEffectiveUmsAdmin, listFeeType, queryChannelByPlatformCode, listDepartment, discardBill, queryBillLog } from "@/api/finance/financeCost"
import { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, TreeSelect, } from "@/components";
import AddDialog from "./components/AddDialog";
import BatchReview from "./components/BatchReview";
import ExportExcel from "./components/ExportExcel";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  applyNoList: [],
  billStatus: 1,
  channelIdList: [],
  excelFlag: null,
  feeTypeCode: "",
  platformName: "",
  platformOrderNoList: [],
  remark: "",
  startTime: "",
  endTime: "",
  timeType: 1,
  numberType: 1,
  numberList: [],
  chargeSalerIdList: [], feeTakerIdList: []
}
export default {
  name: "financeCost",
  components: { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, TreeSelect, AddDialog, BatchReview, ExportExcel },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      addDialog: {
        visible: false,
        disabled: false,
        rows: {},
        title: "",
        upload: false,
        pass: false
      },
      typeList: {
        platformList: [],
        departmentList: [],
        feeTypeList: [],
        channelIdList: [],
        chargeSalerIdList: [],
        timeTypeList: [{ label: "创建", value: 1 },
        { label: "审核完成", value: 2 }],
        numberTypeList: [
          { label: "平台订单号", value: 1 },
          { label: "费用审核号", value: 2 }
        ]
      },
      createTimeAndEndTime: [],
      states: [
        { label: "全部", value: null },
        { label: "待审核", value: 1 },
        { label: "审核中", value: 2 },
        { label: "已通过", value: 3 },
        { label: "已拒绝", value: 4 },
        { label: "已作废", value: 5 },
      ],
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "content", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: queryBillLog,
        param: {
          applyNo: "",
        },
      },
      batch: {
        visible: false,
        list: []
      },
      exportDialog: {
        visible: false
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
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  computed: {
    handIcon() {
      return function (type) {
        switch (type) {
          case 1:
            return "el-icon-video-play"
          case 2:
            return "el-icon-loading"
          case 3:
            return "el-icon-circle-check"
          case 4:
            return "el-icon-circle-close"
          case 5:
            return "el-icon-folder-delete"
          default:
            return ""
        }
      }
    },
    handStyle() {
      return function (type) {
        switch (type) {
          case 1:
            return { color: "orange" }
          case 2:
            return { color: "orange" }
          case 3:
            return { color: "green" }
          case 4:
            return { color: "red" }
          case 5:
            return { color: "red" }
          default:
            return ""
        }
      }
    }
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await queryApplyBill({ ...this.listQuery });
        this.list = res.data.list;

        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await Promise.all([listPlatform(), selectAllEffectiveUmsAdmin()])
      this.typeList.platformList = res[0].data
      this.typeList.chargeSalerIdList = res[1].data
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = [];
      } else {
        this.listQuery.pageNum = 1
      }
      this.getList();
    },
    async platformNameChange() {
      const platformCode = this.typeList.platformList.find(i => { return i.parameterName == this.listQuery.platformName }).parameterCode
      const res = await Promise.all([listFeeType({ platformName: this.listQuery.platformName }), queryChannelByPlatformCode({ platformCode }), listDepartment({ platformName: "" })])
      this.typeList.feeTypeList = res[0].data
      this.typeList.channelIdList = res[1].data
      this.typeList.departmentList = res[2].data
      this.listQuery.feeTypeCode = ""
    },
    add() {
      this.addDialog = {
        visible: true,
        disabled: false,
        upload: false,
        rows: {},
        title: "创建费用申请单"
      }
    },
    handLook(row) {
      this.addDialog = {
        visible: true,
        disabled: true,
        upload: true,
        pass: false,
        rows: { ...row },
        title: "查看费用申请单"
      }
    },
    handCopy(row) {
      this.addDialog = {
        visible: true,
        disabled: false,
        upload: true,
        pass: false,
        rows: { ...row },
        title: "复制费用申请单"
      }
    },
    handDelect(row) {
      const h = this.$createElement;
      this.$msgbox({
        title: '作废',
        message: h('p', null, [
          h('span', null, '请确认是否继续'),
          h('b', { style: 'color: red' }, ' 作废 '),
          h('span', null, '费用审核单'),
          h('br', null, null),
          h('span', null, "审核单号："),
          h('b', null, `${row.applyNo}`),
          h('br', null, null),
          h('span', null, "平台："),
          h('span', null, `${row.platformName}`),
          h('br', null, null),
          h('span', null, "审核类型："),
          h('span', null, `${row.feeTypeName}`),
          h('br', null, null),
          h('span', null, "申请人："),
          h('span', null, `${row.applyUserName}`),
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton:true
      }).then(() => {
        discardBill({ id: row.id, version: row.version }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message)
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消作废'
        });
      });
    },
    handPass(row) {
      this.addDialog = {
        visible: true,
        disabled: true,
        upload: true,
        pass: true,
        rows: { ...row },
        status: row.billStatus,
        title: "审核费用申请单"
      }
      this.addDialog.rows.isCheck = null
      this.addDialog.rows.rejectReason = ""
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.applyNo = params.applyNo;
      this.LogDialogVisible = true;
    },
    handBatch() {
      const selection = this.$refs.tableContainer.$refs.singleTable.selection;
      if (selection.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择单据"
        })
        return
      }
      if (selection.length > 20) {
        this.$message({
          type: "warning",
          message: "最多勾选20条单据"
        })
        return
      }
      this.batch = {
        visible: true,
        list: selection
      }
    },
    exportexcel() {
      this.exportDialog = {
        visible: true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}
</style>