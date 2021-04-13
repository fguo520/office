<template>
  <div class="dynamicContainer">
    <div class="dynamicHeader" v-if="listQuery.destinationCountry == '1'">
      {{ `按国家申报- ${index+1}` }}
      <div>
        <el-button icon="el-icon-delete" size="mini" style="height:28px;" v-if="index !== 0" @click="remove">
          删除
        </el-button>
        <el-button icon="el-icon-circle-plus-outline" size="mini" style="height:28px;" @click="add">继续添加</el-button>
      </div>
    </div>

    <div class="dynamicBody">
      <el-form-item label="目的国家：" v-if="listQuery.destinationCountry == '1'" :prop="`list.${index}.country`" :rules="getRules">
        <el-select v-model="dynamicQuery.country" style="width:450px" filterable>
          <el-option v-for="(item, index) in typeList.countryList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item><br v-if="listQuery.destinationCountry === '1'" />

      <el-form-item label="申报币种：" :prop="`list.${index}.currency`" :rules="getRules">
        <el-select v-model="dynamicQuery.currency" style="width:450px" filterable>
          <el-option v-for="(item, index) in typeList.currencyList" :key="index" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item><br />

      <el-form-item label="申报价值方式：" :prop="`list.${index}.valueMethod`" :rules="getValueMethodRules">
        <el-radio-group v-model="dynamicQuery.valueMethod">
          <el-radio label="0">固定金额</el-radio>
          <NumberInput style="width:193px;" float="4" v-model="dynamicQuery.amount" v-show="dynamicQuery.valueMethod === '0'" /><br />

          <el-radio label="1">金额比例</el-radio>
          <span v-show="dynamicQuery.valueMethod === '1'">
            <el-select v-model="dynamicQuery.currencyType" style="width:150px" filterable>
              <el-option v-for="(item, index) in typeList.currencyTypeList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <NumberInput style="width:100px;" v-model="dynamicQuery.currencyTypePercentage" />% <br />
          </span>
          <div v-show="dynamicQuery.valueMethod === '1'" style="width:450px;height:28px;">
            <el-checkbox v-model="dynamicQuery.lowestPriceChecked">最低价格</el-checkbox>
            <NumberInput style="width:100px;margin-right:5px;" v-model="dynamicQuery.lowestPrice" v-show="dynamicQuery.lowestPriceChecked" />

            <el-checkbox v-model="dynamicQuery.highestPriceChecked">最高价格</el-checkbox>
            <NumberInput style="width:100px;" v-model="dynamicQuery.highestPrice" v-show="dynamicQuery.highestPriceChecked" />
          </div>
        </el-radio-group>
      </el-form-item><br />

      <el-form-item label="速卖通设置：">
        <div style="color:#bfbfbf;">仅适用于速卖通线上物流。</div>
        <el-radio-group v-model="dynamicQuery.aliexpressSettings">
          <el-radio label="0">退回</el-radio>
          <el-radio label="1">销毁</el-radio>
          <el-radio label="2">自动选择</el-radio>
        </el-radio-group>
        <div v-show="dynamicQuery.aliexpressSettings === '2'">
          <div style="width:450px">
            销毁：
            <NumberInput v-model="dynamicQuery.destroyAomunt1" style="width:100px;" />
            USD &lt; 订单金额(USD) &lt;
            <NumberInput v-model="dynamicQuery.destroyAomunt2" style="width:100px;" /> USD

            退回：订单金额(USD) &gt;
            <NumberInput v-model="dynamicQuery.returnAmount" style="width:100px;" /> USD
          </div>
        </div>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import { dynamicListItem } from "./addReportListQuery"
import { NumberInput } from "@/components"
export default {
  name: 'GloballyFormItem',
  components: {
    NumberInput
  },
  props: {
    listQuery: {
      type: Object,
      default: () => ({})
    },
    dynamicQuery: {
      type: Object,
      default: () => ({})
    },
    typeList: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
    }
  },
  data() {
    return {
    };
  },
  created() {
  },
  computed: {
    getRules() {
      return {
        required: true,
        message: '此项不能为空',
        trigger: ['change', 'blur']
      }
    },
    getValueMethodRules() {
      return {
        required: true,
        validator: (rule, value, callback) => {
          const { amount, currencyType, currencyTypePercentage, lowestPriceChecked, lowestPrice, highestPriceChecked, highestPrice } = this.dynamicQuery;
          if (!value) {
            callback(new Error('此项不能为空'))
            return
          }
          if (value === '0' && amount === '') {
            callback(new Error('请填写固定金额数'))
            return
          }
          if (value === '1' && (currencyType === '' || currencyTypePercentage === '')) {
            callback(new Error('请选择比例金额类型并填写比例值'))
            return
          }
          if (value === '1' && lowestPriceChecked && lowestPrice === '') {
            callback(new Error('请填写最低价格'))
            return
          }
          if (value === '1' && highestPriceChecked && highestPrice === '') {
            callback(new Error('请填写最高价格'))
            return
          }
          if (value === '1' && lowestPriceChecked && highestPriceChecked && lowestPrice > highestPrice) {
            callback(new Error('最高价格不得低于最低价格'))
            return
          }
          callback()
        },
        trigger: ['change', 'blur']
      }
    }
  },
  watch: {

  },
  methods: {
    add() {
      this.listQuery.list.push({ ...dynamicListItem })
    },
    remove() {
      this.listQuery.list.splice(this.index, 1)
    },
  },
};
</script>

<style scoped lang='scss'>
.el-checkbox,
.el-radio {
  margin-right: 5px;
  height: 28px;
  line-height: 28px;
}
$color: #f0f0f0;
.dynamicHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
  background-color: $color;
}
.dynamicBody {
  padding-top: 5px;
  border: 1px solid $color;
  margin-bottom: 10px;
}
</style>
