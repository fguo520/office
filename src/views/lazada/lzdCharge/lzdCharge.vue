<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="国家:" v-if="ifstatus == 0">
          <el-select v-model="listQuery.countryCn" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in countryList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板编号:" v-if="ifstatus == 1">
          <el-input clearable v-model="listQuery.templateNo" size="mini" placeholder="支持模糊查询" />
        </el-form-item>
        <el-form-item label="导入时间:" v-if="ifstatus == 1">
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态:" v-if="ifstatus == 1">
          <el-button @click="conditions({ status: 0 })" :type="buttonType('status', 0)" size="mini" :autofocus="true">
            停用
          </el-button>
          <el-button @click="conditions({ status: 1 })" :type="buttonType('status', 1)" size="mini">
            启用
          </el-button>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button size="mini" v-show="ifstatus == 1" class="btn-add" type="primary" @click="handleExcel()" v-if="rolePermissionJudge('/lzd/charge/export')">导入
        </el-button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="ifstatus" :ButtonTypes="states" @request="getList" />
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="rateData" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" v-if="ifstatus == 0" key="tableRate">
        <u-table-column label="国家" align="center">
          <template #default="{ row }">
            <div v-copy="row.countryCn">{{row.countryCn}}</div>
          </template>
        </u-table-column>
        <u-table-column label="退换货率%" align="center">
          <template #default="{ row }">
            {{Number(row.returnRate) * 100}}
          </template>
        </u-table-column>
        <!-- <u-table-column label="利润率%" align="center">
          <template #default="{ row }">
            {{Number(row.profitRate) * 100}}
          </template>
        </u-table-column> -->
        <u-table-column label="佣金率%" align="center">
          <template #default="{ row }">
            {{ Number(row.commissionRate) * 100 }}
          </template>
        </u-table-column>
        <u-table-column label="付款手续费%" align="center">
          <template #default="{ row }">
            {{  Number(row.payFeesRate) * 100 }}
          </template>
        </u-table-column>
        <u-table-column label="提现手续费%" align="center">
          <template #default="{ row }">
            {{ Number(row.withdrawalFeesRate) * 100}}
          </template>
        </u-table-column>
        <u-table-column label="汇率折损率%" align="center">
          <template #default="{ row }">
            {{ Number(row.exchangeRate) * 100}}
          </template>
        </u-table-column>
        <u-table-column label="修改人" align="center" prop="updateUser" />
        <u-table-column label="修改时间" align="center" prop="updateTime" />
        <u-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="handleupdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>

      <u-table ref="tableContainer2" style="width: 100%" :data="templateData" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" v-if="ifstatus == 1" key="tableTemplate">
        <u-table-column label="运费模板编号" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.templateNo">{{scope.row.templateNo}}</div>
          </template>
        </u-table-column>
        <u-table-column label="模板名称" align="center" width="600">
          <template slot-scope="scope">
            <div v-copy="scope.row.templateName" style="text-align:left">{{scope.row.templateName}}</div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div :style="scope.row.status === 0?'color:#FF0000':'color:#67C23A'">{{ scope.row.status | statusFilter }}</div>
          </template>
        </u-table-column>
        <u-table-column label="导入人" align="center" prop="importPerson" />
        <u-table-column label="导入时间" align="center" prop="importTime" />
        <u-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.downloadLink">
              <el-link type="primary" :underline="false" :href="scope.row.downloadLink">下载数据</el-link>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <!-- 导出 -->
    <el-dialog title="导入" :visible.sync="dialogVisible" v-if="dialogVisible" width="576px">
      <el-form ref="resourceForm" label-width="150px" size="mini">
        <el-form-item label="数据类型：">
          <el-select v-model="formData.dataType" clearable placeholder="请选择" size="mini">
            <el-option v-for="(item, index) in typeQueryExcelList" :key="index" :label="item" :value="item" />
          </el-select>
          <a id="a_id"></a>
          <el-button size="mini" class="btn-add" @click="downExcel()" style="margin-left: 20px">下载模板</el-button>
        </el-form-item>
        <el-form-item label="导入模板：">
          <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :auto-upload="false" multiple :limit="1" :file-list="fileList">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />

    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="700px" custom-class="formDiv">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <div class="formDialog">
          <div class="formDialog_item">
            <el-form-item label="佣金率: " prop="commissionRate">
              <NumberInput v-model="ruleForm.commissionRate" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="汇率折损率: " prop="exchangeRate">
              <NumberInput v-model="ruleForm.exchangeRate" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="付款手续费: " prop="payFeesRate">
              <NumberInput v-model="ruleForm.payFeesRate" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item" style="display:none">
            <el-form-item label="利润率: " prop="profitRate">
              <NumberInput v-model="ruleForm.profitRate" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="退换货率: " prop="returnRate">
              <NumberInput v-model="ruleForm.returnRate" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="提现手续费: " prop="withdrawalFeesRate">
              <NumberInput v-model="ruleForm.withdrawalFeesRate" max="100" min="0" float>
                <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
              </NumberInput>
            </el-form-item>
          </div>
          <div style="clear: both"></div>
          <div style="text-align: center">
            <el-form-item label-width="0">
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </TabelPageLayout>
</template>
<script>
import { TabelPageLayout, RadioButtonGroup, LogView, ShrinkCard, NumberInput } from "@/components";
import {
  getRateList,
  geTemplateList,
  getLoglist,
  getUpdate,
  getImport,
} from "@/api/lazada/lzdCharge";
const rateList = {
  pageNum: 1,
  pageSize: 50,
  dataType: 0,
  countryCn: "",
  status: "",
  templateNo: "",
  importBeginTime: "",
  importEndTime: "",
};
const templateList = {
  pageNum: 1,
  pageSize: 50,
  dataType: 1,
  status: "",
  templateNo: "",
  importBeginTime: "",
  importEndTime: "",
  countryCn: "",
};
const defaultruleForm = {
  commissionRate: null,
  exchangeRate: null,
  payFeesRate: null,
  profitRate: null,
  returnRate: null,
  withdrawalFeesRate: null,
};
export default {
  name: "lzdCharge",
  data() {
    return {
      listQuery: Object.assign({}, rateList),
      total: null,
      dialogVisible: false,
      listLoading: false,
      rateData: [],
      templateData: [],
      states: [
        { label: "收费明细", value: 0 },
        { label: "运费模板", value: 1 },
      ],
      ifstatus: 0,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "operationPerson", width: "120" },
          { label: "操作时间", property: "operationTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getLoglist,
        param: {
          id: "",
        },
      },
      dialogFormVisible: false,
      ruleForm: Object.assign({}, defaultruleForm),
      rules: {
        commissionRate: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        exchangeRate: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        payFeesRate: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        profitRate: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        returnRate: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        withdrawalFeesRate: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
      },
      countryList: [
        { label: "新加坡", value: "新加坡" },
        { label: "马来西亚", value: "马来西亚" },
        { label: "菲律宾", value: "菲律宾" },
        { label: "泰国", value: "泰国" },
        { label: "印度尼西亚", value: "印度尼西亚" },
        { label: "越南", value: "越南" },
      ],
      fileList: [],
      typeQueryExcelList: ["运费模板"],
      formData: {
        dataType: "",
        file: "", //文件
      },
      createTimeAndEndTime: [],
    };
  },
  components: {
    TabelPageLayout,
    RadioButtonGroup,
    LogView,
    ShrinkCard,
    NumberInput
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.importBeginTime = timeArr[0];
      this.listQuery.importEndTime = timeArr[1];
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
    statusFilter(type) {
      switch (type) {
        case 0:
          return "停用";
        case 1:
          return "启用";
      }
    },
  },
  created() {
    this.getList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      if (this.ifstatus == 0) {
        this.listLoading = true;
        try {
          const res = await getRateList(this.listQuery);
          this.rateData = res.data.list;
          this.total = res.data.total;
        } catch (error) {
          this.rateData = [];
          this.total = 0;
        }
        this.listLoading = false;
      } else {
        this.listLoading = true;
        try {
          const res = await geTemplateList(this.listQuery);
          this.templateData = res.data.list;
          this.total = res.data.total;
        } catch (error) {
          this.templateData = [];
          this.total = 0;
        }
        this.listLoading = false;
      }
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    resetOption() {
      if (this.ifstatus == 0) {
        this.listQuery = Object.assign({}, rateList);
        this.getList();
      } else {
        this.listQuery = Object.assign({}, templateList);
        this.createTimeAndEndTime = [];
        this.getList();
      }
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    //编辑
    handleupdate(row) {
      this.ruleForm = {
        commissionRate: Number(row.commissionRate) * 100,
        exchangeRate: Number(row.exchangeRate) * 100,
        payFeesRate: Number(row.payFeesRate) * 100,
        profitRate: Number(row.profitRate) * 100,
        returnRate: Number(row.returnRate) * 100,
        withdrawalFeesRate: Number(row.withdrawalFeesRate) * 100,
        id: row.id,
      };
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUpdate({
            commissionRate: Number(this.ruleForm.commissionRate) / 100,
            exchangeRate: Number(this.ruleForm.exchangeRate) / 100,
            payFeesRate: Number(this.ruleForm.payFeesRate) / 100,
            profitRate: Number(this.ruleForm.profitRate) / 100,
            returnRate: Number(this.ruleForm.returnRate) / 100,
            withdrawalFeesRate: Number(this.ruleForm.withdrawalFeesRate) / 100,
            id: this.ruleForm.id,
          }).then((res) => {
            this.$message.success(res.message);
            this.dialogFormVisible = false;
            this.getList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleExcel() {
      this.dialogVisible = true;
    },
    downExcel() {
      window.open(
        "https://lemontree-test.oss-cn-shenzhen.aliyuncs.com/lazada/Lazada%E8%BF%90%E8%B4%B9%E6%95%B0%E6%8D%AE%E6%A8%A1%E6%9D%BF.xlsx", '_self'
      );
    },
    handleChange(e, fileList) {
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (
        Xls[Xls.length - 1] !== "xls" &&
        Xls[Xls.length - 1] !== "xlsx" &&
        Xls[Xls.length - 1] !== "csv"
      ) {
        this.$message.warning("请选择正确格式文件");
        this.$refs.upload.clearFiles();
        return false;
      }
      const fileLists = fileList.map((i) => {
        return i.raw;
      });
      this.formData.file = fileLists;
      console.log(this.formData.file);
    },
    handleOk() {
      if (this.formData.file == "") {
        this.$message.warning("请选择csv文件");
        return false;
      }
      if (this.formData.dataType == "") {
        this.$message.warning("请选择数据类型");
        return false;
      }
      for (let i = 0; i < this.formData.file.length; i++) {
        const formData = new FormData();
        formData.append("file", this.formData.file[i]);
        formData.append("dataType", this.formData.dataType);
        getImport(formData).then((response) => {
          this.$message.success(response.message);
          this.getList();
        });
      }
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
  },
};
</script>
<style  lang="scss" scoped>
.el-divider {
  margin: 0;
  margin-bottom: 24px;
}
.formDiv .el-dialog__body {
  .el-form {
    .formDialog {
      overflow: hidden;
      .formDialog_item {
        width: 50%;
        float: left;
        .el-form-item /deep/.el-form-item__content {
          width: 180px;
        }
      }
    }
  }
}
</style>