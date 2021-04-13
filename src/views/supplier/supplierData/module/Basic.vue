<template>
  <vueScroll>
    <el-form ref="form" :model="listQuery" label-width="100px" inline :rules="rules" size="mini" style="height: 568px;overflow-y: auto" :disabled="this.check">
      <el-form-item label="供应商代码:">
        <span>{{listQuery.supplierCode}}</span>
        <el-checkbox v-model="listQuery.status">启用</el-checkbox>
      </el-form-item><br>
      <el-form-item label="供应商名称:" prop="supplierName">
        <el-input v-model="listQuery.supplierName" maxlength="64" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="合作类型:" prop="cooperateType">
        <el-select v-model="listQuery.cooperateType" placeholder="请选择" size="mini" clearable style="width:100px" filterable>
          <el-option v-for="(item, index) in typeList.cooperateTypeList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商类型:" prop="supplierType">
        <el-select v-model="listQuery.supplierType" placeholder="请选择" size="mini" clearable style="width:100px" filterable>
          <el-option v-for="(item, index) in typeList.supplierTypeList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购类型:" prop="purchaseType">
        <el-select v-model="listQuery.purchaseType" placeholder="请选择" size="mini" clearable style="width:100px" filterable @change="purchaseTypeChange">
          <el-option v-for="(item, index) in typeList.purchaseTypeList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商等级:">
        <el-select v-model="listQuery.supplierGrade" placeholder="请选择" size="mini" clearable style="width:100px" filterable>
          <el-option v-for="(item, index) in typeList.supplierGradeList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="不良品处理:" prop="badHandle" style="width:413px">
        <el-radio-group v-model="listQuery.badHandle">
          <el-radio v-for="(item,index) in typeList.badHandleList" :key="index" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="供应商发货地:" prop="supplierShippingAddressProvince" label-width="110px" style="margin-left:-10px">
        <el-select v-model="listQuery.supplierShippingAddressProvince" placeholder="省" size="mini" clearable style="width:155px" filterable @change="supplierShipChange">
          <el-option v-for="(item, index) in typeList.supplierShipList" :key="index" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
        <el-select v-model="listQuery.supplierShippingAddressCity" placeholder="市" size="mini" clearable style="width:155px" filterable>
          <el-option v-for="(item, index) in typeList.supplierCityList" :key="index" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="主营品类:">
        <el-cascader v-model="listQuery.classIds" size="mini" :options="classIdsList" clearable placeholder="全部" :props="{label: 'classnamecn',value: 'classid',checkStrictly: true}" style="width:742px;" filterable />
      </el-form-item><br>
      <el-form-item label="绑定仓库:">
        <el-select v-model="listQuery.warehouseShipping" placeholder="请选择" size="mini" clearable style="width:742px" filterable>
          <el-option v-for="(item, index) in typeList.warehouseShippingList" :key="index" :label="item.warehousename" :value="item.warehouseid">
          </el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="供应商网址:">
        <div style="position: relative">
          <el-input v-model.trim="listQuery.supplierUrl" clearable style="width:742px" />
          <el-link :href="listQuery.supplierUrl" type="info" :underline="false" target="_blank" style="position: absolute;width: 50px;right: 0px"><span v-show="listQuery.supplierUrl" style="color:#52c41a;background-color: #fff;"><i class="el-icon-link"></i>跳转</span></el-link>
          <span style="position: absolute;top: 5px;right:-80px" v-if="rolePermissionJudge('/supplierData/ww')" v-show="listQuery.supplierLoginId"><a target="_blank" :href="`http://amos.alicdn.com/getcid.aw?v=2&uid=${listQuery.supplierLoginId}&site=cntaobao&s=1&groupid=0&charset=utf-8`"><img border="0" :src="`http://amos.alicdn.com/online.aw?v=2&uid=${listQuery.supplierLoginId}&site=cntaobao&s=1&charset=utf-8`" alt="" title="" /></a></span>
        </div>
      </el-form-item><br>
      <el-form-item label="供应商备注:">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="listQuery.supplierRemark" maxlength="5000" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="开发人员:" prop="developAdminId">
        <el-select v-model="listQuery.developAdminId" placeholder="请选择" size="mini" clearable class="input-width" filterable>
          <el-option v-for="(item, index) in typeList.developAdminIdList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购人员:" prop="buyerAdminId">
        <el-select v-model="listQuery.buyerAdminId" placeholder="请选择" size="mini" clearable class="input-width" filterable>
          <el-option v-for="(item, index) in typeList.buyerAdminIdList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item><br>
    </el-form>
    <div style="text-align:center; position: absolute; bottom:0px; width: 100%;">
      <el-button @click="home.close">取消</el-button>
      <el-button @click="home.submit" type="primary" :loading="home.submitLoading" v-if="!this.check">保存</el-button>
    </div>
  </vueScroll>
</template>
<script>
import { getProvinceInfo, getLmShApiWarehouseList } from "@/api/supplier/supplierData"
import { productClassList } from "@/api/pmsV2/pmsV2List"
export default {
  name: "Basic",
  props: {
    home: null,
    check: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listQuery: {},
      typeList: {},
      rules: {
        supplierName: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        cooperateType: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        supplierType: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        purchaseType: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        supplierGrade: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        badHandle: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        supplierShippingAddressProvince: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        developAdminId: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        buyerAdminId: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
      },
      classIdsList: []
    }
  },
  watch: {
    'listQuery.purchaseType': function (newValue) {
      if (this.listQuery.id) return
      if (newValue == 1) this.listQuery.badHandle = 2
    }
  },
  created() {
    this.listQuery = this.home.listQuery
    this.typeList = this.home.list
    this.typeList.cooperateTypeList = [{ label: "正常", value: 1 }, { label: "临时", value: 2 }, { label: "备用", value: 3 }]
    this.typeList.supplierGradeList=[{ label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" }, { label: "D", value: "D" }, { label: "E", value: "E" }]
      this.getType()
  },
  methods: {
    async supplierShipChange(supplierShippingAddressProvince, check) {
      this.typeList.supplierCityList = []
      if (!check) { this.listQuery.supplierShippingAddressCity = "" }
      if (!this.listQuery.supplierShippingAddressProvince) return
      const res = await getProvinceInfo({ provinceCode: supplierShippingAddressProvince })
      this.typeList.supplierCityList = res.data
    },
    async purchaseTypeChange(purchaseType, check) {
      if (!check) { this.listQuery.warehouseShipping = "" }
      const res = await getLmShApiWarehouseList({ purchaseType: purchaseType })
      this.typeList.warehouseShippingList = res.data
    },
    async getType() {
      productClassList().then(res => {
        const obj = {};
        const gradeArr = [];
        res.data.forEach(item => {
          obj.hasOwnProperty(item.parentid) ? obj[item.parentid].push(item) : obj[item.parentid] = [item]
        })
        for (let itemArr in obj) {
          let index = obj[itemArr][0].grade - 1
          if (gradeArr[index] instanceof Object) {
            gradeArr[index][itemArr] = obj[itemArr]
          } else {
            gradeArr[index] = {}
            gradeArr[index][itemArr] = obj[itemArr]
          }
        }
        const classList = gradeArr.reduceRight((obj, gradeItem, index) => {
          Object.values(gradeItem).forEach(itemArr => {
            itemArr.forEach(item => {
              item.children = obj[item.classid]
            })
          })
          return gradeItem
        })
        this.classIdsList = classList[0]
      })
    },
    validate() {
      let callBackValid;
      this.$refs.form.validate((valid) => { callBackValid = valid })
      return callBackValid
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/ .inputLegth {
  width: 742px;
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}
/deep/ .el-textarea .el-input__count {
  position: absolute;
  right: -58px;
  bottom: 0;
}
</style>