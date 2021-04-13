<template>
  <el-dialog title="自定义下载" :visible.sync="visible" width="530px" append-to-body :before-close="close">
    <el-form ref="form" label-width="130px" size="mini" :model="ruleForm">
      <el-form-item label="运输方式名称:" prop="transportname">
        <el-select v-model="ruleForm.transportname" placeholder="全部" size="mini" filterable>
          <el-option v-for="(item, index) in typeList.transportnameList" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="物流状态:" prop="packagestatus">
        <el-select v-model="ruleForm.packagestatus" placeholder="全部" size="mini" filterable>
          <el-option v-for="(item, index) in states" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="单号查询:" prop="batchSearchType">
        <el-select v-model="ruleForm.batchSearchType" placeholder="全部" size="mini" filterable style="width:100px">
          <el-option v-for="(item, index) in typeList.batchSearchTypeList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <TextareaInput v-model="ruleForm.batchSearchValue" />
      </el-form-item>
      <el-form-item label="时间筛选:" prop="timeSearchType">
        <el-select v-model="ruleForm.timeSearchType" placeholder="全部" size="mini" filterable style="width:100px">
          <el-option v-for="(item, index) in typeList.timeSearchTypeList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
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
const defaultRuleForm = {
  transportname: "",
  packagestatus: "",
  batchSearchType: null,
  batchSearchValue: [],
  timeSearchType: null,
  startTime: "",
  endTime: "",
}
import { TextareaInput } from "@/components"
import { customExport } from "@/api/track/trackTrace"
import { formatDate } from '@/utils/date'
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
          batchSearchTypeList: [],
          transportnameList: [],
          timeSearchTypeList: []
        }
      }
    },
    states: {
      type: Array,
      default: () => []
    }
  },
  components: { TextareaInput },
  data() {
    return {
      ruleForm: Object.assign({}, defaultRuleForm),
      createTimeAndEndTime: [],
      ifButton: false,
    }
  },
  beforeDestroy() {
    this.close();
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.ruleForm.startTime = timeArr[0];
      this.ruleForm.endTime = timeArr[1];
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.ruleForm = Object.assign({}, defaultRuleForm)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ifButton = true
          customExport({ ...this.ruleForm }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.data);
              this.close();
              this.$emit("request")
            }
            this.ifButton = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>