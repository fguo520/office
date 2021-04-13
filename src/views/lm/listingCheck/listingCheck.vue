<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard :class="['filter-container', { filterContainerWarn: listQueryContrast.listQueryChange }]">
      <el-form :inline="true" size="small" label-width="100px">
        <el-form-item label="平台:">
          <el-select v-model="listQuery.platformType" placeholder="请选择平台" clearable size="mini">
            <el-option v-for="item in typeList.platformType" :key="item.platformType" :label="item.platformName" :value="item.platformType" />
          </el-select>
        </el-form-item>

        <el-form-item label="账号:">
          <el-select v-model="listQuery.orderSourceName" placeholder="请选择平台" clearable size="mini">
            <el-option v-for="item in typeList.orderSourceName" :key="item" :label="item" :value="item" />
          </el-select>
          <!-- <ScrollSelect v-model="listQuery.orderSourceName" :list="typeList.orderSourceName" placeholder="先选平台(可多选)" /> -->
        </el-form-item>

        <el-form-item label="SKU:">
          <TextareaInput v-model="listQuery.sku" />
        </el-form-item>

        <el-form-item label="时间段:" style="position: relative">
          <el-date-picker v-model="createTimeAndEndTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" size="mini" style="width:200px">
          </el-date-picker>
        </el-form-item>

        <transition name="el-zoom-in-top">
          <div class="listQueryChangeTip" v-show="listQueryContrast.listQueryChange">
            搜索条件改变,请点击搜索按钮
          </div>
        </transition>
      </el-form>

      <template #button>
        <el-button size="mini" plain @click="resetOption()">重置</el-button>
        <el-button @click="getQuery()" :type="listQueryContrast.listQueryChange ?'warning' : 'primary'" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="sku" prop="sku" align="center"></u-table-column>
        <u-table-column label="平台" prop="platformName" align="center"></u-table-column>
        <u-table-column label="账号" prop="orderSourceName" align="center"></u-table-column>
        <u-table-column label="listing在线数量" prop="onlineNum" align="center"></u-table-column>
        <u-table-column label="listing出单数" prop="orderNum" align="center"></u-table-column>
        <u-table-column label="listing出单销售数" prop="orderSaleNum" align="center"></u-table-column>
        <u-table-column label="listing订单收入" prop="orderIncomes" align="center"></u-table-column>
        <u-table-column label="listing订单利润" prop="orderProfits" align="center"></u-table-column>
        <u-table-column label="listing转化率出单数" prop="listingRateOrderNum" align="center"></u-table-column>
      </u-table>
    </template>
  </TabelPageLayout>
</template>

<script>
import {
  getList as getListApi,
  getType,
} from "@/api/Im/listingCheck";
import {
  SkuInfoView,
  ScrollSelect,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard
} from "@/components";

const defaultListQuery = {
  platformType: "",
  orderSourceName: "",
  sku: [],
  startTime: "",
  endTime: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "listingCheck",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listQueryContrast: {
        lastListQuery: "",
        listQueryChange: false,
      },
      createTimeAndEndTime: ["", ""],
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        platformType: [],
        orderSourceName: [],
      },
    };
  },
  components: {
    SkuInfoView,
    ScrollSelect,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard
  },
  created() {
    this.getSearchType();
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
    "listQuery.platformType"(newValue, oldValue) {
      this.listQuery.orderSourceName = '';
      this.typeList.orderSourceName = [];
      const { platformType } = this.typeList;
      for (var item in platformType) {
        if (platformType[item].platformType === newValue) {
          this.typeList.orderSourceName = this.typeList.platformType[item].orderSourceName;
          return;
        }
      }
    },
    listQuery: {
      deep: true,
      handler(newValue) {
        const { lastListQuery } = this.listQueryContrast;
        const isShow = JSON.stringify(newValue).split("pageNum")[0] !== lastListQuery;
        this.listQueryContrast.listQueryChange = isShow;
      },
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getListApi(this.listQuery);
        this.list = res.data.map(item => {
          return {
            ...item,
            platformName: item.platformName || "全平台",
            orderSourceName: item.orderSourceName || "全账号",
          };
        })

        this.total = res.data.total;
        this.listQueryContrast.lastListQuery = JSON.stringify(this.listQuery).split("pageNum")[0];
        this.listQueryContrast.listQueryChange = false;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    getSearchType() {
      getType().then(res => {
        this.typeList.platformType = res.data;
      });
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.createTimeAndEndTime = ["", ""];
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  position: relative;

  /deep/ .el-form-item__label {
    width: 130px !important;
  }

  /deep/ .el-card__body {
    padding-bottom: 0;
  }

  .listQueryChangeTip {
    position: absolute;
    top: 2px;
    margin: auto;
    font-size: 12px;
    color: rgb(235, 181, 99);
    width: 100%;
    text-align: center;
  }
}
.filterContainerWarn {
  /deep/ .el-card {
    border-color: rgb(235, 181, 99);
  }
}

.u-table
  /deep/.u-table__header-wrapper
  .u-table__header
  tr
  .cell
  .caret-wrapper {
  height: 22px !important;
  .sort-caret.ascending {
    top: -2px;
  }
  .sort-caret.descending {
    bottom: -2px;
  }
}
</style>
