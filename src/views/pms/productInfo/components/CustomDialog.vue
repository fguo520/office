<template>
  <el-dialog title="自定义导出" :visible.sync="visible" :before-close="close" width="600px" @open="handOpen">
    <el-form :inline="true" size="mini" label-width="100px" :rules="rules">
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
      <el-form-item label="产品状态:">
        <el-select v-model="listQuery.productStatus" placeholder="全部" size="mini" clearable filterable>
          <el-option v-for="(item, index) in type.searchTypeList" :key="index" :label="item.label" :value="item.value">
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
      <el-form-item label="系统SKU:">
        <TextareaInput v-model="listQuery.skus" />
      </el-form-item>
      <el-form-item label="上架时间:">
        <el-date-picker v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:250px" />
      </el-form-item>
      <el-form-item label="模板名称:" prop="id">
        <el-select v-model="id" placeholder="全部" size="mini" filterable @change="handId">
          <el-option v-for="(item, index) in temPlateList" :key="index" :label="item.templateName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="this.list.length>0">
      <el-table ref="tableContainer" class="el-table_right" style="width: 100%;margin-top:10px" :data="list" border max-height="462px" :header-cell-style="{ 'background-color': '#dadde3' }" row-key="value">
        <el-table-column label="序号" type="index" width="100" align="center" />
        <el-table-column label="列名称" align="center">
          <template #default="{ row }">
            <div v-copy="row.label" style="text-align:left">{{row.label}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="item_foot">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button @click="handleOk()" type="primary" size="mini">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryProductInfoTemp, importProductInfo } from '@/api/pms/productInfo';
import {
  ScrollSelect, TextareaInput
} from "@/components";
const defaultListQuery = {
  createTime: "",
  endTime: "",
  productClass: "",
  searchType: "ClientSKU",
  searchValue: "",
  skus: [],
  productProperty: "",
  withBattery: [],
  productStatus: "正常"
}
export default {
  name: "CustomDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Object,
      default: () => ({
        typeList: [],
        propertyList: [],
        withBatterysList: [],
        classList: [],
        searchTypeList: []
      })
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      createTimeAndEndTime: [],
      temPlateList: [],
      id: "",
      rules: {
        id: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      addData: [
        { label: "系统sku", value: "SKU" },
        { label: "自定义sku", value: "ClientSKU" },
        { label: "产品英文名", value: "ProductName" },
        { label: "产品中文名", value: "ProductNameCN" },
        { label: "产品颜色属性", value: "ProductColor" },
        { label: "产品尺码属性", value: "ProductSize" },
        { label: "本地仓可用库存（东莞正强达本地仓库）", value: "GoodNum" },
        { label: "本地仓估算日销量", value: "AvgDailySales" },
        { label: "产品来源", value: "ComeSource" },
        { label: "开发类型", value: "DevelopType" },
        { label: "图片来源", value: "PictureSource" },
        { label: "产品状态", value: "ProductState" },
        { label: "分类", value: "FullClassNameEn" },
        { label: "产品物流属性", value: "WithBattery" },
        { label: "产品侵权风险", value: "ProductProperty" },
        { label: "产品活跃度", value: "ProductVitalityType" },
        { label: "产品用途", value: "DeclarationPurpose" },
        { label: "采购链接", value: "WebProductUrl" },
        { label: "供应商", value: "SupplierName" },
        { label: "产品特殊，亮点", value: "FeatureList" },
        { label: "标题", value: "PageTitle" },
        { label: "关键词", value: "SearchKeyword" },
        { label: "关键词描述", value: "MateDescription" },
        { label: "产品描述", value: "ProductDescription" },
        { label: "最新供货价RMB", value: "LastSupplierPrice" },
        { label: "最新采购价RMB", value: "LastBuyPrice" },
        { label: "销售价USD", value: "SalePrice" },
        { label: "单价采购运费RMB", value: "UnitShipFee" },
        { label: "产品报关英文名", value: "DeclarationName" },
        { label: "产品报关中文名", value: "DeclarationNameCN" },
        { label: "产品报关材质", value: "DeclarationMaterial" },
        { label: "产品报关价USD", value: "DeclarationPriceRate" },
        { label: "包装清单", value: "PackingList" },
        { label: "上架状态", value: "OnlineStatus" },
        { label: "产品长度cm", value: "Length" },
        { label: "产品宽度cm", value: "Width" },
        { label: "产品高度cm", value: "Height" },
        { label: "包装后长度cm", value: "Pack_Length" },
        { label: "包装后宽度cm", value: "Pack_Width" },
        { label: "包装后高度cm", value: "Pack_Height" },
        { label: "外箱长m", value: "Carton_Length" },
        { label: "外箱宽m", value: "Carton_Height" },
        { label: "每箱pcs数量个", value: "Carton_PcsNum" },
        { label: "整箱产品净重 kg", value: "Carton_NetWeight" },
        { label: "整箱产品毛重 kg", value: "Carton_GrossWeight" },
        { label: "产品净重g", value: "NetWeight" },
        { label: "产品毛重g", value: "GrossWeight" },
        { label: "包裹重量g", value: "PackWeight" },
        { label: "开发人员", value: "DevelopAdminName" },
        { label: "产品编辑", value: "EditAdminName" },
        { label: "图片处理", value: "ImageAdminName" },
        { label: "采购人员", value: "BuyerName" },
        { label: "封面图", value: "OssSmallImageUrl" },
        { label: "产品图1", value: "image1" },
        { label: "产品图2", value: "image2" },
        { label: "产品图3", value: "image3" },
        { label: "产品图4", value: "image4" },
        { label: "产品图5", value: "image5" },
        { label: "产品图6", value: "image6" },
        { label: "产品图7", value: "image7" },
        { label: "产品图8", value: "image8" },
        { label: "产品图9", value: "image9" },
        { label: "产品图10", value: "image10" },
        { label: "产品图11", value: "image11" },
        { label: "产品图12", value: "image12" },
        { label: "产品图13", value: "image13" },
        { label: "产品图14", value: "image14" },
        { label: "产品图15", value: "image15" },
        { label: "标题（德语）", value: "PageTitle_de" },
        { label: "标题（法语）", value: "PageTitle_fr" },
        { label: "标题（西班牙语）", value: "PageTitle_es" },
        { label: "标题（意大利语）", value: "PageTitle_it" },
        { label: "关键词（德语）", value: "SearchKeyword_de" },
        { label: "关键词（法语）", value: "SearchKeyword_fr" },
        { label: "关键词（西班牙语）", value: "SearchKeyword_es" },
        { label: "关键词（意大利语）", value: "SearchKeyword_it" },
        { label: "产品描述（德语）", value: "ProductDescription_de" },
        { label: "产品描述（法语）", value: "ProductDescription_fr" },
        { label: "产品描述（西班牙语）", value: "ProductDescription_es" },
        { label: "产品描述（意大利语）", value: "ProductDescription_it" },
        { label: "产品特征，亮点（德语）", value: "FeatureList_de" },
        { label: "产品特征，亮点（法语）", value: "FeatureList_fr" },
        { label: "产品特征，亮点（西班牙语）", value: "FeatureList_es" },
        { label: "产品特征，亮点（意大利语）", value: "FeatureList_it" },
      ],
      list: []
    }
  },
  components: {
    ScrollSelect, TextareaInput
  },
  watch: {
    createTimeAndEndTime: function (newValue, oldValue) {
      const timeArr = newValue === null ? ["", ""] : newValue;
      this.listQuery.createTime = timeArr[0];
      this.listQuery.endTime = timeArr[1];
    },
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    async handOpen() {
      const res = await queryProductInfoTemp({
        pageIndex: 1,
        pageSize: 100
      })
      this.temPlateList = res.data.list
    },
    close() {
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, defaultListQuery)
      this.createTimeAndEndTime = []
      this.id = ""
      this.list = []
    },
    handId() {
      const arr = this.temPlateList.length > 0 ? JSON.parse(this.temPlateList.find(i => { return i.id == this.id }).templateList) : []
      for (let j = 0; j < arr.length; j++) {
        for (let i = 0; i < this.addData.length; i++) {
          if (arr[j] == this.addData[i].value) {
            this.list.push(this.addData.find(item => { return item.value == this.addData[i].value }))
          }
        }
      }
    },
    async handleOk() {
      if (!this.id) {
        this.$message.warning("请选择模板")
        return false
      }
      const productClass = this.listQuery.productClass.slice(-1)[0];
      const res = await importProductInfo(this.id, { ...this.listQuery, productClass })
      if (res.code == 200) {
        this.$message.success(res.message)
        this.close()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  height: 500px;
  overflow: auto;
}
.item_foot {
  margin-top: 15px;
  text-align: right;
}
</style>