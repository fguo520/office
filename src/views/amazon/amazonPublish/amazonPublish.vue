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
        <el-form-item label="人员搜索:">
          <el-select v-model="user" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px" @change="userChange">
            <el-option v-for="(item, index) in typeList.userList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <ScrollSelect v-model="listQuery.createUserId" :list="typeList.creteUserList" :prop="{ label: 'createUserName', value: 'userId' }" placeholder="可多选" v-if="user===1" style="display: inline-flex;vertical-align: inherit" />
          <ScrollSelect v-model="listQuery.accountOwner" :list="typeList.accountOwnerList" placeholder="可多选" v-else style="display: inline-flex; vertical-align: inherit" />
        </el-form-item>
        <el-form-item label="产品名称:">
          <el-input v-model="listQuery.productName" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="店铺:">
          <TreeSelect v-model="listQuery.platformAuthId" :prop="{label:'name',value:'id'}" :list="typeList.platformAuthIdList" />
        </el-form-item>
        <el-form-item label="侵权风险:">
          <ScrollSelect v-model="listQuery.productProperty" :list="typeList.productPropertyList" />
        </el-form-item>
        <el-form-item label="产品状态:">
          <el-select v-model="listQuery.productStatus" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.productStatusList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送方式:">
          <el-select v-model="listQuery.fulfillmentCenterId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.fulfillmentCenterIdList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模式:">
          <div style="width:193px;">
            <el-button @click="conditions({ isVariation: 0 })" :type="buttonType('isVariation', 0)" size="mini">非变体</el-button>
            <el-button @click="conditions({ isVariation: 1 })" :type="buttonType('isVariation', 1)" size="mini">变体</el-button>
          </div>
        </el-form-item>
        <el-form-item label="自定义时间:">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:193px" />
        </el-form-item>
      </el-form>
      <template #button>
        <!--  v-if="rolePermissionJudge('/walmart/walmartPublish')" -->
        <el-button @click="editor()" size="mini">刊登商品</el-button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.publishStatus" :ButtonTypes="states" @request="getList">
    </RadioButtonGroup>
    <template #dropdown>
      <span @click="batchCopyRow('sellerSku')">
        <el-dropdown-item>批量复制渠道Sku</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('asin')">
        <el-dropdown-item>批量复制ASIN</el-dropdown-item>
      </span>
    </template>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" element-loading-text="数据加载中" border height="100" use-virtual :header-cell-style="{ 'background-color': '#dadde3' }" row-id="random" :default-expand-all="false" :treeConfig="{lazy: true, load:loadTableTree }">
        <u-table-column type="selection" width="50" />
        <u-table-column label="SKU&ASIN" align="center" width="220" :tree-node="true">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
                  {{ scope.row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'渠道sku:'+scope.row.sellerSku" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="scope.row.sellerSku">{{
                    scope.row.sellerSku
                  }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'ASIN:'+scope.row.asin" placement="right-start">
                <div class="tooltipClass">
                  <el-link type="primary" :underline="false" :href="scope.row.asinUrl" target="_blank">{{
                    scope.row.asin
                  }}</el-link>
                </div>
              </el-tooltip>
              <div v-show="Boolean(scope.row.isVariation)" style="background-color: #67c23a; color: #fff;text-align:center">变体</div>
            </div>
          </template>
        </u-table-column>

        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.image" style="width: 100px" />
            <div :style="getProductstate(scope.row.productState)">
              {{ scope.row.productState }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="分类" align="center" min-width="200">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'产品库：'+scope.row.shCategory" placement="top">
                <div class="tooltipClass" v-copy="scope.row.shCategory">{{scope.row.shCategory}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'亚马逊：'+scope.row.amazonCategory" placement="top">
                <div class="tooltipClass" v-copy="scope.row.amazonCategory">{{scope.row.amazonCategory}}</div>
              </el-tooltip>

            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" min-width="300">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'渠道名称:'" placement="left">
                <div v-copy="scope.row.platformAuthName">{{scope.row.platformAuthName}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'中文名称:'" placement="left">
                <div class="tooltipClass" v-copy="scope.row.productNameCn">{{scope.row.productNameCn}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'英文名称:'" placement="left">
                <div class="tooltipClass" v-copy="scope.row.productName">{{scope.row.productName}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="详情" align="center" width="180">
          <template #default="{ row }">
            <div style="text-align: left">
              <div><span>站点：</span>{{row.chooseCountryName}}</div>
              <el-tooltip class="item" effect="dark" content="优惠价" placement="right">
                <div><span>售价：</span>{{row.salePrice}}</div>
              </el-tooltip>
              <div><span>在线：</span>{{row.onlineCount}}</div>
              <div><span>配送：</span>{{row.deliveryMode==="FBM"?"自配送":"亚马逊FBA配送"}}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="币种&价格" align="center" width="120">
          <template #default="{ row }">
            <div v-copy="row.currency">{{row.currency}}</div>
            <el-tooltip class="item" effect="dark" content="当前价" placement="right">
              <div>{{row.standardPrice}}</div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="创建&负责人" align="center" width="120">
          <template #default="{ row }">
            <div v-copy="row.createUser">{{row.createUser}}</div>
            <div v-copy="row.accountOwner">{{row.accountOwner}}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div><span v-show="scope.row.releaseTime">刊登：</span>{{ scope.row.releaseTime }}</div>
            <div><span v-show="scope.row.createTime">创建：</span>{{ scope.row.createTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editor(scope.row)" v-if="scope.row.id&&handStatus(scope.row.status)">查看</el-button>
            <el-button size="mini" type="text" @click="editor(scope.row)" v-if="scope.row.id&&handeditorStatus(scope.row.status)">编辑</el-button>
            <el-button size="mini" type="text" @click="handlejournal(scope.row.id)" v-if="scope.row.id">
              日志
            </el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>
<script>
import { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, TreeSelect } from "@/components";
import { getlist, createUser, accountUser } from "@/api/amazon/amazonPublish"
import { getLmAmazonAuthNode, getAmazonListingLogList, shApiProperty } from "@/api/amazon/amazonListing"
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  paramType: 2,
  paramValue: [],
  timeType: 2,
  startTime: "",
  endTime: "",
  publishStatus: 2,
  productStatus: "",
  platformAuthId: [],
  createUserId: [],
  isVariation: "",
  accountOwner: [],
  productProperty: [],
  productName: "",
  fulfillmentCenterId: ""
}
export default {
  name: 'amazonListing',
  components: { SkuInfoView, LogView, RadioButtonGroup, ScrollSelect, TabelPageLayout, TextareaInput, ShrinkCard, NumberInput, TreeSelect },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        paramTypeList: [{ label: "SKU", value: 2 }, { label: "渠道Sku", value: 1 }, { label: "ASIN", value: 3 }],
        timeTypeList: [{ label: "创建", value: 1 }, { label: "刊登", value: 2 },],
        productStatusList: ["正常", "停产", "锁定", "起批量", "暂时缺货", "清库"],
        platformAuthIdList: [],
        creteUserList: [],
        accountOwnerList: [],
        userList: [{ label: "创建人", value: 1 }, { label: "负责人", value: 2 }],
        productPropertyList: [],
        fulfillmentCenterIdList: [{ label: "自配送", value: "FBM" }, { label: "亚马逊FBA配送", value: "FBA" },],
      },
      createTimeAndEndTime: [],
      states: [{ label: "草稿", value: 4 }, { label: "待刊登", value: 0 }, { label: "刊登中", value: 1 }, { label: "刊登成功", value: 2 }, { label: "刊登失败", value: 3 }],
      LogDialogVisible: false,
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
      SkuNum: "",
      SkuDialogVisible: false,
      user: 1,
    }
  },
  computed: {
    handStatus() {
      return function (type) {
        switch (type) {
          case 0: return true;
          case 1: return true;
          case 2: return true;
          case 3: return false;
          case 4: return false;
        }
      }
    },
    handeditorStatus() {
      return function (type) {
        switch (type) {
          case 0: return false;
          case 1: return false;
          case 2: return false;
          case 3: return true;
          case 4: return true;
        }
      }
    },
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
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  created() {
    if (this.$route.query.hasOwnProperty('publishStatus')) {
      this.listQuery.publishStatus = this.$route.query.publishStatus
    }
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
        const res = await getlist({ ...this.listQuery });
        res.data.list.forEach((item) => {
          item.hasChildren = item.isVariation;
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
    getQuery(reset) {
      if (reset) {
        if (this.listQuery.platformAuthIdList == "") {
          this.listQuery.platformAuthIdList = []
        }
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = []
      } else {
        this.listQuery.pageNum = 1
      }
      this.getList();
    },
    async getType() {
      const res = await Promise.all([getLmAmazonAuthNode(), createUser(), shApiProperty()])
      this.typeList.platformAuthIdList = res[0].data
      this.typeList.creteUserList = res[1].data
      this.typeList.productPropertyList = res[2].data
    },
    async userChange() {
      if (this.user === 2) {
        const res = await accountUser()
        this.typeList.accountOwnerList = res.data
        this.listQuery.createUserId = []
      } else {
        const res = await createUser()
        this.typeList.creteUserList = res.data
        this.listQuery.accountOwner = []
      }
    },
    batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.listingId = params;
      console.log(this.logViewParam)
      this.LogDialogVisible = true;
    },
    editor(row) {
      const query = row ? { routeId: row.id, routeStatus: row.status } : {};
      this.$router.push({ path: "amazonEditor", query })
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
    loadTableTree(tree, resolve) {
      setTimeout(() => {
        resolve(tree.variationList);
      })
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