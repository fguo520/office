<template>
  <el-dialog width="1000px" :title="list.title" :visible.sync="visible" append-to-body :before-close="close" @open="open">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <div class="inputDialog">
        <div class="formDialog_item">
          <el-form-item label="国家: " prop="settlementCurrency">
            <el-select v-model="ruleForm.chooseCountryValue" placeholder="全部" size="mini" clearable class="input-width" filterable @change="handCountry">
              <el-option v-for="(item, index) in typeList.chooseCountryValueList" :key="index" :label="item.parameterName" :value="item.parameterValue" />
            </el-select>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="渠道名称: " prop="storeName">
            <el-input v-model="ruleForm.storeName" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="渠道别名: " prop="storeNameAs">
            <el-input v-model="ruleForm.storeNameAs" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="赛盒映射别名: ">
            <!-- <ScrollSelect v-model="ruleForm.shAccount" :list="typeList.shAccountList" /> -->
            <TreeSelect v-model="ruleForm.shAccount" :prop="{label:'chanelName',value:'chanelName'}" ref="ElSelect" :list="shAccountList" v-if="isShAccount" />
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="销售小组: " prop="accountTeam">
            <el-input v-model="ruleForm.accountTeam" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="账号负责人: " prop="accountOwner">
            <!-- <el-input v-model="ruleForm.accountOwner" clearable size="mini"></el-input> -->
            <el-select v-model="ruleForm.accountOwner" placeholder="全部" size="mini" clearable class="input-width" filterable value-key="id">
              <el-option v-for="(item, index) in principalList" :key="index" :label="item.name" :value="item" />
            </el-select>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="结算币种: " prop="settlementCurrency">
            <el-select v-model="ruleForm.settlementCurrency" placeholder="全部" size="mini" clearable class="input-width" filterable>
              <el-option v-for="(item, index) in currencyList" :key="index" :label="item.parameterValue" :value="item.parameterCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="汇率折损率: " prop="vatTaxSales">
            <NumberInput v-model="ruleForm.vatTaxSales" max="100" min="0" float>
              <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
            </NumberInput>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="客服人员: " prop="serviceAdminName">
            <el-input v-model="ruleForm.serviceAdminName" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="VAT税号: " prop="vatAccount">
            <el-input v-model="ruleForm.vatAccount" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="VAT税率: " prop="vatTax">
            <NumberInput v-model="ruleForm.vatTax" max="100" min="0" float>
              <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
            </NumberInput>
          </el-form-item>
        </div>
      </div>
      <div style="text-align:right">
        <el-form-item label-width="0">
          <el-button @click="close" size="mini">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { NumberInput, ScrollSelect, TreeSelect } from "@/components";
import { getCountryChannelTree, getSyslist, checkAmazonDetail, getUmsAdminByPlatform } from "@/api/common/sysImpower"
const defaultruleForm = {
  chooseCountryValue: "",
  storeName: "",
  storeNameAs: "",
  shAccount: [],
  accountTeam: "",
  accountOwner: "",
  settlementCurrency: null,
  vatTaxSales: null,
  serviceAdminName: "",
  vatAccount: "",
  vatTax: null
}
export default {
  name: 'InputDialog',
  components: {
    NumberInput,
    ScrollSelect,
    TreeSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Object,
      default: () => {
        return {
          chooseCountryValueList: []
        }
      }
    },
    inputList: {
      type: Array,
      default: () => []
    },
    list: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      ruleForm: Object.assign({}, defaultruleForm),
      rules: {
        accountOwner: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        accountTeam: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        storeName: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        storeNameAs: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        vatTaxSales: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        settlementCurrency: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        shAccount: [{ required: true, message: "此项不能为空", trigger: "change" }],
        serviceAdminName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        vatAccount: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        vatTax: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      shAccountList: [],
      currencyList: [],
      principalList: [],
      isShAccount: false
    }
  },
  created() {
    getUmsAdminByPlatform({ platform: 'Amazon' }).then(res => {
      this.principalList = res.data
    })
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.$nextTick(() => {
        this.ruleForm = Object.assign({}, defaultruleForm)
        this.shAccountList = []
        this.currencyList = []
      })
      this.isShAccount = false
    },
    open() {
      this.isShAccount = true
      if (Object.keys(this.list.rows).length == 0) return
      this.$nextTick(() => {
        this.handCountry(this.list.rows.chooseCountryValue, true)
      })
    },
    async handCountry(chooseCountryValue, check) {
      if (!check) {
        this.ruleForm.shAccount = []
        this.ruleForm.settlementCurrency = ""
      }
      const country = this.typeList.chooseCountryValueList.length > 0 ? this.typeList.chooseCountryValueList.find(i => { return i.parameterValue == chooseCountryValue }).parameterName : ""
      const res = await Promise.all([getCountryChannelTree({ countryName: country }), getSyslist({ pageNum: 1, pageSize: 50, isTopClass: 0, parameterSearchType: "Amazon币种", parameterName: country })])
      this.shAccountList = res[0].data
      this.currencyList = res[1].data.list
      if (Object.keys(this.list.rows).length == 0) return
      this.ruleForm = { ...this.list.rows }
      this.ruleForm.shAccount = this.ruleForm.shAccount.split(",")
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const shAccount = this.ruleForm.shAccount.length > 0 ? this.ruleForm.shAccount.join(",") : ""
          const chooseCountryCode = this.typeList.chooseCountryValueList.find(i => { return i.parameterValue == this.ruleForm.chooseCountryValue }).parameterCode
          const chooseCountryName = this.typeList.chooseCountryValueList.find(i => { return i.parameterValue == this.ruleForm.chooseCountryValue }).parameterName
          const lmSysPlatformAuthDetailsList = { ...this.ruleForm, shAccount, chooseCountryCode, chooseCountryName }
          for (let i = 0; i < this.inputList.length; i++) {
            if (Object.keys(this.list.rows).length == 0) {
              if (this.inputList[i].storeName == lmSysPlatformAuthDetailsList.storeName) { this.$message.warning("渠道名字重复"); return false }
              if (this.inputList[i].storeNameAs == lmSysPlatformAuthDetailsList.storeNameAs) { this.$message.warning("渠道别名重复"); return false }
              const isTrue = this.ruleForm.shAccount.every(item => { return this.inputList[i].shAccount.indexOf(item) == -1 })
              if (!isTrue) { this.$message.warning("赛盒映射别名重复"); return false }
            }
          }
          checkAmazonDetail(lmSysPlatformAuthDetailsList).then(res => {
            if (res.code == 200) {
              this.$message.success(res.data)
              let arr = {}
              if (Object.keys(this.list.rows).length == 0) {
                arr = { label: "push", value: lmSysPlatformAuthDetailsList }
              } else {
                arr = { label: "splice", value: lmSysPlatformAuthDetailsList }
              }
              this.$emit("push", arr)
              this.close()
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__body {
  .el-form {
    .inputDialog {
      overflow: hidden;
      .formDialog_item {
        width: 300px;
        height: 60px;
        float: left;
        .el-form-item /deep/.el-form-item__content {
          width: 180px;
        }
      }
    }
  }
}
</style>