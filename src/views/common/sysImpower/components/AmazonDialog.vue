<template>
  <el-dialog width="1200px" :title="isTure?'新增亚马逊渠道':'编辑亚马逊渠道'" :visible.sync="visible" append-to-body :before-close="close" @open="open" @close="clo">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <div class="formDialog">
        <div>
          <el-form-item label="平台: " prop="platform">
            <el-select v-model="ruleForm.platform" placeholder="全部" size="mini" filterable @change="handplatform" :disabled="!this.isTure">
              <el-option v-for="(item, index) in platformNameList" :key="index" :label="item.parameterValue" :value="item.parameterCode" />
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="code: " prop="define3">
            <el-input v-model="ruleForm.define3" size="mini" clearable></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="sellingPartnerId: " prop="define4">
            <el-input v-model="ruleForm.define4" size="mini" clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="formDialog_item">
        <el-form-item label="区域: " prop="country">
          <el-select v-model="ruleForm.country" placeholder="全部" size="mini" filterable @change="handCountry" :disabled="!this.isTure">
            <el-option v-for="(item, index) in countryList" :key="index" :label="item.parameterValue" :value="item.parameterValue" />
          </el-select>
        </el-form-item>
      </div>
      <div style="margin-bottom:10px">
        <el-button type="primary" @click="handAdd" size="mini">添加</el-button>
      </div>

      <el-table ref="tableContainer" style="width: 100%" :data="lmSysPlatformAuthDetailsList" border height="250px" max-height="250px" :header-cell-style="{ 'background-color': '#dadde3' }">
        <el-table-column label="序号" align="center" width="50" type="index"></el-table-column>
        <el-table-column label="国家" align="center" width="100">
          <template #default="{ row }">
            <div>{{setChooseCountryValue(row.chooseCountryValue)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="渠道名" align="center" width="140" prop="storeName">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" content="渠道名称" placement="left">
                <div class="tooltipClass">{{ row.storeName }}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="渠道别名" placement="left">
                <div class="tooltipClass">{{ row.storeNameAs }}</div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="VAT" align="center" width="150" prop="accountOwner">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" content="VAT税号" placement="left">
                <div class="tooltipClass">{{ row.vatAccount  }}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="VAT税率" placement="left">
                <div class="tooltipClass">{{ row.vatTax }}<span v-show="row.vatTax"> %</span></div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="赛盒映射别名" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="row.shAccount " placement="top">
                <div class="tooltipClass">{{ row.shAccount }}</div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="销售小组" align="center" width="100" prop="accountTeam"></el-table-column>
        <el-table-column label="操作人" align="center" width="100" prop="accountOwner">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" content="账号负责人" placement="left">
                <div class="tooltipClass">{{ row.accountOwner.name  }}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="客服人员" placement="left">
                <div class="tooltipClass">{{ row.serviceAdminName }}</div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="结算币种" align="center" width="100">
          <template #default="{ row }">
            <div>{{setSettlementCurrency(row.settlementCurrency)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="汇兑折损率" align="center" width="100" prop="vatTaxSales">
          <template #default="{ row }">
            <div>{{row.vatTaxSales}} %</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditor(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top: 20px">
        <el-form-item label-width="0">
          <el-button @click="close" size="mini">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
        </el-form-item>
      </div>
    </el-form>
    <InputDialog :visible.sync="inputDialog" :typeList="typeList" @push="handPush" :list="list" :inputList="lmSysPlatformAuthDetailsList" ref="inputDialog" />
  </el-dialog>
</template>
<script>
import { channelname, getSyslist, getSysParameterCountry, saveAmazon, updateAmazon, getCountryChannelTree } from "@/api/common/sysImpower"
import InputDialog from "./InputDialog"
export default {
  name: "AmazonDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    ruleForm: {
      type: Object,
      default: () => { }
    },
    platformNameList: {
      type: Array,
      default: () => []
    },
    countryList: {
      type: Array,
      default: () => []
    },
    isTure: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        platform: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        country: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        define4: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        define3: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      typeList: {
        shAccountList: [],
        currencyList: [],
        chooseCountryValueList: []
      },
      lmSysPlatformAuthDetailsList: [],
      inputDialog: false,
      list: {
        title: "",
        rows: {}
      }
    }
  },
  beforeDestroy() {
    this.close()
  },
  components: { InputDialog },
  computed: {
    setSettlementCurrency() {
      return (value) => {
        return this.typeList.currencyList.length > 0 ? this.typeList.currencyList.find(item => { return item.parameterCode == value }).parameterValue : ""
      }
    },
    setChooseCountryValue() {
      return (value) => {
        return this.typeList.chooseCountryValueList.length > 0 ? this.typeList.chooseCountryValueList.find(item => { return item.parameterValue == value }).parameterName : ""
      }
    },
  },
  methods: {
    async open() {
      await this.handCountry()
      await this.handplatform()
      if (!this.isTure) {
        this.lmSysPlatformAuthDetailsList = this.ruleForm.lmSysPlatformAuthDetailsList
        console.log(this.lmSysPlatformAuthDetailsList)
      }
    },
    async handplatform() {
      if (this.ruleForm.platform !== "10057") {
        this.$emit("reset", this.ruleForm.platform)
        this.$emit("update:visible", false)
      }
      // getCountryChannelTree({ countryName: "" }),
      const res = await Promise.all([getSyslist({ pageNum: 1, pageSize: 50, isTopClass: 0, parameterSearchType: "Amazon币种", parameterName: "" })])
      // this.typeList.shAccountList = res[0].data
      this.typeList.currencyList = res[0].data.list
    },
    async handCountry() {
      const res = await getSysParameterCountry({ parameterSearchType: "Amazon地区对应国家", parameterSearchName: this.ruleForm.country })
      this.typeList.chooseCountryValueList = res.data
      this.lmSysPlatformAuthDetailsList = []
    },
    close() {
      this.$emit("update:visible", false)
      this.$nextTick(() => {
        this.lmSysPlatformAuthDetailsList = []
        this.ruleForm.define4 = ""
        this.ruleForm.define3 = ""
      })
    },
    clo() {
      this.$emit("reset")
    },
    handAdd() {
      this.inputDialog = true
      this.list.title = "添加"
      this.list.rows = {}
      // this.$refs.inputDialog.$refs.ElSelect.$refs.tree.setCheckedKeys([])
    },
    handleEditor(row) {
      this.inputDialog = true
      this.list.title = "编辑"
      this.list.rows = { ...row }
    },
    handPush(e) {
      if (e.label == 'push') {
        this.lmSysPlatformAuthDetailsList.push(e.value)
      } else {
        const index = this.lmSysPlatformAuthDetailsList.findIndex(i => { return i.id == e.value.id })
        this.lmSysPlatformAuthDetailsList.splice(index, 1, e.value)
      }
    },
    handleRemove(index) {
      this.lmSysPlatformAuthDetailsList.splice(index, 1)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const lmSysPlatformAuthDetailsList = this.lmSysPlatformAuthDetailsList
          const shAccount = ""
          const chooseCountry = this.countryList.length > 0 ? this.countryList.find(i => { return i.parameterValue == this.ruleForm.country }).parameterCode : ""
          if (lmSysPlatformAuthDetailsList.length == 0) {
            this.$message.warning("请添加")
            return false
          }
          if (this.isTure) {
            saveAmazon({ ...this.ruleForm, lmSysPlatformAuthDetailsList, chooseCountry }).then(res => {
              this.$message.success(res.message);
              this.$emit("handReset")
              this.close();
            })
          } else {
            updateAmazon({ ...this.ruleForm, lmSysPlatformAuthDetailsList, shAccount, chooseCountry }).then(res => {
              this.$message.success(res.message);
              this.$emit("handReset")
              this.close();
            })
          }

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
    .formDialog {
      overflow: hidden;
      display: flex;
      .el-form-item /deep/.el-form-item__content {
        width: 180px;
      }
    }
    .formDialog_item {
      .el-form-item /deep/.el-form-item__content .el-select {
        width: 800px;
      }
    }
  }
}
</style>