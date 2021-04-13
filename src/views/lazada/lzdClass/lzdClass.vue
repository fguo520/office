<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="区域:">
          <el-select v-model="listQuery.region" placeholder="全部" size="mini" class="input-width" filterable @change="getList()">
            <el-option v-for="(item, index) in typeList.regionList" :key="index" :label="item.parameterName" :value="item.parameterCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ShrinkCard>

    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="handsaveLazadaApiCategory" :disabled="ifCategory" :loading="ifCategory" v-if="rolePermissionJudge('/lzd/class')">更新类目</el-button>
      <el-button type="primary" size="mini" @click="handsaveCategoryAttributesAll" :disabled="ifDisabled" :loading="ifDisabled" v-if="rolePermissionJudge('/lzd/property')">更新属性</el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" row-id="random" :treeConfig="{lazy: true, load:tableLoad }">
        <u-table-column label="类目ID" align="center" width="180" :tree-node="true">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" v-if="scope.row.level==1" @click="handCate(scope.row)">
              {{ scope.row.categoryId }}</el-link>
            <span v-else>{{ scope.row.categoryId }}</span>
          </template>
        </u-table-column>
        <u-table-column label="类目名称" align="center">
          <template #default="{ row }">
            <div>
              <span v-copy="row.name">{{ row.name }}</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="区域" align="center" width="250">
          <template #default="{ row }">
            <div>{{ row.region }}</div>
          </template>
        </u-table-column>
        <u-table-column label="级别" align="center" width="150">
          <template #default="{ row }">
            <div>{{ row.level | levelFilter }}</div>
          </template>
        </u-table-column>
        <u-table-column label="是否顶级类目" align="center" width="150">
          <template #default="{ row }">
            <div v-if="row.isFirstLevel">是</div>
            <div v-else>否</div>
          </template>
        </u-table-column>
        <u-table-column label="最近更新" align="center" width="200">
          <template #default="{ row }">
            <div>{{ row.createTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="180">
          <template #default="{ row }">
            <span v-if="row.parentCategoryId==0">
              <el-button type="text" size="mini" @click="handlecate(row)" v-if="rolePermissionJudge('/lzd/class/row')">更新类目</el-button>
            </span>
            <el-button type="text" size="mini" @click="handlejournal()">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <!-- 类别 -->
    <el-dialog title="类别" :visible.sync="dialogClassVisible" width="900px" custom-class="productClassDialog">
      <el-cascader-panel :options="classType" clearable :props="{ label: 'name', value: 'categoryId' }" @active-item-change="handleChange"></el-cascader-panel>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassVisible = false" size="mini">关 闭</el-button>
      </div>
    </el-dialog>
  </TabelPageLayout>
</template>
<script>
import {
  getCategoryPageList,
  getProductCategoryLog,
  saveCategoryAttributesAll,
  saveLazadaApiCategory,
  getRegionList,
  updateAttribute
} from "@/api/lazada/lzdClass";
import { LogView, TabelPageLayout, ShrinkCard } from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  parentCategoryId: "",
  region: "10325",
};
export default {
  name: "lzdClass",
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      dialogVisible: false,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getProductCategoryLog,
      },
      ifCategory: false,
      ifDisabled: false,
      typeList: {
        regionList: [],
      },
      dialogClassVisible: false,
      classType: [],
    };
  },
  components: {
    LogView,
    TabelPageLayout,
    ShrinkCard
  },
  filters: {
    levelFilter(type) {
      switch (type) {
        case 1:
          return "一级";
        case 2:
          return "二级";
        case 3:
          return "三级";
        case 4:
          return "四级";
      }
    },
  },
  created() {
    this.getList();
    this.getType();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getCategoryPageList(this.listQuery);
        res.data.list.forEach((item) => {
          item.random = Math.floor(Math.random() * 1000000);
        })
        this.list = res.data.list;
        this.classType = this.handleData(res.data.list);
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getRegionList();
      this.typeList.regionList = res.data;
    },
    tableLoad(tree, resolve) {
      getCategoryPageList({
        parentCategoryId: tree.categoryId,
        region: tree.parameterCode,
      }).then(res => {
        res.data.list.forEach((item) => {
          item.random = Math.floor(Math.random() * 1000000);
        })
        resolve(res.data.list);
      });
    },
    async handCate(row) {
      this.dialogClassVisible = true;
      this.classType = this.list.filter(i => {
        return i.categoryId == row.categoryId
      })
    },
    async handleChange(value) {
      let val = value ? value[value.length - 1] : "";
      this.classType = this.handleData(this.classType, val);
    },
    handleData(data, val) {
      for (let i = 0; i < data.length; i++) {
        if (!data[i].children) {
          this.$set(data[i], "children", []);
        }
        if (data[i].categoryId === val) {
          getCategoryPageList({
            parentCategoryId: val,
            region: this.listQuery.region,
          })
            .then((res) => {
              if (res.data.list.length) {
                data[i].children = res.data.list;
                data[i].children.forEach((item) => {
                  this.$set(item, "children", []);
                });
              } else {
                delete data[i].children;
              }
            })
            .catch((err) => { });
        } else {
          if (data[i].children.length) {
            this.handleData(data[i].children, val);
          }
        }
      }
      return data;
    },
    //日志
    handlejournal() {
      this.LogDialogVisible = true;
    },
    // 一级更新类目
    handlecate(row) {
      this.$message.warning("正在发起请求，请等待片刻");
      updateAttribute({ categoryId: row.categoryId, region: row.regionCode }).then((response) => {
        if (200 == response.code) {
          this.$message.success(response.message);
          this.getList();
        }
      });
    },
    //类目
    handsaveLazadaApiCategory() {
      this.ifCategory = true;
      saveLazadaApiCategory().then((response) => {
        if (200 == response.code) {
          this.ifCategory = false;
          this.$message.success(response.message);
          this.getList();
        }
      });
    },
    //属性
    handsaveCategoryAttributesAll() {
      this.ifDisabled = true;
      saveCategoryAttributesAll().then((response) => {
        if (200 == response.code) {
          this.ifDisabled = false;
          this.$message.success(response.message);
          this.getList();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }
}

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