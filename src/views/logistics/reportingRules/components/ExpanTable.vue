<template>
  <el-table style="width: 100%" :data="parantRow.list || []" border v-show="tableShow">
    <el-table-column type="selection" width="50" :show-overflow-tooltip="false" />
    <el-table-column label="目的国家" align="center" prop="country">
      <template #default="{ row }">
        {{ getCountry(row.country) }}
      </template>
    </el-table-column>
    <el-table-column label="申报价值方式" align="center" prop="valueMethod">
      <template #default="{ row }">
        {{ row.valueMethod === '0' ? '固定金额' : '金额比例' }}
      </template>
    </el-table-column>
    <el-table-column label="申报币种" align="center" prop="currency" />
  </el-table>
</template>

<script>
import { updateLogisticsService } from "@/api/logistics/serviceProvider"
export default {
  name: 'ExpanTable',
  components: {},
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
  computed: {
    getCountry() {
      return (country) => {
        const findItem = this.home.typeList.countryList.find(item => item.value === country) || {}
        return findItem.label || ''
      }
    }
  },
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
