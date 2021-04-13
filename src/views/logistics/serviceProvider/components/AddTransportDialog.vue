<template>
  <el-dialog :title="`${childId?'编辑':'新增'}运输方式`" :visible.sync="visible" width="1100px" append-to-body :before-close="close" @open="open">
    <vueScroll>
      <el-form ref="form" label-width="150px" size="mini" inline :model="listQuery" :rules="rules">
        <el-form-item label="服务商代码：" prop="apiLogisticsServeiceCode">
          <div style="width:300px;">{{ listQuery.apiLogisticsServeiceCode }}</div>
        </el-form-item>
        <el-form-item label="服务商名称：" prop="logisticsServeiceName">
          <div style="width:300px;">{{ listQuery.logisticsServeiceName }}</div>
        </el-form-item><br />

        <el-divider content-position="left">
          <span style="color:#52c41a;">基本信息</span>
        </el-divider>
        <el-form-item label="运输方式：" prop="transportName">
          <el-select v-model="listQuery.transportName" placeholder="全部" style="width:300px" filterable allow-create clearable>
            <el-option v-for="(item, index) in typeList.transportNameList" :key="index" :label="item.transportationNameCn" :value="item.transportationNameCn" />
          </el-select>
          <el-checkbox v-model="listQuery.isEnable" style="margin-left:10px;" :true-label='1' :false-label='0'>启用</el-checkbox>
        </el-form-item>
        <el-form-item label="运输方式代码：" prop="storeName">
          <el-input v-model="listQuery.storeName" placeholder="请输入货代的运输方式代码" style="width:300px" />
        </el-form-item><br />
        <el-form-item label="中文名称：" prop="transportationNameCn">
          <el-input v-model="listQuery.transportationNameCn" style="width:300px" maxlength="128" show-word-limit class="limitLength" />
        </el-form-item>
        <el-form-item label="英文名称：" prop="transportationNameEn">
          <el-input v-model="listQuery.transportationNameEn" style="width:300px" maxlength="128" show-word-limit class="limitLength" />
        </el-form-item><br />
        <el-form-item label="物流轨迹查询URL：" prop="logisticsSearchUrl">
          <!-- <el-select v-model="listQuery.logisticsSearchUrl" placeholder="全部" style="width:300px" filterable>
            <el-option v-for="(item, index) in typeList.principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select> -->
          <el-input v-model="listQuery.logisticsSearchUrl" placeholder="请输入物流轨迹查询URL" style="width:300px" />
        </el-form-item><br />
        <el-form-item label="运输类型：" prop="transportationType">
          <el-select v-model="listQuery.transportationType" placeholder="全部" style="width:150px" filterable clearable>
            <el-option v-for="(item, index) in list.serviceTransportationTypeList" :key="index" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="面单尺寸：" prop="lableFormate">
          <el-input v-model="listQuery.lableFormate" style="width:150px" />
        </el-form-item>
        <el-form-item label="仓库：" prop="warehouse">
          <el-select v-model="listQuery.warehouse" placeholder="全部" style="width:250px" filterable>
            <el-option v-for="(item, index) in typeList.warehouseList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item><br />
        <el-form-item label="尺寸限制：" prop="sizeType" :rules="getSizeTypeValid">
          <el-select v-model="listQuery.sizeType" placeholder="请选择" style="width:130px" filterable clearable @change="sizeTypeChange">
            <el-option v-for="(item, index) in typeList.sizeTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <span>
            <NumberInput v-model="listQuery.length" style="width:80px;" placeholder="长(cm)" min='0' float="4" /> *
            <NumberInput v-model="listQuery.width" style="width:80px;" placeholder="宽(cm)" min='0' float="4" /> *
            <NumberInput v-model="listQuery.height" style="width:80px;" placeholder="高(cm)" min='0' float="4" />
          </span>
        </el-form-item>
        <el-form-item label="最大周长：" prop="maxPerimeter" :rules="getSizeValid">
          <NumberInput v-model="listQuery.maxPerimeter" style="width:80px;" placeholder="周长(cm)" min='0' float="4" />
        </el-form-item>
        <el-form-item label="最大单边长：" prop="maxSideLength" :rules="getSizeValid">
          <NumberInput v-model="listQuery.maxSideLength" style="width:80px;" placeholder="长(cm)" min='0' float="4" />
        </el-form-item>

        <el-divider content-position="left">
          <span style="color:#52c41a;">拦截设置</span>
        </el-divider>
        <el-form-item label="重量限制方式：" prop="weightLimitMode">
          <el-radio-group v-model="listQuery.weightLimitMode" @change="weightLimitModeChange">
            <el-radio :label="1">按产品包裹重</el-radio>
            <el-radio :label="2">按产品体积重</el-radio>
            <el-radio :label="3">包裹重和体积重间取最大重量</el-radio>
          </el-radio-group>
        </el-form-item><br />
        <el-form-item label="预报重量限制：">
          <el-form-item label="包裹重(g)：" label-width="100px" prop="forecastWeightPackLimitMin" :rules="getWeightPackLimitValid" class="specialFormItem">
            <NumberInput v-model="listQuery.forecastWeightPackLimitMin" style="width:100px;" min="0" float="4" placeholder="最小值" /> ~
            <NumberInput v-model="listQuery.forecastWeightPackLimitMax" style="width:100px;" min="0" float="4" placeholder="最大值" />
          </el-form-item>
          <el-form-item label="体积重(g)：" label-width="100px" prop="forecastWeightVolumeLimitMin" :rules="getWeightVolumeLimitValid" class="specialFormItem">
            <NumberInput v-model="listQuery.forecastWeightVolumeLimitMin" style="width:100px;" min="0" float="4" placeholder="最小值" /> ~
            <NumberInput v-model="listQuery.forecastWeightVolumeLimitMax" style="width:100px;" min="0" float="4" placeholder="最大值" />
          </el-form-item>
          <el-form-item label="体积系数：" label-width="100px" prop="volumeCoefficient" :rules="getVolumeCoefficientValid" class="specialFormItem">
            <NumberInput v-model="listQuery.volumeCoefficient" style="width:100px;" min="0" float="4" placeholder="请输入" />
          </el-form-item>
        </el-form-item><br />
        <el-form-item label="预报尺寸：" prop="forecastLength">
          <NumberInput v-model="listQuery.forecastLength" style="width:100px;" placeholder="长(cm)" min='0' float="4" /> *
          <NumberInput v-model="listQuery.forecastWidth" style="width:100px;" placeholder="宽(cm)" min='0' float="4" /> *
          <NumberInput v-model="listQuery.forecastHeight" style="width:100px;" placeholder="高(cm)" min='0' float="4" />
        </el-form-item>
        <el-form-item label="物流属性限制：" prop="limitProductProperty">
          <ScrollSelect v-model="listQuery.limitProductProperty" :list="typeList.limitProductPropertyList" placeholder="可多选" style="width:300px" filterable clearable :prop="{ label:'WithBattery', value:'WithBatteryCode' }" />
        </el-form-item><br />
        <el-form-item label="验证地址：" prop="checkAddress">
          <el-radio v-model="listQuery.checkAddress" :label="1">是</el-radio>
          <el-radio v-model="listQuery.checkAddress" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="验证门牌号：" prop="checkHouseNumber">
          <el-radio v-model="listQuery.checkHouseNumber" :label="1">是</el-radio>
          <el-radio v-model="listQuery.checkHouseNumber" :label="0">否</el-radio>
        </el-form-item><br />

        <el-divider content-position="left">
          <span style="color:#52c41a;">其它设置</span>
        </el-divider>
        <el-form-item label="时效(天)：" prop="timelinessMin">
          <NumberInput v-model="listQuery.timelinessMin" style="width:70px;" placeholder="请输入" min="0" /> ~
          <NumberInput v-model="listQuery.timelinessMax" style="width:70px;" placeholder="请输入" min="0" />
        </el-form-item>
        <el-form-item label="追踪号有效期(天)：" prop="trackNumberValidityMin">
          <NumberInput v-model="listQuery.trackNumberValidityMin" style="width:70px;" placeholder="请输入" /> ~
          <NumberInput v-model="listQuery.trackNumberValidityMax" style="width:70px;" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="挂号：" prop="signature">
          <el-radio v-model="listQuery.signature" :label="1">是</el-radio>
          <el-radio v-model="listQuery.signature" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="参与计费类型：" prop="chargeType">
          <el-radio v-model="listQuery.chargeType" :label="1">API</el-radio>
          <el-radio v-model="listQuery.chargeType" :label="0">报价</el-radio>
        </el-form-item>
        <el-form-item label="是否妥投：" prop="voteType">
          <el-radio v-model="listQuery.voteType" :label="1">全程上网，妥投</el-radio>
          <el-radio v-model="listQuery.voteType" :label="2">半程上网，无妥投</el-radio>
        </el-form-item><br />
        <el-form-item label="面单打印：" prop="printType">
          <el-radio v-model="listQuery.printType" :label="1">没有追踪号允许打印</el-radio>
          <el-radio v-model="listQuery.printType" :label="2">没有物流商单号允许打印</el-radio>
        </el-form-item>
        <el-form-item label="预生成追踪号：" prop="forecastTrackNo">
          <el-radio-group v-model="listQuery.forecastTrackNo">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
            <el-radio :label="3">有包裹时即可预生成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </vueScroll>

    <span slot="footer" class="dialog-footer">
      <el-button @click="commit" type="primary" size="mini" :loading="commitLoading">保 存</el-button>
      <el-button @click="close" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { NumberInput, ScrollSelect } from '@/components'
import { getWithBatterys, saveLogisticsTransport, getLogisticsTransport } from '@/api/logistics/serviceProvider'
const defaultListQuery = {
  logisticsServeiceName: '',
  transportName: '',
  isEnable: '',
  apiLogisticsServeiceCode: '',
  apiLogisticsServeiceName: '',
  storeName: '',
  transportationType: '',
  lableFormate: '',
  warehouse: '',
  transportationNameCn: '',
  transportationNameEn: '',
  logisticsSearchUrl: '',
  sizeType: '',
  length: '',
  width: '',
  height: '',
  maxPerimeter: '',
  maxSideLength: '',
  forecastLength: '',
  forecastWidth: '',
  forecastHeight: '',
  weightLimitMode: '',
  forecastWeightPackLimitMin: '',
  forecastWeightPackLimitMax: '',
  forecastWeightVolumeLimitMin: '',
  forecastWeightVolumeLimitMax: '',
  volumeCoefficient: '',
  limitProductProperty: [],
  checkAddress: '',
  checkHouseNumber: '',
  timelinessMin: '',
  timelinessMax: '',
  trackNumberValidityMin: '',
  trackNumberValidityMax: '',
  signature: '',
  chargeType: '',
  voteType: '',
  printType: '',
  forecastTrackNo: '',
}
export default {
  name: 'AddTransportDialog',
  components: {
    NumberInput,
    ScrollSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Object,
      default: () => ({})
    },
    row: {
      type: Object,
      default: () => ({})
    },
    childId: null
  },
  data() {
    const timelinessValid = (rule, value, callback) => {
      if (value === '' || this.listQuery.timelinessMax === '') {
        callback(new Error('此项不能为空'))
        return
      }
      if (this.listQuery.timelinessMax < value) {
        callback(new Error('请输入正确的时效区间'))
        return
      }
      callback()
    }
    return {
      listQuery: Object.assign({}, defaultListQuery),
      rules: {
        transportName: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        storeName: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        lableFormate: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        warehouse: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        transportationNameCn: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        logisticsSearchUrl: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        timelinessMin: { required: true, validator: timelinessValid, trigger: ['change', 'blur'] },
      },
      typeList: {
        transportNameList: [],
        warehouseList: [
          { label: '东莞中仓', value: '1' },
          { label: '海外仓', value: '2' },
          { label: 'FBA仓', value: '3' },
        ],
        sizeTypeList: [
          { label: '小包尺寸', value: 1 },
          { label: '专线尺寸', value: 2 },
          { label: '头程大货尺寸', value: 3 },
        ],
        limitProductPropertyList: []
      },
      commitLoading: false,
    };
  },
  created() {
    getWithBatterys().then(res => {
      this.typeList.limitProductPropertyList = res.data
    })
  },
  beforeDestroy() {
    this.close();
  },
  computed: {
    getSizeTypeValid() {
      const { sizeType, length, width, height } = this.listQuery;
      return {
        required: sizeType !== '',
        validator: (rule, value, callback) => {
          if (sizeType !== '') {
            if (length === '' || width === '' || height === '') {
              callback(new Error('请填写完整尺寸'))
              return
            }
          }
          callback()
        },
        trigger: ['change', 'blur']
      }
    },
    getSizeValid() {
      const { sizeType } = this.listQuery;
      return {
        required: sizeType !== '',
        validator: (rule, value, callback) => {
          if (sizeType !== '') {
            if (value === '') {
              callback(new Error('此项不能为空'))
              return
            }
          }
          callback()
        },
        trigger: ['change', 'blur']
      }
    },
    getWeightPackLimitValid() {
      const { weightLimitMode, forecastWeightPackLimitMax } = this.listQuery
      return {
        required: weightLimitMode === 1 || weightLimitMode === 3,
        validator: (rule, value, callback) => {
          if (weightLimitMode === 1 || weightLimitMode === 3) {
            if (value === '' || forecastWeightPackLimitMax === '') {
              callback(new Error('此项不能为空'))
              return
            }
          }
          if (forecastWeightPackLimitMax < value) {
            callback(new Error('最大值不能小于最小值'))
            return
          }
          callback()
        },
        trigger: ['change', 'blur']
      }
    },
    getWeightVolumeLimitValid() {
      const { weightLimitMode, forecastWeightVolumeLimitMax } = this.listQuery;
      return {
        required: weightLimitMode === 2 || weightLimitMode === 3,
        validator: (rule, value, callback) => {
          if (weightLimitMode === 2 || weightLimitMode === 3) {
            if (value === '' || forecastWeightVolumeLimitMax === '') {
              callback(new Error('此项不能为空'))
              return
            }
          }
          if (forecastWeightVolumeLimitMax < value) {
            callback(new Error('最大值不能小于最小值'))
            return
          }
          callback()
        },
        trigger: ['change', 'blur']
      }
    },
    getVolumeCoefficientValid() {
      const { weightLimitMode } = this.listQuery;
      return {
        required: weightLimitMode === 2 || weightLimitMode === 3,
        message: '此项不能为空',
        trigger: ['change', 'blur']
      }
    }
  },
  methods: {
    open() {
      if (this.childId) {
        getLogisticsTransport({ id: this.childId }).then(res => {
          this.listQuery = res.data
        })
        return
      }
      const { listQuery, row: { logisticsServeiceName, logisticsServeice, logisticsServeiceCode }, list: { serviceList } } = this
      listQuery.logisticsServeiceName = logisticsServeice
      listQuery.apiLogisticsServeiceCode = logisticsServeiceCode
      listQuery.apiLogisticsServeiceName = logisticsServeiceName

      const findItem = serviceList.find(item => item.logisticsServeiceName === logisticsServeiceName) || {}
      this.typeList.transportNameList = findItem.children || []
    },
    close() {
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, defaultListQuery)
      setTimeout(() => { this.$refs.form && this.$refs.form.resetFields() })
    },
    weightLimitModeChange() {
      this.$refs.form.clearValidate(['forecastWeightPackLimitMin', 'forecastWeightVolumeLimitMin', 'volumeCoefficient'])
    },
    sizeTypeChange() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate(['maxPerimeter', 'maxSideLength', 'sizeType'])
      })
    },
    async commit() {
      try {
        const { $message, $refs, listQuery, row, close, childId } = this
        let fromValid;
        $refs.form.validate(valid => {
          fromValid = valid
        })
        if (!fromValid) {
          $message.warning('请填写完整信息')
          return
        };
        this.commitLoading = true
        const res = await saveLogisticsTransport({
          ...listQuery,
          logisticsServeiceId: row.id,
          id: childId
        })
        $message.success(res.message)
        this.$emit('callBack', res.data, row)
        close()
      } catch (err) { }
      this.commitLoading = false
    },
  },
};
</script>

<style scoped lang='scss'>
.el-form {
  height: 500px;
}
/deep/ .limitLength {
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}
.specialFormItem {
  margin-bottom: 0;
}
</style>
