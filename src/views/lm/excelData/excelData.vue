<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" ref="ruleForm" size="mini" label-width="120px" :rules="rules" :model="saveLmTypelist">
        <el-divider content-position="left">
          <i class="el-icon-search" />
          <span>任务条件</span>
        </el-divider>
        <el-form-item label="数据类型：" prop="lmTypeParameterCode">
          <el-cascader v-model="SysParameterCodeTreeValue" :options="typeList" clearable :props="{ label: 'parameterValue', value: 'parameterCode' }" @change="handtypeList()" />
        </el-form-item>
        <el-form-item :label="handTitle(saveLmTypelist.lmTypeParameterCode)" prop="createTimeAndEndTime">
          <el-date-picker @change="timeChange" v-model="saveLmTypelist.createTimeAndEndTime" type="daterange" :picker-options="pickerOptions" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
        <el-form-item label="发货时间：" prop="shipStartTimeList" v-if="isTime">
          <el-date-picker v-model="saveLmTypelist.shipStartTimeList" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
        <el-form-item label="平台：" prop="lmSysParameterCode" v-if="ishandType">
          <el-select v-model="saveLmTypelist.lmSysParameterCode" clearable placeholder="请选择" size="mini">
            <el-option v-for="item in sysQueryExcelList" :key="item.parameterCode" :label="item.parameterName" :value="item.parameterCode" />
          </el-select>
        </el-form-item>
        <div style="float: right">
          <el-button @click="resetQuery('ruleForm')" size="mini">重置</el-button>
          <el-button @click="handsaveExcel('ruleForm')" type="primary" size="mini">提交</el-button>
        </div>
      </el-form>
      <el-form :inline="true" size="mini" label-width="120px">
        <el-divider content-position="left">
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
        </el-divider>
        <el-form-item label="任务单号：">
          <el-input v-model="listQuery.taskNo" class="input-width" placeholder="请输入" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据类型：">
          <el-cascader v-model="SysParameterCodeTreequeryValue" :options="SysParData" clearable :props="{ label: 'parameterValue', value: 'parameterCode' }" @change="handSysParData()" />
        </el-form-item>
        <el-form-item label="创建人：">
          <el-select v-model="listQuery.adminId" clearable placeholder="请选择" size="mini" filterable>
            <el-option v-for="(item,index) in adminData" :key="index" :label="item.fullName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker @change="createtimeChange" v-model="listQuery.createTimeData" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
        <div style="float: right">
          <el-button size="mini" class="btn-add" type="primary" @click="handleExcel()" v-if="rolePermissionJudge('/lm/excel/export')">导入</el-button>
          <el-button @click="resetOption()" size="mini">重置</el-button>
          <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
        </div>
      </el-form>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.status" :ButtonTypes="statusData" @request="getList" />
    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="任务单号" width="150" align="center">
          <template #default="{ row }">
            <div v-copy="row.lmTaskNo">{{ row.lmTaskNo }}</div>
          </template>
        </u-table-column>
        <u-table-column label="任务名称" align="center">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>{{ row.taskName }}</div>
              <div v-show="row.startShipTime"><span>发货时间：</span>{{row.startShipTime}}-{{row.endShipTime}}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="创建任务人" prop="createUserName" width="120" align="center"></u-table-column>
        <u-table-column label="生成状态" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.status | statusFilter }}
          </template>
        </u-table-column>
        <u-table-column label="数据来源" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.sourceName }}
          </template>
        </u-table-column>
        <u-table-column label="创建任务时间" width="200" prop="createTime" align="center"></u-table-column>
        <u-table-column label="生成报告时间" width="200" prop="completeTime" align="center"></u-table-column>
        <u-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handlejournal(scope.row.id)">日志</el-button>
            <el-button type="text" size="mini" @click="handtlcComplete(scope.row.id)" v-if="scope.row.isCompleteUrl == '1'">下载报告</el-button>
            <el-button type="text" size="mini" @click="handgetExportlUrl(scope.row.id)" v-if="scope.row.sourceName == '导入'">下载源数据</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <!-- 导出 -->
    <el-dialog title="导入" :visible.sync="dialogVisible" v-if="dialogVisible" width="576px">
      <el-form ref="resourceForm" label-width="150px" size="mini">
        <el-form-item label="平台：">
          <el-select v-model="formData.lmSysParameterCode" clearable placeholder="请选择" size="mini" @change="getParameterCodeExcel()">
            <el-option v-for="item in sysQueryExcelList" :key="item.parameterCode" :label="item.parameterName" :value="item.parameterCode"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据类型：">
          <el-select v-model="formData.lmTypeParameterCode" clearable placeholder="请选择" size="mini">
            <el-option v-for="item in typeQueryExcelList" :key="item.parameterCode" :label="item.parameterValue" :value="item.parameterCode"></el-option>
          </el-select>
          <a id="a_id"></a>
          <el-button size="mini" class="btn-add" @click="downExcel()" style="margin-left: 20px">下载模板</el-button>
        </el-form-item>
        <el-form-item label="导入模板：">
          <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :auto-upload="false" multiple :limit="10" :file-list="fileList">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 日志 -->
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import {
  getShDataExportlList,
  getLmShExcelTemplate,
  getLmShDataExportLogList,
  getExportlcCompleteUrl,
  getExportlUrl,
  saveLmDataExportTask,
  delRepeatData,
  getSysParameterCodeList,
  getLmExcelsaveOrderRefundCsv,
  getUmsAdmin,
  queryLmSysParameterCodeTree,
  getLmSysParameterCodeTree,
} from "@/api/Im/excelData";
import { LogView, RadioButtonGroup, TabelPageLayout, ShrinkCard } from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  taskNo: "",
  status: "",
  adminId: "",
  lmTypeParameterCode: "",
  startTime: "",
  endTime: "",
  createTimeData: [],
};
export default {
  name: "excelData",
  data() {
    return {
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      statusData: [
        { label: "待生成", value: "0" },
        { label: "生成中", value: "1" },
        { label: "已生成", value: "2" },
        { label: "生成失败", value: "3" },
      ],
      total: null,
      listLoading: false,
      dialogVisible: false,
      formData: {
        lmSysParameterCode: "", //平台
        lmTypeParameterCode: "", //数据类型
        file: "", //文件
      },
      sysQueryExcelList: [],
      typeQueryExcelList: [],
      sysQueryExcel: {
        parameterName: "", //数据类型
        parameterSearchType: "", //平台
        isTopClass: false,
      },
      fileList: [],
      typeList: [],
      LogDialogVisible: false,
      TaskLogList: [],
      TaskLogData: {
        pageNum: 1,
        pageSize: 5,
        total: null,
        id: "",
      },
      saveLmTypelist: {
        endTime: "",
        lmTypeParameterCode: "",
        lmSysParameterCode: "",
        startTime: "",
        createTimeAndEndTime: [],
        shipStartTimeList: [],
        shipStartTime: "",
        shipEndTime: ""
      },
      ishandType: false,
      isTime: false,
      rules: {
        lmTypeParameterCode: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        createTimeAndEndTime: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        lmSysParameterCode: [
          { required: false, message: "此项不能为空", trigger: "change" },
        ],
        shipStartTimeList: [
          { required: false, message: "此项不能为空", trigger: "change" },
        ],
      },
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeName", width: "120" },
          { label: "操作人", property: "createUserName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getLmShDataExportLogList,
        param: {
          id: "",
        },
      },
      SysParData: [],
      adminData: [],
      createTimeData: [],
      data1Map: new Map(),
      data2Map: new Map(),
      pickerMinDate: null,
      pickerMaxDate: null,
      day31: 31 * 24 * 3600 * 1000,
      // 日期使用
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          if (minDate && this.pickerMinDate) {
            this.pickerMinDate = null;
          } else if (minDate) {
            this.pickerMinDate = minDate.getTime();
          }
        },
        // disabledDate: (time) => {
        //   if (this.pickerMinDate) {
        //     return (
        //       time.getTime() > this.pickerMinDate + this.day31 ||
        //       time.getTime() < this.pickerMinDate - this.day31
        //     );
        //   }
        //   return false;
        // },
      },
      SysParameterCodeTreequeryValue: [], //数据筛选类型
      SysParameterCodeTreeValue: [], //数据条件类型
    };
  },
  watch: {
    'saveLmTypelist.shipStartTimeList': function (newValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.saveLmTypelist.shipStartTime = timeArr[0];
      this.saveLmTypelist.shipEndTime = timeArr[1];
    }
  },
  computed: {
    handTitle() {
      return function (type) {
        if (type == '10573') {
          return "新品添加时间："
        } else {
          return "统计时间："
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
  components: {
    LogView,
    RadioButtonGroup,
    TabelPageLayout,
    ShrinkCard
  },
  filters: {
    statusFilter(value) {
      switch (value) {
        case 0:
          return "待生成";
        case 1:
          return "生成中";
        case 2:
          return "已生成";
        case 3:
          return "生成失败";
        case -1:
          return "删除";
      }
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getShDataExportlList(this.listQuery);
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
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.SysParameterCodeTreequeryValue = [];
      this.getList();
    },
    //数据类型
    getType() {
      getLmSysParameterCodeTree().then((response) => {
        this.typeList = response.data;
        // console.log(this.typeList);
      });
      getUmsAdmin().then((response) => {
        this.adminData = response.data;
      });
      queryLmSysParameterCodeTree().then((response) => {
        this.SysParData = response.data;
      });
      getSysParameterCodeList({
        parameterName: "", //数据类型
        parameterSearchType: "平台", //平台
        isTopClass: false,
      }).then((response) => {
        this.sysQueryExcelList = response.data;
      });
    },
    timeChange() {
      if (this.saveLmTypelist.createTimeAndEndTime != null) {
        this.saveLmTypelist.startTime = this.saveLmTypelist.createTimeAndEndTime[0];
        this.saveLmTypelist.endTime = this.saveLmTypelist.createTimeAndEndTime[1];
      } else {
        this.saveLmTypelist.startTime = "";
        this.saveLmTypelist.endTime = "";
      }
    },
    createtimeChange() {
      if (this.listQuery.createTimeData != null) {
        this.listQuery.startTime = this.listQuery.createTimeData[0];
        this.listQuery.endTime = this.listQuery.createTimeData[1];
      } else {
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },
    //提交任务
    handsaveExcel(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveLmDataExportTask({
            startTime: this.saveLmTypelist.startTime,
            endTime: this.saveLmTypelist.endTime,
            lmTypeParameterCode: this.SysParameterCodeTreeValue.slice(-1)[0],
            lmSysParameterCode: this.saveLmTypelist.lmSysParameterCode,
            shipStartTime: this.saveLmTypelist.shipStartTime,
            shipEndTime: this.saveLmTypelist.shipEndTime,
          }).then((response) => {
            this.$message.success(response.message);
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
    resetQuery(formName) {
      this.$refs[formName].resetFields();
      this.saveLmTypelist = {
        ...this.saveLmTypelist,
        startTime: "",
        endTime: "",
        lmTypeParameterCode: "",
        lmSysParameterCode: "",
        createTimeAndEndTime: [],
        shipStartTime: "",
        shipEndTime: '',
        shipStartTimeList: []
      };
      this.SysParameterCodeTreeValue = [];
      this.ishandType = false;
      // this.getList();
    },
    //导入页面
    handleExcel() {
      this.formData = {
        ...this.formData,
        lmSysParameterCode: "",
        lmTypeParameterCode: "",
        file: "",
      };
      this.dialogVisible = true;
      this.sysQueryExcel.parameterSearchType = "平台";
      this.sysQueryExcel.parameterName = "";
      this.getListCodeExcel();
    },
    getParameterCodeExcel() {
      this.formData = {
        ...this.formData,
        lmTypeParameterCode: "",
      };
      let id = this.formData.lmSysParameterCode;
      let selectedWorkName = {};
      selectedWorkName = this.sysQueryExcelList.find((item) => {
        //这里的chargingWorkNameList就是上面遍历的数据源
        return item.parameterCode === id;
        //筛选出匹配数据，是对应数据的整个对象
      });
      this.sysQueryExcel.parameterName = selectedWorkName.parameterName;
      this.sysQueryExcel.parameterSearchType = "报告中心-01-导入";
      getSysParameterCodeList(this.sysQueryExcel).then((response) => {
        this.typeQueryExcelList = response.data;
      });
    },
    getListCodeExcel() {
      getSysParameterCodeList(this.sysQueryExcel).then((response) => {
        this.sysQueryExcelList = response.data;
      });
    },
    downExcel() {
      if (!this.formData.lmSysParameterCode) {
        this.$message.error("请选择平台");
        return;
      }
      if (!this.formData.lmTypeParameterCode) {
        this.$message.error("请选择数据类型");
        return;
      }
      getLmShExcelTemplate(this.formData).then((response) => {
        //console.dir(response);
        if (response.data == null) {
          this.$message.error("暂无模板");
        } else {
          window.open(response.data.url, '_self');
        }
      });
    },
    //导入模板确定
    handleOk() {
      // console.log(this.formData.file);
      if (this.formData.file == "") {
        this.$message.warning("请选择csv文件");
        return false;
      }
      for (let i = 0; i < this.formData.file.length; i++) {
        const formData = new FormData();
        formData.append("file", this.formData.file[i]);
        formData.append("lmSysParameterCode", this.formData.lmSysParameterCode);
        formData.append(
          "lmTypeParameterCode",
          this.formData.lmTypeParameterCode
        );
        getLmExcelsaveOrderRefundCsv(formData)
          .then((response) => {
            this.$message.success(response.message);
            this.getList();
          })
          .catch((error) => {
            // console.log(error);
            if (error.code == 1110) {
              this.$confirm(`${error.message}, 点击覆盖?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  delRepeatData({
                    lmTypeParameterCode: this.formData.lmTypeParameterCode,
                    taskNo: error.data,
                  }).then((response) => {
                    this.$message({
                      type: "success",
                      message: "覆盖成功!",
                    });
                    getLmExcelsaveOrderRefundCsv(formData).then((response) => {
                      this.$message.success(response.message);
                      this.getList();
                    });
                    this.dialogVisible = false;
                    // this.getList();
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消覆盖",
                  });
                });
            }
          });
      }
    },
    // 导入
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (
        Xls[Xls.length - 1] !== "xls" &&
        Xls[Xls.length - 1] !== "xlsx" &&
        Xls[Xls.length - 1] !== "csv"
      ) {
        this.$message.warning("请选择csv文件");
        this.$refs.upload.clearFiles();
        return false;
      }
      const fileLists = fileList.map((i) => {
        return i.raw;
      });
      this.formData.file = fileLists;
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    handtlcComplete(id) {
      getExportlcCompleteUrl(id).then((response) => {
        window.open(response.data, "_self");
      });
    },
    handgetExportlUrl(id) {
      getExportlUrl(id).then((response) => {
        window.open(response.data, "_self");
      });
    },
    //数据筛选类型
    handSysParData() {
      this.listQuery.lmTypeParameterCode = this.SysParameterCodeTreequeryValue[1];
    },
    //数据条件类型
    handtypeList() {
      this.saveLmTypelist.lmTypeParameterCode = this.SysParameterCodeTreeValue.slice(-1)[0];
      if (this.saveLmTypelist.lmTypeParameterCode == "10297") {
        this.ishandType = true;
        this.rules.lmSysParameterCode[0].required = true;
      } else if (this.saveLmTypelist.lmTypeParameterCode == "10573") {
        this.isTime = true
        this.rules.shipStartTimeList[0].required = true;
      } else {
        this.ishandType = false;
        this.rules.lmSysParameterCode[0].required = false;
        this.isTime = false
        this.rules.shipStartTimeList[0].required = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-divider--horizontal {
  margin: 0px 0 20px 0;
}
</style>