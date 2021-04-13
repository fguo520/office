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
        <el-form-item label="店铺:">
          <TreeSelect v-model="listQuery.platformAuthDetailId" :prop="{label:'name',value:'id'}" :list="typeList.platformAuthDetailIdList" />
        </el-form-item>
        <el-form-item label="配送方式:">
          <el-select v-model="listQuery.fulfillmentChannel" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.fulfillmentChannelList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="侵权风险:">
          <ScrollSelect v-model="listQuery.productProperty" :list="typeList.productPropertyList" />
        </el-form-item>
        <el-form-item label="产品状态:">
          <el-select v-model="listQuery.productState" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.statuslList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.businessStatus" :ButtonTypes="states" @request="getList">
      <template #1>
        <el-dropdown @command="handleCommand">
          <el-button size="mini" class="radioBtn">
            批量操作<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">

            <el-dropdown-item command="out" v-if="rolePermissionJudge('/amazonListing/next')">批量下架</el-dropdown-item>
            <el-dropdown-item command="price" v-if="rolePermissionJudge('/amazonListing/price')">批量修改价格</el-dropdown-item>
            <el-dropdown-item command="stock" v-if="rolePermissionJudge('/amazonListing/stock')">批量修改库存</el-dropdown-item>
            <el-dropdown-item command="remove" v-if="rolePermissionJudge('/amazonListing/delect')">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #2>
        <el-dropdown @command="handleCommand">
          <el-button size="mini" class="radioBtn">
            批量操作<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add" v-if="rolePermissionJudge('/amazonListing/add')">批量上架</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </RadioButtonGroup>
    <template #dropdown>
      <span @click="batchCopyRow('sellerSku')">
        <el-dropdown-item>批量复制渠道Sku</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('asin1')">
        <el-dropdown-item>批量复制ASIN</el-dropdown-item>
      </span>
    </template>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" />
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.mainImage" style="width: 100px" />
            <div :style="getProductstate(scope.row.productState)">
              {{ scope.row.productState }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="SKU&ASIN" align="center" width="220">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy" />
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
                  {{ scope.row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'渠道sku:'+scope.row.sellerSku" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="scope.row.sellerSku">{{scope.row.sellerSku}}</span>
                </div>
              </el-tooltip>
            <el-link :underline="false" type="primary" :href="scope.row.onlineUrl" target="_blank">{{scope.row.asin1}}</el-link>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" min-width="400">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'渠道别名:'" placement="left">
                <div>{{scope.row.storeNameAs}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'赛盒别名:'" placement="left">
                <div>{{scope.row.shAccount}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'英文名称:'+scope.row.itemName" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.itemName">{{scope.row.itemName}}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="详情" align="center" width="180">
          <template #default="{ row }">
            <div style="text-align: left">
              <div><span>站点：</span>{{row.site}}</div>
              <div><span>在线：</span>{{row.quantity}}</div>
              <div><span>配送：</span>{{row.fulfillmentChannel==="DEFAULT"?"自配送":"亚马逊FBA配送"}}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="币种&价格" align="center" width="120">
          <template #default="{ row }">
            <div>{{row.currency}}</div>
            <div>{{row.price}}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="220">
          <template slot-scope="scope">
            <div><span v-show="scope.row.openDateBeijing">刊登：</span>{{ scope.row.openDateBeijing }}</div>
            <div><span v-show="scope.row.createTime">创建：</span>{{ scope.row.createTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEditor(scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleImgs(scope.row)">
              修改图片
            </el-button>
            <el-button size="mini" type="text" @click="handlejournal(scope.row.listingId)">
              日志
            </el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <OperationDialog :visible.sync="operation.visible" :selectRows="operation.selectRows" :mode="operation.modifyMode" @request="getList" />
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <el-dialog title="修改图片" :visible.sync="visible" width="1000px">
      <div style="margin-bottom:10px"><b>SKU：{{imgtion.sku}}</b></div>
      <div style="margin-bottom:10px"><b>产品中文名：{{imgtion.itemName}}</b></div>
      <UploadImage :fileList.sync="imgtion.imageParams" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handImgs" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <TitleEditor :visible.sync="titleDialog.Visible" :rows="titleDialog.rows" @request="getList" ref="titleEditor" />
  </TabelPageLayout>
</template>
<script>
import { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, TreeSelect } from "@/components";
import { getlist, getLmAmazonAuthNode, batchLowerShelf, batchUpperShelf, batchDeleteProduct, updateListingImage, getLmProductImage, getAmazonListingLogList, shApiProperty } from "@/api/amazon/amazonListing"
import OperationDialog from "./components/OperationDialog"
import UploadImage from "./components/Uploadimage";
import TitleEditor from "./components/TitleEditor";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  paramType: 3,
  paramValue: [],
  timeType: 2,
  startTime: "",
  endTime: "",
  fulfillmentChannel: '',
  status: "",
  platformAuthDetailId: [],
  businessStatus: 1,
  productProperty: []
}
export default {
  name: 'amazonListing',
  components: { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, TreeSelect, OperationDialog, UploadImage, TitleEditor },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        paramTypeList: [{ label: "SKU", value: 3 }, { label: "渠道Sku", value: 1 }, { label: "ASIN", value: 2 },],
        timeTypeList: [{ label: "创建", value: 1 }, { label: "刊登", value: 2 },],
        fulfillmentChannelList: [{ label: "自配送", value: "FBA" }, { label: "亚马逊FBA配送", value: "FBM" },],
        statusList: [{ label: "活跃", value: "Active" }, { label: "非活跃", value: "Inactive" }, { label: "不完整", value: "Incomplete" },],
        platformAuthDetailIdList: [],
        statuslList: ["正常", "停产", "锁定", "起批量", "暂时缺货", "清库"],
        productPropertyList: []
      },
      createTimeAndEndTime: [],
      states: [{ label: "在线", value: 1 }, { label: "下架", value: 2 }, { label: "待上架", value: 4 }, { label: "待下架", value: 5 }, { label: "待删除", value: 6 }],
      operation: {
        visible: false,
        selectRows: [],
        modifyMode: "",
      },
      productState: "",
      imgtion: {
        imageParams: [],
        sku: "",
        itemName: "",
        asin1: "",
        listingId: "",
        marketplaceId: "",
        platformAuthDetailId: "",
        platformAuthId: "",
        sellerSku: "",
      },
      visible: false,
      LogDialogVisible: false,
      SkuNum: "",
      SkuDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "logType", width: "150" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getAmazonListingLogList,
        param: {
          listingId: "",
        },
      },
      titleDialog: {
        Visible: false,
        rows: {}
      },
    }
  },
  computed: {
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
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  created() {
    this.getType();
    this.getList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        if (this.listQuery.platformAuthDetailId == "") {
          this.listQuery.platformAuthDetailId = []
        }
        const res = await getlist({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await Promise.all([getLmAmazonAuthNode(), shApiProperty()])

      this.typeList.platformAuthDetailIdList = res[0].data
      this.typeList.productPropertyList = res[1].data
    },
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = []
      } else {
        this.listQuery.pageNum = 1
      }
      this.getList();
    },
    batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
    async handleCommand(command) {
      const selection = this.$refs.tableContainer.$refs.singleTable.selection;
      if (selection.length == 0) { return this.$message.warning("请选择商品") };
      if (selection.length > 20) { return this.$message.warning("最多选择20条商品") };
      switch (command) {
        case "out":
          return this.logOut(selection, 1);
        case "add":
          return this.logOut(selection, 2);
        case "remove":
          return this.logRemove(selection);
        case "price":
          return this.logPrice(selection, 1);
        case "stock":
          return this.logPrice(selection, 2);
      }
    },
    async logOut(arr, type) {
      const text = type === 1 ? "下架" : "上架"
      const api = type === 1 ? batchLowerShelf : batchUpperShelf
      const selection = arr.map(i => { return { ...i, quantityFrom: i.quantity } })
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
    },
    async logRemove(selection) {
      try {
        const comfirm = await this.$confirm(`确定批量删除勾选中的商品？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await batchDeleteProduct(selection)
        if (res.code !== 200) return;
        this.$message.success(res.message)
        this.getList()
      } catch (error) { }

    },
    async logPrice(selection, type) {
      const modifySelection = selection.map(item => {
        if (type === 1) return {
          ...item,
          priceFrom: item.price,
          priceTo: item.price
        }
        if (type === 2) return {
          ...item,
          quantityFrom: item.quantity,
          quantityTo: item.quantity
        }
      })
      this.operation = {
        modifyMode: type,
        selectRows: modifySelection,
        visible: true
      }
    },
    async handleImgs(row) {
      this.imgtion.imageParams = []
      const res = await getLmProductImage({ sku: row.sku })
      res.data.forEach((item) => {
        this.imgtion.imageParams.push({
          url: item
        })
      })
      this.visible = true
      this.imgtion.sku = row.sku
      this.imgtion.itemName = row.itemName
      this.imgtion.asin1 = row.asin1
      this.imgtion.listingId = row.listingId
      this.imgtion.marketplaceId = row.marketplaceId
      this.imgtion.platformAuthDetailId = row.platformAuthDetailId
      this.imgtion.platformAuthId = row.platformAuthId
      this.imgtion.sellerSku = row.sellerSku
    },
    async handImgs() {
      const imgsLength = this.imgtion.imageParams.length
      if (imgsLength < 1) {
        this.$message({ type: "error", message: `至少上传1张图片`, });
        return;
      }
      const res = await updateListingImage({ ...this.imgtion })
      if (res.code == 200) {
        this.$message.success(res.message)
        this.visible = false
        this.getList()
      }
    },
    async handleEditor(row) {
      this.$refs.titleEditor.tinymceReset = true
      this.titleDialog = {
        Visible: true,
        rows: { ...row }
      }
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.listingId = params;
      this.LogDialogVisible = true;
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
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
