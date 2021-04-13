<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="站点：">
          <el-select v-model="listQuery.regionCode" placeholder="全部" size="mini" class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.regionList" :key="index" :label="item.parameterValue" :value="item.parameterCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类目：">
          <el-cascader v-model="listQuery.categoryId" size="mini" :options="typeList.categoryIdList" clearable placeholder="全部" :props="{ label: 'categoryName', value: 'categoryId', checkStrictly: true,}" filterable></el-cascader>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="handCategory" :disabled="ifCategory" :loading="ifCategory" v-if="rolePermissionJudge('/shopeeClass/Category')">更新类目</el-button>
      <el-button type="primary" size="mini" @click="handAttributes" :disabled="ifDisabled" :loading="ifDisabled" v-if="rolePermissionJudge('/shopeeClass/Attributes')">更新属性</el-button>
      <el-button @click="excelVisible=true" type="primary" size="mini" v-if="rolePermissionJudge('/shopeeClass/interpret')">导入翻译</el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" row-id="random" :treeConfig="{lazy: true, load:tableLoad }">
        <u-table-column label="类目ID" align="center" width="180" :tree-node="true">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" v-if="scope.row.parentId==0" @click="handCate(scope.row)">
              {{ scope.row.categoryId }}</el-link>
            <span v-else>{{ scope.row.categoryId }}</span>
          </template>
        </u-table-column>
        <u-table-column label="类别名称" align="center">
          <template #default="{ row }">
            <div>
              <span>{{ row.categoryName }} </span><span v-show="row.categoryNameCn">({{row.categoryNameCn}})</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="站点" align="center">
          <template #default="{ row }">
            <div>
              <span>{{ row.region }} </span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="最近更新时间" align="center">
          <template #default="{ row }">
            <div>
              <span>{{ row.updateTime }} </span>
            </div>
          </template>
        </u-table-column>

        <u-table-column label="操作" align="center" width="150">
          <template #default="{ row }">
            <div v-if="row.parentId===0">
              <el-button type="text" size="mini" @click="handlecate(row)" v-if="rolePermissionJudge('/shopeeClass/Category/row')">更新类目</el-button>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <!-- 类别 -->
    <el-dialog title="类别" :visible.sync="dialogClassVisible" width="900px" v-if="dialogClassVisible" custom-class="productClassDialog">
      <el-cascader-panel :options="typeList.categoryIdList" clearable :props="{ label: 'categoryName', value: 'categoryId' }"></el-cascader-panel>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassVisible = false" size="mini">
          关 闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入翻译" :visible.sync="excelVisible" width="576px" append-to-body @close="$refs.upload.clearFiles()">
      <el-form ref="resourceForm" label-width="150px" size="mini">
        <el-form-item label="下载模板：">
          <el-button size="mini" class="btn-add" @click="downExcel()">下载模板</el-button>
        </el-form-item>
        <el-form-item label="导入模板：">
          <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :auto-upload="false" multiple :limit="1" :file-list="fileList">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="excelVisible=false" size="mini">取消</el-button>
        <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </TabelPageLayout>
</template>

<script>
import { getLmShopeeCategoryList, getRegionList, getShopeeApiCategoryNode, saveShopeeApiAttributes, saveShopeeApiCategory, updateAttribute, importCategoryAttributes } from "@/api/shopee/shopeeClass";
import { TabelPageLayout, ShrinkCard } from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  categoryId: "",
  regionCode: "10411",
};
export default {
  name: "shopeeClass",
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      typeList: {
        regionList: [],
        categoryIdList: []
      },
      dialogClassVisible: false,
      ifCategory: false,
      ifDisabled: false,
      excelVisible: false,
      fileList: [],
      formData: {
        file: "", //文件
      },
    }
  },
  components: {
    TabelPageLayout,
    ShrinkCard,
  },
  watch: {
    "listQuery.regionCode"(newValue, oldValue) {
      if (newValue != oldValue) {
        this.getShopeeApiCategoryNode()
      }
    }
  },
  created() {
    this.getList();
    this.getType();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const categoryId = this.listQuery.categoryId.slice(-1)[0];
      try {
        const res = await getLmShopeeCategoryList({ ...this.listQuery, categoryId });
        res.data.list.forEach((item) => {
          item.random = Math.floor(Math.random() * 1000000);
        })
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getRegionList();
      this.typeList.regionList = res.data
      this.getShopeeApiCategoryNode()
    },
    async getShopeeApiCategoryNode() {
      const res = await getShopeeApiCategoryNode({ regionCode: this.listQuery.regionCode })
      this.typeList.categoryIdList = this.getTreeData(res.data)
    },
    downExcel() {
      window.open("https://lemontree-prod.oss-cn-shenzhen.aliyuncs.com/shopee/report/shopee_import_category_template.xlsx", '_self');
    },
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (
        Xls[Xls.length - 1] !== "xls" &&
        Xls[Xls.length - 1] !== "xlsx" &&
        Xls[Xls.length - 1] !== "csv"
      ) {
        this.$message.warning("请选择正确格式文件");
        this.$refs.upload.clearFiles();
        return false;
      }
      const fileLists = fileList.map((i) => {
        return i.raw;
      });
      this.formData.file = fileLists;
    },
    async handleOk() {
      if (this.formData.file == "") {
        this.$message.warning("请选择csv文件");
        return false;
      }
      if (this.formData.logisticsNo == "") {
        this.$message.warning("请选择物流单号");
        return false;
      } try {
        for (let i = 0; i < this.formData.file.length; i++) {
          const formData = new FormData();
          formData.append("file", this.formData.file[i]);
          const res = await importCategoryAttributes(formData)
          if (res.code == 200) {
            this.$message.success(res.message);
            this.getList();
            this.excelVisible = false
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children) break;
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    tableLoad(tree, resolve) {
      getLmShopeeCategoryList({
        regionCode: this.listQuery.regionCode,
        parentId: tree.categoryId,
      }).then(res => {
        res.data.list.forEach((item) => {
          item.random = Math.floor(Math.random() * 1000000);
        })
        resolve(res.data.list);
      });
    },
    async handCate(row) {
      this.dialogClassVisible = true;
    },
    // 一级更新类目
    handlecate(row) {
      this.$message.warning("正在发起请求，请等待片刻");
      updateAttribute({ categoryId: row.categoryId, regionCode: row.regionCode }).then((response) => {
        if (200 == response.code) {
          this.$message.success(response.message);
          this.getList();
        }
      });
    },
    handCategory() {
      this.ifCategory = true;
      saveShopeeApiCategory({ regionCode: this.listQuery.regionCode }).then((response) => {
        if (200 == response.code) {
          this.ifCategory = false;
          this.$message.success(response.message);
          this.getList();
        }
      });
    },
    handAttributes() {
      this.ifDisabled = true;
      saveShopeeApiAttributes({ regionCode: this.listQuery.regionCode }).then((response) => {
        if (200 == response.code) {
          this.ifDisabled = false;
          this.$message.success(response.message);
          this.getList();
        }
      });
    }
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