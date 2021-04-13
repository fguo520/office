<template>
  <el-dialog :title="addDialog.title" :visible.sync="visible" width="800px" :before-close="close" :close-on-click-modal="false" @open="open">
    <el-form ref="form" label-width="130px" size="mini" :model="ruleForm" :rules="rules">
        <el-form-item label="运输类型：" prop="transportType">
          <el-select v-model="ruleForm.transportType" placeholder="请选择" size="mini" clearable class="input-width" filterable style="width:200px">
            <el-option v-for="(item, index) in typeList.transportTypeList.filter(item => item.value != 0)" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流时长(天)：" prop="logisticsTime">
          <NumberInput v-model="ruleForm.logisticsTime" max="1000" min="0" style="width:200px" />
        </el-form-item>
        <el-form-item label="运输方式名称：" prop="logisticsTransportName">
          <el-select v-model="ruleForm.logisticsTransportName" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:565px">
            <el-option v-for="(item, index) in typeList.logisticsTransportNameList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="待出库状态：" prop="waitOutStockStatus">
        <el-input v-model="ruleForm.waitOutStockStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="已揽收状态：" prop="collectStatus">
        <el-input v-model="ruleForm.collectStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="已交航状态：" prop="handoverStatus">
        <el-input v-model="ruleForm.handoverStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="运输中状态：" prop="transportStatus">
        <el-input v-model="ruleForm.transportStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="目的地状态：" prop="destinationStatus">
        <el-input v-model="ruleForm.destinationStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="已妥投状态：" prop="servedStatus">
        <el-input v-model="ruleForm.servedStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="轨迹超时状态：" prop="trajectoryTimeoutStatus">
        <el-input v-model="ruleForm.trajectoryTimeoutStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="可能异常状态：" prop="errorStatus">
        <el-input v-model="ruleForm.errorStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="包裹退回状态：" prop="parcelReturnedStatus">
        <el-input v-model="ruleForm.parcelReturnedStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="投递失败状态：" prop="deliveryFailedStatus">
        <el-input v-model="ruleForm.deliveryFailedStatus" maxlength="50" show-word-limit class="inputLegth" />
      </el-form-item>
      <div style="text-align:right">
        <el-form-item label-width="0">
          <el-button @click="close" size="mini">取消</el-button>
          <el-button type="primary" @click="submitForm('form')" size="mini" :loading="ifButton">保存</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { editLogisticsNode } from '@/api/track/trackNode';
import { NumberInput } from '@/components';
const defaultRuleForm = {
  transportType: "",
  logisticsTransportName: "",
  logisticsTime: "",
  waitOutStockStatus: "",
  collectStatus: "",
  handoverStatus: "",
  transportStatus: "",
  destinationStatus: "",
  servedStatus: "",
  trajectoryTimeoutStatus: "",
  errorStatus: "",
  parcelReturnedStatus: "",
  deliveryFailedStatus: ""
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
          transportTypeList: [],
          logisticsTransportNameList: []
        }
      }
    }
  },
  components: { NumberInput },
  data() {
    return {
      ruleForm: Object.assign({}, defaultRuleForm),
      rules: {
        transportType: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        logisticsTransportName: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        logisticsTime: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        waitOutStockStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        collectStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        handoverStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        transportStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        destinationStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        servedStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        trajectoryTimeoutStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        errorStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        parcelReturnedStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }],
        deliveryFailedStatus: [{ required: true, message: "此项不能为空", trigger: ['change', 'blur'] }]
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
      if (JSON.stringify(this.addDialog.rows) !== "{}") {
        this.ruleForm = { ...this.addDialog.rows }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ifButton = true
          editLogisticsNode(this.ruleForm).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message);
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
/deep/ .el-dialog__body {
  padding: 10px 20px;
  max-height: 700px;
  overflow-y: auto;
  .titleFrom {
    overflow: hidden;
    .el-form-item {
      width: 48%;
      float: left;
    }
  }
}
/deep/ .inputLegth {
  width: 565px;
  .el-input__suffix {
    position: absolute;
    right: -45px;
  }
}
</style>