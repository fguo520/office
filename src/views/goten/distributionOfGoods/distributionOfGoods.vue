<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageIndex" :pageSize.sync="listQuery.pageSize" @request="getList" :dropdownDefault="false" ref="tabelPageLayout">
    <ShrinkCard>
      <el-form :inline="true" size="mini" label-width="130px">
        <el-form-item label="sku：">
          <TextareaInput v-model="listQuery.sku" valueType="String" format="," />
        </el-form-item>
        <el-form-item label="是否清仓：">
          <DoubleSelectBtn v-model="listQuery.isClear" :true-label='1' :false-label="0" />
        </el-form-item>
        <el-form-item label="是否上架：">
          <DoubleSelectBtn v-model="listQuery.published" :true-label='1' :false-label="0" />
        </el-form-item>
        <el-form-item label="是否侵权：">
          <DoubleSelectBtn v-model="listQuery.tortStatus" :true-label='1' :false-label="0" />
        </el-form-item>
        <el-form-item label="分销平台：">
          <el-select v-model="listQuery.distributionPlatform" placeholder="全部" clearable filterable>
            <el-option label="冠通" value="冠通" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否加入分销库：">
          <DoubleSelectBtn v-model="listQuery.isDistribution" :true-label='1' :false-label="0" />
        </el-form-item>
        <el-form-item label="区域：">
          <el-select v-model="listQuery.store" placeholder="全部" clearable filterable>
            <el-option v-for="item in typeList.areaList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="品类：">
          <el-cascader :props="categoryProps" v-model="listQuery.category" clearable />
        </el-form-item>
        <el-form-item label="自定义时间：">
          <el-select v-model="listQuery.timeType" placeholder="全部" size="mini" clearable filterable style="width:100px">
            <el-option v-for="item in typeList.timeTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker v-model="createTimeAndEndTime" size="mini" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" @change="timeChange" />
        </el-form-item>
      </el-form>

      <template #button>
        <el-button @click="getQuery('reset')" size="mini">重置</el-button>
        <el-button @click="getQuery()" type="primary" size="mini" icon="el-icon-search">查询</el-button>
      </template>
    </ShrinkCard>

    <div style="margin-top:2px;">
      <el-button @click="batchJoinProLib" size="mini" type="primary" v-if="rolePermissionJudge('/distributionOfGoods/add')">批量加入分销库</el-button>
    </div>

    <!-- <template #container>
      <el-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" element-loading-text="数据加载中" border height="100%" :header-cell-style="{ 'background-color': '#dadde3' }">
        <el-table-column type="selection" width="40" />
        <el-table-column label="加入分销库" align="center" prop="isDistribution" width="100">
          <template #default="{ row }">
            <span :style="isDistributionStyle(row.isDistribution)">{{ row.isDistribution }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分销平台" align="center" width="130" prop="distributionPlatform" />
        <el-table-column label="图片" align="center" width="120" prop="platform">
          <template #default="{ row }">
            <el-image :src="row.imageList[0] && row.imageList[0].imageUrl" @click="imageDetail(row)" lazy :key='row.imageList[0] && row.imageList[0].imageUrl'>
              <div slot="error" class="image-slot">此商品无图片</div>
            </el-image>
            <div style="backgroundColor: #16c067; color:#fff; textAlign:center;" v-if="row.isClear">清仓</div>
          </template>
        </el-table-column>
        <el-table-column label=" 平台&站点" align="center" width="150" prop="isJoin">
          <template #default="{ row }">
            <div>{{ row.distributionPlatform }}</div>
            <el-popover placement="bottom" width="240" trigger="click">
              <div>
                <div>站点地址：{{ row.site }}</div>
                <div>区域编码：{{ row.stockCode }}</div>
              </div>
              <div slot="reference" style="cursor:pointer">{{ row.store }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="分销平台sku" align="center" width="150" prop="productId">
          <template #default="{ row }">
            <div>
              <i v-copy="row.sku" class="el-icon-document-copy" />
              <el-link type="success" :href="row.gotenProductUrl" target="_blank">{{ row.sku }}</el-link>
            </div>
            <el-tooltip content="商品平台编码" placement="bottom" :enterable="false">
              <div>{{ row.platformcommoditycode }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="产品信息" align="center" width="300" prop="addUser">
          <template #default="{ row }">
            <div style="text-align:left;">
              <el-tooltip v-for="(item, index) in getBasicInfo" :key="index" :content="row[item.key]" placement="top-start" :disabled="tooltipDisabled(row[item.key])">
                <div class="tooltipClass">{{ item.label }}：{{ row[item.key] }}</div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格&库存" align="center" width="150" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>价格：{{ row.price }} {{ row.currency }}</div>
              <div>库存：{{ row.qty }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="尺寸&重量" align="center" width="120" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>长：{{ row.specLength }}cm</div>
              <div>宽：{{ row.specWidth }}cm</div>
              <div>高：{{ row.specHeight }}cm</div>
              <div>重量：{{ row.specWeight }}g</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否侵权" align="center" width="180" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>{{ row.tortStatus }}</div>
              <div>侵权类型：{{ row.tortType }}</div>
              <div>侵权原因：{{ row.tortReason }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="详情" align="center" prop="addTime" width="180">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>是否上架：{{ row.published ? '是' : '否' }}</div>
              <div>商品仓库模式：{{ row.commoditywarehousemode }}</div>
              <div>产品物流属性：{{ row.freightAttrName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关键词" align="center" width="120" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              {{ row.keyWord }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品描述" align="center" width="120" prop="addTime">
          <template #default="{ row }">
            <el-tooltip placement="left">
              <ul slot="content" class="describeUl" @click="Ulclick">
                <li v-for="(item, index) in row.goodsDescriptionDisolayList" :key="index">
                  {{ item.paragraphName }}：
                  <span v-html="item.goodsDescription"></span>
                </li>
              </ul>
              <ul class="describeUl describe">
                <li v-for="(item, index) in row.goodsDescriptionDisolayList" :key="index">
                  {{ item.paragraphName }}：
                  <span v-html="item.goodsDescription"></span>
                </li>
              </ul>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" width="160" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>创建：<br>{{ row.createTime }}</div>
              <div>更新：<br>{{ row.updateTime }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template> -->

    <template #container>
      <u-table ref="tableContainer" :data="list" height="100" use-virtual element-loading-text="数据加载中" border v-loading="listLoading" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column type="selection" width="40" />
        <u-table-column label="是否已加入分销库" align="center" prop="isDistribution" width="100">
          <template #default="{ row }">
            <span :style="isDistributionStyle(row.isDistribution)">{{ row.isDistribution }}</span>
          </template>
        </u-table-column>
        <u-table-column label="分销平台" align="center" width="130" prop="distributionPlatform" />
        <u-table-column label="图片" align="center" width="120" prop="platform">
          <template #default="{ row }">
            <el-image :src="row.imageList[0] && row.imageList[0].imageUrl" @click="imageDetail(row)" lazy :key='row.imageList[0] && row.imageList[0].imageUrl'>
              <div slot="error" class="image-slot">此商品无图片</div>
            </el-image>
            <div style="backgroundColor: #16c067; color:#fff; textAlign:center;" v-if="row.isClear">清仓</div>
          </template>
        </u-table-column>
        <u-table-column label=" 平台&站点" align="center" width="150" prop="isJoin">
          <template #default="{ row }">
            <div>{{ row.distributionPlatform }}</div>
            <el-popover placement="bottom" width="240" trigger="click">
              <div>
                <div>站点地址：{{ row.site }}</div>
                <div>区域编码：{{ row.stockCode }}</div>
              </div>
              <div slot="reference" style="cursor:pointer">{{ row.store }}</div>
            </el-popover>
          </template>
        </u-table-column>
        <u-table-column label="分销平台sku" align="center" width="150" prop="productId">
          <template #default="{ row }">
            <div>
              <i v-copy="row.sku" class="el-icon-document-copy" />
              <el-link type="success" :href="row.gotenProductUrl" target="_blank">{{ row.sku }}</el-link>
            </div>
            <el-tooltip content="商品平台编码" placement="bottom" :enterable="false">
              <div>{{ row.platformcommoditycode }}</div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="产品信息" align="center" width="300" prop="addUser">
          <template #default="{ row }">
            <div style="text-align:left;">
              <el-tooltip v-for="(item, index) in getBasicInfo" :key="index" :content="row[item.key]" placement="top-start" :disabled="tooltipDisabled(row[item.key])">
                <div class="tooltipClass">{{ item.label }}：{{ row[item.key] }}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="价格&库存" align="center" width="150" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>价格：{{ row.price }} {{ row.currency }}</div>
              <div>库存：{{ row.qty }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="尺寸&重量" align="center" width="120" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>长：{{ row.specLength }}cm</div>
              <div>宽：{{ row.specWidth }}cm</div>
              <div>高：{{ row.specHeight }}cm</div>
              <div>重量：{{ row.specWeight }}g</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="是否侵权" align="center" width="180" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>{{ row.tortStatus }}</div>
              <div>侵权类型：{{ row.tortType }}</div>
              <div>侵权原因：{{ row.tortReason }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="详情" align="center" prop="addTime" width="180">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>是否上架：{{ row.published ? '是' : '否' }}</div>
              <div>商品仓库模式：{{ row.commoditywarehousemode }}</div>
              <div>产品物流属性：{{ row.freightAttrName }}</div>
            </div>
          </template>
        </u-table-column>
        <u-table-column label="关键词" align="center" width="120" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              {{ row.keyWord }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="产品描述" align="center" width="120" prop="addTime">
          <template #default="{ row }">
            <el-tooltip placement="left">
              <ul slot="content" class="describeUl" @click="Ulclick">
                <li v-for="(item, index) in row.goodsDescriptionDisolayList" :key="index">
                  {{ item.paragraphName }}：
                  <span v-html="item.goodsDescription"></span>
                </li>
              </ul>
              <ul class="describeUl describe">
                <li v-for="(item, index) in row.goodsDescriptionDisolayList" :key="index">
                  {{ item.paragraphName }}：
                  <span v-html="item.goodsDescription"></span>
                </li>
              </ul>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="160" prop="addTime">
          <template #default="{ row }">
            <div style="text-align:left;">
              <div>创建：<br>{{ row.createTime }}</div>
              <div>更新：<br>{{ row.updateTime }}</div>
            </div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <ImageDialog :visible.sync="image.visible" :row="image.row" />
  </TabelPageLayout>
</template>
<script>
import { TabelPageLayout, ShrinkCard, ScrollSelect, TextareaInput } from "@/components";
import DoubleSelectBtn from "./components/DoubleSelectBtn";
import ImageDialog from "./components/ImageDialog";
import { getGotenProductList, getCategoryList, batchUpdateDistribution, getGotenWarehouseList } from "@/api/goten/distributionOfGoods"
import clip from '@/utils/clipboard.js'
const defaultListQuery = {
  sku: '',
  isClear: '',
  published: '',
  tortStatus: '',
  isDistribution: '',
  distributionPlatform: '',
  category: [],
  store: '',
  timeType: '',
  startTime: '',
  endTime: '',
  pageIndex: 1,
  pageSize: 50,
};
export default {
  name: "distributionOfGoods",
  components: {
    TabelPageLayout,
    ShrinkCard,
    ScrollSelect,
    TextareaInput,
    DoubleSelectBtn,
    ImageDialog
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      createTimeAndEndTime: [],
      categoryProps: {
        lazy: true,
        checkStrictly: true,
        label: 'name',
        value: 'code',
        leaf: 'isLeaf',
        async lazyLoad(node, resolve) {
          const { value, level } = node;
          const res = await getCategoryList({ code: value || '', level })
          resolve(res.data)
        }
      },
      typeList: {
        timeTypeList: [{ label: "更新", value: 2 }, { label: "创建", value: 1 }],
        areaList: []
      },
      image: {
        visible: false,
        row: {},
      },
    }
  },
  created() {
    this.getTypeList()
    this.getList();
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  computed: {
    getBasicInfo() {
      return [
        { label: "品类", key: "category" },
        { label: "品牌名称", key: "brandName" },
        { label: "中文名", key: "cnName" },
        { label: "英文名", key: "enName" },
      ]
    },
    tooltipDisabled() {
      return (value) => value === null || value === undefined || value === ''
    },
    isDistributionStyle() {
      return (value) => {
        switch (value) {
          case '是':
            return { color: 'green', fontSize: '18px', fontWeight: 'bold' }
          case '否':
            return { color: 'red', fontSize: '18px', fontWeight: 'bold' }
        }
      }
    },
  },
  methods: {
    getQuery(reset) {
      if (reset) {
        this.listQuery = Object.assign({}, defaultListQuery);
      } else {
        this.listQuery.pageIndex = 1;
      }
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await getGotenProductList({ ...this.listQuery });
        this.list = res.data.list;
        this.total = res.data.totalCount;
      } catch (error) {
        console.log(error)
        // this.list = [];
        // this.total = 0;
      }
      this.listLoading = false;
    },
    getTypeList() {
      getGotenWarehouseList().then(res => {
        this.typeList.areaList = res.data
      })
    },
    timeChange() {
      if (this.createTimeAndEndTime != null) {
        this.listQuery.startTime = this.createTimeAndEndTime[0];
        this.listQuery.endTime = this.createTimeAndEndTime[1];
      } else {
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },
    imageDetail(row) {
      this.image = {
        visible: true,
        row: {
          imgList: row.imageList,
          cnName: row.cnName
        },
      }
    },
    async batchJoinProLib() {
      try {
        const { $refs, $message, $confirm, getList } = this;
        const selection = $refs.tableContainer.$refs.singleTable.selection
        const sku = selection.map(item => item.sku)
        if (sku.length === 0) {
          $message.warning("请在列表中勾选需要加入选品库的选品")
          return
        }
        await $confirm(`是否将勾选的${sku.length}个选品加入到选品库`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await batchUpdateDistribution({ sku })
        if (res.code === 200) {
          $message.success(res.data);
          getList()
        }
      } catch (error) { }
    },
    Ulclick(e) {
      const el = e.path.find(item => item.className == 'describeUl');
      clip(el.innerText, e)
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

  li {
    list-style-position: inside;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    max-height: 20px;
  }
}
</style>
