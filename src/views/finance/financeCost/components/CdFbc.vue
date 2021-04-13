<template>
  <div>
    <el-form-item label="FBC费用原币: " prop="fbcFeeSourceAmount">
      <NumberInput v-model="ruleForm.fbcFeeSourceAmount" max="1000000" float="4" min="0" style="width:220px" @change="fbcFeeSourceChange" />
      <el-select v-model="ruleForm.fbcFeeSourceCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px"  @change="fbcFeeSourceChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.fbcFeeSourceAmountRmb}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.fbcFeeSourceRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="FBC附加费用: " prop="fbcFeeAddAmount">
      <NumberInput v-model="ruleForm.fbcFeeAddAmount" max="1000000" float="4" min="0" style="width:220px" @change="fbcFeeAddChange" />
      <el-select v-model="ruleForm.fbcFeeAddCurrency" placeholder="币种" size="mini" clearable class="input-width"  filterable style="width:100px" @change="fbcFeeAddChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.fbcFeeAddAmountRmb}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.fbcFeeAddRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="支出总金额(人民币): " prop="totalPayAmountCny">
      {{(countPay(ruleForm.totalPayAmountCny))}} CNY
      <el-tooltip content="支出总金额(人民币)=FBC费用原币*汇率+FBC附加费用*汇率" placement="top" effect="light">
        <i class="el-icon-question" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>
<script>
import { NumberInput } from "@/components"
import { queryExchangeRateByName } from "@/api/finance/financeCost"
export default {
  name: "CdRefund",
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
        orderCurrencyList:[{ label: "人民币", value: "CNY" }, { label: "美元", value: "USD" }, { label: "欧元", value: "EUR" }, { label: "港币", value: "HKD" }, { label: "日元", value: "JPY" }, { label: "英镑", value: "GBP" }, { label: "澳大利亚元", value: "AUD" }, { label: "加拿大元", value: "CAD" }, ],
      }
    }
  },
  computed: {
    countPay() {
      const { ruleForm } = this
      return function (item) {
        return ruleForm.totalPayAmountCny = (Number(ruleForm.fbcFeeSourceAmount * ruleForm.fbcFeeSourceRate) + Number(ruleForm.fbcFeeAddAmount * ruleForm.fbcFeeAddRate)).toFixed(4)
      }
    },
  },
  methods: {
    async fbcFeeSourceChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.fbcFeeSourceCurrency })
      this.ruleForm.fbcFeeSourceRate = res.data ? res.data : 0
      this.ruleForm.fbcFeeSourceAmountRmb = (this.ruleForm.fbcFeeSourceRate * this.ruleForm.fbcFeeSourceAmount).toFixed(4)
    },
    async fbcFeeAddChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.fbcFeeAddCurrency })
      this.ruleForm.fbcFeeAddRate = res.data ? res.data : 0
      this.ruleForm.fbcFeeAddAmountRmb = (this.ruleForm.fbcFeeAddRate * this.ruleForm.fbcFeeAddAmount).toFixed(4)
    },
  }
}
</script>