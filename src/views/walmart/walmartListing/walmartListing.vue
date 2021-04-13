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
        <el-form-item label="类目：">
          <el-select v-model="listQuery.category" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.categoryList" :key="index" :label="item.category" :value="item.category" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道：">
          <el-select v-model="listQuery.authId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.authList" :key="index" :label="item.storeNameAs" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态:">
          <ScrollSelect v-model="listQuery.productState" :list="typeList.productStatusList" />
        </el-form-item>
        <el-form-item label="上架时间:">
          <el-date-picker @change="timeChange" v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <RadioButtonGroup v-model="listQuery.itemStatus" :ButtonTypes="typeList.searchTypeList" @request="getList">
      <template #1>
        <el-button @click="offShelf" class="radioBtn" size="mini" v-if="rolePermissionJudge('/walmart/WalmartListing/down')">批量下架</el-button>
        <el-button @click="modify(2)" class="radioBtn" size="mini" v-if="rolePermissionJudge('/walmart/WalmartListing/price')">批量修改价格</el-button>
        <el-button @click="modify(3)" class="radioBtn" size="mini" v-if="rolePermissionJudge('/walmart/WalmartListing/inventory')">批量修改库存</el-button>
      </template>

    </RadioButtonGroup>

    <template #dropdown>
      <span @click="batchCopyRow('upc')">
        <el-dropdown-item>批量复制UPC</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('sellerSku')">
        <el-dropdown-item>批量复制sellerSku</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('itemId')">
        <el-dropdown-item>批量复制itemId</el-dropdown-item>
      </span>
    </template>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="SKU" align="center" width="210">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>
                <i v-copy="row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row)">{{ row.sku }}</el-link>
              </div>
              <div>
                <i v-copy="row.sellerSku" class="el-icon-document-copy"></i>
                <el-tooltip :content="`sellerSku：${row.sellerSku}`" placement="right-start">
                  <el-link :underline="false" type="primary" @click.native="getSkuInfo(row)">{{ row.sellerSku }}</el-link>
                </el-tooltip>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template #default="{ row }">
            <img slot="reference" :src="row.primaryImageUrl" width="100px" />
            <div :style="getColorStatus(row.productState)">{{row.productState}}</div>
          </template>
        </u-table-column>
        <u-table-column label="ItemID" align="center" width="120">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.itemId" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" :href="scope.row.itemPageUrl" target="_blank">
                  {{ scope.row.itemId }}
                </el-link>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="UPC" align="center" width="120">
          <template #default="{ row }">
            <div style="text-align: left">
              <div class="tooltipClass" v-copy="row.upc">{{row.upc}}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="类目" align="center" width="220">
          <template #default="{ row }">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="row.productCategory" placement="top">
                <div class="tooltipClass">
                  <span v-copy="row.productCategory">{{ row.productCategory }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" min-width="400">
          <template #default="{ row }">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="`渠道：${row.storeNameAs}`" placement="top">
                <span v-copy="row.storeNameAs">{{row.storeNameAs}}</span>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" :content="`标题：${row.productName}`" placement="top">
                <div class="tooltipClass">
                  <span v-copy="row.productName">{{row.productName}}</span>
                </div>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" :content="`产品中文名称：${row.productNameCn}`" placement="top">
                <div class="tooltipClass" v-copy="row.productNameCn">{{ row.productNameCn }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="站点&价格" align="center" width="110">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>{{ row.country }}</div>
              <div>{{ row.price }} USD</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="库存" align="center" width="120">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>参考：{{ row.inventoryCount }}</div>
              <div>在线：{{ row.inventoryCount }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="上架时间" align="center" width="170">
          <template #default="{row}">
            <div>{{row.itemCreationDate}}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="text" @click="editor(scope.row)">编辑</el-button> -->
            <el-button size="mini" type="text" @click="handlejournal(scope.row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <OperationDialog :visible.sync="operation.visible" :selectRows="operation.selectRows" :mode="operation.modifyMode" @request="getList" />
  </TabelPageLayout>
</template>

<script>
import { getList, operate, log, getLmSysPlatformAuthList, getWalmartApiCategoryList } from "@/api/walmart/walmartListing";
import {
  SkuInfoView,
  LogView,
  RadioButtonGroup,
  TabelPageLayout,
  TextareaInput,
  ScrollSelect,
  ShrinkCard
} from "@/components";
import OperationDialog from "./components/OperationDialog"
const defaultListQuery = {
  authId: "",
  category: "",
  itemStatus: 1,
  paramType: "sku",
  paramValue: [],
  productState: [],
  shelfStartTime: "",
  shelfEndTime: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "walmartListing",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      createTimeAndEndTime: [],
      logViewParam: {
        title: [
          { label: "操作类型", property: "operateType", width: "120" },
          { label: "操作人", property: "createUserName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
          { label: "失败原因", property: "errorDesc", tooltip: true },
        ],
        request: log,
        param: {
          itemId: ""
        },
      },
      SkuNum: "",
      SkuDialogVisible: false,
      LogDialogVisible: false,
      operation: {
        visible: false,
        selectRows: [],
        modifyMode: "",
      },
      typeList: {
        searchTypeList: [
          { label: "在线", value: 1 },
          { label: "已下架", value: 2 },
          { label: "下架中", value: 3 },
        ],
        productStatusList: ["正常", "停产", "锁定", "起批量", "暂时缺货", "清库"],
        paramTypeList: [
          { label: "SKU", value: "sku" },
          { label: "UPC", value: "upc" },
          { label: "sellerSku", value: "sellerSku" },
          { label: "itemId", value: "itemId" },
        ],
        authList: [],
        categoryList: [],
      },
    };
  },
  components: {
    SkuInfoView,
    LogView,
    RadioButtonGroup,
    TabelPageLayout,
    TextareaInput,
    ScrollSelect,
    ShrinkCard,
    OperationDialog
  },
  computed: {
    getColorStatus() {
      return function (type) {
        switch (type) {
          case "正常":
            return {
              backgroundColor: "#16c067", color: "#fff", textAlign: "center"
            };
          case "起批量":
            return {
              backgroundColor: "#00b0f5", color: "#fff", textAlign: "center"
            };
          case "暂时缺货":
            return {
              backgroundColor: "#d4c80a", color: "#fff", textAlign: "center"
            };
          case "停产":
            return {
              backgroundColor: "#e0514d", color: "#fff", textAlign: "center"
            };
          case "锁定":
            return {
              backgroundColor: "#a3a3a3", color: "#fff", textAlign: "center"
            };
          case "清库":
            return {
              backgroundColor: "#fb9320", color: "#fff", textAlign: "center"
            };
          default:
            return {
              backgroundColor: "#e0514d", color: "#fff", textAlign: "center"
            }
        }
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
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await getList({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getType() {
      getLmSysPlatformAuthList().then(res => {
        this.typeList.authList = res.data
      })
      getWalmartApiCategoryList().then(res => {
        this.typeList.categoryList = res.data
      })
    },
    timeChange() {
      if (this.createTimeAndEndTime != null) {
        this.listQuery.startTime = this.createTimeAndEndTime[0];
        this.listQuery.endTime = this.createTimeAndEndTime[1];
      } else {
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },
    async offShelf() {
      const list = this.$refs.tableContainer.$refs.singleTable.selection.map(item => ({ sellerSku: item.sellerSku }))
      if (list.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选需要下架的商品"
        })
        return
      }
      try {
        const comfirm = await this.$confirm('确定批量下架勾选中的商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await operate(1, list);
        if (res.code !== 200) return;
        this.$message({
          type: "success",
          message: res.message
        })
        this.getList()
      } catch (error) { }
    },
    batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
    modify(type) {
      const selection = this.$refs.tableContainer.$refs.singleTable.selection;
      if (selection.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选需要修改的商品"
        })
        return
      }
      const modifySelection = selection.map(item => {
        if (type === 2) return {
          ...item,
          skuPrice: item.price,
          skuModifyPrice: item.price
        }
        if (type === 3) return {
          ...item,
          skuInventory: item.inventoryCount,
          skuModifyInventory: item.availableInventory
        }
      })
      this.operation = {
        modifyMode: type,
        selectRows: modifySelection,
        visible: true
      }
    },
    getSkuInfo(row) {
      this.SkuDialogVisible = true;
      this.SkuNum = row.sku;
    },
    handlejournal(row) {
      this.logViewParam.param.itemId = row.itemId;
      this.LogDialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}
</style>
