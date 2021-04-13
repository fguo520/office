<template>
  <el-dialog :title="`${row?'编辑':'新增'}服务商授权`" :visible.sync="visible" width="700px" append-to-body :before-close="close" @open="open">
    <el-form ref="form" label-width="150px" size="mini" inline :model="listQuery" :rules="rules">
      <el-form-item label="申报规则名称：" prop="ruleName">
        <el-input v-model="listQuery.ruleName" style="width:450px;" />
      </el-form-item><br />
      <el-form-item label="绑定运输方式：" prop="transportationMethod">
        <el-select v-model="listQuery.transportationMethod" style="width:450px" filterable>
          <el-option-group v-for="(group, index) in typeList.serviceList" :key="index" :label="group.logisticsServeiceName">
            <el-option v-for="(item, itemIndex) in group.list" :key="itemIndex" :label="item" :value="item" />
          </el-option-group>
        </el-select>
      </el-form-item><br />
      <el-form-item label="目的国家：" prop="destinationCountry">
        <el-radio-group v-model="listQuery.destinationCountry" @change="destinationChange">
          <el-radio label="0">全球通用</el-radio>
          <el-radio label="1">按国家申报</el-radio>
        </el-radio-group>
      </el-form-item><br />

      <div style="height:300px; overflow-y:scroll;">
        <DynamicFormItem :dynamicQuery="listQuery.list[0]" :listQuery="listQuery" :typeList="typeList" :index="0" v-if="listQuery.destinationCountry === '0'" />

        <div v-if="listQuery.destinationCountry === '1'">
          <DynamicFormItem v-for="(item, index) in listQuery.list" :key="index" :index="index" :listQuery="listQuery" :dynamicQuery="listQuery.list[index]" :typeList="typeList" />
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="commit()" type="primary" size="mini" :loading="commitLoading" v-if="!readonly">保 存</el-button>
      <el-button @click="close" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DynamicFormItem from './DynamicFormItem'
import { defaultListQuery, dynamicListItem } from "./addReportListQuery"
import { insert, checkRuleName } from "@/api/logistics/reportingRules"
export default {
  name: 'AddReporRulesDialog',
  components: {
    DynamicFormItem
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
    typeList: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      rules: {
        ruleName: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        transportationMethod: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        destinationCountry: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
      },
      commitLoading: false
    };
  },
  created() {

  },
  methods: {
    open() {
      if (!this.row) return
      this.listQuery = JSON.parse(JSON.stringify(this.row))
    },
    close() {
      const { $refs } = this
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, { ...defaultListQuery, list: [{ ...dynamicListItem }] })
      setTimeout(() => { $refs.form && $refs.form.clearValidate() }, 50)
    },
    destinationChange() {
      this.listQuery.list = [{ ...dynamicListItem }]
      setTimeout(() => { this.$refs.form.clearValidate() })
    },
    async commit() {
      try {
        const { $refs, $message, listQuery, close, row } = this
        let formValid;
        $refs.form.validate(valid => {
          formValid = valid
        })
        if (!formValid) {
          $message.warning("请填写完整信息")
          return
        }
        if (!row) {
          const checkResult = await checkRuleName({ ruleName: listQuery.ruleName })
          if (checkResult.data) {
            // true 已存在  false不存在
            $message.warning("申报规则名称已存在")
            return
          }
        }

        this.commitLoading = true
        const res = await insert(listQuery);
        $message.success(row ? '新增成功' : '修改成功')
        this.$emit('callBack', res.data.list[0])
        close()
      } catch (error) { }
      this.commitLoading = false
    }
  },
};
</script>

<style scoped lang='scss'>
.el-form {
  height: 400px;
}
</style>
