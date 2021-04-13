<template>
  <vueScroll>
    <el-form ref="form" :model="listQuery" label-width="100px" inline :rules="rules" size="mini" :disabled="this.check">
      <el-form-item label="支付类型:" prop="payType">
        <el-select v-model="listQuery.payType" placeholder="请选择" size="mini" clearable class="input-width" filterable @change="payTypeChange">
          <el-option v-for="(item, index) in typeList.payTypeList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付周期:" prop="payWeek">
        <el-select v-model="listQuery.payWeek" placeholder="请选择" size="mini" clearable class="input-width" filterable>
          <el-option v-for="(item, index) in typeList.payWeekList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" v-if="listQuery.payWeek==8" style="margin-left:-14px">
        <NumberInput v-model="listQuery.payRate" max="50" min="0" float="2" style="width:100px;" clearable /><i style="position: absolute;right: 30px;top: 1px">%</i>
      </el-form-item><br>
      <el-form-item label="结算时间:">
        <el-select v-model="listQuery.settlementTimeType" placeholder="请选择" size="mini" clearable class="input-width" filterable>
          <el-option v-for="(item, index) in typeList.settlementTimeTypeList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="收款银行信息:">
        <el-form-item label="" prop="collectionType">
          <el-checkbox v-model="listQuery.collectionType">启用</el-checkbox>
        </el-form-item>
        <el-tooltip content="标红为必填项" placement="right" effect="light" v-if="listQuery.collectionType">
          <i class="el-icon-question" style="color:green"></i>
        </el-tooltip>
      </el-form-item>
      <div v-if="this.listQuery.collectionType">
        <el-form-item prop="receivingBanks">
          <el-table style="width: 100%" :data="listQuery.receivingBanks" border max-height="390px" :header-cell-style="{ 'background-color': 'rgb(218, 221, 227)' }">
            <el-table-column width="150" align="center">
              <template #header>
                <div style="color:black"><span style="color:#D9001B">收款银行名称</span></div>
              </template>
              <template #default="{ row , $index}">
                <el-form-item label="" :prop="`receivingBanks.${$index}.bankName`" :rules="rules.tableRow1">
                  <el-select v-model="row.bankName" placeholder="请选择" size="mini" clearable filterable>
                    <el-option v-for="(item, index) in typeList.bankList" :key="index" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="170" align="center">
              <template #header>
                <div style="color:black"><span style="color:#D9001B">支行名称</span></div>
              </template>
              <template #default="{ row , $index }">
                <el-form-item label="" :prop="`receivingBanks.${$index}.branchName`" :rules="rules.tableRow2">
                  <el-input v-model="row.branchName" placeholder="请输入" size="mini" maxlength="64"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="180" align="center">
              <template #header>
                <div style="color:black"><span style="color:#D9001B">银行账号</span></div>
                <div style="color:black"><span style="color:#D9001B">收款人名称</span></div>
                <div style="color:black"><span>收款人身份证号</span></div>
              </template>
              <template #default="{ row , $index }">
                <el-form-item label="" :prop="`receivingBanks.${$index}.bankAccount`" :rules="rules.tableRow3">
                  <el-input v-model="row.bankAccount" placeholder="请输入银行账号" size="mini" maxlength="100"></el-input>
                </el-form-item>

                <el-form-item label="" :prop="`receivingBanks.${$index}.payeeUsername`" :rules="rules.tableRow4">
                  <el-input v-model="row.payeeUsername" placeholder="请输入收款人名称" size="mini" maxlength="20"></el-input>
                </el-form-item>
                <el-input v-model="row.payeeBankCard" placeholder="请输入收款人身份证号" size="mini" maxlength="20"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="110" align="center">
              <template #header>
                <div style="color:black"><span style="color:#D9001B">币种</span></div>
              </template>
              <template #default="{ row , $index }">

                <el-form-item label="" :prop="`receivingBanks.${$index}.currency`" :rules="rules.tableRow5">
                  <el-select v-model="row.currency" placeholder="请选择" size="mini" clearable filterable>
                    <el-option v-for="(item, index) in typeList.currencyList" :key="index" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="110" align="center">
              <template #header>
                <div style="color:black"><span>收款退税账户</span></div>
              </template>
              <template #default="{ row }">
                <el-radio-group v-model="row.isTaxRefundAccount">
                  <el-radio :label="true">是</el-radio>
                  <div style="margin-top:10px"></div>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column width="110" align="center">
              <template #header>
                <div style="color:black"><span>默认收款账户</span></div>
              </template>
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.isDefaultAccount" @change="isDefaultAccountChange(scope.row,scope.$index)">
                  <el-radio :label="true">是</el-radio>
                  <div style="margin-top:10px"></div>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column width="123" align="center">
              <template #header>
                <div style="color:black"><span>操作</span></div>
              </template>
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="add">添加</el-button>
                <el-button size="mini" type="text" @click="remove(scope.row,scope.$index)" v-show="scope.$index!==0">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>
    <div style="text-align:center; position: absolute; bottom:0px; width: 100%;">
      <el-button @click="home.close">取消</el-button>
      <el-button @click="home.submit" type="primary" :loading="home.submitLoading" v-if="!this.check">保存</el-button>
    </div>
  </vueScroll>
</template>
<script>
import { NumberInput } from '@/components'
export default {
  name: "Pay",
  props: {
    home: null,
    check: {
      type: Boolean,
      default: false
    }
  },
  components: { NumberInput },
  data() {
    const tableRowRules = [{
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { receivingBanks } = this.listQuery
        const { bankName} = receivingBanks[index]
        if (!bankName) {
          return cb(new Error("此项为必填项"));
        }
        cb();
      },
      trigger: ['change', 'blur'],
    },
    {
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { receivingBanks } = this.listQuery
        const { branchName } = receivingBanks[index]
        if (!branchName) {
          return cb(new Error("此项为必填项"));
        }
        cb();
      },
      trigger: ['change', 'blur'],
    },
    {
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { receivingBanks } = this.listQuery
        const { bankAccount } = receivingBanks[index]
        if (!bankAccount) {
          return cb(new Error("此项为必填项"));
        }
        cb();
      },
      trigger: ['change', 'blur'],
    },
    {
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { receivingBanks } = this.listQuery
        const { payeeUsername, } = receivingBanks[index]
        if (!payeeUsername) {
          return cb(new Error("此项为必填项"));
        }
        cb();
      },
      trigger: ['change', 'blur'],
    },
    {
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { receivingBanks } = this.listQuery
        const { currency,} = receivingBanks[index]
        if (!currency) {
          return cb(new Error("此项为必填项"));
        }
        cb();
      },
      trigger: ['change', 'blur'],
    }]
    return {
      listQuery: {},
      typeList: {},
      rules: {
        payType: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        payWeek: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        collectionType: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        tableRow1: tableRowRules[0],
        tableRow2: tableRowRules[1],
        tableRow3: tableRowRules[2],
        tableRow4: tableRowRules[3],
        tableRow5: tableRowRules[4],
      },
    }
  },
  created() {
    this.listQuery = this.home.listQuery
    this.typeList = this.home.list
    this.typeList.payTypeList = [{ label: "线下转账付款", value: 1 }, { label: "阿里账期付款", value: 2 }, { label: "网络在线付款", value: 3 }]
  },
  watch: {
    'listQuery.receivingBanks': function (newValue) {
      if (newValue.length == 1) {
        newValue[0].isDefaultAccount = true
      }
    }
  },
  methods: {
    add() {
      if (this.listQuery.receivingBanks.length > 19) return this.$message.warning("最多20条信息")
      this.listQuery.receivingBanks.push({ bankName: "", branchName: "", currency: "CNY", payeeUsername: "", bankAccount: "", payeeBankCard: "", isTaxRefundAccount: false, isDefaultAccount: false })
    },
    remove(row, index) {
      if (row.isDefaultAccount) {
        this.listQuery.receivingBanks[0].isDefaultAccount = true
      }
      this.listQuery.receivingBanks.splice(index, 1)
    },
    isDefaultAccountChange(row, index) {
      if (this.listQuery.receivingBanks.findIndex(i => { return i.isDefaultAccount == true }) == -1) {
        this.listQuery.receivingBanks[index].isDefaultAccount = true
        this.$message.warning("请至少选择一个默认收款账户")
      }
      if (!row.isDefaultAccount) return
      for (let i in this.listQuery.receivingBanks) {
        this.listQuery.receivingBanks[i].isDefaultAccount = false
        this.listQuery.receivingBanks[index].isDefaultAccount = true
      }
    },
    payTypeChange(payType, check) {
      const { listQuery, typeList } = this
      if (!check) { listQuery.payWeek = "" }
      if (!payType) return typeList.payWeekList = [], listQuery.payWeek = ""
      switch (payType) {
        case 1:
          return typeList.payWeekList = [{ label: "周结", value: 1 }, { label: "半月结", value: 2 }, { label: "月结", value: 3 }, { label: "月结30天", value: 4 }, { label: "月结60天", value: 5 },  { label: "货到付款", value: 7 }]
        case 2:
          return typeList.payWeekList = [{ label: "按固定结算日期30天", value: 10 }, { label: "按收货时间7天", value: 11 }, { label: "按收货时间10天", value: 12 }, { label: "按收货时间20天", value: 13 }, { label: "按收货时间30天", value: 14 }, { label: "按收货时间45天", value: 15 }, { label: "按收货时间60天", value: 16 }, { label: "按收货时间90天", value: 17 }]
        case 3:
          return typeList.payWeekList = [{ label: "现结", value: 9 }, { label: "款到发货", value: 6 }, { label: "预付款", value: 8 }]
      }
    },
    validate() {
      let callBackValid;
      this.$refs.form.validate((valid) => { callBackValid = valid })
      return callBackValid
    },
  }
}
</script>
<style lang="scss" scoped>
.el-radio {
  margin-right: 10px;
}
</style>