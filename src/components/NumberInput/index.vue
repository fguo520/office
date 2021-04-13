<template>
  <el-input v-model="currentValue" size="mini" @input="inputLimit" @change="inputChange" v-bind="$attrs" v-on="_listeners">
    <template #suffix>
      <slot name="suffix" />
    </template>
  </el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    max: {
      type: [String, Number],
      default: ""
    },
    min: {
      type: [String, Number],
      default: ""
    },
    float: {
      type: [String, Number, Boolean],
      default: false
    }
  },
  data() {
    return {
      currentValue: "",
      expRules: "",
      _listeners: {}
    }
  },
  created() {
    this.expRules = this.initExpRules()
    const { input, ...listeners } = this.$listeners
    this._listeners = listeners
  },
  watch: {
    value: {
      handler(newValue) { this.currentValue = newValue },
      immediate: true
    }
  },
  methods: {
    inputLimit(inputValue) {
      const expMatch = inputValue.match(this.expRules) || [];
      this.currentValue = expMatch[0] || "";
      this.$emit("input", this.currentValue)
    },
    inputChange(value) {
      const { minOrMax, currentValue } = this
      this.currentValue = Number(minOrMax(currentValue))
      this.$emit("input", this.currentValue)
    },
    minOrMax(value) {
      const { max, min } = this
      let cbValue = value
      if (!isNaN(Number(max)) && max !== "" && cbValue > Number(max)) {
        cbValue = Number(max)
      }
      if (!isNaN(Number(min)) && min !== "" && value < Number(min)) {
        cbValue = Number(min)
      }
      return cbValue
    },
    initExpRules() {
      const { float } = this
      if (float === "") {
        return /(\-?[0-9]*\.[0-9]{0,}|[0-9]+\.|[0-9]+|\.|\-[0-9]*)/
      }
      if (typeof float === "number") {
        return new RegExp(`(\\-?[0-9]*\\.[0-9]{0,${float}}|[0-9]+\\.|[0-9]+|\\.|\\-[0-9]*)`)
      }
      if (typeof float === 'string' && !isNaN(Number(float))) {
        return new RegExp(`(\\-?[0-9]*\\.[0-9]{0,${Number(float)}}|[0-9]+\\.|[0-9]+|\\.|\\-[0-9]*)`)
      }
      return this.expRules = /(\-?[0-9]*|\-[0-9]*)/
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
