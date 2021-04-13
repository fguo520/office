<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="自定义参数:">
          <el-select v-model="listQuery.paramType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in paramTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <TextareaInput v-model="listQuery.paramValue" />
        </el-form-item>

        <el-form-item label="任务类型:">
          <el-select v-model="listQuery.type" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList" :key="index" :label="item.parameterValue" :value="item.parameterCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="刊登人:">
          <el-select v-model="listQuery.createUser" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in createUserList" :key="index" :label="item.fullName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.customType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px"></el-date-picker>
        </el-form-item>

      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <template #dropdown>
      <span @click="batchCopyRow('skuId')">
        <el-dropdown-item>批量复制skuID</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('itemId')">
        <el-dropdown-item>批量复制ItemID</el-dropdown-item>
      </span>
    </template>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">

        <u-table-column type="selection" width="50" />

        <u-table-column label="sku" align="center" width="120">
          <template #default="{row}">
            <div style="text-align: left">
              <p>
                <i v-copy="row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">
                  {{ row.sku }}
                </el-link>
              </p>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="skuID" align="center" width="120">
          <template #default="{row}">
            <div><span v-copy="row.skuId">{{row.skuId}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="itemID" align="center" width="120">
          <template #default="{row}">
            <div><span v-copy="row.itemId">{{row.itemId}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="渠道别名" align="center">
          <template #default="{row}">
            <div>
              <el-tooltip class="item" effect="dark" :content="row.storeName" placement="top">
                <div class="tooltipClass">{{row.storeName}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="任务类型" align="center" width="150">
          <template #default="{row}">
            <div>{{row.type}}</div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="120">
          <template #default="{row}">
            <div>{{row.statusStr}}</div>
          </template>
        </u-table-column>
        <u-table-column label="失败次数" align="center" width="100">
          <template #default="{row}">
            <div>{{row.failCount}} / {{row.maxFailCount}}</div>
          </template>
        </u-table-column>
        <u-table-column label="刊登人" align="center" width="100">
          <template #default="{row}">
            <div><span v-copy="row.username">{{row.username}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="创建时间" align="center" width="230">
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
import {
  getLazadaProductTaskList,
  getLazadaProductTaskTypeList,
} from "@/api/lazada/lzdQueue";
import { getUmsAdminList } from "@/api/lazada/lzdPublish";
import { TabelPageLayout, SkuInfoView, TextareaInput, ShrinkCard } from "@/components";
const defalutListQuery = {
  pageNum: 1,
  pageSize: 50,
  type: "",
  createUser: "",
  status: null,
  startTime: "",
  endTime: "",
  customType: null,
  paramType: "",
  paramValue: [],
  sku: [],
  itemId: [],
  skuId: []
};
export default {
  name: "lzdQueue",
  data() {
    return {
      listQuery: Object.assign({}, defalutListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: [],
      SkuNum: "",
      SkuDialogVisible: false,
      status: [
        { label: "待执行", value: 0 },
        { label: "执行中", value: 1 },
        { label: "执行成功", value: 2 },
        { label: "执行失败", value: 3 },
      ],
      timeList: [
        { label: "创建时间", value: 1 },
        { label: "最近更新", value: 2 },
      ],
      createTimeAndEndTime: [],
      createUserList: [],
      paramTypeList: [
        { label: "sku", value: 1 },
        { label: "skuId", value: 2 },
        { label: "itemId", value: 3 },
      ]
    };
  },
  components: {
    TabelPageLayout,
    SkuInfoView,
    TextareaInput,
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
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getLazadaProductTaskList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.rateData = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getType() {
      getLazadaProductTaskTypeList().then((res) => {
        this.typeList = res.data;
      });
      getUmsAdminList().then((res) => {
        this.createUserList = res.data;
      });
    },
    batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    resetOption() {
      this.listQuery = Object.assign({}, defalutListQuery);
      this.createTimeAndEndTime = [];
      this.getList();
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
</style>