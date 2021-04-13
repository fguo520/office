<template>
  <div class="tableContainerDetail">
    <ListingDetail :list="list" @show="listingDetailShow(row)" title="listing转化率" width="1060" span="5" :row="row" :whichShow="whichShow" showStyle="card" @itemClick="dialogShow">
      <!-- 弹框里面 -->
      <template #default="{ item }">
        <div class="elPopoverSlot" v-show="whichShow.Ebay">
          <span>EB: </span>
          <a title="EB在线">{{Math.floor(item.ebayNum)}}</a> /
          <a title="EB成交">{{Math.floor(item.ebayOrderNum)}}</a> /
          <a title="EB转化率">{{Math.floor(item.ebayOrderRateNum)}}%</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Ali">
          <span>Ali: </span>
          <a title="Ali在线">{{Math.floor(item.aliExpressNum)}}</a> /
          <a title="Ali成交">{{Math.floor(item.aliExpressOrderNum)}}</a> /
          <a title="Ali转化率">{{Math.floor(item.aliOrderRateNum)}}%</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Amz">
          <span>Amz: </span>
          <a title="Amazon在线">{{Math.floor(item.amazonNum)}}</a> /
          <a title="Amazon成交">{{Math.floor(item.amazonOrderNum)}}</a> /
          <a title="Amazon转化率">{{Math.floor(item.amazonOrderRateNum)}}%</a>
        </div>
        <div class="elPopoverSlot" v-show="whichShow.Laz">
          <span>Laz: </span>
          <a title="Amazon在线">{{Math.floor(item.lazadaNum)}}</a> /
          <a title="Amazon成交">{{Math.floor(item.lazadaOrderNum)}}</a> /
          <a title="Amazon转化率">{{Math.floor(item.lazadaOrderRateNum)}}%</a>
        </div>
        <div class="elPopoverSlot">
          <span>总: </span>
          <a title="总在线">{{Math.floor(item.ebayNum + item.aliExpressNum + item.amazonNum+item.lazadaNum)}}</a> /
          <a title="总成交">{{Math.floor(item.ebayOrderNum + item.aliExpressOrderNum + item.amazonOrderNum+item.lazadaOrderNum)}}</a> /
          <a title="总转化率">{{Math.floor(item.ebayOrderRateNum + item.aliOrderRateNum+ item.amazonOrderRateNum+item.lazadaOrderRateNum)}}%</a>
        </div>
      </template>
      <!-- 弹框外面 -->
      <template #reference>
        <div class="reference">
          <span>综合: </span>
          <a title="在线">{{Math.floor(row.orderRate.oneWeekOnlineNum)}}</a> /
          <a title="成交">{{Math.floor(row.orderRate.complexOrderNum)}}</a> /
          <a title="转化率">{{Math.floor(row.orderRate.complexOrderRateNum)}}%</a>
        </div>
        <div class="reference">
          <span>一周: </span>
          <a title="在线">{{Math.floor(row.orderRate.oneWeekOnlineNum)}}</a> /
          <a title="成交">{{Math.floor(row.orderRate.oneWeekOrderNum)}}</a> /
          <a title="转化率">{{Math.floor(row.orderRate.oneWeekOrderRateNum)}}%</a>
        </div>
        <div class="reference">
          <span>二周: </span>
          <a title="在线">{{Math.floor(row.orderRate.twoWeekOnlineNum)}}</a> /
          <a title="成交">{{Math.floor(row.orderRate.twoWeekOrderNum)}}</a> /
          <a title="转化率">{{Math.floor(row.orderRate.twoWeekOrderRateNum)}}%</a>
        </div>
        <div class="reference">
          <span>三周: </span>
          <a title="在线">{{Math.floor(row.orderRate.threeWeekOnlineNum)}}</a> /
          <a title="成交">{{Math.floor(row.orderRate.threeWeekOrderNum)}}</a> /
          <a title="转化率">{{Math.floor(row.orderRate.threeWeekOrderRateNum)}}%</a>
        </div>
        <div class="reference">
          <span>四周: </span>
          <a title="在线">{{Math.floor(row.orderRate.fourWeekOnlineNum)}}</a> /
          <a title="成交">{{Math.floor(row.orderRate.fourWeekOrderNum)}}</a> /
          <a title="转化率">{{Math.floor(row.orderRate.fourWeekOrderRateNum)}}%</a>
        </div>
      </template>

      <template #other>
        <LogView :config="logViewParam" :visible.sync="LogDialogVisible" :modal="false" dialogTitle="Listing 出单 item 详情" center>
          <el-table-column prop="platformName" label="平台" align="center"></el-table-column>
          <el-table-column prop="orderSourceName" label="账号" align="center"></el-table-column>
          <el-table-column prop="itemUrl" label="产品链接" align="center">
            <template #default="{ row }">
              <el-link type="primary" :href="row.itemUrl" target="_blank" :underline="false">{{ row.itemId }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="订单数" align="center"></el-table-column>
          <el-table-column prop="orderSaleNum" label="订单销售数" align="center"></el-table-column>
          <template #tableOutside>
            <div style="text-align:center;">
              <!-- 这里的row是本组件props属性的row -->
              <span>sku：{{ row.sku }}</span>
              <span>中文名称：{{ row.productNameCn }}</span>
            </div>
          </template>
        </LogView>
      </template>
    </ListingDetail>
  </div>
</template>

<script>
import { getTableDetailOrderrate, detail } from "@/api/Im/listingMonitoring";
import { LogView } from "@/components";
import ListingDetail from "./ListingDetail";
export default {
  props: {
    row: {
      type: Object,
      default: () => { return { orderRate: {} } }
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
      LogDialogVisible: false,
      logViewParam: {
        request: detail,
        param: {},
      },
    }
  },
  components: {
    ListingDetail,
    LogView
  },
  methods: {
    async listingDetailShow(row) {
      const params = {
        orderSourceName: row.orderSourceName,
        platformType: this.platformType,
        sku: row.sku,
      };
      const res = await getTableDetailOrderrate(params);
      this.list = res.data;
    },
    async dialogShow(dateNum) {
      this.logViewParam.param = {
        dateNum: dateNum + 1,
        orderSourceName: this.row.orderSourceName,
        platformType: this.platformType,
        sku: this.row.sku
      }
      this.LogDialogVisible = true
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