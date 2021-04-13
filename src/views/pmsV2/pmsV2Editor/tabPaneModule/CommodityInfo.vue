<template>
  <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
    <el-form-item label="商品英文名：" prop="productName">
      <el-input v-model="listQuery.productName" maxlength="250" show-word-limit class="inputLegth" />
      <div style="color:red;">注：商品英文名即商品英文标题，用于Amazon/Ebay/Wish/速卖通等平台Listing上架标题;平台暂不支持特殊字符上架，不支持中文输入。</div>
    </el-form-item><br>
    <el-form-item label="SEO标题：" prop="pageTitle">
      <el-input type="textarea" rows="4" v-model="listQuery.pageTitle" class="inputLegth" />
      <el-button @click="listQuery.pageTitle = listQuery.productName">同商品英文名</el-button>
    </el-form-item><br>
    <el-form-item label="SEO关键字：" prop="mateKeyword">
      <el-input class="inputLegth" type="textarea" rows="4" v-model="listQuery.mateKeyword" placeholder="多个关键词以、隔开" maxlength="1000" show-word-limit />
      <div style="color:red;">*注释：多个关键词以,分开 </div>
    </el-form-item><br>
    <el-form-item label="搜索关键字：" prop="searchKeyword">
      <el-input type="textarea" rows="4" v-model="listQuery.searchKeyword" placeholder="多个关键词以、隔开" class="inputLegth" />
      <el-button @click="listQuery.searchKeyword = listQuery.mateKeyword">SEO关键字</el-button>
      <div style="color:red;">*注释：多个关键词以,分开;平台暂不支持特殊字符上架</div>
    </el-form-item><br>
    <el-form-item label="SEO描述：" prop="mateDescription">
      <el-input type="textarea" rows="4" v-model="listQuery.mateDescription" class="inputLegth" maxlength="1000" show-word-limit />
    </el-form-item><br>
    <el-form-item label="商品详细描述：" prop="productDescription">
      <Tinymce :height="400" :width="800" v-model="listQuery.productDescription" :resetContent.sync="tinymceReset" limit="5000" showLimit limitReset limitHtml :editorImage="false" />
      <!-- <el-input type="textarea" rows="4" v-model="listQuery.productDescription" class="inputLegth" maxlength="1000" show-word-limit /> -->
      <div style="color:red;">*注释：平台暂不支持特殊字符上架。</div>
    </el-form-item><br>
    <el-form-item label="商品特征亮点：" prop="featureList">
      <el-input type="textarea" rows="4" v-model="listQuery.featureList" class="inputLegth" placeholder="多个亮点，每个亮点一行，输入回车换行" maxlength="2000" show-word-limit />
      <div style="color:red;">*注释：多个亮点，每个亮点一行，输入回车换行;平台暂不支持特殊字符上架。</div>
    </el-form-item><br>
    <el-form-item label="包装清单：" prop="packingList">
      <el-input type="textarea" rows="4" v-model="listQuery.packingList" class="inputLegth" maxlength="2000" show-word-limit />
    </el-form-item><br>

    <div style="text-align:center;margin-bottom:30px;" v-if="!$route.query.readonly">
      <el-button type="primary" size="small" class="elButton" @click="home.commit" :loading="home.commitLoad">保存并继续编辑</el-button>
      <el-button type="primary" size="small" class="elButton" @click="$router.replace({ path:'/pmsV2/pmsV2List', query:{state: listQuery.productState} })">
        关闭页面
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { NumberInput, Tinymce } from "@/components"
export default {
  name: 'CommodityInfo',
  components: {
    NumberInput,
    Tinymce
  },
  props: {
    home: null
  },
  watch: {
    'home.listQuery.productDescription': function () {
      this.$refs.form.validateField('productDescription')
    }
  },
  data() {
    const checkChinese = (rule, value, callback) => {
      const reg = /[\u4E00-\u9FA5]/
      if (reg.test(value)) callback(new Error('检测含有中文字符'))
      callback()
    }
    return {
      listQuery: {},
      rules: {
        productName: { required: false, validator: checkChinese, trigger: ['change', 'blur'] },
        pageTitle: { required: false, validator: checkChinese, trigger: ['change', 'blur'] },
        mateKeyword: { required: false, validator: checkChinese, trigger: ['change', 'blur'] },
        searchKeyword: { required: false, validator: checkChinese, trigger: ['change', 'blur'] },
        mateDescription: { required: false, validator: checkChinese, trigger: ['change', 'blur'] },
        productDescription: { required: false, validator: checkChinese, trigger: ['change', 'blur'] },
        featureList: { required: false, validator: checkChinese, trigger: ['change', 'blur'] },
        packingList: { required: false, validator: checkChinese, trigger: ['change', 'blur'] },
      },
      tinymceReset: true,
    };
  },
  created() {
    this.listQuery = this.home.listQuery
  },
  methods: {
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
/deep/ .inputLegth {
  width: 800px;
  .el-input__count {
    position: absolute;
    right: -55px;
  }
}
</style>
