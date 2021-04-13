
<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="添加品牌" name="first">
      <AddBrandTab />
    </el-tab-pane>
    <el-tab-pane label="渠道品牌维护" name="second">
      <MaintainBrandTab />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import AddBrandTab from "./addBrandTab/AddBrandTab"
import MaintainBrandTab from "./maintainBrandTab/MaintainBrandTab"
export default {
  name: "walmartBrand",
  components: {
    AddBrandTab,
    MaintainBrandTab
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