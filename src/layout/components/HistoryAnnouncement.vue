<template>
  <el-dialog title="历史公告" :visible.sync="visible" width="1000px" :before-close="close" @open="getQuery('reset')" custom-class="parents">
    <el-form :inline="true" size="mini">
      <el-form-item label="发布时间:" label-width="78px">
        <el-date-picker v-model="createTimeAndEndTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" size="mini" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:250px" />
      </el-form-item>
      <el-form-item label="公告类型:">
        <el-select v-model="listQuery.type" placeholder="全部" size="mini" clearable class="input-width" filterable>
          <el-option v-for="(item, index) in typeList.editionList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-button size="mini" class="buttonClass" @click="getQuery()">查询</el-button>
      <el-button size="mini" class="buttonClass" @click="getQuery('reset')">重置</el-button>
    </el-form>

    <el-table ref="tableContainer" style="width: 100%" :data="list" border height="350" :header-cell-style="{ 'background-color': '#dadde3' }">
      <el-table-column label="版本号" align="center" prop="versions" width="80" />
      <el-table-column label="公告类型" align="center" prop="type" width="80">
        <template #default="{ row }">{{ getType(row.type) }}</template>
      </el-table-column>
      <el-table-column label="公告标题" align="center" prop="title">
        <template #default="{ row }">
          <div v-html="row.title"></div>
        </template>
      </el-table-column>
      <el-table-column label="公告内容" align="center" prop="content">
        <template #default="{ row }">
          <div v-html="row.content" class="omit"></div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createUser" width="70" />
      <el-table-column label="发布时间" align="center" width="160" prop='releaseTime' />
      <el-table-column label="操作" align="center" width="50">
        <template #default="{ row }">
          <el-button type="text" size="mini" @click="lookUp(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList"/>
    <NoticeDialog :visible.sync="noticeDialog.visible" :row="noticeDialog.row" append-to-body />
  </el-dialog>
</template>

<script>
import { getList } from '@/api/cms/announcement'
import { Pagination } from '@/components'
import NoticeDialog from '@/views/cms/announcement/components/NoticeDialog'
const defaultListQuery = {
  startTime: '',
  endTime: '',
  type: '',
  status:3,
  pageNum: 1,
  pageSize: 50,
}
export default {
  name: "HistoryAnnouncement",
  components: {
    Pagination,
    NoticeDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      createTimeAndEndTime: null,
      typeList: {
        editionList: [
          { label: '系统公告', value: 1 },
          { label: '发版公告', value: 2 },
          { label: '放假公告', value: 3 },
        ]
      },
      noticeDialog: {
        visible: false,
        row: {}
      }
    }
  },
  beforeDestroy() {
    this.close();
  },
  watch: {
    createTimeAndEndTime: function (newValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  computed: {
    getType() {
      return (type) => this.typeList.editionList.find(item => item.value === type).label
    }
  },
  methods: {
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery)
        this.createTimeAndEndTime = null;
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getList() {
      const res = await getList(this.listQuery)
      this.list = res.data.list;
      this.total = res.data.total;
    },
    close() {
      this.$emit("update:visible", false)
    },
    lookUp(row) {
      this.noticeDialog = {
        visible: true,
        row: {
          ...row,
          type: this.getType(row.type)
        },
      };
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .parents .el-dialog__body {
  padding: 0;
  overflow: hidden;
}
/deep/ .pagination-container {
  margin: 0px;
  height: 32px;
}
.el-form-item {
  display: inline-flex;
}
.buttonClass {
  float: right;
  margin-right: 5px;
}

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
