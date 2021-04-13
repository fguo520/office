<template>
  <vueScroll>
    <el-form ref="form" :model="listQuery" label-width="120px" size="mini" :rules="rules">
      <el-form-item prop="packageLength" label="包装尺寸：">
        <NumberInput size="mini" v-model="listQuery.packageLength" placeholder="长(cm)" style="width:80px;" float='2' class="inptTextCenter" /> *
        <NumberInput size="mini" v-model="listQuery.packageWidth" placeholder="宽(cm)" style="width:80px;" float='2' class="inptTextCenter" /> *
        <NumberInput size="mini" v-model="listQuery.packageHeight" placeholder="高(cm)" style="width:80px;" float='2' class="inptTextCenter" />
      </el-form-item>

      <el-form-item prop="wholesaleTrade.weight" label="每件商品毛重：" :rules="rules.weight">
        <NumberInput size="mini" v-model="listQuery.wholesaleTrade.weight" style="width:120px;" float="3" class="inptTextCenter" /> kg
      </el-form-item>

      <el-form-item prop="deliverPeriods" label="发货期：">
        <el-table :data="listQuery.deliverPeriods" style="width: 500px" class="tableSelf">
          <el-table-column label="数量" align="center">
            <template #default="{ row, $index }">
              <el-form-item :prop="`deliverPeriods.${$index}.quantity`" :rules="rules.tableRow">
                ≤
                <NumberInput size="mini" v-model="row.quantity" style="width:120px;" class="inptTextCenter" @input="checkInput(`deliverPeriods.${$index}.processPeriod`)" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="预计时间" align="center">
            <template #default="{ row, $index }">
              <el-form-item :prop="`deliverPeriods.${$index}.processPeriod`" :rules="rules.tableRow" class="hiddenErr">
                <NumberInput size="mini" v-model="row.processPeriod" style="width:120px;" class="inptTextCenter" @input="checkInput(`deliverPeriods.${$index}.quantity`)" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column width="80" align="center">
            <template #default="{ $index }">
              <i class="el-icon-delete" @click="delNumInterval($index)" v-show="listQuery.deliverPeriods.length>1" />
            </template>
          </el-table-column>
        </el-table>

        <el-button type="text" @click="addNumInterval" :disabled="listQuery.deliverPeriods.length>=3">增加数量区间</el-button>
        <span>（可设置不超过 3 个区间）</span>
      </el-form-item>

      <el-form-item label="运费模板：" prop="wholesaleTrade.shippingLineTemplateId" :rules="rules.shippingLineTemplateId">
        <el-select v-model="listQuery.wholesaleTrade.shippingLineTemplateId" :placeholder="listQuery.authId?'请选择':'请在‘产品信息’栏选择渠道'">
          <el-option v-for="item in home.typeList.shippingList" :key="item.logisticId" :label="item.logisticName" :value="item.logisticId" />
        </el-select>
      </el-form-item>

    </el-form>

  </vueScroll>
</template>

<script>
import { NumberInput } from "@/components"
export default {
  name: 'LogisticsInfo',
  components: {
    NumberInput
  },
  props: {
    home: null
  },
  created() {
    this.listQuery = this.home.listQuery
  },
  data() {
    const packageLengthRules = [{
      required: true,
      validator: (rules, value, cb) => {
        let { packageWidth, packageHeight } = this.listQuery;
        if (!packageWidth || !packageHeight || !value) {
          return cb(new Error("请输入完整的商品尺寸"));
        }
        cb();
      },
      trigger: "blur",
    }];
    const tableRowRules = [{
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { deliverPeriods } = this.listQuery
        const { quantity, processPeriod } = deliverPeriods[index]

        if ((quantity != "" && processPeriod === "") || (quantity == "" && processPeriod != "")) {
          return cb(new Error("请完整输入表单中的每一行"));
        }
        if (index != 0 && propSplit[2] === 'quantity' && value !== '' && value <= deliverPeriods[index - 1].quantity) {
          return cb(new Error("发货数量须是由小到大"));
        }
        cb();
      },
      trigger: "blur",
    }]
    return {
      listQuery: {},
      rules: {
        packageLength: packageLengthRules,
        weight: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        shippingLineTemplateId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        tableRow: tableRowRules
      },
    };
  },
  methods: {
    addNumInterval() {
      const { deliverPeriods } = this.listQuery;
      if (deliverPeriods.length >= 3) return;
      deliverPeriods.push({ quantity: "", processPeriod: "" })
    },
    delNumInterval(index) {
      const { deliverPeriods } = this.listQuery;
      deliverPeriods.splice(index, 1)
    },
    checkInput(prop) {
      try {
        const propSplit = prop.split(".")
        const index = Number(propSplit[1])
        this.$refs.form.validateField(prop)
        if (propSplit[2] === 'processPeriod') {
          this.$refs.form.validateField(`${propSplit[0]}.${index - 1}.quantity`)
          this.$refs.form.validateField(`${propSplit[0]}.${index + 1}.quantity`)
        }
      } catch (error) { }
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
