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
        <u-table-column label="sku" align="center" width="170">
          <template #default="{row}">
            <div style="text-align: left">
              <div><i v-copy="row.sku" class="el-icon-document-copy"></i>{{ row.sku }}</div>
              <el-tooltip class="item" effect="dark" :content="'渠道sku:'+row.sellerSku" placement="right-start">
                <div class="tooltipClass">
                  <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sellerSku)">
                    {{ row.sellerSku }}
                  </el-link>
                </div>
              </el-tooltip>
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
        <u-table-column label="价格 && 币种" align="center" width="200">
          <template #default="{row}">
            <div style="text-align:left;">
              <div>币种：{{ row.currency }}</div>
              <div>当前价格：{{ row.yourPrice }}</div>
              <div>最低价：{{ row.lowestPriceNew }}</div>
              <div>历史最低价：{{ row.lowestPriceUsed }}</div>
            </div>
          </template>
        </u-table-column>
         <u-table-column label="产品信息" align="center" min-width="400">
          <template #default="{row}">
            <div style="text-align:left;">
            <el-tooltip class="item" effect="dark" :content="'渠道别名：'" placement="left">
              <div v-copy="row.storeNameAs">{{ row.storeNameAs }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'赛盒别名：'" placement="left">
              <div v-copy="row.shAccount">{{ row.shAccount }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'产品名称：'+row.productName" placement="top">
              <div class="tooltipClass" v-copy="row.productName">{{row.productName}}</div>
            </el-tooltip>
            </div>
            <!-- <div><span v-copy="row.productName">{{row.productName}}</span></div> -->
          </template>
        </u-table-column>
         <u-table-column label="站点 & 状态" align="center" width="100">
          <template #default="{row}">
            <div><span v-copy="row.site">{{row.site}}</span></div>
            <div>{{ row.conditionListing }}</div>
          </template>
        </u-table-column>
        <u-table-column label="基本信息" align="center" width="180">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getBasicInfo" :key="index">
                <span class="infoSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="推荐建议" align="center" width="270">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getAdvice" :key="index">
                <span class="adviceSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="销售数量" align="center" width="150">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getSalesNum" :key="index">
                <span class="salesSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="库龄" align="center" width="150">
          <template #default="{row}">
            <div style="text-align:left;">
              <div v-for="(item, index) in getInventoryAge" :key="index">
                <span class="ageSpanWidth">{{ item.label }}：</span>
                <span v-copy="row[item.key]">{{ row[item.key] }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template #default="{row}">
            <div style="text-align:left;">
              <div><span v-show="row.createTime">创建：</span>{{ row.createTime }}</div>
              <div><span v-show="row.snapshotDate">退款：</span>{{ row.snapshotDate }}</div>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getLmAmazonAuthNode, getLmAmazonInventoryAgeList } from "@/api/amazon/amazonReport"
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
  name: "inventoryAge",
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
    getSalesNum() {
      return [
        { label: '7天销售数量', key: 'unitsShippedLast7days' },
        { label: '30天销售数量', key: 'unitsShippedLast30days' },
        { label: '60天销售数量', key: 'unitsShippedLast60days' },
        { label: '90天销售数量', key: 'unitsShippedLast9days' },
        { label: '可售数量', key: 'avaliableQuantity' },
      ]
    },
    getInventoryAge() {
      return [
        { label: '0-90天', key: 'inv0to90Days' },
        { label: '91-180天', key: 'inv90to180Days' },
        { label: '181-270天', key: 'inv181to217Days' },
        { label: '217-365天', key: 'inv281to365Days' },
        { label: '大于365天', key: 'inv365PlusDays' },
      ]
    },
    getAdvice() {
      return [
        { label: '建议优化措施', key: 'recommendedAction' },
        { label: '推荐移除数量', key: 'recommendedRemovalQuantity' },
        { label: '推荐销售持续时间(天)', key: 'recommendedSaleDurationDays' },
        { label: '推荐售价', key: 'recommendedSalesPrice' },
        { label: '售价', key: 'salesPrice' },
        { label: '售出率', key: 'sellThrough' },
        { label: '移除中数量', key: 'qtyWithRemovalsInProgress' },
        { label: '推荐的优化措施节省成本', key: 'estimatedCostSavingsOfRecommendedActions' },
        { label: '健康库存水平', key: 'healthyInventoryLevel' },
      ]
    },
    getBasicInfo() {
      return [
        { label: "产品体积", key: 'itemVolume' },
        { label: "体积单位", key: 'volumeUnits' },
        { label: "储存形式", key: 'storageType' },
        { label: "提示", key: 'alert' },
      ]
    }
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getLmAmazonInventoryAgeList(this.listQuery);
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
.salesSpanWidth {
  display: inline-block;
  width: 100px;
}
.ageSpanWidth {
  display: inline-block;
  width: 80px;
}
.adviceSpanWidth {
  display: inline-block;
  width: 150px;
}
.infoSpanWidth {
  display: inline-block;
  width: 70px;
}
</style>