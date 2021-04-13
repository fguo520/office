
<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="侵权类型：" prop="type">
          <el-select v-model="listQuery.type" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in categoryList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <el-button size="mini" class="btn-add" type="primary" @click="importDialog = true" v-if="rolePermissionJudge('/walmart/infringement/export')">导入侵权数据</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="sku" align="center" width="150">
          <template #default="{ row }">
            <div style="text-align: left">
              <i v-copy="row.sku" class="el-icon-document-copy"></i>
              <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">
                {{ row.sku }}
              </el-link>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="数据类型" align="center" prop="dataType" />
        <u-table-column label="侵权内容" align="center" width="450">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="scope.row.tortContent" placement="top">
                <div class="tooltipClass">{{scope.row.tortContent}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="侵权禁售等级" align="center" prop="tortLevel" />
        <u-table-column label="导入人" align="center" prop="adminName" />
        <u-table-column label="导入时间" align="center" prop="createTime" />
      </u-table>
    </template>
    <!-- 导出 -->
    <el-dialog title="导入" :visible.sync="importDialog" width="400px" @close="importDialogClose">
      <el-form ref="resourceForm" label-width="150px" size="mini">
        <el-form-item label="下载模板：">
          <el-button size="mini" class="btn-add" @click="downExcel()">下载模板</el-button>
        </el-form-item>
        <el-form-item label="导入模板：">
          <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :auto-upload="false" :limit="1" :on-exceed="limitExceed">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialog = false" size="mini">取 消</el-button>
        <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getWalmartTortList, importWalmartTort, getWalmartTortTypeList } from "@/api/walmart/infringement";
import { TabelPageLayout, SkuInfoView, ShrinkCard } from "@/components";
const defaultListQuery = {
  type: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "infringement",
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      categoryList: [],
      importDialog: false,
      SkuNum: "",
      SkuDialogVisible: false,
      fileData: "",//文件
    };
  },
  components: {
    TabelPageLayout,
    SkuInfoView,
    ShrinkCard
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
      try {
        const res = await getWalmartTortList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getType() {
      const res = await getWalmartTortTypeList();
      this.categoryList = res.data
    },
    downExcel() {
      window.open('https://lemontree-test.oss-cn-shenzhen.aliyuncs.com/walmart/report/category/attribute/1606962841616_%E6%B2%83%E5%B0%94%E7%8E%9B%E4%BE%B5%E6%9D%83%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx', '_self')
    },
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (Xls[Xls.length - 1] !== "xls" && Xls[Xls.length - 1] !== "xlsx" && Xls[Xls.length - 1] !== "csv") {
        this.$message.warning("请选择正确格式文件");
        this.$refs.upload.clearFiles();
        return false;
      }
      this.fileData = file;
    },
    async handleOk() {
      if (this.fileData === "") {
        this.$message.warning("请选择csv文件");
        return false;
      }
      const formData = new FormData();
      formData.append("file", this.fileData);
      const res = await importWalmartTort(formData)
      this.importDialog = false
      this.$message.success(res.data);
      this.getList();
      this.$refs.upload.clearFiles()
    },
    importDialogClose() {
      this.$refs.upload.clearFiles()
    },
    limitExceed() {
      this.$message({
        type: "warning",
        message: "一次只能上传一个文件"
      })
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
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
</style>