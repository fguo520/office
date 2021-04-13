
<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="品牌类型:">
          <el-select v-model="listQuery.brandType" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.brandTypeList" :key="index" :label="item.lable" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌名称:">
          <el-input v-model="listQuery.brandName" placeholder="模糊搜索" />
        </el-form-item>
        <el-form-item label="添加人:">
          <el-select v-model="listQuery.addUserName" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.addUserNameList" :key="index" :label="item.fullName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:3px">
      <el-button @click="dialogFormShow()" type="primary" size="mini" v-if="rolePermissionJudge('walmart/WalmartBrand/add2')">新增品牌</el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="品牌类型" align="center">
          <template #default="{ row }">
            <span v-copy="row.brandTypeName">{{ row.brandTypeName }}</span>
          </template>
        </u-table-column>
        <u-table-column label="品牌名称" align="center">
          <template #default="{ row }">
            <span v-copy="row.brandName">{{ row.brandName }}</span>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center">
          <template #default="{ row }">
            <div :style="row.status==0?'color:#FF0000':'color:#67C23A'">{{ row.status ? '启用' : '停用' }}</div>
          </template>
        </u-table-column>
        <u-table-column label="添加人" align="center">
          <template #default="{ row }">
            <div v-copy="row.addUserName">{{ row.addUserName}}</div>
          </template>
        </u-table-column>
        <u-table-column label="添加时间" align="center" prop="addTime" />
        <u-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="dialogFormShow(row)" size="mini" v-if="rolePermissionJudge('walmart/WalmartBrand/editor2')">编辑</el-button>
            <el-popconfirm :title="`确定${row.status===1?'停用':'启用'}改品牌吗？`" @confirm="handleStatus(row)">
              <el-button slot="reference" type="text" :style="{ color:row.status===1 ? 'red' : '#3b9e70' }" v-if="rolePermissionJudge('walmart/WalmartBrand/status')">
                {{ row.status===1 ? '停用' : '启用' }}
              </el-button>
            </el-popconfirm>
            <el-button type="text" @click="handlejournal(row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <el-dialog :title="dialogForm.title" :visible.sync="dialogForm.dialog" width="400px" @close="saveCommit(0)">
      <el-form label-width="80px" ref="form" :model="dialogForm.formData" size="mini" :rules="addRules">
        <el-form-item label="品牌类型" prop="brandTypeName">
          <el-select v-model="dialogForm.formData.brandTypeName" placeholder="请选择平台">
            <el-option v-for="item in typeList.brandTypeList" :key="item.value" :label="item.lable" :value="item.lable" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="dialogForm.formData.brandName" style="width:193px;" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="saveCommit(0)" size="mini">取 消</el-button>
        <el-button @click="saveCommit(1)" type="primary" size="mini">保 存</el-button>
      </span>
    </el-dialog>

    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getPublicBrandLogList, brandInfoList, getAddlist, getBrandTypeApi, saveBrand, updateBrandStatus } from "@/api/common/walmartBrand";
import { TabelPageLayout, LogView, ScrollSelect, ShrinkCard } from "@/components";
const defaultListQuery = {
  brandType: "",
  brandName: '',
  addUserName: '',
  pageNum: 1,
  pageSize: 50,
};
const defaultAddSaveTable = {
  brandTypeName: '',
  brandName: '',
}
export default {
  name: "AddBrandTab",
  components: {
    TabelPageLayout,
    LogView,
    ScrollSelect,
    ShrinkCard
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      typeList: {
        addUserNameList: [],
        brandTypeList: []
      },
      dialogForm: {
        formData: Object.assign({}, defaultAddSaveTable),
        dialog: false,
        title: "",
      },
      addRules: {
        brandTypeName: [{ required: true, message: "此项不能为空", trigger: "change" }],
        brandName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      logViewParam: {
        title: [
          { label: "操作人", property: "operationPerson", width: "120" },
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "日志内容", property: "content", tooltip: true },
          { label: "操作时间", property: "operationTime", width: "180" },
        ],
        request: getPublicBrandLogList,
        param: {
          manageId: "",
        },
      },
      LogDialogVisible: false,
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
  computed: {},
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await brandInfoList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      getAddlist().then(res => {
        this.typeList.addUserNameList = res.data
      })
      getBrandTypeApi().then(res => {
        this.typeList.brandTypeList = res.data
      })
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async saveCommit(state) {
      if (state) {
        try {
          let formValid;
          this.$refs.form.validate(valid => { formValid = valid })
          if (!formValid) return
          const res = await saveBrand(this.dialogForm.formData);
          if (res.code === 200) {
            this.$message({ type: "success", message: res.message })
            this.getList()
            this.getType()
          }
        } catch (error) { }
      }
      this.dialogForm.dialog = false
      //因动画重置formData 会 触发校验 出现不友好界面
      setTimeout(() => {
        this.dialogForm.formData = Object.assign({}, defaultAddSaveTable)
      }, 100)
    },
    async dialogFormShow(row) {
      this.dialogForm.dialog = true
      this.dialogForm.formData = row ? {
        brandTypeName: row.brandTypeName,
        brandName: row.brandName,
        id: row.id,
      } : Object.assign({}, defaultAddSaveTable);

      this.dialogForm.title = row ? "编辑品牌信息" : "添加品牌";
      if (this.$refs.form) this.$refs.form.clearValidate()
    },
    async handleStatus(row) {
      const changeRowStatus = row.status === 1 ? 0 : 1
      const res = await updateBrandStatus({
        id: row.id,
        status: changeRowStatus
      })
      this.$message.success('更改成功')
      row.status = changeRowStatus
    },
    handlejournal(params) {
      this.logViewParam.param.manageId = params;
      this.LogDialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>