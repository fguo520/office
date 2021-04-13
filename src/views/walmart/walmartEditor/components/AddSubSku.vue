<template>
  <el-dialog title="添加子SKU" :visible.sync="visible" width="300px" :before-close="close">
    <el-form :inline="true" size="mini">
      <el-form-item label="sku：">
        <el-input v-model="sku" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取消</el-button>
      <el-button type="primary" size="mini" @click="commit" :loading="commitLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getLmShApiProductInfoList } from "@/api/walmart/walmartEditor"
export default {
  name: "AddSubSku",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    listQuery: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      sku: "",
      commitLoading: false
    }
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.sku=""
    },
    async commit() {
      const { listQuery, sku } = this
      this.commitLoading = true;
      try {
        const res = await getLmShApiProductInfoList({ ...listQuery, sku })
        this.$emit("addSubSku", res.data)
        this.close()
      } catch (error) { }
      this.commitLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
