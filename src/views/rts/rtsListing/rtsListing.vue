<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="自定义参数:">
          <el-select v-model="listQuery.searchType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.searchTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <TextareaInput v-model="listQuery.searchValues" />
        </el-form-item>
        <el-form-item label="产品质量:">
          <el-select v-model="listQuery.boutiqueTag" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.boutiqueTagList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品分组:">
          <el-cascader v-model="listQuery.productGroupId" :options="typeList.productGroupIdList" placeholder="全部" :props="{ label:'groupName', value:'groupId' }" :show-all-levels="false" clearable />
        </el-form-item>
        <el-form-item label="产品分类：">
          <el-cascader v-model="listQuery.productClassId" size="mini" :options="typeList.classList" clearable placeholder="全部" :props="{
              label: 'classnamecn',
              value: 'classid',
              checkStrictly: true,
            }"></el-cascader>
        </el-form-item>
        <el-form-item label="渠道:">
          <el-select v-model="listQuery.authId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.authIdList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类目:">
          <el-cascader v-model="listQuery.categoryId" :options="typeList.categoryIdList" placeholder="全部" :props="{ label:'categoryNameCn', value:'categoryId' }" :show-all-levels="false" clearable />
        </el-form-item>
        <el-form-item label="刊登人:">
          <el-select v-model="listQuery.ownerMemberDisplayName" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.ownerMemberDisplayNameList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义时间：">
          <el-select v-model="listQuery.searchTimeType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.searchTimeTypeList" :key="index" :label="item.label" :value="item.value" />
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
        <!-- v-if="rolePermissionJudge('/shopeeListing/export')" -->
        <el-button @click="getOut(1)" class="radioBtn" size="mini" v-if="rolePermissionJudge('/rtsListing/next')">批量下架</el-button>
        <el-button @click="getPrice" class="radioBtn" size="mini" v-if="rolePermissionJudge('/rtsListing/stock')">批量修改库存</el-button>
      </template>
      <template #2>
        <el-button @click="getOut(2)" class="radioBtn" size="mini" v-if="rolePermissionJudge('/rtsListing/add')">批量上架</el-button>
      </template>
    </RadioButtonGroup>
    <template #dropdown>
      <span @click="batchCopyRow('productId')">
        <el-dropdown-item>批量复制渠道Sku</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('pid')">
        <el-dropdown-item>批量复制itemId</el-dropdown-item>
      </span>
    </template>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" />
        <u-table-column label="ItemID" align="center" width="150">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.pid" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" :href="scope.row.pcDetailUrl" target="_blank">
                  {{ scope.row.pid }}
                </el-link>
              </div>
            </div>
            <!-- <div>
              <div v-show="Boolean(scope.row.hasVariation)" style="background-color: #67c23a; color: #fff">变体</div>
            </div> -->
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.mainImage" style="width: 100px" />
            <div :style="getProductstate(scope.row.productState)">
              {{ scope.row.productState }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="sku" align="center" width="220">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
                  {{ scope.row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'渠道sku:'+scope.row.productId" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productId">{{
                    scope.row.productId
                  }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品分组" align="center" width="150">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="scope.row.groupName" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.groupName"> {{ scope.row.groupName }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="类目&分类" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="scope.row.category" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.category"> {{ scope.row.category }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.productClass" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productClass"> {{ scope.row.productClass }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" min-width="400">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <span v-copy="scope.row.storeNameAs">{{scope.row.storeNameAs}}</span>
              </div>
              <div>
                <span v-copy="scope.row.language">{{scope.row.language}}</span>
              </div>
              <el-tooltip class="item" effect="dark" :content="'商品名称:'+scope.row.subject" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.subject">{{scope.row.subject}}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="详情" align="center" width="160">
          <template #default="{ row }">
            <div style="text-align: left">
              <div><span v-copy="row.ownerMemberDisplayName">刊登：</span>{{ row.ownerMemberDisplayName }}</div>
              <div><span v-copy="row.site">币种：</span>USD</div>
              <div><span>价格：</span>{{ row.discountPricesScope }}<i class="el-icon-edit-outline" style="color:blue;margin-left:5px" @click="handPrice(row)"></i></div>
              <div><span>库存：</span>{{ row.stock}}</div>
              <div><b>{{row.productType|productTypeFilter}}</b></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品质量" align="center" width="90">
          <template #default="{ row }">
            <div>{{ row.boutiqueTag |boutiqueTagFilter}}</div>
            <div><b>{{row.finalScore}}</b></div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div><span v-show="scope.row.gmtCreate">刊登：</span>{{ scope.row.gmtCreate }}</div>
            <div><span v-show="scope.row.gmtModified">更新：</span>{{ scope.row.gmtModified }}</div>
            <div><span v-show="scope.row.lastOperationTime">数据：</span>{{ scope.row.lastOperationTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editor(scope.row)" v-if="scope.row.productType!=='sourcing'">编辑</el-button>
            <el-button size="mini" type="text" @click="handlejournal(scope.row.productId)">
              日志
            </el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <PriceDialog :visible.sync="priceList.visible" :rows="priceList.rows" @request="getList" />
    <OperationDialog :visible.sync="operation.visible" :rows="operation.rows" @request="getList" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { getlist, getRtsChannels, getOwnerMemberDisplayNames, productGroupTree, getRtsApiCategoryNode, batchDisplay, getLogList } from "@/api/rts/rtsListing"
import { fetchList } from "@/api/pms/productClass";
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
import PriceDialog from "./components/PriceDialog";
import OperationDialog from "./components/OperationDialog";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  searchType: "sku",
  searchValues: [],
  boutiqueTag: null,
  searchTimeType: "gmtCreate",
  searchBeginTime: "",
  searchEndTime: "",
  authId: null,
  businessStatus: 1,
  ownerMemberDisplayName: "",
  productGroupId: "",
  productClassId: "",
  categoryId: ""
};
function filterTree(data) {
  for (var i = 0; i < data.length; i++) {
    if (!data[i].children) break;
    if (data[i].children.length < 1) {
      // children若为空数组，则将children设为undefined
      data[i].children = undefined;
    } else {
      // children若不为空数组，则继续 递归调用 本方法
      filterTree(data[i].children);
    }
  }
  return data;
}
export default {
  name: "rtsListing",
  components: {
    SkuInfoView,
    LogView,
    RadioButtonGroup,
    ScrollSelect,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard,
    NumberInput,
    PriceDialog,
    OperationDialog
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      states: [
        { label: "在线", value: 1 },
        { label: "已下架", value: 2 },
        // { label: "疑似删除", value: 2 },
        { label: "上架中", value: 3 },
        { label: "下架中", value: 4 },
        { label: "失败", value: 6 },
      ],
      typeList: {
        searchTypeList: [
          { label: "SKU", value: "sku" },
          { label: "渠道SKU", value: "productId" },
          { label: "itemID", value: "pId" },
        ],
        boutiqueTagList: [
          { label: "精品", value: 1 },
          { label: "普通品", value: 2 },
          { label: "低质品", value: 3 },
          { label: "实力优品", value: 4 },
        ],
        searchTimeTypeList: [
          { label: "刊登", value: "gmtCreate" },
          { label: "更新", value: "gmtModified" },
          { label: "数据", value: "lastOperationTime" },
        ],
        authIdList: [],
        ownerMemberDisplayNameList: [],
        productGroupIdList: [],
        classList: [],
        categoryIdList: []
      },
      createTimeAndEndTime: [],
      SkuNum: "",
      SkuDialogVisible: false,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "type", width: "150" },
          { label: "操作人", property: "createUser", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getLogList,
        param: {
          productId: "",
        },
      },
      priceList: {
        visible: false,
        rows: {}
      },
      operation: {
        visible: false,
        rows: []
      }
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
      this.listQuery.searchBeginTime = timeArr[0];
      this.listQuery.searchEndTime = timeArr[1];
    },
  },
  filters: {
    productTypeFilter(type) {
      switch (type) {
        case "wholesale":
          return "直接下单";
        case "sourcing":
          return "非直接下单";
        default:
          return ""
      }
    },
    boutiqueTagFilter(type) {
      switch (type) {
        case "1":
          return "精品";
        case "2":
          return "普通品";
        case "3":
          return "低质品";
        case "4":
          return "实力优品";
        default:
          return ""
      }
    }
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
    async getType() {
      const resChannels = getRtsChannels();
      const resNames = getOwnerMemberDisplayNames()
      const resGroup = productGroupTree({ authId: "" })
      const resCategory = getRtsApiCategoryNode()
      Promise.all([resChannels, resNames, resGroup, resCategory]).then((res) => {
        this.typeList.authIdList = res[0].data
        this.typeList.ownerMemberDisplayNameList = res[1].data
        this.typeList.productGroupIdList = filterTree(res[2].data)
        this.typeList.categoryIdList = filterTree(res[3].data)
      }).catch((err) => {
        this.typeList.authIdList = []
        this.typeList.ownerMemberDisplayNameList = []
        this.typeList.productGroupIdList = []
        this.typeList.categoryIdList = []
      });
      fetchList().then((response) => {
        this.typeList.classList = response.data.filter((i) => {
          return i.parentid == 0;
        });
        for (let i = 0; i < this.typeList.classList.length - 1; i++) {
          this.typeList.classList[i].children = response.data.filter((item) => {
            return item.parentid == this.typeList.classList[i].classid;
          });
          for (let j = 0; j < this.typeList.classList[i].children.length - 1; j++) {
            this.typeList.classList[i].children[j].children = response.data.filter(
              (item) => {
                return item.parentid == this.typeList.classList[i].children[j].classid;
              }
            );
          }
        }
      });
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
    async getList() {
      this.listLoading = true;
      const productClassId = this.listQuery.productClassId.slice(-1)[0];
      const productGroupId = this.listQuery.productGroupId.slice(-1)[0];
      const categoryId = this.listQuery.categoryId.slice(-1)[0];
      try {
        const res = await getlist({ ...this.listQuery, productClassId, productGroupId, categoryId });
        res.data.list.forEach((item) => {
          //   item.hasChildren = Boolean(item.hasVariation);
          //   item.random = Math.floor(Math.random() * 1000000);
          if (JSON.stringify(item.inventorys) == "{}") {
            return false
          } else {
            item.stock = item.inventorys.product_inventory_dto.reduce((pre, cur) => {
              return pre + cur.inventory
            }, 0)
          }
        });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getOut(type) {
      const text = type == 1 ? "下架" : "上架";
      const list = this.$refs.tableContainer.$refs.singleTable.selection.map(item => {
        return {
          authId: item.authId,
          productId: item.productId,
          sysCode: type == 1 ? "10462" : "10463",
          skuCode: item.sku
        }
      });
      if (list.length === 0) {
        this.$message({
          type: "warning",
          message: `请勾选需要${text}的商品`
        })
        return
      }
      try {
        const comfirm = await this.$confirm(`确定批量${text}勾选中的商品？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await batchDisplay(list);
        if (res.code !== 200) return;
        this.$message({
          type: "success",
          message: res.message
        })
        this.getList()
      } catch (error) { }
    },
    getPrice() {
      if (this.$refs.tableContainer.$refs.singleTable.selection.length === 0) {
        this.$message({
          type: "warning",
          message: `请勾选需要修改价格的商品`
        })
        return
      }
      const istrue = this.$refs.tableContainer.$refs.singleTable.selection.every(item => {
        return item.stock
      })
      const sku = this.$refs.tableContainer.$refs.singleTable.selection.find(i => { return i.productType !== "sourcing" }).sku
      if (!istrue) {
        this.$message({
          type: "warning",
          message: `SKU为${sku}的商品库存为空，请仔细勾选`
        })
        return
      }
      this.operation = {
        visible: true,
        rows: this.$refs.tableContainer.$refs.singleTable.selection.map(item => {
          const modifyData = JSON.parse(item.recordData)
          modifyData['special_skus'].forEach(modifyDataItem => {
            modifyDataItem['inventory_dto_list'].forEach(listItem => {
              listItem.defaultValue = listItem.current_inventory
            })
          })
          return {
            ...item,
            modifyData,
            originalData: item.recordData
          }
        })
      }
    },
    handPrice(row) {
      this.priceList = {
        visible: true,
        rows: row
      }
    },
    editor(row) {
      this.$router.push({ path: "/rts/rtsEditor", query: { id: row && row.id, listing: true } })
    },
    batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
    getSkuInfo(id) {
      this.SkuNum = id;
      this.SkuDialogVisible = true;
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.productId = params;
      this.LogDialogVisible = true;
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