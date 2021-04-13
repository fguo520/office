<template>
  <div>
    <el-form ref="form" :model="listQuery" label-width="100px" inline :rules="rules" size="mini">
      <el-form-item label="母体ID：" prop="productGroupSku">
        <el-input v-model="listQuery.productGroupSku" />
      </el-form-item>
      <el-form-item label="母体名称：" prop="productGroupSkuName">
        <el-input v-model="listQuery.productGroupSkuName" />
      </el-form-item>
      <!-- <el-button size="mini" type="primary" @click="addVariants">新增变体</el-button> -->

      <el-table ref="plTable" :data="[home.listQuery]" height="70vh" use-virtual showBodyOverflow="title" showHeaderOverflow="title" border>
        <el-table-column label="sku" align="center" width="150" prop="sku" />
        <el-table-column label="自定义SKU" align="center" width="130">
          <template #default="{ row }">
            <el-input v-model="row.clientSku" disabled size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="颜色" align="center" width="150">
          <template #default="{ row }">
            <el-form-item label="" prop="productColor" class="customFormItem">
              <el-select v-model="row.productColor" placeholder="请选择" size="mini" filterable>
                <el-option v-for="item in home.attrsList['商品颜色']" :key="item.code" :label="item.name" :value="item.code">
                  <div class="colorWheel" :style="{backgroundColor:item.htmlColor}"></div>
                  <span>{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="尺码" align="center" width="150">
          <template #default="{ row }">
            <el-select v-model="row.productSize" placeholder="请选择" size="mini" filterable>
              <el-option v-for="item in home.attrsList['尺码']" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="电源规格" align="center" width="150" v-if="listQuery.powerSocket">
          <template #default="{ row }">
            <el-select v-model="row.powerSocketSpec" placeholder="请选择" size="mini">
              <el-option v-for="item in home.attrsList['电源规格']" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="供应商报价" align="center" width="150">
          <template #default="{ row:{ supplyPrices }}">
            <NumberInput v-model="supplyPrices[0].quotePrice" min="0" float='2' size="mini" v-if="supplyPrices[0]" />
          </template>
        </el-table-column>
        <el-table-column label="净重g" align="center" width="150">
          <template #default="{ row }">
            <NumberInput v-model="row.netWeight" min="0" max="999999999" size="mini" />
            <transition name="el-zoom-in-top">
              <div v-show="row.grossWeight<row.netWeight" class="proportionTip">毛重≥净重</div>
            </transition>

          </template>
        </el-table-column>
        <el-table-column label="毛重g" align="center" width="150">
          <template #default="{ row }">
            <NumberInput v-model="row.grossWeight" min="0" max="999999999" size="mini" />
            <transition name="el-zoom-in-top">
              <div v-show="row.grossWeight<row.netWeight" class="proportionTip">毛重≥净重</div>
            </transition>
          </template>
        </el-table-column>
        <el-table-column label="商品尺寸" align="center" width="150">
          <template #default="{ row }">
            <NumberInput v-model="row.length" min="0" max="999999999" size="mini" placeholder="长(cm)" class="inputClass" />
            <NumberInput v-model="row.width" min="0" max="999999999" size="mini" placeholder="宽(cm)" class="inputClass" />
            <NumberInput v-model="row.height" min="0" max="999999999" size="mini" placeholder="高(cm)" class="inputClass" />
          </template>
        </el-table-column>
        <el-table-column label="包装尺寸" align="center" width="150">
          <template #default="{ row }">
            <NumberInput v-model="row.packLength" min="0" max="999999999" size="mini" placeholder="长(cm)" class="inputClass" />
            <NumberInput v-model="row.packWidth" min="0" max="999999999" size="mini" placeholder="宽(cm)" class="inputClass" />
            <NumberInput v-model="row.packHeight" min="0" max="999999999" size="mini" placeholder="高(cm)" class="inputClass" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ $index }">
            <el-button type="text" size="small" @click="tableData.splice($index, 1)" v-show="$index!==0">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div style="text-align:center;margin:30px 0;" v-if="!$route.query.readonly">
      <el-button type="primary" size="small" class="elButton" @click="home.commit" :loading="home.commitLoad">保存并继续编辑</el-button>
      <el-button type="primary" size="small" class="elButton" @click="$router.replace({ path:'/pmsV2/pmsV2List', query:{state: listQuery.productState} })">
        关闭页面
      </el-button>
    </div>
  </div>
</template>

<script>
import { addProductVariants, searchVariants, getClientSku } from "@/api/pmsV2/pmsV2Editor"
import { NumberInput } from "@/components"
export default {
  name: 'VariationMGT',
  components: {
    NumberInput
  },
  props: {
    home: null
  },
  data() {
    const commodityReviewValid = (rule, value, callback) => {
      const { developStatus } = this.listQuery;
      if (developStatus === 2 && (typeof value === 'object' ? value.length === 0 : value === '')) {
        callback(new Error('此项不能为空！'))
        return
      }
      callback()
    }
    return {
      listQuery: {
        productGroupSku: '',
        productGroupSkuName: ''
      },
      rules: {
        productColor: { validator: commodityReviewValid, trigger: ['change', 'blur'] }
      },
    };
  },
  created() {
    this.listQuery = this.home.listQuery
  },
  methods: {
    async addVariants() {
      const res = await getClientSku()
      this.tableData.push({
        clientSku: res.data,
        productColor: '',
        productSize: '',
        powerSocketSpec: '',
        quotePrice: 0,
        netWeight: 0,
        grossWeight: 0,
        length: 0,
        width: 0,
        height: 0,
        packLength: 0,
        packWidth: 0,
        packHeight: 0,
      })
    },
    validate() {
      let callBackValid;
      this.$refs.form.validate(valid => {
        callBackValid = valid
      })
      return callBackValid
    }
  },
};
</script>

<style scoped lang='scss'>
.inputClass {
  display: block;
  margin: 5px 0;

  /deep/ .el-input__inner {
    text-align: center;
  }
}
.colorWheel {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid gray;
}
.proportionTip {
  color: red;
  position: absolute;
  width: calc(100% - 20px);
}
.customFormItem {
  margin-top: 18px;
}
</style>
