<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="120px">
        <el-form-item label="类目ID:">
          <el-input v-model="listQuery.productCategoryId" placeholder="全部" />
        </el-form-item>
        <el-form-item label="国家:">
          <el-select v-model="listQuery.marketplaceid" placeholder="请选择" filterable clearable>
            <el-option v-for="item in countryList" :key="item.id" :label="item.parameterName" :value="item.parameterValue" />
          </el-select>
          <el-form-item label="类目中文名称:">
            <el-input v-model="listQuery.productCategoryNameCn" placeholder="精确查询" />
          </el-form-item>
          <el-form-item label="类目英文名称:">
            <el-input v-model="listQuery.productCategoryNameEn" placeholder="精确查询" />
          </el-form-item>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="importCategroyVisible = true;" v-if="rolePermissionJudge('/amazonClass/export')">
        导入类目
      </el-button>
      <el-button type="primary" size="mini" @click="addCategroyVisible = true;" v-if="rolePermissionJudge('/amazonClass/add')">
        添加类目
      </el-button>
      <el-button type="primary" size="mini" @click="addCateAttrVisible = true;" v-if="rolePermissionJudge('/amazonClass/upload')">
        上传类目属性
      </el-button>
      <el-button type="primary" size="mini" @click="addCateExportVisible = true;" v-if="rolePermissionJudge('/amazonClass/batch')">
        <!-- v-if="rolePermissionJudge('/amazonClass/addCateAttr')" -->
        批量导入
      </el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" row-id="random" :treeConfig="{lazy: true, load:tableLoad }" class="elTable">
        <u-table-column label="类目ID" align="center" width="200" :tree-node="true">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" v-if="scope.row.lever==1" @click="categroyVisible = true">
              {{ scope.row.productCategoryId }}
            </el-link>
            <span v-else>{{ scope.row.productCategoryId }}</span>
          </template>
        </u-table-column>
        <u-table-column label="类目中文名称" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <span v-copy="row.productCategoryNameCn">{{ row.productCategoryNameCn }}</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="类目英文名称" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <span v-copy="row.productCategoryNameEn">{{ row.productCategoryNameEn }}</span>
              <span v-if="!row.hasChildren && Boolean(row.ossUrl)" style="color:red;">(已维护)</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="国家" align="center" prop="marketplaceidName" width="180">
          <template #default="{ row }">
            <div v-copy="row.marketplaceidName">{{ row.marketplaceidName }}</div>
          </template>
        </u-table-column>
        <u-table-column label="级别" align="center" width="100" prop="lever" />
        <u-table-column label="是否顶级类目" align="center" width="120">
          <template #default="{ row }">
            <div>{{ row.parentId=='0'?'是':'否' }}</div>
          </template>
        </u-table-column>
        <u-table-column label="最近更新" align="center" width="200" prop="updateTime" />
        <u-table-column label="操作" align="center" width="120">
          <template #default="{ row }">
            <el-button type="text" size="mini" @click="editor(row)">编辑</el-button>
            <el-button type="text" size="mini" @click="handleLog(row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <ImportCategroy :visible.sync="importCategroyVisible" :countryList='countryList' />
    <AddCategroy :visible.sync="addCategroyVisible" :countryList='countryList' @request="getList" />
    <AddCateAttr :visible.sync="addCateAttrVisible" :countryList='countryList' @request="getList" />
    <AddCateExport :visible.sync="addCateExportVisible" :countryList='countryList' @request="getList" />
    <EditorDialog :visible.sync="editorDialog.visible" :row="editorDialog.row" />

    <!-- 类别 -->
    <el-dialog title="类别" :visible.sync="categroyVisible" width="900px" custom-class="productClassDialog">
      <el-cascader-panel :props="categoryProps" v-if="categroyVisible">
        <template #default="{ data }">
          <el-tooltip class="item" effect="dark" :content="data.productCategoryNameCn" placement="right">
            <span>{{ data.productCategoryNameEn }}</span>
          </el-tooltip>
          <span style="color:red;" v-if="data.isLeaf && data.ossUrl">(已维护)</span>
        </template>
      </el-cascader-panel>
      <div slot="footer" class="dialog-footer">
        <el-button @click="categroyVisible = false" size="mini">
          关 闭
        </el-button>
      </div>
    </el-dialog>
  </TabelPageLayout>
</template>

<script>
import { getCategoryListPage, searchCategoryLog, searchSysParameterCode, getCategoryList } from "@/api/amazon/amazonClass"
import { LogView, TabelPageLayout, ShrinkCard } from "@/components";
import ImportCategroy from "./components/ImportCategroy";
import AddCategroy from "./components/AddCategroy";
import AddCateAttr from "./components/AddCateAttr";
import EditorDialog from "./components/EditorDialog";
import AddCateExport from "./components/AddCateExport";

const defaultListQuery = {
  marketplaceid: "",
  productCategoryId: "",
  productCategoryNameCn: '',
  productCategoryNameEn: '',
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "amazonClass",
  components: {
    LogView,
    TabelPageLayout,
    ImportCategroy,
    AddCategroy,
    ShrinkCard,
    AddCateAttr,
    EditorDialog,AddCateExport
  },
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      countryList: [],
      categroyVisible: false,
      LogDialogVisible: false,
      addCateAttrVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: searchCategoryLog,
        param: {}
      },
      categoryProps: {
        lazy: true,
        label: 'productCategoryNameEn',
        value: 'productCategoryId',
        leaf: 'isLeaf',
        lazyLoad: async (node, resolve) => {
          const { value } = node
          const res = await getCategoryListPage({ parentCategoryId: value || this.listQuery.productCategoryId, pageNum: 1, pageSize: 99999 })
          const callback = res.data.list.map(item => ({
            ...item,
            isLeaf: item.childCount == 0,
            random: Math.floor(Math.random() * 1000000)
          }));
          resolve(callback);
        }
      },
      importCategroyVisible: false,
      addCategroyVisible: false,
      addCateExportVisible:false,
      editorDialog: {
        visible: false,
        row: {}
      }
    }
  },
  created() {
    this.getList(); this.getTyleList()
  },
  methods: {
    getTyleList() {
      searchSysParameterCode().then(res => {
        this.countryList = res.data
      })
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await getCategoryListPage({ ...this.listQuery });
        this.list = res.data.list.map(item => ({
          ...item,
          hasChildren: item.childCount > 0,
          random: Math.floor(Math.random() * 1000000)
        }));
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery)
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async tableLoad(tree, resolve) {
      const res = await getCategoryListPage({ parentCategoryId: tree.productCategoryId, pageNum: 1, pageSize: 99999 })
      const callback = res.data.list.map(item => ({
        ...item,
        hasChildren: item.childCount > 0,
        random: Math.floor(Math.random() * 1000000)
      }));
      resolve(callback);
    },
    handleLog(row) {
      this.logViewParam.param = {
        fullCatagoryName: row.fullCatagoryName,
        marketplaceid: row.marketplaceid,
        productCategoryId: row.productCategoryId
      }
      this.LogDialogVisible = true
    },
    editor(row) {
      this.editorDialog = {
        visible: true,
        row
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.elTable {
  /deep/ .u-table__body:first-of-type {
    tbody {
      tr {
        td:first-child {
          text-align: left !important;
        }
      }
    }
  }
}

.productClassDialog {
  .el-dialog__body {
    padding: 0 20px 10px;
    overflow: hidden;

    .el-cascader-panel {
      overflow: scroll;
    }
  }

  .el-dialog__footer {
    text-align: center;
    padding: 10px 20px 20px;
  }
}
</style>