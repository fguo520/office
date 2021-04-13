<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="仓库名称:">
          <TreeSelect v-model="listQuery.warehouseNames" :prop="{label:'warehousename',value:'warehousename'}" :list="warehouseList" />
        </el-form-item>
        <el-form-item label="产品分类:">
          <el-cascader v-model="listQuery.productClassId" :options="typeList.categoriesType" clearable placeholder="全部" size="mini" :props="{
              label: 'classnamecn',
              value: 'classid',
              checkStrictly: true,
            }" />
        </el-form-item>
        <el-form-item label="搜索类型:">
          <el-select v-model="listQuery.batchSearchType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in TypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <TextareaInput v-model="listQuery.batchSearchValue" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:3px">
      <el-button type="primary" size="mini" @click="handUpdate" :disabled="unDisabled" :loading="unDisabled" v-if="rolePermissionJudge('/wms/wareInventory')">更新</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <!-- <u-table-column
          label="编号"
          width="50"
          align="center"
          type="index"
        ></u-table-column> -->
        <u-table-column label="sku" align="center" prop="sku" width="130">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">{{ scope.row.sku }}</el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'自定义SKU:'+scope.row.clientsku" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="scope.row.clientsku">{{
                    scope.row.clientsku
                  }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'渠道SKU:'+scope.row.sellersku" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="scope.row.sellersku">{{
                    scope.row.sellersku
                  }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.smallImageUrl" />
          </template>
        </u-table-column>
        <u-table-column label="分类" align="center" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.fullclassnamecn" placement="top">
              <div class="tooltipClass">
                {{ scope.row.fullclassnamecn }}
              </div>
            </el-tooltip>
          </template>
        </u-table-column>

        <u-table-column label="产品中文名" align="center" width="300">
          <template #default="{ row }">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="row.productNameCN" placement="top">
                <div class="tooltipClass">
                  <span v-copy="row.productNameCN">{{
                    row.productNameCN
                  }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="仓库名称" align="center">
          <template #default="{ row }">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="row.warehousename" placement="top">
                <div class="tooltipClass">
                  <span v-copy="row.warehousename">{{
                    row.warehousename
                  }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="库位" align="center" prop="positioncode" width="100"></u-table-column>
        <u-table-column label="采购中" align="center" prop="processingnum" width="100"></u-table-column>
        <u-table-column label="活跃天数" align="center" prop="activedays" width="100"></u-table-column>
        <u-table-column label="库存数量" align="center" width="100">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>可用: {{ row.goodnum }}</div>
              <div>锁定: {{ row.locknum }}</div>
            </div>
          </template>
        </u-table-column>

        <u-table-column label="历史" align="center" width="130">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>历史入库: {{ scope.row.historyinnum }}</div>
              <div>历史出库: {{ scope.row.historyoutnum }}</div>
              <div>7 天出库: {{ scope.row.outputnum }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="更新时间" align="center" width="200">
          <template #default="{ row }">
            <div v-show="row.lastoperationtime">最近: {{ row.lastoperationtime }}</div>
            <div v-show="row.activetime">活跃: {{ row.activetime }}</div>
            <div v-show="row.updatetime">库存: {{ row.updatetime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handlejournal(scope.row.id)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <LogView :config="logViewParam" :visible.sync="dialogVisible" />
  </TabelPageLayout>
</template>
<script>
import {
  productInventoryList,
  productInventoryManualUpdate,
  getProductInventoryLogList,
  treeWareHouseName,
} from "@/api/wms/wareInventory";
import { fetchList } from "@/api/pms/productClass";
import {
  SkuInfoView,
  LogView,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard,
  TreeSelect
} from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  batchSearchType: "SKU",
  batchSearchValue: [],
  warehouseNames: [],
  productClassId: ""
};
export default {
  name: "wareInventory",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      SkuDialogVisible: false,
      SkuNum: "",
      dialogVisible: false,
      warehouseList: [],
      unDisabled: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "createPerson", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getProductInventoryLogList,
        param: {
          name: "",
          date: "",
        },
      },
      TypeList: [
        { label: "系统sku", value: "SKU" },
        { label: "自定义sku", value: "ClientSKU" },
        { label: "渠道sku", value: "SellerSKU" },
      ],
      typeList: {
        categoriesType: []
      }
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
    SkuInfoView,
    LogView,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard,
    TreeSelect
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const productClassId = this.listQuery.productClassId.slice(-1)[0];
      try {
        const res = await productInventoryList({ ...this.listQuery, productClassId });
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
    getType() {
      treeWareHouseName().then((response) => {
        this.warehouseList = response.data;
      });
      fetchList().then((response) => {
        this.typeList.categoriesType = response.data.filter((i) => {
          return i.parentid == 0;
        });
        for (let i = 0; i < this.typeList.categoriesType.length - 1; i++) {
          this.typeList.categoriesType[i].children = response.data.filter(
            (item) => {
              return item.parentid == this.typeList.categoriesType[i].classid;
            }
          );
          for (
            let j = 0;
            j < this.typeList.categoriesType[i].children.length - 1;
            j++
          ) {
            this.typeList.categoriesType[i].children[
              j
            ].children = response.data.filter((item) => {
              return (
                item.parentid ==
                this.typeList.categoriesType[i].children[j].classid
              );
            });
          }
        }
      });
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handUpdate() {
      this.unDisabled = true;
      productInventoryManualUpdate().then((response) => {
        if (200 == response.code) {
          this.unDisabled = false;
          this.$message.success(response.message);
        }
        this.getList();
      });
    },
    getSkuInfo(id) {
      this.SkuDialogVisible = true;
      this.SkuNum = id;
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>