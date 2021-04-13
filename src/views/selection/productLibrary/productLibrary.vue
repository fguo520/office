<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" :dropdownDefault="false" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="130px" v-show="tableType">
        <el-form-item label="自定义SKU：">
          <el-input placeholder="模糊搜索" v-model="listQuery.sku" clearable />
        </el-form-item>
        <el-form-item label="平台：">
          <el-select v-model="listQuery.platform" placeholder="全部" clearable filterable>
            <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务编号：">
          <el-input placeholder="请输入" v-model="listQuery.taskNo" clearable />
        </el-form-item>
        <el-form-item label="商品ID：">
          <TextareaInput v-model="listQuery.productIds" />
        </el-form-item>
        <el-form-item label="对标公司：">
          <el-input placeholder="精确搜索" v-model="listQuery.company" clearable />
        </el-form-item>
        <el-form-item label="检测结果：">
          <ScrollSelect v-model="listQuery.checkResults" :list="typeList.testResultsList" placeholder="可多选" />
        </el-form-item>
        <el-form-item label="添加时间：">
          <el-date-picker @change="timeChange" v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <RadioButtonGroup v-model="tableType" :ButtonTypes="typeList.tableTypeList" @request="getQuery" :doubleCancle="false">
      <template #1>
        <el-button @click="importData" size="mini" class="radioBtn" v-if="rolePermissionJudge('/productLibrary/export')">导出数据</el-button>
        <el-button @click="batchRemove" size="mini" class="radioBtn" v-if="rolePermissionJudge('/productLibrary/delect')">批量移除</el-button>
      </template>
    </RadioButtonGroup>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <ProdInfoTable v-if="tableType" :testResultsList="typeList.testResultsList" />
        <DebriefingTable v-if="!tableType" />
      </u-table>
    </template>

    <ImportDialog :visible.sync="importDialog.visible" :query="importDialog.query" />
  </TabelPageLayout>
</template>
<script>
import { TabelPageLayout, ShrinkCard, RadioButtonGroup, ScrollSelect, TextareaInput } from "@/components";
import ImportDialog from "./components/ImportDialog"
import ProdInfoTable from "./components/ProdInfoTable"
import DebriefingTable from "./components/DebriefingTable"
import { getPlatforms, list, batchRemove, importExcel, reportList } from "@/api/selection/productLibrary"
const defaultListQuery = {
  sku: "",
  platform: "",
  company: "",
  taskNo: "",
  productIds: [],
  checkResults: [],
  dwdCreateBeginDate: "",
  dwdCreateEndDate: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "productLibrary",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      tableType: 1,
      createTimeAndEndTime: [],
      typeList: {
        platformList: [],
        tableTypeList: [
          { label: "选品信息", value: 1 },
          { label: "任务报告", value: 0 },
        ],
        testResultsList: [
          { label: "待检测", value: "0", color: "#d4b106" },
          { label: "侵权", value: "1", color: '#f5222d' },
          { label: "图片重复", value: "2", color: '#fa8c16', badge: true },
          { label: "正常", value: "3", color: '#7cb305' }
        ]
      },
      importDialog: {
        visible: false,
        query: {},
      }
    }
  },
  components: {
    TabelPageLayout,
    ShrinkCard,
    RadioButtonGroup,
    ScrollSelect,
    TextareaInput,
    ImportDialog,
    ProdInfoTable,
    DebriefingTable,
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
        const requestApi = this.tableType ? list : reportList
        const res = await requestApi({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getPlatforms();
      this.typeList.platformList = res.data
    },
    async batchRemove() {
      try {
        const { $refs, $message, $confirm, getList } = this;
        const selection = $refs.tableContainer.$refs.singleTable.selection
        const ids = selection.map(item => item.id)
        if (ids.length === 0) {
          $message.warning("请在列表中勾选需要移除选品库的选品")
          return
        }
        await $confirm('是否将勾选的选品从选品库移除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await batchRemove(ids)
        if (res.code === 200) {
          $message.success(res.data)
          getList()
        }
      } catch (error) { }
    },
    async importData() {
      const { $message, $refs } = this
      const selection = $refs.tableContainer.$refs.singleTable.selection
      const dataIds = selection.map(item => item.id).join(",")
      this.importDialog = {
        visible: true,
        query: { ...this.listQuery, dataIds }
      }
    },
    timeChange() {
      if (this.createTimeAndEndTime != null) {
        this.listQuery.dwdCreateBeginDate = this.createTimeAndEndTime[0];
        this.listQuery.dwdCreateEndDate = this.createTimeAndEndTime[1];
      } else {
        this.listQuery.dwdCreateBeginDate = "";
        this.listQuery.dwdCreateEndDate = "";
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}
/deep/ .umy-table-beyond {
  overflow: initial !important;
}
</style>