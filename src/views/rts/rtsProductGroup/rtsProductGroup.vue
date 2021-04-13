<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="120px">
        <el-form-item label="分组名称：">
          <el-input clearable v-model="listQuery.parentGroupName" size="mini" />
        </el-form-item>
        <el-form-item label="渠道：">
          <el-select v-model="listQuery.authId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.parentGroupList" :key="index" :label="item.storeNameAs" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" row-id="groupId" :treeConfig="{lazy: true, load:tableLoad }" :row-class-name="tableRowClassName">
        <u-table-column label="分组ID" align="center" width="180" prop="groupId" :tree-node="true" />
        <u-table-column label="分组名称" align="center" prop="groupName" />
        <u-table-column label="渠道" align="center" prop="authName" />
        <u-table-column label="等级" align="center" prop="level">
          <template #default="{ row }">
            {{ getLevel(row.level) }}
          </template>
        </u-table-column>
        <u-table-column label="更新时间" align="center" prop="updateTime" />
        <u-table-column label="操作" align="center" width="150">
          <template #default="{ row }">
            <el-button type="text" size="mini" @click="handlejournal(row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <LogView :config="logViewParam" :visible.sync="logDialogVisible" />
  </TabelPageLayout>
</template>

<script>
import { authList, groupPage, groupLog } from "@/api/rts/rtsProductGroup"
import { TabelPageLayout, ShrinkCard, LogView } from "@/components";
const defaultListQuery = {
  authId: '',
  parentGroupName: "",
  parentGroupId: "-1",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "rtsProductGroup",
  components: {
    TabelPageLayout,
    ShrinkCard,
    LogView,
  },
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      typeList: {
        parentGroupList: []
      },
      listLoading: false,
      logDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeName", width: "120" },
          { label: "操作人", property: "createUserName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: groupLog,
        param: {
          groupId: ""
        }
      },
    }
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
    getLevel() {
      return (level) => {
        switch (level) {
          case 1:
            return '一级'
          case 2:
            return '二级'
          case 3:
            return '三级'
          case 4:
            return '四级'
          case 5:
            return '五级'
          case 6:
            return '六级'
          case 7:
            return '七级'
          case 8:
            return '八级'
          case 9:
            return '九级'
          default:
            return `${level}级`
        }
      }
    },
  },
  methods: {
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = []
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await groupPage(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getTypeList() {
      authList().then(res => {
        this.typeList.parentGroupList = res.data
      })
    },
    handlejournal(row) {
      this.logDialogVisible = true;
      this.logViewParam.param.groupId = row.groupId
    },
    async tableLoad(tree, resolve) {
      const res = await groupPage({
        authId: tree.authId,
        parentGroupId: tree.groupId,
        pageNum: 1,
        pageSize: 99999
      })
      const callback = res.data.list;
      resolve(callback);
    },
    tableRowClassName({ row: { level }, rowIndex }) {
      switch (level) {
        case 1:
          return ''
        case 2:
          return 'secondLevel'
        case 3:
          return 'thirdLevel'
        case 4:
          return 'fourthLevel'
        case 5:
          return 'fifthLevel'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .u-table__body {
  tbody {
    tr {
      td:first-child {
        text-align: left !important;
      }
    }
  }
}
.productClassDialog {
  .el-dialog__body {
    padding: 0 20px 10px;
    overflow: hidden;
  }

  .el-dialog__footer {
    text-align: center;
    padding: 10px 20px 20px;
  }
}

/deep/ .el-table {
  // & .firstLevel {
  //   background: oldlace;
  // }
  & .secondLevel {
    background: #fff2e8;
  }
  & .thirdLevel {
    background: #fff1f0;
  }
  & .fourthLevel {
    background: #fcffe6;
  }
  & .fifthLevel {
    background: #e6fffb;
  }
}
</style>