<template>
  <div class="input">
    <el-input type="textarea" :rows="rows" :placeholder="placeholder" v-model="currentValue" clearable v-bind="$attrs" v-on="_listeners" style="width:193px" @input="elInput" />
    <i class="input-limit" v-if="showLimit">{{ currentLimitNum }}/100</i>
  </div>
</template>

<script>
export default {
  name: "TextareaInput",
  data() {
    return {
      currentLimitNum: 0,
      currentValue: "",
      _listeners: {},
    }
  },
  props: {
    placeholder: {
      type: String,
      default: "换行隔开可搜索100个值"
    },
    value: undefined,
    rows: {
      type: Number,
      default: 2
    },
    valueType: {
      type: String,
      default: 'Array',
      validator: function (value) {
        return ['array', 'string', 'Array', "String"].indexOf(value) !== -1
      }
    },
    format: {
      type: String,
      default: " "
    },
    showLimit: {
      type: Boolean,
      default: true
    }
  },
  created() {
    const { value } = this
    if (value instanceof Array) {
      this.currentValue = value.join("\n")
      this.elInput()
    }
    const { input, ..._listeners } = this.$listeners;
    this._listeners = _listeners
  },
  watch: {
    value(newValue) {
      if ((newValue instanceof Array && newValue.length === 0) || newValue === '') this.currentValue = '';
    }
  },
  methods: {
    elInput(newValue) {
      if (newValue === undefined) return;
      let callback = newValue.split(/[(\n)]+/);
      //把前后空字符项去掉
      if (!callback[0]) {
        callback.shift();
      }
      if (!callback[callback.length - 1]) {
        callback.pop();
      }
      this.currentLimitNum = callback.length;
      if (this.valueType === "string" || this.valueType === "String") callback = callback.join(this.format);
      callback = callback.length > 0 ? callback.map(item => {
        return item = item.trim()
      }) : []
      this.$emit("input", callback)
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  display: inline-flex;
  vertical-align: inherit;
}
.input-limit {
  position: absolute;
  bottom: -5px;
  right: 10px;
  font-size: 1px;
  color: gray;
}
/deep/ .el-textarea__inner {
  width: 193px;
  min-height: 28px !important;
  height: 29px;
}
</style>