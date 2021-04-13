<template>
  <div class="tableContainerDetail">
    <ListingDetail :list="list" @show="listingDetailShow(row)" title="出单详情" width="1000" span="6" :row="row" :whichShow="whichShow" :chartData="chartData" showStyle="card">
      <!-- 弹框里面 -->
      <template #default="{ item }">
        <div class="elPopoverSlot" v-show="whichShow.Ebay">
          <span>EB: </span>
          <a title="EB订单数">{{item.ebayOrderNum}}</a> /
          <a title="EB销售数量">{{item.ebayOrderSaleNum}}</a> /
          <a title="EB14天订单差">{{item.ebayOrderSaleDifferentNum}}</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Ali">
          <span>Ali: </span>
          <a title="Ali订单数">{{item.aliExpressOrderNum}}</a> /
          <a title="Ali销售数量">{{item.aliExpressOrderSaleNum}}</a> /
          <a title="Ali14天订单差">{{item.aliExpressOrderSaleDifferentNum}}</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Amz">
          <span>Amz: </span>
          <a title="Amz订单数">{{item.amazonOrderNum}}</a> /
          <a title="Amz销售数量">{{item.amazonOrderSaleNum}}</a> /
          <a title="Amz14天订单差">{{item.amazonOrderSaleDifferentNum}}</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Laz">
          <span>Laz: </span>
          <a title="Amz订单数">{{item.lazadaOrderNum}}</a> /
          <a title="Amz销售数量">{{item.lazadaOrderSaleNum}}</a> /
          <a title="Amz14天订单差">{{item.lazadaOrderSaleDifferentNum}}</a>
        </div>
        <div class="elPopoverSlot">
          <span>总: </span>
          <a title="订单数总和">{{ item.ebayOrderNum + item.aliExpressOrderNum+ item.amazonOrderNum+ item.lazadaOrderNum }}</a> /
          <a title="销售数量总和">{{ item.ebayOrderSaleNum + item.aliExpressOrderSaleNum+ item.amazonOrderSaleNum+ item.lazadaOrderSaleNum }}</a> /
          <a title="14天订单差总和">{{item.ebayOrderSaleDifferentNum + item.aliExpressOrderSaleDifferentNum+ item.amazonOrderSaleDifferentNum+ item.lazadaOrderSaleDifferentNum}}</a>
        </div>
      </template>

      <!-- 弹框外面 -->
      <template #reference>
        <div class="reference">
          <span>一周: </span>
          <a title="订单数">{{row.orderNum.oneWeekOrderNum}}</a> /
          <a title="销售数">{{row.orderNum.oneWeekOrderSaleNum}}</a>
        </div>
        <div class="reference">
          <span>二周: </span>
          <a title="订单数">{{row.orderNum.twoWeekOrderNum}}</a> /
          <a title="销售数">{{row.orderNum.twoWeekOrderSaleNum}}</a>
        </div>
        <div class="reference">
          <span>三周: </span>
          <a title="订单数">{{row.orderNum.threeWeekOrderNum}}</a> /
          <a title="销售数">{{row.orderNum.threeWeekOrderSaleNum}}</a>
        </div>
        <div class="reference">
          <span>四周: </span>
          <a title="订单数">{{row.orderNum.fourWeekOrderNum}}</a> /
          <a title="销售数">{{row.orderNum.fourWeekOrderSaleNum}}</a>
        </div>
      </template>
    </ListingDetail>
  </div>
</template>

<script>
import { getTableDetailOrder } from "@/api/Im/listingMonitoring";
import ListingDetail from "./ListingDetail";
export default {
  props: {
    row: {
      type: Object,
      default: () => { return { orderNum: {} } }
    },
    platformType: [String, Number],
    whichShow: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: [],
      chartData: []
    }
  },
  components: {
    ListingDetail
  },
  methods: {
    async listingDetailShow(row) {
      const params = {
        orderSourceName: row.orderSourceName,
        platformType: this.platformType,
        sku: row.sku,
      };
      // const fn = new Function(
      //   "getTableDetail",
      //   "getTableDetailOrder",
      //   "getTableDetailIncomes",
      //   `return ${type}`
      // );
      // const res = await fn(getTableDetail, getTableDetailOrder, getTableDetailIncomes)(params);
      const res = await getTableDetailOrder(params);
      const chartData = res.data.map(item => {
        const addObj = {};
        if (this.whichShow.Ebay) {
          addObj["EB订单数"] = item.ebayOrderNum
          addObj["EB销售数量"] = item.ebayOrderSaleNum
          addObj["EB14天订单差"] = item.ebayOrderSaleDifferentNum
        };
        if (this.whichShow.Ali) {
          addObj["Ali订单数"] = item.aliExpressOrderNum
          addObj["Ali销售数量"] = item.aliExpressOrderSaleNum
          addObj["Ali14天订单差"] = item.aliExpressOrderSaleDifferentNum
        };
        if (this.whichShow.Amz) {
          addObj["Amz订单数"] = item.amazonOrderNum
          addObj["Amz销售数量"] = item.amazonOrderSaleNum
          addObj["Amz14天订单差"] = item.amazonOrderSaleDifferentNum
        };
        addObj["订单数总和"] = item.ebayOrderNum + item.aliExpressOrderNum+ item.amazonOrderNum
        addObj["销售数量总和"] = item.ebayOrderSaleNum + item.aliExpressOrderSaleNum+ item.amazonOrderSaleNum
        addObj["14天订单差总和"] = item.ebayOrderSaleDifferentNum + item.aliExpressOrderSaleDifferentNum+ item.amazonOrderSaleDifferentNum
        return Object.assign({ "dateStr": item.dateStr }, addObj)
      }).reverse()
      this.list = res.data;
      this.chartData = chartData;
    },
  }
}
</script>

<style lang="scss" scoped>
.tableContainerDetail {
  text-align: left;

  .reference {
    /deep/ span {
      width: 45px;
      display: inline-block;
      box-sizing: border-box;
    }
    /deep/ a {
      box-sizing: border-box;
      display: inline-block;
      width: 50px;
      text-align: center;
    }
  }
}
.elPopoverSlot {
  min-height: 20px;
  span {
    display: inline-block;
    width: 35px;
    box-sizing: border-box;
    margin-right: -18px;
  }
  a {
    box-sizing: border-box;
    display: inline-block;
    width: 35px;
    text-align: center;
  }
}
</style>