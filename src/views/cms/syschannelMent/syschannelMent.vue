<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="渠道类型:">
          <el-select v-model="listQuery.orderSourceType" clearable placeholder="请选择" size="mini" filterable>
            <el-option v-for="item in typeList" :key="item.parameterCode" :label="item.parameterName" :value="item.parameterValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道搜索:">
          <TreeSelect v-model="listQuery.orderSourceIds" :prop="{label:'orderSourceName',value:'orderSourceId'}" :list="orderSourceidList" />
        </el-form-item>
        <el-form-item label="销售:">
          <el-select v-model="listQuery.saleAdminName" clearable placeholder="请选择" size="mini" filterable>
            <el-option v-for="(item, index) in saleadminnameList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="客服:">
          <el-select v-model="listQuery.serviceAdminName" clearable placeholder="请选择" size="mini" filterable>
            <el-option v-for="(item, index) in serviceadminnameList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="handUpdate()" :disabled="unDisabled" :loading="unDisabled" v-if="rolePermissionJudge('/cms/syschannelMent')">更新</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <!-- <u-table-column
          label="编号"
          type="index"
          align="center"
          width="50"
        ></u-table-column> -->
        <u-table-column label="渠道名称" align="center">
          <template #default="{ row }">
            <div v-copy="row.ordersourcename">{{ row.ordersourcename }}</div>
          </template>
        </u-table-column>
        <u-table-column label="渠道类型" align="center"><template #default="{ row }">
            <div v-copy="row.ordersourcetype">{{ row.ordersourcetype }}</div>
          </template></u-table-column>

        <u-table-column label="国家" align="center">
          <template #default="{ row }">
            <div v-copy="row.countryCn">{{ row.countryCn }}</div>
          </template>
        </u-table-column>
        <u-table-column label="销售负责人" align="center">
          <template #default="{ row }">
            <div v-copy="row.saleadminname">{{ row.saleadminname }}</div>
          </template>
        </u-table-column>
        <u-table-column label="客服" align="center">
          <template #default="{ row }">
            <div v-copy="row.serviceadminname">{{ row.serviceadminname }}</div>
          </template>
        </u-table-column>
        <u-table-column label="最近一次更新时间" prop="lastoperationtime" align="center"></u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="dialogVisible" />
  </TabelPageLayout>
</template>

<script>
import {
  orderSourceList,
  sysBaseList,
  orderSourcemanualUpdate,
  getOrderSourceLogList,
  getSearchType,
  getOrderSourceTree
} from "@/api/cms/syschannelMent";

import { LogView, TabelPageLayout, ScrollSelect, ShrinkCard, TreeSelect } from "@/components";
const defalutListQuery = {
  pageNum: 1,
  pageSize: 50,
  orderSourceType: "",
  saleAdminName: "",
  serviceAdminName: "",
  orderSourceIds: [],
}
export default {
  name: "syschannelMent",
  data() {
    return {
      list: [],
      total: null,
      listLoading: true,
      listQuery: Object.assign({}, defalutListQuery),
      typeList: [],
      dialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "createPerson", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getOrderSourceLogList,
        param: {
          id: "",
        },
      },
      saleadminnameList: [],
      serviceadminnameList: [],
      unDisabled: false,
      orderSourceidList: [],
    };
  },
  created() {
    this.getList();
    this.getTypelist();
    this.getsaleadminnameList();
    this.getserviceadminnameList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  components: {
    LogView,
    TabelPageLayout,
    ScrollSelect,
    ShrinkCard,
    TreeSelect
  },
  watch: {
    $route(route) {
      this.getList();
      this.getTypelist();
      this.getsaleadminnameList();
      this.getserviceadminnameList();
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        if (this.listQuery.orderSourceIds == '') { this.listQuery.orderSourceIds = [] }
        const res = await orderSourceList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getTypelist() {
      sysBaseList({
        isTopClass: false,
        pageNum: 1,
        pageSize: 9999,
        parameterSearchType: "赛盒来源渠道类型",
      }).then((response) => {
        this.typeList = response.data.list;
      });
      getOrderSourceTree({}).then((response) => {
        this.orderSourceidList = response.data;
      });
    },
    getsaleadminnameList() {
      getSearchType({ keyword: "SaleadminName" }).then((response) => {
        this.saleadminnameList = response.data.list;
      });
    },
    getserviceadminnameList() {
      getSearchType({ keyword: "ServiceadminName" }).then((response) => {
        this.serviceadminnameList = response.data.list;
      });
    },
    resetOption() {
      this.listQuery = Object.assign({}, defalutListQuery);
      this.getList();
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    //更新
    handUpdate() {
      this.unDisabled = true;
      orderSourcemanualUpdate().then((response) => {
        if (200 == response.code) {
          this.unDisabled = false;
          this.$message.success(response.message);
        }
        this.getList();
      });
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>