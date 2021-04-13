<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" :dropdownDefault="false" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="130px" v-show="tableType">
        <el-form-item label="sku：">
          <TextareaInput v-model="listQuery.sku" valueType="String" format="," />
        </el-form-item>
        <el-form-item label="是否清仓：">
          <DoubleSelectBtn v-model="listQuery.isClear" :true-label='1' :false-label="0" />
        </el-form-item>
        <el-form-item label="是否上架：">
          <DoubleSelectBtn v-model="listQuery.published" :true-label='1' :false-label="0" />
        </el-form-item>
        <el-form-item label="是否侵权：">
          <DoubleSelectBtn v-model="listQuery.tortStatus" :true-label='1' :false-label="0" />
        </el-form-item>
        <el-form-item label="是否加入分销库：">
          <DoubleSelectBtn v-model="listQuery.isDistribution" :true-label='1' :false-label="0" />
        </el-form-item>
        <el-form-item label="分销平台：">
          <el-select v-model="listQuery.distributionPlatform" placeholder="全部" clearable filterable>
            <el-option label="冠通" value="冠通" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域：">
          <el-select v-model="listQuery.store" placeholder="全部" clearable filterable>
            <el-option v-for="item in typeList.areaList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="品类：">
          <el-cascader :props="categoryProps" v-model="listQuery.category" clearable />
        </el-form-item>
        <el-form-item label="自定义时间：">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="item in typeList.timeTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" @change="timeChange" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <RadioButtonGroup v-model="tableType" :ButtonTypes="typeList.tableTypeList" @request="getQuery" :doubleCancle="false">
      <template #1>
        <el-button @click="importData" size="mini" class="radioBtn" v-if="rolePermissionJudge('/distributionLibrary/export')">导出产品信息</el-button>
      </template>
    </RadioButtonGroup>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" use-virtual element-loading-text="数据加载中" border height="100" :header-cell-style="{ 'background-color': '#dadde3' }">
        <ProdInfoTable v-if="tableType" />
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
import DoubleSelectBtn from "./components/DoubleSelectBtn"
import { batchRemove, importExcel } from "@/api/selection/productLibrary"
import { getList, reportList, getCategoryList, getGotenWarehouseList } from "@/api/goten/distributionLibrary"
const defaultListQuery = {
  sku: '',
  isClear: '',
  published: '',
  tortStatus: '',
  isDistribution: '',
  distributionPlatform: '',
  store: '',
  category: [],
  timeType: '',
  startTime: '',
  endTime: '',
  pageIndex: 1,
  pageSize: 50,
};
export default {
  name: "distributionLibrary",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      tableType: 1,
      createTimeAndEndTime: [],
      typeList: {
        tableTypeList: [
          { label: "选品信息", value: 1 },
          { label: "任务报告", value: 0 },
        ],
        timeTypeList: [{ label: "更新", value: 2 }, { label: "创建", value: 1 }],
        areaList: []
      },
      importDialog: {
        visible: false,
        query: {},
      },
      categoryProps: {
        lazy: true,
        checkStrictly: true,
        label: 'name',
        value: 'code',
        leaf: 'isLeaf',
        async lazyLoad(node, resolve) {
          const { value, level } = node;
          const res = await getCategoryList({ code: value || '', level })
          resolve(res.data)
        }
      },
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
    DoubleSelectBtn,
  },
  created() {
    this.getTypeList()
    this.getList();
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
        const requestApi = this.tableType ? getList : reportList
        const res = await requestApi({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.totalCount;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getTypeList() {
      getGotenWarehouseList().then(res => {
        this.typeList.areaList = res.data
      })
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
      const selectSkus = selection.map(item => item.sku).join(",")
      this.importDialog = {
        visible: true,
        query: { ...this.listQuery, selectSkus }
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
</style>