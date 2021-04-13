<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="平台:">
          <el-select v-model="listQuery.platformCode" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.platformCodeList" :key="index" :label="item.platformName" :value="item.platformCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称：">
          <el-input clearable v-model="listQuery.name" size="mini" />
        </el-form-item>
        <el-form-item label="创建人:">
          <el-select v-model="listQuery.adminId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.createUserList" :key="index" :label="item.fullName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="toWatermarkEditor()" v-if="rolePermissionJudge('/sys/watermark')">创建水印模板</el-button>
    </div>
    <!-- 表格 -->
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border row-key="id" :default-expand-all="false" :tree-props="{ children: 'children' }" height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="水印模板编号" align="center" width="120" prop="watemarkTemplateNo" />
        <u-table-column label="平台" align="center" width="120" >
          <template #default="{ row }">
            {{ row.platformName }}
          </template>
        </u-table-column>
        <u-table-column label="模板名称" align="center" prop="name">
          <template #default="{ row }">
            <div v-copy="row.name">{{ row.name}}</div>
          </template>
        </u-table-column>
        <u-table-column label="水印内容" align="center" width="150" prop="text">
          <template #default="{ row }">
            <span v-if="row.type === 1">{{ row.text }}</span>
            <img :src="row.imageUrl" v-if="row.type === 2" width="100px">
          </template>
        </u-table-column>
        <u-table-column label="类型" align="center" width="150">
          <template #default="{ row }">
            {{ getType(row.type) }}
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="150" prop="status">
          <template #default="{ row }">
            <div :style="row.status==0?'color:#FF0000':'color:#67C23A'">{{ row.status ? '启用' : '停用'}}</div>
          </template>
        </u-table-column>
        <u-table-column label="创建人" align="center">
          <template #default="{ row }">
            <div v-copy="row.createUserName">{{ row.createUserName}}</div>
          </template>
        </u-table-column>
        <u-table-column label="创建时间" align="center" prop="createTime" />
        <u-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="toWatermarkEditor(scope.row.id)" size="mini">编辑</el-button>
            <el-button type="text" @click="upadteWaterStatus(scope.row)" size="mini" :style="getStatusStyle(scope.row.status)">{{ scope.row.status ? '停用' : '启用' }}</el-button>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <!-- 日志 -->
    <LogView :config="logViewParam" :visible.sync="dialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getList, logList, upadteStatus, getCreater, getPlatform } from "@/api/common/sysWatermark";
import { LogView, TabelPageLayout, ShrinkCard } from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  platformCode: null,
  adminId: "",
  name: ""
}
export default {
  name: "sysWatermark",
  data() {
    return {
      list: [],
      total: null,
      listLoading: true,
      listQuery: Object.assign({}, defaultListQuery),
      typeList: { platformCodeList: [], createUserList: [] },
      dialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "operationPerson", width: "120" },
          { label: "操作时间", property: "operationTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: logList,
        param: {
          id: "",
        },
      },
    };
  },
  components: {
    LogView,
    TabelPageLayout,
    ShrinkCard
  },
  created() {
    this.getList();
    this.getTypeList()
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  computed: {
    getType() {
      return function (type) {
        switch (type) {
          case 1:
            return "文字水印"
          case 2:
            return "图片水印"
        }
      }
    },
    getStatusStyle() {
      return function (type) {
        switch (type) {
          case 0:
            return { color: '#67C23A' }
          case 1:
            return { color: 'red' }
        }
      }
    },
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
    async getTypeList() {
      const res = await getPlatform()
      const resUser = await getCreater()
      this.typeList.platformCodeList = res.data
      this.typeList.createUserList = resUser.data
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    toWatermarkEditor(id) {
      const query = id ? { id } : {};
      this.$router.push({ path: "/common/sysWatermarkEditor", query });
    },
    async upadteWaterStatus(row) {
      const res = await upadteStatus({ id: row.id, status: row.status ? 0 : 1 })
      if (res.code === 200) {
        this.$message({ type: "success", message: "操作成功" })
        this.getList()
      }
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" >
</style>
        