<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList" :dropdownDefault="false" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="130px">
        <el-form-item label="平台">
          <el-select v-model="listQuery.platform" placeholder="全部" clearable filterable>
            <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="检测结果：">
          <ScrollSelect v-model="listQuery.checkResults" :list="typeList.testResultsList" placeholder="可多选" />
        </el-form-item>
        <el-form-item label="任务编号：">
          <el-input placeholder="请输入" v-model="listQuery.taskNo" clearable />
        </el-form-item>
        <el-form-item label="商品ID：">
          <TextareaInput v-model="listQuery.productIds" />
        </el-form-item>
        <el-form-item label="对标公司：">
          <el-input placeholder="精确搜索" v-model="listQuery.company" clearable />
        </el-form-item>
        <el-form-item label="平台类目：">
          <el-input placeholder="模糊搜索" v-model="listQuery.category" clearable />
        </el-form-item>
        <el-form-item label="是否加入选品库：">
          <el-select v-model="listQuery.isJoin" placeholder="全部" clearable filterable>
            <el-option v-for="(item, index) in typeList.isJoinList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:2px;">
      <el-button @click="batchJoinProLib" size="mini" type="primary" v-if="rolePermissionJudge('/selectionManagement/add')">
        批量加入选品库
      </el-button>
      <el-button @click="batchDeleteProduct" size="mini" type="primary">
        批量删除选品
      </el-button>
    </div>

    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="40" />
        <u-table-column label="图片" align="center" prop="keyWord" width="100">
          <template #default="{ row }">
            <el-image :src="row.prodImg" @click="imageDetail(row)" />
          </template>
        </u-table-column>
        <u-table-column label="任务编号" align="center" width="130" prop="taskNo" />
        <u-table-column label="平台" align="center" width="120" prop="platform">
          <template #default="{ row }">
            <div>{{ row.platform }}</div>
            <div v-copy="row.company">{{ row.company }}</div>
          </template>
        </u-table-column>
        <u-table-column label="是否加入选品库" align="center" width="80" prop="isJoin">
          <template #default="{ row }">
            <span :style="{ color: row.isJoin ? '#7cb305':'#0050b3' }"> {{ row.isJoin ? '是' : '否' }} </span>
          </template>
        </u-table-column>
        <u-table-column label="商品ID" align="center" width="150" prop="productId">
          <template #default="{ row }">
            <div>
              <i v-copy="row.productId" class="el-icon-document-copy"></i>
              <el-link :href="row.productUrl" target="_blank" type="primary">{{ row.productId }}</el-link>
            </div>
            <div class="numTimesClass">
              {{ row.numTimes }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="基本信息" align="center" width="300" prop="addUser">
          <template #default="{ row }">
            <div style="text-align:left;">
              <el-tooltip v-for="(item, index) in getBasicInfo" :key="index" :content="row[item.key]" placement="top-start" :disabled="tooltipDisabled(row[item.key])">
                <div class="tooltipClass">{{ item.label }}：{{ row[item.key] }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="检测结果" align="center" width="110" prop="addTime">
          <template #default="{ row }">
            <div v-for="(item, index) in checkResultDealwith(row.checkResult)" :key="index" @click="resultsDetail(item, row.id)" :style="{ color:item.color, cursor: 'pointer' }">
              {{ item.label }}
              <el-badge :value="row.resultNum" v-if="item.badge" class="badgeClass" />
            </div>
          </template>
        </u-table-column>
        <u-table-column label="价格" align="center" width="120" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>最低价格：<br>{{ row.minPrice }} USD</div>
              <div>最高价格：<br>{{ row.maxPrice }} USD</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="选品信息" align="center" width="180" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>长：{{ row.prodLength }}</div>
              <div>宽：{{ row.prodWidth }}</div>
              <div>高：{{ row.prodHeight }}</div>
              <div>包装后长：{{ row.prodPackingLength }}</div>
              <div>包装后宽：{{ row.prodPackingWidth }}</div>
              <div>包装后高：{{ row.prodPackingHeight }}</div>
              <div>重量：{{ row.prodWeight }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="描述" align="center" prop="addTime">
          <template #default="{ row }">
            <el-tooltip placement="top">
              <ul slot="content" class="describeUl">
                <li v-for="item in getDescribe(row)" :key="item">{{ row[item] }}</li>
              </ul>
              <ul class="describeUl describe">
                <li v-for="item in getDescribe(row)" :key="item">{{ row[item] }}</li>
              </ul>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="评价/排名" align="center" width="120" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>评论数：{{ row.reviewNum }}</div>
              <div>评分：{{ row.score }}</div>
              <div>问题数：{{ row.qaNum }}</div>
              <div>{{ getRankKey(row.platform).label }}{{ row[getRankKey(row.platform).key] }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="160" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>商品上架：<br>{{ row.dateFirstAvailable }}</div>
              <div>数据更新：<br>{{ row.dwdUpdateDate }}</div>
              <div>抓取数据：<br>{{ row.dwdCreateDate }}</div>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>

    <CheckResultDialog :visible.sync="checkResult.visible" :result="checkResult.queryResult" />
    <ImageDialog :visible.sync="image.visible" :row="image.row" />
  </TabelPageLayout>
</template>
<script>
import { TabelPageLayout, ShrinkCard, ScrollSelect, TextareaInput } from "@/components";
import CheckResultDialog from "./components/CheckResultDialog"
import ImageDialog from "./components/ImageDialog"
import { list, getPlatforms, getCheckResult, batchJoinProLib, batchDeleteProduct } from "@/api/selection/selectionManagement"
const defaultListQuery = {
  platform: "",
  checkResults: [],
  productIds: [],
  taskNo: "",
  company: "",
  category: "",
  isJoin: "",
  pageNum: 1,
  pageSize: 50,
};
export default {
  name: "selectionManagement",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      typeList: {
        platformList: [],
        testResultsList: [
          { label: "待检测", value: "0", color: "#d4b106" },
          { label: "侵权", value: "1", color: '#f5222d' },
          { label: "图片重复", value: "2", color: '#fa8c16', badge: true },
          { label: "正常", value: "3", color: '#7cb305' }
        ],
        isJoinList: [{ label: "是", value: true }, { label: "否", value: false }],
      },
      checkResult: {
        visible: false,
        queryResult: {}
      },
      image: {
        visible: false,
        row: {},
      }
    }
  },
  components: {
    TabelPageLayout,
    ShrinkCard,
    ScrollSelect,
    TextareaInput,
    CheckResultDialog,
    ImageDialog
  },
  created() {
    this.getList();
    this.getType();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  computed: {
    getRankKey() {
      return function (key) {
        switch (key) {
          case "amazon":
            return { label: '排名：', key: 'rank1' }
          case "aliexpress":
            return { label: '订单数：', key: 'orderCnt' }
          default:
            return { label: '', key: '' }
        }
      }
    },
    checkResultDealwith() {
      return function (result) {
        return result.split(",").map(resultItem => {
          return this.typeList.testResultsList.find(item => resultItem === item.value)
        })
      }
    },
    getBasicInfo() {
      return [
        { label: "品牌", key: "brand" },
        { label: "制造商", key: "manufacturer" },
        { label: "平台类目", key: "category" },
        { label: "标题", key: "prodNameCn" },
        { label: "选品中文名称", key: "prodNameCn" },
        { label: "选品英文名称", key: "prodNameEn" },
      ]
    },
    tooltipDisabled() {
      return (value) => value === null || value === undefined
    },
    getDescribe() {
      return (row) => {
        const key = ['prodFiveDesc1', 'prodFiveDesc2', 'prodFiveDesc3', 'prodFiveDesc4', 'prodFiveDesc5']
        return key.filter(item => row[item] !== null && row[item] !== undefined)
      }
    }
  },
  methods: {
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageNum = 1;
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await list({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    async getType() {
      const res = await getPlatforms();
      this.typeList.platformList = res.data
    },
    async resultsDetail(item, id) {
      if (item.value === "0" || item.value === "3") return
      const res = await getCheckResult({ checkType: item.value, id })
      this.checkResult = {
        visible: true,
        queryResult: res.data
      }
    },
    imageDetail(row) {
      this.image = {
        visible: true,
        row: {
          imgList: row.imgUrls.split(","),
          prodNameCn: row.prodNameCn
        },
      }
    },
    async batchJoinProLib() {
      try {
        const { $refs, $message, $confirm, getList } = this;
        const selection = $refs.tableContainer.$refs.singleTable.selection
        const ids = selection.map(item => item.id)
        if (ids.length === 0) {
          $message.warning("请在列表中勾选需要加入选品库的选品")
          return
        }
        await $confirm(`是否将勾选的${ids.length}个选品加入到选品库`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await batchJoinProLib(ids)
        if (res.code === 200) {
          $message.success(res.data);
          getList()
        }
      } catch (error) { }
    },
    async batchDeleteProduct() {
      try {
        const { $refs, $message, $confirm, getList } = this;
        const selection = $refs.tableContainer.$refs.singleTable.selection
        const ids = selection.map(item => item.id)
        if (ids.length === 0) {
          $message.warning("请在列表中勾选需要删除的选品")
          return
        }
        await $confirm(`是否将勾选的${ids.length}个选品删除`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await batchDeleteProduct(ids)
        if (res.code === 200) {
          $message.success("删除成功")
          getList()
        }
      } catch (error) { }
    }
  }
}
</script>
<style lang="scss" scoped>
.describeUl {
  padding-left: 15px;
  li {
    margin: 10px 0;
  }
}
.describe {
  text-align: left;
  padding-left: 0px;
  // display: -webkit-box;
  // -webkit-box-orient: vertical;
  // -webkit-line-clamp: 3;
  // overflow: hidden;

  li {
    list-style-position: inside;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.badgeClass {
  position: absolute;

  /deep/ .el-badge__content {
    left: -5px;
  }
}
.numTimesClass {
  margin-top: 10px !important;
  width: 25px;
  height: 25px;
  line-height: 25px;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin: auto;
  background-color: rgb(238, 100, 100);
}
</style>