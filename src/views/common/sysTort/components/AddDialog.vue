<template>
  <el-dialog :title="addDialog.title" :visible.sync="visible" width="750px" :before-close="close" :close-on-click-modal="false" @open="open">
    <el-form ref="form" label-width="130px" size="mini" :model="ruleForm" :rules="rules">
      <el-form-item label="侵权平台:" prop="platform">
        <el-select v-model="ruleForm.platform" placeholder="请选择" size="mini" clearable style="width:500px" filterable @change="platfromChange">
          <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SKU:" prop="sku">
        <el-input v-model="ruleForm.sku" clearable style="width:500px" @change="skuChange" />
      </el-form-item>
      <el-form-item label="站点:">
        <el-select v-model="ruleForm.country" placeholder="请选择平台" size="mini" clearable style="width:500px" filterable>
          <el-option v-for="(item, index) in list.countryList" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺账号:" prop="storeName">
        <el-input v-model="ruleForm.storeName" clearable style="width:500px" @change="storeNameChange" />
      </el-form-item>
      <el-form-item label="开发人员:" prop="developAdminName">
        <span>{{ruleForm.developAdminName}}</span>
      </el-form-item>
      <el-form-item label="采购人员:" prop="buyerName">
        <span>{{ruleForm.buyerName}}</span>
      </el-form-item>
      <el-form-item label="销售人员:" prop="saleName">
        <span>{{ruleForm.saleName}}</span>
      </el-form-item>
      <el-form-item label="侵权类型:" prop="tortType">
        <el-select v-model="ruleForm.tortType" placeholder="请选择" size="mini" clearable style="width:500px" filterable>
          <el-option v-for="(item, index) in typeList.tortTypeList" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="侵权时间:" prop="tortTime">
        <el-date-picker v-model="ruleForm.tortTime" type="date" format="yyyy 年 MM 月 dd 日" style="width:500px" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="侵权描述:">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width:500px" show-word-limit class="inputLegth" v-model="ruleForm.tortDescribe" placeholder="最多输入2000个字符" maxlength="2000"></el-input>
      </el-form-item>
      <div style="text-align:right">
        <el-form-item label-width="0">
          <el-button @click="close" size="mini">取消</el-button>
          <el-button type="primary" @click="submitForm('form')" size="mini" :loading="ifButton">确定</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { tortCountry, getDevelopMan, getSaleMan, saveTortRecordInfo } from "@/api/common/sysTort";
const defaultRuleForm = {
  platform: null,
  sku: "",
  country: "",
  storeName: "",
  developAdminName: "",
  buyerName: "",
  saleName: "",
  tortType: "",
  tortTime: "",
  tortDescribe: ""
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
      default: () => ({})
    },
    typeList: {
      type: Object,
      default: () => {
        return {
          platformList: [],
          tortTypeList: []
        }
      }
    }
  },
  data() {
    return {
      ruleForm: Object.assign({}, defaultRuleForm),
      rules: {
        platform: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        sku: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        saleName: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        tortTime: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        tortType: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        storeName: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        developAdminName: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        buyerName: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }]
      },
      list: {
        countryList: [],
      },
      ifButton: false
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.ruleForm = Object.assign({}, defaultRuleForm)
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
      this.$emit("update:visible", false)
    },
    async open() {
      if (Object.keys(this.addDialog.rows).length == 0) return
      this.ruleForm = { ...this.addDialog.rows }
      this.platfromChange(this.ruleForm.platform, true)
    },
    async platfromChange(platformCode, check) {
      if (!check) {
        this.list.countryList = []
        this.ruleForm.country = ""
      }
      const res = await tortCountry({ platformCode })
      this.list.countryList = res.data
    },
    async skuChange(sku) {
      const res = await getDevelopMan({ sku })
      this.ruleForm.developAdminName = res.data.developMan
      this.ruleForm.buyerName = res.data.buyerName
    },
    async storeNameChange(shAccount) {
      const res = await getSaleMan({ shAccount })
      this.ruleForm.saleName = res.data
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ifButton = true
          saveTortRecordInfo(this.ruleForm).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message);
              this.close();
              this.$emit("request")
              this.ifButton = false
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px 20px;
}
/deep/ .el-textarea .el-input__count {
  position: absolute;
  right: -55px;
  bottom: 0;
}
</style>