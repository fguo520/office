<template>
  <!-- <el-form ref="form" label-width="170px" size="mini" :model="ruleForm" :rules="rules">-->
  <div>
    <el-form-item label="ASIN: ">
      <el-input v-model="ruleForm.asin" clearable size="mini" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="平台订单号: ">
      <el-input v-model="ruleForm.platformOrderNo" clearable size="mini" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="营销费用: " prop="amount">
      <NumberInput v-model="ruleForm.amount" float="4" max="1000000" min="0" style="width:220px" @change="amountChange" />
      <el-select v-model="ruleForm.amountCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="amountChange">
        <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span> <b>{{ruleForm.amountRmb}}</b> CNY</span>
      <el-tooltip :content="'汇率:'+ruleForm.amountCurrencyRate" placement="top" effect="light">
        <i class="el-icon-coin" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="支付方式: " prop="payMethod">
      <el-select v-model="ruleForm.payMethod" size="mini" clearable class="input-width" filterable style="width:220px">
        <el-option v-for="(item, index) in list.payMethodList" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="户名: ">
      <el-input v-model="ruleForm.brankAccountName" clearable size="mini" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="开户行: ">
      <el-input v-model="ruleForm.brankName" clearable size="mini" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="收款账号: " prop="receiveAccountNo">
      <el-input v-model="ruleForm.receiveAccountNo" clearable size="mini" placeholder="请输入" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="支出总金额: " prop="totalPayAmountCny">
      {{(count(ruleForm.totalPayAmountCny))}} CNY
      <el-tooltip content="支出总金额=营销费*汇率" placement="top" effect="light">
        <i class="el-icon-question" style="color:green"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>
<script>
import { NumberInput } from "@/components"
import { queryExchangeRateByName } from "@/api/finance/financeCost"
export default {
  name: "AmazonMarket",
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
        return ruleForm.totalPayAmountCny = (ruleForm.amount * ruleForm.amountCurrencyRate).toFixed(4)
      }
    }
  },
  data() {
    return {
      list: {
        orderCurrencyList: [{ label: "人民币", value: "CNY" }, { label: "美元", value: "USD" }, { label: "欧元", value: "EUR" }, { label: "港币", value: "HKD" }, { label: "日元", value: "JPY" }, { label: "英镑", value: "GBP" }, { label: "澳大利亚元", value: "AUD" }, { label: "加拿大元", value: "CAD" }, ],
        payMethodList: [{ label: "银行卡", value: 3 }, { label: "微信", value: 4 }, { label: "支付宝", value: 5 }, { label: "电汇", value: 6 }, { label: "汇票", value: 7 }, { label: "贷记", value: 8 }, { label: "支票", value: 9 }, { label: "其他", value: 10 },],
      }
    }
  },
  methods: {
    async amountChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.amountCurrency })
      this.ruleForm.amountCurrencyRate = res.data ? res.data : 0
      this.ruleForm.amountRmb = (this.ruleForm.amountCurrencyRate * this.ruleForm.amount).toFixed(4)
    },
  }
}
</script>