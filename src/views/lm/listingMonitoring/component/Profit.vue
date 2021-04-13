<template>
  <div class="tableContainerDetail">
    <ListingDetail :list="list" @show="listingDetailShow(row)" title="毛利润详情" width="1060" span="5" :row="row" :whichShow="whichShow" showStyle="card">
      <!-- 弹框里面 -->
      <template #default="{ item }">
        <div class="elPopoverSlot" v-show="whichShow.Ebay">
          <span>EB: </span>
          <a title="eBay收入">{{Math.round(item.ebayIncomesNum)}}</a> /
          <a title="eBay毛利润">{{Math.round(item.ebayProfitsNum)}}</a> /
          <a title="eBay利润率">{{Math.round(item.ebayProfitsRateNum)}}%</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Ali">
          <span>Ali: </span>
          <a title="AliExpress收入">{{Math.round(item.aliExpressIncomesNum)}}</a> /
          <a title="AliExpress毛利润">{{Math.round(item.aliExpressProfitsNum)}}</a> /
          <a title="AliExpress利润率">{{Math.round(item.aliExpressProfitsRateNum)}}%</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Amz">
          <span>Amz: </span>
          <a title="Amazon收入">{{Math.round(item.amazonIncomesNum)}}</a> /
          <a title="Amazon毛利润">{{Math.round(item.amazonProfitsNum)}}</a> /
          <a title="Amazon利润率">{{Math.round(item.amazonProfitsRateNum)}}%</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Laz">
          <span>Laz: </span>
          <a title="Amazon收入">{{Math.round(item.lazadaIncomesNum)}}</a> /
          <a title="Amazon毛利润">{{Math.round(item.lazadaProfitsNum)}}</a> /
          <a title="Amazon利润率">{{Math.round(item.lazadaProfitsRateNum)}}%</a>
        </div>
        <div class="elPopoverSlot">
          <span>总: </span>
          <a title="总收入">{{Math.round(item.ebayIncomesNum + item.aliExpressIncomesNum+ item.amazonIncomesNum+item.lazadaIncomesNum)}}</a> /
          <a title="总毛利润">{{Math.round(item.ebayProfitsNum + item.aliExpressProfitsNum+ item.amazonProfitsNum+item.lazadaProfitsNum)}}</a> /
          <a title="总利润率">{{ Math.round((item.ebayProfitsNum + item.aliExpressProfitsNum+ item.amazonProfitsNum+item.lazadaProfitsNum) / (item.ebayIncomesNum + item.aliExpressIncomesNum+ item.amazonIncomesNum+ item.lazadaIncomesNum)*100 )|| 0 }}%</a>
        </div>
      </template>

      <!-- 弹框外面 -->
      <template #reference>
        <div class="reference">
          <span>一周: </span>
          <a title="收入">{{Math.floor(row.orderProfits.oneWeekIncomesNum)}}</a> /
          <a title="毛利润">{{Math.floor(row.orderProfits.oneWeekProfitsNum)}}</a> /
          <a title="利润率">{{Math.floor(row.orderProfits.oneWeekProfitsRateNum * 100)}}%</a>
        </div>
        <div class="reference">
          <span>二周: </span>
          <a title="收入">{{Math.floor(row.orderProfits.twoWeekIncomesNum)}}</a> /
          <a title="毛利润">{{Math.floor(row.orderProfits.twoWeekProfitsNum)}}</a> /
          <a title="利润率">{{Math.floor(row.orderProfits.twoWeekProfitsRateNum * 100)}}%</a>
        </div>
        <div class="reference">
          <span>三周: </span>
          <a title="收入">{{Math.floor(row.orderProfits.threeWeekIncomesNum)}}</a> /
          <a title="毛利润">{{Math.floor(row.orderProfits.threeWeekProfitsNum)}}</a> /
          <a title="利润率">{{Math.floor(row.orderProfits.threeWeekProfitsRateNum * 100)}}%</a>
        </div>
        <div class="reference">
          <span>四周: </span>
          <a title="收入">{{Math.floor(row.orderProfits.fourWeekIncomesNum)}}</a> /
          <a title="毛利润">{{Math.floor(row.orderProfits.fourWeekProfitsNum)}}</a> /
          <a title="利润率">{{Math.floor(row.orderProfits.fourWeekProfitsRateNum * 100)}}%</a>
        </div>
      </template>
    </ListingDetail>
  </div>
</template>

<script>
import { getTableDetailIncomes } from "@/api/Im/listingMonitoring";
import ListingDetail from "./ListingDetail";
export default {
  props: {
    row: {
      type: Object,
      default: () => { return { orderProfits: {} } }
    },
    platformType: [String, Number],
    whichShow: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: []
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
      const res = await getTableDetailIncomes(params);
      this.list = res.data;
    }
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
      width: 48px;
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
    width: 44px;
    text-align: center;
  }
}
</style>