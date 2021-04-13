<template>
  <ListingDetail :list="list" @show="listingDetailShow(row)" title="在线Listing" width="1000" span="10" :row="row" :chartData="chartData" :whichShow="whichShow">
    <!-- 弹框里面 -->
    <template #default="{ item }">
      <div class="elPopoverSlot" v-show="whichShow.Ebay">
        <span>EB：</span>
        <a title="EB在线">{{item.ebayNum}}</a>
      </div>
      <div class="elPopoverSlot" v-show="whichShow.Ali">
        <span>Ali：</span>
        <a title="Ali在线">{{item.aliExpressNum}}</a>
      </div>
      <div class="elPopoverSlot" v-show="whichShow.Amz">
        <span>Amz：</span>
        <a title="Amz在线数量">{{item.amazonNum}}</a>
      </div>
      <div class="elPopoverSlot" v-show="whichShow.Laz">
        <span>Laz：</span>
        <a title="Laz在线数量">{{item.lazadaNum}}</a>
      </div>
      <div class="elPopoverSlot">
        <span>总：</span>
        <a title="总">{{item.ebayNum + item.aliExpressNum+ item.amazonNum+item.lazadaNum}}</a>
      </div>
    </template>

    <!-- 弹框外面 -->
    <template #reference> {{ row.listingOnlineNum }} </template>
  </ListingDetail>
</template>

<script>
import { getTableDetail } from "@/api/Im/listingMonitoring";
import ListingDetail from "./ListingDetail";
export default {
  props: {
    row: {
      type: Object,
      default: () => { return {} }
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
      const res = await getTableDetail(params);
      const chartData = res.data.map(item => {
        const addObj = {};
        if (this.whichShow.Ebay) addObj["EB在线"] = item.ebayNum;
        if (this.whichShow.Ali) addObj["Ali在线"] = item.aliExpressNum;
        if (this.whichShow.Amz) addObj["Amz在线"] = item.amazonNum;
        if (this.whichShow.Amz) addObj["Laz在线"] = item.lazadaNum;
        return Object.assign({"dateStr": item.dateStr}, addObj, { "总": item.ebayNum + item.aliExpressNum + item.amazonNum +item.lazadaNum})
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
      width: 48px;
      text-align: center;
    }
  }
}

.elPopoverSlot {
  min-height: 20px;
  span {
    display: inline-block;
    width: 40px;
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