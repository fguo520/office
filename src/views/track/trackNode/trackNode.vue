<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="120px">
        <el-form-item label="运输方式名称：">
          <el-select v-model="listQuery.logisticsTransportName" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.logisticsTransportNameList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输类型：">
          <el-select v-model="listQuery.transportType" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.transportTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人：">
          <el-select v-model="listQuery.createUser" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.createUserList" :key="index" :label="item.nickName" :value="item.id">
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

      <el-button @click="handAdd()" size="mini" type="primary" v-if="rolePermissionJudge('/trackNode/add')">新增物流方式</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="序号" align="center" type="index" width="100" />
        <u-table-column label="运输方式名称" align="center" width="300">
          <template slot-scope="scope">
            <div><span v-copy="scope.row.logisticsTransportName">{{scope.row.logisticsTransportName}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="运输类型" align="center" width="130">
          <template slot-scope="scope">
            <div><span v-copy="handType(scope.row.transportType)">{{handType(scope.row.transportType)}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="物流时长(天)" align="center" width="130">
          <template slot-scope="scope">
            <div><span v-copy="scope.row.logisticsTime">{{scope.row.logisticsTime}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="130">
          <template slot-scope="scope">
            <div><span v-copy="scope.row.dataStatus" :style="scope.row.dataStatus=='启用'?'color:green':'color:red'">{{scope.row.dataStatus}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="创建人&时间" align="center" width="180">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div><span v-copy="scope.row.nickName">{{scope.row.nickName}}</span></div>
              <div><span>{{scope.row.createTime}}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="物流信息" align="center" min-width="400">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="'待出库状态：'+scope.row.waitOutStockStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.waitOutStockStatus">{{scope.row.waitOutStockStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'已揽收状态：'+scope.row.collectStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.collectStatus">{{scope.row.collectStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'已交航状态：'+scope.row.handoverStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.handoverStatus">{{scope.row.handoverStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'运输中状态：'+scope.row.transportStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.transportStatus">{{scope.row.transportStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'目的地状态：'+scope.row.destinationStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.destinationStatus">{{scope.row.destinationStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'已妥投状态：'+scope.row.servedStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.servedStatus">{{scope.row.servedStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'轨迹超时状态：'+scope.row.trajectoryTimeoutStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.trajectoryTimeoutStatus">{{scope.row.trajectoryTimeoutStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'可能异常状态：'+scope.row.errorStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.errorStatus">{{scope.row.errorStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'包裹退回状态：'+scope.row.parcelReturnedStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.parcelReturnedStatus">{{scope.row.parcelReturnedStatus}}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'投递失败状态：'+scope.row.deliveryFailedStatus" placement="left">
                <div class="tooltipClass"><span v-copy="scope.row.deliveryFailedStatus">{{scope.row.deliveryFailedStatus}}</span></div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" v-if="rolePermissionJudge('/trackNode/add')" @click="handleupdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" v-if="rolePermissionJudge('/trackNode/status')" @click="upadteStatus(scope.row)" size="mini" :style="scope.row.dataStatus=='启用'?'color:red':'color:#52c41a'">{{ scope.row.dataStatus=='停用'?"启用":"停用" }}</el-button>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <AddDialog :addDialog="addDialog" :visible.sync="addDialog.visible" :typeList="typeList" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import { LogView, TabelPageLayout, ScrollSelect, ShrinkCard, NumberInput } from "@/components";
import { getListPage, adminUserList, getTransportNameList, searchLogisticsLogPage, delLogisticsNode } from "@/api/track/trackNode"
import AddDialog from "./components/AddDialog"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  createUser: "",
  transportType: null,
  logisticsTransportName: ""
};
export default {
  name: "trackNode",
  components: { LogView, TabelPageLayout, ScrollSelect, ShrinkCard, NumberInput, AddDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        transportTypeList: [{ label: "空运", value: 1 }, { label: "陆运", value: 2 }, { label: "海运", value: 3 }, { label: "快递", value: 4 }, { label: "邮政小包", value: 5 }, { label: "专线小包", value: 6 }],
        createUserList: [],
        logisticsTransportNameList: [],
      },
      addDialog: {
        visible: false,
        title: "",
        rows: {}
      },
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: searchLogisticsLogPage,
        param: {
          id: "",
          sourceType: 1
        },
      },
    }
  },
  created() {
    this.getList();
    this.getType()
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  computed: {
    handType() {
      return function (type) {
        const item = this.typeList.transportTypeList.find(i => { return i.value == type }) || {}
        return item.label || ''
      }
    }
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getListPage({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await Promise.all([adminUserList(), getTransportNameList()])
      this.typeList.createUserList = res[0].data
      this.typeList.logisticsTransportNameList = res[1].data.transportNameList
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1
      }
      this.getList();
    },
    handAdd() {
      this.addDialog = {
        visible: true,
        title: "新增物流节点",
        rows: {}
      }
    },
    handleupdate(row) {
      this.addDialog = {
        visible: true,
        title: "编辑物流节点",
        rows: { ...row }
      }
    },
    upadteStatus(row) {
      this.$confirm(`请确认是否${row.dataStatus == '启用' ? '停用' : '启用'} ${row.logisticsTransportName} 物流节点。${row.status ? '停用后物流节点将无法使用。' : ''}`, `${row.dataStatus == '启用' ? '停用' : '启用'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLogisticsNode({ id: row.id, status: row.dataStatus == '启用' ? -1 : 1 }).then(res => {
          if (res.code === 200) {
            this.$message({ type: "success", message: res.data })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
  }
}
</script>