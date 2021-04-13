<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="平台:">
          <el-select v-model="listQuery.platformName" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in platformNameList" :key="index" :label="item.parameterValue" :value="item.parameterCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态:">
          <el-select v-model="listQuery.isAuth" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in isAuthList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道别名:">
          <el-input clearable v-model="listQuery.storeName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="渠道负责人:">
          <el-input clearable v-model="listQuery.accountOwner" size="mini"></el-input>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="handSave" v-if="rolePermissionJudge('/sys/Impower')">添加</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="平台" align="center" width="100">
          <template #default="{ row }">
            <div v-copy="row.platformName">{{ row.platformName }}</div>
          </template>
        </u-table-column>
        <u-table-column label="授权&状态" align="center" width="100">
          <template #default="{ row }">
            <div style="text-align:left">
              <div :style="{color:isAuthColor(row.isAuth),fontWeight:'bold'}">{{ row.isAuth | isAuthFilter }}</div>
              <div :style="{color:isStatusColor(row.status)}">{{ row.status | statusFilter }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="渠道" align="center" width="180">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="'渠道名称: '+row.storeName" placement="right-start">
                <div class="tooltipClass" v-copy="row.storeName">
                  {{ row.storeName }}
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'渠道别名: '+row.storeNameAs" placement="right-start">
                <div class="tooltipClass" v-copy="row.storeNameAs">{{ row.storeNameAs }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="赛盒映射别名" align="center" width="200">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="row.shAccount" placement="top">
                <div v-copy="row.shAccount" class="tooltipClass">{{ row.shAccount }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="VAT税号" align="center" width="120">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="row.vatAccount" placement="top">
                <div class="tooltipClass">{{ row.vatAccount }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="VAT税率%" align="center" width="120">
          <template #default="{ row }">
            <div class="tooltipClass">{{ row.vatTax }}</div>
          </template>
        </u-table-column>
        <u-table-column label="销售VAT税率%" align="center" width="120">
          <template #default="{ row }">
            <div v-if="row.platform=='10061'"> {{ row.vatTaxSales }}</div>
          </template>
        </u-table-column>
        <u-table-column label="汇兑损失率%" align="center" width="120">
          <template #default="{ row }">
            <div v-if="row.platform=='10376'||row.platform=='10062'||row.platform =='10057'"> {{ row.vatTaxSales }}</div>
          </template>
        </u-table-column>
        <u-table-column label="利润率%" align="center" width="120">
          <template #default="{ row }">
            <div>{{ row.profitRate}}</div>
          </template>
        </u-table-column>
        <u-table-column label="国家&币种" align="center" width="120">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="row.countryFilter" placement="top">
                <div class="tooltipClass">{{ row.country | countryFilter }}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="row.settlementCurrencyName" placement="top">
                <div class="tooltipClass">{{ row.settlementCurrencyName }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="渠道负责人" align="center" width="120">
          <template #default="{ row }">
            <div v-copy="row.accountOwner.name">{{ row.accountOwner.name }}</div>
          </template>
        </u-table-column>
        <u-table-column label="销售小组" align="center" width="120">
          <template #default="{ row }">
            <div>{{ row.accountTeam }}</div>
          </template>
        </u-table-column>
        <u-table-column label="客服人员" align="center" width="120">
          <template #default="{ row }">
            <div>{{ row.serviceAdminName }}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template #default="{ row }">
            <div v-show="row.createTime">创建: {{ row.createTime }}</div>
            <div v-show="row.expiresTime">过期: {{ row.expiresTime }}</div>
            <div v-show="row.refreshExpiresTime">刷新: {{ row.refreshExpiresTime }}</div>
            <div v-show="row.updateTime">最近: {{ row.updateTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="备注" align="center" width="150">
          <template #default="{ row }">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="row.remark" placement="top">
                <div v-copy="row.remark" class="tooltipClass">{{row.remark}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="text" @click="handleupdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" @click="handleimpoer(scope.row)" size="mini">授权</el-button>
            <el-button type="text" @click="resetImpoer(scope.row)" size="mini" v-if="scope.row.isAuth === 1 && getPlatformName(scope.row.platformName)">刷新授权</el-button>
            <el-popconfirm :title="`是否将该渠道变为${scope.row.status === 1 ? '停用' : '启用'}状态`" @confirm="updateState(scope.row)">
              <el-button slot="reference" size="mini" type="text" :style="scope.row.status === 1?'color:#FF0000':'color:#67C23A'">
                {{ scope.row.status === 1 ? '停用' : '启用' }}
              </el-button>
            </el-popconfirm>
            <el-popconfirm title="是否清空授权店铺数据" @confirm="cleanListingData(scope.row)" v-if="scope.row.status != 1">
              <el-button slot="reference" size="mini" type="text" v-if="scope.row.platform=='10061'">清空Listing</el-button>
            </el-popconfirm>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <FormDialog :visible.sync="dialogFormVisible" :isFrom="isFrom" :row="row" @request="getList" />
    <Authorization :visible.sync="authorizationDialog" @message="authorizationMessage" :id="authorizationId" />
    <ShopeeAuth :visible.sync="shopeeAuthDialog" @message="authorizationMessage" :id="authorizationId" />
    <RtsAuth :visible.sync="rtsAuthDialog" @message="authorizationMessage" :id="authorizationId" />
    <AmazonDialog :visible.sync="amazonfromDialog" :ruleForm="row" :platformNameList="platformNameList" :countryList="countryList" :isTure="isAdd" @handReset="getList" />
  </TabelPageLayout>
</template>
<script>
import {
  getList,
  getDelete,
  getLoglist,
  getSysParameterName,
  refreshToken,
  updateState,
  cleanListingData,
  getWalmarttoken,
  getAuthRequestUrlAmazon,
  refreshTokenAmazon
} from "@/api/common/sysImpower";
import { LogView, TabelPageLayout, ShrinkCard } from "@/components";
import Authorization from "./components/Authorization";
import ShopeeAuth from "./components/ShopeeAuth";
import FormDialog from "./components/FormDialog";
import RtsAuth from "./components/RtsAuth";
import AmazonDialog from "./components/AmazonDialog"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  accountOwner: "",
  platformName: "",
  storeName: "",
  isAuth: "",
};

export default {
  name: "sysImpower",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operateType", width: "120" },
          { label: "操作人", property: "operatorName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getLoglist,
        param: {
          id: "",
          logType: 1,
        },
      },
      isFrom: true,
      isAuthList: [
        // -1未授权、1授权成功、2授权失败、3授权停用
        { label: "未授权", value: -1 },
        { label: "授权成功", value: 1 },
        { label: "授权失败", value: 2 },
        { label: "授权停用", value: 3 },
      ],
      authorizationDialog: false,
      shopeeAuthDialog: false,
      rtsAuthDialog: false,
      authorizationId: "",
      platformNameList: [],
      dialogFormVisible: false,
      row: {},
      amazonfromDialog: false,
      isAdd: true,
      countryList: []
    };
  },
  components: {
    LogView,
    TabelPageLayout,
    Authorization,
    ShrinkCard,
    FormDialog,
    ShopeeAuth,
    RtsAuth,
    AmazonDialog
  },
  filters: {
    isAuthFilter(type) {
      switch (type) {
        case -1:
          return "未授权";
        case 1:
          return "授权成功";
        case 2:
          return "授权失败";
        case 3:
          return "授权停用";
      }
    },
    statusFilter(type) {
      switch (type) {
        case -1:
          return "停用";
        case 1:
          return "启用";
        default:
          return "未知"
      }
    },
    countryFilter(type) {
      switch (type) {
        case "SG":
          return "新加坡";
        case "MY":
          return "马来西亚";
        case "PH":
          return "菲律宾";
        case "TH":
          return "泰国";
        case "ID":
          return "印度尼西亚";
        case "VN":
          return "越南";
        case "CB":
          return "跨境";
        case "US":
          return "美国";
        case "BR":
          return "巴西"
        default:
          return type
      }
    },
  },
  computed: {
    isAuthColor() {
      return function (type) {
        switch (type) {
          case -1:
            return "#4169E1";
          case 1:
            return "#67C23A";
          case 2:
            return "#FF0000";
          case 3:
            return "#FFA500";
        }
      };
    },
    isStatusColor() {
      return function (type) {
        switch (type) {
          case -1:
            return "#FF0000";
          case 1:
            return "#67C23A";
        }
      };
    },
    getPlatformName() {
      return function (type) {
        switch (type) {
          case "shopee":
            return false;
          case "RTS":
            return false;
          default:
            return true;
        }
      }
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
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getType() {
      getSysParameterName({
        isTopClass: 0,
        parameterName: "",
        parameterSearchType: "平台",
      }).then((res) => {
        this.platformNameList = res.data;
      });

    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    //删除
    handleremove(index, id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getDelete(id).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.list.splice(index, 1);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handSave() {
      this.dialogFormVisible = true;
      this.isFrom = true;
      this.row = {}
    },
    async handleupdate(row) {
      this.row = JSON.parse(JSON.stringify(row))
      this.isFrom = false;
      if (row.platform == "10057") {
        const res = await getSysParameterName({
          isTopClass: 0,
          parameterSearchType: "Amazon 销售伙伴 API 端点",
        })
        this.countryList = res.data;
        this.isAdd = false
        this.amazonfromDialog = true
      } else {
        this.dialogFormVisible = true;
      }
    },
    handleimpoer(row) {
      if (row.platform == "10376") {
        getWalmarttoken({ id: row.id }).then(res => {
          this.$message(res.data)
          this.getList()
        })
      } else if (row.platform == "10061") {
        this.authorizationId = row.id;
        this.authorizationDialog = true;
      } else if (row.platform == "10062") {
        this.authorizationId = row.id;
        this.shopeeAuthDialog = true;
      } else if (row.platform == "10445") {
        this.authorizationId = row.id;
        this.rtsAuthDialog = true;
      } else if (row.platform == "10057") {
        getAuthRequestUrlAmazon(row.id).then(res => {
          if (res.code == 200) {
            this.$message.success(res.data)
          }
        })
      }
    },
    authorizationMessage(message) {
      this.$message(message);
      this.authorizationId = "";
      if (message.type !== "") this.getList();
    },
    async resetImpoer(row) {
      //沃尔玛
      if (row.platform == "10376") {
        const res = await getWalmarttoken({ id: row.id });
        this.$message(res.data);
        this.getList();
      } else if (row.platform == "10061") {
        const res = await refreshToken({ id: row.id });
        this.$message(res.data);
        this.getList();
      } else if (row.platform == "10057") {
        const res = await refreshTokenAmazon({ id: row.id });
        this.$message(res.data);
        this.getList();
      }
    },
    async updateState(row) {
      const res = await updateState({ id: row.id, state: row.status === 1 ? -1 : 1 })
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: res.data
        })
        this.getList()
      }
    },
    //删除店铺数据
    async cleanListingData(row) {
      const res = await cleanListingData({ id: row.id });
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: "清空成功"
        })
      }
      this.getList()
    }
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }
}
</style>