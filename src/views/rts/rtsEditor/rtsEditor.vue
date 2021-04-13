<template>
  <el-tabs tab-position="left" class="eltabpaneheight" v-model="currentTab">
    <el-tab-pane label="产品信息" class="eltabpaneheight" name="prodInfo">
      <ProdInfo :home="this" ref="prodInfo" />
    </el-tab-pane>
    <el-tab-pane label="商品描述" class="eltabpaneheight" name="prodDescription">
      <ProdDescription :home="this" ref="prodDescription" />
    </el-tab-pane>
    <el-tab-pane label="交易信息" class="eltabpaneheight" name="tradeInfo">
      <TradeInfo :home="this" ref="tradeInfo" />
    </el-tab-pane>
    <el-tab-pane label="物流信息" class="eltabpaneheight" name="logisticsInfo">
      <LogisticsInfo :home="this" ref="logisticsInfo" />
    </el-tab-pane>
    <el-tab-pane label="特殊服务及其他" class="eltabpaneheight" name="other">
      <Other :home="this" ref="other" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ProdInfo from "./tabPaneModule/ProdInfo"
import ProdDescription from "./tabPaneModule/ProdDescription"
import TradeInfo from "./tabPaneModule/TradeInfo"
import LogisticsInfo from "./tabPaneModule/LogisticsInfo"
import Other from "./tabPaneModule/Other"
import { save, info, listingInfo, skuDetail } from "@/api/rts/rtsEditor"
import { listingSave } from "@/api/rts/rtsListing"

export default {
  name: 'rtsEditor',
  components: {
    ProdInfo,
    ProdDescription,
    TradeInfo,
    LogisticsInfo,
    Other
  },
  data() {
    return {
      currentTab: "prodInfo",
      listQuery: {
        id: '',
        //产品信息
        authId: '',
        sku: '', //2540180
        categoryId: [], //[5, 1007, 201267991]
        categoryStr: '',
        groupId: [],
        groupStr: '',
        subject: '',
        keywords: '',
        keywordOne: '',
        keywordtTwo: '',
        keywordThree: '',

        // 产品描述
        mainImages: [],
        descriptionStr: '',

        // 交易信息 & 部分物流信息
        priceType: 1,
        wholesaleTrade: {
          unitType: '',
          saleType: 'normal',
          batchNumber: '',
          minOrderQuantity: '',
          weight: '',
          packageSize: '',
          shippingLineTemplateId: ''
        },
        bulkDiscountPrices: [{ startQuantity: '', price: '' }],
        skuAttributeDetails: [],
        totalStock: '',

        // 物流信息
        deliverPeriods: [{ quantity: 100, processPeriod: 15 }],
        packageLength: '',
        packageWidth: '',
        packageHeight: '',

        // 特殊服务
        customInfos: [],

        // 额外字段
        productType: 'wholesale',
        market: 'main'
      },
      addFormItemList: [],
      addProdSpecsList: this.$route.query.id ? null : [],
      customAttrs: this.$route.query.id ? null : [],

      tinymceContent: '',
      tinymceReset: true,
      typeList: {
        unitTypeList: ['Set', 'Piece'],
        shippingList: []
      },
    };
  },
  created() {
    const { $route: { query: { id } }, listQuery } = this
    if (!id) return
    const resquestApi = this.$route.query.listing ? listingInfo : info
    resquestApi({ id }).then(res => {
      const { data } = res
      this.listQuery = {
        ...data,
        categoryId: data.categoryIds,
        groupId: data.groupIds,
        keywordOne: data.keywords.split(",")[0] || '',
        keywordtTwo: data.keywords.split(",")[1] || '',
        keywordThree: data.keywords.split(",")[2] || '',
        mainImages: data.mainImages.map(item => ({ url: item })),
        packageLength: data.wholesaleTrade.packageSize.split('X')[0] || '',
        packageWidth: data.wholesaleTrade.packageSize.split('X')[1] || '',
        packageHeight: data.wholesaleTrade.packageSize.split('X')[2] || '',
      }
      this.$nextTick(() => {
        this.$refs.prodInfo.categoryCallBack(); //解决联级类目动态加载时 未获取到类目id而无法正常回显
      })
      if (data.authId) this.$refs.prodInfo.authIdChange(data.authId)
      if (data.sku) {
        skuDetail({ sku: data.sku }).then(res => {
          // this.typeList.unitTypeList = res.data.unitTypeList;
          this.tinymceContent = res.data.description;
        })
      }

      const addFormItemList = [];
      const addProdSpecsList = [];
      const customAttrs = [];
      JSON.parse(data.attributeJson).forEach(item => {
        if (!item.attributeId) {
          customAttrs.push(item)
          return;
        }
        if (item.skuAttribute) {
          addProdSpecsList.push(item)
          return
        };
        addFormItemList.push(item)
      });
      this.addFormItemList = addFormItemList
      this.addProdSpecsList = addProdSpecsList
      this.customAttrs = customAttrs

      this.tinymceReset = true;
      this.$refs.prodInfo.listQuery = this.listQuery;
      this.$refs.tradeInfo.listQuery = this.listQuery;
      this.$refs.logisticsInfo.listQuery = this.listQuery;

      this.$refs.other.checkList = data.customInfos
      this.$refs.other.customAddAttrs = data.customInfos
      this.$refs.other.isCustomService = data.customInfos.length !== 0;

    })
  },
  methods: {
    async submit(submitType) {
      const {
        $refs: { prodInfo, prodDescription, tradeInfo, logisticsInfo, other },
        listQuery: { wholesaleTrade, packageLength, packageWidth, packageHeight, keywordOne, keywordtTwo, keywordThree, categoryId, groupId, mainImages },
        addFormItemList, addProdSpecsList, customAttrs, $message, $router } = this
      try {
        if (!prodInfo.validate()) { this.currentTab = 'prodInfo'; return }
        if (!prodDescription.validate()) { this.currentTab = 'prodDescription'; return }
        if (!tradeInfo.validate()) { this.currentTab = 'tradeInfo'; return }
        if (!logisticsInfo.validate()) { this.currentTab = 'logisticsInfo'; return }
        if (!other.validate()) { this.currentTab = 'other'; return }

        wholesaleTrade.packageSize = `${packageLength}X${packageWidth}X${packageHeight}`
        const categoryStr = (prodInfo.$refs.categoryCascader.presentText || '').replace(/\//g, '>')
        const groupStr = (prodInfo.$refs.groupIdCascader.presentText || '').replace(/\//g, '>')

        const attributes = addFormItemList.concat(addProdSpecsList, customAttrs).map(item => {
          return item.valueName instanceof Array ? item : { ...item, valueId: [item.valueId], valueName: [item.valueName] }
        })
        const submitAPI = this.$route.query.listing ? listingSave : save
        submitType ? (other.submitLoading = true) : (other.draftLoding = true);
        const res = await submitAPI({
          ...this.listQuery,
          categoryId: categoryId.slice(-1)[0],
          categoryStr: categoryStr,
          groupId: groupId && groupId.slice(-1)[0],
          groupStr: groupStr,
          mainImages: mainImages.map(item => item.url),
          keywords: [keywordOne, keywordtTwo, keywordThree].filter(item => item != '').join(','),
          wholesaleTrade,
          attributes,
          attributeJson: JSON.stringify(addFormItemList.concat(addProdSpecsList, customAttrs)),
          submitType
        })
        if (res.code == 200) {
          $message.success(res.data)
          const path = this.$route.query.listing ? '/rts/rtsListing' : '/rts/rtsPublish'
          $router.replace({ path, query: { status: this.$route.query.routeStatus} });
        }
      } catch (error) { }
      submitType ? (other.submitLoading = false) : (other.draftLoding = false);
    }
  },
};
</script>

<style scoped lang='scss'>
.eltabpaneheight {
  height: calc(100vh - 50px);
}
/deep/ .__view {
  position: absolute !important;
}
</style>
