<template>
  <el-dialog :visible.sync="visible" :before-close="close" width="700px" :close-on-click-modal="false" @open="dialogOpen">
    <el-form ref="form" size="mini" label-width="120px" :rules="rules" :model="listQuery">
      <el-form-item label="网络采购链接：" prop="webProductUrl">
        <el-input type="textarea" rows="3" v-model="listQuery.webProductUrl" style="width:300px;" @change="webProductUrlChange" />
        <el-button @click="collection" style="vertical-align: top;margin-left:10px;" icon="el-icon-search" :loading="collectionLoading">采集</el-button>
        <transition name="el-zoom-in-top">
          <div v-show="urlChangeTip" style="color:red;position:absolute;font-size: 12px;">链接发生变化，请重新采集</div>
        </transition>
      </el-form-item>
      <el-form-item label="是否默认：" prop="isDefaultSupply">
        <el-radio-group v-model="listQuery.isDefaultSupply">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="付款方式：" prop="paymentType">
        <el-radio-group v-model="listQuery.paymentType">
          <el-radio label="现金付款" />
          <el-radio label="转账付款" />
          <el-radio label="网络在线付款" />
          <el-radio label="阿里账期付款" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="供应商SKU：" prop="supplierSku">
        <!-- maxlength="100" show-word-limit class="inputLimit" -->
        <el-input v-model="listQuery.supplierSku" style="width:193px;" />
      </el-form-item>
      <el-form-item label="供应商编号：" prop="supplierId">
        <div style="width:300px;">{{ listQuery.supplierId }}</div>
      </el-form-item>
      <el-form-item label="供应商名称：" prop="supplierName">
        <!-- <el-input v-model="listQuery.supplierName" style="width:300px;" disabled /> -->
        <el-select v-model="listQuery.supplierName" placeholder="请选择" style="width:300px;" filterable clearable>
          <el-option v-for="item in typeList.supplierNameList" :key="item.provinceCode" :label="item.supplierName" :value="item.supplierName" />
        </el-select>
      </el-form-item>
      <el-form-item label="发货地：">
        省：<el-select v-model="listQuery.province" placeholder="请选择" style="width:120px;" @change="provinceChange" ref="provinceSelect">
          <el-option v-for="item in typeList.provinceList" :key="item.provinceCode" :label="item.provinceName" :value="item.provinceCode" />
        </el-select>
        市：<el-select v-model="listQuery.city" placeholder="请选择" style="width:120px;" no-data-text="请先选择省份">
          <el-option v-for="item in typeList.cityList" :key="item.cityCode" :label="item.cityName" :value="item.cityCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商报价：" prop="quotePrice">
        <NumberInput v-model="listQuery.quotePrice" float="2" style="width:100px;" @change="quotePriceChange" />
      </el-form-item>
      <el-form-item label="开票税点：" prop="taxRate">
        <NumberInput v-model="listQuery.taxRate" float="2" style="width:100px;" @change="taxRateChange" max="999999" min="0" />
      </el-form-item>
      <el-form-item label="含税价：" prop="taxPeice">
        <NumberInput v-model="listQuery.taxPeice" float="2" style="width:100px;" max="999999" min="0" />
      </el-form-item>
      <el-form-item label="采购运费：" prop="purchaseFreight">
        <NumberInput v-model="listQuery.purchaseFreight" float="2" style="width:100px;" max="999999" min="0" />
      </el-form-item>
      <el-form-item label="是否提供备品：" prop="isStockUp">
        <el-checkbox v-model="listQuery.isStockUp" />
      </el-form-item>
      <el-form-item label="备品比例：" prop="stockUpProportion" v-if="listQuery.isStockUp">
        <NumberInput v-model="listQuery.stockUpProportion" float="2" style="width:100px;" max="100" min="0" /> %
      </el-form-item>
      <el-form-item label="采购天数：" prop="procurementDay">
        <div style="display:inline-block;width:100px">{{ getProcurementDay }}</div>
        <span style="color:red;">采购天数=生产天数+采购运输天数+入库天数</span>
      </el-form-item>
      <el-form-item label="生产天数：" prop="productionDay">
        <NumberInput v-model="listQuery.productionDay" style="width:100px;" max="999" min="0" />
      </el-form-item>
      <el-form-item label="采购运输天数：" prop="transportDay">
        <NumberInput v-model="listQuery.transportDay" style="width:100px;" max="999" min="0" />
        <span style="color:red;">根据区域,一般本地1天，珠三角2天，珠三角以外4天</span>
      </el-form-item>
      <el-form-item label="入库天数：" prop="storageDay">
        <NumberInput v-model="listQuery.storageDay" style="width:100px;" max="999" min="0" />
        <span style="color:red;">默认需1天</span>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" rows="3" v-model="listQuery.remark" style="width:300px;" maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>

    <div class="item_foot" v-show="!readonly">
      <el-button @click="handleOk()" type="primary" size="mini" :loading="commitLoading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { NumberInput } from "@/components"
import { getProvinceInfo, collectProduct, addSupplyPrice, editSupplyPrice, getSupplierNameList, getSupplierDataMainName } from "@/api/pmsV2/pmsV2Editor"
const defaultListQurey = {
  webProductUrl: '',
  isDefaultSupply: true,
  paymentType: '网络在线付款',
  supplierSku: '',
  supplierId: '',
  supplierName: '',
  province: '',
  city: '',
  quotePrice: '',
  taxRate: '',
  taxPeice: '',
  purchaseFreight: '',
  isStockUp: false,
  stockUpProportion: '',
  procurementDay: '',
  productionDay: 0,
  transportDay: 0,
  storageDay: 0,
  remark: '',
  collectPics: [],
  loginId: ""
}
export default {
  name: 'AddComPriceDialog',
  components: {
    NumberInput
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: null,
    readonly: {
      type: Boolean,
      default: false
    },
  },
  data() {
    const validator = (rule, value, callback) => {
      if (Number(value) < '') callback(new Error('此项不能为空'));
      if (Number(value) < 1) callback(new Error('天数必须大于0'));
      callback()
    }
    return {
      listQuery: Object.assign({}, defaultListQurey),
      rules: {
        quotePrice: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        productionDay: { required: true, validator, trigger: ['change', 'blur'] },
        transportDay: { required: true, validator, trigger: ['change', 'blur'] },
        storageDay: { required: true, validator, trigger: ['change', 'blur'] },
        supplierName: { required: true, message: '采集链接无效，无法采集供应商', trigger: ['change', 'blur'] },
      },
      typeList: {
        provinceList: [],
        cityList: [],
        supplierNameList: []
      },
      commitLoading: false,
      collectionLoading: false,
      urlChangeTip: false
    };
  },
  created() {
    getProvinceInfo().then(res => {
      this.typeList.provinceList = res.data
    })
  },
  beforeDestroy() {
    this.close();
  },
  computed: {
    getProcurementDay() {
      const { productionDay, transportDay, storageDay } = this.listQuery
      return Number(productionDay) + Number(transportDay) + Number(storageDay)
    }
  },
  methods: {
    provinceChange(value) {
      const currentItem = this.typeList.provinceList.find(item => item.provinceCode === value);
      this.typeList.cityList = currentItem.lmProductCityList
    },
    async dialogOpen() {
      const res = await getSupplierNameList()
      this.typeList.supplierNameList = res.data
      if (!this.row) return;
      this.listQuery = Object.assign({}, this.row)
      this.provinceChange(this.listQuery.province)
    },
    close() {
      setTimeout(() => {
        if (this.$refs.form) this.$refs.form.resetFields()
        this.listQuery = Object.assign({}, defaultListQurey)
      })
      this.$emit("update:visible", false)
    },
    async handleOk() {
      try {
        const { $route: { query: { id, copy } }, listQuery, $message, row, getProcurementDay } = this
        let resId;
        let formValid;
        this.$refs.form.validate(valid => { formValid = valid })
        if (!formValid) {
          $message.warning('请填写完整信息')
          return
        };
        const resName = await getSupplierDataMainName({ supplierName: this.listQuery.supplierName })
        if (resName.data.status === false || resName.data.isBlacklist) {
          await this.$confirm(`该供应商为 ${resName.data.isBlacklist ? '黑名单' : ''} ${resName.data.status === false ? '停用' : ''} , 是否继续?`, '提示', { type: 'warning' })
        }
        let requestApi = row ? editSupplyPrice : addSupplyPrice
        if (id && !copy) {
          requestApi({ ...listQuery, procurementDay: getProcurementDay, productId: Number(id) }).then(res => {
            $message.success(res.message)
            resId = res.data
          })
        }
        this.$emit('callback', { ...this.listQuery, procurementDay: getProcurementDay, id: resId, productId: Number(id) || null })
        this.close()
      } catch (err) { }
    },
    async collection() {
      this.collectionLoading = true
      try {
        const res = await collectProduct({ url: this.listQuery.webProductUrl })
        const { shippingInfo: { sendGoodsAddressText }, attributes, referencePrice } = res.data[0].productInfo
        const provinceCity = sendGoodsAddressText.split(' ')
        const provinceItem = this.typeList.provinceList.find(item => item.provinceName.includes(provinceCity[0])) || {}
        const cityItem = provinceItem.lmProductCityList.find(item => item.cityName.includes(provinceCity[1])) || {}
        this.listQuery.province = provinceItem.provinceCode || ''
        this.listQuery.city = cityItem.cityCode || ''
        this.provinceChange(this.listQuery.province)

        // 供应商编号
        this.listQuery.supplierName = res.data[0].supplierName
        // 旺旺id
        this.listQuery.loginId = res.data[0].loginId
        //供应商报价
        this.listQuery.quotePrice = referencePrice

        // sku
        const productId = attributes.find(item => item.attributeName === '货号') || {}
        this.listQuery.supplierSku = productId.value || ''
        // 图片
        this.listQuery.define1 = res.data.map(item => item.images).flat().join()

      } catch (error) {
        this.listQuery.province = ''
        this.listQuery.city = ''
        this.listQuery.supplierName = ''
        this.listQuery.quotePrice = ''
        this.listQuery.supplierSku = ''
        this.listQuery.define1 = ''
      }
      this.collectionLoading = false
      this.urlChangeTip = false
    },
    webProductUrlChange() {
      this.urlChangeTip = true
      this.listQuery.province = ''
      this.listQuery.city = ''
      this.listQuery.supplierName = ''
      this.listQuery.quotePrice = ''
      this.listQuery.supplierSku = ''
      this.listQuery.define1 = ''
    },
    quotePriceChange(value) {
      const { listQuery } = this;
      listQuery.taxPeice = Number((value * listQuery.taxRate).toFixed(2))
    },
    taxRateChange(value) {
      const { listQuery } = this;
      listQuery.taxPeice = Number((value * listQuery.quotePrice).toFixed(2))
    }
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  height: 500px;
  overflow-y: scroll;
}
.item_foot {
  margin-top: 15px;
  text-align: right;
}
.inputLimit {
  /deep/ .el-input__count {
    position: absolute;
    left: 10px;
  }
}
</style>
