<template>
  <el-dialog title="产品信息" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeDialog" v-bind="$attrs">
    <el-tabs v-model="defaultTab" type="border-card" stretch @tab-click="tabClick">
      <el-tab-pane label="基本信息" name="basicInfo">
        <div class="tableContainer fristTableContainer">
          <vueScroll>
            <table border="1px" frame="void" rules="all" class="table_basicInfo">
              <tr>
                <th>系统sku：{{ skuInfoList.sku }}</th>
                <th>渠道sku：{{ skuInfoList.clientsku }}</th>
                <th>产品英文名：{{ skuInfoList.productname }}</th>
              </tr>
              <tr>
                <th>产品中文名：{{ skuInfoList.productnamecn }}</th>
                <th>产品来源：{{ skuInfoList.comesource }}</th>
                <th>开发类型：{{ skuInfoList.developtype }}</th>
              </tr>
              <tr>
                <th>图片来源：{{ skuInfoList.picturesource }}</th>
                <th>产品状态：{{ skuInfoList.productstate }}</th>
                <th>产品颜色：{{ skuInfoList.productcolor }}</th>
              </tr>
              <tr>
                <th>分类：{{ skuInfoList.productcolor }}</th>
                <th>产品物流属性：{{ skuInfoList.withbattery }}</th>
                <th>产品侵权风险：{{ skuInfoList.productproperty }}</th>
              </tr>
              <tr>
                <th>本地仓估算日销量：{{ skuInfoList.avgdailysales }}</th>
                <th>产品新品类型：{{ skuInfoList.productnewtype }}</th>
                <th>产品活跃度：{{ skuInfoList.productvitalitytype }}</th>
              </tr>
              <tr>
                <th>产品用途：{{ skuInfoList.declarationpurpose }}</th>
                <th colspan="2">采购链接：{{ skuInfoList.webproducturl }}</th>
              </tr>
              <tr>
                <th colspan="3">供应商：{{ skuInfoList.suppliername }}</th>
              </tr>
              <tr>
                <th colspan="3">
                  产品特殊，亮点：{{ skuInfoList.featureListStr }}
                </th>
              </tr>
              <tr>
                <th colspan="3">标题：{{ skuInfoList.pagetitle }}</th>
              </tr>
              <tr>
                <th colspan="3">
                  关键词：{{
                    skuInfoList.mateKeywordStr
                  }}
                </th>
              </tr>
              <tr>
                <th colspan="3">
                  关键词描述：{{
                    skuInfoList.mateDescriptionStr
                  }}
                </th>
              </tr>
              <tr>
                <th colspan="3" rowspan="3">
                  产品描述：
                  <div v-html="skuInfoList.productDescriptionStr"></div>
                </th>
              </tr>
            </table>
          </vueScroll>
        </div>
      </el-tab-pane>
      <el-tab-pane label="价格信息" name="price">
        <div class="tableContainer">
          <table frame="void" rules="all" class="table_price">
            <tr>
              <th>最新供货价(RMB)：{{ skuInfoList.lastsupplierprice }}</th>
              <th>销售价(USD)：{{ skuInfoList.saleprice }}</th>
            </tr>
            <tr>
              <th>最新采购价(RMB)：{{ skuInfoList.lastbuyprice }}</th>
              <th>单价采购运费(RMB)：{{ skuInfoList.unitshipfee }}</th>
            </tr>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="报关信息" name="otherInfo">
        <div class="tableContainer">
          <table border="1px" frame="void" rules="all" class="table_otherInfo">
            <tr>
              <th>产品报关英文名：{{ skuInfoList.declarationname }}</th>
              <th>产品报关中文名：{{ skuInfoList.declarationnamecn }}</th>
            </tr>
            <tr>
              <th>产品报关材质：{{ skuInfoList.declarationmaterial }}</th>
              <th>产品报关价(USD)：{{ skuInfoList.declarationpricerate }}</th>
            </tr>
            <tr>
              <th colspan="2">包装清单：{{ skuInfoList.packingListStr  }}</th>
            </tr>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="审核状态" name="review">
        <div class="tableContainer">
          <table border="1px" frame="void" rules="all" class="table_review">
            <tr>
              <th>开发审核状态：{{ skuInfoList.developstatus }}</th>
              <th>添加时间：{{skuInfoList.addtime}}</th>
            </tr>
            <tr>
              <th>编辑审核状态：{{ skuInfoList.editstatus }}</th>
              <th>更新时间：{{ skuInfoList.updatetime}}</th>
            </tr>
            <tr>
              <th>图片审核状态：{{ skuInfoList.imagestatus }}</th>
              <th>图片更新：{{skuInfoList.updateimagedatetime}}</th>
            </tr>
            <tr>
              <th>终审状态：{{ skuInfoList.checkstatus }}</th>
              <th>上架时间：{{skuInfoList.onlinetime}}</th>
            </tr>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="相关人员" name="personnel">
        <div class="tableContainer">
          <table border="1px" frame="void" rules="all" class="table_personnel">
            <tr>
              <th>开发人员：{{ skuInfoList.developadminname }}</th>
            </tr>
            <tr>
              <th>产品编辑人员：{{ skuInfoList.editadminname }}</th>
            </tr>
            <tr>
              <th>图片处理人员：{{ skuInfoList.imageadminname }}</th>
            </tr>
            <tr>
              <th>采购人员：{{ skuInfoList.buyername }}</th>
            </tr>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="尺寸，重量" name="sizeWeight">
        <div class="tableContainer">
          <table border="1px" frame="void" rules="all" class="table_personnel">
            <tr>
              <th>产品长度：{{ skuInfoList.length }} (cm)</th>
              <th>产品宽度：{{ skuInfoList.width }} (cm)</th>
              <th>产品高度：{{ skuInfoList.height }} (cm)</th>
            </tr>
            <tr>
              <th>包装后长度：{{ skuInfoList.packLength }} (cm)</th>
              <th>包装后宽度：{{ skuInfoList.packWidth }} (cm)</th>
              <th>包装后高度：{{ skuInfoList.packHeight }} (cm)</th>
            </tr>
            <tr>
              <th>外箱长：{{ skuInfoList.cartonLength }} (m)</th>
              <th>外箱宽：{{ skuInfoList.cartonWidth }} (m)</th>
              <th>外箱高：{{ skuInfoList.cartonHeight }} (m)</th>
            </tr>
            <tr>
              <th>每箱pcs数量：{{ skuInfoList.cartonPcsnum }} 个</th>
              <th>整箱产品净重：{{ skuInfoList.cartonNetweight }} kg</th>
              <th>整箱产品毛重：{{ skuInfoList.cartonGrossweight }} kg</th>
            </tr>
            <tr>
              <th>产品净重：{{ skuInfoList.netweight }} g</th>
              <th>产品毛重：{{ skuInfoList.grossweight }} g</th>
              <th>包裹重量：{{ skuInfoList.packweight }} g</th>
            </tr>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图片" name="picture">
        <vueScroll>
          <div class="imageContainer">
            <el-image v-for="url in formatImageUrl" :key="url" :src="url" class="image" :preview-src-list="formatImageUrl">
              <div slot="placeholder" class="image-slot">
                <i class="el-icon-loading" />
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div class="emptyBox"></div>
            <div class="emptyBox"></div>
            <div class="emptyBox"></div>
            <div class="emptyBox"></div>
            <div class="emptyBox"></div>
            <div class="emptyBox"></div>
            <div class="emptyBox"></div>
          </div>
        </vueScroll>
      </el-tab-pane>
      <el-tab-pane label="多语言" name="translate">
        <div class="tableContainer">
          <LangueDialog :list.sync="translationList" :languages="languages" :sku="skuInfoList.sku" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import createAxios from '@/utils/axios'
const request = createAxios(process.env.BASE_API)
import { getTranslateData, getTranslateLanguages } from "@/api/pms/productInfo"
import LangueDialog from "./components/LangueDialog"
export default {
  name: "sku-info-view",
  data() {
    return {
      skuInfoList: [],
      dialogVisible: false,
      defaultTab: 'basicInfo',
      translationList: [],
      languages: [],
    };
  },
  props: {
    id: {
      type: undefined,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LangueDialog
  },
  beforeDestroy() {
    this.closeDialog();
  },
  watch: {
    id: function (newValue, oldValue) {
      this.skuInfoList = [];
      request({
        url: `/shApi/productInfo/item/${newValue}`,
        method: "get",
      }).then(res => {
        this.skuInfoList = res.data;
        if (this.skuInfoList.sku) { this.getTranslateData() }
      });
    },
    visible: function (newValue, oldValue) {
      if (newValue) {
        this.dialogVisible = newValue;
        this.defaultTab = 'basicInfo';
      }
    },
  },
  computed: {
    formatImageUrl() {
      // return this.skuInfoList.images ? this.skuInfoList.images.map(item => item.imageurl) : [];
      if (this.skuInfoList.images) {
        return this.skuInfoList.images.map(item => item.imageurl);
      } else {
        return [];
      }
    },
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      this.$emit("update:visible", this.dialogVisible);
    },
    getTranslateData() {
      getTranslateData(this.skuInfoList.sku).then(res => { this.translationList = res.data })
      getTranslateLanguages().then(res => { this.languages = res.data })
    },
    tabClick(el) {
      if (el.name !== "translate") return;
      el.$children[0].languageTabs = 'en'
    }
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog__body {
  padding: 0px;

  .el-tabs__content {
    padding: 0;
  }
}

.table_basicInfo,
.table_review,
.table_personnel,
.table_price,
.table_otherInfo {
  border-bottom: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  width: 100%;
  th {
    min-width: 200px;
    text-align: left;
    line-height: 32px;
    padding: 10px;
  }
}
.tableContainer,
.imageContainer {
  height: 500px;
}
.fristTableContainer {
  overflow-x: hidden;
  overflow-y: auto;
}
.imageContainer {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .image {
    width: 150px;
    height: 150px;
    vertical-align: middle;
  }
  .emptyBox {
    height: 0;
    width: 150px;
    border: none;
  }

  .el-image,
  .image-slot {
    display: inline-flex;
    justify-content: center;
    align-content: center;
  }
  .el-icon-loading {
    margin: auto;
  }
}
</style>
