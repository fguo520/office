<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="状态：">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司：">
          <el-input clearable v-model="listQuery.logisticsCompany" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:3px">
      <el-button @click="handAdd()" size="mini" type="primary" v-if="rolePermissionJudge('/walmart/WalmartFreight/add')">新增物流方式</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="物流编号" align="center" width="150">
          <template slot-scope="scope">
            <div><span v-copy="scope.row.logisticsNo">{{scope.row.logisticsNo}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <div :style="scope.row.status === false?'color:#FF0000':'color:#67C23A'">{{scope.row.status|statusFilter}}</div>
          </template>
        </u-table-column>
        <u-table-column label="物流公司" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div><span v-copy="scope.row.logisticsCompany">{{scope.row.logisticsCompany}}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="支持发货仓" align="center" width="300">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="scope.row.define4" placement="top">
                <div class="tooltipClass">{{scope.row.define4}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="添加人" align="center" width="100">
          <template slot-scope="scope">
            <div>{{scope.row.define3}}</div>
          </template>
        </u-table-column>
        <u-table-column label="币种" align="center" width="100">
          <template slot-scope="scope">
            <div>{{scope.row.currency}}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div v-show="scope.row.createTime"><span>创建: </span>{{scope.row.createTime}}</div>
            <div v-show="scope.row.updateTime"><span>更新: </span>{{scope.row.updateTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="备注" align="center">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top">
                <div class="tooltipClass">{{scope.row.remark}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="handleupdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" @click="handExport(scope.row)" size="mini">导入</el-button>
            <el-popconfirm @confirm="handState(scope.row)" :title="`是否将该渠道变为${scope.row.status  ===true ? '停用' : '启用'}状态`">
              <el-button slot="reference" size="mini" type="text" :style="scope.row.status === true?'color:#FF0000':'color:#67C23A'">
                {{ scope.row.status === true ? '停用' : '启用' }}
              </el-button>
            </el-popconfirm>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <el-dialog :title="isFrom ? '新增物流方式' : '编辑物流方式'" :visible.sync="dialogFormVisible" width="1150px" custom-class="formDiv">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
        <div class="formDialog">
          <div style="display:flex">
            <div class="formDialog_item">
              <el-form-item label="物流公司: " prop="logisticsCompany">
                <el-input v-model="ruleForm.logisticsCompany" clearable size="mini" :disabled="!isFrom"></el-input>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="支持发货仓: " prop="shippingWarehouse" class="formCont">
                <ScrollSelect v-model="ruleForm.shippingWarehouse" :list="typeList.wareHouseList" />
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="币种: " prop="currency">
                <el-select v-model="ruleForm.currency" placeholder="全部" size="mini" class="input-width" filterable>
                  <el-option v-for="(item, index) in typeList.currencyList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div style="display:flex">
            <div class="formDialog_item">
              <el-form-item label="旺季附加费: ">
                <NumberInput v-model="ruleForm.additionalFee" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">
                    {{getCurrency(ruleForm.currency).label}}</i>
                </NumberInput>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="附加费开始日期: ">
                <el-date-picker v-model="ruleForm.additionalFeeBeginTime" type="datetime" placeholder="选择日期时间" default-time="00:00:00" value-format="yyyy-MM-dd HH:mm:ss" size="mini">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="附加费结束日期: ">
                <el-date-picker v-model="ruleForm.additionalFeeEndTime" type="datetime" placeholder="选择日期时间" default-time="23:59:59" size="mini" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>

          <div style="display:flex">
            <div class="formDialog_item">
              <el-form-item label="普货附加价格: " prop="generalPrice">
                <NumberInput v-model="ruleForm.generalPrice" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">{{getCurrency(ruleForm.currency).label}} KG</i>
                </NumberInput>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="带电附加价格: " prop="withBatteryPrice">
                <NumberInput v-model="ruleForm.withBatteryPrice" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">{{getCurrency(ruleForm.currency).label}} KG</i>
                </NumberInput>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="体积系数: " prop="volumeFactor">
                <NumberInput v-model="ruleForm.volumeFactor" float>
                </NumberInput>
              </el-form-item>
            </div>
          </div>

          <div style="display:flex">
            <div class="formDialog_item">
              <el-form-item label="最大周长: ">
                <NumberInput v-model="ruleForm.maxCircumference" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">CM</i>
                </NumberInput>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="海运头程单价: ">
                <NumberInput v-model="ruleForm.firstSeafreightUnitPrice" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">{{getCurrency(ruleForm.currency).label}} m³</i>
                </NumberInput>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="最小重量限制: " prop="minWeight">
                <NumberInput v-model="ruleForm.minWeight" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">KG</i>
                </NumberInput>
              </el-form-item>
            </div>
          </div>

          <div style="display:flex">
            <div class="formDialog_item">
              <el-form-item label="最大重量限制: " prop="maxWeight">
                <NumberInput v-model="ruleForm.maxWeight" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">KG</i>
                </NumberInput>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="最长边: ">
                <NumberInput v-model="ruleForm.longestSide" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">CM</i>
                </NumberInput>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="清关费: ">
                <NumberInput v-model="ruleForm.clearanceFee" float>
                  <i slot="suffix" style="font-style: normal; margin-right: 10px">{{getCurrency(ruleForm.currency).label}}</i>
                </NumberInput>
              </el-form-item>
            </div>
          </div>
          <div style="display:flex">
            <div class="formDialog_item">
              <el-form-item label="是否带电: " prop="isBattery">
                <el-select v-model="ruleForm.isBattery" placeholder="全部" size="mini" class="input-width" filterable>
                  <el-option v-for="(item, index) in typeList.electricityList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="带电物流属性: " prop="withBatteryLogisticsProperty" v-if="ruleForm.isBattery==1" class="formCont">
                <ScrollSelect v-model="ruleForm.withBatteryLogisticsProperty" :list="typeList.chargedlogisticsList" />
              </el-form-item>
            </div>
            <div class="formDialog_item">
              <el-form-item label="普货物流属性: " prop="generalCargoLogisticsProperty" v-if="ruleForm.isBattery==1" class="formCont">
                <ScrollSelect v-model="ruleForm.generalCargoLogisticsProperty" :list="typeList.chargedlogisticsList" />
              </el-form-item>
            </div>
          </div>
          <div style="display:flex">
            <el-form-item label="备注: ">
              <el-input v-model="ruleForm.remark" clearable size="mini" type="textarea" :rows="2" placeholder="请输入内容" maxlength="1000" show-word-limit style="width:570px"></el-input>
            </el-form-item>
          </div>
          <div style="clear:both"></div>
          <div style="text-align:right">
            <el-form-item label-width="0">
              <el-button @click="dialogFormVisible=false" size="mini">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="outerVisible" width="760px">
      <el-button type="primary" @click="handleExcel()" size="mini" style="margin-bottom:10px">导入物流方式报价</el-button>
      <u-table ref="childContainer" style="width: 100%" :data="childList" element-loading-text="数据加载中" border max-height="250px" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="报价单号" align="center" width="200">
          <template slot-scope="scope">
            <div><span v-copy="scope.row.quoteNo">{{scope.row.quoteNo}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <div>{{scope.row.status|statusFilter}}</div>
          </template>
        </u-table-column>
        <u-table-column label="导入人" align="center" width="100">
          <template slot-scope="scope">
            <div><span v-copy="scope.row.define3">{{scope.row.define3}}</span></div>
          </template>
        </u-table-column>
        <u-table-column label="导入时间" align="center" width="200">
          <template slot-scope="scope">
            <div>{{scope.row.importTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetails(scope.row.quoteNo)" size="mini">查看详情</el-button>
          </template>
        </u-table-column>

      </u-table>

      <el-dialog width="500px" title="详情" :visible.sync="innerVisible" append-to-body>
        <u-table ref="quoteNoContainer" style="width: 100%" :data="quoteNoList" element-loading-text="数据加载中" border max-height="250px" :header-cell-style="{ 'background-color': '#dadde3' }">
          <u-table-column label="重量区间kg" align="center" width="200">
            <template slot-scope="scope">
              <div><span>{{scope.row.minWeight}} ~ {{scope.row.maxWeight}}</span></div>
            </template>
          </u-table-column>
          <u-table-column label="单价" align="center">
            <template slot-scope="scope">
              <div><span>{{scope.row.unitPrice}}</span></div>
            </template>
          </u-table-column>
          <u-table-column label="处理费" align="center">
            <template slot-scope="scope">
              <div><span>{{scope.row.processFee}}</span></div>
            </template>
          </u-table-column>
          <u-table-column label="币种" align="center">
            <template slot-scope="scope">
              <div><span>{{scope.row.currency}}</span></div>
            </template>
          </u-table-column>
        </u-table>
      </el-dialog>

      <el-dialog title="导入" :visible.sync="excelVisible" width="576px" append-to-body @close="$refs.upload.clearFiles()">
        <el-form ref="resourceForm" label-width="150px" size="mini">
          <el-form-item label="下载模板：">
            <el-button size="mini" class="btn-add" @click="downExcel()">下载模板</el-button>
          </el-form-item>
          <el-form-item label="导入模板：">
            <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :auto-upload="false" multiple :limit="1" :file-list="fileList">
              <el-button size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="excelVisible=false" size="mini">取消</el-button>
          <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import {
  LogView,
  TabelPageLayout,
  ScrollSelect,
  ShrinkCard,
  NumberInput

} from "@/components";
import { getmainList, getCurrencylList, getWareHouseList, getlogisticsQuote, getLoglist, updateStatus, getlogisticsQuoteupdate, childList, logisticsQuoteInfo, logisticsQuoteImport, getLogisticsProperty, getTemplateUrl } from "@/api/walmart/walmartFreight"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  logisticsCompany: "",
  status: null,
};
const defaultruleForm = {
  logisticsCompany: "",
  shippingWarehouse: [],
  currency: "",
  additionalFee: null,
  additionalFeeBeginTime: "",
  additionalFeeEndTime: "",
  generalPrice: null,
  withBatteryPrice: null,
  volumeFactor: null,
  maxCircumference: null,
  firstSeafreightUnitPrice: null,
  minWeight: null,
  maxWeight: null,
  longestSide: null,
  clearanceFee: null,
  remark: "",
  isBattery: null,
  withBatteryLogisticsProperty: [],
  generalCargoLogisticsProperty: []
}
export default {
  name: "walmartFreight",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        statusList: [{ label: "停用", value: 0 },
        { label: "启用", value: 1 },],
        currencyList: [],
        wareHouseList: [],
        electricityList: [{ label: "是", value: 1 },
        { label: "否", value: 0 }],
        chargedlogisticsList: [],
      },
      isFrom: true,
      dialogFormVisible: false,
      ruleForm: Object.assign({}, defaultruleForm),
      rules: {
        logisticsCompany: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        shippingWarehouse: [{ required: true, message: "此项不能为空", trigger: "change" }],
        currency: [{ required: true, message: "此项不能为空", trigger: "change" }],
        additionalFee: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        additionalFeeBeginTime: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        additionalFeeEndTime: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        generalPrice: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        withBatteryPrice: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        volumeFactor: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        maxCircumference: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        firstSeafreightUnitPrice: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        minWeight: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        maxWeight: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        longestSide: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        clearanceFee: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        remark: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        isBattery: [{ required: true, message: "此项不能为空", trigger: "change" }],
        withBatteryLogisticsProperty: [{ required: true, message: "此项不能为空", trigger: "change" }],
        generalCargoLogisticsProperty: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
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
          id: ""
        },
      },
      outerVisible: false,
      innerVisible: false,
      excelVisible: false,
      childList: [],
      quoteNoList: [],
      fileList: [],
      formData: {
        logisticsNo: "",
        file: "", //文件
      },
      title: ""
    }
  },
  components: {
    LogView,
    TabelPageLayout,
    ScrollSelect,
    ShrinkCard,
    NumberInput
  },
  computed: {
    getCurrency() {
      return function (type) {
        switch (type) {
          case "RMB":
            return { label: "RMB" };
          case "USD":
            return { label: "USD" };
          default:
            return { label: "USD" }
        }
      }
    }
  },
  watch: {
    'ruleForm.additionalFeeBeginTime'(newValue) {
      this.ruleForm.additionalFeeBeginTime = newValue === null ? '' : newValue;
    },
    'ruleForm.additionalFeeEndTime'(newValue) {
      this.ruleForm.additionalFeeEndTime = newValue === null ? '' : newValue;
    }
  },
  filters: {
    statusFilter(type) {
      switch (type) {
        case false:
          return "停用";
        case true:
          return "启用"
        default:
          return "未知"
      }
    }
  },
  created() {
    this.getList();
    this.getType()
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getmainList({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const resCurrency = await getCurrencylList()
      const resWareHouse = await getWareHouseList()
      const resProperty = await getLogisticsProperty()
      this.typeList.currencyList = resCurrency.data
      this.typeList.wareHouseList = resWareHouse.data
      this.typeList.chargedlogisticsList = resProperty.data
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    async handState(row) {
      const res = await updateStatus({ id: row.id, status: row.status === true ? 0 : 1 })
      if (res.code === 200) {
        this.$message({
          type: "success",
          message: res.message
        })
        this.getList()
      }
    },
    handAdd() {
      this.dialogFormVisible = true
      this.isFrom = true
      this.ruleForm = Object.assign({}, defaultruleForm);
    },
    handleupdate(row) {
      this.ruleForm = {
        logisticsCompany: row.logisticsCompany,
        shippingWarehouse: row.shippingWarehouse.split(","),
        currency: row.currency,
        additionalFee: row.additionalFee,
        additionalFeeBeginTime: row.additionalFeeBeginTime,
        additionalFeeEndTime: row.additionalFeeEndTime,
        generalPrice: row.generalPrice,
        withBatteryPrice: row.withBatteryPrice,
        volumeFactor: row.volumeFactor,
        maxCircumference: row.maxCircumference,
        firstSeafreightUnitPrice: row.firstSeafreightUnitPrice,
        minWeight: row.minWeight,
        maxWeight: row.maxWeight,
        longestSide: row.longestSide,
        clearanceFee: row.clearanceFee,
        remark: row.remark,
        id: row.id,
        isBattery: row.isBattery ? 1 : 0,
        withBatteryLogisticsProperty: row.isBattery ? row.withBatteryLogisticsProperty.split(",") : "",
        generalCargoLogisticsProperty: row.isBattery ? row.generalCargoLogisticsProperty.split(",") : "",
      };
      this.isFrom = false;
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const shippingWarehouse = this.ruleForm.shippingWarehouse.join(",")
          const withBatteryLogisticsProperty = this.ruleForm.withBatteryLogisticsProperty ? this.ruleForm.withBatteryLogisticsProperty.join(",") : ""
          const generalCargoLogisticsProperty = this.ruleForm.generalCargoLogisticsProperty ? this.ruleForm.generalCargoLogisticsProperty.join(",") : ""
          //新建
          if (this.isFrom) {
            getlogisticsQuote({ ...this.ruleForm, shippingWarehouse, withBatteryLogisticsProperty, generalCargoLogisticsProperty }).then(res => {
              if (res.code == 200) {
                this.dialogFormVisible = false
                this.$message.success(res.message)
                this.getList()
              }
            })
          } else {
            //编辑
            getlogisticsQuoteupdate({ ...this.ruleForm, shippingWarehouse, withBatteryLogisticsProperty, generalCargoLogisticsProperty }).then(res => {
              if (res.code == 200) {
                this.dialogFormVisible = false
                this.$message.success(res.message)
                this.getList()
              }
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    async handExport(row) {
      this.outerVisible = true
      const res = await childList({ quoteNo: "", logisticsNo: row.logisticsNo })
      this.formData.logisticsNo = row.logisticsNo
      this.childList = res.data
      this.title = this.childList.length > 0 ? this.childList[0].define4 : ""
    },
    async handleDetails(quoteNo) {
      this.innerVisible = true
      const res = await logisticsQuoteInfo({ quoteNo: quoteNo })
      this.quoteNoList = res.data
    },
    handleExcel() {
      this.excelVisible = true
    },
    downExcel() {
      getTemplateUrl({ logisticsNo: this.formData.logisticsNo }).then(res => {
        if (res.code == 200) {
          window.open(res.data, '_self');
        }
      })
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
    },
    async handleOk() {
      if (this.formData.file == "") {
        this.$message.warning("请选择csv文件");
        return false;
      }
      if (this.formData.logisticsNo == "") {
        this.$message.warning("请选择物流单号");
        return false;
      }
      for (let i = 0; i < this.formData.file.length; i++) {
        const formData = new FormData();
        formData.append("file", this.formData.file[i]);
        formData.append("logisticsNo", this.formData.logisticsNo);
        const res = await logisticsQuoteImport(formData)
        if (res.code == 200) {
          this.$message.success(res.message);
          this.getList();
          this.excelVisible = false
          const resChild = await childList({ quoteNo: "", logisticsNo: this.formData.logisticsNo })
          this.childList = resChild.data
        }

      }
    },
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }
}
.formDiv .el-dialog__body {
  .el-form {
    .formDialog {
      overflow: hidden;
      .formDialog_item {
        width: 369px;
        float: left;
        height: 65px;
        .el-form-item /deep/.el-form-item__content {
          width: 200px;
        }
        .formCont /deep/ .el-form-item__content .el-form-item__error {
          margin-top: -15px;
        }
        .el-date-editor {
          width: 200px;
        }
      }
    }
  }
}
</style>