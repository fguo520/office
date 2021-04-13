<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="产品状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:3px;">
      <el-button @click="handAdd" size="mini" type="primary" v-if="rolePermissionJudge('/rtsRates/add')">新增配置</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="编号" align="center" width="100">
          <template slot-scope="scope">
            <div><span>{{scope.row.id}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="产品单价RMB" align="center">
          <template slot-scope="scope">
            <div><span>{{scope.row.unitPriceDivide}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="起订量" align="center">
          <template slot-scope="scope">
            <div><span>{{scope.row.productNum}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="费率" align="center">
          <template slot-scope="scope">
            <div><span>{{scope.row.priceMultiple}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="附加费USD" align="center">
          <template slot-scope="scope">
            <div><span>{{scope.row.addPrice}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div><span :style="scope.row.status?'color:#67C23A':'color:#FF0000'">{{ scope.row.status ? '启用' : '停用' }}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="创建人" align="center">
          <template slot-scope="scope">
            <div><span>{{scope.row.createUserName}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center">
          <template slot-scope="scope">
            <div><span v-if="scope.row.createTime">创建：</span>{{scope.row.createTime}}</div>
            <div><span v-if="scope.row.updateTime">更新：</span>{{scope.row.updateTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handAdd(scope.row)">
              编辑
            </el-button>
            <el-popconfirm :title="`是否将该渠道变为${scope.row.status ? '停用' : '启用'}状态`" @confirm="updateState(scope.row)">
              <el-button slot="reference" size="mini" type="text" :style="scope.row.status ?'color:#FF0000':'color:#67C23A'">
                {{ scope.row.status  ? '停用' : '启用' }}
              </el-button>
            </el-popconfirm>
            <el-button size="mini" type="text" @click="handlejournal(scope.row.id)">
              日志
            </el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <AddDialog :visible.sync="addList.addDialog" :addList="addList" @request="getList" />
  </TabelPageLayout>
</template>
<script>
import { list, log, save } from "@/api/rts/rtsRates"
import {
  LogView,
  ScrollSelect,
  TabelPageLayout,
  NumberInput,
  ShrinkCard
} from "@/components";
import AddDialog from "./components/AddDialog"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  status: null
}
const defaultAddData = {
  addPrice: null,
  priceMultiple: null,
  productNum: null,
  unitPriceDivide: null,
  id: null
}
export default {
  name: "rtsRates",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        statusList: [
          { label: "启用", value: 1 },
          { label: "停用", value: 0 },
        ]
      },
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "content", width: "150" },
          { label: "操作人", property: "createUserName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "errorDesc", tooltip: true },
        ],
        request: log,
        param: {
          id: "",
        },
      },
      addList: {
        addDialog: false,
        addData: {},
        title: ""
      }

    }
  },
  components: {
    LogView,
    ScrollSelect,
    TabelPageLayout,
    NumberInput,
    ShrinkCard,
    AddDialog
  },
  created() {
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
        this.listQuery.pageNum = 1
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await list(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    async updateState(row) {
      const res = await save({ id: row.id, status: row.status ? 0 : 1 })
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: res.data
        })
        this.getList()
      }
    },
    async handAdd(row) {
      this.addList.addDialog = true
      this.addList.addData = row ? {
        addPrice: row.addPrice,
        priceMultiple: row.priceMultiple,
        productNum: row.productNum,
        unitPriceDivide: row.unitPriceDivide,
        id: row.id
      } : Object.assign({}, defaultAddData);
      this.addList.title = row ? "编辑配置" : "新增配置";
      console.log(this.addList)
    }
  }
}
</script>