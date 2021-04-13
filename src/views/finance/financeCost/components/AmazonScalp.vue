<template>
  <!-- <el-form ref="form" label-width="170px" size="mini" :model="ruleForm" :rules="rule" > -->
  <div>
    <el-form-item label="刷单类型:" prop="swipeOrderType">
      <el-radio-group v-model="ruleForm.swipeOrderType">
        <el-radio :label="1">机刷</el-radio>
        <el-radio :label="2">测试单</el-radio>
      </el-radio-group>
    </el-form-item>
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
    <!-- <el-form-item label="实际打款金额: " prop="realPaymentCNY">
      <NumberInput v-model="ruleForm.realPaymentCNY"  max="1000000" float="4" min="0" style="width:220px" /> <span>CNY</span>
    </el-form-item> -->
    <el-form-item label="PayPal退款交易号: " prop="paypalRefundTradeNo">
      <el-input v-model="ruleForm.paypalRefundTradeNo" clearable size="mini" placeholder="输入PayPal退款产生的交易号" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="是否有佣金:" prop="isCommission">
      <el-radio-group v-model="ruleForm.isCommission" @change="isCommissionChange">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-if="ruleForm.isCommission===1">
      <el-form-item label="佣金: " prop="swipeCommission">
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
        <el-input v-model="ruleForm.receiveAccountNo" clearable size="mini" placeholder="输入收款账号" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="付款PayPal: ">
        <el-input v-model="ruleForm.payAccountNo" clearable size="mini" placeholder="输入PayPal注册邮箱" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="PayPal手续费: " prop="processFeeAmount">
        <NumberInput v-model="ruleForm.processFeeAmount" max="1000000" float="4" min="0" style="width:220px" @change="processCurrencyChange" />
        <el-select v-model="ruleForm.processCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="processCurrencyChange">
          <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span> <b>{{ruleForm.processFeeAmountRmb}}</b> CNY</span>
        <el-tooltip :content="'汇率:'+ruleForm.processCurrencyRate" placement="top" effect="light">
          <i class="el-icon-coin" style="color:green"></i>
        </el-tooltip>
      </el-form-item>
    </div>
    <div v-else>
      <el-form-item label="支付方式:" prop="payMethod">
        <el-radio-group v-model="ruleForm.payMethod">
          <el-radio :label="1">PayPal</el-radio>
          <el-radio :label="2">福卡</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="付款账号: " prop="payAccountNo">
        <el-input v-model="ruleForm.payAccountNo" clearable size="mini" placeholder="输入PayPal注册邮箱或福卡卡号" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="收款账号: " prop="receiveAccountNo">
        <el-input v-model="ruleForm.receiveAccountNo" clearable size="mini" placeholder="输入收款账号" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="手续费: " prop="processFeeAmount">
        <NumberInput v-model="ruleForm.processFeeAmount" float="4" min="0" style="width:220px" @change="processCurrencyChange" />
        <el-select v-model="ruleForm.processCurrency" placeholder="币种" size="mini" clearable class="input-width" filterable style="width:100px" @change="processCurrencyChange">
          <el-option v-for="(item, index) in list.orderCurrencyList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span> <b>{{ruleForm.processFeeAmountRmb}}</b> CNY</span>
        <el-tooltip :content="'汇率:'+ruleForm.processCurrencyRate" placement="top" effect="light">
          <i class="el-icon-coin" style="color:green"></i>
        </el-tooltip>
      </el-form-item>
    </div>
    <el-form-item label="支出总金额: " prop="totalPayAmountCny">
      {{count(ruleForm.totalPayAmountCny)}} CNY
      <span v-if="ruleForm.isCommission===1">
        <el-tooltip content="支出总金额=手续费*汇率+订单金额*汇率+佣金*汇率" placement="top" effect="light">
          <i class="el-icon-question" style="color:green"></i>
        </el-tooltip>
      </span>
      <span v-if="ruleForm.isCommission===0">
        <el-tooltip content="支出总金额=订单金额*汇率+手续费*汇率" placement="top" effect="light">
          <i class="el-icon-question" style="color:green"></i>
        </el-tooltip>
      </span>
    </el-form-item>
  </div>
  <!-- </el-form> -->
</template>
<script>
import { NumberInput } from "@/components"
import { queryExchangeRateByName, queryOrderAmount } from "@/api/finance/financeCost"
export default {
  name: "AmazonScalp",
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
        if (ruleForm.isCommission == 1) {
          return ruleForm.totalPayAmountCny = ((ruleForm.processFeeAmount * ruleForm.processCurrencyRate) + (ruleForm.swipeCommission * ruleForm.commissionCurrencyRate) + (ruleForm.orderAmount * ruleForm.orderCurrencyRate)).toFixed(4)
        } else {
          return ruleForm.totalPayAmountCny = ((ruleForm.processFeeAmount * ruleForm.processCurrencyRate) + (ruleForm.orderAmount * ruleForm.orderCurrencyRate)).toFixed(4)
        }
      }
    }
  },
  data() {
    return {
      list: {
        orderCurrencyList: [{ label: "人民币", value: "CNY" }, { label: "美元", value: "USD" }, { label: "欧元", value: "EUR" }, { label: "港币", value: "HKD" }, { label: "日元", value: "JPY" }, { label: "英镑", value: "GBP" }, { label: "澳大利亚元", value: "AUD" }, { label: "加拿大元", value: "CAD" },],
        payMethodList: [{ label: "银行卡", value: 3 }, { label: "微信", value: 4 }, { label: "支付宝", value: 5 }, { label: "电汇", value: 6 }, { label: "汇票", value: 7 }, { label: "贷记", value: 8 }, { label: "支票", value: 9 }, { label: "其他", value: 10 },],
      }
    }
  },
  methods: {
    async orderCurrencyChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.orderCurrency })
      this.ruleForm.orderCurrencyRate = res.data ? res.data : 0
      this.ruleForm.orderAmountRMB = (this.ruleForm.orderCurrencyRate * this.ruleForm.orderAmount).toFixed(4)
    },
    async processCurrencyChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.processCurrency })
      this.ruleForm.processCurrencyRate = res.data ? res.data : 0
      this.ruleForm.processFeeAmountRmb = (this.ruleForm.processCurrencyRate * this.ruleForm.processFeeAmount).toFixed(4)
    },
    async swipeCommissionChange() {
      const res = await queryExchangeRateByName({ currencyEN: this.ruleForm.commissionCurrency })
      this.ruleForm.commissionCurrencyRate = res.data ? res.data : 0
      this.ruleForm.swipeCommissionRMB = (this.ruleForm.commissionCurrencyRate * this.ruleForm.swipeCommission).toFixed(4)
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

    },
    isCommissionChange() {
      const { ruleForm } = this
      ruleForm.payMethod = null
      ruleForm.receiveAccountNo = ""
      ruleForm.payAccountNo = ""
      ruleForm.processFeeAmount = null
      ruleForm.processCurrency = ""
      ruleForm.processFeeAmountRmb = 0
      ruleForm.processCurrencyRate = 0
    }
  }
}
</script>