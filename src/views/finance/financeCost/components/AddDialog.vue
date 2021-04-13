<template>
  <el-dialog :title="addDialog.title" :visible.sync="visible" width="800px" :before-close="reset" @open="open" :close-on-click-modal="false">
    <el-form ref="form" label-width="170px" size="mini" :model="ruleForm" :rules="rules" :disabled="addDialog.disabled">
      <el-form-item label="费用审核号:">
        <el-input clearable v-model="ruleForm.applyNo" size="mini" style="width:220px" disabled></el-input>
      </el-form-item>
      <el-form-item label="平台:" prop="platformName">
        <el-select v-model="ruleForm.platformName" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:220px" @change="platformChange">
          <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.parameterName" :value="item.parameterName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用类型:" prop="feeTypeCode">
        <el-select v-model="ruleForm.feeTypeCode" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:220px" @change="feeTypeCodeChange">
          <el-option v-for="(item, index) in type.feeTypeList" :key="index" :label="item.parameterValue" :value="item.parameterCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门:" prop="departmentCode">
        <el-select v-model="ruleForm.departmentCode" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:220px">
          <el-option v-for="(item, index) in type.departmentList" :key="index" :label="item.platformName" :value="item.platformCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺:" prop="channelName">
        <el-select v-model="ruleForm.channelName" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:220px">
          <el-option v-for="(item, index) in type.channelIdList" :key="index" :label="item.storeNameAs" :value="item.storeNameAs">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售负责人:" prop="chargeSalerId">
        <el-select v-model="ruleForm.chargeSalerId" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:220px">
          <el-option v-for="(item, index) in typeList.chargeSalerIdList" :key="index" :label="item.fullName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用承担人:" prop="feeTakerId">
        <el-select v-model="ruleForm.feeTakerId" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:220px">
          <el-option v-for="(item, index) in typeList.chargeSalerIdList" :key="index" :label="item.fullName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="记账时间:" prop="bookDate">
        <el-date-picker v-model="ruleForm.bookDate" :picker-options="picker" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" >
        </el-date-picker>
      </el-form-item>
      <div v-if="this.ruleForm.feeTypeCode=='10566'" key="1">
        <AmazonScalp :ruleForm="ruleForm" />
      </div>
      <div v-if="this.ruleForm.feeTypeCode=='10567'" key="2">
        <AmazonMarket :ruleForm="ruleForm" />
      </div>
      <div v-if="this.ruleForm.feeTypeCode=='10569'" key="4">
        <AliExpressScalp :ruleForm="ruleForm" />
      </div>
      <div v-if="this.ruleForm.feeTypeCode=='10568'" key="3">
        <AliExpressPaypal :ruleForm="ruleForm" />
      </div>
      <div v-if="this.ruleForm.feeTypeCode=='10570'" key="5">
        <CdRefund :ruleForm="ruleForm" />
      </div>
      <div v-if="this.ruleForm.feeTypeCode=='10571'" key="6">
        <CdFbc :ruleForm="ruleForm" />
      </div>
      <div v-if="this.ruleForm.feeTypeCode=='10572'" key="7">
        <OtherExpenses :ruleForm="ruleForm" />
      </div>
      <el-form-item label="附件:" v-if="addDialog.title=='查看费用申请单'||addDialog.title=='审核费用申请单'">
        <el-link type="primary" :underline="false" :href="ruleForm.attachmentUrl" target="_blank" v-if="ruleForm.attachmentUrl">{{ruleForm.fileName}}</el-link>
      </el-form-item>
      <el-form-item label="上传附件:" v-else>
        <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :auto-upload="false" multiple :limit="1" :file-list="ruleForm.fileList">
          <el-button size="mini" type="primary">点击上传</el-button>
          <el-tooltip placement="top" effect="light">
            <div slot="content">1. 图片格式：jpg、jpeg、png<br />2. 文件格式：txt、xls、xlsx、doc、docx、csv<br />3. 压缩包格式：rar、zip</div>
            <i class="el-icon-question" style="color:green"></i>
          </el-tooltip>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark" placeholder="最多输入5000个字符"></el-input>
      </el-form-item>
      <div style="text-align:right">
        <el-form-item label-width="0">
          <span v-if="!addDialog.pass">
            <el-button @click="reset" size="mini" v-if="addDialog.title!=='查看费用申请单'">取消</el-button>
            <el-button type="primary" @click="submitForm('form')" size="mini" :loading="ifButton" v-if="addDialog.title!=='查看费用申请单'">确定</el-button>
          </span>
        </el-form-item>
      </div>
    </el-form>
    <div style="text-align:right">
      <span v-if="addDialog.pass" style="margin-right:10px">
        <span v-if="addDialog.status==1">
          <el-button @click="conditions(0)" v-if="rolePermissionJudge('/financeCost/departmentAudit/reject')" size="mini">部门审核拒绝</el-button>
          <el-button @click="conditions(1)" v-if="rolePermissionJudge('/financeCost/departmentAudit/get')" type="primary" size="mini" :loading="ifConditions">部门审核通过</el-button>
        </span>
        <span v-if="addDialog.status==2">
          <el-button @click="conditions(0)" v-if="rolePermissionJudge('/financeCost/financialAudit/reject')" size="mini">财务审核拒绝</el-button>
          <el-button @click="conditions(1)" v-if="rolePermissionJudge('/financeCost/financialAudit/get')" type="primary" size="mini" :loading="ifConditions">财务审核通过</el-button>
        </span>
      </span>
    </div>
    <RefusePass :visible.sync="refusePass.visible" :rows="refusePass.rows" @request="close" />
  </el-dialog>
</template>
<script>
import { showFeeBillNo, selectAllEffectiveUmsAdmin, listFeeType, queryChannelByPlatformCode, uploadFile, addFeeApplyBill, listDepartment, checkFeeApplyBill, cancelFeeBill, departmentlist } from "@/api/finance/financeCost"
import { formatDate } from '@/utils/date'
import AmazonScalp from "./AmazonScalp"
import AmazonMarket from "./AmazonMarket"
import AliExpressScalp from "./AliExpressScalp"
import AliExpressPaypal from "./AliExpressPaypal"
import CdRefund from "./CdRefund"
import CdFbc from "./CdFbc"
import OtherExpenses from "./OtherExpenses"
import RefusePass from "./RefusePass"


const defaultRuleForm = {
  applyNo: "",
  platformName: "",
  feeTypeCode: "", feeTypeName: "",
  chargeSalerId: "", chargeSalerName: "",
  feeTakerId: "", feeTakerName: "",
  country: "",
  bookDate: formatDate((new Date()), 'yyyy-MM-dd hh:mm:ss'),
  channelId: "", channelName: "",
  departmentCode: "",
  departmentName: "",
  swipeOrderType: null,
  platformOrderNo: "",
  orderAmount: null, orderCurrency: "", orderAmountRMB: 0, orderCurrencyRate: 0,
  realPaymentCNY: null,
  paypalRefundTradeNo: "",
  isCommission: 0,
  payMethod: 1,
  payAccountNo: "",
  receiveAccountNo: "",
  remark: "",
  swipeCommission: null, commissionCurrency: "", swipeCommissionRMB: 0, commissionCurrencyRate: 0,
  payMethod: null,
  brankAccountName: "",
  brankName: "",
  paypalNo: "",
  processFeeAmount: null, processCurrency: "", processFeeAmountRmb: 0, processCurrencyRate: 0,
  fileList: [],
  formData: {},
  asin: "",
  markFeeAmount: null, currency: "", markFeeAmountRMB: 0, exchangeRate: 0,
  attachmentUrl: "", fileName: "",
  platCommission: null, platCommissionCurrency: "", platCommissionRMB: 0, platCommissionRate: 0,
  totalPayAmountCny: 0, totalLossAmountRmb: 0,
  amount: null, amountCurrency: "", amountRmb: 0, amountCurrencyRate: "",
  receiveAccountNo: "",
  rate: null,
  refundSourceAmount: null, refundSourceCurrency: "", refundSourceRmb: 0, refundSourceRate: 0,
  fbcFeeSourceAmount: null, fbcFeeSourceCurrency: "", fbcFeeSourceAmountRmb: 0, fbcFeeSourceRate: 0,
  fbcFeeAddAmount: null, fbcFeeAddCurrency: "", fbcFeeAddAmountRmb: 0, fbcFeeAddRate: 0,
  otherFeeAmount: null, otherFeeCurrency: "", otherFeeCurrencyRate: 0, otherFeeAmountRmb: 0

}
export default {
  name: "AddDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    addDialog: {
      type: Object,
      default: () => {
        return {
          title: String,
          disabled: Boolean,
          rows: Object,
          upload: Boolean,
          pass: Boolean,
          status: Number
        }
      }
    },
    typeList: {
      type: Object,
      default: () => {
        return {
          platformList: [],
          chargeSalerIdList: []
        }
      }
    }
  },
  components: { AmazonScalp, AmazonMarket, AliExpressScalp, AliExpressPaypal, CdRefund, OtherExpenses, CdFbc, RefusePass },
  data() {
    return {
      ruleForm: Object.assign({}, defaultRuleForm),
      rules: {
        swipeOrderType: [{ required: true, message: "此项不能为空", trigger: "change" }],
        platformName: [{ required: true, message: "此项不能为空", trigger: "change" }],
        departmentCode: [{ required: true, message: "此项不能为空", trigger: "change" }],
        feeTypeCode: [{ required: true, message: "此项不能为空", trigger: "change" }],
        feeTakerId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        chargeSalerId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        bookDate: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        channelName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        platformOrderNo: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        orderAmount: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        realPaymentCNY: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        paypalRefundTradeNo: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        isCommission: [{ required: true, message: "此项不能为空", trigger: "change" }],
        payMethod: [{ required: true, message: "此项不能为空", trigger: "change" }],
        payAccountNo: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        receiveAccountNo: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        processFeeAmount: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        swipeCommission: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        markFeeAmount: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        amount: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        asin: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        refundSourceAmount: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        platCommission: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        fbcFeeSourceAmount: [{ required: true, message: "此项不能为空", trigger: "change" }],
        fbcFeeAddAmount: [{ required: true, message: "此项不能为空", trigger: "change" }],
        otherFeeAmount: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      type: {
        departmentList: [],
        feeTypeList: [],
        chargeSalerIdList: [],
        channelIdList: [],
      },
      refusePass: {
        visible: false,
        rows: {}
      },
      createdUser: "",
      ifButton: false,
      ifConditions: false,
      feeTakerNameValue: "",
      picker: {
        disabledDate(time) {
          const now = new Date()
          const seven = 8 * 24 * 60 * 60 * 1000
          const sevenDay = now - seven
          return time.getTime() > now || time.getTime() < sevenDay
        }
      }
    }
  },
  beforeDestroy() {
    this.close();
  },
  computed: {
    handName() {
      return function (type) {
        switch (type) {
          case "eBay": return true
          case "CD": return true
          case "AliExpress": return true
          case "other": return true
          default: return false
        }
      }
    },
  },
  watch: {
    'ruleForm.feeTypeCode': function (newValue) {
      if (this.addDialog.title !== '创建费用申请单') return
      switch (newValue) {
        case "10568":
          return this.ruleForm.orderCurrency = "USD",
            this.ruleForm.amountCurrency = "USD";
        case "10569":
          return this.ruleForm.orderCurrency = "USD",
            this.ruleForm.commissionCurrency = "USD",
            this.ruleForm.platCommissionCurrency = "USD";
        case "10570":
          return this.ruleForm.amountCurrency = "EUR";
        case "10571":
          return this.ruleForm.fbcFeeSourceCurrency = "EUR",
            this.ruleForm.fbcFeeAddCurrency = "EUR"
      }
    }
  },
  methods: {
    reset() {
      if (this.addDialog.title == '创建费用申请单') {
        this.cancelFeeBill()
      }
      this.ruleForm = Object.assign({}, defaultRuleForm)
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
      for (let item in this.type) {
        this.type[item] = []
      }
      // this.$refs.upload.clearFiles();
      this.$emit("update:visible", false)
      this.$emit("request")
    },
    close() {
      this.ruleForm = Object.assign({}, defaultRuleForm)
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
      for (let item in this.type) {
        this.type[item] = []
      }
      // this.$refs.upload.clearFiles();
      this.$emit("update:visible", false)
      this.$emit("request")
    },
    cancelFeeBill() {
      if (this.ruleForm.fileData) {
        cancelFeeBill({ applyNo: this.ruleForm.applyNo }).then(res => {
          this.$message.success(res.data)
          if (this.$refs.upload) { this.$refs.upload.clearFiles(); }
        })
      }
    },
    async feeTypeCodeChange() {
      const { ruleForm } = this
      ruleForm.platformOrderNo = ""
      ruleForm.orderAmount = null
      ruleForm.orderCurrency = ""
      ruleForm.orderCurrencyRate = 0
      ruleForm.orderAmountRMB = 0
    },
    async open() {
      if (JSON.stringify(this.addDialog.rows) !== "{}") {
        this.ruleForm = { ...this.addDialog.rows }
        if (this.addDialog.title == '复制费用申请单') {
          const res = await Promise.all([showFeeBillNo()])
          this.ruleForm.applyNo = res[0].data.applyNo
          this.feeTakerNameValue = res[0].data.id
          this.ruleForm.attachmentUrl = ""
        }
        this.ruleForm.bookDate = this.ruleForm.bookDate
        const platformCode = this.typeList.platformList.find(i => { return i.parameterName == this.ruleForm.platformName }).parameterCode
        const res = await Promise.all([listFeeType({ platformName: this.ruleForm.platformName }), queryChannelByPlatformCode({ platformCode }), departmentlist({ platformCode })])
        this.type.feeTypeList = res[0].data
        this.type.channelIdList = res[1].data
        this.type.departmentList = res[2].data
        return
      }
      const res = await Promise.all([showFeeBillNo()])
      this.ruleForm.applyNo = res[0].data.applyNo
      this.ruleForm.feeTakerId = res[0].data.id
      this.ruleForm.chargeSalerId = res[0].data.id
      this.feeTakerNameValue = res[0].data.id
    },
    async platformChange() {
      if (this.addDialog.title == "创建费用申请单" || this.addDialog.title == "复制费用申请单") {
        const applyNo = this.ruleForm.applyNo
        const platformName = this.ruleForm.platformName
        const feeTakerId = this.ruleForm.feeTakerId
        const chargeSalerId = this.ruleForm.chargeSalerId
        this.ruleForm = Object.assign({}, defaultRuleForm)
        this.ruleForm.applyNo = applyNo
        this.ruleForm.platformName = platformName
        this.ruleForm.feeTakerId = feeTakerId
        this.ruleForm.chargeSalerId = chargeSalerId
        if (this.$refs.upload) { this.$refs.upload.clearFiles(); }
      }
      const platformCode = this.typeList.platformList.find(i => { return i.parameterName == this.ruleForm.platformName }).parameterCode
      const res = await Promise.all([listFeeType({ platformName: this.ruleForm.platformName }), queryChannelByPlatformCode({ platformCode }), departmentlist({ platformCode })])
      this.type.feeTypeList = res[0].data
      this.type.channelIdList = res[1].data
      this.type.departmentList = res[2].data
    },
    async handleChange(e, fileList) {
      const isLt20M = e.size / 1024 / 1024 < 10;
      if (!isLt20M) {
        this.$message.warning('上传的附件大小不能超过10M!');
        return false;
      }
      const file = e.raw;
      this.ruleForm.fileName = e.name;
      if (!file) return;
      const Xls = e.name.split(".");
      if (Xls[Xls.length - 1] !== "jpg" && Xls[Xls.length - 1] !== "jpeg" && Xls[Xls.length - 1] !== "png" && Xls[Xls.length - 1] !== "txt" && Xls[Xls.length - 1] !== "xls" && Xls[Xls.length - 1] !== "xlsx" && Xls[Xls.length - 1] !== "doc" && Xls[Xls.length - 1] !== "docx" && Xls[Xls.length - 1] !== "csv" && Xls[Xls.length - 1] !== "rar" && Xls[Xls.length - 1] !== "zip") {
        this.$message.warning("请选择正确格式文件");
        if (this.$refs.upload) { this.$refs.upload.clearFiles(); }

        return false;
      }
      this.ruleForm.fileData = file;
      const formData = new FormData();
      formData.append("file", this.ruleForm.fileData);
      formData.append("applyNo", this.ruleForm.applyNo);
      this.ifButton = true
      const res = await uploadFile(formData)
      if (res.code == 200) {
        this.$message.success(res.data)
        this.ruleForm.attachmentUrl = res.message
      }
      this.ifButton = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ifButton = true
          let channelId = ""
          let country = ""
          if (this.handName(this.ruleForm.platformName)) {
            channelId = this.ruleForm.channelId
            country = ""
          } else {
            channelId = this.type.channelIdList.find(i => { return i.storeNameAs == this.ruleForm.channelName }).id
            country = this.type.channelIdList.find(i => { return i.storeNameAs == this.ruleForm.channelName }).country
          }
          const departmentName = this.type.departmentList.find(i => { return i.platformCode == this.ruleForm.departmentCode }).platformName
          const feeTypeName = this.type.feeTypeList.find(i => { return i.parameterCode == this.ruleForm.feeTypeCode }).parameterValue
          const chargeSalerName = this.typeList.chargeSalerIdList.find(i => { return i.id == this.ruleForm.chargeSalerId }).fullName
          const feeTakerName = this.typeList.chargeSalerIdList.find(i => { return i.id == this.ruleForm.feeTakerId }).fullName
          if (this.ruleForm.feeTakerId !== this.feeTakerNameValue) {
            this.$confirm('创建人与费用承担人不一致，是否继续确定?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              addFeeApplyBill({ ...this.ruleForm, departmentName, channelId, feeTypeName, chargeSalerName, feeTakerName, country }).then(res => {
                this.$message.success(res.message);
                this.ruleForm.fileList = []

                if (this.$refs.upload) { this.$refs.upload.clearFiles(); }
                this.close();
                this.$emit("request")
              })
              this.ifButton = false
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          } else {
            addFeeApplyBill({ ...this.ruleForm, departmentName, channelId, feeTypeName, chargeSalerName, feeTakerName, country }).then(res => {
              this.$message.success(res.message);
              this.ruleForm.fileList = []

              if (this.$refs.upload) { this.$refs.upload.clearFiles(); }
              this.close();
              this.$emit("request")
            })
            this.ifButton = false
          }
        }
      })
    },
    async conditions(value) {
      this.ruleForm.isCheck = value
      if (this.ruleForm.isCheck == 0) {
        this.refusePass = {
          visible: true,
          rows: this.ruleForm
        }
        return
      }
      this.ifConditions = true
      const mapList = [{ id: this.ruleForm.id, version: this.ruleForm.version }]
      const res = await checkFeeApplyBill({ mapList, isCheck: this.ruleForm.isCheck, rejectReason: this.ruleForm.rejectReason })
      if (res.code == 200) {
        this.$message.success(res.data)
        this.close()
        this.$emit("request")
      }
      this.ifConditions = false
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  max-height: 600px;
  overflow-y: scroll;
  padding: 10px 20px;
}
</style>