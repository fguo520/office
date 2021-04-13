<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">

        <el-form-item label="SKU：">
          <TextareaInput v-model="listQuery.sku" />
        </el-form-item>
        <el-form-item label="刊登人：">
          <el-select v-model="listQuery.createUser" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.createUserList" :key="index" :label="item.fullName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态：">
          <el-select v-model="listQuery.productStatus" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in typeList.productStatusList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类：">
          <el-cascader v-model="listQuery.productClass" size="mini" :options="typeList.classList" clearable placeholder="全部" :props="{
              label: 'classnamecn',
              value: 'classid',
              checkStrictly: true,
            }"></el-cascader>
        </el-form-item>
        <el-form-item label="渠道名称：">
          <el-input clearable v-model="listQuery.storeName" size="mini" />
        </el-form-item>
        <el-form-item label="自定义时间：">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="editor()" size="mini" v-if="rolePermissionJudge('/lzd/lzdPublish')">刊登商品</el-button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <RadioButtonGroup v-model="listQuery.status" :ButtonTypes="typeList.searchTypeList" @request="getList">
      <template #1>
        <el-button @click="published()" class="radioBtn" size="mini" v-if="rolePermissionJudge('/lzd/lzdAdd')">批量刊登</el-button>
      </template>

      <template #3>
        <el-button @click="getUpdate()" class="radioBtn" size="mini" v-if="rolePermissionJudge('/lzd/lzdGet')">批量成功</el-button>
      </template>

      <template #4>
        <el-tooltip content="温馨提示:一次只能复制刊登一个商品，选多个默认取勾选的第一个">
          <el-button @click="copyPublishedDialog" class="radioBtn" size="mini" v-if="rolePermissionJudge('/lzd/lzdCopy')">
            复制刊登
            <i class="el-icon-warning-outline" />
          </el-button>
        </el-tooltip>

      </template>

      <template #5>
        <el-button @click="getRemove()" class="radioBtn" size="mini" v-if="rolePermissionJudge('/lzd/lzdRemove')">批量删除</el-button>
      </template>
    </RadioButtonGroup>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.image" />
            <div :style="{color:getColorStatus(scope.row.productState).color,backgroundColor:getColorStatus(scope.row.productState).backgroundColor,textAlign:getColorStatus(scope.row.productState).textAlign}">{{scope.row.productState}}</div>
          </template>
        </u-table-column>
        <u-table-column label="SKU" align="center" width="130">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row)">{{ scope.row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'sellerSku: '+scope.row.sellerSku" placement="right-start">
                <div v-if="scope.row.isVariation" class="tooltipClass">
                  <span v-copy="scope.row.sellerSku">{{ scope.row.sellerSku }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="分类" align="center" width="180">
          <template slot-scope="scope">
            <div style="text-align: left">
              <span v-copy="scope.row.fullClassNameEn">{{ scope.row.fullClassNameEn }}</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" width="400">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div><span v-copy="scope.row.storeName">{{scope.row.storeName}}</span></div>
              <el-tooltip class="item" effect="dark" :content="'产品中文名:'+scope.row.productNameCN" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productNameCN">{{scope.row.productNameCN}}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'平台标题:'+scope.row.title" placement="top">
                <div class="tooltipClass">{{ scope.row.title }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="详情" align="center" width="100">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="'刊登人'" placement="top">
                <div>
                  <span v-copy="scope.row.userName"></span>{{ scope.row.userName }}
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'采购价'" placement="top">
                <div><span></span>{{ scope.row.lastBuyPrice }}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'刊登量'" placement="top">
                <div><span></span>{{ scope.row.availableStock }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="站点" align="center" width="140">
          <template slot-scope="scope">
            <div class="item_product">
              <el-button size="mini" type="text" @click="handleCont(scope.row)" style="width:100%;">价格详情</el-button>
              <div v-for="(item,index) in scope.row.productStatusList" :key="index" class="item_p_box">
                <i :style="{backgroundColor:getColor(item.isTrue).backgroundColor}"></i>
                <el-tooltip class="item" effect="dark" :content="item.publishStatus" placement="top">
                  <span v-copy="item.publishStatus">{{item.publishedTo}}</span>
                </el-tooltip>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="币种&价格" align="center" width="100">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>币种: {{ row.settlementCurrency }}</div>
              <div>价格: {{ row.retailPrice }}</div>
              <div>促销: {{ row.salesPrice }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div v-show="scope.row.publishTime">刊登: {{ scope.row.publishTime }}</div>
            <div v-show="scope.row.createTime">创建: {{scope.row.createTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="备注" align="center" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top">
              <div class="tooltipClass" v-copy="scope.row.remark ">{{ scope.row.remark }}</div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editor(scope.row)" v-show="getEditorShow">编辑</el-button>
            <el-button size="mini" type="text" @click="editor(scope.row, 'readonly')">查看</el-button>
            <el-button size="mini" type="text" @click="editor(scope.row, 'copy')" v-show="listQuery.status === 2">复制刊登</el-button>
            <el-button size="mini" type="text" @click="handlejournal(scope.row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />

    <el-dialog title="价格详情" :visible.sync="contDialogVisible" width="500px">
      <u-table ref="skuForm" :data="typeList.skuList" style="width: 100%;font-size:13px" border size="mini" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column prop="sellerSku" label="SellerSKU" align="center">
          <template #default="{ row }">
            <div>{{ row.sellerSku }}</div>
          </template>
        </u-table-column>
        <u-table-column prop="" label="刊登价格" width="250" align="center">
          <template #default="{ row }">
            <div class="skuPrice">
              <div v-for="(item,index) in row.prices" :key="index" class="skuPrice_box">
                <div>
                  <span class="label">{{ item.publishedTo }}</span> :
                  <a class="value" title="刊登价格">{{ item.siteRetailPrice }}</a>
                  <a class="value" title="刊登促销价格">{{ item.siteSalesPrice }}</a>
                </div>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="币种&价格" align="center">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>币种: {{ row.settlementCurrency }}</div>
              <div>价格: {{ row.retailPrice }}</div>
              <div>促销: {{ row.salesPrice }}</div>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </el-dialog>

    <el-dialog title="复制刊登" :visible.sync="copyPublished.visible" width="500px" @close="copeDialogClose">
      <div class="copyDialogTip">温馨提示:一次只能复制刊登一个商品，选多个默认取勾选的第一个</div>

      <el-form ref="copyPublishedForm" :inline="true" size="mini" label-width="100px" :model="copyPublished.requestParams">
        <el-form-item label="渠道:" :rules="copyPublished.rules" prop="shopId">
          <TreeSelect v-model="copyPublished.requestParams.shopId" :list="copyPublished.shopListFilter" placeholder="可多选" :prop="{label:'storeName', value:'id'}" :defaultExpandAll="true" />
        </el-form-item>
      </el-form>
      <u-table style="width: 100%" :data="copyPublished.requestParams.skus" border :header-cell-style="{ 'background-color': '#dadde3' }" :row-key="(row) => row.random">
        <u-table-column label="SKU" align="center" width="150">
          <template slot-scope="scope">
            <div style="text-align: left">
              <i v-copy="scope.row.sku" class="el-icon-document-copy" />
              <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row)">
                {{ scope.row.sku }}
              </el-link>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品中文名" align="center">
          <template slot-scope="scope">
            <div style="text-align: left">
              {{ scope.row.productNameCN }}
            </div>
          </template>
        </u-table-column>
      </u-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyPublished.visible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="copyPublishedCommit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </TabelPageLayout>
</template>

<script>
import {
  searchProductList,
  getLazadaProductLog,
  getUmsAdminList,
  saveProductInfoAddList,
  deleteLazadaProduct,
  updateLazadaProductStatus,
  getLmLazadaApiProductUpdate,
  copyProductInfo,
  getLmSysPlatformAuthList
} from "@/api/lazada/lzdPublish";
import { fetchList } from "@/api/pms/productClass";
import {
  SkuInfoView,
  LogView,
  RadioButtonGroup,
  TabelPageLayout,
  TextareaInput,
  ScrollSelect,
  ShrinkCard,
  TreeSelect
} from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  status: 2,
  productStatus: "",
  sku: [],
  startTime: "",
  endTime: "",
  createUser: "",
  storeName: "",
  timeType: 1,
  productClass: ""
};
export default {
  name: "lzdPublish",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      createTimeAndEndTime: [],
      logViewParam: {
        title: [
          { label: "操作类型", property: "typeStr", width: "120" },
          { label: "操作人", property: "userName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getLazadaProductLog,
        param: {
          taskNo: "",
          sku: "",
        },
      },
      typeList: {
        createUserList: [],
        searchTypeList: [
          { label: "草稿", value: 4 },
          { label: "待刊登", value: 0 },
          { label: "刊登中", value: 1 },
          { label: "刊登成功", value: 2 },
          { label: "刊登失败", value: 3 },
        ],
        productStatusList: ["正常", "停产", "锁定", "起批量", "暂时缺货", "清库"],
        storeList: [],
        skuList: [],
        timeList: [{ label: "刊登", value: 1 }, { label: "创建", value: 2 }],
        classList: []
      },
      SkuNum: "",
      SkuDialogVisible: false,
      LogDialogVisible: false,
      showEditorButton: true,
      contDialogVisible: false,
      copyPublished: {
        visible: false,
        shopListFilter: [],
        requestParams: {
          shopId: [],
          skus: [{ sku: "", taskNo: "", productNameCN: "" }],
        },
        rules: {
          validator(rule, value, callback) {
            if (value.length === 0) callback(new Error('此项为必填！'));
            callback()
          },
          trigger: "change"
        }
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
    TreeSelect
  },
  computed: {
    getColor() {
      return function (i) {
        switch (i) {
          case true:
            return { backgroundColor: "#67c23a" };
          case false:
            return { backgroundColor: "#b1b3b7" };
        }
      };
    },
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
    },
    getEditorShow() {
      const { status } = this.listQuery;
      return status === 3 || status === 4
    }
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
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
    getQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      const productClass = this.listQuery.productClass.slice(-1)[0];
      try {
        const res = await searchProductList({ ...this.listQuery, productClass });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getType() {
      getUmsAdminList().then((res) => {
        this.typeList.createUserList = res.data;
      });
      getLmSysPlatformAuthList().then((res) => {
        this.typeList.storeList = res.data;
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
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.createTimeAndEndTime = [];
      this.getList();
    },
    getSkuInfo(row) {
      this.SkuDialogVisible = true;
      if (row.isVariation) {
        this.SkuNum = row.sellerSku;
      } else {
        this.SkuNum = row.sku;
      }
    },
    editor(row, type) {
      const routerParam = (function () {
        switch (type) {
          case 'readonly':
            return 'lzdReadonly';
          case 'copy':
            return 'lzdCopyPublishEditor';
          default:
            return 'lzdPublishEditor'
        }
      }());
      const routerPath = `/lazada/${routerParam}`
      const query = row ? { routeSku: row.sku, routeTaskNo: row.taskNo ,routeStatus:this.listQuery.status} : {};
      this.$router.push({ path: routerPath, query })
    },
    async published() {
      const pulishList = this.$refs.tableContainer.$refs.singleTable.selection.map((item) => {
        return {
          sku: item.sku,
          taskNo: item.taskNo,
        };
      });
      if (pulishList.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选需要刊登的商品"
        })
        return
      }
      try {
        const comfirm = await this.$confirm('确定批量刊登勾选中的商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await saveProductInfoAddList(pulishList);
        if (res.code !== 200) return;
        this.$message({
          type: "success",
          message: res.message
        })
        this.getList()
      } catch (error) { }
    },
    //日志
    handlejournal(row) {
      this.logViewParam.param = {
        taskNo: row.taskNo,
        sku: row.sku,
      };
      this.LogDialogVisible = true;
    },
    handleCont(row) {
      this.contDialogVisible = true;
      getLmLazadaApiProductUpdate({ sku: row.sku, taskNo: row.taskNo }).then(res => {
        const { settlementCurrency, retailPrice, salesPrice } = row;
        this.typeList.skuList = [{
          ...res.data.skuParamList[0],
          settlementCurrency,
          retailPrice,
          salesPrice
        }]
      })
    },
    //删除刊登
    async getRemove() {
      const pulishList = this.$refs.tableContainer.$refs.singleTable.selection.map((item) => {
        return {
          sku: item.sku,
          taskNo: item.taskNo,
        };
      });
      if (pulishList.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选需要批量删除的商品"
        })
        return
      }
      try {
        const comfirm = await this.$confirm('确定批量删除勾选中的商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteLazadaProduct(pulishList);
        if (res.code !== 200) return;
        this.$message({
          type: "success",
          message: res.message
        })
        this.getList()
      } catch (error) { }
    },
    async getUpdate() {
      const pulishList = this.$refs.tableContainer.$refs.singleTable.selection.map((item) => {
        return {
          sku: item.sku,
          taskNo: item.taskNo,
        };
      });
      if (pulishList.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选需要批量成功的商品"
        })
        return
      }
      try {
        const comfirm = await this.$confirm('确定批量成功勾选中的商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await updateLazadaProductStatus(pulishList);
        if (res.code !== 200) return;
        this.$message({
          type: "success",
          message: res.message
        })
        this.getList()
      } catch (error) { }
    },
    copyPublishedDialog() {
      if (this.$refs.tableContainer.$refs.singleTable.selection.length === 0) {
        this.$message.warning("请勾选需要复制刊登的商品（一次只能复制刊登一个）")
        return
      }
      this.copyPublished.visible = true
      this.copyPublished.requestParams.shopId = []
      if (this.$refs.copyPublishedForm) this.$refs.copyPublishedForm.clearValidate()
      const { sku, taskNo, storeName, productNameCN } = this.$refs.tableContainer.$refs.singleTable.selection[0];
      let requestParams = this.copyPublished.requestParams.skus[0];
      requestParams.sku = sku;
      requestParams.taskNo = taskNo;
      requestParams.productNameCN = productNameCN
      this.copyPublished.shopListFilter = [{
        storeName: "全选",
        children: this.typeList.storeList.filter(item => {
          return storeName !== item.storeNameAs
        })
      }]
    },
    copeDialogClose() {
      setTimeout(() => { this.copyPublished.requestParams.shopId = [] }, 100)
    },
    copyPublishedCommit() {
      this.$refs.copyPublishedForm.validate(async valid => {
        if (!valid) return;
        try {
          const res = await copyProductInfo(this.copyPublished.requestParams)
          this.copyPublished.visible = false;
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: res.data
            })
            this.getList();
          }
        } catch (error) { }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.item_product {
  .item_p_box {
    width: 57px;
    float: left;
    margin-top: 5px;
    text-align: left;
    i {
      display: inline-block;
      border-radius: 50%;
      width: 12px;
      height: 12px;
    }
    span {
      margin-left: 5px;
    }
  }
}
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}

.skuPrice {
  text-align: left;
  .skuPrice_box {
    // width: 49%;
    float: left;
  }
  /deep/ .label {
    display: inline-block;
    width: 22px;
  }
  .value {
    display: inline-block;
    width: 78px;
    text-align: left;
  }
}
.copyDialogTip {
  width: 100%;
  color: gray;
  font-size: 12px;
  position: absolute;
  top: 50px;
  left: 0px;
  text-align: center;
}
</style>
