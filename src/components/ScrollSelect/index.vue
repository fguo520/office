<template>
  <el-select v-model="currentValue" clearable filterable size="mini" multiple :class="['orderSourceNameSelect',selectSwitch ? 'orderSourceNameSelectOpen' : 'defaultSize',]" @visible-change="selectVisibleChange" @clear="selectClear" v-bind="$attrs" v-on="$listeners" ref="ElSelect">
    <!-- value-key 判断 选中后 是否绑定 每一个选项中值 对象类型 -->
    <el-option 
    v-for="(item,index) in list" 
    :key="typeof item === 'object' ? item[prop.value] : index" 
    :label="typeof item === 'object' ? item[prop.label] : item" 
    :value="typeof item === 'object' ? $attrs.hasOwnProperty('value-key') ? item : item[prop.value] : item">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "ScrollSelect",
  data() {
    return {
      selectSwitch: false,
      currentValue: [],
    };
  },
  props: {
    value: {
      type: undefined,
      default: "",
    },
    list: {
      type: Array,
      default: () => [],
    },
    prop: {
      type: Object,
      default: () => {
        return { label: "label", value: "value" };
      },
    },
    limit: {
      type: [String, Number],
      default: undefined
    }
  },
  created() {
    this.currentValue = this.value
  },
  watch: {
    value: {
      deep: true,
      handler(newValue) {
        const { limit } = this
        if (!isNaN(Number(limit)) && newValue.length > limit) {
          this.$emit("input", newValue.slice(0, limit));
          return
        }
        this.currentValue = newValue;
      },
    },
    currentValue: {
      deep: true,
      handler(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  methods: {
    selectVisibleChange(e) {
      this.selectSwitch = e;
      setTimeout(() => {
        const setHeight = this.$refs.ElSelect.$refs.tags.clientHeight;
        // this.$refs.ElSelect.initialInputHeight = setHeight;
        const target = this.$refs.ElSelect.$refs.reference.$refs.input;
        target.style.height = `${setHeight}px`
      }, 100)
    },
    selectClear() {
      const target = this.$refs.ElSelect.$refs.reference.$refs.input;
      target.style.height = "28px"
      // this.$refs.ElSelect.initialInputHeight = 28
    }
  }
}
</script>

<style lang="scss" scoped>
.orderSourceNameSelect {
  vertical-align: middle;
  overflow: hidden;

  /deep/ .el-select__tags {
    max-height: 22px;
    overflow-y: scroll;
    transition: all 0.3s linear;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  /deep/ .el-input__inner {
    max-height: 28px;
    height: 28px;
    min-height: 28px;
    transition: all 0.3s linear;
  }
}

.orderSourceNameSelectOpen {
  /deep/ .el-select__tags {
    max-height: 74px;
  }

  /deep/ .el-input__inner {
    max-height: 80px;
  }
}
</style>