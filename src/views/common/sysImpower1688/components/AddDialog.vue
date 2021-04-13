<template>
  <el-dialog :title="isElse ? '新增渠道' : '编辑渠道'" :visible.sync="visible" :before-close="close" width="747px" @open="openValue">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <div class="formDialog">
        <div class="formDialog_item">
          <el-form-item label="渠道名称: " prop="platform">
            <el-input v-model="ruleForm.platform" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="渠道别名: " prop="platformAs">
            <el-input v-model="ruleForm.platformAs" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="赛盒映射别名: ">
            <el-input v-model="ruleForm.platformAsSh" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="下单支付宝账号: " prop="alipayAccount">
            <el-input v-model="ruleForm.alipayAccount" clearable size="mini"></el-input>
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="授权人员:" prop="buyPerson">
            <ScrollSelect v-model="ruleForm.buyPerson" :list="typeList.buyPersonList" :prop="{ label: 'nickName', value: 'id' }" placeholder="可多选" />
          </el-form-item>
        </div>
        <div class="formDialog_item">
          <el-form-item label="账号类型: " prop="accountType">
            <el-select v-model="ruleForm.accountType" placeholder="全部" size="mini" clearable class="input-width" filterable>
              <el-option v-for="(item, index) in typeList.accountTypeList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="clear:both"></div>
        <div style="text-align:right">
          <el-form-item label-width="0">
            <el-button @click="close" size="mini">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { ScrollSelect } from "@/components";
import { addLm1688Platform } from "@/api/common/sysImpower1688";
const defaultruleForm = {
  platform: "",
  platformAs: "",
  buyPerson: [],
  accountType: "",
  platformAsSh: "",
  alipayAccount: ""
}
export default {
  name: "AddDialog",
  props: {
    rows: {
      type: Object,
      default: () => { }
    },
    visible: {
      type: Boolean,
      default: false
    },
    isElse: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Object,
      default: () => {
        return {
          buyPersonList: [],
          accountTypeList: []
        }
      }
    }
  },
  components: { ScrollSelect },
  data() {
    return {
      ruleForm: Object.assign({}, defaultruleForm),
      rules: {
        platform: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        platformAs: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        accountType: [{ required: true, message: "此项不能为空", trigger: "change" }],
        buyPerson: [{ required: true, message: "此项不能为空", trigger: "change" }],
        alipayAccount: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      }
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.ruleForm = Object.assign({}, defaultruleForm)
      this.$nextTick(() => {
        if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
      })
    },
    async openValue() {
      if (!this.isElse) {
        this.ruleForm = { ...this.rows }
        this.ruleForm.buyPerson=this.rows.buyPerson.split(",").map(i=>Number(i))
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            addLm1688Platform(this.ruleForm).then(res => {
              this.$message.success(res.message);
              this.close();
              this.$emit("request")
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__body {
  .el-form {
    .formDialog {
      overflow: hidden;
      .formDialog_item {
        width: 330px;
        height: 60px;
        float: left;
        .el-form-item /deep/.el-form-item__content {
          width: 180px;
        }
      }
    }
  }
}
</style>