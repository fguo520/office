<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="handCategory" :disabled="ifCategory" :loading="ifCategory" v-if="rolePermissionJudge('/rtsClass/update')">
        更新类目
      </el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" row-id="random" :treeConfig="{lazy: true, load:tableLoad }">
        <u-table-column label="类目ID" align="center" width="180" :tree-node="true">
          <template #default="{ row }">
            <el-link :underline="false" type="primary" v-if="row.level==1" @click="dialogClassVisible = true">
              {{ row.categoryId }}</el-link>
            <span v-else>{{ row.categoryId }}</span>
          </template>
        </u-table-column>
        <u-table-column label="类目名称" align="center" prop="categoryNameCn" />
        <u-table-column label="最近更新时间" align="center" prop="updateTime" />
        <u-table-column label="操作" align="center" width="150">
          <template #default="{ row }">
            <el-button type="text" size="mini" @click="handlecate(row)" v-if="row.leafCategory">更新类目</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <!-- 类别 -->
    <el-dialog title="类别" :visible.sync="dialogClassVisible" width="900px" v-if="dialogClassVisible" custom-class="productClassDialog">
      <el-cascader-panel :props="categoryProps" />

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassVisible = false" size="mini">
          关 闭
        </el-button>
      </div>
    </el-dialog>
  </TabelPageLayout>
</template>

<script>
import { categoryPage, attributesSave, categorySave } from "@/api/rts/rtsClass"
import { TabelPageLayout } from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  categoryId: "",
};
export default {
  name: "rtsClass",
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      dialogClassVisible: false,
      ifCategory: false,
      categoryProps: {
        lazy: true,
        label: 'categoryNameCn',
        value: 'categoryId',
        leaf: 'leafCategory',
        async lazyLoad(node, resolve) {
          const { value } = node;
          const res = await categoryPage({ parentCategoryId: value || 0 })
          resolve(res.data.list)
        }
      },
    }
  },
  components: {
    TabelPageLayout,
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const parentCategoryId = this.listQuery.categoryId.slice(-1)[0];
      try {
        const res = await categoryPage({ ...this.listQuery, parentCategoryId });
        this.list = res.data.list.map(item => ({
          ...item,
          hasChildren: !item.leafCategory,
          random: Math.floor(Math.random() * 1000000)
        }));
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async tableLoad(tree, resolve) {
      const res = await categoryPage({ parentCategoryId: tree.categoryId, pageNum: 1, pageSize: 99999 })
      const callback = res.data.list.map(item => ({
        ...item,
        hasChildren: !item.leafCategory,
        random: Math.floor(Math.random() * 1000000)
      }));
      resolve(callback);
    },
    async handlecate(row) {
      this.$message.warning("正在发起请求，请等待片刻");
      const res = await attributesSave({ catId: row.categoryId })
      if (res.code == 200) {
        this.$message.success(res.data);
        this.getList();
      }
    },
    async handCategory() {
      try {
        const comfim = await this.$confirm('全量更新，耗时较长，是否继续更新？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.ifCategory = true;
        const res = await categorySave({ regionCode: this.listQuery.regionCode })
        if (200 == res.code) {
          this.ifCategory = false;
          this.$message.success(res.message);
          this.getList();
        }
      } catch (error) { }
    },
  }
}
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