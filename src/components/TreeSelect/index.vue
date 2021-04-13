<template>
  <el-select ref="ElSelect" v-model="currentValue" clearable filterable size="mini" :class="['orderSourceNameSelect',selectSwitch ? 'orderSourceNameSelectOpen' : 'defaultSize',]" @clear="selectClear" :multiple="multiple" :filter-method="selectFilter" @visible-change="selectVisibleChange" @change="selectChange" v-bind="$attrs">
    <el-option style="height: auto; padding:0; font-weight: 400" value="" ref="elOption">
      <el-tree :data="list" accordion ref="tree" :node-key="_prop['value']" :props="_prop" :show-checkbox="multiple" :filter-node-method="filterNode" @check="setTreeNode" @node-click="nodeClick" :highlight-current="!multiple" :default-expanded-keys="defaultExpandedKeys" />
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "TreeSelect",
  data() {
    return {
      selectSwitch: false,
      currentValue: [],
      _prop: { label: "label", value: "value", children: "children" },
      defaultExpandedKeys: [],
      watchValueChange: true
    };
  },
  props: {
    value: {
      type: undefined,
      default: [],
    },
    list: {
      type: Array,
      default: () => [],
    },
    prop: {
      type: Object,
      default: () => {
        return {};
      },
    },
    includeParent: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
  },
  created() {
    this._prop = { ...this._prop, ...this.prop }
  },
  mounted() {
    this.setValue(this.value)
  },
  watch: {
    value: {
      deep: true,
      handler(newValue) {
        const { setValue, watchValueChange } = this
        if (watchValueChange) {
          setValue(newValue)
        }
        this.watchValueChange = true
      },
    },
  },
  methods: {
    selectVisibleChange(e) {
      this.selectFilter('')
      if (!this.multiple) {
        if (!e) return
        setTimeout(() => {
          const currentElNode = this.$refs.tree.currentNode
          const setTop = currentElNode ? currentElNode.$el.offsetTop : 0;
          this.$refs.elOption.$parent.$refs.wrap.scrollTop = setTop;
        })
        return
      }
      this.selectSwitch = e;
      setTimeout(() => {
        const setHeight = this.$refs.ElSelect.$refs.tags.clientHeight;
        // this.$refs.ElSelect.initialInputHeight = setHeight;
        const target = this.$refs.ElSelect.$refs.reference.$refs.input;
        target.style.height = `${setHeight}px`
      }, 200)
    },
    selectClear() {
      const { $refs, multiple } = this;
      if (multiple) {
        $refs.tree.setCheckedKeys([]);
        const target = $refs.ElSelect.$refs.reference.$refs.input;
        target.style.height = "28px"
        // this.$refs.ElSelect.initialInputHeight = 28
      }
      this.$emit("input", multiple ? [] : '');
      $refs.tree.currentNode = null
    },
    selectFilter(val) {
      this.$refs.tree.filter(val);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this._prop.label].indexOf(value) !== -1;
    },
    setTreeNode(data, node) {
      // 单选模式不会触发
      this.watchValueChange = false // 避免监听value触发两次
      const { $refs, _prop } = this
      const labelArr = [];
      const valueArr = [];
      $refs.tree.getCheckedNodes().forEach(item => {
        if (!this.includeParent && item.children) return
        labelArr.push(item[_prop.label])
        valueArr.push(item[_prop.value])
      })
      setTimeout(() => {
        this.currentValue = labelArr
        if (data) this.$emit("input", valueArr);
      }, 100)
    },
    nodeClick(data, node) {
      const { multiple, _prop, value, $refs, selectFilter } = this;
      if (multiple || !node.isLeaf) {
        $refs.tree.setCurrentKey(typeof value === 'object' ? null : value || null)
        return
      };
      this.currentValue = data[_prop.label]
      this.$emit('input', data[_prop.value])
      selectFilter('')
      $refs.ElSelect.visible = false
    },
    setValue(value) {
      const { $refs, multiple, setTreeNode, _prop } = this;

      function multipleFn() {
        $refs.tree.setCheckedKeys(value);
        setTimeout(() => {
          setTreeNode()
        }, 700)
      }

      function singleFn() {
        this.defaultExpandedKeys = [value]

        setTimeout(() => {
          $refs.tree.setCurrentKey(value || null)
          this.currentValue = $refs.tree.getCurrentNode() && $refs.tree.getCurrentNode()[_prop.label]
        }, 500)
      }

      multiple ? multipleFn() : singleFn.call(this)
    },
    selectChange(values) {
      const { $refs, _prop, multiple } = this
      function multipleFn() {
        const newValue = values.map(item => {
          return $refs.tree.getCheckedNodes().find(treeItem => item == treeItem[_prop.label])[_prop.value]
        })
        $refs.tree.setCheckedKeys(newValue);
        this.$emit('input', newValue)
      }

      function singleFn() {
        $refs.tree.setCurrentKey(null)
        this.$emit('input', '')
      }

      multiple ? multipleFn.call(this) : singleFn.call(this)
    }
  }
}
</script>

<style lang="scss" scoped>
.orderSourceNameSelect {
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