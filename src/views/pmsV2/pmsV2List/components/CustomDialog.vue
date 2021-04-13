<template>
  <el-dialog title="自定义导出" :visible.sync="visible" :before-close="close" width="600px" @open="handOpen" :close-on-click-modal="false">
    <el-form :inline="true" size="mini" label-width="100px" :rules="rules">
      <el-form-item label="搜索类型:">
        <el-select v-model="listQuery.searchTypes" placeholder="全部" size="mini" clearable filterable style="width:100px">
          <el-option v-for="(item, index) in typeList.searchTypes" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <TextareaInput v-model="listQuery.searchValues" />
      </el-form-item>
      <el-form-item label="商品分类:">
        <el-cascader v-model="listQuery.productClasses" size="mini" :options="typeList['商品分类']" clearable placeholder="全部" :props="{label: 'classnamecn',value: 'classid',checkStrictly: true}" style="width:297px;" filterable />
      </el-form-item>
      <el-form-item label="侵权风险:">
        <el-select v-model="listQuery.productProperty" placeholder="全部" size="mini" clearable filterable style="width:297px;">
          <el-option v-for="(item, index) in typeList['产品侵权风险']" :key="index" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="物流属性:">
        <el-select v-model="listQuery.withBattery" placeholder="全部" style="width:297px;" clearable filterable>
          <el-option v-for="(item, index) in typeList['物流属性']" :key="index" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="搜索类型:">
        <el-select v-model="listQuery.searchType" placeholder="全部" size="mini" clearable filterable style="width:100px">
          <el-option v-for="(item, index) in typeList.searchType" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="listQuery.searchValue" style="width:193px;" />
      </el-form-item>
      <el-form-item label="审核类型:">
        <el-select v-model="listQuery.checkType" placeholder="全部" size="mini" clearable filterable style="width:100px">
          <el-option v-for="(item, index) in typeList.checkTypeList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="listQuery.checkStatus" placeholder="全部" size="mini" clearable filterable style="width:193px;">
          <el-option v-for="(item, index) in typeList.checkStatusList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品类型:">
        <el-select v-model="listQuery.productType" placeholder="请选择" style="width:297px;" clearable>
          <el-option v-for="item in typeList['商品类型']" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="开发类型:">
        <el-select v-model="listQuery.developType" placeholder="全部" style="width:297px;" clearable>
          <el-option v-for="item in typeList['开发类型']" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品来源:">
        <el-select v-model="listQuery.comeSource" placeholder="全部" style="width:297px;" clearable>
          <el-option v-for="item in typeList['商品来源']" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否翻译:">
        <el-select v-model="listQuery.isTranslate" placeholder="全部" size="mini" clearable filterable style="width:297px;">
          <el-option v-for="(item, index) in typeList.isTranslateList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发货仓库:">
        <el-select v-model="listQuery.warehouseShipping" placeholder="全部" style="width:297px;" clearable>
          <el-option v-for="item in typeList['发货仓库']" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品状态:">
        <el-select v-model="listQuery.productState" placeholder="全部" style="width:297px;" clearable>
          <el-option v-for="item in typeList['商品状态']" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间类型:">
        <el-select v-model="listQuery.dateType" placeholder="全部" size="mini" clearable filterable style="width:100px">
          <el-option v-for="(item, index) in typeList.dateTypeList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker @change="timeChange" v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width:200px" />
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
import { queryProductInfoTemp, importProductInfo } from '@/api/pmsV2/pmsV2List';
import { TextareaInput } from "@/components";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  dateType: 'createTime',
  beginDate: new Date(),
  endDate: new Date(),
  warehouseShipping: '',
  productType: '',
  developType: '',
  comeSource: '',
  productClasses: [],
  grade: '',
  productState: 6,
  searchType: "developAdminName",
  searchTypes: "sku",
  checkType: '',
  checkStatus: '',
  searchValue: '',
  searchValues: [],
  productProperty: "",
  withBattery: '',
  isTranslate: ''
};
export default {
  name: "CustomDialog",
  components: {
    TextareaInput
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      createTimeAndEndTime: [new Date(), new Date()],
      temPlateList: [],
      id: "",
      rules: {
        id: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      addData: [
        { label: "系统sku", value: "sku" },
        { label: "自定义sku", value: "client_sku" },
        { label: "产品英文名", value: "product_name" },
        { label: "产品中文名", value: "product_name_cn" },
        { label: "产品颜色属性", value: "product_color" },
        { label: "产品尺码属性", value: "product_size" },
        { label: "产品来源", value: "come_source" },
        { label: "开发类型", value: "develop_type" },
        { label: "图片来源", value: "image_source" },
        { label: "产品状态", value: "product_state" },
        { label: "产品物流属性", value: "with_battery" },
        { label: "产品侵权风险", value: "product_property" },
        { label: "产品用途", value: "declaration_urpose" },
        { label: "采购链接", value: "web_product_url" },
        { label: "供应商", value: "supplier_name" },
        { label: "产品特殊，亮点", value: "feature_list" },
        { label: "标题", value: "page_title" },
        { label: "关键词", value: "search_keyword" },
        { label: "关键词描述", value: "mate_description" },
        { label: "产品描述", value: "product_description" },
        { label: "最新供货价RMB", value: "last_supplier_price" },
        { label: "单价采购运费RMB", value: "purchase_freight" },
        { label: "产品报关英文名", value: "declaration_name" },
        { label: "产品报关中文名", value: "declaration_name_cn" },
        { label: "产品报关材质", value: "declaration_material" },
        { label: "产品报关价USD", value: "declaration_price_rate" },
        { label: "包装清单", value: "packing_list" },
        { label: "产品长度cm", value: "length" },
        { label: "产品宽度cm", value: "width" },
        { label: "产品高度cm", value: "height" },
        { label: "包装后长度cm", value: "pack_length" },
        { label: "包装后宽度cm", value: "pack_width" },
        { label: "包装后高度cm", value: "pack_height" },
        { label: "外箱长m", value: "carton_length" },
        { label: "外箱宽m", value: "carton_width" },
        { label: "外箱高m", value: "carton_height" },
        { label: "每箱pcs数量个", value: "carton_pcs_num" },
        { label: "整箱产品净重 kg", value: "carton_net_eight" },
        { label: "整箱产品毛重 kg", value: "carton_gross_weight" },
        { label: "产品净重g", value: "net_weight" },
        { label: "产品毛重g", value: "gross_weight" },
        { label: "包裹重量g", value: "pack_weight" },
        { label: "开发人员", value: "develop_admin_name" },
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
        { label: "标题（德语）", value: "page_title_de" },
        { label: "标题（法语）", value: "page_title_fr" },
        { label: "标题（西班牙语）", value: "page_title_es" },
        { label: "标题（意大利语）", value: "page_title_it" },
        { label: "关键词（德语）", value: "search_keyword_de" },
        { label: "关键词（法语）", value: "search_keyword_fr" },
        { label: "关键词（西班牙语）", value: "search_keyword_es" },
        { label: "关键词（意大利语）", value: "search_keyword_it" },
        { label: "产品描述（德语）", value: "product_description_de" },
        { label: "产品描述（法语）", value: "product_description_fr" },
        { label: "产品描述（西班牙语）", value: "product_description_es" },
        { label: "产品描述（意大利语）", value: "product_description_it" },
        { label: "产品特征，亮点（德语）", value: "feature_list_de" },
        { label: "产品特征，亮点（法语）", value: "feature_list_fr" },
        { label: "产品特征，亮点（西班牙语）", value: "feature_list_es" },
        { label: "产品特征，亮点（意大利语）", value: "feature_list_it" },
      ],
      list: []
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    timeChange() {
      if (this.createTimeAndEndTime != null) {
        this.listQuery.beginDate = this.createTimeAndEndTime[0];
        this.listQuery.endDate = this.createTimeAndEndTime[1];
      } else {
        this.listQuery.beginDate = "";
        this.listQuery.endDate = "";
      }
    },
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
      this.list = []
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
      const productClasses = this.listQuery.productClasses.slice(-1)[0];
      const res = await importProductInfo(this.id, { ...this.listQuery, productClasses })
      if (res.code == 200) {
        this.$message.success(res.message)
        this.close()
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
/deep/ .el-dialog__body {
  height: 500px;
  overflow: auto;
}
.item_foot {
  margin-top: 15px;
  text-align: right;
}
</style>