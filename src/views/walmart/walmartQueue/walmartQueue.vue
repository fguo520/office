<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="任务类型:">
          <el-select v-model="listQuery.type" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.taskList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="刊登人:">
          <el-select v-model="listQuery.adminId" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.userList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.customType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="sku" align="center" width="220">
          <template #default="{row}">
            <div style="text-align: left">
              <i v-copy="row.sku" class="el-icon-document-copy"></i>
              <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">
                {{ row.sku }}
              </el-link>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="upc" align="center" width="130">
          <template #default="{row}">
            <div><span v-copy="row.upc">{{row.upc}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="任务类型" align="center">
          <template #default="{row}">
            <div class="tooltipClass">{{ typeFilter(row.type) }}</div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="120">
          <template #default="{row}">
            <div>{{ statusFilter(row.status) }}</div>
          </template>
        </u-table-column>
        <u-table-column label="渠道名称" align="center" width="120">
          <template #default="{row}">
            <div><span v-copy="row.storeNameAs">{{row.storeNameAs}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="失败次数" align="center" width="120">
          <template #default="{row}">
            <div>{{row.failCount}} / {{row.maxFailCount}} </div>
          </template>
        </u-table-column>
        <u-table-column label="操作人" align="center" width="120">
          <template #default="{row}">
            <div><span v-copy="row.nickName">{{row.nickName}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="230">
          <template #default="{row}">
            <div style="text-align: left">
              <div v-show="row.createTime">创建时间: {{row.createTime}}</div>
              <div v-show="row.updateTime">最近更新: {{row.updateTime}}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="失败原因" align="center">
          <template #default="{row}">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="row.errorDec" placement="top">
                <div class="tooltipClass" v-copy="row.errorDec">{{row.errorDec}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getWalmartTaskList, getUmsAdminList } from "@/api/walmart/walmartQueue";
import { TabelPageLayout, SkuInfoView, ShrinkCard } from "@/components";
const defaultListQuery = {
  type: "",
  status: "",
  adminId: "",
  startTime: "",
  endTime: "",
  customType: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "walmartQueue",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        taskList: [
          { label: "下架(删除)", value: '10383' },
          { label: "上架", value: '10382' },
          { label: "刊登", value: '10381' },
          { label: "更新价格", value: '10398' },
          { label: "更新listing管理报告", value: '10385' },
          { label: "更新数量", value: '10384' },
          { label: "更新listing", value: '10400' },
          { label: "批量修改备货期", value: '10402' },
        ],
        statusList: [
          { label: "待执行", value: 0 },
          { label: "执行中", value: 1 },
          { label: "执行成功", value: 2 },
          { label: "执行失败", value: 3 },
        ],
        userList: [],
        timeList: [
          { label: "创建时间", value: 1 },
          { label: "最近更新", value: 2 },
        ],
      },
      SkuNum: "",
      SkuDialogVisible: false,
      createTimeAndEndTime: [],
    };
  },
  components: {
    TabelPageLayout,
    SkuInfoView,
    ShrinkCard
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
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
  computed: {
    statusFilter() {
      return function (value) {
        const filterResult = this.typeList.statusList.find(item => item.value === value) || { label: "未知状态" };
        return filterResult.label
      }
    },
    typeFilter() {
      return function (value) {
        const filterResult = this.typeList.taskList.find(item => item.value === value) || { label: "未知类型" }
        return filterResult.label
      }
    }
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getWalmartTaskList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.rateData = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getType() {
      getUmsAdminList().then((res) => {
        this.typeList.userList = res.data.map(item => ({ label: item.fullName, value: item.id }));
      });
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = [];
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>