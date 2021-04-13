<template>
  <el-dialog :visible.sync="visible" :before-close="close" @open="getExportAttr" custom-class="exportDialog" width="900px">
    <template #title>
      <el-button size="mini" type="primary" @click="importDialog.visible = true">导入物流方式报价</el-button>
    </template>

    <el-table :data="list" element-loading-text="数据加载中" border height="300px" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="报价单号" align="center" prop="offerNo" />
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
            <div :style="scope.row.status === false?'color:#FF0000':'color:#67C23A'">{{scope.row.status|statusFilter}}</div>
          </template>
      </el-table-column>
      <el-table-column label="导入人" align="center" prop="importUserName" />
      <el-table-column label="导入时间" align="center" prop="importTime" width="180" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button type="text" size="mini" @click="getAttrDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getExportAttr" />

    <div slot="footer" style="margin-top: 40px;text-align: center">
      <el-button @click="close" size="mini"> 关 闭 </el-button>
    </div>

    <AttrsDetail :visible.sync="attrsDetail.visible" :params="attrsDetail.params" />
    <ImportDialog :visible.sync="importDialog.visible" :options="importDialog.options" @request="getExportAttr" append-to-body>
      <el-button size="mini" @click="downExcel">下载模板</el-button>
    </ImportDialog>
  </el-dialog>
</template>

<script>
import {getofferpage, getofferdetail ,gettemplate,getimport} from "@/api/shopee/shopeeLogistics";
import { Pagination, ImportDialog } from "@/components"
import AttrsDetail from "./AttrsDetail"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
}
export default {
  name: "ExportAttr",
  props: {
    category: null,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      total: 0,
      list: [],
      importDialog: {
        visible: false,
        options: {
          uploadApi: getimport,
          params: {
            id: ""
          }
        }
      },
      attrsDetail: {
        visible: false,
        params: {}
      },
      action: `${process.env.SHOPPE_API}/shopee/logistics/xlsx/template`,
    }
  },
  components: {
    Pagination,
    ImportDialog,
    AttrsDetail
  },
   filters: {
    statusFilter(type) {
      switch (type) {
        case false:
          return "停用";
        case true:
          return "启用"
        default:
          return "未知"
      }
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    async getExportAttr() {
      this.importDialog.options.params.id = this.category;
      const res = await getofferpage({ ...this.listQuery, id: this.category })
      this.list = res.data.list;
      this.total = res.data.total
    },
    open(){
      this.importDialog.options.params.id = this.category;
      this.listQuery.pageNum = 1;
      this.getExportAttr()
    },
    close() {
      this.$emit("update:visible", false)
    },
    downExcel() {
        window.open(`${this.action}?id=${this.category}`, '_self');
    },
    getAttrDetail(row) {
      this.attrsDetail.params = {
        offerNo: row.offerNo,
      }
      this.attrsDetail.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .exportDialog {
  .el-dialog__body {
    padding: 0;
    padding-bottom: 15px;
  }
}
</style>
