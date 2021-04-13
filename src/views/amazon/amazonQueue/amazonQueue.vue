<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="任务类型:">
          <el-select v-model="listQuery.type" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.taskList" :key="index" :label="item.parameterValue" :value="item.parameterCode" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="国家:">
          <el-select v-model="listQuery.marketplaceId" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.countryList" :key="index" :label="item.parameterName" :value="item.parameterValue" />
          </el-select>
        </el-form-item>

        <el-form-item label="刊登人:">
          <el-select v-model="listQuery.createUser" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.userList" :key="index" :label="item.nickName" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.customType" placeholder="全部" size="mini" filterable style="width:100px">
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
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="任务编号" align="center" width="130">
          <template #default="{row}">
            <div v-copy="row.taskNo">{{ row.taskNo }}</div>
          </template>
        </u-table-column>
        <u-table-column label="SKU" align="center" width="120">
          <template #default="{row}">
            <div style="text-align: left">
              <div>
                <i v-copy="row.sku" class="el-icon-document-copy" v-if="row.sku" />
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">
                  {{ row.sku }}
                </el-link>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="渠道SKU" align="center" width="150" prop="sellerSku" />
        <u-table-column label="渠道别名" align="center" width="150" prop="storeNameAs" />
        <u-table-column label="国家" align="center" width="150" prop="marketplaceIdNmae">
          <template #default="{row}">
            <div v-copy="row.marketplaceIdNmae">{{ row.marketplaceIdNmae }}</div>
          </template>
        </u-table-column>
        <u-table-column label="任务类型" align="center" width="120" prop="type">
          <template #default="{row}">
            <div v-copy="row.type">{{ row.type }}</div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="120" prop="statusName">
          <template #default="{row}">
            <div v-copy="row.statusName" :style="getStatusStyle(row.statusName)">{{ row.statusName }}</div>
          </template>
        </u-table-column>
        <u-table-column label="刊登人" align="center" width="120" prop="nickName">
          <template #default="{row}">
            <div v-copy="row.nickName">{{ row.nickName }}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template #default="{row}">
            <div v-show="row.createTime">创建: {{row.createTime}}</div>
            <div v-show="row.doneTime">完成: {{row.doneTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="错误描述" align="center">
          <template #default="{row}">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="row.errorDesc" placement="top">
                <div class="tooltipClass" v-copy="row.errorDesc">{{row.errorDesc}}</div>
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
import { page, operator, searchSysParameterCode, searchTaskTypeList } from "@/api/amazon/amazonQueue";
import { TabelPageLayout, SkuInfoView, ShrinkCard } from "@/components";
const defaultListQuery = {
  type: "",
  status: "",
  createUser: "",
  startTime: "",
  endTime: "",
  marketplaceId: '',
  customType: 1,
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "amazonQueue",
  components: {
    TabelPageLayout,
    SkuInfoView,
    ShrinkCard
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        taskList: [],
        statusList: [
          { label: "待处理", value: 0 },
          { label: "处理中", value: 1 },
          { label: "处理成功", value: 2 },
          { label: "处理失败", value: -1 },
          { label: "取消", value: -2 },
        ],
        userList: [],
        countryList: [],
        timeList: [
          { label: "创建时间", value: 1 },
          { label: "完成时间", value: 2 },
        ],
      },
      SkuNum: "",
      SkuDialogVisible: false,
      createTimeAndEndTime: [],
    };
  },
  created() {
    this.getList();
    this.getType();
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
    getStatusStyle() {
      return (value) => {
        switch (value) {
          case '处理成功':
            return { color: 'green' }
          case '处理失败':
            return { color: 'red' }
          default:
            return { color: 'gray' }
        }
      }
    }
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await page(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.rateData = [];
        this.total = 0;
      }
      this.listLoading = false;
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
    getType() {
      operator().then(res => {
        this.typeList.userList = res.data
      });
      searchSysParameterCode().then(res => {
        this.typeList.countryList = res.data
      })
      searchTaskTypeList().then(res => {
        this.typeList.taskList = res.data
      })
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>