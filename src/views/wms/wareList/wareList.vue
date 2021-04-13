<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="仓库名称:">
          <!-- <el-select v-model="listQuery.wareHouseName" placeholder="全部" clearable size="mini" class="input-width" filterable :filter-method="selectFilter" @visible-change="SelectVisibleChange" @clear="handclear">
            <el-option style="height: auto; background-color: #fff; font-weight: 400" value="">
              <el-tree :data="wareHouseNameList" accordion ref="treeTeam" node-key="warehouseid" :props="{ label: 'warehousename' }" show-checkbox @check="handleCheckChange" :filter-node-method="filterNode">
              </el-tree>
            </el-option>
          </el-select> -->
           <TreeSelect v-model="listQuery.wareHouseName" :prop="{label:'warehousename',value:'warehousename'}" :list="wareHouseNameList" />
        </el-form-item>
        <el-form-item label="仓库类型:">
          <el-select v-model="listQuery.wareHouseTypeStr" placeholder="全部" clearable size="mini" class="input-width" filterable>
            <el-option v-for="(item, index) in wareHouseTypeList" :key="index" :label="item.parameterName" :value="item.parameterName" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="handUpdate" :disabled="unDisabled" :loading="unDisabled" v-if="rolePermissionJudge('/wms/wareList')">更新</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="仓库id" width="100" align="center" prop="warehouseid"></u-table-column>
        <u-table-column label="仓库名称" align="center">
          <template #default="{ row }">
            <div v-copy="row.warehousename">{{ row.warehousename }}</div>
          </template>
        </u-table-column>
        <u-table-column label="仓库类型" align="center">
          <template #default="{ row }">
            <div v-copy="row.warehousetypestr">{{ row.warehousetypestr }}</div>
          </template>
        </u-table-column>
        <u-table-column label="更新时间" align="center" prop="updatetime">
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handlejournal(scope.row.id)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="dialogVisible" />
  </TabelPageLayout>
</template>
<script>
import {
  warehouseList,
  getWarehouseListLogList,
  treeWareHouseName,
  manualUpdate,
  getWareHouseType,
} from "@/api/wms/wareList";
import { LogView, TabelPageLayout, ShrinkCard,TreeSelect } from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  wareHouseName: [],
  wareHouseTypeStr: "",
};
export default {
  name: "wareList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      wareHouseNameSearch: "",
      listLoading: false,
      wareHouseNameList: [],
      wareHouseTypeList: [],
      dialogVisible: false,
      unDisabled: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "createPerson", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getWarehouseListLogList,
        param: {
          id: "",
        },
      },
    };
  },
  created() {
    this.getList();
    this.getType();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  components: {
    LogView,
    TabelPageLayout,
    ShrinkCard,
    TreeSelect
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await warehouseList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    getType() {
      treeWareHouseName().then((response) => {
        this.wareHouseNameList = response.data;
      });
      getWareHouseType().then((response) => {
        this.wareHouseTypeList = response.data;
      });
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handUpdate() {
      this.unDisabled = true;
      manualUpdate().then((response) => {
        if (200 == response.code) {
          this.unDisabled = false;
          this.$message.success(response.message);
        }
        this.getList();
      });
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.dialogVisible = true;
    },
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