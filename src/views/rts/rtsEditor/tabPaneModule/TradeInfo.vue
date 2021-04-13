<template>
  <vueScroll>
    <el-form ref="form" :model="listQuery" label-width="110px" :rules="rules" size="mini">
      <el-form-item label="计量单位：" prop="wholesaleTrade.unitType">
        <el-select v-model="listQuery.wholesaleTrade.unitType" placeholder="请选择" no-data-text="请先到‘产品信息’栏中输入sku" filterable>
          <el-option v-for="item in home.typeList.unitTypeList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="销售方式：" prop="wholesaleTrade.saleType">
        <el-radio v-model="listQuery.wholesaleTrade.saleType" label="normal">按件卖</el-radio>
        <el-radio v-model="listQuery.wholesaleTrade.saleType" label="batch">按批卖</el-radio>
      </el-form-item>

      <transition name="el-fade-in-linear">
        <el-form-item label="1批等于：" v-if="listQuery.wholesaleTrade.saleType === 'batch' " prop="wholesaleTrade.batchNumber">
          <NumberInput v-model="listQuery.wholesaleTrade.batchNumber" min='1' max='99999' float style="width:193px;" /> {{ listQuery.wholesaleTrade.unitType }}
        </el-form-item>
      </transition>

      <el-form-item label="价格设置：" prop="priceType">
        <el-radio v-model="listQuery.priceType" :label="1">根据数量设置价格</el-radio>
        <el-radio v-model="listQuery.priceType" :label="2" v-if="home.addProdSpecsList && Object.keys(home.addProdSpecsList).length !== 0">根据规格设置价格</el-radio>
      </el-form-item>

      <el-form-item label="阶梯价：" prop="bulkDiscountPrices" v-if="listQuery.priceType===1">
        <el-table :data="listQuery.bulkDiscountPrices" style="width: 500px" class="tableSelf" size="mini">
          <el-table-column :label="`最小起订量(${listQuery.wholesaleTrade.unitType})`" align="center">
            <template #default="{ row, $index }">
              <el-form-item :prop="`bulkDiscountPrices.${$index}.startQuantity`" :rules="rules.tableRow">
                ≥
                <NumberInput size="mini" v-model="row.startQuantity" :min="1" :max="99999" style="width:120px;" class="inptTextCenter" @change="(value)=>{getPrice(value, row)}" />
                <!-- @input="checkInput(`bulkDiscountPrices.${$index}.price`)" -->
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column :label="`产品价格(${listQuery.wholesaleTrade.unitType})`" align="center">
            <template #default="{ row, $index }">
              <el-form-item :prop="`bulkDiscountPrices.${$index}.price`" :rules="rules.tableRow" class="hiddenErr">
                <!-- <NumberInput size="mini" v-model="row.price" :min="0" :max="9999999" style="width:120px;" float="2" class="inptTextCenter" @input="checkInput(`bulkDiscountPrices.${$index}.startQuantity`)" /> -->
                <el-input v-model="row.price" disabled style="width:120px;" class="inptTextCenter" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column width="80" align="center">
            <template #default="{ $index }">
              <i class="el-icon-delete" @click="delNumInterval($index)" v-show="listQuery.bulkDiscountPrices.length>1" />
            </template>
          </el-table-column>
        </el-table>

        <el-button type="text" @click="addNumInterval" :disabled="listQuery.bulkDiscountPrices.length>=4">增加数量区间</el-button>
        <span>（可设置不超过 4 个区间）</span>
      </el-form-item>

      <el-table :data="listQuery.skuAttributeDetails" size="mini" border :style="{width: `${tableHeader.length*200 + (listQuery.priceType===1? 451 : 601) }px`, marginBottom:'20px'}" :span-method="objectSpanMethod" v-if="home.addProdSpecsList && Object.keys(home.addProdSpecsList).length !== 0">
        <el-table-column v-for="(item, index) in tableHeader" :key="item" :label="item" align="center" width="200">
          <template #default="{ row }">
            <!-- 前面要做判断字段是否存在，避免动态表头更新顺序导致获取不到属性报错 -->
            {{ row.skuAttrList[index] && row.skuAttrList[index].valueName }}
          </template>
        </el-table-column>

        <el-table-column label='可售数量' align="center" width="150">
          <template #default="{ row }">
            <NumberInput v-model="row.stock" min='1' float style="width:100px;" />
          </template>
        </el-table-column>

        <el-table-column label='价格' align="center" width="150" v-if="listQuery.priceType===2">
          <template #header>
            <span style="color:red;">*</span>&nbsp;价格
          </template>
          <template #default="{ row }">
            <NumberInput v-model="row.price" float style="width:100px;" />
          </template>
        </el-table-column>

        <el-table-column label='商品编码' align="center" width="150">
          <template #default="{ row }">
            <el-input size="mini" style="width:100px;" v-model="row.skuCode" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isUsed" active-text="启用" inactive-text="禁用" :active-value="true" :inactive-value="false" />
            <!-- <el-checkbox v-model="row.isUsed" :true-label="1" :false-label="0" :checked="true">
            {{ row.isUsed ? '启用' : '停用' }}
          </el-checkbox> -->
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="可售数量：" v-if="home.addProdSpecsList && Object.keys(home.addProdSpecsList).length == 0">
        <NumberInput v-model="listQuery.totalStock" min='1' max='99999' float style="width:193px;" />
      </el-form-item>

      <el-form-item label="最小起订量：" prop="wholesaleTrade.minOrderQuantity" v-if="listQuery.priceType===2">
        <NumberInput v-model="listQuery.wholesaleTrade.minOrderQuantity" min='1' max='99999' float style="width:193px;" />
      </el-form-item>

    </el-form>
  </vueScroll>
</template>

<script>
// 笛卡尔积算法
function calcDescartes(array) {
  if (array.length == 0) return [];
  if (array.length < 2) return array[0].map(item => [item]);
  return [].reduce.call(array, function (col, set) {
    var res = [];
    col.forEach(function (c) {
      set.forEach(function (s) {
        var t = [].concat(Array.isArray(c) ? c : [c]);
        t.push(s);
        res.push(t);
      })
    });
    return res;
  });
}
//防抖
const debounce = (function () {
  var timer = null
  return function (fn, wait = 1000) {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(fn, wait);
  }
}())
import { NumberInput } from "@/components"
import { calcPrice } from "@/api/rts/rtsEditor"
export default {
  name: 'TradeInfo',
  components: {
    NumberInput
  },
  props: {
    home: null
  },
  data() {
    const tableRowRules = [{
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { bulkDiscountPrices } = this.listQuery
        const { startQuantity, price } = bulkDiscountPrices[index]

        if (value === '') {
          return cb(new Error("值不能为空"));
        }
        // if ((startQuantity != "" && price === "") || (startQuantity == "" && price != "")) {
        //   return cb(new Error("请完整输入表单中的每一列"));
        // }
        if (index != 0 && propSplit[2] === 'startQuantity' && Number(value) <= bulkDiscountPrices[index - 1].startQuantity) {
          return cb(new Error("发货数量须是由小到大"));
        }

        cb();
      },
      trigger: ["blur", "change"],
    }]
    return {
      listQuery: {},
      rules: {
        'wholesaleTrade.unitType': [{ required: true, message: "此项不能为空", trigger: "change" }],
        'wholesaleTrade.batchNumber': [{ required: true, message: "此项不能为空", trigger: "blur" }],
        'wholesaleTrade.minOrderQuantity': [{ required: true, message: "此项不能为空", trigger: "blur" }],
        priceType: [{ required: true, message: "此项不能为空", trigger: "change" }],
        tableRow: tableRowRules
      },
      tableHeader: [],
    };
  },
  created() {
    this.listQuery = this.home.listQuery
  },
  watch: {
    'home.addProdSpecsList': {
      handler(newValue, oldValue) {
        if (oldValue == null) {
          this.generateTable(true)
          return
        }
        debounce(this.generateTable)
      },
      deep: true
    }
  },
  methods: {
    addNumInterval() {
      const { bulkDiscountPrices } = this.listQuery;
      if (bulkDiscountPrices.length >= 4) return;
      bulkDiscountPrices.push({ startQuantity: "", price: "" })
    },
    delNumInterval(index) {
      const { bulkDiscountPrices } = this.listQuery;
      bulkDiscountPrices.splice(index, 1)
    },
    async getPrice(saleCount, row) {
      const { listQuery: { sku } } = this;
      if (!sku) return;
      const res = await calcPrice({ saleCount, sku })
      row.price = res.data
    },
    checkInput(prop) {
      const propSplit = prop.split(".")
      const index = Number(propSplit[1])
      this.$refs.form.validateField(prop)
      //最小订单量 startQuantity 需要阶梯排序， 所以当输入产品价格 price 后需要再此校验 startQuantity 排序
      if (propSplit[2] === 'price') {
        this.$refs.form.validateField(`${propSplit[0]}.${index - 1}.startQuantity`)
        this.$refs.form.validateField(`${propSplit[0]}.${index + 1}.startQuantity`)
      }
    },
    async generateTable(initial) {
      const { addProdSpecsList, listQuery: { sku } } = this.home
      const renderTable = addProdSpecsList.filter(item => item.valueName.length != 0)
      this.tableHeader = renderTable.map(item => item.attributeNameCn)
      if (initial) return;
      const formatList = renderTable.map(item => {
        return item.valueName.map((value, index) => ({
          attributeId: item.attributeId,
          attributeName: item.attributeNameEn,
          valueId: item.valueId[index] || '',
          valueName: value,
        }))
      })
      const res = await calcPrice({ saleCount: 1, sku })
      this.$set(this.listQuery, 'skuAttributeDetails', calcDescartes(formatList).map(skuAttrList => ({
        isUsed: true,
        price: res.data,
        skuAttrList,
        skuCode: '',
        stock: 1000
      })))
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex + 1 > this.tableHeader.length) return;
      const { addProdSpecsList } = this.home
      const optionsValue = addProdSpecsList.filter(item => item.valueName.length != 0).map(item => item.valueName)
      const getRowNum = optionsValue.slice(columnIndex + 1).reduce((mul, item) => mul * item.length, 1)
      return rowIndex % getRowNum === 0 ? { rowspan: getRowNum, colspan: 1 } : { rowspan: 0, colspan: 0 };
    },
    validate() {
      let callBackValid;
      this.$refs.form.validate((valid) => { callBackValid = valid })
      return callBackValid
    }
  },
};
</script>

<style scoped lang='scss'>
.inptTextCenter {
  /deep/ .el-input__inner {
    text-align: center;
  }
}
.tableSelf {
  /deep/ .el-table__row {
    > td:first-of-type,
    > td:nth-of-type(2) {
      padding-bottom: 0 !important;

      .el-form-item__error {
        width: 100% !important;
      }
    }
  }
}
</style>
