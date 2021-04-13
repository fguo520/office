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
    <el-form-item label="paypal未入退款金额: " prop="amount">
      <NumberInput v-model="ruleForm.amount" max="1000000" float="4" min="0" style="width:220px" @change="amountChange" />
      <el-select v-model="ruleForm.amountCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="amountChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.amountRmb}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.amountCurrencyRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="PayPal退款交易号: " prop="paypalRefundTradeNo">
      <el-input v-model="ruleForm.paypalRefundTradeNo" clearable size="mini" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="对方PayPal收款账号: " prop="receiveAccountNo">
      <el-input v-model="ruleForm.receiveAccountNo" clearable size="mini" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="退款率: " prop="rate">
      {{(count(ruleForm.rate)*100).toFixed(4)}} %
      <el-tooltip content="（退款金额*汇率）/（订单金额*汇率）" placement="top" effect="light">
        <i class="el-icon-question" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="支出总金额: " prop="totalPayAmountCny">
      {{(countPay(ruleForm.totalPayAmountCny))}} CNY
      <el-tooltip content="paypal未入退款金额*汇率" placement="top" effect="light">
        <i class="el-icon-question" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>
<script>
import { NumberInput } from "@/components"
import { queryExchangeRateByName, queryOrderAmount } from "@/api/finance/financeCost"
export default {
  name: "AliExpressPaypal",
  props: {
    ruleForm: {
      type: Object,
      default: () => { }
    },
  },
  components: { NumberInput },
  data() {
    return {
      list: {
        orderCurrencyList: [{ label: "人民币", value: "CNY" }, { label: "美元", value: "USD" }, { label: "欧元", value: "EUR" }, { label: "港币", value: "HKD" }, { label: "日元", value: "JPY" }, { label: "英镑", value: "GBP" }, { label: "澳大利亚元", value: "AUD" }, { label: "加拿大元", value: "CAD" }, ],
      }
    }
  },
  computed: {
    count() {
      const { ruleForm } = this
      return function (item) {
        if (ruleForm.orderAmount > 0 && ruleForm.orderCurrencyRate > 0) {
          return ruleForm.rate = ((ruleForm.amount * ruleForm.amountCurrencyRate) / (ruleForm.orderAmount * ruleForm.orderCurrencyRate)).toFixed(4)
        } else {
          return ruleForm.rate = 0
        }
      }
    },
    countPay() {
      const { ruleForm } = this
      return function (item) {
        return ruleForm.totalPayAmountCny = (ruleForm.amount * ruleForm.amountCurrencyRate).toFixed(4)
      }
    }
  },
  methods: {
    async orderCurrencyChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.orderCurrency })
      this.ruleForm.orderCurrencyRate = res.data ? res.data : 0
      this.ruleForm.orderAmountRMB = (this.ruleForm.orderCurrencyRate * this.ruleForm.orderAmount).toFixed(4)
    },
    async amountChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.amountCurrency })
      this.ruleForm.amountCurrencyRate = res.data ? res.data : 0
      this.ruleForm.amountRmb = (this.ruleForm.amountCurrencyRate * this.ruleForm.amount).toFixed(4)
    },
    async platformOrderNoChange() {
      if (!this.ruleForm.platformOrderNo) return
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