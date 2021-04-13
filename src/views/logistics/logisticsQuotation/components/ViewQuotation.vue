<template>
  <el-dialog title="查看运费报价" :visible.sync="visible" :before-close="close" width="1080px" @open="open">
    <el-form ref="form" label-width="130px" size="mini" :model="rows">
      <el-form-item label="服务商代码：">
        <span v-copy="rows.logisticsServeiceCode">{{rows.logisticsServeiceCode}}</span>
      </el-form-item>
      <el-form-item label="服务商名称：">
        <span v-copy="rows.logisticsServeiceName">{{rows.logisticsServeiceName}}</span>
      </el-form-item>
      <el-form-item label="运输方式代码：">
        <span v-copy="rows.logisticsTransportCode">{{rows.logisticsTransportCode}}</span>
      </el-form-item>
      <el-form-item label="运输方式名称：">
        <span v-copy="rows.logisticsTransportName">{{rows.logisticsTransportName}}</span>
      </el-form-item>
      <!-- <el-form-item label="重量限制方式：">
        <span>[包裹重和体积重间取最大重量]</span>
      </el-form-item>
      <el-form-item label="时效：">
        <span>[6~10]天</span>
      </el-form-item> -->
    </el-form>
    <div style="text-align:right">
      <el-tooltip content="温馨提示：报价以最新创建的报价为准。如需更新请重新导入。" placement="top" effect="light">
        <i class="el-icon-question" style="color:green;margin-right:10px"></i>
      </el-tooltip>
      <el-button @click="handexcelView" type="primary" size="mini"  v-if="rolePermissionJudge('/logisticsQuotation/update')">导入更新</el-button>
    </div>
    <div v-if="list.length>0" style="margin-top:10px">
      <el-table ref="tableContainer" style="width: 100%" :data="list" element-loading-text="数据加载中" border max-height="500px" :header-cell-style="{ 'background-color': '#dadde3' }">
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column label="报价单号" align="center" width="150" prop="quoteNo" />
        <el-table-column label="报价有效期" align="center" width="185">
          <template slot-scope="scope">
            <div style="text-align:left">{{scope.row.quoteSdate}} - {{scope.row.quoteEdate}}</div>
          </template>
        </el-table-column>
        <el-table-column label="运费计算类型" align="center" width="120">
          <template slot-scope="scope">
            <div v-copy="scope.row.calType===0?'区间价格':'起重续价'">{{scope.row.calType===0?"区间价格":"起重续价"}}</div>
          </template>
        </el-table-column>
        <el-table-column label="币种" align="center" width="100" prop="currency" />
        <el-table-column label="一票多件计费重量" align="center" width="140" prop="isCallWeight">
          <template slot-scope="scope">
            <div>{{scope.row.isCallWeight?"是":"否"}}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="180" prop="createTime" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleLook(scope.row)" size="mini" v-if="rolePermissionJudge('/logisticsQuotation/seeDetails')" >查看</el-button>
            <el-button type="text" @click="handExcel(scope.row)" size="mini" v-if="rolePermissionJudge('/logisticsQuotation/down')" >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" :total="total" @request="open" />
    </div>
    <ExcelDialog :visible.sync="excelVisible" @request="open" />
    <ViewDetails :visible.sync="viewDetails.visible" :rows="viewDetails.rows" @request="open" />
  </el-dialog>
</template>
<script>
import { Pagination } from "@/components"
import { getLogisticsServeiceQuoteDetailPage } from "@/api/logistics/logisticsQuotation"
import ExcelDialog from "./ExcelDialog"
import ViewDetails from "./ViewDetails"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  id: "",
  quoteNo: ""
}
export default {
  name: "ViewQuotation",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      excelVisible: false,
      viewDetails: {
        visible: false,
        rows: {}
      }
    }
  },
  components: { ExcelDialog, Pagination, ViewDetails },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    handexcelView() {
      this.excelVisible = true
    },
    async open() {
      this.listQuery.id = this.rows.id
      const res = await getLogisticsServeiceQuoteDetailPage(this.listQuery)
      this.list = res.data.list
      this.total = res.data.total
    },
    handExcel(row) {
      window.open(row.completeUrl, "_blank")
    },
    handleLook(row) {
      this.viewDetails = {
        visible: true,
        rows: row
      }
      console.log(row)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px;
  .el-form {
    overflow: hidden;
    .el-form-item {
      width: 50%;
      float: left;
    }
  }
}
</style>