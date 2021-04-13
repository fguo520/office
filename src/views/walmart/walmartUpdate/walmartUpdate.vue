
<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="自定义参数：">
          <el-select v-model="listQuery.type" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.keyList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <TextareaInput v-model="listQuery.keyword" />
        </el-form-item>
        <el-form-item label="类目：">
          <el-select v-model="listQuery.category" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.categoryList" :key="index" :label="item.category" :value="item.category" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道：">
          <el-select v-model="listQuery.authId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.authList" :key="index" :label="item.storeNameAs" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="刊登人：">
          <el-select v-model="listQuery.createUser" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.adminList" :key="index" :label="item.fullName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类：">
          <el-cascader v-model="listQuery.productClass" size="mini" :options="typeList.classList" clearable placeholder="全部" :props="{
              label: 'classnamecn',
              value: 'classid',
              checkStrictly: true,
            }" />
        </el-form-item>
        <el-form-item label="产品状态：">
          <ScrollSelect v-model="listQuery.productStatus" :list="typeList.productList" placeholder="可多选" />
        </el-form-item>
        <el-form-item label="模式：">
          <div style="width:193px;">
            <el-button @click="conditions({ isVariation: 0 })" :type="buttonType('isVariation', 0)" size="mini">非变体</el-button>
            <el-button @click="conditions({ isVariation: 1 })" :type="buttonType('isVariation', 1)" size="mini">变体</el-button>
          </div>
        </el-form-item>
        <el-form-item label="自定义时间：">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <RadioButtonGroup v-model="listQuery.status" :ButtonTypes="typeList.statusList" @request="getQuery">
      <template #1>
        <el-button @click="getQuery(2)" size="mini" class="radioBtn" icon="el-icon-search" v-if="rolePermissionJudge('/walmart/WalmartUpdate/update')">更新成功</el-button>
      </template>
    </RadioButtonGroup>

    <template #dropdown>
      <span @click="batchCopyRow('productId')">
        <el-dropdown-item>批量复制UPC</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('customSku')">
        <el-dropdown-item>批量复制渠道SKU</el-dropdown-item>
      </span>
    </template>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" row-id="random" :default-expand-all="false" :treeConfig="{lazy: true, load:loadTableTree }" v-if="isDisplaymode">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />

        <u-table-column label="UPC" align="center" width="150" :tree-node="true">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="scope.row.productId" placement="top">
                <div class="tooltipClass" v-copy="scope.row.productId">{{scope.row.productId}}</div>
              </el-tooltip>

            </div>
            <div>
              <div v-show="Boolean(scope.row.isVariation)" style="background-color: #67c23a; color: #fff">变体</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.image" />
            <div :style="getColorStatus(scope.row.productState)">{{scope.row.productState}}</div>
          </template>
        </u-table-column>
        <u-table-column label="SKU" align="center" width="150">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row)">{{ scope.row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'渠道SKU：'+scope.row.customSku" placement="right-start">
                <div class="tooltipClass"><span v-copy="scope.row.customSku">{{scope.row.customSku}}</span></div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <div style="text-align:left">
              <div v-if="scope.row.status == 2" style="color:blue;font-weight:bold">在线</div>
              <div v-if="scope.row.statusStr=='更新成功'" style="color:#16c067;font-weight:bold">{{scope.row.statusStr}}</div>
              <div v-else>{{scope.row.statusStr}}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="类目&分类" align="center" width="180">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="scope.row.category" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.category"> {{ scope.row.category }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.fullClassNameEn" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.fullClassNameEn"> {{ scope.row.fullClassNameEn }}</span>
                </div>
              </el-tooltip>
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
                <div class="tooltipClass"> <span v-copy="scope.row.title">{{ scope.row.title }}</span></div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="详情" align="center" width="120">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'刊登人'" placement="top">
                <div>
                  <span v-copy="scope.row.userName">{{ scope.row.userName }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'价格'" placement="top">
                <div><span></span>{{ scope.row.price }} {{scope.row.settlementCurrency}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div v-show="scope.row.publishTime">刊登: {{scope.row.publishTime}}</div>
            <div v-show="scope.row.createTime">创建: {{scope.row.createTime}}</div>
            <div v-show="scope.row.status == 2">更新: {{ scope.row.feedTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="备注" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top">
              <div class="tooltipClass" v-copy="scope.row.remark ">{{ scope.row.remark }}</div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editor(scope.row)" v-show="showEditorButton">编辑</el-button>
            <el-button size="mini" type="text" @click="handlejournal(scope.row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import {
  SkuInfoView,
  LogView,
  RadioButtonGroup,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard,
  ScrollSelect
} from "@/components";
import { getLmWalmartProductList, getWalmartApiCategoryList, getLmSysPlatformAuthList, getUmsAdminList, getWalmartProductLog, getLmWalmartProductById } from "@/api/walmart/walmartUpdate"

import { fetchList } from "@/api/pms/productClass";
const defaultListQuery = {
  authId: null,
  category: null,
  createUser: null,
  type: 1,
  status: 0,
  timeType: 1,
  keyword: [],
  isVariation: null,
  successStatus: null,
  productClass: "",
  productStatus: [],
  startTime: "",
  endTime: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "walmartUpdate",
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
        request: getWalmartProductLog,
        param: {
          taskNo: "",
          sku: "",
        },
      },
      SkuNum: "",
      SkuDialogVisible: false,
      LogDialogVisible: false,
      typeList: {
        categoryList: [],
        authList: [],
        adminList: [],
        statusList: [
          { label: "在线", value: 0 },
          { label: "更新中", value: 1 },
          { label: "更新失败", value: 3 }
        ],
        keyList: [
          { label: "SKU", value: 1 },
          { label: "UPC", value: 2 },
          { label: "渠道SKU", value: 3 },
        ],
        classList: [],
        productList: ["正常", "停产", "暂时缺货", "清库", "起批量", "锁定"],
        timeList: [
          { label: "刊登", value: 1 },
          { label: "创建", value: 2 },
          { label: "更新", value: 3 },
        ],
      },
      showEditorButton: true,
      isDisplaymode: true,
    }
  },
  components: {
    SkuInfoView,
    LogView,
    RadioButtonGroup,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard,
    ScrollSelect
  },
  computed: {
    buttonType() {
      const { listQuery } = this;
      return function (key, value) {
        if (listQuery[key] === "") return "";
        return listQuery[key] === value ? "primary" : "";
      };
    },
    getColorStatus() {
      return function (type) {
        switch (type) {
          case "正常":
            return { backgroundColor: "#16c067", color: "#fff", textAlign: "center" };
          case "起批量":
            return { backgroundColor: "#00b0f5", color: "#fff", textAlign: "center" };
          case "暂时缺货":
            return { backgroundColor: "#d4c80a", color: "#fff", textAlign: "center" };
          case "停产":
            return { backgroundColor: "#e0514d", color: "#fff", textAlign: "center" };
          case "锁定":
            return { backgroundColor: "#a3a3a3", color: "#fff", textAlign: "center" };
          case "清库":
            return { backgroundColor: "#fb9320", color: "#fff", textAlign: "center" };
          default:
            return { backgroundColor: "#e0514d", color: "#fff", textAlign: "center" }
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
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  methods: {
    getQuery(type) {
      if (type) {
        this.listQuery.successStatus = type
      } else {
        this.listQuery.successStatus = null
      }
      this.listQuery.pageNum = 1;
      this.isDisplaymode = false;
      this.$nextTick(() => {
        this.isDisplaymode = true;
        this.getList();
      });
    },
    async getList() {
      this.listLoading = true;
      const productClass = this.listQuery.productClass.slice(-1)[0];
      try {
        const res = await getLmWalmartProductList({ ...this.listQuery, productClass });
        res.data.list.forEach((item) => {
          item.hasChildren = Boolean(item.isVariation);
          item.random = Math.floor(Math.random() * 1000000);
        });
        this.list = res.data.list;
        this.total = res.data.total;
        this.showEditorButton = this.listQuery.status != 1;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getWalmartApiCategoryList();
      const resAuthList = await getLmSysPlatformAuthList();
      const resAdminList = await getUmsAdminList();
      this.typeList.categoryList = res.data
      this.typeList.authList = resAuthList.data
      this.typeList.adminList = resAdminList.data
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
      this.SkuNum = row.sku;
      if (row.isVariation) {
        this.SkuNum = row.sellerSku;
      } else {
        this.SkuNum = row.sku;
      }
    },
    //日志
    handlejournal(row) {
      this.logViewParam.param = {
        taskNo: row.taskNo,
        sku: row.sku,
      };
      this.LogDialogVisible = true;
    },
    batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
    editor(row) {
      const query = row ? { routeSku: row.sku, routeTaskNo: row.taskNo, editorType: 'update' } : {};
      this.$router.push({ path: "walmartEditor", query })
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
    //变体
    loadTableTree(tree, resolve) {
      getLmWalmartProductById({ productId: tree.id }).then((response) => {
        response.data.forEach((item) => {
          item.random = Math.floor(Math.random() * 1000000);
          item.isVariation = false;
        });
        resolve(response.data);
      });
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