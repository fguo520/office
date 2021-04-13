<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">

        <el-form-item label="搜索类型:">
          <el-select v-model="listQuery.batchSearchType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in batchType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <TextareaInput v-model="listQuery.batchSearchValue" />
        </el-form-item>

        <el-form-item label="时间类型:">
          <el-select v-model="listQuery.dateSearchType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="item in timeType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>

        <el-form-item label="模式:">
          <div class="buttonContainer">
            <el-button @click="conditions({ displayMode: 1 })" :type="buttonType('displayMode', 1)" size="mini">
              非变体
            </el-button>
            <el-button @click="conditions({ displayMode: 0 })" :type="buttonType('displayMode', 0)" size="mini">
              变体
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="上架人员:">
          <ScrollSelect v-model="listQuery.adminNames" :list="searchTypeList" placeholder="可多选" />
        </el-form-item>
        <el-form-item label="站点渠道:">
          <el-select v-model="listQuery.siteCode" placeholder="选择站点" size="mini" clearable class="input-width" filterable @change="handorderSouerce" style="vertical-align: top;width:100px">
            <el-option v-for="(item, index) in siteCodeList" :key="index" :label="item" :value="item" />
          </el-select>
          <ScrollSelect v-model="listQuery.orderSourceIds" :list="orderSourceList" :prop="{ label: 'orderSourceName', value: 'orderSourceId' }" placeholder="渠道,可多选" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <RadioButtonGroup v-model="listQuery.status" :ButtonTypes="states" @request="getList" />

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" row-id="random" :default-expand-all="false" :treeConfig="{lazy: getdisplayMode, load:loadTableTree }" v-if="isDisplaymode" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="系统编号" align="center" width="100" :tree-node="getdisplayMode">
          <template slot-scope="scope">
            <div>
              <div v-copy="scope.row.listingBasicId">
                {{ scope.row.listingBasicId }}
              </div>
              <div v-show="
                  Boolean(scope.row.variationStatus) &&
                  listQuery.displayMode == 0
                " style="background-color: #67c23a; color: #fff">
                变体
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.imageUrl" />
            <div :style="getColorStatus(scope.row.productState)">{{scope.row.productState}}</div>
          </template>
        </u-table-column>
        <u-table-column label="sku" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
                  {{ scope.row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'渠道sku: '+scope.row.orderSourceSku" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="scope.row.orderSourceSku">{{
                    scope.row.orderSourceSku
                  }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="ItemID" align="center" width="135">
          <template slot-scope="scope">
            <div style="text-align: left">
              <i v-copy="scope.row.itemId" class="el-icon-document-copy"></i>
              <el-link :underline="false" type="primary" :href="scope.row.productSellLink" target="_blank">
                {{ scope.row.itemId }}
              </el-link>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="类目" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="
                scope.row.allCategory
              " placement="top">
                <div>
                  <div v-if="scope.row.allCategory" class="tooltipClass">
                    {{ scope.row.allCategory }}
                  </div>
                  <div v-else class="tooltipClass">
                    {{ scope.row.primaryCategory }}
                    <span v-show="scope.row.secondaryCategory">>></span>
                    {{ scope.row.secondaryCategory }}
                  </div>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="站点" align="center" width="100">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div v-copy="scope.row.currency">{{ scope.row.currency }}</div>
              <div v-copy="scope.row.siteCode">{{ scope.row.siteCode }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" width="400">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <span v-copy="scope.row.orderSourceName">{{
                  scope.row.orderSourceName
                }}</span>
              </div>
              <el-tooltip class="item" effect="dark" :content="'产品中文名:'+scope.row.productNameCh" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productNameCh">{{
                    scope.row.productNameCh
                  }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'平台标题:'+scope.row.productTitle" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productTitle">{{
                    scope.row.productTitle
                  }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'产品标题:'+scope.row.pageTitle" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.pageTitle">{{
                    scope.row.pageTitle
                  }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="信息" align="center" width="120">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <a v-copy="scope.row.addItemAdminName">上架: </a>{{ scope.row.addItemAdminName }}
              </div>
              <div>售价: {{ scope.row.sellingPrice }}</div>
              <div>刊登费: {{ scope.row.addItemFee }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div v-show="scope.row.onSelfTime">上架: {{ scope.row.onSelfTime }}</div>
            <div v-show="scope.row.soldOutTime">下架: {{ scope.row.soldOutTime }}</div>
            <div v-show="scope.row.firstOrderTime">首次: {{ scope.row.firstOrderTime }}</div>
            <div v-show="scope.row.lastOrderTime">最近: {{ scope.row.lastOrderTime }}</div>
            <div v-show="scope.row.createTime">数据: {{ scope.row.createTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handlejournal(scope.row.id)">
              日志
            </el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
  </TabelPageLayout>
</template>

<script>
import {
  getList as getListAPI,
  getLoglist,
  infoByItemID,
  getListingStatus,
  getListingData,
  eBayShelfPersonList,
  showVariation,
  dateSearchType,
  eBaysiteCodeList,
  orderSourceBySiteCode,
} from "@/api/pms/productEbay";
import {
  SkuInfoView,
  LogView,
  RadioButtonGroup,
  ScrollSelect,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard
} from "@/components";
const defalutListQuery = {
  adminNames: [],
  pageNum: 1,
  pageSize: 50,
  batchSearchValue: [],
  dateSearchBeginTime: "",
  dateSearchEndTime: "",
  status: 1,
  dateSearchType: "",
  batchSearchType: "sku",
  displayMode: 1,
  orderSourceIds: [],
  siteCode: "",
};
export default {
  name: "productEbay",
  data() {
    return {
      listQuery: Object.assign({}, defalutListQuery),
      searchTypeList: [],
      createTimeAndEndTime: [],
      states: [
        {
          label: "草稿",
          value: 0,
        },
        {
          label: "在线",
          value: 1,
        },
        {
          label: "刊登中",
          value: 2,
        },
        {
          label: "刊登失败",
          value: 3,
        },
        {
          label: "已下架",
          value: -1,
        },
      ],
      listLoading: false,
      list: [],
      total: null,
      SkuNum: "",
      SkuDialogVisible: false,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "createPerson", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getLoglist,
        param: {
          id: "",
        },
      },
      timeType: [
        { label: "上架时间", value: "on_self_time" },
        { label: "下架时间", value: "sold_out_time" },
        { label: "数据时间", value: "create_time" },
      ],
      batchType: [
        { label: "系统SKU", value: "sku" },
        { label: "渠道SKU", value: "order_source_sku" },
        { label: "itemid", value: "item_id" },
        { label: "系统编号", value: "listing_basic_id" },
      ],
      isDisplaymode: true,
      siteCodeList: [],
      orderSourceList: [],
    };
  },
  created() {
    this.getList();
    this.getSearchType();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  components: {
    SkuInfoView,
    LogView,
    RadioButtonGroup,
    ScrollSelect,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.dateSearchBeginTime = timeArr[0];
      this.listQuery.dateSearchEndTime = timeArr[1];
    },
  },
  computed: {
    getColorStatus() {
      return function (type) {
        switch (type) {
          case "正常":
            return {
              backgroundColor: "#16c067", color: "#fff", textAlign: "center"
            };
          case "起批量":
            return {
              backgroundColor: "#00b0f5", color: "#fff", textAlign: "center"
            };
          case "暂时缺货":
            return {
              backgroundColor: "#d4c80a", color: "#fff", textAlign: "center"
            };
          case "停产":
            return {
              backgroundColor: "#e0514d", color: "#fff", textAlign: "center"
            };
          case "锁定":
            return {
              backgroundColor: "#a3a3a3", color: "#fff", textAlign: "center"
            };
          case "清库":
            return {
              backgroundColor: "#fb9320", color: "#fff", textAlign: "center"
            };
          default:
            return {
              backgroundColor: "#e0514d", color: "#fff", textAlign: "center"
            }
        }
      }
    },
    buttonType() {
      const { listQuery } = this;
      return function (key, value) {
        if (listQuery[key] === "") return "";
        return listQuery[key] === value ? "primary" : "";
      };
    },
    getdisplayMode() {
      switch (this.listQuery.displayMode) {
        case 0:
          return true;
        case 1:
          return false;
      }
    },
  },
  filters: {
    addWayFilter(value) {
      switch (value) {
        case 1:
          return "单个添加";
        case 2:
          return "批量添加";
        case 3:
          return "复制产品";
      }
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getListAPI(this.listQuery);
        res.data.list.forEach((item) => {
          item.hasChildren = Boolean(item.variationStatus);
          item.random = Math.floor(Math.random() * 1000000);
        });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getSearchType() {
      eBayShelfPersonList({ adminName: "" }).then((res) => {
        this.searchTypeList = res.data;
      });
      eBaysiteCodeList().then((response) => {
        this.siteCodeList = response.data;
      });
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.isDisplaymode = false;
      this.$nextTick(() => {
        this.isDisplaymode = true;
        this.getList();
      });
    },
    resetOption() {
      this.listQuery = Object.assign({}, defalutListQuery);
      this.createTimeAndEndTime = [];
      this.getList();
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    //根据站点查询渠道
    handorderSouerce() {
      orderSourceBySiteCode({ siteCode: this.listQuery.siteCode }).then(
        (res) => {
          this.orderSourceList = res.data;
        }
      );
    },
    //日志
    handlejournal(params) {
      console.log(params);
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    //变体
    loadTableTree(tree, resolve) {
      showVariation({ listingBasicId: tree.listingBasicId }).then(
        (response) => {
          response.data.list.forEach((item) => {
            item.random = Math.floor(Math.random() * 1000000);
            item.variationStatus = 0;
            item.listingBasicId = "";
          });
          resolve(response.data.list);
        }
      );
    },
    conditions(obj) {
      this.isDisplaymode = false;
      this.listQuery.pageNum = 1;
      if (obj instanceof Object) {
        // 已选中在点击取消取消
        if (this.listQuery[Object.keys(obj)[0]] === Object.values(obj)[0]) {
          if (obj.displayMode == 0) {
            this.listQuery[Object.keys(obj)[0]] = 1;
          } else {
            this.listQuery[Object.keys(obj)[0]] = 0;
          }
        } else {
          this.listQuery = Object.assign(this.listQuery, obj);
        }
        this.$nextTick(() => {
          this.isDisplaymode = true;
          this.getList();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

