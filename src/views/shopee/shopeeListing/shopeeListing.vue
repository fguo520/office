<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="自定义参数:">
          <el-select v-model="listQuery.paramType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.paramTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <TextareaInput v-model="listQuery.paramValue" />
        </el-form-item>
        <el-form-item label="渠道:">
          <el-select v-model="listQuery.storeName" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.storeNameList" :key="index" :label="item.storeNameAs" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态:">
          <ScrollSelect v-model="listQuery.productState" :list="typeList.productStatusList" />
        </el-form-item>
        <el-form-item label="低于成本价:">
          <el-select v-model="listQuery.isCostPrice" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.costPriceList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参与折扣:">
          <el-select v-model="listQuery.isDiscount" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.discountList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否预定单:">
          <el-select v-model="listQuery.isPreOrder" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.preOrderList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="刊登时间:">
          <el-date-picker v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
        <el-form-item label="自定义查询:">
          <el-select v-model="listQuery.paramCustom" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.customList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <NumberInput v-model="listQuery.startParamCustomValue" min="0" float style="width:80px"></NumberInput> —
          <NumberInput v-model="listQuery.endParamCustomValue" :min="listQuery.startParamCustomValue" float style="width:80px"></NumberInput>
        </el-form-item>
        <el-form-item label="模式:">
          <div class="buttonContainer">
            <el-button @click="conditions({ isVariant: 0 })" :type="buttonType('isVariant', 0)" size="mini">非变体</el-button>
            <el-button @click="conditions({ isVariant: 1 })" :type="buttonType('isVariant', 1)" size="mini">变体</el-button>
          </div>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.businessStatus" :ButtonTypes="states" @request="getList" :doubleCancle="false">
      <template #1>
        <el-dropdown @command="handleCommand">
          <el-button size="mini" class="radioBtn">
            批量操作<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="out" v-if="rolePermissionJudge('/shopeeListing/out')">批量下架</el-dropdown-item>
            <el-dropdown-item command="price" v-if="rolePermissionJudge('/shopeeListing/price')">批量修改价格</el-dropdown-item>
            <el-dropdown-item command="stock" v-if="rolePermissionJudge('/shopeeListing/stock')">批量修改库存</el-dropdown-item>
            <el-dropdown-item command="day" v-if="rolePermissionJudge('/shopeeListing/day')">批量修改出货天数</el-dropdown-item>
            <el-dropdown-item command="remove" v-if="rolePermissionJudge('/shopeeListing/delect')">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="getCost" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/export')">导出成本价</el-button>
        <el-button @click="excelVisible=true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/sku')">导入渠道SKU</el-button>
      </template>
      <template #2>
        <el-dropdown @command="handleCommand">
          <el-button size="mini" class="radioBtn">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add" v-if="rolePermissionJudge('/shopeeListing/add')">批量上架</el-dropdown-item>
            <el-dropdown-item command="price" v-if="rolePermissionJudge('/shopeeListing/price')">批量修改价格</el-dropdown-item>
            <el-dropdown-item command="stock" v-if="rolePermissionJudge('/shopeeListing/stock')">批量修改库存</el-dropdown-item>
            <el-dropdown-item command="day" v-if="rolePermissionJudge('/shopeeListing/day')">批量修改出货天数</el-dropdown-item>
            <el-dropdown-item command="remove" v-if="rolePermissionJudge('/shopeeListing/delect')">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="getCost" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/export')">导出成本价</el-button>
        <el-button @click="excelVisible=true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/sku')">导入渠道SKU</el-button>
      </template>
      <template #3>
        <el-button @click="excelVisible=true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/sku')">导入渠道SKU</el-button>
      </template>
      <template #4>
        <el-dropdown @command="handleCommand">
          <el-button size="mini" class="radioBtn">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="out" v-if="rolePermissionJudge('/shopeeListing/out')">批量下架</el-dropdown-item>
            <el-dropdown-item command="price" v-if="rolePermissionJudge('/shopeeListing/price')">批量修改价格</el-dropdown-item>
            <el-dropdown-item command="stock" v-if="rolePermissionJudge('/shopeeListing/stock')">批量修改库存</el-dropdown-item>
            <el-dropdown-item command="day" v-if="rolePermissionJudge('/shopeeListing/day')">批量修改出货天数</el-dropdown-item>
            <el-dropdown-item command="remove" v-if="rolePermissionJudge('/shopeeListing/delect')">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="getCost" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/export')">导出成本价</el-button>
        <el-button @click="excelVisible=true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/sku')">导入渠道SKU</el-button>
      </template>
      <template #5>
        <el-dropdown @command="handleCommand">
          <el-button size="mini" class="radioBtn">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="remove" v-if="rolePermissionJudge('/shopeeListing/delect')">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="excelVisible=true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/sku')">导入渠道SKU</el-button>
      </template>
      <template #6>
        <el-button @click="excelVisible=true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/sku')">导入渠道SKU</el-button>
      </template>
      <template #7>
        <el-button @click="excelVisible=true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/sku')">导入渠道SKU</el-button>
      </template>
      <template #8>
        <el-button @click="excelVisible=true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeeListing/sku')">导入渠道SKU</el-button>
      </template>
    </RadioButtonGroup>
    <template #dropdown>
      <span @click="batchCopyRow('shopSku')">
        <el-dropdown-item>批量复制渠道SKU</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('itemId')">
        <el-dropdown-item>批量复制itemId</el-dropdown-item>
      </span>
    </template>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" @selection-change="handleSelectionChange" row-id="random" :default-expand-all="false" :treeConfig="{lazy: true, load:loadTableTree }" v-if="isDisplaymode">
        <u-table-column type="selection" width="50" />
        <u-table-column label="ItemID" align="center" width="140" :tree-node="true">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.itemId" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" :href="scope.row.url" target="_blank">
                  {{ scope.row.itemId }}
                </el-link>
              </div>
            </div>
            <div>
              <div v-show="Boolean(scope.row.hasVariation)" style="background-color: #67c23a; color: #fff">变体</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.imageUrl" style="width: 100px" />
            <div :style="getProductstate(scope.row.productState)">
              {{ scope.row.productState }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="sku" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
                  {{ scope.row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'渠道sku:'+scope.row.shopSku" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="scope.row.shopSku">{{
                    scope.row.shopSku
                  }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="类目&分类" align="center" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.categoryName" placement="top">
              <div class="tooltipClass">
                <span v-copy="scope.row.categoryName"> {{ scope.row.categoryName }}</span>
              </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="scope.row.fullclassnamecn" placement="top">
              <div class="tooltipClass">
                <span v-copy="scope.row.fullclassnamecn"> {{ scope.row.fullclassnamecn }}</span>
              </div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" min-width="400">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <span v-copy="scope.row.storeName">{{scope.row.storeName}}</span>
              </div>
              <el-tooltip class="item" effect="dark" :content="'品牌:'" placement="top">
                <div>
                  <span v-copy="scope.row.storeName">{{scope.row.brandName}}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'产品中文名:'+scope.row.productNameCN" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productNameCN">{{scope.row.productNameCN}}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'平台标题:'+scope.row.title" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.title">{{ scope.row.title }}</span>
                </div>
              </el-tooltip>
              <div>
                <span v-if="scope.row.isDiscount" style="color: rgb(103, 194, 58)"><b>折扣中</b></span><span v-else><b>非折扣</b></span>
                <span v-if="scope.row.isPreOrder" style="color: rgb(103, 194, 58);margin-left:10px"><b>预订单</b></span><span v-else style="margin-left:10px"><b>非预订</b></span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="站点&币种" align="center" width="110">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>{{ row.site }}</div>
              <div>{{ row.currency }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="价格" align="center" width="120">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>原价: {{ row.originalPrice }}</div>
              <div>折扣: {{ row.price }}</div>
              <div>成本: {{ row.costPrice }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="库存" align="center" width="100">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>在线:{{ scope.row.stock }}</div>
              <div>可用:{{ scope.row.goodNum }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="出货天数" align="center" width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.daysToShip }}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div><span v-show="scope.row.shopeeCreateTime">刊登：</span>{{ scope.row.shopeeCreateTime }}</div>
            <div><span v-show="scope.row.shopeeUpdateTime">更新：</span>{{ scope.row.shopeeUpdateTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-if="scope.row.businessStatus==2||scope.row.businessStatus==3" style="display:none">
              编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleupdate(scope.row)" v-else>
              编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleImgs(scope.row)" v-if="scope.row.businessStatus==2||scope.row.businessStatus==3" style="display:none">
              修改图片
            </el-button>
            <el-button size="mini" type="text" @click="handleImgs(scope.row)" v-else>
              修改图片
            </el-button>
            <el-button size="mini" type="text" @click="handlejournal(scope.row.itemId)">
              日志
            </el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <OperationDialog :visible.sync="operation.visible" :selectRows="operation.selectRows" :mode="operation.modifyMode" @request="getList" />
    <DayDialog :visible.sync="daytion.visible" :selectRows="daytion.selectRows" :mode="daytion.modifyMode" @request="getList" />
    <ExportDialog :visible.sync="exporttion.visible" :selectRows="exporttion.selectRows" :listQuery="exporttion.listQuery" @request="getList" />
    <el-dialog title="修改图片" :visible.sync="visible" width="1500px">
      <div style="margin-bottom:10px"><b>SKU：{{imgtion.shopSku}}</b></div>
      <div style="margin-bottom:10px"><b>产品中文名：{{imgtion.productNameCN}}</b></div>
      <UploadImage :fileList.sync="imgtion.imgs" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handImgs" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入渠道SKU" :visible.sync="excelVisible" width="576px" append-to-body @close="$refs.upload.clearFiles()">
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
  </TabelPageLayout>
</template>
<script>

import { searchShopeeListing, getLmSysPlatformAuthList, searchShopeeListingLog, searchShopeeListingVariations, batchDeleteListing, batchLowerShelfListing, batchUpperShelfListing, addShopeePriceExcelExport, queryShopeeListingImgUrl, editShopeeListingImgUrl, importChannelSku } from "@/api/shopee/shopeeListing";
import {
  SkuInfoView,
  LogView,
  RadioButtonGroup,
  ScrollSelect,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard,
  NumberInput
} from "@/components";
import OperationDialog from "./components/OperationDialog"
import DayDialog from "./components/DayDialog"
import ExportDialog from "./components/ExportDialog"
import UploadImage from "./components/Uploadimage";
const defaultListQuery = {
  businessStatus: 1,
  paramType: 1,
  paramValue: [],
  productState: [],
  startTime: "",
  endTime: "",
  pageNum: 1,
  pageSize: 50,
  paramCustom: "",
  startParamCustomValue: "",
  endParamCustomValue: "",
  isCostPrice: '',
  storeName: '',
  isVariant: null,
  isDiscount: '',
  isPreOrder: ''
};
export default {
  name: "shopeeListing",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      states: [
        { label: "在线", value: 1 },
        { label: "已下架", value: 4 },
        { label: "已删除", value: 2 },
        { label: "已售完", value: 8 },
        { label: "已禁卖", value: 3 },
        { label: "待上架", value: 5 },
        { label: "待下架", value: 6 },
        { label: "待删除", value: 7 },
      ],
      typeList: {
        customList: [
          { label: "可用库存", value: 1 },
          { label: "在线库存", value: 2 },
          { label: "原价", value: 3 },
          { label: "折扣价", value: 4 },
        ],
        costPriceList: [{ label: "是", value: true },
        { label: "否", value: false },],
        discountList: [{ label: "是", value: true },
        { label: "否", value: false },],
        preOrderList: [{ label: "是", value: true },
        { label: "否", value: false },],
        paramTypeList: [
          { label: "SKU", value: 1 },
          { label: "渠道SKU", value: 3 },
          { label: "itemID", value: 2 },
        ],
        productStatusList: ["正常", "停产", "锁定", "起批量", "暂时缺货", "清库"],
        storeNameList: []
      },
      createTimeAndEndTime: [],
      valList: [],
      SkuNum: "",
      SkuDialogVisible: false,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: searchShopeeListingLog,
        param: {
          itemId: "",
        },
      },
      isDisplaymode: true,
      operation: {
        visible: false,
        selectRows: [],
        modifyMode: "",
      },
      daytion: {
        visible: false,
        selectRows: [],
        modifyMode: "",
      },
      exporttion: {
        visible: false,
        selectRows: [],
        listQuery: {}
      },
      imgtion: {
        imgs: [],
        authId: "",
        itemId: "",
        shopSku: "",
        productNameCN: ""
      },
      visible: false,
      excelVisible: false,
      fileList: [],
      formData: {
        file: "", //文件
      },
    }
  },
  components: {
    SkuInfoView,
    LogView,
    RadioButtonGroup,
    ScrollSelect,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard, NumberInput,
    OperationDialog, DayDialog,
    ExportDialog,
    UploadImage
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
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
    getProductstate() {
      return function (type) {
        switch (type) {
          case "正常":
            return { backgroundColor: "#16c067", color: "#fff" };
          case "起批量":
            return { backgroundColor: "#00b0f5", color: "#fff" };
          case "暂时缺货":
            return { backgroundColor: "#d4c80a", color: "#fff" };
          case "清库":
            return { backgroundColor: "#fb9320", color: "#fff" };
          case "锁定":
            return { backgroundColor: "#a3a3a3", color: "#fff" };
          case "停产":
            return { backgroundColor: "#e0514d", color: "#fff" };
          default:
            return { backgroundColor: "#e0514d", color: "#fff" };
        }
      };
    },
  },
  created() {
    if (this.$route.query.hasOwnProperty('status')) {
      this.listQuery.status = this.$route.query.status
    }
    this.getList();
    this.getType();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime=[]
      } else {
        this.isDisplaymode = false;
        this.$nextTick(() => {
          this.isDisplaymode = true;
        });
         this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      let storeName = []
      if (this.listQuery.storeName === '') {
        storeName = []
      } else {
        storeName = [this.listQuery.storeName]
      }
      try {
        const res = await searchShopeeListing({ ...this.listQuery, storeName });
        res.data.list.forEach((item) => {
          item.hasChildren = Boolean(item.hasVariation);
          item.random = Math.floor(Math.random() * 1000000);
        });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = getLmSysPlatformAuthList({ platform: "10062" });
      Promise.all([res]).then((res) => {
        this.typeList.storeNameList = res[0].data

      }).catch((err) => {
        this.typeList.storeNameList = []
      });
    },
    handleSelectionChange(val) {
      this.valList = val;
    },
    //变体
    loadTableTree(tree, resolve) {
      searchShopeeListingVariations({ itemId: tree.itemId, uuid: tree.uuid }).then((response) => {
        response.data.forEach((item) => {
          item.random = Math.floor(Math.random() * 1000000);
          item.hasVariation = false;
        });
        resolve(response.data);
      });
    },
    conditions(obj) {
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
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.itemId = params;
      this.LogDialogVisible = true;
    },
    batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
    async handleCommand(command) {
      const selection = this.$refs.tableContainer.$refs.singleTable.selection;
      const istrue = selection.every(item => { return item.isDiscount == false })
      const isPreOrder = selection.every(item => { return item.isPreOrder == false })
      if (selection.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选需要修改的商品"
        })
        return
      }
      if (selection.length > 20) {
        this.$message({
          type: "warning",
          message: "最多勾选20条商品"
        })
        return
      }
      if (command === 'price') {
        if (istrue) {
          this.operation = {
            modifyMode: command,
            selectRows: selection,
            visible: true
          }
        } else {
          this.$message.error(`参与折扣中产品禁止修改价格`)
        }

      }
      if (command === 'stock') {
        this.operation = {
          modifyMode: command,
          selectRows: selection,
          visible: true
        }
      }
      if (command === 'remove' || command === 'out') {
        let text = "";
        let api = "";
        if (command === 'remove') {
          text = "删除"
          api = batchDeleteListing
        } else {
          text = "下架"
          api = batchLowerShelfListing
        }
        if (istrue) {
          try {
            const comfirm = await this.$confirm(`确定批量${text}勾选中的商品？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            const res = await api(selection);
            if (res.code !== 200) return;
            this.$message.success(res.message)
            this.getList()
          } catch (error) { }
        } else {
          this.$message.error(`参与折扣中产品禁止${text}`)
        }
      }
      if (command === 'day') {
        if (!isPreOrder) {
          this.daytion = {
            modifyMode: command,
            selectRows: selection,
            visible: true
          }
        } else {
          this.$message.error(`非预定单禁止修改出货天数`)
        }

      }
      if (command === 'add') {
        try {
          const comfirm = await this.$confirm(`确定批量上架勾选中的商品？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const res = await batchUpperShelfListing(selection);
          if (res.code !== 200) return;
          this.$message.success(res.message)
          this.getList()
        } catch (error) { }
      }
    },
    getCost() {
      const selection = this.$refs.tableContainer.$refs.singleTable.selection;
      this.exporttion = {
        selectRows: selection,
        visible: true,
        listQuery: this.listQuery
      }
    },
    async handleImgs(row) {
      this.imgtion.imgs = []
      const res = await queryShopeeListingImgUrl({ uuid: row.uuid })
      res.data.forEach((item) => {
        this.imgtion.imgs.push({
          url: item
        })
      })
      this.visible = true
      this.imgtion.authId = row.authId
      this.imgtion.itemId = row.itemId
      this.imgtion.shopSku = row.shopSku
      this.imgtion.productNameCN = row.title
    },
    async handImgs() {
      const imgsLength = this.imgtion.imgs.length
      if (imgsLength < 1) {
        this.$message({ type: "error", message: `至少上传1张图片`, });
        return;
      }
      const imgs = this.imgtion.imgs.map(i => i.url)
      const res = await editShopeeListingImgUrl({ ...this.imgtion, imgs })
      if (res.code == 200) {
        this.$message.success(res.message)
        this.visible = false
        this.getList()
      }
    },
    handleupdate(row) {
      const query = { routeitemId: row.itemId ,routeStatus:this.listQuery.status }
      this.$router.push({ path: "shopeeListEditor", query })
    },
    downExcel() {
      window.open("https://lemontree-prod.oss-cn-shenzhen.aliyuncs.com/shopee/report/shopee_import_channel_sku_template.xlsx", '_self');
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
      } try {
        for (let i = 0; i < this.formData.file.length; i++) {
          const formData = new FormData();
          formData.append("file", this.formData.file[i]);
          const res = await importChannelSku(formData)
          if (res.code == 200) {
            this.$message.success(res.message);
            this.getList();
            this.excelVisible = false
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}
</style>