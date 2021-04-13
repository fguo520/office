<template>
  <el-dialog :visible.sync="visible" :before-close="close" @open="getExportAttr" custom-class="exportDialog" width="900px">
    <template #title>
      <el-button size="mini" type="primary" @click="importDialog.visible = true" v-if="rolePermissionJudge('/walmart/Class/export')">导入属性</el-button>
    </template>

    <el-table :data="list" element-loading-text="数据加载中" border height="300px" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="状态类型" align="center" prop="statusStr" />
      <el-table-column label="编号" align="center" prop="taskNo" />
      <el-table-column label="导入人" align="center" prop="userName" />
      <el-table-column label="导入时间" align="center" prop="createTime" width="180" />
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
import { getCategoryExcelTaskList, getCategoryTemplate, saveCategoryAttributes } from "@/api/walmart/walmartClass";
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
          uploadApi: saveCategoryAttributes,
          params: {
            category: ""
          }
        }
      },
      attrsDetail: {
        visible: false,
        params: {}
      }
    }
  },
  components: {
    Pagination,
    ImportDialog,
    AttrsDetail
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    async getExportAttr() {
      this.importDialog.options.params.category = this.category;
      const res = await getCategoryExcelTaskList({ ...this.listQuery, category: this.category })
      this.list = res.data.list;
      this.total = res.data.total
    },
    open(){
      this.importDialog.options.params.category = this.category;
      this.listQuery.pageNum = 1;
      this.getExportAttr()
    },
    close() {
      this.$emit("update:visible", false)
    },
    downExcel() {
      getCategoryTemplate({ category: this.category }).then(res => {
        window.open(res.data, '_self');
      })
    },
    getAttrDetail(row) {
      this.attrsDetail.params = {
        category: this.category,
        taskNo: row.taskNo
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
