<template>
  <div>
    <el-radio-group size="mini" v-model="value" v-bind="$attrs">
      <el-radio-button v-for="(state, index) in ButtonTypes" :label="state.value" :key="state.value" border @click.native.prevent="radioButtonChange(state.value, index)">
        {{ state.label }}
      </el-radio-button>
    </el-radio-group>
    <div class="slotListContainer" :style="ContainerStyle">
      <div v-for="(state, index) in ButtonTypes" :key="state.value" v-show="value === state.value" ref="slotList">
        <slot :name="state.slotName || index+1" />
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "RadioButtonGroup",
  data() {
    return {
      ContainerStyle: {
        height: "0px"
      }
    };
  },
  props: {
    ButtonTypes: {
      type: Array,
      default: function () {
        return [];
      },
    },
    value: {
      type: [String, Number],
      default: "",
    },
    doubleCancle: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    const { ButtonTypes, value } = this
    if (!ButtonTypes.length) return;
    const index = ButtonTypes.findIndex(item => item.value === value)
    const height = index === -1 ? 0 : this.$refs.slotList[index].clientHeight;
    this.ContainerStyle.height = `${height}px`
  },
  watch: {
    value(newValue) {
      const index = this.ButtonTypes.findIndex(item => item.value === newValue)
      this.$emit("request", newValue);
      this.$nextTick(() => {
        const height = index === -1 ? 0 : this.$refs.slotList[index].clientHeight;
        this.ContainerStyle.height = `${height}px`
      })
    }
  },
  methods: {
    radioButtonChange(i, index) {
      let checkValue;
      if (!this.doubleCancle) {
        checkValue = i
      } else {
        checkValue = this.value === i ? "" : i;
      }
      this.$emit("input", checkValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-radio-group {
  margin-bottom: 2px;
  margin-top: 4px;
}
/deep/ .el-radio-button {
  box-shadow: none !important;
  .el-radio-button__inner {
    font-size: 13px !important;
  }
}
.slotListContainer {
  transition: all 0.3s;
}
</style>