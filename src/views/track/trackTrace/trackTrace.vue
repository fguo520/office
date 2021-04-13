<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="120px">
        <el-form-item label="单号查询:">
          <el-select v-model="listQuery.batchSearchType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.batchSearchTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <TextareaInput v-model="listQuery.batchSearchValue" />
        </el-form-item>
        <el-form-item label="平台:">
          <el-select v-model="listQuery.ordersourcetypename" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.ordersourcetypenameList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输方式名称：">
          <el-select v-model="listQuery.transportname" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.transportnameList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输类型:">
          <el-select v-model="listQuery.transportType" placeholder="全部" size="mini" filterable>
            <el-option v-for="(item, index) in typeList.transportTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="目的国家:">
          <el-input v-model="listQuery.ordercountry" clearable size="mini" placeholder="模糊搜索"></el-input>
        </el-form-item>
        <el-form-item label="发货仓库:">
          <TreeSelect v-model="listQuery.warehousename" :prop="{label:'warehousename',value:'warehousename'}" :list="typeList.wareHouseNameList" />
        </el-form-item>
        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.timeSearchType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeSearchTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.packagestatus" :ButtonTypes="states" @request="getList" :doubleCancle="false" />
    <div>
      
      <el-button @click="exportexcel()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/trackTrace/dowm')">自定义下载</el-button>
      <el-button @click="handTask()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/trackTrace/task')">任务报告</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="index" width="80" label="序号" align="center" />
        <u-table-column label="运输类型&方式名称" align="center" min-width="300">
          <template slot-scope="scope">
            <div style="text-align: left;">
              <div v-copy="handType(scope.row.transportType)">{{handType(scope.row.transportType)}}</div>
              <div v-copy="scope.row.transportname">{{scope.row.transportname}}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="平台&店铺" align="center" width="250">
          <template slot-scope="scope">
            <div v-copy="scope.row.ordersourcetypename">{{scope.row.ordersourcetypename}}</div>
            <div v-copy="scope.row.ordersourcename">{{scope.row.ordersourcename}}</div>
          </template>
        </u-table-column>
        <u-table-column label="发货仓库" align="center" width="250">
          <template slot-scope="scope">
            <div v-copy="scope.row.warehousename">{{scope.row.warehousename}}</div>
          </template>
        </u-table-column>
        <u-table-column label="订单&跟踪号" align="center" width="300">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div v-copy="scope.row.ordercode">{{scope.row.ordercode}}</div>
              <el-link :href="scope.row.url" target="_blank" type="primary" :underline="false"> {{ scope.row.tracknumbers }} </el-link>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="目的国家&时效" align="center" width="150">
          <template slot-scope="scope">
            <div v-copy="scope.row.ordercountry">{{scope.row.ordercountry}}</div>
            <div v-copy="scope.row.transportTime">{{scope.row.transportTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="包裹状态" align="center" width="150">
          <template slot-scope="scope">
            <div v-copy="scope.row.packagestatus" style="color:green">{{scope.row.packagestatus}}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="220">
          <template slot-scope="scope">
            <div><span v-show="scope.row.shiptime">发货：</span>{{scope.row.shiptime}}</div>
            <div><span v-show="scope.row.collectiontime">揽收：</span>{{scope.row.collectiontime}}</div>
            <div><span v-show="scope.row.submissiontime">签收：</span>{{scope.row.submissiontime}}</div>
            <div><span v-show="scope.row.dwdUpdateDate">更新：</span>{{scope.row.dwdUpdateDate}}</div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <ExportExcel :typeList="typeList" :visible.sync="exportDialog.visible" :states="states" @request="getList" />
    <TaskDialog :visible.sync="task.visible" @request="getList" />
  </TabelPageLayout>
</template>
<script>
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  batchSearchType: 1,
  batchSearchValue: [],
  transportname: "",
  ordercountry: "",
  ordersourcetypename: "",
  warehousename: [],
  timeSearchType: 1,
  transportType:null,
  startTime: formatDate(new Date(new Date().getTime() - 168 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss'),
  endTime: formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss'),
  packagestatus: "已揽收"
}
import { getListPage, getTransportNameList } from "@/api/track/trackTrace"
import { treeWareHouseName } from "@/api/wms/wareList";
import { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, TreeSelect, } from "@/components";
import ExportExcel from "./components/ExportExcel"
import TaskDialog from "./components/TaskDialog"
import { formatDate } from '@/utils/date'
export default {
  name: "trackTrace",
  components: { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, TreeSelect, ExportExcel, TaskDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        batchSearchTypeList: [{ label: "订单号", value: 1 }, { label: "跟踪号", value: 2 }],
        transportnameList: [],
        timeSearchTypeList: [{ label: "发货", value: 1 }, { label: "揽收", value: 2 }, { label: "签收", value: 3 }],
        transportTypeList: [{ label: "物流轨迹未匹配", value: 0 }, { label: "空运", value: 1 }, { label: "陆运", value: 2 }, { label: "海运", value: 3 }, { label: "快递", value: 4 }, { label: "邮政小包", value: 5 }, { label: "专线小包", value: 6 },],
        wareHouseNameList: [],
        ordersourcetypenameList: []
      },
      states: [
        { label: "全部", value: "" }, { label: "待出库", value: "待出库" }, { label: "已揽收", value: "已揽收" }, { label: "已交航", value: "已交航" }, { label: "运输中", value: "运输中" }, { label: "目的地", value: "目的地" }, { label: "已妥投", value: "已妥投" }, { label: "轨迹超时", value: "轨迹超时" }, { label: "可能异常", value: "可能异常" }, { label: "包裹退回", value: "包裹退回" }, { label: "投递失败", value: "投递失败" }
      ],
      createTimeAndEndTime: [
        formatDate(new Date(new Date().getTime() - 168 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss'),
        formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss')
      ],
      exportDialog: {
        visible: false
      },
      task: {
        visible: false
      },
    }
  },
  created() {
    this.getList();
    this.getType()
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  computed: {
    handType() {
      return function (type) {
        if (type == null) {
          return "物流轨迹未匹配"
        } else {
          return this.typeList.transportTypeList.find(i => { return i.value == type }).label
        }

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
    async getList() {
      this.listLoading = true;
      try {
        const ordercountry = this.listQuery.ordercountry.trim()
        const res = await getListPage({ ...this.listQuery, ordercountry });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      treeWareHouseName().then(res => {
        this.typeList.wareHouseNameList = res.data;
      });
      getTransportNameList().then(res => {
        this.typeList.transportnameList = res.data.transportNameList
        this.typeList.ordersourcetypenameList = res.data.platformList
      })

    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = [];
      } else {
        this.listQuery.pageNum = 1
      }
      this.getList();
    },
    exportexcel() {
      this.exportDialog.visible = true
    },
    handTask() {
      this.task.visible = true
    }
  }
}

</script>
<style lang="scss" scoped>
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}
</style>