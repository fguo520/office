<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="任务类型:">
          <el-select v-model="listQuery.sysCode" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.taskList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作人:">
          <el-select v-model="listQuery.userId" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.userList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.searchTimeType" placeholder="全部" size="mini" filterable style="width:100px">
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
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="sku" align="center" width="220">
          <template #default="{row}">
            <div style="text-align: left">
              <div>
                <i v-copy="row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">
                  {{ row.sku }}
                </el-link>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="itemID" align="center" width="150">
          <template #default="{row}">
            <div>{{ row.pid }}</div>
          </template>
        </u-table-column>
        <u-table-column label="渠道名称" align="center" width="180" prop="storeNameAs" />
        <u-table-column label="任务类型" align="center" width="150">
          <template #default="{row}">
            <div>{{typeFilter(row.sysCode) }}</div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="120">
          <template #default="{row}">
            <div>{{ statusFilter(row.status) }}</div>
          </template>
        </u-table-column>
        <u-table-column label="失败次数" align="center" width="120">
          <template #default="{row}">
            <div>{{row.failTimes}} / {{row.failMaxTimes}}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作人" align="center" width="120">
          <template #default="{row}">
            <div class="tooltipClass" v-copy="row.createUser">{{row.createUser}}</div>
          </template>
        </u-table-column>
        <u-table-column label="创建时间" align="center" width="220">
          <template #default="{row}">
            <div v-show="row.createTime">创建时间: {{row.createTime}}</div>
            <div v-show="row.updateTime">最近更新: {{row.updateTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="失败原因" align="center">
          <template #default="{row}">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="row.failDesc" placement="top">
                <div class="tooltipClass" v-copy="row.failDesc">{{row.failDesc}}</div>
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
import { list, getTaskTypes, getCreateUsers } from "@/api/rts/rtsQueue";
import { TabelPageLayout, SkuInfoView, ShrinkCard } from "@/components";
const defaultListQuery = {
  sysCode: "",
  status: "",
  userId: "",
  searchBeginTime: "",
  searchEndTime: "",
  searchTimeType: "createTime",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "rtsQueue",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        taskList: [
        ],
        statusList: [
          { label: "待执行", value: 0 },
          { label: "执行中", value: 1 },
          { label: "执行成功", value: 2 },
          { label: "执行失败", value: 3 },
        ],
        userList: [],
        timeList: [
          { label: "创建时间", value: "createTime" },
          { label: "最近更新", value: "updateTime" },
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
      this.listQuery.searchBeginTime = timeArr[0];
      this.listQuery.searchEndTime = timeArr[1];
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
        const res = await list(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.rateData = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const resCreate = await getCreateUsers()
      const resTask = await getTaskTypes()
      getCreateUsers().then((res) => {
        this.typeList.userList = res.data
      });
      Promise.all([resCreate, resTask]).then((res) => {
        this.typeList.userList = res[0].data
        this.typeList.taskList = res[1].data
      }).catch(err => { })
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