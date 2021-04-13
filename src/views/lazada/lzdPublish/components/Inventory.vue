<template>
  <el-popover placement="top" width="300" trigger="manual" v-model="inventoryPopover">
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="15" style="text-align:center;">
        合计：
        <el-input size="mini" style="width:65%;" v-model.number="quantity" @change="change" />
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom:5px;" v-for="item in size" :key="item">
      <el-col :span="8" style="line-height:28px;">{{ getCountriesCN(item) }}</el-col>
      <el-col :span="10">
        <el-input size="mini" readonly :value="getAverage(item)"></el-input>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom:5px; margin-top:10px;">
      <el-col :span="8" style="text-align:center;">
        <el-button plain size="mini" @click="openClose">关闭</el-button>
      </el-col>
      <el-col :span="16" style="text-align:center;">
        <el-button size="mini" type="primary" style="width:150px;" @click="submit">批量填充</el-button>
      </el-col>
    </el-row>

    <div slot="reference" @click="openClose" style="cursor:pointer;">{{ row.quantity }}</div>
  </el-popover>
</template>

<script>
import { getLmLazadaApiProductDetailNum } from "@/api/lazada/lzdPublishEditor"

export default {
  name: "Inventory",
  props: {
    row: {
      type: Object,
      default: () => { return {} }
    },
    size: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      inventoryPopover: false,
      quantity: "",
      averageList: []
    }
  },
  created() {
    this.quantity = this.row.quantity;
    this.submit()
  },
  computed: {
    getCountriesCN() {
      return function (name) {
        switch (name) {
          case "SG":
            return "新加坡"
          case "TH":
            return "泰国"
          case "VN":
            return "越南"
          case "PH":
            return "菲律宾"
          case "ID":
            return "印度尼西亚"
          case "MY":
            return "马来西亚"
          default:
            return "";
        }
      }
    },
    getAverage() {
      return function (name) {
        const item = this.averageList.find(item => {
          return name == item.publishedTo
        }) || { num: "" }
        return item.num
      }
    }
  },
  methods: {
    change(value) {
      if (isNaN(Number(this.quantity)) || this.quantity === "") this.quantity = 0;
      this.quantity = Math.abs(this.quantity)
    },
    openClose() {
      this.inventoryPopover = !this.inventoryPopover
    },
    async submit() {
      try {
        const params = {
          publishedTo: this.size.join(","),
          quantity: this.quantity,
          sellerSku: this.row.sellerSku
        }
        const res = await getLmLazadaApiProductDetailNum(params)
        this.averageList = res.data.nums
        this.row.quantity = this.quantity
        this.$emit("update:row", this.row)
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>