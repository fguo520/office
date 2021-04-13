<template>
  <div>
    <!-- 第一个无用，修复el-table-coloumn 被元素包裹后 渲染出现 顺序问题 -->
    <u-table-column width="1" />
    <u-table-column label="任务编号" align="center" width="200" prop="taskNo" />
    <u-table-column label="任务名称" align="center" width="150" prop="name" />
    <u-table-column label="生成状态" align="center" prop="status">
      <template #default="{ row }">
        <div>{{ getStatus(row.status) }}</div>
      </template>
    </u-table-column>
    <u-table-column label="创建任务人" align="center" width="110" prop="createUser" />
    <u-table-column label="时间" align="center" width="300" prop="addTime">
      <template #default="{ row }">
        <div style="text-align:left;">
          <div>创建任务时间：{{ row.createTime }}</div>
          <div>生成报告时间：{{ row.completeTime }}</div>
        </div>
      </template>
    </u-table-column>
    <u-table-column label="操作" align="center" width="200" prop="addTime">
      <template #default="{ row }">
        <el-button @click="downReport(row)" type="text" v-if="row.status === 2">下载报告</el-button>
      </template>
    </u-table-column>
  </div>
</template>

<script>
import { getGotenProductExcelUrl } from "@/api/goten/distributionLibrary"
export default {
  name: "DebriefingTable",
  data() {
    return {}
  },
  computed: {
    getStatus() {
      return (status) => {
        switch (status) {
          case 0:
            return "待生成"
          case 1:
            return "生成中"
          case 2:
            return "生成成功"
          case 3:
            return "生成失败"
          default:
            return "未知状态";
        }
      }
    }
  },
  methods: {
    async downReport(row) {
      const res = await getGotenProductExcelUrl({ taskNo: row.taskNo })
      window.open(res.data, "_self")
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
