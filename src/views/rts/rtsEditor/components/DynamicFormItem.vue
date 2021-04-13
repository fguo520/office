<template>
  <el-form ref="form" :model="{ from: dynamicFormList }" size="mini" inline label-width="150px">
    <el-form-item v-for="(formItem,index) in dynamicFormList" :key="index" :label="formItem.attributeNameCn" :prop="`from.${index}.valueName`" :rules="getRules(formItem)">
      <template #label>
        <el-tooltip :content="formItem.attributeNameCn" placement="top-end">
          <span class="formLabel">{{ formItem.attributeNameCn }}：</span>
        </el-tooltip>
      </template>

      <el-input v-model="formItem.valueName" v-if="getInputType(formItem.showType, 'input')" style="width:200px;" placeholder="请输入" />

      <TextareaInput v-model="formItem.valueName" v-if="getInputType(formItem.showType, 'multInput')" valueType="Array" placeholder="换行输入添加多个值" :showLimit="false" @change="textareaInputChange(formItem)" />

      <el-select v-model="formItem.itemAttrs" v-if="getInputType(formItem.showType, 'singleSelect')" :clearable="!formItem.required" @change="(value) => {singleSelectChange(formItem, value)}" value-key="attrValueId" filterable>
        <el-option v-for="item in formItem.valueResults" :key="item.attrValueId" :label="item.attrValueNameEn" :value="item" />
      </el-select>

      <TreeSelect v-model="formItem.valueId" :list="formItem.valueResults" v-if="getInputType(formItem.showType, 'treeSelect')" />

      <ScrollSelect v-model="formItem.itemAttrs" v-if="getInputType(formItem.showType, 'multiSelect')" :list="formItem.valueResults" :prop="{ label:'attrValueNameEn', value:'attrValueId' }" value-key="attrValueId" allow-create @change="(value) => {scrollSelectChange(formItem, value)}" />
    </el-form-item>
  </el-form>
</template>

<script>
import { ScrollSelect, TreeSelect, TextareaInput } from "@/components"
export default {
  name: "DynamicFormItem",
  props: {
    dynamicFormList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dynamicFormList: {
      deep: true,
      handler(newValue) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      }
    },
  },
  components: {
    ScrollSelect,
    TextareaInput,
    TreeSelect
  },
  computed: {
    getInputType() {
      return function (type, inputType) {
        switch (type) {
          case 'list_box':
            return 'singleSelect' === inputType
          case 'input':
            return 'input' === inputType
          case 'check_box':
            return 'multiSelect' === inputType
          case 'interval':
            return 'NumInput' === inputType
          case 'group_item':
            return 'treeSelect' === inputType
          case 'model_numbers':
            return 'input' === inputType
          case 'multInput':
            return 'multInput' === inputType
          default:
            return 'input' === inputType
        }
      }
    },
    getRules() {
      return function (item) {
        const mustBeRule = ["list_box", "check_box", "group_item"].indexOf(item.showType)
        return { required: item.required, message: '此项不能为空', trigger: mustBeRule === -1 ? "blur" : "change" }
      }
    },
  },
  methods: {
    singleSelectChange(formItem, value) {
      formItem.valueId = value.attrValueId
      formItem.valueName = value.attrValueNameEn
      // const filterResult = formItem.valueResults.find(item => item.attrValueId === formItem.valueId) || {}
      // formItem.valueName = filterResult.attrValueNameEn || '' 
    },
    scrollSelectChange(formItem, value) {
      // formItem.valueId = value.filter(item => typeof item == 'object').map(item => item.attrValueId)
      formItem.valueId = value.map(item => typeof item == 'object' ? item.attrValueId : '')
      formItem.valueName = value.map(item => typeof item == 'object' ? item.attrValueNameEn : item)
    },
    textareaInputChange(formItem) {
      formItem.valueId = formItem.valueName.map((item, index) => -(index + 1))
    },
    validate(fn) {
      this.$refs.form.validate(fn)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: contents;
}
/deep/ .el-form-item:first-child {
  // margin-left: 15px !important;
}
/deep/ .el-form-item__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-select,
.el-input {
  width: 193px !important;
}
</style>