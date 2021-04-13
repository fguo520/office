<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">

        <el-form-item label="系统SKU:">
          <TextareaInput v-model="listQuery.skus" />
        </el-form-item>
        <el-form-item label="搜索类型:">
          <el-select v-model="listQuery.searchType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="(item, index) in type.typeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-model.trim="listQuery.searchValue" placeholder="请输入搜索值" clearable style="display: inline-flex; width:200px;" />
        </el-form-item>

        <el-form-item label="侵权风险:">
          <el-select v-model="listQuery.productProperty" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in type.propertyList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品物流属性:">
          <ScrollSelect v-model="listQuery.withBattery" :list="type.withBatterysList" :prop="{ label: 'label', value: 'value' }" placeholder="可多选" />
        </el-form-item>
        <el-form-item label="产品分类:">
          <el-cascader v-model="listQuery.productClass" size="mini" :options="type.classList" clearable placeholder="全部" :props="{
                label: 'classnamecn',
                value: 'classid',
                checkStrictly: true,
              }"></el-cascader>
        </el-form-item>
        <el-form-item label="是否翻译:">
          <el-select v-model="listQuery.isTranslate" placeholder="全部" size="mini" clearable filterable>
            <el-option v-for="(item, index) in type.isTranslateList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="上架时间:">
          <el-date-picker @change="timeChange" v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="resetOption()" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.productStatus" :ButtonTypes="type.searchTypeList" @request="getList" />
    <div>
      <el-button @click="getCost" class="radioBtn" size="mini" v-if="rolePermissionJudge('/productInfo/export')">批量导出</el-button>
      <el-button @click="handTemplate" class="radioBtn" size="mini" v-if="rolePermissionJudge('/productInfo/template')">维护模板</el-button>
      <el-button @click="handCustom" class="radioBtn" size="mini" v-if="rolePermissionJudge('/productInfo/custom')">自定义导出</el-button>
      <el-button @click="handTranslate" class="radioBtn" size="mini" v-if="rolePermissionJudge('/productInfo/translate')">多语言翻译</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="SKU" align="center" width="130">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row.sku)">{{ scope.row.sku }}
                </el-link>
              </div>
              <el-tooltip class="item" effect="dark" :content="'母体sku: '+scope.row.productgroupsku" placement="right-start">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productgroupsku">{{
                  scope.row.productgroupsku
                }}</span>
                </div>
              </el-tooltip>
              <div v-show="scope.row.isTranslate===2"><span style="color:red">{{handTranslated(scope.row.translated)}}</span></div>
              <div v-show="scope.row.isTranslate===1"><span>翻译中</span></div>
              <div v-show="scope.row.isTranslate===0"><span>未翻译</span></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.smallimageurl" />
            <div :style="{
                backgroundColor: getProductstate(scope.row.productstate)
                  .backgroundColor,
                color: getProductstate(scope.row.productstate).color,
              }">
              {{ scope.row.productstate }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="分类" align="center" width="200">
          <template slot-scope="scope">
            <div style="text-align: left">
              <span v-copy="scope.row.fullclassnamecn">{{
                  scope.row.fullclassnamecn
                }}</span>
            </div>
          </template>
        </u-table-column>

        <u-table-column label="产品物流属性" align="center" width="150">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>{{ scope.row.withbattery }}</div>
              <div>{{ scope.row.productproperty }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" width="360">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="scope.row.productnamecn" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productnamecn">{{
                    scope.row.productnamecn
                  }}</span>
                </div>
              </el-tooltip>
              <div style="display: flex">
                <div style="width: 120px">
                  毛重: {{ scope.row.grossweight
                  }}<span v-if="scope.row.grossweight">g</span>
                </div>
                <el-tooltip class="item" effect="dark" :content="`${scope.row.packLength}cm * ${scope.row.packWidth}cm * ${scope.row.packHeight}cm / 6000`" placement="top">
                  <div style="width: 120px">
                    材积: {{ scope.row.materialvolume.toFixed(2) }}
                  </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="`${scope.row.materialvolume} / ${scope.row.packweight } * 1000`" placement="top">
                  <div style="width: 120px" v-if="scope.row.packweight">
                    抛率:
                    {{
                      (
                        (scope.row.materialvolume / scope.row.packweight ) *
                        1000
                      ).toFixed(2)
                    }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="采购价格" align="center" width="150">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>单价: {{ scope.row.lastbuyprice }} RMB</div>
              <div>运费: {{ scope.row.unitshipfee }} RMB</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="上架情况" align="center" min-width="400">
          <template slot-scope="scope">
            <div class="table-cell-state">
              <div class="tcs-div">上架时间: {{ scope.row.onlinetime }}</div>
              <div class="tcs-div">上架状态: {{ scope.row.onlinestatus }}</div>
              <div class="tcs-div">
                <a v-copy="scope.row.developadminname">开发人员: </a>{{ scope.row.developadminname }}
              </div>
              <div class="tcs-div">
                开发状态: {{ scope.row.developstatus }}
                <i v-if="scope.row.developstatus == '通过'" class="el-icon-circle-check" style="color: #67c23a"></i>
              </div>
              <div class="tcs-div">
                <a v-copy="scope.row.editadminname">产品编辑: </a>{{ scope.row.editadminname }}
              </div>
              <div class="tcs-div">
                编辑状态: {{ scope.row.editstatus }}
                <i v-if="scope.row.editstatus == '通过'" class="el-icon-circle-check" style="color: #67c23a"></i>
              </div>
              <div class="tcs-div">
                <a v-copy="scope.row.imageadminname">图片处理: </a>{{ scope.row.imageadminname }}
              </div>
              <div class="tcs-div">
                图片状态: {{ scope.row.imagestatus }}
                <i v-if="scope.row.imagestatus == '通过'" class="el-icon-circle-check" style="color: #67c23a"></i>
              </div>
              <div class="tcs-div">
                <a v-copy="scope.row.buyername">采购人员: </a>{{ scope.row.buyername }}
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="日志" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handlejournal(scope.row.id)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <ExportDialog :visible.sync="exporttion.visible" :selectRows="exporttion.selectRows" :listQuery="exporttion.listQuery" @request="getList" />
    <TemplateDialog :visible.sync="template.visible" />
    <CustomDialog :visible.sync="custom.visible" :type="custom.type" />
    <TranslateDialog :visible.sync="translate.visible" :languagesList="translate.languagesList" @request="getList" />
  </TabelPageLayout>
</template>

<script>
import {
  productInfoList,
  getProductInfoLogList,
  getSearchStatus,
  getProductPropertyList,
  getWithBatterys,
  getTranslateLanguages
} from "@/api/pms/productInfo";
import { fetchList } from "@/api/pms/productClass";
import ExportDialog from "./components/ExportDialog"
import TemplateDialog from "./components/TemplateDialog"
import CustomDialog from "./components/CustomDialog"
import TranslateDialog from "./components/TranslateDialog"
import {
  SkuInfoView,
  LogView,
  RadioButtonGroup,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard,
  ScrollSelect
} from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  createTime: "",
  endTime: "",
  productClass: "",
  productStatus: "正常",
  searchType: "ClientSKU",
  searchValue: "",
  skus: [],
  productProperty: "",
  withBattery: [],
  isTranslate: null
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      createTimeAndEndTime: [],
      listLoading: false,
      list: [],
      total: null,
      skuInfoList: {},
      SkuNum: "",
      SkuDialogVisible: false,
      LogDialogVisible: false,
      type: {
        searchTypeList: [],
        typeList: [{ label: "自定义SKU", value: "ClientSKU" },
        { label: "开发人员", value: "DevelopAdminName" },
        { label: "采购人员", value: "BuyerName" },
        { label: "图片处理人员", value: "ImageAdminName" },
        { label: "产品编辑人员", value: "EditAdminName" },
        { label: "产品中文名称模糊搜索", value: "ProductNameCNLike" },
        { label: "母体SKU模糊搜索", value: "ProductGroupSKULike" },],
        propertyList: [],
        withBatterysList: [],
        classList: [],
        isTranslateList: [
          { label: "是", value: 2 },
          { label: "翻译中", value: 1 },
          { label: "否", value: 0 },
        ],
        languagesList: []
      },
      logViewParam: {
        title: [
          { label: "操作类型", property: "operationType", width: "120" },
          { label: "操作人", property: "createPerson", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "content", tooltip: true },
        ],
        request: getProductInfoLogList,
        param: {
          id: "",
        },
      },
      exporttion: {
        visible: false,
        selectRows: [],
        listQuery: {}
      },
      template: {
        visible: false,
      },
      custom: {
        visible: false,
        type: {}
      },
      translate: {
        visible: false,
        languagesList: []
      }
    };
  },
  components: {
    SkuInfoView,
    LogView,
    RadioButtonGroup,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard,
    ExportDialog,
    ScrollSelect,
    TemplateDialog,
    CustomDialog,
    TranslateDialog
  },
  created() {
    this.getList();
    this.getType();
    this.getSearchType();
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
        }
      };
    },
    handTranslated() {
      return function (value) {
        if (value == "") {
          return false
        }
        return value.split(",").map(valueItem => {
          return this.type.languagesList.find(item => valueItem === item.value)
        }).map(i => i.label).join(",")
      }
    }
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
        const res = await productInfoList({ ...this.listQuery, productClass });
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
        this.type.classList = response.data.filter((i) => {
          return i.parentid == 0;
        });
        for (let i = 0; i < this.type.classList.length - 1; i++) {
          this.type.classList[i].children = response.data.filter((item) => {
            return item.parentid == this.type.classList[i].classid;
          });
          for (let j = 0; j < this.type.classList[i].children.length - 1; j++) {
            this.type.classList[i].children[j].children = response.data.filter(
              (item) => {
                return item.parentid == this.type.classList[i].children[j].classid;
              }
            );
          }
        }
      });
    },
    getSearchType() {
      getSearchStatus({ keyword: "ProductState" }).then((response) => {
        this.type.searchTypeList = response.data.map((item) => {
          return { label: item, value: item };
        });
      });
      getProductPropertyList().then(res => {
        this.type.propertyList = res.data
      })
      getWithBatterys().then(res => {
        this.type.withBatterysList = res.data
      })
      getTranslateLanguages().then(res => {
        this.type.languagesList = res.data
      })
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.createTimeAndEndTime = [];
      this.getList();
    },
    timeChange() {
      if (this.createTimeAndEndTime != null) {
        this.listQuery.createTime = this.createTimeAndEndTime[0];
        this.listQuery.endTime = this.createTimeAndEndTime[1];
      } else {
        this.listQuery.createTime = "";
        this.listQuery.endTime = "";
      }
    },
    getSkuInfo(id) {
      this.SkuDialogVisible = true;
      this.SkuNum = id;
    },
    //日志
    handlejournal(params) {
      this.logViewParam.param.id = params;
      this.LogDialogVisible = true;
    },
    getCost() {
      const selection = this.$refs.tableContainer.$refs.singleTable.selection;
      this.exporttion = {
        selectRows: selection,
        visible: true,
        listQuery: this.listQuery
      }
    },
    handTemplate() {
      this.template.visible = true
    },
    handCustom() {
      this.custom.visible = true
      this.custom.type = this.type
    },
    handTranslate() {
      this.translate.visible = true
      this.translate.languagesList = this.type.languagesList
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
</style>
