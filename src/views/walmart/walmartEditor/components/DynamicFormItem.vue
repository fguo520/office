<template>
  <el-form ref="form" :model="addAttrQuery" size="mini" inline label-width="150px">
    <el-form-item v-for="(formItem,index) in addFormItemList" :key="formItem.name+formItem.id+index" :label="formItem.label" :prop="formItem.name" :rules="getRules(formItem)">
      <template #label>
        <el-tooltip :content="formItem.label" placement="top-end">
          <span class="formLabel">{{ formItem.label }}：</span>
        </el-tooltip>
      </template>

      <el-input v-model="addAttrQuery[formItem.name]" v-if="getInputType(formItem.inputType, 'input')" style="width:200px;" placeholder="请输入内容" />

      <el-input v-model.number="addAttrQuery[formItem.name]" v-if="getInputType(formItem.inputType, 'NumInput')" style="width:200px;" placeholder="请输入内容" />

      <ScrollSelect v-model="addAttrQuery[formItem.name]" v-if="getInputType(formItem.inputType, 'select')" :list="formItem.options.split(';')" />
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
      default: () => { return {} }
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
    addFormItemList: {
      deep: true,
      handler(newValue) {
        for(let i in newValue){
          newValue[i].options=newValue[i].options.replace(/\s+/g,"");
        }
      }
    }
  },
  components: {
    ScrollSelect
  },
  computed: {
    getInputType() {
      return function (type, inputType) {
        //  input textarea select NumInput multiSelect
        switch (type) {
          case "text":
            return "input" === inputType
          case "menu":
            return "select" === inputType
          case "Decimal":
            return "NumInput" === inputType
          default:
            return "input" === inputType
        }
      }
    },
    getRules() {
      return function (item) {
        // text richText singleSelect enumInput numeric multiSelect multiEnumInput
        const mustBeRule = ["text", "menu", "Decimal", "date"].indexOf(item.inputType)
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