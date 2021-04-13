<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" :dropdownDefault="false" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="类型：">
          <el-select v-model="listQuery.type" placeholder="全部" clearable filterable>
            <el-option v-for="(item, index) in typeList.type" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：">
          <el-input placeholder="模糊搜索" v-model="listQuery.keyWord" clearable />
        </el-form-item>
        <el-form-item label="风险等级：">
          <el-select v-model="listQuery.riskLevel" placeholder="全部" clearable filterable>
            <el-option v-for="(item, index) in typeList.riskLevel" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:2px;">
      <el-button @click="addDialog = true" size="mini" type="primary" v-if="rolePermissionJudge('/sensitiveWords/add')">添加</el-button>
      <el-button @click="deleteSelect" size="mini" type="primary" v-if="rolePermissionJudge('/sensitiveWords/delect')">删除</el-button>
      <el-button @click="importDialog.visible = true" size="mini" type="primary" v-if="rolePermissionJudge('/sensitiveWords/export')">导入</el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" />
        <u-table-column label="关键词" align="center">
          <template #default="{ row }">
            <div v-copy="row.keyWord">{{row.keyWord}}</div>
          </template>
        </u-table-column>
        <u-table-column label="类型" align="center" prop="type" />
        <u-table-column label="风险等级" align="center" prop="riskLevel" />
        <u-table-column label="添加人" align="center" prop="addUser">
          <template #default="{ row }">
            {{ row.define3 || row.addUser }}
          </template>
        </u-table-column>
        <u-table-column label="备注" align="center" prop="remark" />
        <u-table-column label="添加时间" align="center" prop="addTime" />
      </u-table>
    </template>

    <ImportDialog :visible.sync="importDialog.visible" @request="getList" :options="importDialog.options">
      <el-button size="mini" @click="downExcel()">下载模板</el-button>
    </ImportDialog>
    <AddDialog :visible.sync="addDialog" :typeList="typeList" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import {
  TabelPageLayout,
  ShrinkCard,
  ImportDialog
} from "@/components";
import { getSensitiveWordType, list, deleteOption, add, importOption, getTemplateUrl } from "@/api/selection/sensitiveWords"
import AddDialog from "./components/AddDialog"
const defaultListQuery = {
  type: "",
  riskLevel: "",
  keyword: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "sensitiveWords",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        type: [],
        riskLevel: [{ label: "高危", value: "高危" }, { label: "普通", value: "普通" }]
      },
      importDialog: {
        visible: false,
        options: {
          uploadApi: importOption,
          downloadPath: "http://lemontree-test.oss-cn-shenzhen.aliyuncs.com/other/template/%E6%95%8F%E6%84%9F%E8%AF%8D%E5%BA%93%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx"
        }
      },
      addDialog: false
    }
  },
  components: {
    TabelPageLayout,
    ShrinkCard,
    ImportDialog,
    AddDialog
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
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await list({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getSensitiveWordType();
      this.typeList.type = res.data
    },
    async deleteSelect() {
      const { $refs, $message, $confirm } = this;
      const selection = $refs.tableContainer.$refs.singleTable.selection
      if (!selection.length) {
        $message({
          type: "warning",
          message: "请先勾选需要操作的数据"
        })
        return
      }
      try {
        const confirm = await $confirm('是否将选中数据删除？是请按确认按钮！', '确认提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const ids = selection.map(item => item.id);
        const res = await deleteOption(ids)
        if (res.code === 200) {
          $message({
            type: "success",
            message: "删除成功"
          })
          this.getList()
        }
      } catch (error) { }
    },
    async downExcel() {
      const res = await getTemplateUrl()
      window.open(res.data, "_self")
    }
  }
}
</script>
<style lang="scss" scoped>
</style>