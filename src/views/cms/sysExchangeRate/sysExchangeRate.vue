<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="货币名称:">
          <el-select v-model="listQuery.name" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-date-picker v-model="createTimeAndEndTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" size="mini" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px"></el-date-picker>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="handUpdate" :disabled="unDisabled" :loading="unDisabled" v-if="rolePermissionJudge('/cms/sysExchangeRate')">更新</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :default-sort="{ prop: 'createTime' }" :header-cell-style="{'background-color': '#dadde3'}">
        <u-table-column label="货币名称" align="center" prop="name"></u-table-column>
        <u-table-column label="结算汇率" align="center" prop="exchangeRate"></u-table-column>
        <u-table-column label="银行折算价" align="center" prop="bankConversionPri"></u-table-column>
        <u-table-column label="现汇买入价" align="center" prop="fbuyPri"></u-table-column>
        <u-table-column label="现汇卖出价" align="center" prop="fsellPri"></u-table-column>
        <u-table-column label="现钞买入价" align="center" prop="mbuyPri"></u-table-column>
        <u-table-column label="现钞卖出价" align="center" prop="msellPri"></u-table-column>
        <u-table-column label="时间" align="center" width="220">
          <template slot-scope="scope">
            <div v-show="scope.row.createTime">创建: {{ scope.row.createTime }}</div>
            <div v-show="scope.row.date&&scope.row.time">发布: {{ scope.row.date }} {{ scope.row.time }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handlejournal(scope.row)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="dialogVisible" />
  </TabelPageLayout>
</template>
<script>
import {
  juheList,
  juhegetLogList,
  juheSave,
  juhegetJuheNameList,
} from "@/api/cms/sysExchangeRate";
const defaultListQuery = {
  endTime: "",
  name: "",
  pageNum: 1,
  pageSize: 50,
  startTime: "",
};
import { LogView, TabelPageLayout, ShrinkCard } from "@/components";
export default {
  name: "sysExchangeRate",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "type", width: "120" },
          { label: "操作人", property: "username", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: juhegetLogList,
        param: {
          name: "",
          date: "",
        },
      },
      warehouseList: [],
      createTimeAndEndTime: [],
      typeList: [],
      unDisabled: false,
    };
  },
  created() {
    this.getList();
    this.getTypelist();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  components: {
    LogView,
    TabelPageLayout,
    ShrinkCard
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await juheList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getTypelist() {
      juhegetJuheNameList().then((response) => {
        this.typeList = response.data;
      });
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    resetOption() {
      this.listQuery = {
        ...this.listQuery,
        endTime: "",
        name: "",
        startTime: "",
      };
      this.createTimeAndEndTime = [];
      this.getList();
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.name = params.name;
      this.logViewParam.param.date = params.date;
      this.dialogVisible = true;
    },
    handUpdate() {
      this.unDisabled = true;
      juheSave().then((response) => {
        if (200 == response.code) {
          this.unDisabled = false;
          this.$message.success(response.message);
        }
        this.getList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>