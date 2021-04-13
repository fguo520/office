<template>
  <el-dialog title="批量审核" :visible.sync="visible" width="900px" :before-close="close">
    <el-table ref="tableContainer" style="width: 100%" :data="list" border max-height="500" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="审核类型" align="center" width="100">
        <template slot-scope="scope">
          <div v-copy="scope.row.feeTypeName">{{scope.row.feeTypeName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="单号" align="center" width="200">
        <template slot-scope="scope">
          <div style="text-align:left">
            <el-tooltip class="item" effect="dark" :content="'费用审核号:'" placement="left">
              <div v-copy="scope.row.applyNo">{{scope.row.applyNo }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'平台订单号:'" placement="left">
              <div v-copy="scope.row.platformOrderNo">{{scope.row.platformOrderNo }}</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="账号信息" align="center" width="175">
        <template slot-scope="scope">
          <div style="text-align:left">
            <el-tooltip class="item" effect="dark" :content="'平台:'" placement="left">
              <div>{{scope.row.platformName}}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'店铺:'" placement="left">
              <div>{{scope.row.channelName}}</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="费用详情" align="center" width="264">
        <template slot-scope="scope">
          <div style="text-align:left">
            <div v-show="scope.row.totalLossAmountRMB">总耗损金额: {{scope.row.totalLossAmountRMB}}</div>
            <div v-show="scope.row.totalPayAmountCny">支出总金额(人民币): {{scope.row.totalPayAmountCny}}</div>
            <div v-show="scope.row.totalPayAmount1">支出总金额(原币): {{scope.row.totalPayAmount1}}</div>
            <div v-show="scope.row.rate">退款率: {{scope.row.rate}} %</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="人员" align="center" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="'销售负责人:'" placement="left">
            <div v-copy="scope.row.chargeSalerName">{{scope.row.chargeSalerName  }}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="'费用承担人:'" placement="left">
            <div v-copy="scope.row.feeTakerName">{{scope.row.feeTakerName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:15px;text-align:right">
      <span v-if="this.status==1">
        <el-button @click="conditions(0)" size="mini" v-if="rolePermissionJudge('/financeCost/departmentAudit/rejectAll')">部门审核拒绝</el-button>
        <el-button @click="conditions(1)" type="primary" size="mini" :loading="ifButton" v-if="rolePermissionJudge('/financeCost/departmentAudit/getAll')">部门审核通过</el-button>
      </span>
      <span v-if="this.status==2">
        <el-button @click="conditionsTwo(0)" size="mini" v-if="rolePermissionJudge('/financeCost/financialAudit/rejectAll')">财务审核拒绝</el-button>
        <el-button @click="conditionsTwo(1)" type="primary" size="mini" :loading="ifButton" v-if="rolePermissionJudge('/financeCost/financialAudit/getAll')">财务审核通过</el-button>
      </span>
      <span style="margin-left:10px">
      <el-button @click="close" size="mini">取消</el-button></span>
    </div>
    <RefusePass :visible.sync="refusePass.visible" :rows="refusePass.rows" :mapList="refusePass.mapList" :step="refusePass.step" @request="close" />
  </el-dialog>
</template>
<script>
import { batchCheckFeeApplyBill } from "@/api/finance/financeCost"
import RefusePass from "./RefusePass"
export default {
  name: "BatchReview",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    status: {
      type: Number,
      default: null
    }
  },
  components: { RefusePass },
  data() {
    return {
      ruleFrom: {
        rejectReason: "",
        isCheck: null,
        visible: false
      },
      refusePass: {
        visible: false,
        rows: {},
        mapList: [],
        step: null
      },
      ifButton: false
    }
  },
  beforeDestroy() {
    this.close();
  },
  created() {
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.$emit("request")
    },
    async conditions(value) {
      this.ruleFrom.isCheck = value
      const mapList = this.list.map(item => {
        return {
          id: item.id,
          version: item.version
        }
      })
      if (value == 1) {
        this.ifButton = true
        const res = await batchCheckFeeApplyBill({ mapList, isCheck: this.ruleFrom.isCheck, rejectReason: this.ruleFrom.rejectReason, step: 1 })
        if (res.code == 200) {
          this.$message.success(res.data)
          this.close()
          this.$emit("request")
        }
        this.ifButton = false
      } else {
        this.refusePass = {
          visible: true,
          rows: this.ruleFrom,
          mapList: mapList,
          step: 1
        }
      }
    },
    async conditionsTwo(value) {
      this.ruleFrom.isCheck = value
      const mapList = this.list.map(item => {
        return {
          id: item.id,
          version: item.version
        }
      })
      if (value == 1) {
        this.ifButton = true
        const res = await batchCheckFeeApplyBill({ mapList, isCheck: this.ruleFrom.isCheck, rejectReason: this.ruleFrom.rejectReason, step: 2 })
        if (res.code == 200) {
          this.$message.success(res.data)
          this.close()
          this.$emit("request")
        }
        this.ifButton = false
      } else {
        this.refusePass = {
          visible: true,
          rows: this.ruleFrom,
          mapList: mapList,
          step: 2
        }
      }
    }
  }
}
</script>