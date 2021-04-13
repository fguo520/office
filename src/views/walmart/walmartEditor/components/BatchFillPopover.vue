<template>
  <el-popover placement="top" width="300" trigger="click" v-model="visible">
    统一修改：
    <el-select v-model="operation" placeholder="" size="mini" style="width:60px;">
      <el-option label="+" value="add" />
      <el-option label="-" value="reduce" />
    </el-select>
    <NumberInput v-model="value" min="0" float="2" style="width:100px;" clearable />
    <div style="text-align: center; margin-top: 10px">
      <el-button size="mini" type="text" @click="visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="commit">填充</el-button>
    </div>
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>

<script>
import { NumberInput } from "@/components";
export default {
  name: "BatchFillPopover",
  components: {
    NumberInput
  },
  props: {
    tableList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      value: '',
      operation: 'add',
    }
  },
  methods: {
    async commit() {
      const { operation, value, tableList } = this
      const calc = operation == 'add' ? Number(value) : -Number(value)
      tableList.forEach(item => { item.price += calc })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
