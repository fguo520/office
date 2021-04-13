
<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="平台:">
          <el-select v-model="listQuery.platformCode" placeholder="全部" size="mini" clearable class="input-width" filterable @change="handPlat">
            <el-option v-for="(item, index) in typeList.platformCodeList" :key="index" :label="item.platformName" :value="item.platformCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道:">
          <ScrollSelect v-model="listQuery.channels" :list="typeList.channelList" />
        </el-form-item>
        <el-form-item label="品牌名称：">
          <el-input placeholder="请输入内容" v-model="listQuery.brandName" clearable />
        </el-form-item>
        <el-form-item label="添加人:">
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
      <el-button @click="dialogFormShow()" type="primary" size="mini" v-if="rolePermissionJudge('walmart/WalmartBrand/add')">新增渠道品牌</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="平台" align="center">
          <template #default="{ row }">
            <span v-copy="row.platformName">{{ row.platformName}}</span>
          </template>
        </u-table-column>
        <u-table-column label="品牌名称" align="center">
          <template #default="{ row }">
            <span v-copy="row.brandName">{{ row.brandName }}</span>
          </template>
        </u-table-column>
        <u-table-column label="品牌类型" align="center">
          <template #default="{ row }">
            <span v-copy="row.brandTypeName">{{ row.brandTypeName }}</span>
          </template>
        </u-table-column>
        <u-table-column label="渠道" align="center" prop="channel" />
        <u-table-column label="状态" align="center">
          <template #default="{ row }">
            <div :style="row.status==0?'color:#FF0000':'color:#67C23A'">{{ row.status ? '启用' : '停用' }}</div>
          </template>
        </u-table-column>

        <u-table-column label="添加人" align="center">
          <template #default="{ row }">
            <div v-copy="row.addNickName">{{ row.addNickName}}</div>
          </template>
        </u-table-column>

        <u-table-column label="添加时间" align="center" prop="addTime" />

        <u-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="dialogFormShow(row)" size="mini" v-if="rolePermissionJudge('walmart/WalmartBrand/editor')">编辑</el-button>
            <el-button type="text" @click="handlejournal(row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <el-dialog :title="dialogForm.title" :visible.sync="dialogForm.dialog" width="400px" @close="saveCommit(0)">
      <el-form label-width="80px" ref="form" :model="dialogForm.formData" size="mini" :rules="addRules">
        <el-form-item label="平台:" prop="platformCode">
          <el-select v-model="dialogForm.formData.platformCode" placeholder="全部" size="mini" clearable class="input-width" filterable @change="handPlat('add')">
            <el-option v-for="(item, index) in typeList.platformCodeList" :key="index" :label="item.platformName" :value="item.platformCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道" prop="channelId">
          <el-select v-model="dialogForm.formData.channelId" placeholder="请选择平台" v-if="dialogForm.formData.id">
            <el-option v-for="item in typeList.channelData" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <ScrollSelect v-model="dialogForm.formData.channelId" :list="typeList.channelData" v-else />
        </el-form-item>

        <el-form-item label="品牌" prop="brandName">
          <el-input v-model="dialogForm.formData.brandName" style="width:193px;" :disabled="!dialogForm.channelInput" @change="brandChange" />
        </el-form-item>
        <el-form-item label="品牌类型" prop="brandType">
          <el-select v-model="dialogForm.formData.brandType" placeholder="请输入品牌">
            <el-option v-for="item in typeList.brandTypeList" :key="item.value" :label="item.brandTypeName" :value="item.brand_type" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dialogForm.formData.status" placeholder="请选择状态">
            <el-option v-for="item in typeList.stateList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
import { getList, getChannelList, getLoglist, add, update, getPlatform, getCreater, getBrandTypeByName } from "@/api/common/walmartBrand";
import { TabelPageLayout, LogView, ScrollSelect, ShrinkCard } from "@/components";
const defaultListQuery = {
  brandName: "",
  channels: [],
  pageNum: 1,
  pageSize: 50,
  platformCode: "",
  adminId: ""
};
const defaultAddSaveTable = {
  brandName: '',
  channelId: [],
  status: true,
  brandType: '',
  id: '',
  platformCode: '',
}
export default {
  name: "MaintainBrandTab",
  components: {
    TabelPageLayout,
    LogView,
    ScrollSelect,
    ShrinkCard,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      typeList: {
        channelList: [],
        stateList: [{ label: '停用', value: false }, { label: "启用", value: true }],
        platformCodeList: [],
        channelData: [],
        createUserList: [],
        brandTypeList: []
      },
      dialogForm: {
        formData: Object.assign({}, defaultAddSaveTable),
        dialog: false,
        title: "",
        channelInput: true
      },
      addRules: {
        platformCode: [{ required: true, message: "此项不能为空", trigger: "change" }],
        brandName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        channelId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        status: [{ required: true, message: "此项不能为空", trigger: "change" }],
        brandType: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      logViewParam: {
        title: [
          { label: "操作人", property: "operationPerson", width: "120" },
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "日志内容", property: "content", tooltip: true },
          { label: "操作时间", property: "operationTime", width: "180" },
        ],
        request: getLoglist,
        param: {
          id: "",
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
  computed: {
    // getBrandType() {
    //   return (type) => {
    //     const typeItem = this.typeList.brandTypeList.find(item => item.value === type) || {}
    //     return typeItem.label || ''
    //   }
    // }
  },
  methods: {
    async brandChange(value) {
      const res = await getBrandTypeByName({ brandName: value })
      this.typeList.brandTypeList = [res.data]
    },
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
    async getType() {
      const res = await getPlatform()
      const resUser = await getCreater()
      this.typeList.platformCodeList = res.data
      this.typeList.createUserList = resUser.data
    },
    async handPlat(value) {
      value == 'add' ? this.dialogForm.formData.channelId = '' : this.listQuery.channels = []
      const res = await getChannelList({ platformCode: value == 'add' ? this.dialogForm.formData.platformCode : this.listQuery.platformCode })
      value == 'add' ? this.typeList.channelData = res.data : this.typeList.channelList = res.data
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
          const commitAPI = this.dialogForm.channelInput ? add : update;
          const res = await commitAPI(this.dialogForm.formData);
          if (res.code === 200) {
            this.$message({ type: "success", message: res.data })
            this.getList()
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
      if (row) {
        const res = getChannelList({ platformCode: row.platformCode }).then(res => {
          this.typeList.channelData = res.data
        })
      }
      this.dialogForm.formData = row ? {
        platformCode: row.platformCode,
        id: row.id,
        brandName: row.brandName,
        brandType: row.brandType,
        status: row.status,
        channelId: row.channelId
      } : Object.assign({}, defaultAddSaveTable);
      if (this.dialogForm.formData.id) {
        this.brandChange(this.dialogForm.formData.brandName)
      }

      this.dialogForm.title = row ? "编辑品牌信息" : "新增品牌";
      this.dialogForm.channelInput = row ? false : true
      if (this.$refs.form) this.$refs.form.clearValidate()
    },
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>