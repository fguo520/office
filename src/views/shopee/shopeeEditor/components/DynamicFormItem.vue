<template>
  <el-form ref="form" :model="addAttrQuery" size="mini">
    <el-form-item v-for="(formItem,index) in addFormItemList" :key="formItem.attributeName+formItem.attributeId+index" :label="formItem.attributeName" :prop="String(formItem.attributeId)" :rules="getRules(formItem)">
      <template #label>
        <el-tooltip :content="formItem.attributeName" placement="top-end">
          <span class="formLabel">{{ formItem.attributeName }}：</span>
        </el-tooltip>
      </template>

      <el-input v-model="addAttrQuery[formItem.attributeId]" v-if="getInputType(formItem.inputType, 'input')" style="width:193px;" placeholder="请输入内容" />
      <el-select v-model="addAttrQuery[formItem.attributeId]" v-if="getInputType(formItem.inputType, 'select')" clearable filterable style="width:193px;">
        <el-option v-for="(item,index) in JSON.parse(formItem.options)" :key="index" :label="item" :value="item" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import ScrollSelect from "@/components/ScrollSelect"
export default {
  name: "DynamicFormItem",
  props: {
    addAttrQuery: {
      type: Object,
      default: () => ({})
    },
    addFormItemList: {
      type: Object,
      default: () => { return {} }
    }
  },
  watch: {
    addAttrQuery: {
      deep: true,
      handler(newValue) {
        this.$emit("update:addAttrQuery", newValue)
      }
    },
  },
  components: {
    ScrollSelect
  },
  computed: {
    getInputType() {
      return function (type, inputType) {
        //  input textarea select NumInput multiSelect
        switch (type) {
          case "TEXT_FILED":
            return "input" === inputType
          case "DROP_DOWN":
            return "select" === inputType
          case "COMBO_BOX":
            return "select" === inputType
          default:
            return "input" === inputType
        }
      }
    },
    getRules() {
      return function (item) {
        // text richText singleSelect enumInput numeric multiSelect multiEnumInput
        const mustBeRule = ["TEXT_FILED", "DROP_DOWN", "COMBO_BOX"].indexOf(item.inputType)
        return { required: item.isMandatory ? true : false, message: '此项不能为空', trigger: mustBeRule === -1 ? "blur" : "change" }
      }
    },
  },
  methods: {
    validate(callBack) {
      return this.$refs.form.validate(callBack)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: contents;
}
/deep/ .el-form-item:first-child {
  // margin-left: -2px !important;
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