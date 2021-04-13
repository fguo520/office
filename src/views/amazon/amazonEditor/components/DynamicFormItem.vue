<template>
  <el-form ref="form" :model="{ from: dynamicFormList }" size="mini" inline label-width="150px">
    <el-form-item v-for="(formItem,index) in dynamicFormList" :key="index" :label="formItem.localLabelName" :prop="`from.${index}.filedName`" :rules="getRules(formItem)">
      <template #label>
        <el-tooltip :content="formItem.filedName" placement="left">
          <span class="formLabel" v-if="formItem.filedName=='fulfillment_center_id'" style="color:red">{{ formItem.filedName }}：</span>
          <span class="formLabel" v-else>{{ formItem.filedName }}：</span>
        </el-tooltip>
      </template>
      <!-- <div v-if="formItem.filedName=='item_name'">
        <el-input v-model="formItem.value" v-if="getInputType(formItem.showType, 'input')" style="width:500px;"  maxlength="200" placeholder="请输入"></el-input>
      </div> -->
      <el-input v-model="formItem.value" v-if="getInputType(formItem.showType, 'input')" :disabled="disabledChange(formItem.filedName)" :style="widthChange(formItem.filedName)" :show-word-limit="limit(formItem.filedName)" :maxlength="lengthChange(formItem.filedName)" placeholder="请输入"></el-input><i class="el-icon-refresh icon_input" v-if="formItem.filedName=='external_product_id'||formItem.filedName=='item_sku'" @click="getIconReset(formItem.filedName,index)" />
      <el-dropdown trigger="click" class="icon_dropdown" @command="handleCommand" v-if="usedSellerSku.length>0">
        <span class="el-dropdown-link">
          <el-tooltip class="item" effect="dark" content="历史刊登成功seller_sku" placement="top">
            <i class="el-icon-folder-opened" v-if="formItem.filedName=='item_sku'" />
          </el-tooltip>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in usedSellerSku" :command="item" :key="index">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-select v-model="formItem.value" v-if="getInputType(formItem.showType, 'select')" clearable filterable style="width:220px;">
        <el-option v-for="(item,index) in JSON.parse(formItem.attributeValues)" :key="index" :label="item" :value="item" />
      </el-select>
      <el-date-picker v-model="formItem.value" v-if="getInputType(formItem.showType, 'time')" type="datetime" placeholder="选择日期时间">
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
import { ScrollSelect, TreeSelect, TextareaInput } from "@/components"
import { refreshUpc, refreshSellerSku } from "@/api/amazon/amazonEditor"
export default {
  name: "DynamicFormItem",
  props: {
    dynamicFormList: {
      type: Array,
      default: () => []
    },
    skuObject: {
      type: Object,
      default: () => { }
    },
    usedSellerSku: {
      type: Array,
      default: () => []
    },
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
          case 'select':
            return 'select' === inputType
          case 'input':
            return 'input' === inputType
          case "time":
            return "time" === inputType
          default:
            return 'input' === inputType
        }
      }
    },
    widthChange() {
      return function (type) {
        switch (type) {
          case "item_name":
            return "width:53vw"
          default:
            return "width:220px"
        }
      }
    },
    disabledChange() {
      return function (type) {
        switch (type) {
          case "item_sku":
            return true
          case "external_product_id":
            return true
          default:
            return false
        }
      }
    },
    limit() {
      return function (type) {
        switch (type) {
          case "item_name":
            return true
          default:
            return false
        }
      }
    },
    lengthChange() {
      return function (type) {
        switch (type) {
          case "item_name":
            return "250"
          default:
            return ""
        }
      }
    },
    getRules() {
      return function (item) {
        const mustBeRule = ["select", "input", "time"].indexOf(item.showType)
        return { required: item.required, message: '此项不能为空', trigger: mustBeRule === -1 ? "blur" : "change" }
      }
    },
  },
  methods: {
    validate(fn) {
      this.$refs.form.validate(fn)
    },
    async getIconReset(value, index) {
      if (value == "item_sku") {
        const res = await refreshSellerSku({ platformAuthDetailId: this.skuObject.authId, sku: this.skuObject.sku })
        this.dynamicFormList[index].value = res.data
        this.dynamicFormList.find(i => { return i.filedName == "part_number" }).value = res.data
      } else {
        const res = await refreshUpc({ count: this.skuObject.length })
        if (res.code !== 200) return
        if (res.data.length == 1) {
          this.dynamicFormList[index].value = res.data[0]
        } else {
          this.$emit("upc", res.data)
        }
      }
    },
    handleCommand(command) {
      this.dynamicFormList.find(i => { return i.filedName == "item_sku" }).value = command
      this.dynamicFormList.find(i => { return i.filedName == "part_number" }).value = command
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: contents;
}
/deep/ .el-form-item {
  margin-right: 30px;
}
/deep/ .el-form-item__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.el-select {
  width: 220px !important;
}
.icon_input {
  position: absolute;
  top: 5px;
  right: -4px;
  font-size: 19px;
  font-weight: bold;
  cursor: pointer;
}
.icon_dropdown {
  position: absolute;
  right: 24px;
  font-size: 19px;
  top: 1px;
  font-weight: bold;
  cursor: pointer;
}
.fulfillment_center_id .el-form-item__label {
  color: red;
}
</style>