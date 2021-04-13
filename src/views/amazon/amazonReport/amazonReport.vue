<template>
  <div style="margin-top:30px;">
    <el-button @click="toRouter(1)">物流推荐的移除报告</el-button>
    <el-button @click="toRouter(2)">物流退款报告</el-button>
    <el-button @click="toRouter(3)">库存年龄报告</el-button>
    <el-button @click="toRouter(4)">获取亚马逊物流仓储费报告</el-button>
    <el-button @click="toRouter(5)">获取亚马逊物流管理库存</el-button>
    <el-button @click="toRouter(6)">库存分类帐报告列表</el-button>
  </div>
</template>

<script>
export default {
  name: 'amazonReport',
  data() {
    return {
    };
  },
  methods: {
    toRouter(key) {
      const routerPath = {
        1: '/amazon/logisticsRemove',
        2: '/amazon/logisticsRefund',
        3: '/amazon/inventoryAge',
        4: '/amazon/logisticsWarehousing',
        5: '/amazon/logisticsInventory',
        6: '/amazon/classification',
      };
      this.$router.push(routerPath[key])
    }
  },
};
</script>

<style scoped lang='scss'>
</style>
