<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="100px">
        <el-form-item label="SKU：">
          <TextareaInput v-model="listQuery.skus" />
        </el-form-item>
        <el-form-item label="渠道：">
          <ScrollSelect v-model="listQuery.authIds" :list="typeList.authList" :prop='{label:"storeNameAs",value:"id"}' />
        </el-form-item>
        <el-form-item label="类目：">
          <el-cascader v-model="listQuery.categoryId" :options="typeList.categoryIdList" placeholder="全部" :props="{ label:'categoryNameCn', value:'categoryId' }" :show-all-levels="false" clearable />
        </el-form-item>
        <el-form-item label="产品分类：">
          <el-cascader v-model="listQuery.shProductClass" size="mini" :options="typeList.classList" clearable placeholder="全部" :props="{
              label: 'classnamecn',
              value: 'classid',
              checkStrictly: true,
            }"></el-cascader>
        </el-form-item>
        <el-form-item label="刊登人：">
          <el-select v-model="listQuery.publishUserId" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.adminList" :key="index" :label="item.publishUserName" :value="item.publishUserId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态:">
          <ScrollSelect v-model="listQuery.productStatus" :list="typeList.productStatusList" />
        </el-form-item>
        <el-form-item label="自定义时间：">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" filterable style="width:100px">
            <el-option v-for="(item, index) in typeList.timeTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #button>
        <el-button @click="editor()" size="mini" v-if="rolePermissionJudge('/rtsPublish/publish')">刊登商品</el-button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>
    <RadioButtonGroup v-model="listQuery.status" :ButtonTypes="typeList.statusList" @request="getList">
      <!-- <template #1>
        <el-button @click="getPublish" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeePublish/Allpublish')">批量提交刊登</el-button>
      </template>
      <template #4>
        <el-tooltip content="一次只能复制刊登一个商品，选多个默认取勾选的第一个" :enterable="false">
          <el-button @click="copyPublishedDialog" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeePublish/copyPublish')">
            复制刊登
            <i class="el-icon-warning-outline" />
          </el-button>
        </el-tooltip>
      </template>
      <template #5>
        <el-button @click="getDelect" class="radioBtn" size="mini" v-if="rolePermissionJudge('/shopeePublish/delect')">批量删除</el-button>
      </template> -->
    </RadioButtonGroup>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="50" :show-overflow-tooltip="false" />
        <u-table-column label="SKU" align="center" width="150">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div>
                <i v-copy="scope.row.sku" class="el-icon-document-copy"></i>
                <el-link :underline="false" type="primary" @click.native="getSkuInfo(scope.row)">{{ scope.row.sku }}
                </el-link>
              </div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="图片" align="center" width="130">
          <template slot-scope="scope">
            <img slot="reference" :src="scope.row.mainImage" style="width:100px" />
            <div :style="getColorStatus(scope.row.shProductState)">{{scope.row.shProductState}}</div>
          </template>
        </u-table-column>
        <u-table-column label="类目&分类" align="center" width="240">
          <template slot-scope="scope">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="scope.row.categoryStr" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.categoryStr"> {{ scope.row.categoryStr }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.shCategoryStr" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.shCategoryStr"> {{ scope.row.shCategoryStr }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" width="400">
          <template slot-scope="scope">
            <div style="text-align: left">
              <div><span v-copy="scope.row.authName">{{scope.row.authName}}</span></div>
              <el-tooltip class="item" effect="dark" :content="'产品分组:'+scope.row.groupStr" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.groupStr">{{scope.row.groupStr}}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'产品中文名:'+scope.row.productNameCn" placement="top">
                <div class="tooltipClass">
                  <span v-copy="scope.row.productNameCn">{{scope.row.productNameCn}}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'商品名称:'+scope.row.subject" placement="top">
                <div class="tooltipClass"><span v-copy="scope.row.subject">{{ scope.row.subject }}</span></div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="详情" align="center" width="180">
          <template slot-scope="scope">
            <div style="text-align: left">
              <el-tooltip class="item" effect="dark" :content="'刊登人'" placement="top">
                <div> <span v-copy="scope.row.publishUserName">{{ scope.row.publishUserName }}</span></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'价格'" placement="top">
                <div>{{ scope.row.minPrice }}-{{scope.row.maxPrice}}</div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'可售数量'" placement="top">
                <div>{{ scope.row.totalStock }}</div>
              </el-tooltip>
              <div><b>{{ scope.row.productType|productTypeFilter }}</b></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="200">
          <template slot-scope="scope">
            <div v-show="scope.row.publishTime">刊登: {{ scope.row.publishTime }}</div>
            <div v-show="scope.row.createTime">创建: {{scope.row.createTime}}</div>
          </template>
        </u-table-column>
        <u-table-column label="备注" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.errorDesc" placement="top">
              <div class="tooltipClass" v-copy="scope.row.errorDesc ">{{ scope.row.errorDesc }}</div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editor(scope.row, true)" v-show="listQuery.status !==4 && listQuery.status !==3">查看</el-button>
            <el-button size="mini" type="text" @click="editor(scope.row)" v-show="listQuery.status==4 || listQuery.status==3">编辑</el-button>
            <el-button size="mini" type="text" @click="handlejournal(scope.row)">日志</el-button>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" />
    <LogView :config="logViewParam" :visible.sync="LogDialogVisible" />
    <!-- <CopyPublished :visible.sync="copyPublished.visible" :row="copyPublished.row" @callback="() => {listQuery.status = 0}" /> -->
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
import { getList, getlogList, getauthList, getOwnerpublishUser, getRtsApiCategoryNode } from "@/api/rts/rtsPublish";
import { fetchList } from "@/api/pms/productClass";
// import CopyPublished from "./components/CopyPublished"
const defaultListQuery = {
  authIds: [],
  categoryId: "",
  shProductClass: "",
  pageNum: 1,
  pageSize: 50,
  productStatus: [],
  publishUserId: "",
  skus: [],
  status: 2,
  timeType: 2,
  startTime: "",
  endTime: ""
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
  name: "shopeePublish",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        categoryList: [],
        authList: [],
        adminList: [],
        statusList: [
          { label: "草稿", value: 4 },
          { label: "待刊登", value: 0 },
          { label: "刊登中", value: 1 },
          { label: "刊登成功", value: 2 },
          { label: "刊登失败", value: 3 }
        ],
        classList: [],
        productList: ["正常", "停产", "暂时缺货", "清库", "起批量", "锁定"],
        timeTypeList: [{ label: "刊登时间", value: 2 },
        { label: "创建时间", value: 1 }],
        categoryIdList: [],
        productStatusList: ["正常", "清货", "断货"],
      },
      SkuNum: "",
      SkuDialogVisible: false,
      LogDialogVisible: false,
      logViewParam: {
        title: [
          { label: "操作类型", property: "content", width: "150" },
          { label: "操作人", property: "createUserName", width: "120" },
          { label: "操作时间", property: "createTime", width: "180" },
          { label: "日志内容", property: "errorDesc", tooltip: true },
        ],
        request: getlogList,
        param: {
          id: "",
        },
      },
      createTimeAndEndTime: [],
      copyPublished: {
        visible: false,
        row: {}
      }
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
    // CopyPublished
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.startTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
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
      const shProductClass = this.listQuery.shProductClass.slice(-1)[0];
      const categoryId = this.listQuery.categoryId.slice(-1)[0];
      try {
        const res = await getList({ ...this.listQuery, shProductClass, categoryId });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const resAuthList = getauthList();
      const resNames = getOwnerpublishUser()
      const resCategory = getRtsApiCategoryNode()
      Promise.all([resAuthList, resNames, resCategory]).then((res) => {
        this.typeList.authList = res[0].data
        this.typeList.adminList = res[1].data
        this.typeList.categoryIdList = filterTree(res[2].data)
      }).catch((err) => {
        this.typeList.authList = []
        this.typeList.adminList = []
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
    getSkuInfo(row) {
      this.SkuDialogVisible = true;
      this.SkuNum = row.sku;
    },
    //日志
    handlejournal(row) {
      this.logViewParam.param = {
        id: row.id,
      };
      this.LogDialogVisible = true;
    },
    editor(row, check) {
      this.$router.push({ path: "/rts/rtsEditor", query: { id: row && row.id, check ,routeStatus:this.listQuery.status} })
    },
    // handleLook(row) {
    //   const query = { routeSku: row.sku, routeTaskNo: row.taskNo, routeIsture: '' }
    //   this.$router.push({ path: "shopeeEditor", query })
    // },
    // async getPublish() {
    //   const selection = this.$refs.tableContainer.$refs.singleTable.selection;
    //   if (selection.length === 0) {
    //     this.$message({
    //       type: "warning",
    //       message: "请勾选需要修改的商品"
    //     })
    //     return
    //   }
    //   if (selection.length > 20) {
    //     this.$message({
    //       type: "warning",
    //       message: "最多勾选20条商品"
    //     })
    //     return
    //   }
    //   try {
    //     const comfirm = await this.$confirm(`确定批量提交刊登勾选中的商品？`, '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //     const res = await saveShopeeProductAdd(selection);
    //     if (res.code !== 200) return;
    //     this.$message.success(res.message)
    //     this.getList()
    //   } catch (error) { }
    // },
    // async copyPublishedDialog() {
    //   const { $refs } = this
    //   if ($refs.tableContainer.$refs.singleTable.selection.length === 0) {
    //     this.$message({
    //       type: "warning",
    //       message: "请勾选需要复制刊登的商品（一次只能复制刊登一个）"
    //     })
    //     return
    //   }
    //   if ($refs.tableContainer.$refs.singleTable.selection.length > 1) {
    //     this.$message({
    //       type: "warning",
    //       message: "最多勾选一个商品"
    //     })
    //     return
    //   }
    //   this.copyPublished = {
    //     visible: true,
    //     row: $refs.tableContainer.$refs.singleTable.selection[0]
    //   }
    // },
    // async getDelect() {
    //   const selection = this.$refs.tableContainer.$refs.singleTable.selection;
    //   if (selection.length === 0) {
    //     this.$message({
    //       type: "warning",
    //       message: "请勾选需要修改的商品"
    //     })
    //     return
    //   }
    //   if (selection.length > 20) {
    //     this.$message({
    //       type: "warning",
    //       message: "最多勾选20条商品"
    //     })
    //     return
    //   }
    //   try {
    //     const comfirm = await this.$confirm(`确定批量删除勾选中的商品？`, '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //     const res = await deleteShopeeProduct(selection);
    //     if (res.code !== 200) return;
    //     this.$message.success(res.message)
    //     this.getList()
    //   } catch (error) { }
    // }
  }
}
</script>
<style lang="scss" scoped>
.radioBtn {
  background-color: #81bef7;
  color: #fff;
}
</style>