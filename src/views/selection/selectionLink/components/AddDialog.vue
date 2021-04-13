<template>
  <el-dialog title="添加链接" :visible.sync="visible" width="400px" :before-close="close">
    <el-form ref="form" label-width="100px" size="mini" :model="listQuery" :rules="addRules">
      <el-form-item label="公司名称:" prop="companyName">
        <el-input clearable v-model="listQuery.companyName" size="mini" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="平台:" prop="platform">
        <el-select v-model="listQuery.platform" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:200px">
          <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="URL来源:" prop="urlSource">
        <el-select v-model="listQuery.urlSource" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:200px">
          <el-option label="店铺" value="店铺" />
          <el-option label="单品" value="单品" />
        </el-select>
      </el-form-item>
      <el-form-item label="URL:" prop="url">
        <el-input type="textarea" v-model="listQuery.url"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { add } from "@/api/selection/selectionLink"
const defaultListQuery = {
  companyName: "",
  platform: "",
  urlSource:"",
  url: "",
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
        platformList: [],
      })
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addRules: {
        companyName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        platform: [{ required: true, message: "此项不能为空", trigger: "change" }],
        urlSource: [{ required: true, message: "此项不能为空", trigger: "change" }],
        url: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      }
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
   async commit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const res = await add(this.listQuery);
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
