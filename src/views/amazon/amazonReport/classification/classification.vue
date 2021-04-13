<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="店铺:">
          <TreeSelect v-model="listQuery.platformAuthDetailId" :prop="{label:'name',value:'id'}" :list="typeList.platformAuthDetailIdList" />
        </el-form-item>
        <el-form-item label="自定义参数:">
          <el-select v-model="listQuery.paramType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.paramTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <TextareaInput v-model="listQuery.paramValue" />
        </el-form-item>
        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
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
<template #dropdown>
      <span @click="batchCopyRow('asin')">
        <el-dropdown-item>批量复制渠道ASIN</el-dropdown-item>
      </span> <span @click="batchCopyRow('fnsku')">
        <el-dropdown-item>批量复制渠道FNSKU</el-dropdown-item>
      </span>
    </template>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" />
        <u-table-column label="sku" align="center" width="120">
          <template #default="{row}">
            <div style="text-align:left;">
              <div>
                <i v-copy="row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">
                  {{ row.sku }}
                </el-link>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="ASIN & FNSKU & MSKU" align="center" width="300">
          <template #default="{row}">
            <div style="text-align:left;">
              <div><span v-copy="row.asin">{{row.asin}}</span></div>
              <div><span v-copy="row.fnsku">{{row.fnsku}}</span></div>
              <div><span v-copy="row.msku">{{row.msku}}</span></div>
            </div>
          </template>
        </u-table-column>
        
          <u-table-column label="产品信息" align="center" min-width="400">
          <template #default="{row}">
            <div style="text-align:left;">
            <el-tooltip class="item" effect="dark" :content="'站点：'" placement="left">
              <div><span v-copy="row.site">{{row.site}}</span></div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'渠道别名：'" placement="left">
              <div v-copy="row.storeNameAs">{{ row.storeNameAs }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'赛盒别名：'" placement="left">
              <div v-copy="row.shAccount">{{ row.shAccount }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'产品名称：'+row.title" placement="top">
              <div class="tooltipClass" v-copy="row.title">{{row.title}}</div>
            </el-tooltip>
            </div>
            <!-- <div><span v-copy="row.productName">{{row.productName}}</span></div> -->
          </template>
        </u-table-column>
        <u-table-column label="正常" align="center" width="200">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getSuccess" :key="index">
                <span class="successSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="异常" align="center" width="180">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getError" :key="index">
                <span class="errorSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="客户" align="center" width="160">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getCustomer" :key="index">
                <span class="spanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="意向" align="center" width="180">
          <template #default="{row}">
            <div style="text-align:left;">
              <el-tooltip class="item" effect="dark" :content="row.disposition" placement="left">
            <div  class="tooltipClass">{{ row.disposition }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="180" prop="viewDate" />
      </u-table>
    </template>

    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getLmAmazonAuthNode, getAmazonLedgerSummaryViewList } from "@/api/amazon/amazonReport"
import { TabelPageLayout, SkuInfoView, TextareaInput, ShrinkCard, TreeSelect } from "@/components";
const defalutListQuery = {
  paramType: "",
  paramValue: [],
  platformAuthDetailId: [],
  timeType: '',
  startTime: "",
  endTime: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "logisticsRefund",
  components: {
    TabelPageLayout,
    SkuInfoView,
    TextareaInput,
    ShrinkCard,
    TreeSelect
  },
  data() {
    return {
      listQuery: Object.assign({}, defalutListQuery),
      listLoading: false,
      list: [],
      total: null,
      createTimeAndEndTime: [],
      typeList: {
        platformAuthDetailIdList: [],
        timeList: [
          { label: "创建时间", value: 1 },
          { label: "时间", value: 2 },
        ],
        paramTypeList: [
           { label: "SKU", value: 1 },
          { label: "ASIN", value: 2 },
          { label: "FNSKU", value: 3 },
        ]
      },
      SkuNum: "",
      SkuDialogVisible: false,
    };
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
    getCustomer() {
      return [
        { label: '客户退货总数', key: 'customerReturns' },
        { label: '客户发货总数', key: 'customerShipments' },
      ]
    },
    getError() {
      return [
        { label: '破损总数', key: 'damaged' },
        { label: '不符合总数', key: 'discrepancy' },
        { label: '失败总数', key: 'found' },
        { label: '丢失总数', key: 'lost' },
        { label: '供应商退货总数', key: 'vendorReturns' },
        { label: '处理总数', key: 'disposed' },
      ]
    },
    getSuccess() {
      return [
        { label: '开始结余总数', key: 'startingBalance' },
        { label: '期末余额总数', key: 'endingBalance' },
        { label: '传输总数', key: 'fcTransfer' },
        { label: '传输接收、输出总数', key: 'fcTransferInOrOut' },
        { label: '收到总数', key: 'receipts' },
        { label: '其他活动总数', key: 'otherEvents' },
      ]
    }
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getAmazonLedgerSummaryViewList(this.listQuery);
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
        this.listQuery = Object.assign({}, defalutListQuery);
        this.createTimeAndEndTime = [];
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    getType() {
      getLmAmazonAuthNode().then(res => {
        this.typeList.platformAuthDetailIdList = res.data
      });
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
     batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .plTableBox .el-table .umy-table-beyond {
  white-space: normal !important;
}
.spanWidth {
  display: inline-block;
  width: 100px;
}
.successSpanWidth {
  display: inline-block;
  width: 150px;
}
.errorSpanWidth {
  display: inline-block;
  width: 120px;
}
</style>