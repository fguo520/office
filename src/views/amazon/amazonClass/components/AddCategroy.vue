<template>
  <el-dialog title="添加类目" :visible.sync="visible" width="400px" :before-close="close" append-to-body>
    <el-form ref="form" label-width="120px" size="mini" :model="listQuery" :rules="rules">
      <el-form-item label="国家" prop="marketplaceid">
        <el-select v-model="listQuery.marketplaceid" placeholder="请选择" filterable @change="()=>{ ++cdnkey; listQuery.parentId='' }">
          <el-option v-for="item in countryList" :key="item.id" :label="item.parameterName" :value="item.parameterValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="上级类目" prop="parentId">
        <el-cascader :props="categoryProps" v-model="listQuery.parentId" :key="cdnkey" :placeholder="listQuery.marketplaceid?'请选择':'请先选择国家'" :show-all-levels="false">
          <template #default="{ data }">
            <el-tooltip class="item" effect="dark" :content="data.productCategoryNameCn" placement="right">
              <span>{{ data.productCategoryNameEn }}</span>
            </el-tooltip>
            <span style="color:red;" v-if="data.isChild && data.ossUrl">(已维护)</span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="产品类目ID" prop="productCategoryId">
        <el-input v-model="listQuery.productCategoryId" style="width:193px;" clearable />
      </el-form-item>
      <el-form-item label="产品类目英文名" prop="productCategoryNameEn">
        <el-input v-model="listQuery.productCategoryNameEn" style="width:193px;" clearable />
      </el-form-item>
      <el-form-item label="产品类目中文名">
        <el-input v-model="listQuery.productCategoryNameCn" style="width:193px;" clearable />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="handleOk" type="primary" size="mini" :loading="commitLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCategoryList, addCategory } from "@/api/amazon/amazonClass"
const defaultRuleForm = {
  marketplaceid: '',
  parentId: [],
  productCategoryId: '',
  productCategoryNameEn: '',
  productCategoryNameCn: '',
}
export default {
  name: "AddCategroy",
  props: {
    visible: {
      tyle: Boolean,
      default: false
    },
    countryList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      commitLoading: false,
      listQuery: Object.assign({}, defaultRuleForm),
      cdnkey: 0,
      categoryProps: {
        lazy: true,
        checkStrictly: true,
        label: 'productCategoryNameCn',
        value: 'id',
        leaf: 'isChild',
        lazyLoad: async (node, resolve) => {
          const { marketplaceid: marketplaceId } = this.listQuery
          if (!marketplaceId) { resolve([]); return }
          const res = await getCategoryList({ marketplaceId, parentCategory: node.data && node.data.productCategoryId })
          resolve(res.data)
        }
      },
      rules: {
        marketplaceid: { required: true, message: '此项必填', trigger: ['change', 'blur'] },
        parentId: { required: true, message: '此项必填', trigger: ['change', 'blur'] },
        productCategoryId: { required: true, message: '此项必填', trigger: ['change', 'blur'] },
        productCategoryNameEn: { required: true, message: '此项必填', trigger: ['change', 'blur'] },
      },
    }
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    async handleOk() {
      const { $refs, listQuery, $message, close } = this;
      let validate;
      $refs.form.validate((valid) => { validate = valid })
      if (!validate) return
      this.commitLoading = true;
      try {
        const res = await addCategory({ ...listQuery, parentId: listQuery.parentId.slice(-1)[0] })
        if (res.code === 200) {
          this.$emit("request")
          close()
          $message.success(res.data)
        }
      } catch (error) { }
      this.commitLoading = false;
    },
    close() {
      setTimeout(() => {
        this.listQuery = Object.assign({}, defaultRuleForm)
        ++this.cdnkey;
        this.$nextTick(() => { this.$refs.form && this.$refs.form.clearValidate() })
      }, 100)
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
