<template>
  <el-tabs v-model="languageTabs" style="width:900px">
    <el-tab-pane v-for="(item,index) in list" :key="index" :label="getLanguages(item.languageCode)" :name="item.languageCode">
      <el-form ref="form" label-width="100px" size="mini">
        <el-form-item label="产品亮点：" v-if="item.pageVOs.filter(i=>{return i.contentType===4}).length>0">
          <el-input type="textarea" v-model="item.pageVOs.find(i=>{return i.contentType===4}).translateText" :autosize="{ minRows: 4, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="产品亮点：" v-else>
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="标题：" v-if="item.pageVOs.filter(i=>{return i.contentType===1}).length>0">
          <el-input type="textarea" v-model="item.pageVOs.find(i=>{return i.contentType===1}).translateText" :autosize="{ minRows: 3, maxRows: 3}" />
        </el-form-item>
        <el-form-item label="标题：" v-else>
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 3}" />
        </el-form-item>
        <el-form-item label="关键词：" v-if="item.pageVOs.filter(i=>{return i.contentType===2}).length>0">
          <el-input type="textarea" v-model="item.pageVOs.find(i=>{return i.contentType===2}).translateText" :autosize="{ minRows: 4, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="关键词：" v-else>
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="产品描述：" v-if="item.pageVOs.filter(i=>{return i.contentType===3}).length>0">
          <el-input type="textarea" v-model="item.pageVOs.find(i=>{return i.contentType===3}).translateText" :autosize="{ minRows: 4, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="产品描述：" v-else>
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" />
        </el-form-item>

        <div style="margin-left: 100px;color:red;font-size:14px">温馨提示：每次翻译都会消耗一些费用，请慎重使用</div>
        <div style="margin:-10px 20px 0 0;text-align:right" v-if="$route.query.id">
          <el-button @click="translationDialog" type="primary" size="mini">提交翻译任务</el-button>
        </div>
      </el-form>
    </el-tab-pane>

    <el-dialog title="提交翻译的语种" :visible.sync="visible" width="400px">
      <el-form ref="langue" label-width="100px" size="mini" :model="listQuery">
        <el-form-item label="翻译语言：">
          <el-radio v-model="listQuery.radio" label="1">英语</el-radio>
        </el-form-item>
        <el-form-item label="目标语言：">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="listQuery.languageCodes" @change="checkedChange">
            <el-checkbox v-for="(item,index) in languages" :key="index" :label="item.value" :checked="true">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">取 消</el-button>
        <el-button @click="add" type="primary" size="mini" :loading="addLoading">确 定</el-button>
      </span>
    </el-dialog>
  </el-tabs>
</template>

<script>
import { getTranslateData, submitTranslation, getlanguagesApi } from "@/api/pmsV2/pmsV2Editor"
export default {
  name: 'LangTransla',
  props: {
    home: null
  },
  data() {
    return {
      list: [{ languageCode: 'en', pageVOs: [] }],
      languageTabs: 'en',
      visible: false,
      listQuery: { languageCodes: [], id: "", radio: '1' },
      isIndeterminate: false,
      checkAll: true,
      addLoading: false,
      languages: [{ label: "英语", value: "en" }],
    };
  },
  created() {
    // this.getList()
  },
  computed: {
    getLanguages() {
      return function (type) {
        if (type == "en") {
          return "英语"
        } else {
          return this.languages.length > 0 ? this.languages.find(i => { return i.value == type }).label : ""
        }
      }
    }
  },
  watch: {
    'home.currentTab': function (newValue) {
      if (newValue === 'langTransla') this.getList()
    }
  },
  methods: {
    async getList() {
      const { $route: { query: { id } } } = this
      if (!id) { return }
      const res = await getlanguagesApi()
      this.languages = res.data
      const response = await getTranslateData({ productId: id })
      this.list = response.data
    },
    async add() {
      try {
        const { $route: { query: { id } }, listQuery, $message, list, $confirm, languages, getList } = this;
        if (!id) { return }
        if (listQuery.languageCodes.length == 0) {
          $message.warning("请选择目标语言")
          return
        }
        this.addLoading = true;
        const repeatList = listQuery.languageCodes.filter(item => list.find(listItem => item === listItem.languageCode))
        if (repeatList.length > 0) {
          const repeatLanguage = repeatList.map(item => languages.find(langItem => langItem.value === item).label)
          await $confirm(`已经翻译过 ${repeatLanguage.slice('，')}，是否继续翻译？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
        const res = await submitTranslation({ ...listQuery, productId: id })
        if (res.code == 200) {
          $message.success(res.message)
          getList()
          this.$emit('update:list', res.data)
          this.visible = false
        }
      } catch (error) { }
      this.addLoading = false
    },
    translationDialog() {
      this.visible = true;
      this.isIndeterminate = false;
      this.checkAll = true;
    },
    checkAllChange(val) {
      const { listQuery, languages } = this
      listQuery.languageCodes = val ? languages.map(item => item.value) : [];
      this.isIndeterminate = false;
    },
    checkedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.languages.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.languages.length;
    }
  },
};
</script>

<style scoped  lang="scss">
/deep/.el-tabs .el-tabs__nav-scroll .el-tabs__nav {
  transform: translateX(20px) !important;
}
.el-textarea {
  width: 780px;
}
.el-checkbox-group {
  overflow: hidden;
  .el-checkbox {
    float: left;
    width: 30%;
    margin-right: 20px;
    line-height: 28px;
  }
}
</style>
