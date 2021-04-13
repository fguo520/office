<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageIndex" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="自定义参数:">
          <el-select v-model="listQuery.paramType" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in paramTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <TextareaInput v-model="listQuery.paramValue" />
        </el-form-item>
        <el-form-item label="站点渠道:">
          <el-select v-model="siteChannels" placeholder="全部" clearable size="mini" class="input-width" filterable :filter-method="selectFilter" @visible-change="SelectVisibleChange" @clear="handclear">
            <el-option style="height: auto; background-color: #fff; font-weight: 400" value="">
              <el-tree :data="regionList" accordion ref="treeTeam" node-key="code" :props="{ label: 'name',children: 'shops' }" show-checkbox @check="handleCheckChange" :filter-node-method="filterNode">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类:">
          <el-cascader v-model="listQuery.productClass" size="mini" :options="typeList" clearable placeholder="全部" :props="{
              label: 'classnamecn',
              value: 'classid',
              checkStrictly: true,
            }"></el-cascader>
        </el-form-item>
        <el-form-item label="上架人员:">
          <el-input clearable v-model="listQuery.accountOwner" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="产品状态:">
          <ScrollSelect v-model="listQuery.productState" :list="productList" placeholder="可多选" />
        </el-form-item>
        <el-form-item label="模式:">
          <div class="buttonContainer">
            <el-button @click="conditions({ isVariant: 0 })" :type="buttonType('isVariant', 0)" size="mini">非变体</el-button>
            <el-button @click="conditions({ isVariant: 1 })" :type="buttonType('isVariant', 1)" size="mini">变体</el-button>
          </div>
        </el-form-item>
        <el-form-item label="其他状态:">
          <el-select v-model="listQuery.substate" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in substateList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="低于成本价:">
          <el-select v-model="listQuery.isCostPrice" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in costPriceList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="锁定库存同步:">
          <el-select v-model="listQuery.isLock" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in isLockList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="上架时间:">
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px"></el-date-picker>
        </el-form-item>
        <el-form-item label="自定义查询:">
          <el-select v-model="listQuery.paramCustom" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:100px">
            <el-option v-for="(item, index) in customList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <NumberInput v-model="listQuery.startParamCustomValue" min="0" float style="width:80px"></NumberInput> —
          <NumberInput v-model="listQuery.endParamCustomValue" min="0" float style="width:80px"></NumberInput>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.status" :ButtonTypes="states" @request="getList" :doubleCancle="false">
      <template #1>
        <el-button @click="getBatchLowerShelf()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/down')">批量下架</el-button>
        <el-button @click="getUpdate()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/update')">批量修改</el-button>
        <el-button @click="getRemove()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/remove')">批量删除</el-button>
        <el-button @click="getExport()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/export')">导出成本价</el-button>
        <el-button @click="handLock(0)" class="radioBtn" size="mini" v-if="rolePermissionJudge('/lzd/list/getLock')">锁定库存同步</el-button>
        <el-button @click="handLock(1)" class="radioBtn" size="mini" v-if="rolePermissionJudge('/lzd/list/setLock')">解除锁定库存同步</el-button>
      </template>

      <template #2>
        <el-button @click="getBatchUpperShelf()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/add')">批量上架</el-button>
        <el-button @click="getUpdate()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/update')">批量修改</el-button>
        <el-button @click="getRemove()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/remove')">批量删除</el-button>
        <el-button @click="getExport()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/export')">导出成本价</el-button>
      </template>

      <template #3>
        <el-button @click="getExport()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/export')">导出成本价</el-button>
      </template>
      <template #4>
        <el-button @click="getExport()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/export')">导出成本价</el-button>
      </template>
      <template #5>
        <el-button @click="getExport()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/export')">导出成本价</el-button>
      </template>
      <template #6>
        <el-button @click="getExport()" size="mini" class="radioBtn" v-if="rolePermissionJudge('/lzd/list/export')">导出成本价</el-button>
      </template>
    </RadioButtonGroup>

    <template #dropdown>
      <span @click="batchCopyRow('shopSku')">
        <el-dropdown-item>批量复制渠道Sku</el-dropdown-item>
      </span>
      <span @click="batchCopyRow('itemId')">
        <el-dropdown-item>批量复制ItemID</el-dropdown-item>
      </span>
    </template>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" @selection-change="handleSelectionChange" :default-expand-all="false" row-id="random" :treeConfig="{lazy: true, load:loadTableTree }" v-if="isDisplaymode">
        <u-table-column type="selection" width="50" />
        <u-table-column label="ItemID" align="center" width="150" :tree-node="true">
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
              <div v-show="Boolean(scope.row.isVariant)" style="background-color: #67c23a; color: #fff">变体</div>
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
        <u-table-column label="sku" align="center" width="180">
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
        <u-table-column label="类目" align="center" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.categoryName" placement="top">
              <div class="tooltipClass">
                <span v-copy="scope.row.categoryName"> {{ scope.row.categoryName }}</span>
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
                <span><b style="color:rgb(255, 0, 0);">{{scope.row.isLock?"锁定库存同步":""}}</b></span>
                <span v-if="scope.row.substate==1"><b>图片缺失</b></span>
                <span v-if="scope.row.substate==2"><b>售罄</b></span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="站点" align="center" width="100">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>{{ getCurrencyFilter(scope.row.site) }}</div>
              <div>
                <span v-copy="scope.row.site">{{ scope.row.site }}</span>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="上架" align="center" width="100">
          <template slot-scope="scope">
            <div>
              <span v-copy="scope.row.accountOwner">{{scope.row.accountOwner}}</span>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="价格" align="center" width="120">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>原价: {{ row.price }}</div>
              <el-tooltip class="item" effect="dark" content="( 成本 / 汇率 + 运费 ) / (1 - 退换货率 - 佣金 - 付款手续费 - 提现手续费 - 汇率折损率)" placement="top">
                <div>成本: {{ row.costPrice }}</div>
              </el-tooltip>
              <div>促销: {{ row.specialPrice }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="库存" align="center" width="120">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>在线:{{ scope.row.sellableStock }}</div>
              <div>可用:{{ scope.row.goodNum }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="上架时间" align="center" width="160">
          <template slot-scope="scope">
            <div>{{ scope.row.specialFromTime }}</div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleupdate(scope.row)" v-if="scope.row.status=='inactive' || scope.row.status=='live'">
              编辑
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
    <!-- 批量上架下架 -->
    <el-dialog :title="isPut ? '批量上架' : '批量下架'" :visible.sync="putawayVisible" width="30%">
      <span>是否将选中商品{{ isPut ? "批量上架" : "批量下架"}}？是请按确认按钮！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="putawayVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handPutaway" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量修改 -->
    <el-dialog title="批量修改库存价格" :visible.sync="updateVisible" width="70%" custom-class="updateVisible">
      <u-table style="width: 100%" :data="updataList" border height="500px" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.imageUrl" style="width: 100px" />
            <div :style="{
                backgroundColor: getProductstate(scope.row.productState)
                  .backgroundColor,
                color: getProductstate(scope.row.productState).color,
              }">
              {{ scope.row.productState }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="sku" align="center" width="120">
          <template slot-scope="scope">
            <div style="text-align: left">
              <p>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">
                  {{ scope.row.sku }}
                </el-link>
              </p>
              <el-tooltip class="item" effect="dark" :content="scope.row.shopSku" placement="bottom">
                <p class="tooltipClass">
                  <span v-copy="scope.row.shopSku">{{
                    scope.row.shopSku
                  }}</span>
                </p>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="ItemID" align="center" width="120">
          <template slot-scope="scope">
            <div style="text-align: left">
              <i v-copy="scope.row.itemId" class="el-icon-document-copy"></i>
              <el-link :underline="false" type="primary" :href="scope.row.url" target="_blank">
                {{ scope.row.itemId }}
              </el-link>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="分类" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.categoryName" placement="top">
              <div class="tooltipClass">
                {{ scope.row.categoryName }}
              </div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="scope.row.storeName" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.storeName">{{
                    scope.row.storeName
                  }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.productNameCN" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productNameCN">{{
                    scope.row.productNameCN
                  }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.title">{{ scope.row.title }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>

        <u-table-column label="站点" align="center" width="100">
          <template slot-scope="scope">
            <div v-copy="scope.row.site">{{ scope.row.site }}</div>
          </template>
        </u-table-column>
        <u-table-column label="上架" align="center" width="100">
          <template slot-scope="scope">
            <p>{{ scope.row.accountOwner }}</p>
          </template>
        </u-table-column>
        <u-table-column label="价格" align="center" width="130">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'原价:  ' + scope.row.price" placement="top">
                <div>原价: {{ scope.row.price }}</div>
              </el-tooltip>
              <div style="display: flex; line-height: 28px">
                修改:
                <el-input v-model="scope.row.newprice" size="mini" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="8" style="width: 70px; margin-left: 5px"></el-input>
              </div>
              <el-tooltip class="item" effect="dark" :content="'促销:  ' + scope.row.specialPrice" placement="top">
                <div>促销: {{ scope.row.specialPrice }}</div>
              </el-tooltip>
              <div style="display: flex; line-height: 28px">
                修改:
                <el-input v-model="scope.row.newspecialPrice" size="mini" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="8" style="width: 70px; margin-left: 5px"></el-input>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="库存" align="center" width="130">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'在线库存:  ' + scope.row.sellableStock" placement="top">
                <div>在线: {{ scope.row.sellableStock }}</div>
              </el-tooltip>
              <div style="display: flex; line-height: 28px">
                修改:
                <el-input v-model="scope.row.newsellableStock" size="mini" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="8" style="width: 70px; margin-left: 5px"></el-input>
              </div>
              <el-tooltip class="item" effect="dark" :content="'可用库存:  ' + scope.row.goodNum" placement="top">
                <p>可用: {{ scope.row.goodNum }}</p>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
      </u-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handUpdate" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量删除 -->
    <el-dialog title="批量删除" :visible.sync="removeVisible" width="30%">
      <span>是否将选中商品删除？是请按确认按钮！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handRemove" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导出成本价 -->
    <el-dialog title="导出成本价" :visible.sync="dialogVisible" v-if="dialogVisible" width="20%">
      <el-radio-group v-model="radioExport">
        <p>
          <el-radio :label="1">当前条件自定义导出</el-radio>
        </p>
        <p style="margin-top:20px">
          <el-radio :label="2">自定义选中数据导出</el-radio>
        </p>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handExport" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </TabelPageLayout>
</template>

<script>
import {
  getList,
  getLoglist,
  batchUpperShelf,
  batchLowerShelf,
  updatePriceProductListing,
  getProductListingByItemIdList,
  searchProductListingByItemId,
  batchDeleteListing,
  getRegionList,
  addLazadaPriceExcelExport,
  setLazadaLock
} from "@/api/lazada/lzdListing";
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
const defaultListQuery = {
  pageIndex: 1,
  pageSize: 20,
  accountOwner: "",
  paramType: 1,
  paramValue: [],
  storeName: [],
  startTime: "",
  endTime: "",
  status: "live",
  regionCode: [],
  paramCustom: "",
  startParamCustomValue: "",
  endParamCustomValue: "",
  productClass: "",
  substate: null,
  productState: [],
  isCostPrice: null,
  isVariant: null,
};
export default {
  name: "lzdListing",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      createTimeAndEndTime: [],
      states: [
        { label: "在线", value: "live" },
        { label: "已下架", value: "inactive" },
        { label: "删除", value: "deleted" },
        { label: "待上架", value: "waitLive" },
        { label: "待下架", value: "waitInactive" },
        { label: "待删除", value: "waitDeleted" },
      ],
      listLoading: false,
      list: [],
      total: null,
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
        request: getLoglist,
        param: {
          itemId: "",
        },
      },
      valList: [],
      putawayVisible: false,
      isPut: true,
      updateVisible: false,
      updataList: [],
      regionCodeList: [
        { label: "马来西亚", value: 10349 },
        { label: "菲律宾", value: 10350 },
        { label: "新加坡", value: 10351 },
        { label: "越南", value: 10352 },
        { label: "泰国", value: 10353 },
        { label: "印度尼西亚", value: 10354 },
      ],
      typeList: [],
      customList: [
        { label: "可用库存", value: 1 },
        { label: "在线库存", value: 2 },
        { label: "原价", value: 3 },
        { label: "促销价", value: 4 },
      ],
      isDisplaymode: true,
      removeVisible: false,
      substateList: [
        { label: "图片缺失", value: 1 },
        { label: "售罄", value: 2 },
      ],
      regionList: [],
      siteChannels: "",
      nameSearch: "",
      productList: ["正常", "停产", "暂时缺货", "清库", "起批量", "锁定"],
      costPriceList: [{ label: "是", value: true },
      { label: "否", value: false },],
      dialogVisible: false,
      radioExport: 1,
      paramTypeList: [
        { label: "SKU", value: 1 },
        { label: "渠道SKU", value: 3 },
        { label: "itemId", value: 2 },
      ],
      isLockList: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ]
    };
  },
  watch: {
    nameSearch(val) {
      this.$refs.treeTeam.filter(val);
    },
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
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
  components: {
    SkuInfoView,
    LogView,
    RadioButtonGroup,
    ScrollSelect,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard, NumberInput
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
    getCurrencyFilter() {
      return function (type) {
        switch (type) {
          case "新加坡":
            return "SGD";
          case "马来西亚":
            return "MYR";
          case "越南":
            return "VND";
          case "泰国":
            return "THB";
          case "菲律宾":
            return "PHP";
          case "印度尼西亚":
            return "IDR";
          default:
            return "未知";
        }
      };
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const productClass = this.listQuery.productClass.slice(-1)[0];
      try {
        const res = await getList({ ...this.listQuery, productClass });
        res.data.list.forEach((item) => {
          item.hasChildren = Boolean(item.isVariant);
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
    getType() {
      fetchList().then((response) => {
        this.typeList = response.data.filter((i) => {
          return i.parentid == 0;
        });
        for (let i = 0; i < this.typeList.length - 1; i++) {
          this.typeList[i].children = response.data.filter((item) => {
            return item.parentid == this.typeList[i].classid;
          });
          for (let j = 0; j < this.typeList[i].children.length - 1; j++) {
            this.typeList[i].children[j].children = response.data.filter(
              (item) => {
                return item.parentid == this.typeList[i].children[j].classid;
              }
            );
          }
        }
      });
      getRegionList().then((res) => {
        this.regionList = res.data;
      });
    },
    handleSelectionChange(val) {
      this.valList = val;
    },
    batchCopyRow(key) {
      this.$refs.tabelPageLayout.toggleSelection(key)
    },
    //上架
    getBatchUpperShelf() {
      if (this.valList.length > 0) {
        this.putawayVisible = true;
        this.isPut = true;
      } else {
        this.$message.warning("请选中商品");
      }
    },
    handPutaway() {
      if (this.isPut) {
        batchUpperShelf(this.valList).then((res) => {
          this.putawayVisible = false;
          this.getList();
          this.$message.success(res.message);
        });
      } else {
        batchLowerShelf(this.valList).then((res) => {
          this.putawayVisible = false;
          this.getList();
          this.$message.success(res.message);
        });
      }
    },
    //下架
    getBatchLowerShelf() {
      if (this.valList.length > 0) {
        this.putawayVisible = true;
        this.isPut = false;
      } else {
        this.$message.warning("请选中商品");
      }
    },
    //编辑
    getUpdate() {
      let list = [];
      list = this.valList.map((i) => {
        return i.itemId;
      });
      if (this.valList.length > 0 && this.valList.length <= 20) {
        this.updateVisible = true;
        getProductListingByItemIdList({ itemIds: list }).then((res) => {
          this.updataList = res.data;
          this.updataList.forEach((item) => {
            this.$set(item, "newprice", Number(item.price));
            this.$set(item, "newspecialPrice", Number(item.specialPrice));
            this.$set(item, "newsellableStock", Number(item.sellableStock));
          });
        });
      } else if (this.valList.length > 20) {
        this.$message.warning("选择数量不能超过20");
      } else {
        this.$message.warning("请选中商品");
      }
    },
    handUpdate() {
      this.updataList.forEach((item) => {
        if (item.newprice != null) {
          item.price = Number(item.newprice);
        }
        if (item.newspecialPrice != null) {
          item.specialPrice = Number(item.newspecialPrice);
        }
        if (item.newsellableStock != null) {
          item.sellableStock = Number(item.newsellableStock);
        }
      });
      updatePriceProductListing(this.updataList).then((res) => {
        this.$message.success(res.message);
        this.updataList.forEach((item) => {
          item.newprice = null;
          item.newspecialPrice = null;
          item.newsellableStock = null;
        });
        this.getList();
      });
    },
    //删除
    getRemove() {
      if (this.valList.length > 0) {
        this.removeVisible = true;
      } else {
        this.$message.warning("请选中商品");
      }
    },
    handRemove() {
      batchDeleteListing(this.valList).then((res) => {
        this.removeVisible = false;
        this.$message.success(res.message);
        this.getList();
      });
    },
    async handLock(value) {
      const text = value ? "解除锁定" : "锁定"
      const selection = this.$refs.tableContainer.$refs.singleTable.selection;
      if (selection.length === 0) {
        this.$message.warning("请勾选需要修改的商品")
        return
      }
      try {
        const comfirm = await this.$confirm(`是否将选中的sku${text}？${text}将不自动同步库存！？`, `${text}库存同步提示`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await setLazadaLock({ type: value ? 1 : 0, itemParamList: selection })
        if (res.code === 200) {
          this.$message({ type: "success", message: res.message })
          this.getList()
        }
      } catch (error) { }

    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.isDisplaymode = false;
      this.$nextTick(() => {
        this.isDisplaymode = true;
        this.getList();
      });
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.createTimeAndEndTime = [];
      this.siteChannels = "";
      this.$refs.treeTeam.setCheckedKeys([]);
      this.getList();
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
    handleupdate(row) {
      this.$router.push(`/lazada/lzdListingEditor/${row.itemId}/${row.sku}`);
    },
    //导出
    getExport() {
      this.dialogVisible = true
    },
    handExport() {
      let itemId = this.valList.map(i => i.itemId)
      let type = this.radioExport
      if (this.radioExport == 2) {
        if (this.valList.length < 1) {
          this.$message.warning("请选中商品")
        } else {
          addLazadaPriceExcelExport({ paramValue: itemId, type: type, paramType: 2 }).then(res => {
            this.$message.success(res.message)
            this.getList()
            this.dialogVisible = false
          })
        }
      } else {
        addLazadaPriceExcelExport({ ...this.listQuery, type }).then(res => {
          this.$message.success(res.message)
          this.getList()
          this.dialogVisible = false
        })
      }
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
      searchProductListingByItemId({ itemId: tree.itemId }).then((response) => {
        response.data.forEach((item) => {
          item.random = Math.floor(Math.random() * 1000000);
          item.isVariant = false;
        });
        resolve(response.data);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleCheckChange() {
      let arr = this.$refs.treeTeam
        .getCheckedNodes()
        .filter((item) => {
          return item.shops;
        })
        .map((j) => j.code)
        .concat(this.$refs.treeTeam.getHalfCheckedKeys());
      this.listQuery.regionCode = this.$refs.treeTeam
        .getCheckedNodes()
        .map((i) => i.code);
      this.listQuery.storeName = arr;
      this.siteChannels = this.$refs.treeTeam
        .getCheckedNodes()
        .map((i) => i.name)
        .join(",");
    },
    selectFilter(value) {
      this.nameSearch = value;
    },
    SelectVisibleChange(change) {
      if (!change) {
        this.nameSearch = "";
      }
    },
    //清空树形
    handclear() {
      this.$refs.treeTeam.setCheckedKeys([]);
    },
  },
};
</script>

<style lang="scss" scoped>
.updateVisible {
  .tooltipClass {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
    cursor: pointer;
  }
}
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}
</style>

