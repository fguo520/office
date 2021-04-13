<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="使用状态：">
          <el-select v-model="listQuery.userStatus" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.useingState" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="upc：">
          <TextareaInput v-model="listQuery.upc" />
        </el-form-item>
        <el-form-item label="平台：">
          <el-select v-model="listQuery.platformCode" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.platformCodeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:2px;">
      <el-button @click="dialogVisible = true" size="mini" type="primary" v-if="rolePermissionJudge('/walmart/upcList')">导入</el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="操作" align="center" width="180">
          <template #default="{ row, $index }">
            <span style="margin-right:25px">{{ $index+1 }}</span>
            <el-button type="text" @click="del(row.id)" size="mini" v-if="row.useStatus === '未使用'">删除</el-button>
            <el-button type="text" @click="markFn(row.id)" size="mini" v-if="row.useStatus === '未使用'">标记</el-button>
          </template>
        </u-table-column>
        <u-table-column label="upc" align="center" width="150">
          <template #default="{ row }">
            <span v-copy="row.upc">{{ row.upc }}</span>
          </template>
        </u-table-column>
        <u-table-column label="平台" align="center" width="150">
          <template #default="{ row }">
            <span v-copy="row.platform">{{ row.platform }}</span>
          </template>
        </u-table-column>
        <u-table-column label="是否使用" align="center" width="150">
          <template #default="{ row }">
            <span :style="useStatusStyle(row.useStatus)">{{ row.useStatus=="已使用"?"是":"否" }}</span>
          </template>
        </u-table-column>
        <u-table-column label="自定义sku" align="center">
          <template #default="{ row }">
            <div style="text-align:left">{{row.customSku}}</div>
          </template>
        </u-table-column>
        <u-table-column label="渠道别名" align="center" prop="storeNameAs" />
        <u-table-column label="使用人" align="center" prop="useUserName" width="150" />
        <u-table-column label="导入人" align="center" prop="importUserName" width="150" />
        <u-table-column label="时间" align="center">
          <template #default="{ row }">
            <div v-if="row.createTime">创建：{{ row.createTime }}</div>
            <div v-if="row.importTime">导入：{{ row.importTime }}</div>
            <div v-if="row.useTime">使用：{{ row.useTime }}</div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <!-- 导出 -->
    <el-dialog title="导入" :visible.sync="dialogVisible" v-if="dialogVisible" width="576px">
      <el-form ref="resourceForm" label-width="150px" size="mini">
        <el-form-item label="平台：">
          <el-select v-model="formData.platformCode" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.platformCodeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="下载模板：">
          <el-button size="mini" class="btn-add" @click="downExcel()">下载模板</el-button>
        </el-form-item>
        <el-form-item label="导入模板：">
          <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :auto-upload="false" multiple :limit="10" :file-list="fileList">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <MarkDialog :visible.sync="mark.vasible" :markId="mark.markId" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import {
  TabelPageLayout,
  ShrinkCard,
  TextareaInput,
} from "@/components";
import { del, importFile, marker, page, getPlatforms } from "@/api/common/upcList"
import MarkDialog from "./components/MarkDialog"
const defaultListQuery = {
  userStatus: "",
  upc: [],
  pageNum: 1,
  pageSize: 50,
  platformCode: ""
};
export default {
  name: "upcList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        useingState: [{ label: "未使用", value: 0 }, { label: "已使用", value: 1 }],
        platformCodeList: []
      },
      // importDialog: {
      //   visible: false,
      //   options: {
      //     uploadApi: importFile,
      //     downloadPath: "https://lemontree-prod.oss-cn-shenzhen.aliyuncs.com/other/template/upc%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx"
      //   }
      // },
      mark: {
        vasible: false,
        markId: ""
      },
      fileList: [],
      formData: {
        platformCode: "", //平台
        file: "", //文件
      },
      dialogVisible: false
    }
  },
  components: {
    TabelPageLayout,
    ShrinkCard,
    TextareaInput,
    MarkDialog
  },
  computed: {
    useStatusStyle() {
      return (value) => {
        switch (value) {
          case '已使用':
            return { color: 'green', fontSize: '18px', fontWeight: 'bold' }
          case '未使用':
            return { color: 'red', fontSize: '18px', fontWeight: 'bold' }
        }
      }
    },
  },
  created() {
    this.getList();
    this.getType()
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await page({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getPlatforms()
      this.typeList.platformCodeList = res.data
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async del(id) {
      const { $confirm, $message, getList } = this;
      try {
        const confirm = await $confirm('是否将选中数据删除，是请按确认按钮！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await del(id);
        if (res.code === 200) {
          $message.success(res.data);
          getList()
        }
      } catch (error) { }
    },
    markFn(id) {
      this.mark.vasible = true;
      this.mark.markId = id;
    },
    downExcel() {
      window.open("https://lemontree-prod.oss-cn-shenzhen.aliyuncs.com/other/template/upc%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx", "_self")
    },
    // 导入
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (
        Xls[Xls.length - 1] !== "xls" &&
        Xls[Xls.length - 1] !== "xlsx" &&
        Xls[Xls.length - 1] !== "csv"
      ) {
        this.$message.warning("请选择csv文件");
        this.$refs.upload.clearFiles();
        return false;
      }
      const fileLists = fileList.map((i) => {
        return i.raw;
      });
      this.formData.file = fileLists;
    },
    handleOk() {
      console.log(this.formData)
      if (!this.formData.platformCode) {
        this.$message.error("请选择平台");
        return;
      }
      if (this.formData.file == "") {
        this.$message.warning("请选择csv文件");
        return false;
      }
      const formData = new FormData();
      formData.append("file", this.formData.file[0]);
      formData.append("platformCode", this.formData.platformCode);
      importFile(formData).then(res => {
        this.$message.success(res.message);
        this.getList();
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }
}
.formDiv .el-dialog__body {
  .el-form {
    .formDialog {
      overflow: hidden;
      .formDialog_item {
        width: 369px;
        float: left;
        .el-form-item /deep/.el-form-item__content {
          width: 200px;
        }
        .el-date-editor {
          width: 200px;
        }
      }
    }
  }
}
</style>