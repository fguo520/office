<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-form :inline="true" size="mini" label-width="100px" class="operateFrom">
        <el-form-item v-for="item in queryOptions" :key="item.label" :label="item.label">
          <el-select v-model="listQuery[item.query]" placeholder="请选择" clearable class="input-width" filterable size="mini" :disabled="item.disabled">
            <el-option v-for="(optionItem, index) in item.list" :key="index" :label="optionItem.label" :value="optionItem.value">
              <span style="float: left">{{ optionItem.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                optionItem.value
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="buttonGroup">
        <div>
          <el-button v-for="item in selectDayButton" :key="item.value" @click="conditions(item.value)" :type="buttonType(item.value)" plain size="mini">
            {{ item.label }}
          </el-button>
        </div>

        <div>
          <el-button @click="getList()" style="float: right" type="primary" size="mini">
            查询搜索
          </el-button>
          <el-button @click="resetOption()" style="float: right; margin-right: 15px" size="mini">
            重置
          </el-button>
        </div>
      </div>
    </el-card>
    <div class="content-container">
      <div class="contentTitle">
        结算时间：2020-09-07 - 2020-10-07 （最近 {{ listQuery.selectDay }} 天）
      </div>

      <el-row :gutter="12">
        <el-col v-for="item in contentCardList" :key="item.label" :xs="{ span: 12 }" :sm="{ span: 8 }" :lg="{ span: 3 }">
          <div class="contentCard">
            <el-card shadow="hover">
              <p>{{ item.label }}</p>
              <p>
                <count-to :start-val="0" :end-val="item.value" :duration="item.unit === '$' ? 1500 : 600" :class="[
                    'card-panel-num',
                    item.sequential > 0
                      ? 'card-panel-num-green'
                      : 'card-panel-num-red',
                  ]" />{{ item.unit }}
              </p>
              <p>
                环比 {{ item.sequential }}
                <svg-icon class="rising" iconClass="rising" style="fill: green" v-if="item.sequential > 0"></svg-icon>
                <svg-icon class="falling" iconClass="falling" style="fill: red" v-else></svg-icon>
              </p>
            </el-card>
          </div>
        </el-col>
      </el-row>

      <el-row class="chartContent" :gutter="12">
        <el-col :xs="{ span: 24 }" :lg="{ span: 8 }">
          <el-card>
            <p>各平台销售额占比</p>
            <ve-pie :data="chartData.sales" :settings="{ radius: 100, offsetY: 170 }" height="300px" :width-change-delay="10"></ve-pie>
          </el-card>
        </el-col>
        <el-col :xs="{ span: 24 }" :lg="{ span: 8 }">
          <el-card>
            <p>各平台订单数数据</p>
            <ve-ring :data="chartData.orders" :settings="{
                roseType: 'radius',
                radius: [30, 100],
                offsetY: 170,
              }" height="300px"></ve-ring>
          </el-card>
        </el-col>
        <el-col :xs="{ span: 24 }" :lg="{ span: 8 }">
          <el-card>
            <p>各平台毛利润</p>
            <ve-histogram :data="chartData.GrossProfitMargin" height="300px"></ve-histogram>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="chartContent" :gutter="12">
        <el-col :xs="{ span: 12 }" :sm="{ span: 12 }" :lg="{ span: 6 }">
          <el-card>
            <p>各平台毛利率</p>
            <ve-histogram :data="chartData.GrossProfitMargin" height="300px"></ve-histogram>
          </el-card>
        </el-col>
        <el-col :xs="{ span: 12 }" :sm="{ span: 12 }" :lg="{ span: 6 }">
          <el-card>
            <p>各平台退款率占比</p>
            <ve-histogram :data="chartData.GrossProfitMargin" height="300px"></ve-histogram>
          </el-card>
        </el-col>
        <el-col :xs="{ span: 12 }" :sm="{ span: 12 }" :lg="{ span: 6 }">
          <el-card>
            <p>各平台退款</p>
            <ve-histogram :data="chartData.GrossProfitMargin" height="300px"></ve-histogram>
          </el-card>
        </el-col>
        <el-col :xs="{ span: 12 }" :sm="{ span: 12 }" :lg="{ span: 6 }">
          <el-card>
            <p>各平台客单价</p>
            <ve-histogram :data="chartData.GrossProfitMargin" height="300px"></ve-histogram>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="友情提示" :visible.sync="isPasswordture" :close-on-click-modal="false" width="20%">
      <div>你的密码将于 <span style="color:red;fontWeight:bold;">{{ getExpirationTime }}</span> 过期,请尽快修改</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isPasswordture = false" size="small">关 闭</el-button>
      </div>
    </el-dialog>
    <NoticeDialog :visible.sync="noticeDialog.visible" :row="noticeDialog.row" />
  </div>
</template>

<script>
import NoticeDialog from "./components/NoticeDialog"
import { getPublicAnnouncement } from "@/api/cms/announcement"
import CountTo from "vue-count-to";
// import VePie from 'v-charts/lib/pie.common'
// import VeRing from 'v-charts/lib/ring.common'
// import VeHistogram from 'v-charts/lib/histogram.common'
const defaultListQuery = {
  platform: "",
  site: "",
  warehouse: "",
  channel: "",
  salesman: "",
  selectDay: 30,
};
const defaultOption = [
  {
    value: "选项1",
    label: "黄金糕",
  },
  {
    value: "选项2",
    label: "双皮奶",
  },
  {
    value: "选项3",
    label: "蚵仔煎",
  },
  {
    value: "选项4",
    label: "龙须面",
  },
  {
    value: "选项5",
    label: "北京烤鸭",
  },
];
export default {
  name: "home",
  components: {
    CountTo,
    NoticeDialog,
    // VePie,
    // VeRing,
    // VeHistogram
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      queryOptions: {
        platformOptions: {
          list: defaultOption,
          label: "平台：",
          query: "platform",
          disabled: false,
        },
        siteOptions: {
          list: defaultOption,
          label: "站点：",
          query: "site",
          disabled: false,
        },
        warehouseOptions: {
          list: defaultOption,
          label: "仓库：",
          query: "warehouse",
          disabled: false,
        },
        channelOptions: {
          list: defaultOption,
          label: "渠道：",
          query: "channel",
          disabled: false,
        },
        salesmanOptions: {
          list: defaultOption,
          label: "销售员：",
          query: "salesman",
          disabled: false,
        },
        currencytypeOptions: {
          list: defaultOption,
          label: "货币类型：",
          query: "currencytype",
          disabled: false,
        },
      },
      selectDayButton: {
        seven: {
          label: "最近7天",
          value: 7,
        },
        fifteen: {
          label: "最近15天",
          value: 15,
        },
        thirty: {
          label: "最近30天",
          value: 30,
        },
      },
      contentCardList: {
        sales: {
          label: "销售额",
          value: 123452168,
          unit: "$",
          sequential: 100,
        },
        orders: {
          label: "订单数",
          value: 1256895369,
          unit: "$",
          sequential: 600,
        },
        GrossProfitMargin: {
          label: "毛利润",
          value: 1256895369,
          unit: "$",
          sequential: 200,
        },
        GrossProfitRate: {
          label: "毛利率",
          value: 69,
          unit: "%",
          sequential: 5,
        },
        refund: {
          label: "退款",
          value: 1256895369,
          unit: "$",
          sequential: 600,
        },
        refundRate: {
          label: "退款率",
          value: 10,
          unit: "%",
          sequential: -1,
        },
        guestPrice: {
          label: "客单价",
          value: 58,
          unit: "$",
          sequential: 5,
        },
      },
      chartData: {
        sales: {
          columns: ["日期", "访问用户"],
          rows: [
            { 日期: "1/1", 访问用户: 1393 },
            { 日期: "1/2", 访问用户: 3530 },
            { 日期: "1/3", 访问用户: 2923 },
            { 日期: "1/4", 访问用户: 1723 },
            { 日期: "1/5", 访问用户: 3792 },
            { 日期: "1/6", 访问用户: 4593 },
          ],
        },
        orders: {
          columns: ["日期", "访问用户"],
          rows: [
            { 日期: "1/1", 访问用户: 1393 },
            { 日期: "1/2", 访问用户: 3530 },
            { 日期: "1/3", 访问用户: 2923 },
            { 日期: "1/4", 访问用户: 1723 },
            { 日期: "1/5", 访问用户: 3792 },
            { 日期: "1/6", 访问用户: 4593 },
          ],
        },
        GrossProfitMargin: {
          columns: ["日期", "访问用户", "下单用户", "下单率"],
          rows: [
            { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
            { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
            { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
            { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
            { 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
            { 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 },
          ],
        },
      },
      isPasswordture: false,
      noticeDialog: {
        visible: false,
        row: {},
      }
    };
  },
  computed: {
    buttonType() {
      const { listQuery } = this;
      return function (value) {
        return listQuery.selectDay === value ? "primary" : "info";
      };
    },
    getExpirationTime() {
      const { time } = this.$store.state.user.diffTime
      return time ? time.split(" ")[0] : ""
    }
  },
  created() {
    this.isPass();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.fullPath !== '/login') return;
      getPublicAnnouncement().then(res => {
        if (!res.data) return;
        vm.noticeDialog = {
          visible: true,
          row: res.data
        }
      })
    })
  },
  methods: {
    isPass() {
      if (
        this.$store.state.user.diffTime.diffDate &&
        this.$store.state.user.diffTime.diffDate < 7
      ) {
        this.isPasswordture = true;
      }
    },
    getList() {
      console.log(this.listQuery);
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    conditions(data) {
      this.listQuery.selectDay = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: rgb(240, 242, 245);

  .operate-container {
    margin-top: 2px;
    padding-top: 15px;

    .buttonGroup {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  }
  .content-container {
    .contentTitle {
      display: flex;
      justify-content: center;
      font-size: 12px;
      color: grey;
      padding: 10px 0;
    }

    .contentCard {
      margin-bottom: 20px;

      p {
        text-align: center;
      }
      p:first-of-type {
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }
      p:nth-of-type(2) {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .card-panel-num {
        font-size: 20px;
        margin-right: 3px;
      }
      .card-panel-num-green {
        color: green;
      }
      .card-panel-num-red {
        color: red;
      }
      .rising {
        animation: risingAnimate 0.8s ease-in-out infinite alternate;
      }
      .falling {
        animation: fallingAnimate 0.8s ease-in-out infinite alternate;
      }

      @keyframes risingAnimate {
        from {
          transform: translateY(2px);
        }
        to {
          transform: translateY(-2px);
        }
      }
      @keyframes fallingAnimate {
        from {
          transform: translateY(-2px);
        }
        to {
          transform: translateY(2px);
        }
      }
    }

    .chartContent {
      margin-bottom: 10px;
    }

    @media screen and (min-width: 1200px) {
      .el-row {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
