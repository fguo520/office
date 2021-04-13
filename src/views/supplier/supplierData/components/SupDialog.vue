<template>
  <el-dialog :title="supDialog.title" :visible.sync="visible" width="1100px" append-to-body :before-close="close" :close-on-click-modal="false" @open="open">
    <el-tabs tab-position="left" class="eltabpaneheight" v-model="currentTab">
      <el-tab-pane label="基本信息" class="eltabpaneheight" name="basic">
        <Basic :home="this" :check="supDialog.check" ref="basic" />
      </el-tab-pane>
      <el-tab-pane label="支付信息" class="eltabpaneheight" name="pay">
        <Pay :home="this" :check="supDialog.check" ref="pay" />
      </el-tab-pane>
      <el-tab-pane label="联系信息" class="eltabpaneheight" name="connection">
        <Connection :home="this" :check="supDialog.check" ref="connection" />
      </el-tab-pane>
      <el-tab-pane label="其它信息" class="eltabpaneheight" name="other">
        <Other :home="this" :check="supDialog.check" ref="other" />
      </el-tab-pane>
      <el-tab-pane label="文件存档" class="eltabpaneheight" name="file">
        <File :home="this" :check="supDialog.check" ref="file" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { saveSupplierDataMain, getLmSupplierDataMainDetail } from "@/api/supplier/supplierData"
import Basic from "../module/Basic"
import Pay from "../module/Pay"
import Connection from "../module/Connection"
import Other from "../module/Other"
import File from "../module/File"
const defaultListQuery = {
  supplierCode: "",
  status: true,
  supplierName: "",
  cooperateType: null,
  supplierType: null,
  purchaseType: null,
  supplierGrade: null,
  badHandle: null,
  supplierShippingAddressProvince: "",
  supplierShippingAddressCity: "",
  developAdminId: "",
  buyerAdminId: "",
  supplierRemark: "",
  warehouseShipping: "",
  classIds: [],
  supplierUrl: "",
  supplierLoginId: "",//basic
  payType: null,
  payWeek: null,
  payRate: null,
  settlementTimeType: 3,
  collectionType: false,
  receivingBanks: [{ bankName: "", branchName: "", currency: "CNY", payeeUsername: "", bankAccount: "", payeeBankCard: "", isTaxRefundAccount: false, isDefaultAccount: true, }],//pay
  managerName: "",
  managerPhone: "",
  legalRepresentative: "",
  taxNumber: "",
  returnAddress: "",
  supplierAddress: "",
  contactInfos: [{ contactName: "", job: "", mobile: "", phone: "", email: "", qq: "", wx: "", wwId: "", isDefault: true, }],//connection
  isInvoice: false,
  isSupportLabeling: false,
  isSupportReturn: false,
  isSupportSea: false,
  isFactoryInspection: false,
  isBlacklist: false,
  invoiceType: null,
  drawerQualifications: null,
  drawerType: null,
  drawerAddressProvince: "",
  drawerAddressCity: "",
  vatRate: null,
  drawerVatRate: null,
  isUpdateProduct: false,
  blacklistRemark: "",
  factoryUploads: [],
  supplyVisitLinks: "",
  supplyAccount: "",
  supplyPwd: "",//other
  fileUploads: []
}
export default {
  name: "SupDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    supDialog: {
      type: Object,
      default: () => { }
    },
    typeList: {
      type: Object,
      default: () => { }
    },
  },
  components: { Basic, Pay, Connection, Other, File },
  beforeDestroy() {
    this.close();
  },
  data() {
    return {
      currentTab: "basic",
      listQuery: Object.assign({}, defaultListQuery),
      list: this.typeList,
      submitLoading: false,
    }
  },
  created() {
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.currentTab = 'basic'
      }
    }
  },
  methods: {
    async open() {
      if (!this.supDialog.id) return
      const res = await getLmSupplierDataMainDetail({ id: this.supDialog.id })
      this.listQuery = Object.assign(this.listQuery, res.data)
      this.$nextTick(() => {
        if (this.listQuery.payType) this.$refs.pay.payTypeChange(this.listQuery.payType, true)
        if (this.listQuery.supplierShippingAddressProvince) this.$refs.basic.supplierShipChange(this.listQuery.supplierShippingAddressProvince, true)
        if (this.listQuery.drawerAddressProvince) this.$refs.other.supplierShipChange(this.listQuery.drawerAddressProvince, true)
        if (this.listQuery.purchaseType) this.$refs.basic.purchaseTypeChange(this.listQuery.purchaseType, true)
      })
    },
    close() {
      this.listQuery = Object.assign(this.listQuery, defaultListQuery)
      this.listQuery.receivingBanks = [{ bankName: "", branchName: "", currency: "CNY", payeeUsername: "", bankAccount: "", payeeBankCard: "", isTaxRefundAccount: false, isDefaultAccount: true, }]
      this.listQuery.contactInfos = [{ contactName: "", job: "", mobile: "", phone: "", email: "", qq: "", wx: "", wwId: "", isDefault: true, }]
      this.listQuery.factoryUploads = []
      this.listQuery.id = ""
      this.listQuery.fileUploads = []
      this.list.supplierCityList = []
      this.$nextTick(() => {
        if (this.$refs.basic) {
          this.$refs.basic.$refs.form.clearValidate(), this.$refs.pay.$refs.form.clearValidate(), this.$refs.other.$refs.form.clearValidate(), this.$refs.connection.$refs.form.clearValidate()
        }
      })
      this.$emit("update:visible", false)
    },
    submit() {
      const { $refs: { basic, pay, other, connection,file }, listQuery, $message, close } = this
      try {
        if (!basic.validate()) { this.currentTab = 'basic'; return }
        if (!pay.validate()) { this.currentTab = 'pay'; return }
        if (!connection.validate()) { this.currentTab = 'connection'; return }
        if (!other.validate()) { this.currentTab = 'other'; return }
        this.submitLoading = true
        saveSupplierDataMain({ ...listQuery }).then(res => {
          if (res.code == 200) {
            $message.success(res.data)
            close()
            this.$emit("request")
          }
          this.submitLoading = false
        })
      } catch (error) { }
    }
  }
}
</script>
<style scoped lang='scss'>
/deep/ .el-dialog__body {
  padding: 10px 20px 20px;
}
.eltabpaneheight {
  height: 620px;
}
/deep/ .__view {
  position: absolute !important;
}
</style>
