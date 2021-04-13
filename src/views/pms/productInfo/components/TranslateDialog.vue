<template>
  <el-dialog title="多语言翻译" :visible.sync="visible" :before-close="close" width="600px">
    <el-form ref="form" label-width="100px" size="mini" :model="listQuery" :rules="Rules">
      <el-form-item label="系统SKU：" prop="skus">
        <TextareaInput v-model="listQuery.skus" />
        <div v-show="this.text.length>0" style="color:red">{{this.text}}</div>
      </el-form-item>
      <el-form-item label="翻译语言：">
        <el-radio v-model="listQuery.radio" label="1">英语</el-radio>
      </el-form-item>
      <el-form-item label="目标语言：" prop="languageCodes">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="listQuery.languageCodes" @change="checkedChange">
          <el-checkbox v-for="(item,index) in languagesList" :key="index" :label="item.value" :checked="true">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="handleOk" type="primary" size="mini" :loading="addLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>

import {
  TextareaInput,
} from "@/components";
import { batchTranslate } from "@/api/pms/productInfo"
export default {
  name: "TranslateDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    languagesList: {
      type: Array,
      default: () => []
    }
  },
  components: { TextareaInput },
  data() {
    return {
      listQuery: { languageCodes: [], skus: [], radio: '1' },
      isIndeterminate: false,
      checkAll: true,
      Rules: {
        skus: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        languageCodes: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      addLoading: false,
      text: ""
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.listQuery.skus=[]
      this.addLoading=false
      this.text=""
    },
    async handleOk() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        if (this.listQuery.skus.length > 5) {
          const time = Math.ceil(this.listQuery.skus.length * 20 / 60)
          this.$message.warning(`当前翻译量过大，请等待${time}分钟再来查看`)
        }
        this.addLoading = true;
        const res = await batchTranslate(this.listQuery)
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.message
          })
          this.text = res.data
          this.addLoading = false;
        }
      })
    },
    checkAllChange(val) {
      const { listQuery, languagesList } = this
      listQuery.languageCodes = val ? languagesList.map(item => item.value) : [];
      this.isIndeterminate = false;
    },
    checkedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.languagesList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.languagesList.length;
    }
  }
}
</script>
<style  lang="scss" scoped>
/deep/.el-form {
  .el-textarea__inner {
    width: 360px;
    height: 50px !important;
  }
}
</style>