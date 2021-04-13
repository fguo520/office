<template>
  <el-dialog :title="`查看报价详情${rows.quoteNo}`" :visible.sync="visible" width="1080px" append-to-body :before-close="close" @open="open">
    <el-form ref="form" label-width="140px" size="mini" :model="rows">
      <el-form-item label="报价单号：">
        <span v-copy="rows.quoteNo">{{rows.quoteNo}}</span>
      </el-form-item>
      <el-form-item label="报价有效期：">
        <span>{{rows.quoteSdate}} — {{rows.quoteEdate}}</span>
      </el-form-item>
      <el-form-item label="运费计算类型：">
        <span v-copy="rows.calType===0?'区间价格':'起重续价'">{{rows.calType===0?"区间价格":"起重续价"}}</span>
      </el-form-item>
      <el-form-item label="币种：">
        <span v-copy="rows.currency">{{rows.currency}}</span>
      </el-form-item>
      <el-form-item label="一票多件计费重量：">
        <span>{{rows.isCallWeight?'是':'否'}}</span>
        <el-tooltip content="一票多件取大累加,勾选代表每件体积重和实际重取大后累加值" placement="top" effect="light">
          <i class="el-icon-question" style="color:green" v-if="rows.isCallWeight"></i>
        </el-tooltip>
      </el-form-item>
      <!-- <el-form-item label="重量限制方式：">
        <span>包裹重和体积重间取最大重量</span>
      </el-form-item>
      <el-form-item label="时效：">
        <span>6~10天</span>
      </el-form-item> -->
      <el-form-item label="额外折扣比例：">
        <span>{{rows.totalDiscountRadio}}</span><span style="margin-left:15px">{{"（"+(rows.totalDiscountRadio*100)+"%）"}}</span>
      </el-form-item>
      <el-form-item label="报价备注：" style="width:100%">
        <span>{{rows.quoteRemarks}}</span>
      </el-form-item>
    </el-form>
    <div v-if="list.length>0" style="margin-top:10px">
      <el-table ref="tableContainer" style="width: 100%" :data="list" element-loading-text="数据加载中" border max-height="500px" :header-cell-style="{ 'background-color': '#dadde3' }">
        <el-table-column label="国家" align="center" width="100" prop="country" />
        <el-table-column label="区域/分区" align="center" width="100" prop="zone" />
        <el-table-column label="最小重量(g)" align="center" width="100" prop="minWeight" />
        <el-table-column label="最大重量(g)" align="center" width="100" prop="maxWeight" />
        <el-table-column label="续重(g)" align="center" width="100" prop="moreWeight" v-if="rows.calType==1" />
        <el-table-column label="起始价格" align="center" width="100" prop="quotePrice" />
        <el-table-column label="续重价格" align="center" width="100" prop="morePrice" v-if="rows.calType==1" />
        <el-table-column label="一口价" align="center" width="100" prop="fixedPrice" />
        <el-table-column label="折扣比例" align="center" width="150"  >
          <template slot-scope="scope">
            <div >{{scope.row.discountPercentage}}</div>
            <div>{{"（"+(scope.row.discountPercentage*100).toFixed(2)+"%）"}}</div>
          </template>
        </el-table-column>
        <el-table-column label="燃油费" align="center" width="100" prop="fuelCost" />
        <el-table-column label="燃油费费率(%)" align="center" width="120" prop="fuelPercentage" />
        <el-table-column label="其它费用" align="center" width="100" prop="otherCost" />
        <el-table-column label="体积系数" align="center" width="100" prop="voumeCoefficient" />
        <el-table-column label="区域备注" align="center" width="150" prop="regionalRemarks">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="scope.row.regionalRemarks" placement="left">
                <div class="tooltipClass">{{scope.row.regionalRemarks}}</div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" :total="total" @request="open" />
    </div>
  </el-dialog>
</template>
<script>
import { Pagination } from "@/components"
import { getLogisticsServeiceQuoteDetailList } from "@/api/logistics/logisticsQuotation"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  id: "",
  quoteNo: ""
}
export default {
  name: "ViewDetails",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Object,
      default: () => { }
    }
  },
  components: { Pagination },
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
    }
  },

  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    async open() {
      this.listQuery.quoteNo = this.rows.quoteNo
      const res = await getLogisticsServeiceQuoteDetailList(this.listQuery)
      this.list = res.data.list
      this.total = res.data.total
    },
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__body {
 padding: 10px 20px;
  .el-form {
    overflow: hidden;
    .el-form-item {
      width: 50%;
      float: left;
    }
  }
}
</style>