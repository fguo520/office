<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="渠道名称:">
          <el-input clearable v-model="listQuery.platformAs" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="授权人员:">
          <el-select v-model="listQuery.buyPerson" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.buyPersonList" :key="index" :label="item.nickName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型:">
          <el-select v-model="listQuery.accountType" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.accountTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态:">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态：">
          <div style="width:193px;">
            <el-button @click="conditions({ isEnable: 0 })" :type="buttonType('isEnable', 0)" size="mini">禁用</el-button>
            <el-button @click="conditions({ isEnable: 1 })" :type="buttonType('isEnable', 1)" size="mini">启用</el-button>
          </div>
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
      <el-button type="primary" size="mini" @click="handSave()" v-if="rolePermissionJudge('/sysImpower1688/add')">添加</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="序号" type="index" align="center" width="50" />
        <u-table-column label="渠道名称" align="center" width="200">
          <template #default="{ row }">
            <div v-copy="row.platform">{{ row.platform }}</div>
          </template>
        </u-table-column>
        <u-table-column label="渠道别名" align="center" width="200">
          <template #default="{ row }">
            <div v-copy="row.platformAs">{{ row.platformAs }}</div>
          </template>
        </u-table-column>
        <u-table-column label="赛盒映射别名" align="center" width="200">
          <template #default="{ row }">
            <div v-copy="row.platformAsSh">{{ row.platformAsSh }}</div>
          </template>
        </u-table-column>
        <u-table-column label="启用状态" align="center" width="120">
          <template #default="{ row }">
            <div :style="{color:isStatusColor(row.isEnable).color}">{{ isStatusColor(row.isEnable).text }}</div>
          </template>
        </u-table-column>
        <u-table-column label="授权状态" align="center" width="120">
          <template #default="{ row }">
            <div :style="{color:isStatus(row.status).color}">{{isStatus(row.status).text}}</div>
          </template>
        </u-table-column>
        <u-table-column label="授权人员" align="center" width="200">
          <template #default="{ row }">
            <div v-copy="row.buyPersonName">{{ row.buyPersonName }}</div>
          </template>
        </u-table-column>
        <u-table-column label="授权账号" align="center" width="180">
          <template #default="{ row }">
            <div v-copy="row.resourceOwener">{{ row.resourceOwener }}</div>
          </template>
        </u-table-column>
        <u-table-column label="下单支付宝账号" align="center" width="180">
          <template #default="{ row }">
            <div v-copy="row.alipayAccount">{{ row.alipayAccount }}</div>
          </template>
        </u-table-column>
        <u-table-column label="账号类型" align="center" width="120">
          <template #default="{ row }">
            <div>{{ row.accountType===0 ?"母账号":"子账号"}}</div>
          </template>
        </u-table-column>

        <u-table-column label="创建时间" align="center" width="180">
          <template #default="{ row }">
            <div>{{ row.createTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" min-width="300">
          <template slot-scope="scope">
            <el-button type="text" @click="handleimpoer(scope.row)" size="mini" v-if="scope.row.isEnable===1">授权</el-button>
            <el-button type="text" @click="handUpdate(scope.row.id)" size="mini" v-if="scope.row.status===1&&scope.row.isEnable===1">刷新授权</el-button>
            <el-button type="text" @click="handSave(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" @click="handDel(scope.row.id)" size="mini">删除</el-button>
            <el-popconfirm :title="`是否将该渠道变为${scope.row.isEnable === 1 ? '停用' : '启用'}状态`" @confirm="updateState(scope.row)">
              <el-button slot="reference" size="mini" type="text" :style="scope.row.isEnable === 1?'color:#FF0000':'color:#67C23A'">
                {{ scope.row.isEnable === 1 ? '停用' : '启用' }}
              </el-button>
            </el-popconfirm>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <AddDialog :rows="addDialog.rows" :visible.sync="addDialog.visible" :isElse="addDialog.isElse" :typeList="typeList" @request="getList" />
    <Auth :visible.sync="authDialogaVisible" @message="authorizationMessage" :id="authorizationId" />
  </TabelPageLayout>
</template>
<script>
import { getLm1688PlatformList, getBuyPersonList, deleteLm1688Platform, updateIsEnable, refreshToken ,getLoglist} from "@/api/common/sysImpower1688";
import { LogView, TabelPageLayout, ShrinkCard, ScrollSelect } from "@/components";
import AddDialog from "./components/AddDialog";
import Auth from "./components/Auth";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  platformAs: "",
  isEnable: null,
  accountType: null,
  buyPerson: "",
  status: null,
  timeType: null,
  startTime: "",
  endTime: ""
};

export default {
  name: "sysImpower1688",
  components: {
    LogView, TabelPageLayout, ShrinkCard, AddDialog, ScrollSelect, Auth
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      addDialog: {
        rows: {},
        visible: false,
        isElse: false
      },
      createTimeAndEndTime: [],
      typeList: {
        accountTypeList: [{ label: "母账号", value: 0 }, { label: "子账号", value: 1 },],
        buyPersonList: [],
        statusList: [{ label: "待授权", value: 0 }, { label: "授权成功", value: 1 }, { label: "授权失败", value: -1 }],
        timeTypeList: [{ label: "创建", value: 1 }, { label: "更新", value: 2 }]
      },
      authDialogaVisible: false,
      authorizationId: "",
      LogDialogVisible:false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operateType", width: "150" },
          { label: "操作人", property: "operatorName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getLoglist,
        param: {
          id: "",
          logType: 2,
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
    buttonType() {
      const { listQuery } = this;
      return function (key, value) {
        if (listQuery[key] === "") return "";
        return listQuery[key] === value ? "primary" : "";
      };
    },
    isStatusColor() {
      return function (type) {
        switch (type) {
          case 0:
            return { color: "#FF0000", text: "停用" };
          case 1:
            return { color: "#67C23A", text: "启用" };
        }
      };
    },
    isStatus() {
      return function (type) {
        switch (type) {
          case 0:
            return { color: "#606266", text: "待授权" };
          case -1:
            return { color: "#FF0000", text: "授权失败" };
          case 1:
            return { color: "#67C23A", text: "授权成功" };
        }
      };
    },
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
        const res = await getLm1688PlatformList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getBuyPersonList()
      this.typeList.buyPersonList = res.data
    },
    async handSave(row) {
      const rows = row ? row : {};
      this.addDialog = {
        rows: rows,
        visible: true,
        isElse: row ? false : true
      }
    },
    handDel(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLm1688Platform({ id: id }).then(res => {
          this.$message({
            type: 'success',
            message: res.data
          });
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async updateState(row) {
      const res = await updateIsEnable({ id: row.id })
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: res.data
        })
        this.getList()
      }
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = []
      } else {
        this.listQuery.pageNum = 1
      }
      this.getList();
    },
    conditions(obj) {
      if (obj instanceof Object) {
        // 已选中在点击取消取消
        if (this.listQuery[Object.keys(obj)[0]] === Object.values(obj)[0]) {
          this.listQuery[Object.keys(obj)[0]] = "";
        } else {
          this.listQuery = Object.assign(this.listQuery, obj);
        }
        this.getList();
      }
    },
    authorizationMessage(message) {
      this.$message(message);
      this.authorizationId = "";
      if (message.type !== "") this.getList();
    },
    handleimpoer(row) {
      this.authorizationId = row.id;
      this.authDialogaVisible = true;
    },
    async handUpdate(id) {
      const res = await refreshToken({ id: id })
      this.$message({
        type: 'success',
        message: res.data
      });
      this.getList()
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
  }
}
</script>