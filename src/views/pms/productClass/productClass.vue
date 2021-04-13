<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <div>
      <el-button type="primary" size="mini" @click="handUpdate" :disabled="unDisabled" :loading="unDisabled" v-if="rolePermissionJudge('/pms/productClass')">更新数据</el-button>
    </div>
    <!-- 表格 -->
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" border row-id="id" height="100" v-loading="listLoading" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" :default-expand-all="false">
        <u-table-column label="类别代码" align="center" width="120" :tree-node="true">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="handDialog(scope.row.classid)" v-if="scope.row.parentid == 0">{{ scope.row.classid }}</el-link>
            <span v-else>{{ scope.row.classid }}</span>
          </template>
        </u-table-column>
        <u-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.classnamecn }}</template>
        </u-table-column>
        <u-table-column label="级别" align="center" width="150">
          <template slot-scope="scope">{{
            scope.row.grade | gradeFilter
          }}</template>
        </u-table-column>
        <u-table-column label="是否激活" align="center" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.isactive">是</span>
            <span v-else>否</span>
          </template>
        </u-table-column>
        <u-table-column label="是否锁定" align="center" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.islock">是</span>
            <span v-else>否</span>
          </template>
        </u-table-column>
        <u-table-column label="分类描述" align="center">
          <template slot-scope="scope">{{
            scope.row.classdescription
          }}</template>
        </u-table-column>
        <u-table-column label="备注" align="center">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </u-table-column>
        <u-table-column label="最后更新时间" align="center" width="180">
          <template slot-scope="scope">{{
            scope.row.lastoperationtime
          }}</template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <!-- 日志 -->
    <LogView :config="logViewParam" :visible.sync="dialogVisible" />
    <!-- 类别 -->
    <el-dialog title="类别" :visible.sync="dialogClassVisible" width="700px" v-if="dialogClassVisible" custom-class="productClassDialog">
      <el-cascader-panel :options="classType" clearable :props="{ label: 'classnamecn', value: 'classid' }" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassVisible = false" size="mini">
          关 闭
        </el-button>
      </div>
    </el-dialog>
  </TabelPageLayout>
</template>
<script>
import {
  fetchList,
  updateAll,
  getProductClassLogList,
} from "@/api/pms/productClass";
import { LogView, TabelPageLayout } from "@/components";
export default {
  name: "productClass",
  data() {
    return {
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
      },
      parentId: 0,
      dialogVisible: false,
      unDisabled: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "createPerson", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getProductClassLogList,
        param: {
          id: "",
        },
      },
      dialogClassVisible: false,
      classType: [],
    };
  },
  components: {
    LogView,
    TabelPageLayout,
  },
  created() {
    this.resetParentId();
    this.getList();
  },
  watch: {
    $route(route) {
      this.resetParentId();
      this.getList();
    },
  },
  filters: {
    gradeFilter(value) {
      if (value === 1) {
        return "一级";
      } else if (value === 2) {
        return "二级";
      } else if (value === 3) {
        return "三级";
      }
    },
  },
  methods: {
    resetParentId() {
      this.listQuery.pageNum = 1;
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await fetchList();
        this.list = res.data.filter((i) => {
          return i.parentid == 0;
        });
        this.total = this.list.length;
        for (let i = 0; i < this.list.length - 1; i++) {
          this.list[i].children = res.data.filter((item) => {
            return item.parentid == this.list[i].classid;
          });
          for (let j = 0; j < this.list[i].children.length - 1; j++) {
            this.list[i].children[j].children = res.data.filter((item) => {
              return item.parentid == this.list[i].children[j].classid;
            });
          }
        }
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    handUpdate() {
      this.unDisabled = true;
      updateAll().then((response) => {
        if (200 == response.code) {
          this.unDisabled = false;
          this.$message.success(response.message);
        }
        this.getList();
      });
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.dialogVisible = true;
    },
    handDialog(classid) {
      this.classType = this.list.filter((i) => {
        return i.classid == classid;
      });
      // console.log(this.classType)
      this.classType.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((itm) => {
            if (itm.children && itm.children.length < 1) {
              delete itm.children;
            }
          });
        } else {
          delete item.children;
        }
      });
      this.dialogClassVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .u-table__body {
  tbody {
    tr {
      td:first-child {
        text-align: left !important;
      }
    }
  }
}
.productClassDialog {
  .el-dialog__body {
    padding: 0 20px 10px;
    overflow: hidden;
  }

  .el-dialog__footer {
    text-align: center;
    padding: 10px 20px 20px;
  }
}
</style>
        