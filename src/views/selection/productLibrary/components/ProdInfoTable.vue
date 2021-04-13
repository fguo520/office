<template>
  <div>
    <!-- 第一个无用，修复u-table-coloumn 被元素包裹后 渲染出现 顺序问题 -->
    <u-table-column width="1" />
    <u-table-column type="selection" width="45" />

    <u-table-column label="图片" align="center" width="100">
      <template #default="{ row }">
        <el-image :src="row.prodImg" />
        <div :style="getColorStatus(row.prodStatus)">{{ row.prosdStatus }}</div>
      </template>
    </u-table-column>
    <u-table-column label="任务编号" align="center" width="130" prop="taskNo" />
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
    <u-table-column label="检测结果" align="center" width="110" prop="addTime">
      <template #default="{ row }">
        <div v-for="(item, index) in checkResultDealwith(row.checkResult)" :key="index" @click="resultsDetail(item, row.prodViewId)" :style="{ color:item.color, cursor: 'pointer' }">
          {{ item.label }}
          <el-badge :value="row.resultNum" v-if="item.badge" class="badgeClass" />
        </div>
      </template>
    </u-table-column>
    <u-table-column label="自定义SKU" align="center" width="120" prop="clientsku" />
    <u-table-column label="平台" align="center" width="110">
      <template #default="{ row }">
        <div>{{ row.platform }}</div>
        <div v-copy="row.company">{{ row.company }}</div>
      </template>
    </u-table-column>
    <u-table-column label="产品名称" align="center">
      <template #default="{ row }">
        <div style="text-align:left;">
          <el-tooltip v-for="(item, index) in getProductName" :key="index" :content="row[item.key]" placement="top-start" :enterable="false" :disabled="!filterEmpty(row[item.key])">
            <div class="tooltipClass">{{ item.label }}：{{ row[item.key] }}</div>
          </el-tooltip>
        </div>
      </template>
    </u-table-column>
    <u-table-column label="价格/重量" align="center" width="200">
      <template #default="{ row }">
        <div style="text-align:left;">
          <div v-for="(item, index) in getPriceAndWeight" :key="index">
            {{ item.label }}：{{ row[item.key] }}
            <span v-if="filterEmpty(row[item.key])">{{ item.unit }}</span>
          </div>
        </div>
      </template>
    </u-table-column>
    <u-table-column label="供应商信息" align="center" width="110">
      <template #default="{ row }">
        <div style="text-align:left;">
          <div>{{ row.supplierName }}</div>
          <div>{{ row.supplierType }}</div>
          <el-link :href="`https://${row.purchaseLink}`" target="_blank" type="primary">网络采购链接</el-link>
        </div>
      </template>
    </u-table-column>
    <u-table-column label="产品属性" align="center" width="90">
      <template #default="{ row }">
        <div style="text-align:left;">
          <el-tooltip v-for="(item, index) in getProductAttr" :key="index" :content="item.label" placement="top-start" :enterable="false">
            <div>{{ row[item.key] }}</div>
          </el-tooltip>
        </div>
      </template>
    </u-table-column>
    <u-table-column label="操作记录" align="center" width="200">
      <template #default="{ row }">
        <div style="text-align:left;">
          <div>开发人员：{{ row.developName }}</div>
          <div>采购人员：{{ row.purchaseName }}</div>
          <div>负责人员：{{ row.chargeName }}</div>
          <div>添加时间：{{ row.dwdCreateDate }}</div>
        </div>
      </template>
    </u-table-column>
    <!-- <u-table-column label="操作" align="center" width="120">
      <template #default>
        <el-button @click="editorVisible = true" type="text">编辑产品信息</el-button>
      </template>
    </u-table-column> -->

    <CheckResultDialog :visible.sync="checkResult.visible" :result="checkResult.queryResult" append-to-body />
    <EditorDialog :visible.sync="editorVisible" />
  </div>
</template>

<script>
import CheckResultDialog from "../../selectionManagement/components/CheckResultDialog"
import EditorDialog from "./EditorDialog"
import { getCheckResult } from "@/api/selection/productLibrary";
export default {
  name: "ProdInfoTable",
  props: {
    testResultsList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      checkResult: {
        visible: false,
        queryResult: {}
      },
      editorVisible: false
    }
  },
  components: {
    CheckResultDialog,
    EditorDialog
  },
  computed: {
    checkResultDealwith() {
      return function (result) {
        if (result === undefined) return
        return result.split(",").map(resultItem => {
          return this.testResultsList.find(item => resultItem === item.value) || {}
        })
      }
    },
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
    },
    filterEmpty() {
      return (value) => {
        return !(value === null || value === undefined)
      }
    },
    getProductName() {
      return [
        { label: "类目", key: "category" },
        { label: "产品中文名称", key: "prodNameCn" },
        { label: "产品英文名称", key: "prodNameEn" },
      ]
    },
    getProductAttr() {
      return [
        { label: "产品来源", key: "prodSource" },
        { label: "开发类型", key: "developType" },
        { label: "图片来源", key: "imgSource" },
        { label: "产品物流属性", key: "prodLogisticsProp" },
        { label: "产品侵权风险", key: "prodTortRisk" },
      ]
    },
    getPriceAndWeight() {
      return [
        { label: "供货", key: "supplyPrice", unit: "RMB" },
        { label: "报关", key: "declarePrice", unit: "RMB" },
        { label: "净重", key: "netWeight", unit: "g" },
        { label: "毛重", key: "grossWeight", unit: "g" },
        { label: "单个产品包裹重", key: "deliveryWeight", unit: "g" },
      ]
    },
  },
  methods: {
    async resultsDetail(item, id) {
      if (item.value === "0" || item.value === "3") return
      const res = await getCheckResult({ checkType: item.value, id })
      this.checkResult = {
        visible: true,
        queryResult: res.data
      }
    },
  }
}
</script>

<style lang="scss" scoped>
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
