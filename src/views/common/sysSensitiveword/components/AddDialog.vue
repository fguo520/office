<template>
  <el-dialog title="添加" :visible.sync="visible" width="400px" :before-close="close">
    <el-form ref="form" label-width="80px" size="mini" :model="listQuery" :rules="addRules">
      <el-form-item label="平台" prop="platformCode">
        <el-select v-model="listQuery.platformCode" placeholder="全部" clearable filterable>
          <el-option v-for="(item, index) in typeList.platformCodeList" :key="index" :label="item.platformName" :value="item.platformCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="listQuery.type" placeholder="请选择类别">
          <el-option v-for="item in typeList.type" :key="item.value" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-select v-model="listQuery.riskLevel" placeholder="请选择风险等级">
          <el-option v-for="item in typeList.riskLevel" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词" prop="keyWord">
        <el-input type="textarea" v-model="listQuery.keyWord"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="listQuery.remark"></el-input>
      </el-form-item>
      <el-form-item label="规避方法">
        <el-input type="textarea" v-model="listQuery.avoidMethod"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini" :loading="commitLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveSensitiveWord } from "@/api/common/sysSensitiveword"
const defaultListQuery = {
  keyWord: "",
  remark: "",
  riskLevel: "",
  type: "",
  platformCode: "",
  avoidMethod: ""
}
export default {
  name: "AddDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Object,
      default: () => ({
        type: [],
        riskLevel: []
      })
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addRules: {
        platformCode: [{ required: true, message: "此项不能为空", trigger: "change" }],
        type: [{ required: true, message: "此项不能为空", trigger: "change" }],
        riskLevel: [{ required: true, message: "此项不能为空", trigger: "change" }],
        keyWord: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
      commitLoading: false,
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, defaultListQuery)
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
    },
    commit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const res = await saveSensitiveWord(this.listQuery);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功"
          })
          this.close();
          this.$emit("request")
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
