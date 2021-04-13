<template>
  <div class="pagination-container">
    <el-pagination 
      background 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      layout="total, sizes,prev, pager, next,jumper" 
      :page-size="defaultPageSize" 
      :page-sizes="[5, 10, 30, 50, 100]" 
      :current-page.sync="currentPageNum" 
      :total="total"
      v-bind="$attrs"
      >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name:"Pagination",
  data(){
    return {
      currentPageNum:1,
      defaultPageSize:10, 
    }
  },
  props: {
    total: {
      type: Number,
      default: 0,
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
  created() {
    this.defaultPageSize = this.pageSize;
  },
  watch: {
    currentPageNum(newValue) {
      this.$emit("update:pageNum", newValue)
    },
    pageNum:{
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
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
}
</style>