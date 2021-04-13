<template>
  <div>
    <el-form-item label="平台订单号: " prop="platformOrderNo">
      <el-input v-model="ruleForm.platformOrderNo" clearable size="mini" style="width:220px" @change="platformOrderNoChange"></el-input>
    </el-form-item>
    <el-form-item label="订单金额: " prop="orderAmount">
      <NumberInput v-model="ruleForm.orderAmount" max="1000000" float="4" min="0" style="width:220px" @change="orderCurrencyChange" />
      <el-select v-model="ruleForm.orderCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="orderCurrencyChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.orderAmountRMB}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.orderCurrencyRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="刷单佣金: " prop="swipeCommission">
      <NumberInput v-model="ruleForm.swipeCommission" max="1000000" float="4" min="0" style="width:220px" @change="swipeCommissionChange" />
      <el-select v-model="ruleForm.commissionCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="swipeCommissionChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.swipeCommissionRMB}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.commissionCurrencyRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="平台佣金: " prop="platCommission">
      <NumberInput v-model="ruleForm.platCommission" max="1000000" float="4" min="0" style="width:220px" @change="platCommissionChange" />
      <el-select v-model="ruleForm.platCommissionCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="platCommissionChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.platCommissionRMB}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.platCommissionRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="总损耗金额: " prop="totalPayAmountCny">
      {{countLoss(ruleForm.totalLossAmountRmb)}} CNY
      <el-tooltip content="总损耗金额=平台佣金*汇率+刷单佣金*1.2*汇率" placement="top" effect="light">
        <i class="el-icon-question" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="费用总支出: " prop="totalPayAmountCny">
      {{count(ruleForm.totalPayAmountCny)}} CNY
      <el-tooltip content="订单金额*汇率+总损耗金额" placement="top" effect="light">
        <i class="el-icon-question" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>
<script>
import { NumberInput } from "@/components"
import { queryExchangeRateByName, queryOrderAmount } from "@/api/finance/financeCost"
export default {
  name: "AliExpressScalp",
  props: {
    ruleForm: {
      type: Object,
      default: () => { }
    },
  },
  components: { NumberInput },
  computed: {
    countLoss() {
      const { ruleForm } = this
      return function (item) {
        return ruleForm.totalLossAmountRmb = Number(((ruleForm.platCommission * ruleForm.platCommissionRate) + (ruleForm.swipeCommission * ruleForm.commissionCurrencyRate * 1.2)).toFixed(4))
      }
    },
    count() {
      const { ruleForm } = this
      return function (item) {
        return ruleForm.totalPayAmountCny = Number(((ruleForm.orderAmount * ruleForm.orderCurrencyRate) + ruleForm.totalLossAmountRmb).toFixed(4))
      }
    },
  },
  data() {
    return {
      list: {
        orderCurrencyList:[{ label: "人民币", value: "CNY" }, { label: "美元", value: "USD" }, { label: "欧元", value: "EUR" }, { label: "港币", value: "HKD" }, { label: "日元", value: "JPY" }, { label: "英镑", value: "GBP" }, { label: "澳大利亚元", value: "AUD" }, { label: "加拿大元", value: "CAD" }, ],
      }
    }
  },
  methods: {
    async orderCurrencyChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.orderCurrency })
      this.ruleForm.orderCurrencyRate = res.data ? res.data : 0
      this.ruleForm.orderAmountRMB = (this.ruleForm.orderCurrencyRate * this.ruleForm.orderAmount).toFixed(4)
    },
    async swipeCommissionChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.commissionCurrency })
      this.ruleForm.commissionCurrencyRate = res.data ? res.data : 0
      this.ruleForm.swipeCommissionRMB = (this.ruleForm.commissionCurrencyRate * this.ruleForm.swipeCommission).toFixed(4)
    },
    async platCommissionChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.platCommissionCurrency })
      this.ruleForm.platCommissionRate = res.data ? res.data : 0
      this.ruleForm.platCommissionRMB = (this.ruleForm.platCommissionRate * this.ruleForm.platCommission).toFixed(4)
    },
    async platformOrderNoChange() {
      console.log(1)
      if (!this.ruleForm.platformOrderNo) return
      const res = await queryOrderAmount({ platformName: this.ruleForm.platformName, clientOrderCode: this.ruleForm.platformOrderNo })
      try {
        const res = await queryOrderAmount({ platformName: this.ruleForm.platformName, clientOrderCode: this.ruleForm.platformOrderNo })
        if (res.code == 200) {
          this.ruleForm.orderAmount = res.data.totalPrice ? res.data.totalPrice : 0
          this.ruleForm.orderCurrency = res.data.currency ? res.data.currency : ""
          this.orderCurrencyChange()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>