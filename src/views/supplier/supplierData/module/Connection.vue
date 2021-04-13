<template>
  <vueScroll>
    <el-form ref="form" :model="listQuery" label-width="100px" inline size="mini" :disabled="this.check" :rules="rules">
      <el-form-item label="总经理姓名:">
        <el-input v-model.trim="listQuery.managerName" clearable class="input-width" />
      </el-form-item>
      <el-form-item label="总经理电话:">
        <el-input v-model.trim="listQuery.managerPhone" clearable class="input-width" />
      </el-form-item><br>
      <el-form-item label="法人代表:">
        <el-input v-model.trim="listQuery.legalRepresentative" clearable class="input-width" />
      </el-form-item>
      <el-form-item label="税务登记号:">
        <el-input v-model.trim="listQuery.taxNumber" clearable class="input-width" />
      </el-form-item><br>
      <el-form-item label="退货地址:">
        <el-input v-model="listQuery.returnAddress" maxlength="100" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="供应商地址:">
        <el-input v-model="listQuery.supplierAddress" maxlength="100" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item prop="contactInfos">
        <el-table style="width: 100%" :data="listQuery.contactInfos" border max-height="340px" :header-cell-style="{ 'background-color': 'rgb(218, 221, 227)' }">
          <el-table-column width="170" align="center">
            <template #header>
              <div style="color:black"><span style="color:#D9001B">联系人名称</span></div>
            </template>
            <template #default="{ row,$index }">
              <el-form-item label="" :prop="`contactInfos.${$index}.contactName`" :rules="rules.tableRow1">
                <el-input v-model="row.contactName" placeholder="请输入" size="mini" maxlength="20"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="170" align="center">
            <template #header>
              <div style="color:black"><span style="color:#D9001B">职位</span></div>
            </template>
            <template #default="{ row,$index }">
              <el-form-item label="" :prop="`contactInfos.${$index}.job`" :rules="rules.tableRow2">
                <el-input v-model="row.job" placeholder="请输入" size="mini" maxlength="20"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="180" align="center">
            <template #header>
              <div style="color:black"><span style="color:#D9001B">
                  <el-tooltip content="手机号码和电话为二选一填" placement="top" effect="light">
                    <i class="el-icon-question" style="color:green"></i>
                  </el-tooltip> 手机 / 电话 /
                </span><span>邮箱</span></div>
            </template>
            <template #default="{ row ,$index}">
              <el-form-item label="" :prop="`contactInfos.${$index}.mobile`" :rules="rules.tableRow3">
                <el-input v-model="row.mobile" placeholder="请输入手机号" size="mini" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="" :prop="`contactInfos.${$index}.phone`" :rules="rules.tableRow3">
                <el-input v-model="row.phone" placeholder="请输入电话" size="mini" maxlength="20"></el-input>
              </el-form-item>
              <el-input v-model="row.email" placeholder="请输入邮箱" size="mini" maxlength="64"></el-input>
            </template>
          </el-table-column>
          <el-table-column width="180" align="center">
            <template #header>
              <div style="color:black"><span>QQ / 微信 / </span><span>旺旺ID</span></div>
            </template>
            <template #default="{ row }">
              <el-input v-model="row.qq" placeholder="请输入QQ" size="mini" maxlength="20"></el-input>
              <el-input v-model="row.wx" placeholder="请输入微信" size="mini" maxlength="20"></el-input>
              <el-input v-model="row.wwId" placeholder="请输入旺旺" size="mini" maxlength="64"></el-input>
            </template>
          </el-table-column>
          <el-table-column width="120" align="center">
            <template #header>
              <div style="color:black"><span>默认联系人</span></div>
            </template>
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isDefault" @change="isDefaultChange(scope.row,scope.$index)">
                <el-radio :label="true">是</el-radio>
                <div style="margin-top:10px"></div>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column width="133" align="center">
            <template #header>
              <div style="color:black"><span>操作</span></div>
            </template>
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="add">添加</el-button>
              <el-button size="mini" type="text" @click="remove(scope.row,scope.$index)" v-show="scope.$index!==0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div style="text-align:center; position: absolute; bottom:0px; width: 100%;">
      <el-button @click="home.close">取消</el-button>
      <el-button @click="home.submit" type="primary" :loading="home.submitLoading" v-if="!this.check">保存</el-button>
    </div>
  </vueScroll>
</template>
<script>
import { NumberInput } from '@/components'
export default {
  name: "Connection",
  props: {
    home: null,
    check: {
      type: Boolean,
      default: false
    }
  },
  components: { NumberInput },
  data() {
    const tableRowRules = [{
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { contactInfos } = this.listQuery
        const { contactName } = contactInfos[index]
        if (!contactName) {
          return cb(new Error("此项为必填项"));
        }
        cb();
      },
      trigger: ['change', 'blur'],
    },
    {
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { contactInfos } = this.listQuery
        const { job } = contactInfos[index]
        if (!job) {
          return cb(new Error("此项为必填项"));
        }
        cb();
      },
      trigger: ['change', 'blur'],
    }, {
      required: true,
      validator: (rules, value, cb) => {
        const propSplit = rules.field.split(".");
        const index = Number(propSplit[1])
        const { contactInfos } = this.listQuery
        const { mobile, phone } = contactInfos[index]
        if (mobile || phone) {
          cb();
        } else {
          return cb(new Error("此项为必填项"));
        }
      },
      trigger: ['change', 'blur'],
    }]
    return {
      listQuery: {},
      typeList: {},
      rules: {
        tableRow1: tableRowRules[0],
        tableRow2: tableRowRules[1],
        tableRow3: tableRowRules[2],
      }
    }
  },
  created() {
    this.listQuery = this.home.listQuery
    this.typeList = this.home.list
  },
  watch: {
    'listQuery.contactInfos': function (newValue) {
      if (newValue.length == 1) {
        newValue[0].isDefault = true
      }
    }
  },
  methods: {
    add() {
      if (this.listQuery.contactInfos.length > 9) return this.$message.warning("最多10条信息")
      this.listQuery.contactInfos.push({ contactName: "", job: "", mobile: "", phone: "", email: "", qq: "", wx: "", wwId: "", isDefault: false, })
    },
    remove(row, index) {
      if (row.isDefault) {
        this.listQuery.contactInfos[0].isDefault = true
      }
      this.listQuery.contactInfos.splice(index, 1)
    },
    isDefaultChange(row, index) {
      if (this.listQuery.contactInfos.findIndex(i => { return i.isDefault == true }) == -1) {
        this.listQuery.contactInfos[index].isDefault = true
        this.$message.warning("请至少选择一个默认联系人")
      }
      if (!row.isDefault) return
      for (let i in this.listQuery.contactInfos) {
        this.listQuery.contactInfos[i].isDefault = false
        this.listQuery.contactInfos[index].isDefault = true
      }
    },
    validate() {
      let callBackValid;
      this.$refs.form.validate((valid) => { callBackValid = valid })
      return callBackValid
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/ .inputLegth {
  width: 742px;
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}
.el-radio {
  margin-right: 10px;
}
</style>