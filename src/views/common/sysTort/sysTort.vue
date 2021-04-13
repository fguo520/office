
<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="侵权记录" name="first">
      <Record />
    </el-tab-pane>
    <el-tab-pane label="任务报告" name="second">
      <Task />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Record from "./Record/Record"
import Task from "./Task/Task"
export default {
  name: "sysTort",
  components: {
    Record,
    Task
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  .secondDivider {
    margin-top: 20px;
  }
}
/deep/ .el-tabs__header {
  margin: 0 0 -3px;
}
/deep/ .app-container {
  height: calc(100vh - 91px) !important;
}
</style>