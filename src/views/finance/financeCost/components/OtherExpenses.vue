<template>
  <div>
    <el-form-item label="平台订单号: " >
      <el-input v-model="ruleForm.platformOrderNo" clearable size="mini" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="金额: " prop="amount">
       <NumberInput v-model="ruleForm.amount" float="4" max="1000000" min="0" style="width:220px"  @change="amountChange"/>
      <el-select v-model="ruleForm.amountCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="amountChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
        <span> <b>{{ruleForm.amountRmb}}</b> CNY</span>
        <el-tooltip :content="'汇率:'+ruleForm.amountCurrencyRate" placement="top" effect="light">
          <i class="el-icon-coin" style="color:green"></i>
        </el-tooltip>
    </el-form-item>
    <el-form-item label="佣金: ">
      <NumberInput v-model="ruleForm.platCommission" float="4" max="1000000" min="0" style="width:220px" @change="platCommissionChange"/>
      <el-select v-model="ruleForm.platCommissionCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="platCommissionChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.platCommissionRMB}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.platCommissionRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="其他费用: ">
      <NumberInput v-model="ruleForm.otherFeeAmount" float="4" max="1000000" min="0" style="width:220px"  @change="otherFeeChange"/>
      <el-select v-model="ruleForm.otherFeeCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="otherFeeChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.otherFeeAmountRmb}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.otherFeeCurrencyRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="支出总金额: " prop="totalPayAmountCny">
      {{count(ruleForm.totalPayAmountCny)}} CNY
      <el-tooltip content="支出总金额=订单金额*汇率+佣金*汇率+其它费用*汇率" placement="top" effect="light">
        <i class="el-icon-question" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>
<script>
import { NumberInput } from "@/components"
import { queryExchangeRateByName } from "@/api/finance/financeCost"
export default {
  name: "OtherExpenses",
  props: {
    ruleForm: {
      type: Object,
      default: () => { }
    },
  },
  components: { NumberInput },
  computed: {
    count() {
      const { ruleForm } = this
      return function (item) {
        return (ruleForm.totalPayAmountCny = (ruleForm.amount * ruleForm.amountCurrencyRate) + (ruleForm.otherFeeAmount * ruleForm.otherFeeCurrencyRate) + (ruleForm.platCommissionRate * ruleForm.platCommission)).toFixed(4)
      }
    }
  },
  data() {
    return {
      list:{
        orderCurrencyList: [{ label: "人民币", value: "CNY" }, { label: "美元", value: "USD" }, { label: "欧元", value: "EUR" }, { label: "港币", value: "HKD" }, { label: "日元", value: "JPY" }, { label: "英镑", value: "GBP" }, { label: "澳大利亚元", value: "AUD" }, { label: "加拿大元", value: "CAD" }, ],
      }
    }
  },
  methods: {
    async amountChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.amountCurrency })
      this.ruleForm.amountCurrencyRate = res.data?res.data:0
      this.ruleForm.amountRmb = (this.ruleForm.amountCurrencyRate * this.ruleForm.amount).toFixed(4)
    },
    async otherFeeChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.otherFeeCurrency })
      this.ruleForm.otherFeeCurrencyRate = res.data?res.data:0
      this.ruleForm.otherFeeAmountRmb = (this.ruleForm.otherFeeCurrencyRate * this.ruleForm.otherFeeAmount).toFixed(4)
    },
    async platCommissionChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.platCommissionCurrency })
      this.ruleForm.platCommissionRate = res.data?res.data:0
      this.ruleForm.platCommissionRMB = (this.ruleForm.platCommissionRate * this.ruleForm.platCommission).toFixed(4)
    },
  }
}
</script>