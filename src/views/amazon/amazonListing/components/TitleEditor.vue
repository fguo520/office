<template>
  <el-dialog title="编辑" :visible.sync="visible" width="800px" :before-close="close">
    <el-form ref="ruleForm" label-width="100px" size="mini" :model="rows">
      <el-form-item label="SKU: ">
        <span v-copy="rows.sku">{{rows.sku}}</span>
      </el-form-item>
      <el-form-item label="ASIN: ">
        <span v-copy="rows.asin1">{{rows.asin1}}</span>
      </el-form-item>
      <el-form-item label="渠道账号: ">
        <span v-copy="rows.storeNameAs">{{rows.storeNameAs}}</span>
      </el-form-item>
      <el-form-item label="渠道SKU: ">
        <span v-copy="rows.sellerSku">{{rows.sellerSku}}</span>
      </el-form-item>
      <el-form-item label="产品标题: " style="width:100%">
        <el-input v-model="rows.itemName" maxlength="250" show-word-limit class="inputLegth" />
      </el-form-item>
      <el-form-item label="产品描述: " style="width:100%">
        <Tinymce :height="400" :width="600" v-model="rows.itemDescription" :resetContent.sync="tinymceReset" limit="2000" showLimit limitHtml :limitReset="false" :editorImage="false" />
      </el-form-item>
      <el-form-item label-width="0"  style="width:100%">
        <div style="text-align:right;margin-right:60px">
          <el-button @click="close" size="mini">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交平台</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { Tinymce } from "@/components"
import { batchEditListingTitle } from "@/api/amazon/amazonEditor"
export default {
  name: 'TitleEditor',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Object,
      default: () => ({})
    }
  },
  components: { Tinymce },
  data() {
    return {
      tinymceReset: true
    }
  },
  beforeDestroy() {
    this.close();
  },
  watch: {
    rows(newValue) {
      console.log(newValue)
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.$emit("request")
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          batchEditListingTitle(this.rows).then(res => {
            this.$message.success(res.message);
            this.close();
            this.$emit("request")
          })
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/ .inputLegth {
  width: 600px;
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}
.el-dialog__body {
  .el-form {
    overflow: hidden;
    .el-form-item {
      width: 50%;
      float: left;
    }
  }
}
</style>