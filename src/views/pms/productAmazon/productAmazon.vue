<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="搜索类型:">
          <el-select v-model="listQuery.batchSearchType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in batchType" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <TextareaInput v-model="listQuery.batchSearchValue" />
        </el-form-item>
        <el-form-item label="时间类型:">
          <el-select v-model="listQuery.dateSearchType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="item in timeType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
        <el-form-item label="模式:">
          <div class="buttonContainer">
            <el-button @click="conditions({ displayMode: 0 })" :type="buttonType('displayMode', 0)" size="mini">非变体</el-button>
            <el-button @click="conditions({ displayMode: 1 })" :type="buttonType('displayMode', 1)" size="mini">变体</el-button>
          </div>
        </el-form-item>
        <el-form-item label="FBA:">
          <div class="buttonContainer">
            <el-button @click="conditions({ isFba: 0 })" :type="buttonType('isFba', 0)" size="mini">否</el-button>
            <el-button @click="conditions({ isFba: 1 })" :type="buttonType('isFba', 1)" size="mini">是</el-button>
          </div>
        </el-form-item>
        <el-form-item label="上架人员:">
          <ScrollSelect v-model="listQuery.shelvesPersons" :list="searchTypeList" placeholder="可多选" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <RadioButtonGroup v-model="listQuery.status" :ButtonTypes="states" @request="getList" />
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" row-id="random" :default-expand-all="false" :treeConfig="{lazy: getdisplayMode, load:loadTableTree }" v-if="isDisplaymode">
        <u-table-column type="selection" width="50" />
        <u-table-column label="系统编号" align="center" width="100" :tree-node="getdisplayMode">
          <template #default="{ row }">
            <div>
              <div v-copy="row.orderSourceSkuId" v-show="row.orderSourceSkuId != 0">
                {{ row.orderSourceSkuId }}
              </div>
              <div v-show="
                  Boolean(row.variationStatus == 1) &&
                  listQuery.displayMode == 1
                " style="background-color: #67c23a; color: #fff">
                变体
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template #default="{ row }">
            <img slot="reference" :src="row.smallImageUrl" />
            <div :style="getColorStatus(row.productStateCn)">{{row.productStateCn}}</div>
          </template>
        </u-table-column>
        <u-table-column label="sku" property="sku" align="center" width="150">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>
                <i v-copy="row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">{{ row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'渠道sku: '+row.orderSourceSku" placement="right-start" v-show="row.orderSourceSku">
                <div class="tooltipClass">
                  <span v-copy="row.orderSourceSku"></span>{{ row.orderSourceSku }}
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'自定义sku: '+row.clientSku" placement="right-start" v-show="row.clientSku">
                <div v-show="row.clientSku">
                  <span v-copy="row.clientSku"></span>{{ row.clientSku }}
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'FNsku: '+row.fnsku" placement="right-start" v-show="row.fnsku">
                <div class="tooltipClass">
                  <span v-copy="row.fnsku"></span>{{ row.fnsku }}
                </div>
              </el-tooltip>

              <div v-if="row.isFba">
                <B>FBA</B>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="ASIN" align="center" width="120">
          <template #default="{ row }">
            <el-tooltip class="item" effect="dark" :content="row.asin" placement="top">
              <div class="tooltipClass">
                <el-link :underline="false" type="primary" :href="row.productSellLink" target="_blank">{{ row.asin }}
                </el-link>
              </div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="分类" align="center" width="200">
          <template #default="{ row }">
            <div style="text-align: left">
              <div v-copy="row.allCategory">
                {{ row.allCategory }}
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" width="500">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>
                <span v-copy="row.orderSourceName">{{
                  row.orderSourceName
                }}</span>
              </div>
              <el-tooltip class="item" effect="dark" :content="'产品中文名:'+row.productNameCn" placement="top">
                <div class="tooltipClass">
                  <span v-copy="row.productNameCn">{{
                    row.productNameCn
                  }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'平台标题:'+row.title" placement="top">
                <div class="tooltipClass">
                  <span v-copy="row.title">{{ row.title }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'产品标题:'+row.pageTitle" placement="top">
                <div class="tooltipClass">
                  <span v-copy="row.pageTitle">{{ row.pageTitle }}</span>
                </div>
              </el-tooltip>
              <div>
                {{ row.stockingWareHouse }}
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="120">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>{{ row.replenishmentStatusCn }}</div>
              <div>{{ row.sellerTypeCn }}</div>
              <div>{{ row.productPropertyCn }}</div>
              <div>{{ row.isFbaCn }}</div>
              <div>{{ row.isActiveCn }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="详情" width="100" align="center">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>
                <span v-copy="row.shelvesPerson">上架: </span>{{ row.shelvesPerson }}
              </div>
              <div>
                <span v-copy="row.salesPerson">销售: </span>{{ row.salesPerson }}
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template #default="{ row }">
            <div v-show="row.updateTime">更新: {{ row.updateTime }}</div>
            <div v-show="row.shelvesTime">上架: {{ row.shelvesTime }}</div>
            <div v-show="row.shelvesTime">最近: {{ row.shelvesTime }}</div>
            <div v-show="row.firstOrderTime">首次: {{ row.firstOrderTime }}</div>
            <div v-show="row.lastOrderTime">最近: {{ row.lastOrderTime }}</div>
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
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import {
  SkuInfoView,
  LogView,
  RadioButtonGroup,
  ScrollSelect,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard
} from "@/components";
import {
  getList,
  getLoglist,
  getListingStatus,
  showVariation,
  getListingData,
} from "@/api/pms/productAmazon";
const defalutListQuery = {
  pageNum: 1,
  pageSize: 50,
  batchSearchType: "sku",
  batchSearchValue: [],
  dateSearchBeginTime: "",
  dateSearchEndTime: "",
  dateSearchType: "",
  status: 0,
  displayMode: 0,
  shelvesPersons: [],
  isFba: null,
};
export default {
  name: "productAmazon",
  data() {
    return {
      listQuery: Object.assign({}, defalutListQuery),
      list: [],
      total: null,
      listLoading: false,
      timeType: [
        { label: "更新时间", value: "updateTime" },
        { label: "上架时间", value: "shelvesTime" },
      ],
      batchType: [
        { label: "系统SKU", value: "sku" },
        { label: "渠道SKU", value: "orderSourceSku" },
        { label: "自定义SKU", value: "clientSku" },
        { label: "ASIN", value: "asin" },
        { label: "FNSKU", value: "fnsku" },
      ],
      createTimeAndEndTime: [],
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
      states: [],
      SkuNum: "",
      SkuDialogVisible: false,
      isDisplaymode: true,
      searchTypeList: [],
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
          return false;
        case 1:
          return true;
      }
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getList(this.listQuery);
        res.data.list.forEach((item) => {
          (item.hasChildren = Boolean(item.variationStatus == 1)),
            (item.random = Math.floor(Math.random() * 100000000));
        });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getType() {
      getListingStatus({ keyword: "status" }).then((res) => {
        this.states = res.data;
      });
      getListingData({ keyword: "shelves_person" }).then((res) => {
        this.searchTypeList = res.data;
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
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    //变体
    loadTableTree(tree, resolve) {
      showVariation({
        listingId: tree.listingId,
        parentId: tree.parentId,
      }).then((res) => {
        res.data.list.forEach((item) => {
          (item.random = Math.floor(Math.random() * 100000000)),
            (item.variationStatus = 0),
            (item.orderSourceSkuId = "");
        });
        resolve(res.data.list);
      });
    },
    conditions(obj) {
      this.isDisplaymode = false;
      this.listQuery.pageNum = 1;
      if (obj instanceof Object) {
        // 已选中在点击取消取消
        if (this.listQuery[Object.keys(obj)[0]] === Object.values(obj)[0]) {
          if (obj.displayMode == 0 || obj.isFba == 0) {
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
<style  lang="scss" scoped>
.table-cell-state {
  text-align: left;
  .tcs-div {
    width: 33%;
    float: left;
  }
}
</style>