<template>
  <el-dialog title="新增热搜词" :visible.sync="visible" width="450px" :before-close="close">
    <el-form ref="form" label-width="80px" size="mini" :model="listQuery" :rules="addRules">
      <el-form-item label="热搜词" prop="name">
        <el-input clearable v-model="listQuery.name" size="mini" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="绑定类目" prop="categoryArray">
        <el-cascader v-model="listQuery.categoryArray" size="mini" :options="categoryArrayList" style="width:300px" :props="{
                label: 'categoryNameCn',
                value: 'categoryId',
              }" clearable/>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addHotSearch, getRtsApiCategoryNode } from "@/api/rts/rtsTopsearch"
const defaultListQuery = {
  categoryArray: [],
  name: "",
  categoryId: ""
}
export default {
  name: "AddDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addRules: {
        name: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        categoryArray: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      categoryArrayList: [],
    }
  },
  beforeDestroy() {
    this.close()
  },
  created() {
    this.getType()
  },
  methods: {
    async getType() {
      const res =await getRtsApiCategoryNode()
      this.categoryArrayList = this.getTreeData(res.data)
    },
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children) break;
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
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
        const categoryId = this.listQuery.categoryArray.slice(-1)[0];
        const categoryArray= this.listQuery.categoryArray.join(",")
        const res = await addHotSearch({ ...this.listQuery, categoryId,categoryArray });
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
