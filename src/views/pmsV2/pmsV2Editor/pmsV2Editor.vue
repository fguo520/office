<template>
  <div style="overflow:hidden;">
    <Process :processNode='processNode' />
    <el-tabs tab-position="left" v-model="currentTab" class="elTabs">
      <el-tab-pane v-for="(item, index) in elTabPane" :key="index" :label="item.label" :name="item.name" />

      <vueScroll ref="vueScroll">
        <!-- <transition>
          <keep-alive>
            <component :is="currentTab" :home="this" :ref="currentTab" />
          </keep-alive>
        </transition> -->

        <BasicInfo v-show="currentTab === 'basicInfo'" ref="basicInfo" :home="this" />
        <CommodityPrice v-show="currentTab === 'commodityPrice'" ref="commodityPrice" :home="this" />
        <VariationMGT v-show="currentTab === 'variationMGT'" ref="variationMGT" :home="this" />
        <CommodityRemarks v-show="currentTab === 'commodityRemarks'" ref="commodityRemarks" :home="this" />
        <ProductPicture v-show="currentTab === 'productPicture'" ref="productPicture" :home="this" />
        <CommodityInfo v-show="currentTab === 'commodityInfo'" ref="commodityInfo" :home="this" />
        <CustomsInfo v-show="currentTab === 'customsInfo'" ref="customsInfo" :home="this" />
        <CommodityReview v-show="currentTab === 'commodityReview'" ref="commodityReview" :home="this" />
        <LangTransla v-show="currentTab === 'langTransla'" ref="langTransla" :home="this" />
        <CommodityLog v-show="currentTab === 'commodityLog'" ref="commodityLog" :home="this" />
      </vueScroll>

      <!-- <div :class="['bottomBar' , { commitState: commitLoad}]">
        <el-button type="primary" size="small" class="elButton" @click="commit" :loading="commitLoad">保存并继续编辑</el-button>
        <el-button type="primary" size="small" class="elButton" @click="$router.replace('/pmsV2/pmsV2List')">关闭页面</el-button>
      </div> -->
    </el-tabs>
  </div>
</template>

<script>
import BasicInfo from './tabPaneModule/BasicInfo'
import CommodityPrice from './tabPaneModule/CommodityPrice'
import VariationMGT from './tabPaneModule/VariationMGT'
import CommodityRemarks from './tabPaneModule/CommodityRemarks'
import ProductPicture from './tabPaneModule/ProductPicture'
import CommodityInfo from './tabPaneModule/CommodityInfo'
import CustomsInfo from './tabPaneModule/CustomsInfo'
import CommodityReview from './tabPaneModule/CommodityReview'
import LangTransla from './tabPaneModule/LangTransla'
import CommodityLog from './tabPaneModule/CommodityLog'
import Process from './components/Process'
import { basicInfoListQuery, commodityPriceListQuery, variationMGTListQuery, commodityRemarksListQuery, productPictureListQuery, commodityInfoListQuery, customsInfoListQuery, commodityReviewListQuery } from './moduleListQuery.js'
import { getProductCombType, getbrandTree, getCircuit, commitSave, reviewInfo, editInfo, copyProduct } from "@/api/pmsV2/pmsV2Editor"


export default {
  name: 'pmsV2Editor',
  components: {
    BasicInfo,
    CommodityPrice,
    VariationMGT,
    CommodityRemarks,
    ProductPicture,
    CommodityInfo,
    CustomsInfo,
    CommodityReview,
    LangTransla,
    CommodityLog,
    Process
  },
  data() {
    return {
      currentTab: 'basicInfo',
      elTabPane: [
        { label: '基础信息', name: 'basicInfo' },
        { label: '商品价格', name: 'commodityPrice' },
        { label: '变体管理', name: 'variationMGT' },
        { label: '商品备注', name: 'commodityRemarks' },
        { label: '商品图片', name: 'productPicture' },
        { label: '商品编辑', name: 'commodityInfo' },
        { label: '报关信息', name: 'customsInfo' },
        { label: '商品审核', name: 'commodityReview' },
        { label: '语言翻译', name: 'langTransla' },
        { label: '商品日志', name: 'commodityLog' },
      ],
      listQuery: {
        ...basicInfoListQuery,
        ...JSON.parse(JSON.stringify(commodityPriceListQuery)),
        ...variationMGTListQuery,
        ...commodityRemarksListQuery,
        ...productPictureListQuery,
        ...commodityInfoListQuery,
        ...customsInfoListQuery,
        ...commodityReviewListQuery,
      },
      attrsList: {},
      commitLoad: false,
      processNode: {},
    };
  },
  created() {
    const { $route: { query: { id } } } = this
    id && this.review(id)
    Promise.all([getProductCombType(), getbrandTree()]).then(res => {
      const typeObj = {}
      res[0].data.forEach(item => {
        typeObj.hasOwnProperty(item.type) ? typeObj[item.type].push(item) : typeObj[item.type] = [item]
      });
      this.attrsList = Object.freeze({ ...typeObj, '商品品牌': res[1].data })
    })
    this.getProcessNode()
  },
  watch: {
    currentTab() {
      this.$refs.vueScroll.scrollTo({ y: 0 }, 0)
    }
  },
  methods: {
    async review(id) {
      function getCheckMemo(value) {
        switch (value) {
          case '0':
            return '3'
          case '100':
            return '2'
          default:
            return '1';
        }
      }
      const { $route: { query: { copy } } } = this
      const requestApi = copy ? copyProduct : reviewInfo
      const res = await requestApi(id)
      const { data, data: { productProperty, productPropetyContent, productBrandType, brandName } } = res
      this.$refs.commodityInfo.tinymceReset = true
      this.$refs.commodityRemarks.tinymceReset = true
      this.$refs.commodityRemarks.createTimeAndEndTime = [data.persellSdate || '', data.pesellEdate || '']
      this.listQuery = Object.assign(this.listQuery, {
        ...data,
        checkMemo: getCheckMemo(res.data.checkProportion),
        productPropetyContent: productProperty === '2' ? productPropetyContent : '',
        productPropetyContent_gray: productProperty === '3' ? productPropetyContent.split(",") : [],
        productBrandArr: [Number(productBrandType || ''), Number(brandName || '')],
        baseInfoPic: data.baseInfoPic.map(item => ({
          imageType: item.imageType,
          imageUrl: item.imageOssMax,
          id: Math.round(Math.random() * 100000000)
        }))
      })
      this.elTabPane.forEach(item => {
        if (item.name === 'langTransla' || item.name === 'commodityLog') return;
        this.$refs[item.name].listQuery = this.listQuery
      })
    },
    getProcessNode() {
      const { $route: { query: { id } } } = this
      id && getCircuit({ productId: id }).then(res => {
        this.processNode = res.data
      })
    },
    async commit() {
      const validTabs = ['basicInfo', 'commodityPrice', 'variationMGT', 'productPicture', 'commodityInfo',]
      for (let tab of validTabs) {
        if (!this.$refs[tab].validate()) {
          this.currentTab = tab
          return
        }
      }
      this.commitLoad = true
      try {
        const { listQuery, listQuery: { productProperty, productPropetyContent, productPropetyContent_gray, productBrandArr }, $message, review,
          $route: { query: { id, copy } }, $router, getProcessNode,
          $refs: { basicInfo: { getBigSizeShow, getAMZBigSizeShow } } } = this
        const requestApi = id && !copy ? editInfo : commitSave
        const res = await requestApi({
          id,
          ...listQuery,
          productPropetyContent: productProperty == '3' ? productPropetyContent_gray.join() : productPropetyContent,
          salePlatform: listQuery.salePlatform.join(','),
          bigSize: getBigSizeShow,
          bigSizeAmz: getAMZBigSizeShow,
          productBrandType: productBrandArr[0] || '',
          brandName: productBrandArr[1] || '',
        })
        $message.success(res.message)
        $router.replace({ path: '/pmsV2/pmsV2Editor', query: { id: res.data } })
        review(res.data) // 保存后回显最新数据
        getProcessNode()
      } catch (error) { }
      this.commitLoad = false
    }
  },
};
</script>

<style scoped lang='scss'>
/deep/ .__view {
  width: 100% !important;
}
.elTabs /deep/ {
  // max-width: 1200px;
  // height: calc(100vh - 150px);
  // margin: auto;

  > div:nth-of-type(2) {
    height: calc(100vh - 150px);

    > .el-tab-pane {
      display: none !important;
    }
  }
}
.bottomBar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 60%;
  height: 10px;
  text-align: center;
  margin-left: 20%;
  border-radius: 10px;
  vertical-align: middle;
  background: hsla(0, 0%, 79%, 0.75);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  overflow: hidden;
  opacity: 0.5;
  transition: all 0.4s ease-in-out;
  z-index: 1999;
}
.elButton {
  opacity: 0;
  visibility: hidden;
}
@mixin showBottomBar {
  margin-left: 10%;
  width: 80%;
  opacity: 1;
  height: 50px;
  background: none;

  .elButton {
    opacity: 1;
    visibility: visible;
  }
}
.bottomBar:hover {
  @include showBottomBar;
}
.commitState {
  @include showBottomBar;
}

// .v-enter {
//   transform: scale(1.1);
//   opacity: 0.1;
// }
// .v-enter-to {
//   opacity: 0.1;
// }
// .v-leave-to {
//   transform: scale(0.9);
//   opacity: 0;
// }
// .v-enter-active,
// .v-leave-active {
//   position: absolute !important;
//   transition: all 0.3s ease-in-out;
// }
</style>
