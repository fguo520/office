<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="130px">
        <el-form-item label="服务商名称:">
          <el-select v-model="listQuery.logisticsServeiceName" placeholder="全部" size="mini" clearable filterable style="width:193px" @change="logisticsChange">
            <el-option v-for="(item, index) in typeList.serviceList" :key="index" :label="item.logisticsServeiceName" :value="item.logisticsServeiceName" />
          </el-select>
        </el-form-item>
        <el-form-item label="运输方式中文名称:">
          <ScrollSelect v-model="listQuery.transportationNameCn" :list="typeList.transportList" placeholder="可多选" :no-data-text="listQuery.logisticsServeiceName!==''?'该服务商暂无运输方式':'请先选择服务商名称'" :prop="{label:'transportationNameCn', value:'transportationNameCn'}" />
        </el-form-item>
        <el-form-item label="服务商模式:">
          <div style="width:193px;">
            <el-button @click="conditions({ model: 1 })" :type="buttonType('model', 1)" size="mini">
              线上
            </el-button>
            <el-button @click="conditions({ model: 2 })" :type="buttonType('model', 2)" size="mini">
              线下
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="服务商类型:">
          <el-select v-model="listQuery.logisticsType" placeholder="全部" style="width:193px" clearable filterable>
            <el-option v-for="(item, index) in typeList.serviceTypeList" :key="index" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="运输类型:">
          <el-select v-model="listQuery.transportationType" placeholder="全部" size="mini" clearable filterable style="width:193px">
            <el-option v-for="(item, index) in typeList.serviceTransportationTypeList" :key="index" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务商启用状态:">
          <div style="width:193px;">
            <el-button @click="conditions({ status: 1 })" :type="buttonType('status', 1)" size="mini">
              启用
            </el-button>
            <el-button @click="conditions({ status: 0 })" :type="buttonType('status', 0)" size="mini">
              停用
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="服务商授权状态:">
          <el-select v-model="listQuery.isAuth" placeholder="请选择" style="width:193px" clearable>
            <el-option v-for="item in typeList.serviceAuthList" :key="item.code" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="运输方式启用状态:">
          <div style="width:193px;">
            <el-button @click="conditions({ isTransportationEnable: 1 })" :type="buttonType('isTransportationEnable', 1)" size="mini">
              启用
            </el-button>
            <el-button @click="conditions({ isTransportationEnable: 0 })" :type="buttonType('isTransportationEnable', 0)" size="mini">
              停用
            </el-button>
          </div>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div>
      <el-button class="radioBtn" size="mini" @click="handleAnthDialog()">新增</el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" :border="true" height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="expand">
          <template #default="{ row }">
            <ExpanTable :parantRow="row" :home="that" />
          </template>
        </u-table-column>
        <u-table-column label="服务商代码" align="center" width="120" prop="logisticsServeiceCode">
          <template #default="{ row }">
            <el-tooltip effect="dark" :content="row.logisticsServeiceCode" placement="top">
              <span>{{ row.logisticsServeiceCode }}</span>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="服务商名称" align="center" width="150" prop="logisticsServeiceName">
          <template #default="{ row }">
            <el-tooltip effect="dark" :content="row.logisticsServeiceName" placement="top">
              <span>{{ row.logisticsServeiceName }}</span>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="服务商类型 / 服务商模式" align="center" width="300">
          <template #default="{ row }">
            <div style="color:#ff7a45;">{{ row.logisticsType === 1 ? '仓储' : '物流'}}</div>
            <div style="color:#ff7a45;">{{ row.model === 1 ? '线上' : '线下'}}</div>
          </template>
        </u-table-column>
        <u-table-column label="启用状态" align="center" width="100">
          <template #default="{ row }">
            <div :style="{ color: row.status === 1 ? '#52c41a' : 'red' }">{{ row.status === 1 ? '启用' : '停用' }}</div>
          </template>
        </u-table-column>
        <u-table-column label="授权状态" align="center" width="100">
          <template #default="{ row }">
            <div :style="{ color: getIsAuth(row.isAuth).color}">{{ getIsAuth(row.isAuth).label }}</div>
          </template>
        </u-table-column>
        <u-table-column label="授权时间" align="center" min-width="300">
          <template #default="{ row }">
            <!-- <div>创建：{{ row.createTime }}</div> -->
            <!-- <div>更新：{{ row.updateTime }}</div> -->
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="400">
          <template #default="{ row }">
            <div style="white-space: normal;">
              <el-button size="mini" type="text" @click="handleAnthDialog(row)">编辑</el-button>
              <!-- <el-popconfirm :title="`确定${row.status === 1 ? '停用' : '启用'}此服务商吗？`" @confirm="handleStatus(row)"> -->
              <el-popconfirm :title="`确定${row.status === 1 ? '停用' : '启用'}此服务商吗？`" @confirm="handleStatus(row)">
                <el-button slot="reference" size="mini" type="text" :style="{ color:row.status === 1?'red':'#3b9e70' }">
                  {{ row.status === 1 ? '停用' : '启用' }}
                </el-button>
              </el-popconfirm>

              <el-button size="mini" type="text" @click="handlejournal(row.id)">日志</el-button>
              <el-button size="mini" type="text" @click="handleTransport(row)">新增运输方式</el-button>

            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <AuthDialog :visible.sync="anthDialog.visible" :row="anthDialog.row" @request="getList" />
    <AddTransportDialog :visible.sync='addTransport.visible' :list="typeList" :row="addTransport.row" @callBack="addTransportCallBack" />
    <LogView :config="logViewParam" :visible.sync="logDialogVisible" />
  </TabelPageLayout>
</template>

<script>
import { getLogisticsServiceList, getDropDown, updateLogisticsServiceStatus, searchLogisticsLogPage } from "@/api/logistics/serviceProvider"
import { SkuInfoView, LogView, TabelPageLayout, ShrinkCard, ScrollSelect } from "@/components";
import ExpanTable from './components/ExpanTable'
import AuthDialog from './components/AuthDialog'
import AddTransportDialog from './components/AddTransportDialog'

const defaultListQuery = {
  logisticsServeiceName: '',
  transportationNameCn: [],
  model: '',
  logisticsType: '',
  transportationType: '',
  status: '',
  isAuth: '',
  isTransportationEnable: '',
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: 'serviceProvider',
  components: { SkuInfoView, LogView, TabelPageLayout, ShrinkCard, ScrollSelect, ExpanTable, AuthDialog, AddTransportDialog },
  data() {
    return {
      that: this,
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        transportList: []
      },
      anthDialog: {
        visible: false,
        row: null
      },
      addTransport: {
        visible: false,
        id: null,
      },
      logDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: searchLogisticsLogPage,
        param: {
          id: "",
          sourceType: 4,
        },
      },
    };
  },
  created() {
    this.getSearchType();
    this.getList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  computed: {
    buttonType() {
      const { listQuery } = this;
      return function (key, value) {
        if (listQuery[key] === "") return "";
        return listQuery[key] === value ? "primary" : "";
      };
    },
    getIsAuth() {
      return (state) => {
        switch (state) {
          case 0:
            return { label: '未授权', color: '#1890ff' };
          case 1:
            return { label: '已授权', color: '#7cb305' };
          case 0:
            return { label: '授权失败', color: '#cf1322' };
          default:
            return { label: '', color: '' }
        }
      }
    },
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
      const { listQuery } = this
      try {
        const transportationNameCn = listQuery.transportationNameCn.join()
        const res = await getLogisticsServiceList({ ...listQuery, transportationNameCn });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getSearchType(update) {
      getDropDown().then(res => {
        this.typeList = Object.assign(this.typeList, Object.freeze(res.data))
        if (update) this.logisticsChange()
      })
    },
    conditions(obj) {
      this.listQuery.pageNum = 1;
      if (obj instanceof Object) {
        // 已选中在点击取消取消
        if (this.listQuery[Object.keys(obj)[0]] === Object.values(obj)[0]) {
          this.listQuery[Object.keys(obj)[0]] = '';
        } else {
          this.listQuery = Object.assign(this.listQuery, obj);
        }
        this.$nextTick(() => {
          this.getList();
        });
      }
    },
    logisticsChange(reset) {
      const { logisticsServeiceName } = this.listQuery
      if (reset) this.listQuery.transportationNameCn = []
      const findItem = this.typeList.serviceList.find(item => item.logisticsServeiceName === logisticsServeiceName) || {}
      const transportList = findItem.children || []
      this.typeList.transportList = transportList
    },
    handleAnthDialog(row) {
      this.anthDialog = {
        visible: true,
        row
      }
    },
    handleTransport(row) {
      this.addTransport.visible = true
      this.addTransport.row = row
    },
    addTransportCallBack(data, row) {
      this.getSearchType('update')
      row.lmLogisticsTransportationList.push(data)
    },
    async handleStatus(row) {
      try {
        const status = row.status === 1 ? 0 : 1
        const res = await updateLogisticsServiceStatus({
          id: row.id,
          status: status
        })
        this.$message.success(res.data)
        row.status = status
      } catch (error) { }
    },
    //日志
    handlejournal(id) {
      this.logViewParam.param.id = id;
      this.logDialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table__expanded-cell:hover {
  background-color: white !important;
}
.radioBtn {
  margin-top: 2px;
  background-color: #81bef7;
  color: #fff;
}
</style>
