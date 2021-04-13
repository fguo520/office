<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="供应商名:">
          <el-input v-model="listQuery.supplierName" placeholder="支持模糊查询" size="mini" clearable />
        </el-form-item>
        <el-form-item label="支付类型:">
          <el-select v-model="listQuery.payType" placeholder="请选择" size="mini" clearable class="input-width" filterable @change="payTypeChange">
            <el-option v-for="(item, index) in typeList.payTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付周期:">
          <el-select v-model="listQuery.payWeek" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.payWeekList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="listQuery.status" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作类型:">
          <el-select v-model="listQuery.cooperateType" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.cooperateTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购类型:">
          <el-select v-model="listQuery.purchaseType" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.purchaseTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商等级:">
          <el-select v-model="listQuery.supplierGrade" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.supplierGradeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支持海运装柜:">
          <el-select v-model="listQuery.isSupportSea" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.isSupportSeaList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支持退换货:">
          <el-select v-model="listQuery.isSupportReturn" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.isSupportReturnList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开发人员:">
          <el-select v-model="listQuery.developAdminId" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.developAdminIdList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购人员:">
          <el-select v-model="listQuery.buyerAdminId" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.buyerAdminIdList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商发货地:">
          <el-select v-model="listQuery.supplierShippingAddressProvince" placeholder="省" size="mini" clearable style="width:150px" filterable @change="supplierShipChange">
            <el-option v-for="(item, index) in typeList.supplierShipList" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.supplierShippingAddressCity" placeholder="市" size="mini" clearable style="width:150px" filterable>
            <el-option v-for="(item, index) in typeList.supplierCityList" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <div style="margin-top:3px">
      <el-button @click="add()" type="primary" size="mini" v-if="rolePermissionJudge('/supplierData/add')">新增</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="index" width="80" align="center" label="序号" prop />
        <u-table-column label="供应商信息" align="center" width="250">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div>代码：<span v-copy="scope.row.supplierCode">{{scope.row.supplierCode}}</span></div>
              <el-tooltip class="item" effect="dark" :content="'供应商名称:'+scope.row.supplierName" placement="top">
                <div class="tooltipClass">名称：<span v-copy="scope.row.supplierName">{{scope.row.supplierName}}</span></div>
              </el-tooltip>
              <div>状态：<span v-copy="scope.row.status?'启用':'停用'" :style="scope.row.status?'color:#52c41a':'color:red'">{{scope.row.status?"启用":"停用"}}</span></div>
              <div>发货地：<span v-copy="scope.row.supplierShippingAddressProvince+scope.row.supplierShippingAddressCity">{{scope.row.supplierShippingAddressProvince}}{{scope.row.supplierShippingAddressCity}}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="供应商设置" align="center" width="250">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div>合作类型：<span v-if="scope.row.cooperateType" :style="scope.row.cooperateType===1?'color:#52c41a':'color:#faad14'" v-copy="handCooperateType(scope.row.cooperateType)">{{handCooperateType(scope.row.cooperateType)}}</span><span v-else style="color:red">未维护</span></div>
              <div>采购类型：<span v-copy="handPurchaseType(scope.row.purchaseType)">{{handPurchaseType(scope.row.purchaseType)}}</span></div>
              <div>供应商类型：<span v-copy="handSupplierType(scope.row.supplierType)" :style="scope.row.supplierType?'color:#606266':'color:red'">{{scope.row.supplierType?handSupplierType(scope.row.supplierType):"未维护"}}</span></div>
              <div>供应商等级：<span v-if="scope.row.supplierGrade" :style="scope.row.supplierGrade=='A'?'color:#52c41a':'color:#faad14'" v-copy="scope.row.supplierGrade">{{scope.row.supplierGrade}}</span><span v-else style="color:red">未维护</span></div>
              <div style="position: relative">联系供应商：<span style="position: absolute;top: 2px;" v-if="rolePermissionJudge('/supplierData/ww')" v-show="scope.row.supplierLoginId"><a target="_blank" :href="`http://amos.alicdn.com/getcid.aw?v=2&uid=${scope.row.supplierLoginId}&site=cntaobao&s=1&groupid=0&charset=utf-8`"><img border="0" :src="`http://amos.alicdn.com/online.aw?v=2&uid=${scope.row.supplierLoginId}&site=cntaobao&s=1&charset=utf-8`" alt="" title="" /></a></span><span v-show="!scope.row.supplierLoginId">无</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="支付信息" align="center" width="250">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div>类型：<span v-copy="handPayType(scope.row.payType)" :style="scope.row.payType?'color:#606266':'color:red'">{{scope.row.payType?handPayType(scope.row.payType):"未维护"}}</span></div>
              <div>周期：<span v-copy="handPayWeek(scope.row.payWeek)" :style="scope.row.payWeek?'color:#606266':'color:red'">{{scope.row.payWeek?handPayWeek(scope.row.payWeek):"未维护"}}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="其他信息" align="center" min-width="250">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div>是否开票：<span>{{scope.row.isInvoice?"是":"否"}}</span></div>
              <div>支持贴标：<span>{{scope.row.isSupportLabeling?"是":"否"}}</span></div>
              <div>不良品处理：<span v-copy="handBadHandle(scope.row.badHandle)">{{handBadHandle(scope.row.badHandle)}}</span></div>
              <div>支持退换货：<span>{{scope.row.isSupportReturn?"是":"否"}}</span></div>
              <div>是否黑名单：<span>{{scope.row.isBlacklist?"是":"否"}}</span></div>
              <div>支持海运装柜：<span>{{scope.row.isSupportSea?"是":"否"}}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作人员" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div>开发：<span v-copy="scope.row.developAdminName">{{scope.row.developAdminName}}</span></div>
              <div>采购：<span v-copy="scope.row.buyerAdminName">{{scope.row.buyerAdminName}}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作人&时间" align="center" width="280">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div><span v-show="scope.row.createPerson||scope.row.createTime">创建：</span><span v-copy="scope.row.createPerson">{{scope.row.createPerson}} </span><span>{{scope.row.createTime}}</span></div>
              <div><span v-show="scope.row.updatePerson||scope.row.updateTime">更新：</span><span v-copy="scope.row.updatePerson">{{scope.row.updatePerson}} </span><span>{{scope.row.updateTime}}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="168">
          <template slot-scope="scope">
            <!-- v-if="rolePermissionJudge('/pmsV2List/maintain')" -->
            <el-button type="text" @click="see(scope.row)" size="mini" v-if="rolePermissionJudge('/supplierData/see')">查看</el-button>
            <el-button type="text" @click="editor(scope.row)" size="mini" v-if="rolePermissionJudge('/supplierData/editor')">编辑</el-button>
            <el-button type="text" @click="upadteStatus(scope.row)" size="mini" v-if="rolePermissionJudge('/supplierData/status')" :style="scope.row.status?'color:red':'color:#52c41a'">{{ scope.row.status ? '停用' : '启用' }}</el-button>
            <el-button type="text" @click="handlejournal(scope.row.id)" size="mini">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <SupDialog :visible.sync="supDialog.visible" :supDialog="supDialog" :typeList="typeList" @request="getList" />
  </TabelPageLayout>
</template>
<script>
const defaultListQuery = { pageNum: 1, pageSize: 50, supplierName: "", payType: null, payWeek: null, status: null, cooperateType: null, purchaseType: null, supplierGrade: null, isSupportReturn: null, developAdminId: null, buyerAdminId: null, supplierShippingAddressProvince: "", supplierShippingAddressCity: "" }
import { getSupplierDataMainList, getProvinceInfo, getDepartMentUseByCode, getLmShApiWarehouseList, updateStatus, searchSupplierLogPage } from "@/api/supplier/supplierData"
import { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput } from "@/components";
import SupDialog from './components/SupDialog'
export default {
  name: "supplierData",
  components: { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, SupDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        payTypeList: [{ label: "线下转账付款", value: 1 }, { label: "阿里账期付款", value: 2 }, { label: "网络在线付款", value: 3 }, { label: "未维护", value: 0 }],
        payWeekList: [],
        payWeekAllList: [{ label: "周结", value: 1 }, { label: "半月结", value: 2 }, { label: "月结", value: 3 }, { label: "月结30天", value: 4 }, { label: "月结60天", value: 5 }, { label: "款到发货", value: 6 }, { label: "货到付款", value: 7 }, { label: "预付款", value: 8 }, { label: "网络在线结算", value: 9 }, { label: "按固定结算日期30天", value: 10 }, { label: "按收货时间7天", value: 11 }, { label: "按收货时间10天", value: 12 }, { label: "按收货时间20天", value: 13 }, { label: "按收货时间30天", value: 14 }, { label: "按收货时间45天", value: 15 }, { label: "按收货时间60天", value: 16 }, { label: "按收货时间90天", value: 17 }, { label: "未维护", value: 0 }],
        statusList: [{ label: "停用", value: 0 }, { label: "启用", value: 1 }],
        cooperateTypeList: [{ label: "正常", value: 1 }, { label: "临时", value: 2 }, { label: "备用", value: 3 }, { label: "未维护", value: 0 }],
        purchaseTypeList: [{ label: "网络采购", value: 1 }, { label: "工厂采购", value: 2 }, { label: "市场采购", value: 3 }, { label: "自主生产", value: 4 }, { label: "其它", value: 5 }],
        supplierGradeList: [{ label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" }, { label: "D", value: "D" }, { label: "E", value: "E" }, { label: "未维护", value: "0" }],
        isSupportSeaList: [{ label: "否", value: 0 }, { label: "是", value: 1 }],
        isSupportReturnList: [{ label: "否", value: 0 }, { label: "是", value: 1 }],
        developAdminIdList: [],
        buyerAdminIdList: [],
        supplierTypeList: [{ label: "工厂", value: 1 }, { label: "贸易商", value: 2 }, { label: "工贸一体", value: 3 }, { label: "分销", value: 4 }],
        badHandleList: [{ label: "换货", value: 1 }, { label: "退货", value: 2 }, { label: "采购方承担", value: 3 },],
        supplierShipList: [],
        supplierCityList: [],
        drawerAddressCityList: [],
        settlementTimeTypeList: [{ label: "按下单时间", value: 1 }, { label: "按销单时间", value: 2 }, { label: "按入库时间", value: 3 }],
        warehouseShippingList: [],
        invoiceTypeList: [{ label: "增值税发票", value: 1 }, { label: "普通发票", value: 2 }, { label: "收据", value: 3 }, { label: "其它", value: 4 }],
        bankList: ["中国邮政储蓄银行", "中国银行", "中国农业银行", "中国民生银行", "中国建设银行", "中国工商银行", "中信银行", "招商银行", "兴业银行", "香港汇丰银行", "深圳农村商业银行", "深圳发展银行", "上海银行", "上海浦东发展银行", "平安银行", "宁波银行", "交通银行", "汇丰银行", "广东发展银行", "光大银行"],
        currencyList: ["CNY", "USD", "HKD", "JPY",],
        drawerQualificationsList: [{ label: "小规模", value: 1 }, { label: "一般纳税人认定满2年", value: 2 }, { label: "一般纳税人认定不满2年", value: 3 }],
        drawerTypeList: [{ label: "生产型", value: 1 }, { label: "贸易型", value: 2 }]
      },
      supDialog: {
        visible: false,
        title: "",
        id: null,
        check: false
      },
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: searchSupplierLogPage,
        param: {
          id: "",
        },
      },
    }
  },
  computed: {
    handCooperateType() {
      return function (type) { return type ? this.typeList.cooperateTypeList.find(i => { return i.value == type }).label : "" }
    },
    handPurchaseType() {
      return function (type) { return type ? this.typeList.purchaseTypeList.find(i => { return i.value == type }).label : "" }
    },
    handSupplierType() {
      return function (type) { return type ? this.typeList.supplierTypeList.find(i => { return i.value == type }).label : "" }
    },
    handPayType() {
      return function (type) { return type ? this.typeList.payTypeList.find(i => { return i.value == type }).label : "" }
    },
    handPayWeek() {
      return function (type) { return type ? this.typeList.payWeekAllList.find(i => { return i.value == type }).label : "" }
    },
    handBadHandle() {
      return function (type) { return type ? this.typeList.badHandleList.find(i => { return i.value == type }).label : "" }
    },
  },
  created() {
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
        this.$nextTick(() => {
          this.listQuery = Object.assign({}, defaultListQuery);
          this.typeList.supplierCityList = []
          this.typeList.payWeekList = []
        })
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await getSupplierDataMainList({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await Promise.all([getProvinceInfo(), getDepartMentUseByCode({ parameterCode: 10039 }), getDepartMentUseByCode({ parameterCode: 10040 }),])
      this.typeList.supplierShipList = res[0].data
      this.typeList.developAdminIdList = res[1].data
      this.typeList.buyerAdminIdList = res[2].data
    },
    async supplierShipChange() {
      this.typeList.supplierCityList = []
      this.listQuery.supplierShippingAddressCity = ""
      if (!this.listQuery.supplierShippingAddressProvince) return
      const res = await getProvinceInfo({ provinceCode: this.listQuery.supplierShippingAddressProvince })
      this.typeList.supplierCityList = res.data
    },
    add() {
      this.supDialog.visible = true
      this.supDialog.title = "创建供应商"
      this.supDialog.id = null
      this.supDialog.check = false
    },
    editor(row) {
      this.supDialog.visible = true
      this.supDialog.title = "编辑供应商"
      this.supDialog.id = row.id
      this.supDialog.check = false
    },
    see(row) {
      this.supDialog.visible = true
      this.supDialog.title = "查看供应商"
      this.supDialog.id = row.id
      this.supDialog.check = true
    },
    payTypeChange() {
      const { listQuery, typeList } = this
      typeList.payWeekList = [], listQuery.payWeek = ""
      switch (listQuery.payType) {
        case 1:
          return typeList.payWeekList = [{ label: "周结", value: 1 }, { label: "半月结", value: 2 }, { label: "月结", value: 3 }, { label: "月结30天", value: 4 }, { label: "月结60天", value: 5 }, { label: "货到付款", value: 7 }]
        case 2:
          return typeList.payWeekList = [{ label: "按固定结算日期30天", value: 10 }, { label: "按收货时间7天", value: 11 }, { label: "按收货时间10天", value: 12 }, { label: "按收货时间20天", value: 13 }, { label: "按收货时间30天", value: 14 }, { label: "按收货时间45天", value: 15 }, { label: "按收货时间60天", value: 16 }, { label: "按收货时间90天", value: 17 }]
        case 3:
          return typeList.payWeekList = [{ label: "现结", value: 9 }, { label: "款到发货", value: 6 }, { label: "预付款", value: 8 }]
      }
    },
    upadteStatus(row) {
      this.$confirm(`请确认是否${row.status ? '停用' : '启用'} ${row.supplierName} 供应商。`, `${row.status ? '停用' : '启用'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message({ type: "success", message: res.data })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
  }
}
</script>