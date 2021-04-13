<template>
  <div class="buttonContainer">
    <el-button @click="conditions(trueLabel)" :type="buttonType(trueLabel)" size="mini">是</el-button>
    <el-button @click="conditions(falseLabel)" :type="buttonType(falseLabel)" size="mini">否</el-button>
  </div>
</template>

<script>
export default {
  name: 'DoubleSelectBtn',
  props: {
    value: null,
    trueLabel: null,
    falseLabel: null
  },
  data() {
    return {};
  },
  computed: {
    buttonType() {
      const { value } = this;
      return function (labelValue) {
        return labelValue === value ? "primary" : "";
      };
    },
  },
  methods: {
    conditions(currentValue) {
      const emitValue = currentValue === this.value ? '' : currentValue
      this.$emit('input', emitValue)
      this.$emit('change', emitValue)
    },
  },
};
</script>

<style scoped lang='scss'>
.buttonContainer {
  width: 193px;
}
</style>
