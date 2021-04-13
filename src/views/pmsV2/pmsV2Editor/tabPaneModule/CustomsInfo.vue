<template>
  <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
    <el-form-item label="商品报关英文名：" prop="declarationName">
      <el-input v-model="listQuery.declarationName" style="width:800px;" maxlength="200" show-word-limit />
    </el-form-item><br>
    <el-form-item label="商品报关中文名：" prop="declarationNameCn">
      <el-input v-model="listQuery.declarationNameCn" style="width:800px;" maxlength="200" show-word-limit />
    </el-form-item><br>
    <el-form-item label="商品用途：" prop="declarationUrpose">
      <el-input v-model="listQuery.declarationUrpose" style="width:800px;" maxlength="80" show-word-limit />
    </el-form-item><br>
    <el-form-item label="报关材质：" prop="declarationMaterial">
      <el-input v-model="listQuery.declarationMaterial" style="width:800px;" maxlength="80" show-word-limit />
    </el-form-item><br>
    <el-form-item label="进口国家：" prop="importCountry">
      <el-input v-model="listQuery.importCountry" style="width:800px;" maxlength="50" show-word-limit />
    </el-form-item><br>
    <el-form-item label="海关编码：" prop="declarationCode">
      <el-input v-model="listQuery.declarationCode" style="width:800px;" maxlength="20" show-word-limit />
    </el-form-item><br>
    <el-form-item label="出口退税率：" prop="declarationReturnTaxrate">
      <template #label>
        <el-tooltip class="item" effect="dark" placement="top">
          <div>
            出口退税率 <i class="el-icon-warning" />：
          </div>
          <div slot="content">
            最多保留两位小数
          </div>
        </el-tooltip>
      </template>
      <NumberInput v-model="listQuery.declarationReturnTaxrate" float="2" style="width:800px;" max='999' /> %
    </el-form-item><br>
    <el-form-item label="报关价：" prop="declarationPriceRate">
      <template #label>
        <el-tooltip class="item" effect="dark" placement="top">
          <div>
            报关价 <i class="el-icon-warning" />：
          </div>
          <div slot="content">
            最多保留两位小数
          </div>
        </el-tooltip>
      </template>
      <NumberInput v-model="listQuery.declarationPriceRate" float="2" style="width:800px;" max='999999' min='0' />
    </el-form-item><br>
    <el-form-item label="报关单位：" prop="declarationUnit">
      <el-input v-model="listQuery.declarationUnit" style="width:800px;" maxlength="100" show-word-limit />
    </el-form-item><br>
    <el-form-item label="申报要素：" prop="declarationElement">
      <el-input type="textarea" rows="4" v-model="listQuery.declarationElement" style="width:800px;" maxlength="400" show-word-limit />
    </el-form-item><br>
    <el-form-item label="备注：" prop="remark">
      <el-input type="textarea" rows="4" v-model="listQuery.remark" style="width:800px;" maxlength="300" show-word-limit class="inputLegth" />
    </el-form-item><br>

    <div style="text-align:center;margin-bottom:10px;" v-if="!$route.query.readonly">
      <el-button type="primary" size="small" class="elButton" @click="home.commit" :loading="home.commitLoad">保存并继续编辑</el-button>
      <el-button type="primary" size="small" class="elButton" @click="$router.replace({ path:'/pmsV2/pmsV2List', query:{state: listQuery.productState} })">
        关闭页面
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { NumberInput } from "@/components"
export default {
  name: 'CustomsInfo',
  components: {
    NumberInput
  },
  props: {
    home: null
  },
  data() {
    return {
      listQuery: {},
      rules: {},
    };
  },
  created() {
    this.listQuery = this.home.listQuery
  },
  methods: {},
};
</script>

<style scoped lang='scss'>
/deep/ .inputLegth {
  width: 800px;
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}
</style>
