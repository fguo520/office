<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="平台:">
          <el-select v-model="listQuery.orderSourceTypeName" placeholder="全部" size="mini" clearable class="input-width" filterable @change="orderSourceTypeNameChange">
            <el-option v-for="(item, index) in typeList.orderSourceTypeNameList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门:" v-if="listQuery.orderSourceTypeName=='amazon'">
          <el-select v-model="listQuery.department" placeholder="全部" size="mini" clearable class="input-width" filterable @change="orderSourceTypeNameChange">
            <el-option v-for="(item, index) in typeList.departmentList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号:">
          <el-select v-model="listQuery.storeNameAs" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.storeNameAsList" :key="index" :label="item.storeNameAs" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站点:">
          <el-select v-model="listQuery.publishedTo" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.publishedToList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="刊登时间:">
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="SKU" align="center" width="150">
          <template slot-scope="scope">
            <i v-copy="scope.row.sku" class="el-icon-document-copy" />
            <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
              {{ scope.row.sku }}
            </el-link>
          </template>
        </u-table-column>
        <u-table-column label="平台" align="center" width="150">
          <template slot-scope="scope">
            <div v-copy="scope.row.orderSourceTypeName">{{scope.row.orderSourceTypeName}}</div>
          </template>
        </u-table-column>
        <u-table-column label="账号" align="center" width="200">
          <template slot-scope="scope">
            <div v-copy="scope.row.storeNameAs">{{scope.row.storeNameAs}}</div>
          </template>
        </u-table-column>
        <u-table-column label="类目" align="center">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="scope.row.className" placement="left">
                <div v-copy="scope.row.className" class="tooltipClass">{{scope.row.className}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="中文名称" align="center">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="scope.row.productNameCN" placement="left">
                <div v-copy="scope.row.productNameCN" class="tooltipClass">{{scope.row.productNameCN}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="刊登成功数量" align="center" width="150">
          <template slot-scope="scope">
            <div v-copy="scope.row.num">{{scope.row.num}}</div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput } from "@/components";
import { list, getOrderSourceTypeName, getPlatformChannelAuth, getPublishedTo } from '@/api/Im/excelPublish';
import { formatDate } from '@/utils/date'
const defaultListQuery = {
  pageNum: 1, pageSize: 50, orderSourceTypeName: "", publishedTo: "", storeNameAs: "", department: "",
  startTime: formatDate(new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss'),
  endTime: formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss'),
}
export default {
  name: 'excelPublish',
  components: { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      SkuNum: "",
      SkuDialogVisible: false,
      typeList: {
        orderSourceTypeNameList: [],
        publishedToList: [],
        storeNameAsList: [],
        departmentList: [{ label: "亚马逊一部", value: "A1" }, { label: "亚马逊二部", value: "A2" }, { label: "亚马逊三部", value: "A3" }, { label: "亚马逊四部", value: "A4" }, { label: "亚马逊五部", value: "A5" }, { label: "亚马逊六部", value: "A6" },]
      },
      createTimeAndEndTime: [
        formatDate(new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss'),
        formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss')
      ],
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
        this.createTimeAndEndTime = [formatDate(new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss'),
        formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss')]
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
      const res = await getOrderSourceTypeName()
      this.typeList.orderSourceTypeNameList = res.data
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    async orderSourceTypeNameChange(value) {
      this.listQuery.publishedTo = ""
      this.listQuery.storeNameAs = ""
      const res = await Promise.all([getPlatformChannelAuth({ platform: value }), getPublishedTo({ platform: value })])
      this.typeList.storeNameAsList = res[0].data
      this.typeList.publishedToList = res[1].data
    }
  }
}
</script>