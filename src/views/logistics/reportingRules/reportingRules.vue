<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="130px">
        <el-form-item label="规则名称:">
          <el-input v-model="listQuery.ruleName" style="width:193px;" placeholder="支持模糊搜索" />
        </el-form-item>
        <el-form-item label="服务商名称:">
          <el-select v-model="listQuery.serviceProviderName" placeholder="全部" size="mini" clearable filterable style="width:193px" @change="serviceProviderChange">
            <el-option v-for="(item, index) in typeList.serviceList" :key="index" :label="item.logisticsServeiceName" :value="item.logisticsServeiceName" />
          </el-select>
        </el-form-item>
        <el-form-item label="运输方式名称:">
          <ScrollSelect v-model="listQuery.transportMethod" :list="typeList.transportList" placeholder="可多选" :no-data-text="listQuery.serviceProviderName!==''?'该服务商暂无运输方式':'请先选择服务商名称'" />
        </el-form-item>
        <el-form-item label="状态:">
          <div style="width:193px;">
            <el-button @click="conditions({ status: 1 })" :type="buttonType('status', 1)" size="mini">
              启用
            </el-button>
            <el-button @click="conditions({ status: 0 })" :type="buttonType('status', 0)" size="mini">
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
      <el-button class="radioBtn" size="mini" @click="handleAddReportRules()">新增</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" :border="true" height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="expand">
          <template #default="{ row }">
            <ExpanTable :parantRow="row" :home="that" />
          </template>
        </u-table-column>
        <u-table-column label="规则名称" align="center" prop="ruleName">
          <template #default="{ row }">
            <div v-copy="row.ruleName">{{ row.ruleName }}</div>
          </template>
        </u-table-column>
        <u-table-column label="币种" align="center" width="150" prop="currency" />
        <u-table-column label="绑定运输方式" align="center" width="300" prop="transportMethod" />
        <u-table-column label="状态" align="center" width="100" prop="status">
          <template #default="{ row }">
            <div :style="{ color: row.status === '1'? '#52c41a' : 'red' }">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="400">
          <template #default="{ row }">
            <div style="text-align:center;">
              <div>创建：{{ row.createTime }}</div>
              <div>更新：{{ row.updateTime }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="400">
          <template #default="{ row }">
            <div style="white-space: normal;">
              <el-button type="text" size="mini" @click="handleAddReportRules(row, true)">查看</el-button>
              <el-button type="text" size="mini" @click="handleAddReportRules(row)">编辑</el-button>
              <el-popconfirm :title="`确定${row.status === '1' ? '停用' : '启用'}此服务商吗？`" @confirm="handleStatus(row)">
                <el-button slot="reference" size="mini" type="text" :style="{ color:row.status === '1'?'red':'#3b9e70', marginLeft:'10px' }">
                  {{ row.status === '1' ? '停用' : '启用' }}
                </el-button>
              </el-popconfirm>
              <el-button size="mini" type="text" @click="handlejournal(row.id)">日志</el-button>

            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <AddReportRulesDialog :visible.sync="addReportRules.visible" :row="addReportRules.row" :readonly="addReportRules.readonly" :typeList="typeList" @callBack="addReportCallBack" />
    <LogView :config="logViewParam" :visible.sync="logDialogVisible" />
  </TabelPageLayout>
</template>

<script>
import { page, getServiceProvider, getCurrency, getCountry, updateStatus, searchLogisticsLogPage } from "@/api/logistics/reportingRules"
import { SkuInfoView, LogView, TabelPageLayout, ShrinkCard, ScrollSelect } from "@/components";
import ExpanTable from './components/ExpanTable'
import AddReportRulesDialog from './components/AddReportRulesDialog'

const defaultListQuery = {
  ruleName: '',
  serviceProviderName: '',
  transportMethod: [],
  status: '',
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: 'serviceProvider',
  components: {
    SkuInfoView,
    LogView,
    TabelPageLayout,
    ShrinkCard,
    ScrollSelect,
    ExpanTable,
    AddReportRulesDialog
  },
  data() {
    return {
      that: this,
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        serviceList: [],
        transportList: [],
        currencyList: [],
        countryList: [],
        currencyTypeList: Object.freeze([
          { label: '采购单价', value: '采购单价' },
          { label: '订单金额(含运费)的', value: '订单金额(含运费)的' },
          { label: '订单金额(不含运费)的', value: '订单金额(不含运费)的' },
        ]),
      },
      addReportRules: {
        visible: false,
        row: null,
        readonly: false
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
          sourceType: 6,
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
      try {
        const transportMethod = this.listQuery.transportMethod.join()
        const res = await page({ ...this.listQuery, transportMethod });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getSearchType() {
      getServiceProvider().then(res => {
        this.typeList.serviceList = Object.freeze(res.data)
      })
      getCurrency().then(res => {
        this.typeList.currencyList = Object.freeze(res.data)
      })
      getCountry().then(res => {
        this.typeList.countryList = Object.freeze(res.data)
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
    serviceProviderChange() {
      const { serviceProviderName } = this.listQuery;
      const findItem = this.typeList.serviceList.find(item => item.logisticsServeiceName === serviceProviderName) || {}
      const transportList = findItem.list || []
      this.typeList.transportList = transportList
    },
    handleAddReportRules(row, readonly = false) {
      this.addReportRules = {
        visible: true,
        row,
        readonly
      }
    },
    async handleStatus(row) {
      try {
        const status = row.status === '1' ? '0' : '1'
        const res = await updateStatus({
          id: row.id,
          status: status
        })
        this.$message.success(res.data)
        row.status = status
      } catch (error) { }
    },
    addReportCallBack(callBackRow) {
      let { row } = this.addReportRules
      if (row) {
        row = Object.assign(row, callBackRow)
        return
      }
      this.list.splice(0, 0, callBackRow)
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
