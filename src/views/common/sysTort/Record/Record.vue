<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="SKU:">
          <TextareaInput v-model="listQuery.sku" />
        </el-form-item>
        <el-form-item label="侵权平台:">
          <el-select v-model="listQuery.platform" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="侵权类型:">
          <el-select v-model="listQuery.tortType" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.tortTypeList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态:">
          <el-select v-model="listQuery.productState" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statuslList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称:">
          <el-select v-model="listQuery.productNameType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.productNameTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-model="listQuery.productNameValue" placeholder="支持模糊查询" size="mini" clearable style="width:193px" />
        </el-form-item>
        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <!-- v-if="rolePermissionJudge('/trackNode/add')" -->
      <el-button @click="handAdd()" size="mini" type="primary">新增</el-button>
      <el-button @click="excelVisible=true" size="mini" type="primary">导入</el-button>
      <el-button @click="handDown()" size="mini" type="primary">下载</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" />
        <u-table-column label="SKU" align="center" width="150">
          <template slot-scope="scope">
            <i v-copy="scope.row.sku" class="el-icon-document-copy" />
            <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
              {{ scope.row.sku }}
            </el-link>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.imageUrl" style="width: 100px" />
            <div :style="getProductstate(scope.row.productState)">
              {{ scope.row.productState }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" min-width="200">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'分类:'+scope.row.fullClassNameEn" placement="left">
                <div v-copy="scope.row.fullClassNameEn" class="tooltipClass"> {{scope.row.fullClassNameEn}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'中文名称:'+scope.row.productNameCn" placement="left">
                <div v-copy="scope.row.productNameCn" class="tooltipClass">{{scope.row.productNameCn}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'英文名称:'+scope.row.productName" placement="left">
                <div v-copy="scope.row.productName" class="tooltipClass">{{scope.row.productName}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品详情" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'平台:'+handPlatform(scope.row.platform)" placement="left">
                <div v-copy="scope.row.platform">{{handPlatform(scope.row.platform)}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'站点:'+scope.row.country" placement="left">
                <div v-copy="scope.row.country" class="tooltipClass">{{scope.row.country}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'店铺:'+scope.row.storeName" placement="left">
                <div v-copy="scope.row.storeName">{{scope.row.storeName}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作人员" align="center" width="130">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'开发:'" placement="left">
                <div v-copy="scope.row.developAdminName">{{scope.row.developAdminName}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'采购:'" placement="left">
                <div v-copy="scope.row.buyerName">{{scope.row.buyerName}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'销售:'" placement="left">
                <div v-copy="scope.row.saleName">{{scope.row.saleName}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="侵权类型&描述" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'类型:'" placement="left">
                <div v-copy="scope.row.tortType">{{scope.row.tortType}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'描述:'+scope.row.tortDescribe" placement="left">
                <div class="tooltipClass" v-copy="scope.row.tortDescribe">{{scope.row.tortDescribe}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div><span v-show="scope.row.tortTime">侵权：</span>{{ scope.row.tortTime }}</div>
            <div><span v-show="scope.row.createTime">添加：</span>{{ scope.row.createTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <!-- v-if="rolePermissionJudge('/financeCost/look')" -->
            <el-button type="text" @click="editor(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <AddDialog :addDialog="addDialog" :visible.sync="addDialog.visible" :typeList="typeList" @request="getList" />
    <ExcelDialog :visible.sync="excelVisible" @request="getList" />
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <ExportDialog :visible.sync="exporttion.visible" :selectRows="exporttion.selectRows" :listQuery="exporttion.listQuery" @request="getList" />
    <LogView :config="logViewParam" :visible.sync="dialogVisible" />
  </TabelPageLayout>
</template>
<script>
const defaultListQuery = { pageNum: 1, pageSize: 50, sku: [], tortType: "", productState: "", platform: null, timeType: 1, startTime: "", endTime: "", productNameType: 1, productNameValue: "" }
import { list, getDropDown, getTortRecordLogList } from "@/api/common/sysTort"
import { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput } from "@/components";
import AddDialog from "../components/AddDialog"
import ExcelDialog from "../components/ExcelDialog"
import ExportDialog from "../components/ExportDialog"
export default {
  name: "Record",
  components: { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, AddDialog, ExcelDialog, ExportDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      SkuNum: "",
      SkuDialogVisible: false,
      typeList: {
        tortTypeList: [],
        statuslList: ["正常", "停产", "锁定", "起批量", "暂时缺货", "清库"],
        platformList: [],
        productNameTypeList: [{ label: "中文名称", value: 1 }, { label: "英文名称", value: 2 }],
        timeTypeList: [{ label: "侵权", value: 1 }, { label: "添加", value: 2 }]
      },
      createTimeAndEndTime: [],
      addDialog: {
        visible: false,
        title: "",
        rows: {}
      },
      excelVisible: false,
      exporttion: {
        visible: false,
        selectRows: [],
        listQuery: {}
      },
      dialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "operationPerson", width: "120" },
          { label: "操作时间", property: "operationTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getTortRecordLogList,
        param: {
          manageId: "",
        },
      },
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
  computed: {
    getProductstate() {
      return function (type) {
        switch (type) {
          case "正常":
            return { backgroundColor: "#16c067", color: "#fff" };
          case "起批量":
            return { backgroundColor: "#00b0f5", color: "#fff" };
          case "暂时缺货":
            return { backgroundColor: "#d4c80a", color: "#fff" };
          case "清库":
            return { backgroundColor: "#fb9320", color: "#fff" };
          case "锁定":
            return { backgroundColor: "#a3a3a3", color: "#fff" };
          case "停产":
            return { backgroundColor: "#e0514d", color: "#fff" };
          default:
            return { backgroundColor: "#e0514d", color: "#fff" };
        }
      };
    },
    handPlatform() {
      return function (type) {
        return this.typeList.platformList.find(i => { return i.code == type }).name
      }
    }
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  methods: {
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = []
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
      const res = await getDropDown()
      this.typeList.platformList = res.data.platform
      this.typeList.tortTypeList = res.data.tortRecordType
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    handAdd() {
      this.addDialog = {
        visible: true,
        title: "新增",
        rows: {}
      }
    },
    editor(row) {
      this.addDialog = {
        visible: true,
        title: "编辑",
        rows: { ...row }
      }
    },
    handDown() {
      const selection = this.$refs.tableContainer.$refs.singleTable.selection;
      this.exporttion = {
        selectRows: selection,
        visible: true,
        listQuery: this.listQuery
      }
    },
    handlejournal(params) {
      this.logViewParam.param.manageId = params;
      this.dialogVisible = true;
    },
  },
}
</script>