<template>
  <div>
    <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
      <el-form-item label="商品状态：" prop="productState">
        <el-radio-group v-model="listQuery.productState">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">起批量</el-radio>
          <el-radio :label="4">暂时缺货</el-radio>
          <el-radio :label="2">停产</el-radio>
          <el-radio :label="3">锁定</el-radio>
          <el-radio :label="5">清库</el-radio>
          <el-radio :label="6">草稿</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <el-form-item label="起批量：" prop="batchNum" v-if="listQuery.productState===1">
        <NumberInput v-model="listQuery.batchNum" min="2" max="999999" style="width:193px;" /> 单位起卖
      </el-form-item><br v-if="listQuery.productState===1">
      <el-form-item label="商品状态备注：" prop="productStateRemark">
        <el-input v-model="listQuery.productStateRemark" style="width:586px;" maxlength="300" show-word-limit class="inputLimit" />
      </el-form-item><br>
    </el-form>
    <el-button @click="editorDialog()" size="mini" type="primary" style="margin-bottom:10px;" :disabled="listQuery.supplyPrices.length>=1" v-if='!$route.query.readonly'>添加/修改供货价</el-button>
    <el-table ref="plTable" :data="listQuery.supplyPrices" height="60vh" use-virtual showBodyOverflow="title" showHeaderOverflow="title" border>
      <el-table-column label="是否默认" align="center" width="80">
        <template #default="{ row }">
          {{ row.isDefaultSupply? '是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="供应商编号" align="center" width="150">
        <template #default="{ row }">
          <div>{{ row.supplierId }}</div>
          <el-link type="primary" :href="row.webProductUrl" target="_blank">采购链接</el-link>
        </template>
      </el-table-column>
      <el-table-column label="供应商报价" align="center" width="100" prop="quotePrice" />
      <el-table-column label="供应商SKU" align="center" width="180" prop="supplierSku" />
      <el-table-column label="供应商名称" align="center" width="180" prop="supplierName" />
      <el-table-column label="开票税点" align="center" width="100" prop="taxRate" />
      <el-table-column label="含税价" align="center" width="100" prop="taxPeice" />
      <el-table-column label="采购运费" align="center" width="100" prop="purchaseFreight" />
      <el-table-column label="生产天数" align="center" width="100" prop="productionDay" />
      <el-table-column label="运输天数" align="center" width="100" prop="transportDay" />
      <el-table-column label="入库天数" align="center" width="100" prop="storageDay" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="100">
        <template #default="{ row, $index }">
          <el-button type="text" size="small" @click="editorDialog(row, $index, true)">查看</el-button>
          <el-button type="text" size="small" @click="editorDialog(row, $index, false)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <AddComPriceDialog :visible.sync="comPriceDialog.visible" :row.sync="comPriceDialog.row" :readonly="comPriceDialog.readonly" @callback="dialogCallback" />

    <div style="text-align:center;margin:30px 0;" v-if="!$route.query.readonly">
      <el-button type="primary" size="small" class="elButton" @click="home.commit" :loading="home.commitLoad">保存并继续编辑</el-button>
      <el-button type="primary" size="small" class="elButton" @click="$router.replace({ path:'/pmsV2/pmsV2List', query:{state: listQuery.productState} })">
        关闭页面
      </el-button>
    </div>
  </div>
</template>

<script>
import { NumberInput } from "@/components"
import AddComPriceDialog from '../components/AddComPriceDialog'
export default {
  name: 'CommodityPrice',
  components: {
    AddComPriceDialog,
    NumberInput
  },
  props: {
    home: null
  },
  data() {
    return {
      listQuery: {},
      rules: {
        batchNum: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] }
      },
      comPriceDialog: {
        visible: false,
        row: undefined,
        index: undefined,
        readonly: false
      },
    };
  },
  created() {
    this.listQuery = this.home.listQuery
  },
  methods: {
    editorDialog(row, index, readonly) {
      this.comPriceDialog = {
        visible: true,
        row,
        index,
        readonly
      }
    },
    dialogCallback(obj) {
      const { comPriceDialog: { index }, listQuery: { supplyPrices } } = this
      if (index !== undefined) {
        this.$set(supplyPrices, index, obj)
        return
      }
      supplyPrices.push({ ...obj })
    },
    validate() {
      const { developStatus, supplyPrices } = this.listQuery
      const supplyPricesValid = developStatus === 2 ? supplyPrices.length !== 0 : true
      if (!supplyPricesValid) {
        this.$message.warning("请添加供货价")
      }
      let formValid;
      this.$refs.form.validate(valid => {
        formValid = valid
      })
      return formValid && supplyPricesValid
    }
  },
};
</script>

<style scoped lang='scss'>
.inputLimit {
  /deep/ .el-input__count {
    position: absolute;
    left: 10px;
  }
}
</style>
