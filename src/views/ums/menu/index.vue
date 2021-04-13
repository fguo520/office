<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <div>
      <el-button @click="handleAddMenu()" size="mini" type="primary">
        添加
      </el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" row-id="uuid" :default-expand-all="false" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="编号" width="150" align="center" :tree-node="true">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </u-table-column>
        <u-table-column label="菜单名称" align="center">
          <template slot-scope="scope"><div v-copy="scope.row.title">{{ scope.row.title }}</div></template>
        </u-table-column>
        <u-table-column label="菜单级数" align="center">
          <template slot-scope="scope">{{
            scope.row.level | levelFilter
          }}</template>
        </u-table-column>
        <u-table-column label="前端名称" align="center" width="350">
          <template slot-scope="scope"><div v-copy="scope.row.name">{{ scope.row.name }}</div></template>
        </u-table-column>
        <u-table-column label="前端图标" align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon || ''"></svg-icon>
          </template>
        </u-table-column>
        <u-table-column label="是否显示" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleHiddenChange(scope.$index, scope.row)" :active-value="0" :inactive-value="1" v-model="scope.row.hidden">
            </el-switch>
          </template>
        </u-table-column>
        <u-table-column label="排序" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </u-table-column>
        <u-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <!-- <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button> -->
          </template>
        </u-table-column>
      </u-table>
    </template>
  </TabelPageLayout>
</template>

<script>
import { fetchList, deleteMenu, updateMenu, updateHidden } from "@/api/ums/menu";
import { TabelPageLayout } from "@/components";
export default {
  name: "menuList",
  data() {
    return {
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
      },
      parentId: 0,
    };
  },
  components: {
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
  methods: {
    resetParentId() {
      this.listQuery.pageNum = 1;
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
    },
    handleAddMenu() {
      this.$router.push("/ums/addMenu");
    },
    getList() {
      this.listLoading = true;
      fetchList(this.parentId, this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleHiddenChange(index, row) {
      updateHidden(row.uuid, { hidden: row.hidden }).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    handleUpdate(index, row) {
      let isBtn = !row.icon ? true : false;
      this.$router.push({
        path: "/ums/updateMenu",
        query: { uuid: row.uuid, isBtn, id: row.id },
      });
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该菜单", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteMenu(row.uuid).then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000,
          });
          this.getList();
        });
      });
    },
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return "一级";
      } else if (value === 1) {
        return "二级";
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-divider {
  margin: 0;
  margin-bottom: 24px;
}
</style>
