<template>
   
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" :model="listQuery" size="mini" label-width="100px">
        <el-form-item label="输入搜索：">
          <el-input v-model="listQuery.keyword" class="input-width" placeholder="角色名称" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button size="mini" @click="handleAdd()" type="primary">添加</el-button>
        <el-button @click="handleResetSearch()" size="mini">重置</el-button>
        <el-button type="primary" @click="handleSearchList()" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="编号" width="50" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </u-table-column>
        <u-table-column label="角色名称" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.name">{{ scope.row.name }}</div>
          </template>
        </u-table-column>
        <u-table-column label="描述" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </u-table-column>
        <!-- <u-table-column label="用户数" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.adminCount }}</template>
        </u-table-column> -->
        <u-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatDateTime
          }}</template>
        </u-table-column>
        <u-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.status">
            </el-switch>
          </template>
        </u-table-column>
        <u-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleSelectMenu(scope.$index, scope.row)">分配菜单
            </el-button>
            <el-button size="mini" type="text" @click="handleSelectResource(scope.$index, scope.row)">分配资源
            </el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" :visible.sync="dialogVisible" width="576px">
      <el-form :model="role" ref="roleForm" label-width="150px" size="mini">
        <el-form-item label="角色名称：">
          <el-input v-model="role.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="role.description" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </TabelPageLayout>
</template>
<script>
import {
  fetchList,
  createRole,
  updateRole,
  updateStatus,
  deleteRole,
} from "@/api/ums/role";
import { formatDate } from "@/utils/date";
import { TabelPageLayout, ShrinkCard } from "@/components";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  keyword: null,
};
const defaultRole = {
  id: "",
  name: "",
  description: "",
  adminCount: 0,
  status: 1,
};
export default {
  name: "roleList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      role: Object.assign({}, defaultRole),
      isEdit: false,
    };
  },
  components: {
    TabelPageLayout,
    ShrinkCard
  },
  created() {
    this.getList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.role = Object.assign({}, defaultRole);
    },
    handleStatusChange(index, row) {
      this.$confirm("是否要修改该状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateStatus(row.id, { status: row.status }).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改",
          });
          this.getList();
        });
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteRole(params).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.role = Object.assign({}, row);
    },
    handleDialogConfirm() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          updateRole(this.role.id, this.role).then((response) => {
            this.$message({
              message: "修改成功！",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          createRole(this.role).then((response) => {
            this.$message({
              message: "添加成功！",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          });
        }
      });
    },
    handleSelectMenu(index, row) {
      this.$router.push({ path: "/ums/allocMenu", query: { roleId: row.id } });
    },
    handleSelectResource(index, row) {
      this.$router.push({
        path: "/ums/allocResource",
        query: { roleId: row.id },
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  .input-limit {
    position: absolute;
    bottom: -5px;
    right: 10px;
    font-size: 1px;
    color: gray;
  }

  /deep/ .el-form-item__label {
    width: 120px !important;
  }

  .buttonContainer {
    width: 180px;
  }

  /deep/ .el-textarea__inner {
    width: 180px;
  }

  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }

  .el-zoom-in-top-enter,
  .el-zoom-in-bottom-enter,
  .el-zoom-in-top-leave-to,
  .el-zoom-in-bottom-leave-to {
    position: absolute;
  }
}
</style>


