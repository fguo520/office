<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="名称:">
          <el-input v-model.trim="listQuery.parameterName" class="input-width" placeholder="请输入名称" size="mini" />
        </el-form-item>
        <el-form-item label="类别:">
          <el-select v-model="listQuery.parameterSearchType" placeholder="全部" clearable class="input-width" size="mini" @change="conditions" filterable>
            <el-option v-for="(item, index) in types" :key="index" :label="item.parameterSearchType" :value="item.parameterSearchType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-date-picker v-model="createTimeAndEndTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" size="mini" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px"></el-date-picker>
        </el-form-item>
        <el-form-item label="顶级分类:">
          <el-button @click="conditions({ isTopClass: true })" :type="buttonType('isTopClass', true)" size="mini">
            是
          </el-button>
          <el-button @click="conditions({ isTopClass: false })" :type="buttonType('isTopClass', false)" size="mini">
            否
          </el-button>
        </el-form-item>
        <el-form-item label="是否使用过:">
          <el-button @click="conditions({ isEnable: false })" :type="buttonType('isEnable', false)" size="mini" :autofocus="true">
            否
          </el-button>
          <el-button @click="conditions({ isEnable: true })" :type="buttonType('isEnable', true)" size="mini">
            是
          </el-button>
        </el-form-item>
        <el-form-item label="状态:">
          <el-button @click="conditions({ isStop: false })" :type="buttonType('isStop', false)" size="mini">
            停用
          </el-button>
          <el-button @click="conditions({ isStop: true })" :type="buttonType('isStop', true)" size="mini">
            启用</el-button>
        </el-form-item>
      </el-form>

      <template #button>

        <el-button @click="resetOption()" size="mini">
          重置
        </el-button>
        <el-button @click="getList()" type="primary" size="mini" icon="el-icon-search">
          查询
        </el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <el-button size="mini" class="btn-add" @click="fromHandle" type="primary" v-if="rolePermissionJudge('/sys/add')">
        添加
      </el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{'background-color': '#dadde3'}">
        <!-- <u-table-column label="编号" type="index" width="50" align="center"></u-table-column> -->
        <u-table-column label="代码" property="parameterCode" align="center"></u-table-column>
        <u-table-column label="名称" align="center">
          <template #default={row}>
            <div v-copy="row.parameterName">{{row.parameterName}}</div>
          </template>
        </u-table-column>
        <u-table-column label="参数" property="parameterValue" align="center"></u-table-column>
        <u-table-column label="类别" align="center">
          <template #default={row}>
            <div v-copy="row.parameterSearchType">{{row.parameterSearchType}}</div>
          </template>
        </u-table-column>
        <u-table-column label="是否使用过" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.isEnable ? "是" : "否" }}</div>
          </template>
        </u-table-column>
        <u-table-column label="顶级类别" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.isTopClass ? "是" : "否" }}</div>
          </template>
        </u-table-column>
        <u-table-column label="创建人" property="createPerson" align="center"></u-table-column>
        <u-table-column label="状态" width="180" align="center">
          <template slot-scope="scope">
            <div :style="!scope.row.isStop?'color:#FF0000':'color:#67C23A'">{{ scope.row.isStop ? "启用" : "停用" }}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" width="220" align="center">
          <template slot-scope="scope">
            <div style="text-align: left;">
              <div v-show="scope.row.createTime">创建: {{ scope.row.createTime | formatTime }}</div>
              <div v-show="scope.row.updateTime">更新: {{ scope.row.updateTime | formatTime }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button @click="deleteData(scope.row.id,scope.$index)" size="mini" type="danger" v-if="!scope.row.isEnable">
              删除
            </el-button>
            <el-button @click="stopData(scope.row.id, scope.row.isStop,scope.$index)" size="mini" v-if="scope.row.isEnable" :type="miStatusColor(scope.row.isStop)">
              {{ !scope.row.isStop ? "启用" : "停用" }}
            </el-button>
            <el-button @click="handlejournal(scope.row.id)" size="mini">
              日志
            </el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <el-dialog title="添加参数" :visible.sync="dialogVisible" width="576px">
      <el-form ref="resourceForm" label-width="150px" size="mini" :rules="editRules" :model="formData">
        <el-form-item label="是否顶级类别：">
          <el-checkbox v-model="formData.isTopClass" @change="fromHandle"></el-checkbox>
        </el-form-item>
        <el-form-item label="名称：" prop="parameterName">
          <el-input v-model.trim="formData.parameterName" style="width: 250px"></el-input>
        </el-form-item>
        <el-collapse-transition>
          <el-form-item label="类别：" v-if="!formData.isTopClass" prop="parameterSearchType">
            <el-select v-model="formData.parameterSearchType" placeholder="全部" clearable style="width: 250px">
              <el-option v-for="(item, index) in types" :key="index" :label="item.parameterSearchType" :value="item.parameterSearchType"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-transition>
        <el-collapse-transition>
          <el-form-item label="参数：" v-if="!formData.isTopClass" prop="parameterValue">
            <el-input v-model.trim="formData.parameterValue" style="width: 250px"></el-input>
          </el-form-item>
        </el-collapse-transition>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button @click="handleOk('resourceForm')" type="primary" size="mini" :loading="isLoad">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <LogView :config="logViewParam" :visible.sync="dialogGournal" />
  </TabelPageLayout>
</template>
<script>
import { formatDate } from "@/utils/date";
import { getCookie } from "@/utils/support";
import {
  fetchList,
  getType,
  addData,
  updateStatus,
  deleteData,
  getSysParameterCodeLogList,
} from "@/api/cms/systemParameter";
import { LogView, TabelPageLayout, ShrinkCard } from "@/components";
const defaultFormData = {
  parameterName: "",
  parameterValue: "",
  parameterSearchType: "",
};
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  createTime: "",
  endTime: "",
  isEnable: "",
  isStop: "",
  isTopClass: "",
  parameterName: "",
  parameterSearchType: "",
};
export default {
  name: "returnApplyList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      createTimeAndEndTime: [],
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      dialogGournal: false,
      formData: Object.assign(
        { isTopClass: false, createPerson: getCookie("username") },
        defaultFormData
      ),
      types: [],
      editRules: {
        parameterName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        parameterValue: [
          { required: true, message: "请输入参数", trigger: "blur" },
        ],
        parameterSearchType: [
          { required: true, message: "请选择类别", trigger: "change" },
        ],
      },
      isLoad: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "createPerson", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getSysParameterCodeLogList,
        param: {
          id: "",
        },
      },
      miStatusColor: function (val) {
        if (!val) {
          return "success";
        } else {
          return "info";
        }
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
    TabelPageLayout, ShrinkCard
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.createTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  computed: {
    buttonType() {
      const { listQuery } = this;
      return function (key, value) {
        if (listQuery[key] === "") return "";
        return listQuery[key] === value ? "primary" : "";
      };
    },
  },
  filters: {
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await fetchList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async stopData(id, isStop, index) {
      try {
        await this.$confirm(
          `是否要${!isStop ? "启用" : "停用"}该参数?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        const res = await updateStatus({ id: id, isStop: !isStop });
        this.$message({
          message: "操作成功！",
          type: "success",
          duration: 1000,
        });
        this.list[index].isStop = res.data.isStop
        this.list[index].isEnable = res.data.isEnable
      } catch (error) { }
    },
    async deleteData(id, index) {
      try {
        await this.$confirm("是否要进行该删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await deleteData(id);
        this.$message({
          message: "删除成功！",
          type: "success",
          duration: 1000,
        });
        // this.getList();
        this.list.splice(index, 1)
      } catch (error) { }
    },
    handleOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoad = true
          addData({ ...this.formData }).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: res.message,
                type: "success",
                duration: 1000,
              });
              this.formData.parameterName = "";
              this.formData.parameterValue = "";
              this.dialogVisible = false
              this.getList();
            }
            this.isLoad = false
          });
        } else {
          return false;
        }
      });
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.createTimeAndEndTime = [];
      this.getList();
    },
    //添加弹框
    fromHandle() {
      this.dialogVisible = true;
      this.formData = Object.assign(this.formData, defaultFormData);
      this.$nextTick(() => {
        this.$refs["resourceForm"].resetFields();
      });
    },
    conditions(obj) {
      this.listQuery.pageNum = 1;
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
    // 获取类别
    async getType() {
      const res = await getType();
      this.types = res.data;
    },
    //日志弹框
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.dialogGournal = true;
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


