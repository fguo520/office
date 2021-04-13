<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard :class="['filter-container', { filterContainerWarn: listQueryContrast.listQueryChange }]">
      <el-form :inline="true" size="small" label-width="100px">
        <el-form-item label="平台:">
          <el-select v-model="listQuery.platformType" placeholder="请选择平台" clearable size="mini">
            <el-option v-for="item in typeList.platformType" :key="item.platformType" :label="item.platformName" :value="item.platformType" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号:">
          <ScrollSelect v-model="listQuery.orderSourceName" :list="typeList.orderSourceName" placeholder="先选平台(可多选)" />
        </el-form-item>
        <el-form-item label="产品分类:">
          <el-cascader v-model="listQuery.productClass" :options="typeList.categoriesType" clearable placeholder="全部" size="mini" :props="{label: 'classnamecn', value: 'classid', checkStrictly: true,}" />
        </el-form-item>
        <el-form-item label="销售维度类型:">
          <el-select v-model="listQuery.daySellType" placeholder="账号维度日均销售类型" clearable size="mini">
            <el-option v-for="item in typeList.daySellType" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.formula
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称:">
          <el-input v-model.trim="listQuery.productName" class="input-width" placeholder="中文名称(模糊搜索)" size="mini" clearable />
        </el-form-item>
        <el-form-item label="开发人员:">
          <el-input v-model.trim="listQuery.developPerson" class="input-width" placeholder="模糊搜索" size="mini" clearable />
        </el-form-item>
        <el-form-item label="eBay海外仓:">
          <div class="buttonContainer">
            <el-button @click="conditions({ isOverseas: 0 })" :type="buttonType('isOverseas', 0)" size="mini">否
            </el-button>
            <el-button @click="conditions({ isOverseas: 1 })" :type="buttonType('isOverseas', 1)" size="mini">是
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="是否新品:">
          <template #label>
            <el-tooltip effect="light" content="新品: ≥7 ≤14" placement="bottom">
              <div>
                是否新品<i class="el-icon-warning-outline" style="color: rgb(245,189,0);"></i>:
              </div>
            </el-tooltip>
          </template>
          <div class="buttonContainer">
            <el-button @click="conditions({ isNew : 0 })" :type="buttonType('isNew', 0)" size="mini">否</el-button>
            <el-button @click="conditions({ isNew : 1 })" :type="buttonType('isNew', 1)" size="mini">是</el-button>
          </div>
        </el-form-item>
        <el-form-item label="SKU:">
          <TextareaInput v-model="listQuery.sku" />
        </el-form-item>
        <el-form-item label="是否侵权:">
          <ScrollSelect v-model="listQuery.productProperty" :list="typeList.productPropertyType" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="产品状态:">
          <ScrollSelect v-model="listQuery.productState" :list="typeList.productStateList" placeholder="全部" />
        </el-form-item>
        <el-form-item label="时间段:" style="position: relative">
          <el-select v-model="listQuery.TimeSearchType" placeholder="请选择搜索时间段" size="mini" class="timeSelectBar">
            <el-option label="自定义产品添加时间" :value="0" />
            <el-option label="近七天产品上架" :value="1" />
          </el-select>

          <transition name="el-zoom-in-top">
            <div v-show="listQuery.TimeSearchType === 0" class="timeSelectContainer">
              <el-date-picker v-model="createTimeAndEndTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" size="mini" style="width:200px">
              </el-date-picker>
            </div>
          </transition>
          <transition name="el-zoom-in-bottom">
            <div v-show="listQuery.TimeSearchType === 1" class="timeSelectContainer">
              <el-date-picker v-model="listQuery.sevenDays" type="date" value-format="yyyy-MM-dd" size="mini" style="width:200px">
              </el-date-picker>
            </div>
          </transition>
        </el-form-item>
        <transition name="el-zoom-in-top">
          <div class="listQueryChangeTip" v-show="listQueryContrast.listQueryChange">
            搜索条件改变,请点击搜索按钮
          </div>
        </transition>
      </el-form>
      <template #button>
        <el-button size="mini" plain @click="exportReport">导出报表</el-button>
        <el-button size="mini" plain @click="resetOption()">重置</el-button>
        <el-button @click="getQuery()" :type="listQueryContrast.listQueryChange ?'warning' : 'primary'" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div class="updateTip updateTipColor">
      <span v-for="item in updateTime" :key="item.platformType">
        <span v-show="String(item.platformType).indexOf('在线更新时间') != -1" style="margin-right:10px">
          {{ item.platformType }}： {{ item.updateTime }}
        </span>
      </span>
    </div>
    <div class="updateTipColor">
      <span v-for="item in updateTime" :key="item.platformType">
        <span v-show="String(item.platformType).indexOf('出单更新时间') != -1" style="margin-right:10px">
          {{ item.platformType }}： {{ item.updateTime }}
        </span>
      </span>
    </div>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }" @sort-change="tableSortChange">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="图片" align="center" width="130">
          <template #default="{ row }">
            <el-image style="width: 100px; height: 100px" :src="row.smallImageUrl" />
            <div v-if="row.productState == '正常'" style="text-align: center; background-color: #67c23a; color: #fff">
              {{ row.productState }}
            </div>
            <div v-else style="text-align: center; background-color: #f56c6c; color: #fff">
              {{ row.productState }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="SKU" align="center" width="130">
          <template #default="{ row }">
            <div style="text-align: left">
              <div>
                <i v-copy="row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sku)">{{ row.sku }}</el-link>
              </div>
              <div>
                <span v-copy="row.clientSku">{{ row.clientSku }}</span>
              </div>

              <div v-show="tableContentShow.otherContent">
                <div v-copy="row.platformName">{{ row.platformName }}</div>
                <div v-copy="row.orderSourceName">
                  {{ row.orderSourceName }}
                </div>
              </div>

              <div>{{ row.productProperty }}</div>
              <div>
                <span :style="{
                    color: getDaySellType(row.daySellType).color,
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }">
                  {{ getDaySellType(row.daySellType).label }}
                </span>
              </div>
              <div>{{ row.isNew?"新品":"非新品" }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="基本信息" align="center">
          <template #default="{ row }">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'产品中文名:'+String(row.productNameCn)" placement="top">
                <div class="tooltipClass">
                  <span v-copy="row.productNameCn">{{row.productNameCn}}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'产品分类:'+String(row.classIdName1 + row.classIdName2)" placement="top">
                <div class="tooltipClass">
                  {{ row.classIdName1 }}
                  <span v-if="row.classIdName2">>></span> {{ row.classIdName2 }}
                </div>
              </el-tooltip>
              <div>
                <span v-copy="row.developAdminName">开发: </span>{{ row.developAdminName }}
              </div>
              <div>
                <span v-copy="row.buyerName">采购: </span>{{ row.buyerName }}
              </div>
              <div>{{ row.comeSource }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="在线" align="center" width="100" sortable="custom" prop="online">
          <template #default="{ row }">
            <Online :row="row" :platformType="listQuery.platformType" :whichShow="tableContentShow" />
          </template>
        </u-table-column>
        <u-table-column label="listing转化率" align="center" prop="single" sortable="custom" width="250">
          <template #default="{ row }">
            <Single :row="row" :platformType="listQuery.platformType" :whichShow="tableContentShow" />
          </template>
        </u-table-column>
        <u-table-column label="出单详情" align="center" width="190" sortable="custom" prop="orders">
          <template #default="{ row }">
            <Orders :row="row" :platformType="listQuery.platformType" :whichShow="tableContentShow" />
          </template>
        </u-table-column>
        <u-table-column label="毛利润详情(USD)" align="center" sortable="custom" prop="profit" width="250">
          <template #default="{ row }">
            <Profit :row="row" :platformType="listQuery.platformType" :whichShow="tableContentShow" />
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="260">
          <template #default="{ row }">
            <div style="text-align: left">
              <div v-show="row.productAddTime">产品添加: {{ row.productAddTime }}</div>
              <div v-show="!tableContentShow.otherContent">
                <el-popover placement="top-start" title="各平台首次出单时间" width="260" trigger="hover" content="暂无数据。">
                  <div>Ali首次上架: {{ row.aliExpressfirstOnlineTime }}</div>
                  <div>Ali首次出单: {{ row.aliExpressfirstOrderTime }}</div>
                  <div>EB首次上架: {{ row.ebayfirstOnlineTime }}</div>
                  <div>EB首次出单: {{ row.ebayfirstOrderTime }}</div>
                  <div>Amz首次上架: {{ row.amazonFirstOnlineTime }}</div>
                  <div>Amz首次出单: {{ row.amazonFirstOrderTime }}</div>
                  <div>Laz首次上架: {{ row.lazadaFirstOnlineTime }}</div>
                  <div>Laz首次出单: {{ row.lazadaFirstOrderTime }}</div>
                  <div slot="reference">
                    <div v-show="row.firstOnlineTime">首次上架: {{ row.firstOnlineTime }}</div>
                    <div v-show="row.firstOrderTime">首次出单: {{ row.firstOrderTime }}</div>
                  </div>
                </el-popover>
              </div>
              <div v-show="tableContentShow.Ebay && tableContentShow.otherContent">
                <div>EB首次上架: {{ row.ebayfirstOnlineTime }}</div>
                <div>EB首次出单: {{ row.ebayfirstOrderTime }}</div>
              </div>
              <div v-show="tableContentShow.Ali && tableContentShow.otherContent">
                <div>Ali首次上架: {{ row.aliExpressfirstOnlineTime }}</div>
                <div>Ali首次出单: {{ row.aliExpressfirstOrderTime }}</div>
              </div>
              <div v-show="tableContentShow.Amz && tableContentShow.otherContent">
                <div>Amz首次上架: {{ row.amazonFirstOnlineTime }}</div>
                <div>Amz首次出单: {{ row.amazonFirstOrderTime }}</div>
              </div>
              <div v-show="tableContentShow.Laz && tableContentShow.otherContent">
                <div>Laz首次上架: {{ row.lazadaFirstOnlineTime }}</div>
                <div>Laz首次出单: {{ row.lazadaFirstOrderTime }}</div>
              </div>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
  </TabelPageLayout>
</template>

<script>
import {
  getList as getListApi,
  getType,
  getPropertyType,
  getSysParameterCodeList,
  exportReport
} from "@/api/Im/listingMonitoring";
import { fetchList } from "@/api/pms/productClass";
import {
  SkuInfoView,
  ScrollSelect,
  TabelPageLayout,
  TextareaInput,
  ShrinkCard
} from "@/components";
import Profit from "./component/Profit";
import Orders from "./component/Orders";
import Online from "./component/Online";
import Single from "./component/Single";

const defaultListQuery = {
  platformType: "",
  orderSourceName: [],
  productClass: [],
  productName: "",
  sku: [],
  daySellType: "",
  isOverseas: "",
  isNew: "",
  TimeSearchType: "",
  sevenDays: "",
  createTime: "",
  endTime: "",
  orderBy: "",
  productProperty: [],
  productState: [],
  developPerson: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "listingMonitoring",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listQueryContrast: {
        lastListQuery: "",
        listQueryChange: false,
      },
      tableContentShow: {
        Ebay: true,
        Ali: true,
        Amz: true,
        Laz: true,
        otherContent: false,
      },
      createTimeAndEndTime: ["", ""],
      listLoading: false,
      list: [],
      total: null,
      updateTime: [],
      typeList: {
        platformType: [],
        orderSourceName: [],
        categoriesType: [],
        daySellType: [
          { label: "未出单", value: "-1", formula: " =0" },
          { label: "激活", value: "0", formula: ">0 ≤1" },
          { label: "一般", value: "1", formula: "≥2 <5" },
          { label: "潜力款", value: "2", formula: " ≥5 <10" },
          { label: "爆款", value: "3", formula: " ≥10" },
        ],
        productPropertyType: [],
        productStateList: []
      },
      SkuNum: "",
      SkuDialogVisible: false,
    };
  },
  components: {
    SkuInfoView,
    ScrollSelect,
    Profit,
    Orders,
    Online,
    Single,
    TabelPageLayout,
    TextareaInput,
    ShrinkCard
  },
  created() {
    this.getList();
    this.getSearchType();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  computed: {
    buttonType() {
      const { listQuery } = this;
      return function (key, value) {
        if (listQuery[key] === "") return "";
        return listQuery[key] === value ? "primary" : "";
      };
    },
    getDaySellType() {
      return function (type) {
        switch (type) {
          case -1:
            return { label: "未出单", color: "#A2A2A2" };
          case 0:
            return { label: "激活", color: "#000" };
          case 1:
            return { label: "一般", color: "#008B8B" };
          case 2:
            return { label: "潜力款", color: "#FF8C00" };
          case 3:
            return { label: "爆款", color: "red" };
          default:
            return { label: "未知状态", color: "#34490E" };
        }
      };
    },
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.createTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
    "listQuery.platformType"(newValue, oldValue) {
      this.listQuery.orderSourceName = [];
      this.typeList.orderSourceName = [];
      const { platformType } = this.typeList;
      for (var item in platformType) {
        if (platformType[item].platformType === newValue) {
          this.typeList.orderSourceName = this.typeList.platformType[
            item
          ].orderSourceName.flat();
          return;
        }
      }
    },
    listQuery: {
      deep: true,
      handler(newValue) {
        const { lastListQuery } = this.listQueryContrast;
        const isShow = JSON.stringify(newValue).split("pageNum")[0] !== lastListQuery;
        this.listQueryContrast.listQueryChange = isShow;
      },
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const productClass = this.listQuery.productClass.slice(-1)[0];
      try {
        const res = await getListApi({ ...this.listQuery, productClass });
        this.list = res.data.list;
        this.total = res.data.total;
        this.updateTime = res.data.updateTime;
        this.tableContenthandle(this.listQuery.platformType);
        this.listQueryContrast.lastListQuery = JSON.stringify(this.listQuery).split("pageNum")[0];
        this.listQueryContrast.listQueryChange = false;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getQuery() {
      this.listQuery.pageNum = 1;
      this.$refs.tableContainer.clearSort();
      this.listQuery.orderBy = "";
      this.getList();
    },
    getSearchType() {
      getType().then((response) => {
        this.typeList.platformType = response.data;
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
      getPropertyType().then((response) => {
        this.typeList.productPropertyType = response.data;
      });
      getSysParameterCodeList().then(res => {
        this.typeList.productStateList = res.data.map(item => item.parameterValue)
      })
    },
    resetOption() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.createTimeAndEndTime = ["", ""];
      this.$refs.tableContainer.clearSort();
      this.getList();
    },
    conditions(obj) {
      if (obj instanceof Object) {
        // 已选中在点击取消取消
        if (this.listQuery[Object.keys(obj)[0]] === Object.values(obj)[0]) {
          this.listQuery[Object.keys(obj)[0]] = "";
        } else {
          this.listQuery = Object.assign(this.listQuery, obj);
        }
      }
    },
    async exportReport() {
      const productClass = this.listQuery.productClass.slice(-1)[0];
      const res = await exportReport({ ...this.listQuery, productClass });
      if (res.code === 200) this.$message.success('报表任务已生成，前往 报表管理->EXCEL报告 查看')
    },
    getSkuInfo(id) {
      this.SkuDialogVisible = true;
      this.SkuNum = id;
    },
    tableContenthandle(type) {
      switch (type) {
        case 1:
          this.tableContentShow = {
            Ebay: true,
            Ali: false,
            Amz: false,
            Laz: false,
            otherContent: true,
          };
          return;
        case 2:
          this.tableContentShow = {
            Ebay: false,
            Ali: true,
            Amz: false,
            Laz: false,
            otherContent: true,
          };
          return;
        case 3:
          this.tableContentShow = {
            Ebay: false,
            Ali: false,
            Amz: true,
            Laz: false,
            otherContent: true,
          };
          return;
        case 4:
          this.tableContentShow = {
            Laz: true,
            Ebay: false,
            Ali: false,
            Amz: false,
            otherContent: true,
          };
          return;
        default:
          this.tableContentShow = {
            Ebay: true,
            Ali: true,
            Amz: true,
            Laz: true,
            otherContent: false,
          };
      }
    },
    tableSortChange(e) {
      if (e.order === null) {
        this.listQuery.orderBy = "";
      } else {
        switch (e.prop) {
          case "online":
            this.listQuery.orderBy = e.order === "descending" ? 1 : 2;
            break;
          case "orders":
            this.listQuery.orderBy = e.order === "descending" ? 3 : 4;
            break;
          case "profit":
            this.listQuery.orderBy = e.order === "descending" ? 5 : 6;
            break;
          case "single":
            this.listQuery.orderBy = e.order === "descending" ? 7 : 8;
            break;
        }
      }
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  position: relative;

  /deep/ .el-form-item__label {
    width: 100px !important;
  }

  /deep/ .el-card__body {
    padding-bottom: 0;
  }

  .buttonContainer {
    width: 150px;

    // .el-button:focus:not(.el-button--primary) {
    //   border: 1px solid #dcdfe6;
    //   color: #606266;
    //   background: #ffffff;
    // }
    // .el-button:focus:hover:not(.el-button--primary) {
    //   color: #41af7c;
    //   border-color: #c6e7d8;
    //   background-color: #ecf7f2;
    // }
    .el-button--primary:focus {
      color: #ffffff;
      background-color: #41af7c;
      border-color: #41af7c;
    }
    .el-button--info:focus {
      color: #fff;
      background-color: #909399;
      border-color: #909399;
    }
  }

  .timeSelectBar {
    width: 150px;

    /deep/ .el-input {
      width: 150px;
    }
  }

  .timeSelectContainer {
    margin-left: 10px;
    float: right;
  }

  .el-zoom-in-top-enter,
  .el-zoom-in-bottom-enter,
  .el-zoom-in-top-leave-to,
  .el-zoom-in-bottom-leave-to {
    position: absolute;
  }

  .listQueryChangeTip {
    position: absolute;
    top: 2px;
    margin: auto;
    font-size: 12px;
    color: rgb(235, 181, 99);
    width: 100%;
    text-align: center;
  }
}
.filterContainerWarn {
  /deep/ .el-card {
    border-color: rgb(235, 181, 99);
  }
}

.updateTip {
  margin-top: 5px;
}

.updateTipColor {
  color: rgb(167, 166, 166);
}
.u-table
  /deep/.u-table__header-wrapper
  .u-table__header
  tr
  .cell
  .caret-wrapper {
  height: 22px !important;
  .sort-caret.ascending {
    top: -2px;
  }
  .sort-caret.descending {
    bottom: -2px;
  }
}
</style>
