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
        <u-table-column label="ASIN & FNSKU" align="center" width="160">
          <template #default="{row}">
            <div style="text-align:left;">
              <div><span v-copy="row.asin">{{row.asin}}</span></div>
              <div><span v-copy="row.fnsku">{{row.fnsku}}</span></div>
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
            <el-tooltip class="item" effect="dark" :content="'产品名称：'+row.productName" placement="top">
              <div class="tooltipClass" v-copy="row.productName">{{row.productName}}</div>
            </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="属性" align="center" width="230">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getAttrs" :key="index">
                <span class="attrsSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="基本信息" align="center" width="240">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getBasicInfo" :key="index">
                <span class="infoSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="数量" align="center" width="180">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getCustomer" :key="index">
                <span class="spanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="金额" align="center" width="260">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getAmountRate" :key="index">
                <span class="amountRateSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="创建时间" align="center" width="180" prop="cerateTime" />
      </u-table>
    </template>

    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getLmAmazonAuthNode, queryFbaStorageFeeChargesPage } from "@/api/amazon/amazonReport"
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
  name: "logisticsWarehousing",
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
          { label: "时间", value: 2},
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
        { label: '在线平均数量', key: 'averageQuantityOnHand' },
        { label: '待删除平均数量', key: 'averageQuantityPendingRemoval' },
      ]
    },
    getBasicInfo() {
      return [
        { label: '类别名称', key: 'category' },
        { label: '危险品仓储类型', key: 'dangerousGoodsStorageType' },
        { label: '是否有资格获得存货折扣', key: 'eligibleForInventoryDiscount' },
        { label: '中间端', key: 'medianSide' },
        { label: '是否符合库存折扣', key: 'qualifiesForInventoryDiscount' },
        { label: '执行中心', key: 'fulfillmentCenter' },
        { label: '储存率', key: 'storageRate' },
      ]
    },
    getAttrs() {
      return [
        { label: '重量', key: 'weight' },
        { label: '重量单位', key: 'weightUnits' },
        { label: '物品体积', key: 'itemVolume' },
        { label: '预估总体积', key: 'estimatedTotalItemVolume' },
        { label: '体积单位', key: 'volumeUnits' },
        { label: '最长边', key: 'longestSide' },
        { label: '最短边', key: 'shortestSide' },
        { label: '尺寸', key: 'productSizeTier' },
        { label: '测量单位', key: 'measurementUnits' },
      ]
    },
    getAmountRate() {
      return [
        { label: '币种', key: 'currency' },
        { label: '细目奖励费金额', key: 'breakdownIncentiveFeeAmount' },
        { label: '预估每月存储费用', key: 'estimatedMonthlyStorageFee' },
        { label: '奖励总金额', key: 'totalIncentiveFeeAmount' },
        { label: '收费月份', key: 'monthOfCharge' },
      ]
    }
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await queryFbaStorageFeeChargesPage(this.listQuery);
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
  width: 115px;
}
.attrsSpanWidth {
  display: inline-block;
  width: 100px;
}
.infoSpanWidth {
  display: inline-block;
  width: 170px;
}
.amountRateSpanWidth {
  display: inline-block;
  width: 130px;
}
</style>