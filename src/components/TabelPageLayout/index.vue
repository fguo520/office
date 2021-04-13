<template>
  <div class="app-container">
    <slot />

    <div class="table-container" ref="TableContainer">
      <el-dropdown class="elDropdown" v-if="elDropdownShow">
        <i class="el-icon-arrow-down" />
        <el-dropdown-menu slot="dropdown">
          <span @click="toggleSelection()" v-if="dropdownDefault">
            <el-dropdown-item>批量复制SKU</el-dropdown-item>
          </span>
          <slot name="dropdown" />
        </el-dropdown-menu>
      </el-dropdown>

      <slot name="container" />
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="defaultPageSize" :page-sizes="[20, 50, 100, 300, 500, 1000]" :current-page.sync="currentPageNum" :total="total" v-bind="$attrs">
      </el-pagination>
    </div>

    <el-dialog :title="'当前提取数量:' + SkuNum" :visible.sync="SkuDialogVisible" width="30%">
      <el-input type="textarea" :rows="15" v-model="SkuTextarea" readonly></el-input>
    </el-dialog>
  </div>
</template>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
const debounce = {
  timer: null,
  begin: function (fn, wait = 1000) {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = setTimeout(fn, wait);
  },
  clear: function () {
    clearTimeout(this.timer)
  }
}

export default {
  name: "TabelPageLayout",
  data() {
    return {
      currentPageNum: 1,
      defaultPageSize: 10,
      elDropdownShow: false,
      SkuDialogVisible: false,
      SkuTextarea: "",
      SkuNum: 0,
      height: 500
    }
  },
  props: {
    total: {
      type: Number,
      default: 0,
    },
    dropdownDefault: {
      type: Boolean,
      default: true
    },
    pageNum: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 0,
    }
  },
 
  mounted() {
    // const container = this.$slots.container[0].context.$refs[tableRef].newHeight
    this.resize()
    const erd = elementResizeDetectorMaker()
    let timeOut;
    erd.listenTo(this.$refs.TableContainer, (el) => {
      clearTimeout(timeOut)
      timeOut = setTimeout(() => {
        this.resize()
      }, 20)
    })
    this.bodyScroll("hidden")

    const currentNode = this.$slots.container.find(item => item.data !== undefined);
    const ref = currentNode.data.ref
    const column = this.$slots.container[0].context.$refs[ref].getTableColumn()[0].type;
    if (column === 'selection') {
      this.elDropdownShow = this.dropdownDefault || this.$slots.dropdown || false
    }

    this.$on("hook:beforeDestroy", () => {
      this.bodyScroll("")
      erd.uninstall(this.$refs.TableContainer)
      debounce.clear()
    })
  },
  updated() {
    debounce.begin(this.resize, 50)
     this.defaultPageSize = this.pageSize;
  },
  watch: {
    currentPageNum(newValue) {
      this.$emit("update:pageNum", newValue)
    },
    pageNum: {
      handler(newValue) {
        this.currentPageNum = newValue
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("update:pageNum", 1)
      this.$emit("update:pageSize", val)
      this.$emit("request")
    },
    handleCurrentChange(val) { this.$emit("request") },
    toggleSelection(key) {
      const tableRef = this.$slots.container[0].data.ref;
      // const selection = this.$slots.container[0].context.$refs[tableRef].selection;
      const selection = this.$slots.container[0].context.$refs[tableRef].$refs.singleTable.selection;
      const SkuArr = selection.map(item => item[key || "sku"])
      this.SkuNum = SkuArr.length;
      this.SkuTextarea = SkuArr.join("\n")
      this.SkuDialogVisible = true
    },
    bodyScroll(attr) {
      document.querySelector("body").style.overflow = attr
    },
    resize() {
      const currentNode = this.$slots.container.find(item => item.data !== undefined);
      const ref = currentNode.data.ref
      this.$nextTick(() => {
        if (!this.$refs.TableContainer) return
        currentNode.context.$refs[ref].newHeight = this.$refs.TableContainer.offsetHeight
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 50px);
  flex-direction: column;

  .table-container {
    flex: 1;
    margin-top: 0px;
    overflow: hidden;
    margin-top: 2px;
    position: relative;

    .plTableBox {
      height: 100% !important;
    }

    .elDropdown {
      position: absolute;
      top: 16px;
      left: 30px;
      z-index: 100;

      .elDropdownButton {
        padding: 5px;
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 0px;
  }
}
</style>