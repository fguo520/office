<template>
  <div>
    <!-- 第一个无用，修复el-table-coloumn 被元素包裹后 渲染出现 顺序问题 -->
    <u-table-column width="1" />
    <u-table-column type="selection" width="45" />

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
    <u-table-column label="操作人" align="center" width="150" prop="distributionUser" />
    <u-table-column label="时间" align="center" width="160" prop="addTime">
      <template #default="{ row }">
        <div style="text-align:left;">
          <div>创建：<br>{{ row.createTime }}</div>
          <div>更新：<br>{{ row.updateTime }}</div>
        </div>
      </template>
    </u-table-column>

    <ImageDialog :visible.sync="image.visible" :row="image.row" />
  </div>
</template>

<script>
import ImageDialog from "./ImageDialog";
import clip from '@/utils/clipboard.js'
export default {
  name: "ProdInfoTable",
  components: {
    ImageDialog
  },
  props: {
  },
  data() {
    return {
      image: {
        visible: false,
        row: {},
      },
    }
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
  },
  methods: {
    imageDetail(row) {
      this.image = {
        visible: true,
        row: {
          imgList: row.imageList,
          cnName: row.cnName
        },
      }
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
