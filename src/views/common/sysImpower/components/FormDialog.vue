<template>
  <el-dialog :title="isFrom ? '新增渠道' : '编辑渠道'" :visible.sync="visible" width="747px" custom-class="formDiv" :before-close="close" @open="setValue">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <div class="formDialog">
        <div class="formDialog_item">
          <el-form-item label="平台: " prop="platform">
            <el-select v-model="ruleForm.platform" placeholder="全部" size="mini" filterable @change="handplatform">
              <el-option v-for="(item, index) in platformNameList" :key="index" :label="item.parameterValue" :value="item.parameterCode" />
            </el-select>
          </el-form-item>
        </div>
        <div class="formDialog_item" v-if="ruleForm.platform!=='10445'">
          <el-form-item label="渠道国家: " prop="country">
            <el-select v-model="ruleForm.country" placeholder="全部" size="mini" clearable filterable>
              <el-option v-for="(item, index) in countryList" :key="index" :label="item.parameterValue" :value="item.parameterValue" />
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
            <el-input v-model="ruleForm.storeNameAs" clearable size="mini" />
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="赛盒映射别名: ">
            <ScrollSelect v-model="ruleForm.shAccount" :list="shAccountList" />
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
        <!-- lazada -->
        <div v-if="this.ruleForm.platform==='10061'" key="1">
          <div class="formDialog_item">
            <el-form-item label="利润率: " prop="profitRate">
              <NumberInput v-model="ruleForm.profitRate" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
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
          <div class="formDialog_item">
            <el-form-item label="销售VAT税率" prop="vatTaxSales">
              <NumberInput v-model="ruleForm.vatTaxSales" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
        </div>
        <!-- walmart -->
        <div v-if="this.ruleForm.platform==='10376'" key="2">
          <div class="formDialog_item">
            <el-form-item label="利润率: " prop="profitRate">
              <NumberInput v-model="ruleForm.profitRate" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="clientId: " prop="define3">
              <template #label>
                <el-tooltip effect="light" content="此参数需登录沃尔玛后台获取" placement="top" style="float: right">
                  <div>
                    clientId<i class="el-icon-warning-outline" style="color: rgb(245,189,0);"></i>:
                  </div>
                </el-tooltip>
              </template>
              <el-input v-model="ruleForm.define3" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="clientSecret: " prop="define4">
              <el-input v-model="ruleForm.define4" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="汇兑损失率: " prop="vatTaxSales">
              <NumberInput v-model="ruleForm.vatTaxSales" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
        </div>
        <!-- shopee -->
        <div v-if="this.ruleForm.platform==='10062'" key="3">
          <div class="formDialog_item">
            <el-form-item label="利润率: " prop="profitRate">
              <NumberInput v-model="ruleForm.profitRate" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="汇兑损失率: " prop="vatTaxSales">
              <NumberInput v-model="ruleForm.vatTaxSales" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="佣金: " prop="commission">
              <NumberInput v-model="ruleForm.commission" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="退款率: " prop="refundRate">
              <NumberInput v-model="ruleForm.refundRate" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="交易手续费: " prop="dealFeesRate">
              <NumberInput v-model="ruleForm.dealFeesRate" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
        </div>
        <!-- rts -->
        <div v-if="this.ruleForm.platform==='10445'" key="4">
          <div class="formDialog_item">
            <el-form-item label="appKey: " prop="define3">
              <el-input v-model="ruleForm.define3" size="mini" clearable></el-input>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="appSecret: " prop="define4">
              <el-input v-model="ruleForm.define4" size="mini" clearable></el-input>
            </el-form-item>
          </div>
        </div>
        <!-- Amazon -->
        <div v-if="this.ruleForm.platform==='10057'" key="5">
          <AmazonDialog :visible.sync="amazonfromDialog" :ruleForm="ruleForm" :platformNameList="platformNameList" :countryList="countryList" :isTure="isAdd" @reset="reset" @handReset="handReset" />
        </div>

        <div style="clear:both"></div>
        <div style="text-align:right">
          <el-form-item label-width="0">
            <el-button @click="close" size="mini">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { NumberInput, ScrollSelect } from "@/components";
import { getSysParameterName, channelname, getSave, getUpdate, getSyslist, getUmsAdminByPlatform } from "@/api/common/sysImpower";
import AmazonDialog from "./AmazonDialog"
const defaultruleForm = {
  accountOwner: {},
  accountTeam: "",
  country: "",
  platform: "",
  storeName: "",
  storeNameAs: "",
  vatAccount: "",
  vatTax: null,
  vatTaxSales: null,
  profitRate: null,
  settlementCurrency: null,
  define4: null,
  define3: null,
  shAccount: "",
  commission: null,
  refundRate: null,
  dealFeesRate: null,
  chooseCountry: "",
  serviceAdminName: "",
}
export default {
  name: "FormDialog",
  components: {
    NumberInput,
    ScrollSelect,
    AmazonDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isFrom: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ruleForm: Object.assign({}, defaultruleForm),
      rules: {
        platform: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        country: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
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
        vatAccount: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        vatTax: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        vatTaxSales: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        profitRate: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        settlementCurrency: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        define4: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        define3: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        shAccount: [{ required: true, message: "此项不能为空", trigger: "change" }],
        commission: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        refundRate: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        dealFeesRate: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        serviceAdminName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      dialogFormVisible: false,
      countryList: [],
      platformNameList: [],
      currencyList: [],
      shAccountList: [],
      principalList: [],
      amazonfromDialog: false,
      isAdd: true
    }
  },
  beforeDestroy() {
    this.close()
  },
  created() {
    this.getType();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.ruleForm = Object.assign({}, defaultruleForm)
      this.$nextTick(() => {
        if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
      })
    },
    getType() {
      getSysParameterName({
        isTopClass: 0,
        parameterSearchType: "平台",
      }).then((res) => {
        this.platformNameList = res.data;
      });
    },
    handplatform() {
      const platFrom = this.platformNameList.length > 0 ? this.platformNameList.find(i => { return i.parameterCode == this.ruleForm.platform }).parameterValue : "";
      let Value = "";
      if (platFrom == "Amazon") {
        Value = "Amazon 销售伙伴 API 端点"
      } else {
        Value = `${platFrom}国家`
      }
      getSysParameterName({
        isTopClass: 0,
        parameterSearchType: Value,
      }).then((res) => {
        this.countryList = res.data;
        if (this.isFrom) {
          this.ruleForm.shAccount = ""
          this.currencyList = []
          this.ruleForm.settlementCurrency = ""
          if (platFrom == "Amazon") {
            this.ruleForm.country = this.countryList.length > 0 ? this.countryList.find(i => { return i.parameterSearchType == `Amazon 销售伙伴 API 端点` }).parameterValue : ""
          } else {
            this.ruleForm.country = this.countryList.length > 0 ? this.countryList.find(i => { return i.parameterSearchType == `${platFrom}国家` }).parameterValue : ""
          }
        }
        if (this.ruleForm.platform == "10376") {
          getUmsAdminByPlatform({ platform: 'Walmart' }).then(res => {
            this.principalList = res.data
          })
          channelname({ orderSourceType: 45 }).then(res => {
            this.shAccountList = res.data
          })
          this.currencyList = [{ parameterValue: "USD", parameterCode: "10373" }]
        } else if (this.ruleForm.platform == "10061") {
          getUmsAdminByPlatform({ platform: 'lazada' }).then(res => {
            this.principalList = res.data
          })
          channelname({ orderSourceType: 58 }).then(res => {
            this.shAccountList = res.data
          })
          getSyslist({ pageNum: 1, pageSize: 50, isTopClass: 0, parameterSearchType: "lazada结算币种" }).then(res => {
            this.currencyList = res.data.list
          })
        } else if (this.ruleForm.platform == "10062") {
          getUmsAdminByPlatform({ platform: 'shopee' }).then(res => {
            this.principalList = res.data
          })
          channelname({ orderSourceType: 42 }).then(res => {
            this.shAccountList = res.data
          })
          getSyslist({ pageNum: 1, pageSize: 50, isTopClass: 0, parameterSearchType: "shopee币种" }).then(res => {
            this.currencyList = res.data.list
          })
        } else if (this.ruleForm.platform == "10445") {
          getUmsAdminByPlatform({ platform: 'RTS' }).then(res => {
            this.principalList = res.data
          })
          channelname({ orderSourceType: 76 }).then(res => {
            this.shAccountList = res.data
          })
          getSyslist({ pageNum: 1, pageSize: 50, isTopClass: 0, parameterSearchType: "RTS币种" }).then(res => {
            this.currencyList = res.data.list
          })
        } else if (this.ruleForm.platform == "10057") {
          if (this.isFrom) {
            this.isAdd = true
          } else {
            this.isAdd = false
          }
          this.amazonfromDialog = true

        }
      });
    },
    async setValue() {
      if (JSON.stringify(this.row) !== "{}") {
        this.ruleForm = { ...this.row }
        if (this.row.shAccount == "") {
          this.ruleForm.shAccount = ""
        } else {
          this.ruleForm.shAccount = this.row.shAccount.split(",")
        }
        this.handplatform()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const shAccount = this.ruleForm.shAccount.length > 0 ? this.ruleForm.shAccount.join(",") : ""
          // const parameterCode = this.platformNameList.find(i => { return i.parameterCode == this.ruleForm.platform }) || {}
          // const parameterValue = parameterCode.parameterValue || ''
          const chooseCountry = this.countryList.length > 0 ? this.countryList.find(i => { return i.parameterValue == this.ruleForm.country }).parameterCode : ""
          //新建
          if (this.isFrom) {
            getSave({ ...this.ruleForm, shAccount, chooseCountry }).then((res) => {
              this.$message.success(res.message);
              this.close();
              this.$emit("request")
            });
          } else {
            //编辑
            getUpdate({ ...this.ruleForm, shAccount, chooseCountry }).then((res) => {
              this.$message.success(res.message);
              this.close();
              this.$emit("request")
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reset(e) {
      if (e) {
        this.$nextTick(() => {
          this.ruleForm.platform = e
        })
        this.handplatform()
      } else {
        this.close();
      }
    },
    handReset() {
      this.close();
      this.$emit("request")
    }
  }
}
</script>
<style lang="scss" scoped>
.formDiv .el-dialog__body {
  .el-form {
    .formDialog {
      overflow: hidden;
      .formDialog_item {
        width: 330px;
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