<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="搜索类型:">
          <el-select v-model="listQuery.searchTypes" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.searchTypes" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <TextareaInput v-model="listQuery.searchValues" />
        </el-form-item>
        <el-form-item label="商品分类:">
          <el-cascader v-model="listQuery.productClasses" size="mini" :options="typeList['商品分类']" clearable placeholder="全部" :props="{label: 'classnamecn',value: 'classid',checkStrictly: true}" style="width:297px;" filterable />
        </el-form-item>
        <el-form-item label="侵权风险:">
          <el-select v-model="listQuery.productProperty" placeholder="全部" size="mini" clearable filterable style="width:297px;">
            <el-option v-for="(item, index) in typeList['产品侵权风险']" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流属性:">
          <el-select v-model="listQuery.withBattery" placeholder="全部" style="width:297px;" clearable filterable>
            <el-option v-for="(item, index) in typeList['物流属性']" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索类型:">
          <el-select v-model="listQuery.searchType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.searchType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-model="listQuery.searchValue" style="width:193px;" />
        </el-form-item>
        <el-form-item label="审核类型:">
          <el-select v-model="listQuery.checkType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.checkTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="listQuery.checkStatus" placeholder="全部" size="mini" clearable filterable style="width:193px;">
            <el-option v-for="(item, index) in typeList.checkStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型:">
          <el-select v-model="listQuery.productType" placeholder="请选择" style="width:297px;" clearable>
            <el-option v-for="item in typeList['商品类型']" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="开发类型:">
          <el-select v-model="listQuery.developType" placeholder="全部" style="width:297px;" clearable>
            <el-option v-for="item in typeList['开发类型']" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品来源:">
          <el-select v-model="listQuery.comeSource" placeholder="全部" style="width:297px;" clearable>
            <el-option v-for="item in typeList['商品来源']" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否翻译:">
          <el-select v-model="listQuery.isTranslate" placeholder="全部" size="mini" clearable filterable style="width:297px;">
            <el-option v-for="(item, index) in typeList.isTranslateList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发货仓库:">
          <el-select v-model="listQuery.warehouseShipping" placeholder="全部" style="width:297px;" clearable>
            <el-option v-for="item in typeList['发货仓库']" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间类型:">
          <el-select v-model="listQuery.dateType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.dateTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker @change="timeChange" v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="$router.push('/pmsV2/pmsV2Editor')" size="mini" v-if="rolePermissionJudge('/pmsV2List/add')">添加新品</el-button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.productState" :ButtonTypes="typeList['商品状态']" @request="getList" />

    <div>
      <el-button @click="template.visible = true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/pmsV2List/maintain')">维护模板</el-button>
      <el-button @click="custom.visible = true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/pmsV2List/export')">自定义导出</el-button>
      <el-button @click="translate.visible = true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/pmsV2List/translate')">多语言翻译</el-button>
      <el-button @click="imageListVisible = true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/pmsV2List/uploadpictures')">批量上传图片</el-button>
      <el-button @click="examineVisible = true" class="radioBtn" size="mini" v-if="rolePermissionJudge('/pmsV2List/detectionpictures')">检测图片</el-button>
      <el-tooltip class="item" effect="dark" content="一次只能推送不大于5个商品" placement="top-start">
        <el-button @click="pushIrobotbox" class="radioBtn" size="mini" v-if="rolePermissionJudge('/pmsV2List/info')" :loading="pushIrobotboxLoading">
          推送信息至赛盒 <i class="el-icon-warning-outline" />
        </el-button>
      </el-tooltip>
    </div>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="SKU" align="center" width="200">
          <template #default="{ row }">
            <div style="text-align: left">
              {{ row.sku }}
              <!-- <div>
                <i v-copy="row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">{{ row.sku }}</el-link>
              </div> -->
              <div>
                自定义：
                {{ row.clientSku }}
                <!-- <i v-copy="scope.row.clientSku" class="el-icon-document-copy"></i> -->
                <!-- <span v-copy="row.clientSku">自定义：</span>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.clientSku)">{{ row.clientSku }}
                </el-link> -->
              </div>
              <el-tooltip effect="dark" :content="'母体sku: '+row.productGroupSkuName" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="row.productGroupSkuName">{{row.productGroupSkuName}}</span>
                </div>
              </el-tooltip>
              <div style="color:#d48806;">{{ getisTranslate(row) }}</div>
              <div style="font-weight:bold;color:#67c23a;" v-if="row.productState==='起批量'">
                {{ `起批量：${row.batchNum || ''} 起卖` }}
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template #default="{ row }">
            <img slot="reference" :src="row.picUrl" style="width:100px" @click="openImg(row)" />
            <div :style="getProductstate(row.productState)">
              {{ row.productState }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="分类" align="center" width="250">
          <template #default="{ row }">
            <el-tooltip effect="dark" :content="row.productClasses" placement="right-start">
              <div class="tooltipClass">
                <span v-copy="row.productClasses">{{row.productClasses}}</span>
              </div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="商品名称" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip effect="dark" :content="`英文名称：${row.productName}`" placement="top">
                <div class="tooltipClass" v-copy="row.productName">
                  {{ row.productName }}
                </div>
              </el-tooltip>
              <el-tooltip effect="dark" :content="`中文名称：${row.productNameCn}`" placement="top">
                <div class="tooltipClass" v-copy="row.productNameCn">
                  {{ row.productNameCn }}
                </div>
              </el-tooltip>
              <el-rate v-model="row.starLevel" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled-void-color="#bfbfbf" disabled />
              <div style="color:#9e1068;">{{ row.powerSocketSpec }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="商品属性" align="center" width="90">
          <template #default="{ row }">
            <div style="text-align: left">
              <el-tooltip v-for="item in getProductInfo" :key="item.key" effect="dark" :content="item.label" placement="left">
                <div v-copy="row[item.key]" :style="{color:item.color}">{{ row[item.key] }}</div>
              </el-tooltip>
              <el-tooltip effect="dark" content="质检" placement="left">
                <div v-copy="getCheckProportion(row.checkProportion)" style="color:#9e1068">{{ getCheckProportion(row.checkProportion) }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="供应商" align="center" width="260">
          <template #default="{ row }">
            <div style="text-align:left;">
              <el-link :href="row.webProductUrl" type="success" v-if="row.webProductUrl" target="_blank">采集链接</el-link>
              <div><span>价格：</span>{{ row.quotePrice }}</div>
              <div><span>发货仓库：</span>{{ row.warehouseShipping }}</div>
              <div><span>毛重(g)：</span>{{ row.grossWeight }}</div>
              <div><span>包裹重量(g)：</span>{{ row.packWeight }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="审核状态" align="center" width="130">
          <template #default="{ row:{ developStatus,imageStatus,editStatus,checkStatus, define3 } }">
            <div style="text-align: left">
              <div>开发: <span :style="{color:getStatus(developStatus).color}">{{ getStatus(developStatus).state }}</span></div>
              <div>图片: <span :style="{color:getStatus(imageStatus).color}">{{ getStatus(imageStatus).state }}</span></div>
              <div>编辑: <span :style="{color:getStatus(editStatus).color}">{{ getStatus(editStatus).state }}</span></div>
              <div>终审: <span :style="{color:getStatus(checkStatus).color}">{{ getStatus(checkStatus).state }}</span></div>
              <div>上架: <span :style="{color:define3?'#73d13d':'#ff4d4f'}">{{ define3 ? '已上架' : '未上架' }}</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间信息" align="center" width="240">
          <template #default="{ row }">
            <div style="text-align: left">
              <div><span>添加</span>：<span class="personnel">{{ row.createAdminName }}</span>{{ row.createTime }} </div>
              <div><span>更新</span>：<span class="personnel">{{ row.updatedAdminName }}</span>{{ row.updateTime }} </div>
              <div><span>开发</span>：<span class="personnel">{{ row.developAdminName }}</span>{{ row.developTime }} </div>
              <div><span>图片</span>：<span class="personnel">{{ row.imageAdminName }}</span>{{ row.imageTime }} </div>
              <div><span>编辑</span>：<span class="personnel">{{ row.editAdminName }}</span>{{ row.editTime }} </div>
              <div><span>终审</span>：<span class="personnel">{{ row.checkAdminName }}</span>{{ row.checkTime }} </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="150">
          <template #default="{ row }">
            <div style="white-space: normal;">
              <el-button size="mini" type="text" @click="$router.push({ path:'/pmsV2/pmsV2Editor', query:{id:row.id, readonly:true} })" v-if="rolePermissionJudge('/pmsV2List/see')">查看</el-button>
              <el-button size="mini" type="text" @click="$router.push({ path:'/pmsV2/pmsV2Editor', query:{id:row.id, copy:true} })" v-if="rolePermissionJudge('/pmsV2List/copy')">复制</el-button>
              <el-button size="mini" type="text" @click="$router.push({ path:'/pmsV2/pmsV2Editor', query:{id:row.id} })" v-if="rolePermissionJudge('/pmsV2List/editor')">编辑</el-button>
              <el-button size="mini" type="text" @click="handlejournal(row.id)">日志</el-button>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <!-- <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" /> -->
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <TemplateDialog :visible.sync="template.visible" />
    <CustomDialog :visible.sync="custom.visible" :typeList="typeList" />
    <TranslateDialog :visible.sync="translate.visible" :languagesList="typeList.languagesList" @request="getList" />
    <ImageDialog :visible.sync="imageListVisible" @request="getList" />
    <ExamineDialog :visible.sync="examineVisible" @request="getList" />
    <LookimgDialog :visible.sync="lookimg.visible" :productId="lookimg.productId" :list.sync="lookimg.list" @request="getList" />
  </TabelPageLayout>
</template>

<script>
import { getTranslateLanguages } from "@/api/pms/productInfo";
import { lemonProductList, getProductPropertyList, getWithBatterys, getSearchStatus, classListAll, getProductLogList, getPictureList, callProduct, getProductCombType, productClassList } from "@/api/pmsV2/pmsV2List"
import TemplateDialog from "./components/TemplateDialog"
import CustomDialog from "./components/CustomDialog"
import TranslateDialog from "./components/TranslateDialog"
import ImageDialog from "./components/ImageDialog"
import ExamineDialog from "./components/ExamineDialog"
import LookimgDialog from "./components/LookimgDialog"
import {
  SkuInfoView,
  LogView,
  RadioButtonGroup,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard,
  ScrollSelect,
} from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  dateType: 'createTime',
  beginDate: "",
  endDate: "",
  warehouseShipping: '',
  productType: '',
  developType: '',
  comeSource: '',
  productClasses: [],
  grade: '',
  productState: 6,
  searchType: "developAdminName",
  searchTypes: "sku",
  checkType: '',
  checkStatus: '',
  searchValue: '',
  searchValues: [],
  productProperty: "",
  withBattery: '',
  isTranslate: ''
};
export default {
  name: 'pmsV2List',
  components: {
    // SkuInfoView,
    LogView,
    RadioButtonGroup,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard,
    ScrollSelect,
    TemplateDialog,
    CustomDialog,
    TranslateDialog,
    ImageDialog,
    ExamineDialog,
    LookimgDialog
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      createTimeAndEndTime: [],
      listLoading: false,
      list: [],
      total: null,
      SkuNum: "",
      pushIrobotboxLoading: false,
      SkuDialogVisible: false,
      LogDialogVisible: false,
      typeList: {
        searchTypes: [
          { label: 'sku', value: 'sku' },
          { label: '自定义sku', value: 'clientSku' },
          { label: '母体ID', value: 'productGroupSku' }
        ],
        searchType: [
          { label: '开发人员', value: 'developAdminName' },
          { label: '采购人员', value: 'buyerName' },
          { label: '编辑人员', value: 'editAdminName' },
          { label: '图片人员', value: 'imageAdminName' },
          { label: '商品中文名', value: 'productNameCn' },
        ],
        dateTypeList: [
          { label: '添加时间', value: 'createTime' },
          { label: '更新时间', value: 'updateTime' },
          { label: '开发处理', value: 'developTime' },
          { label: '编辑处理', value: 'editTime' },
          { label: '图片处理', value: 'imageTime' },
          { label: '终审处理', value: 'checkTime' },
        ],
        isTranslateList: [
          { label: '是', value: 2 },
          { label: '翻译中', value: 1 },
          { label: '否', value: 0 },
        ],
        languagesList: [],
        checkTypeList: [
          { label: '开发审核', value: 'develop' },
          { label: '编辑审核', value: 'edit' },
          { label: '图片审核', value: 'image' },
          { label: '终审审核', value: 'check' },
        ],
        checkStatusList: [
          { label: '未审核', value: 1 },
          { label: '审核通过', value: 2 },
          { label: '审核不通过', value: 3 },
        ]
      },
      logViewParam: {
        title: [
          { label: "操作时间", property: "operationTime", width: "180" },
          { label: "操作人", property: "operationUser", width: "120" },
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getProductLogList,
        param: {
          manageId: "",
        },
      },
      template: {
        visible: false,
      },
      custom: {
        visible: false,
      },
      translate: {
        visible: false,
      },
      imageListVisible: false,
      examineVisible: false,
      lookimg: {
        visible: false,
        productId: null,
        list: []
      },
    };
  },
  created() {
    if (this.$route.query.state) {
      this.listQuery.productState = String(this.$route.query.state)
    }
    this.getSearchType();
    this.getList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  computed: {
    getProductstate() {
      return function (type) {
        switch (type) {
          case "正常":
            return { backgroundColor: "#67c23a", color: "#fff" };
          case "起批量":
            return { backgroundColor: "#67c23a", color: "#fff" };
          case "暂时缺货":
            return { backgroundColor: "#f56c6c", color: "#fff" };
          case "清库":
            return { backgroundColor: "#e6a23c", color: "#fff" };
          case "锁定":
            return { backgroundColor: "#e6a23c", color: "#fff" };
          case "停产":
            return { backgroundColor: "#f56c6c", color: "#fff" };
          case "草稿":
            return { backgroundColor: "#13c2c2", color: "#fff" };
        }
      };
    },
    getStatus() {
      return (status) => {
        switch (status) {
          case 1:
            return { state: '未审核', color: '#722ed1' };
          case 2:
            return { state: '审核通过', color: '#73d13d' };
          case 3:
            return { state: '审核不通过', color: '#ff4d4f' };
        }
      }
    },
    getProductInfo() {
      return [
        { label: '侵权风险', color: '#d4380d', key: 'productProperty' },
        { label: '物流属性', color: '#d46b08', key: 'withBattery' },
        { label: '商品类型', color: '#5b8c00', key: 'productType' },
        { label: '商品来源', color: '#ad8b00', key: 'comeSource' },
        { label: '开发类型', color: '#874d00', key: 'developType' },
        // { label: '电源插头', color: '#00474f', key: 'powerSocketSpec' },
        // { label: '质检比例', color: '#9e1068', key: 'checkProportion' },
      ]
    },
    getCheckProportion() {
      return (value) => {
        switch (value) {
          case '0':
            return '无需质检'
          case '100':
            return '全检'
          default:
            return '抽检'
        }
      }
    },
    getisTranslate() {
      return (row) => {
        switch (row.isTranslate) {
          case 0:
            return '未翻译'
          case 1:
            return '翻译中'
          case 2:
            const tans = row.translated.split(',').map(item => {
              const findItem = this.typeList.languagesList.find(langItem => langItem.value === item) || {}
              return findItem.label || ''
            })
            return tans.join()
        }
      }
    }
  },
  methods: {
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.createTimeAndEndTime = [];
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      const { listQuery } = this
      try {
        const res = await lemonProductList({
          ...listQuery,
          productClasses: listQuery.productClasses.slice(-1)[0],
          grade: listQuery.productClasses.length
        });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getSearchType() {
      getTranslateLanguages().then(res => {
        this.typeList.languagesList = res.data
      })
      getProductCombType().then(res => {
        const typeObj = {}
        res.data.forEach(item => {
          typeObj.hasOwnProperty(item.type) ? typeObj[item.type].push(item) : typeObj[item.type] = [item]
        });
        this.typeList = Object.assign(this.typeList, Object.freeze({
          ...typeObj,
          '商品状态': typeObj['商品状态'].map(item => ({ label: item.name, value: Number(item.code) }))
        }))
      })
      productClassList().then(res => {
        const obj = {};
        const gradeArr = [];
        res.data.forEach(item => {
          obj.hasOwnProperty(item.parentid) ? obj[item.parentid].push(item) : obj[item.parentid] = [item]
        })
        for (let itemArr in obj) {
          let index = obj[itemArr][0].grade - 1
          if (gradeArr[index] instanceof Object) {
            gradeArr[index][itemArr] = obj[itemArr]
          } else {
            gradeArr[index] = {}
            gradeArr[index][itemArr] = obj[itemArr]
          }
        }
        const classList = gradeArr.reduceRight((obj, gradeItem, index) => {
          Object.values(gradeItem).forEach(itemArr => {
            itemArr.forEach(item => {
              item.children = obj[item.classid]
            })
          })
          return gradeItem
        })
        this.typeList = Object.assign({}, Object.freeze({
          ...this.typeList,
          '商品分类': classList[0]
        }))
      })
    },
    timeChange() {
      if (this.createTimeAndEndTime != null) {
        this.listQuery.beginDate = this.createTimeAndEndTime[0];
        this.listQuery.endDate = this.createTimeAndEndTime[1];
      } else {
        this.listQuery.beginDate = "";
        this.listQuery.endDate = "";
      }
    },
    // getSkuInfo(id) {
    //   this.SkuDialogVisible = true;
    //   this.SkuNum = id;
    // },
    //日志
    handlejournal(params) {
      this.logViewParam.param.manageId = params;
      this.LogDialogVisible = true;
    },
    async openImg(row) {
      const res = await getPictureList({ productId: row.id })
      this.lookimg = {
        productId: row.id,
        visible: true,
        list: res.data
      }
    },
    async pushIrobotbox() {
      try {
        const selection = this.$refs.tableContainer.$refs.singleTable.selection
        const length = selection.length
        if (length === 0) {
          this.$message.success('先勾选需要推送至赛盒的商品')
          return
        }
        if (length > 5) {
          this.$message.success('一次最多推送不大于5个商品')
          return
        }
        await this.$confirm(`是否将自定义sku为 ${selection.map(item => item.clientSku).join(", ")} 的商品推送至赛盒？`, '提示', { type: 'warning' })
        this.pushIrobotboxLoading = true
        const res = await callProduct(selection.map(item => item.id))
        this.$message.success(res.data)
      } catch (error) { }
      this.pushIrobotboxLoading = false
    }
  },
};
</script>

<style lang="scss" scoped>
.table-cell-state {
  text-align: left;
  margin-left: 10px;
  .tcs-div {
    width: 50%;
    float: left;
  }
}
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}
.personnel {
  // text-align-last: justify;
  display: inline-block;
  width: 40px;
}
</style>
