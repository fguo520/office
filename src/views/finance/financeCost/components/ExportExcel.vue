<template>
  <el-dialog title="导出" :visible.sync="visible" width="500px" :before-close="close">
    <el-form ref="form" label-width="130px" size="mini" :model="ruleForm" :rules="rules">
      <el-form-item label="导出内容:" prop="exportType">
        <el-radio-group v-model="ruleForm.exportType">
          <el-radio :label="1">明细</el-radio>
          <el-radio :label="2">汇总</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="平台:">
        <el-select v-model="ruleForm.platformName" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:220px" @change="platformChange">
          <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.parameterName" :value="item.parameterName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用类型:">
        <el-select v-model="ruleForm.feeTypeCode" placeholder="请选择" size="mini" clearable class="input-width" filterable style="width:220px">
          <el-option label="全选" value="" />
          <el-option v-for="(item, index) in list.feeTypeList" :key="index" :label="item.parameterValue" :value="item.parameterCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售负责人:">
        <el-select v-model="ruleForm.chargeSalerId" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:220px">
          <el-option v-for="(item, index) in typeList.chargeSalerIdList" :key="index" :label="item.fullName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自定义时间:" prop="timeType">
        <el-select v-model="ruleForm.timeType" placeholder="全部" size="mini" filterable style="width:100px">
          <el-option v-for="(item, index) in list.timeTypeList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" unlink-panels :picker-options="pickerOptions" />
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
import { listFeeType, exportFeeBill } from "@/api/finance/financeCost"
const defaultRuleForm = {
  exportType: 1,
  chargeSalerId: "",
  feeTypeCode: "",
  platformName: "",
  timeType: null,
  startTime: "",
  endTime: "",
  feeTypeName: ""
}
export default {
  name: "ExportExcel",
  props: {
    visible: {
      type: Boolean,
      default: false
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
  data() {
    return {
      ruleForm: Object.assign({}, defaultRuleForm),
      rules: {
        exportType: [{ required: true, message: "此项不能为空", trigger: "change" }],
        platformName: [{ required: true, message: "此项不能为空", trigger: "change" }],
        feeTypeCode: [{ required: true, message: "此项不能为空", trigger: "change" }],
        chargeSalerId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        timeType: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      list: {
        feeTypeList: [],
        timeTypeList: [{ label: "创建", value: 1 },
        { label: "审核完成", value: 2 }]
      },
      createTimeAndEndTime: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        },]
      },
      ifButton: false
    }
  },
  watch: {
    "createTimeAndEndTime": function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.ruleForm.startTime = timeArr[0];
      this.ruleForm.endTime = timeArr[1];
    },
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.ruleForm = Object.assign({}, defaultRuleForm)
      this.createTimeAndEndTime = []
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
      this.list.feeTypeList=[]
    },
    async platformChange() {
      const res = await Promise.all([listFeeType({ platformName: this.ruleForm.platformName })])
      this.list.feeTypeList = res[0].data
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let feeTypeName = ""
          if (this.ruleForm.feeTypeCode) {
            if (this.ruleForm.feeTypeCode == "") {
              feeTypeName = ""
            } else {
              feeTypeName = this.list.feeTypeList.find(i => { return i.parameterCode == this.ruleForm.feeTypeCode }).parameterValue
            }
          }

          this.ifButton = true
          exportFeeBill({ ...this.ruleForm, feeTypeName }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.data);
              this.ruleForm.fileList = []
              this.close();
              this.$emit("request")
            }
          })
          this.ifButton = false
        }
      })
    }
  }
}
</script>