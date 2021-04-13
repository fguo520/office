<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="任务单号：">
          <el-input v-model="listQuery.taskNo" class="input-width" placeholder="请输入" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据类型：">
          <el-select v-model="listQuery.lmTypeParameterCode" clearable placeholder="请选择" size="mini" filterable>
            <el-option v-for="item in typeList" :key="item.parameterCode" :label="item.parameterValue" :value="item.parameterCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.status" :ButtonTypes="statusQueryList" @request="getList" />
    <template #container>

      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{'background-color': '#dadde3'}">
        <!-- <u-table-column label="编号" type="index" width="50" align="center"></u-table-column> -->
        <u-table-column label="任务单号" align="center" width="200">
          <template #default="{ row }">
            <div v-copy="row.lmExcelNo">{{ row.lmExcelNo }}</div>
          </template>
        </u-table-column>
        <u-table-column label="数据类型" align="center" width="250">
          <template #default="{ row }">
            <div style="text-align: left;">
              <div v-copy="row.parameterValueName">{{ row.parameterValueName }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="150">
          <!--状态：0:待处理，1处理中，2处理成功，3处理失败，-1删除-->
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">待处理</span>
            <span v-if="scope.row.status == '1'">处理中</span>
            <span v-if="scope.row.status == '2'" style="color: #2ac06d">处理成功</span>
            <span v-if="scope.row.status == '3'">处理失败</span>
          </template>
        </u-table-column>
        <u-table-column label="操作人" property="createUserName" align="center" width="150"></u-table-column>
        <u-table-column label="备注" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <div style="text-align: left;">
              <div style="text-overflow:ellipsis; overflow:hidden;">{{ row.errorDesc }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="添加时间" align="center" width="180">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="完成时间" align="center" width="180">
          <template slot-scope="scope">
            <div>{{ scope.row.completeTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.$index, scope.row)" :disabled="scope.row.status != '0'" size="mini">删除</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
  </TabelPageLayout>
</template>
<script>
import {
  getLmTaskList,
  getSysParameterCodeList,
  deleteData,
} from "@/api/Im/excel";
import { RadioButtonGroup, TabelPageLayout, ShrinkCard } from "@/components";
export default {
  name: "returnApplyList",
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        lmTypeParameterCode: "", //数据类型
        status: "",
        taskNo: "",
      },
      statusQueryList: [
        {
          //0:待处理，1处理中，2处理成功，3处理失败，
          value: "0",
          label: "待处理",
        },
        {
          value: "1",
          label: "处理中",
        },
        {
          value: "2",
          label: "处理成功",
        },
        {
          value: "3",
          label: "处理失败",
        },
      ],
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      typeList: [],
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
    RadioButtonGroup,
    TabelPageLayout,
    ShrinkCard
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getLmTaskList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    //删除报告
    handleDelete(index, row) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteData(row.id).then((response) => {
          this.$message({
            message: "删除成功！",
            type: "success",
            duration: 1000,
          });
          this.getList();
        });
      });
    },
    resetOption() {
      this.listQuery = {
        ...this.listQuery,
        lmTypeParameterCode: "",
        status: "",
        taskNo: "",
      };
      this.getList();
    },
    //数据类型
    getType() {
      getSysParameterCodeList({
        parameterName: "", //数据类型
        parameterSearchType: "定时任务类型", //平台
        isTopClass: false,
      }).then((response) => {
        this.typeList = response.data;
      });
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
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


