<template>
  <el-table style="width: 100%" :data="parantRow.lmLogisticsTransportationList || []" border v-show="tableShow">
    <el-table-column type="selection" width="50" :show-overflow-tooltip="false" />
    <el-table-column label="运输方式代码" align="center" prop="transportationCode" />
    <el-table-column label="运输方式名称" align="center" prop="transportationNameCn" />
    <el-table-column label="申报规则名称" align="center" prop="ruleName" />
    <el-table-column label="标签格式" align="center" width="100" prop="lableFormate" />
    <el-table-column label="运输类型" align="center" prop="transportationTypeName" />
    <el-table-column label="状态" align="center" prop="transportationType">
      <template #default="{ row }">
        <div :style="{color: row.isEnable === 1 ? 'green' : 'red'}">{{ row.isEnable === 1 ? '启用' : '停用' }}</div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" prop="logisticsServeiceCode">
      <template #default="{ row }">
        <el-button type="text" @click="editor(row)">编辑</el-button>
        <el-popconfirm :title="`确定${row.isEnable === 1 ? '停用' : '启用'}此运输方式吗`" @confirm="handleEnable(row)">
          <el-button slot="reference" size="mini" type="text" :style="{ color:row.isEnable === 1?'red':'#3b9e70' }">
            {{ row.isEnable === 1 ? '停用' : '启用' }}
          </el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
    <AddTransportDialog :visible.sync='addTransport.visible' :row="parantRow" :list="home.typeList" @callBack="addTransportCallBack" :childId="addTransport.childId" />
  </el-table>
</template>

<script>
import AddTransportDialog from './AddTransportDialog'
import { updateLogisticsService } from "@/api/logistics/serviceProvider"
export default {
  name: 'ExpanTable',
  components: { AddTransportDialog },
  props: {
    home: {
      type: Object,
      default: () => ({})
    },
    parantRow: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableShow: false, // 用于避免表格父组件表格还没初始化宽度而造成行列错乱
      addTransport: {
        visible: false,
        childId: '',
        row: {}
      }
    };
  },
  mounted() {
    setTimeout(() => {
      this.tableShow = true
    }, 30)
  },
  computed: {},
  methods: {
    async handleEnable(row) {
      const status = row.isEnable === 1 ? 0 : 1
      const res = await updateLogisticsService({
        id: row.id,
        status
      })
      this.$message.success(res.data)
      row.isEnable = status
    },
    editor(childRow) {
      this.addTransport = {
        visible: true,
        childId: childRow.id,
        row: childRow
      }
    },
    addTransportCallBack(data) {
      this.addTransport.row = Object.assign(this.addTransport.row, data)
      this.home.getSearchType('update')
      this.close()
    },
  },
};
</script>

<style scoped lang='scss'>
/deep/ .has-gutter .cell {
  color: rgb(65, 175, 124);
}
/deep/ th {
  border-right: none !important;
}
/deep/ td {
  border-right: none !important;
}
</style>
