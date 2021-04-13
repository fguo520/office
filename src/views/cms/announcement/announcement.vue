<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="状态：">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="notice()" size="mini">新增公告</el-button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{'background-color': '#dadde3'}">
        <u-table-column label="版本号" align="center" prop="versions" width="150" />
        <u-table-column label="公告类型" align="center" prop="type" width="150">
          <template #default="{ row }">
            {{ getType(row.type) }}
          </template>
        </u-table-column>
        <u-table-column label="公告标题" align="center" prop="title">
          <template #default="{ row }">
            <div v-html="row.title"></div>
          </template>
        </u-table-column>
        <u-table-column label="公告内容" align="center" prop="content">
          <template #default="{ row }">
            <div v-html="row.content" class="omit"></div>
          </template>
        </u-table-column>
        <u-table-column label="创建人" align="center" prop="createUser" width="150" />
        <u-table-column label="审核人" align="center" prop="reviewUser" width="150" />
        <u-table-column label="状态" align="center" prop="status" width="150">
          <template #default="{ row }">
            {{ getStatus(row.status) }}
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="220">
          <template #default="{ row }">
            <div v-show="row.createTime">创建: {{ row.createTime }}</div>
            <div v-show="row.reviewTime">审核: {{ row.reviewTime }}</div>
            <div v-show="row.releaseTime">发布: {{ row.releaseTime }} {{ row.time }}</div>
            <div v-show="row.updateTime">更新: {{ row.updateTime }} {{ row.time }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="250">
          <template #default="{ row }">
            <el-button type="text" @click="lookUp(row)" size="mini">查看</el-button>
            <el-button type="text" @click="notice(row)" size="mini" v-if="row.status===0">编辑</el-button>
            <el-button type="text" @click="lookUp(row,'check')" size="mini" v-if="row.status===0">审核</el-button>
            <el-button type="text" @click="handlejournal(row)" size="mini">日志</el-button>
            <el-popconfirm title="确认发布这条公告吗？" style="margin-left:10px;" @confirm="release(row)" v-if="row.status===1">
              <el-button type="text" size="mini" slot="reference">发布</el-button>
            </el-popconfirm>
            <el-popconfirm title="确认删除这条公告吗？" style="margin-left:10px;" @confirm="deleteAnnouncement(row)" v-if="row.status!==3 && row.status!==1">
              <el-button type="text" size="mini" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <NoticeDialog :visible.sync="noticeDialog.visible" :row="noticeDialog.row" :check="noticeDialog.check" @request="getList" />
    <LogView :config="logViewParam" :visible.sync="dialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getList, log, deleteAnnouncement, releaseAnnouncement } from "@/api/cms/announcement";
import { LogView, TabelPageLayout, ShrinkCard } from "@/components";
import NoticeDialog from "./components/NoticeDialog"
const defaultListQuery = {
  status: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "announcement",
  components: {
    LogView,
    TabelPageLayout,
    ShrinkCard,
    NoticeDialog
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "createUser", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: log,
        param: {
          id: "",
        },
      },
      typeList: [
        { label: '待审核', value: 0 },
        { label: '待发布', value: 1 },
        { label: '审核不通过', value: 2 },
        { label: '发布成功', value: 3 },
        { label: '发布失败', value: 4 },
      ],
      noticeDialog: {
        visible: false,
        row: {},
        check: false
      }
    };
  },
  created() {
    this.getList();
    this.getTypelist();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  computed: {
    getType() {
      return (type) => {
        switch (type) {
          case 1:
            return '系统公告'
          case 2:
            return '发版公告'
          case 3:
            return '放假公告'
          default:
            return '未知类型';
        }
      }
    },
    getStatus() {
      return (status) => {
        const result = this.typeList.find(item => item.value === status) || {};
        return result.label || '未知状态'
      }
    }
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
    getTypelist() {
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery)
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    notice(row) {
      this.$store.commit('setNoticeInfo', row)
      this.$router.push({ path: '/cms/addAnnouncement', query: row ? { id: row.id } : null })
    },
    handlejournal(params) {
      this.logViewParam.param.id = params.id;
      this.dialogVisible = true;
    },
    lookUp(row, check) {
      this.noticeDialog = {
        visible: true,
        row: {
          ...row,
          type: this.getType(row.type)
        },
        check
      };
    },
    async deleteAnnouncement(row) {
      const res = await deleteAnnouncement({ id: row.id })
      if (res.code === 200) {
        this.$message.success(res.data)
        this.getList()
      }
    },
    async release(row) {
      const res = await releaseAnnouncement({
        id: row.id,
        reviewStatus: 0
      })
      if (res.code === 200) {
        this.$message.success('审核通过');
        this.getList()
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.omit {
  // word-break: break-all;
  // display: -webkit-box;
  // /* ! autoprefixer: off */
  // -webkit-box-orient: vertical;
  // /* autoprefixer: on */
  // -webkit-line-clamp: 4;
  // overflow: hidden;
  max-height: 100px;
}
</style>