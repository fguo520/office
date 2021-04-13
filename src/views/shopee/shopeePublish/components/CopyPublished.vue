<template>
  <el-dialog title="复制刊登" :visible.sync="visible" width="600px" :before-close="close" @open="open">

    <el-form ref="copyPublishedForm" size="mini" label-width="230px" :model="listQuery" :rules="rules">
      <el-form-item label="渠道：" prop="authId">
        <TreeSelect v-model="listQuery.authId" :list="typeList.channelList" placeholder="可多选" :prop="{label:'storeNameAs', value:'id'}" :defaultExpandAll="true" />
      </el-form-item>
      <el-form-item label="水印模板：" prop="watermarkId">
        <el-select v-model="listQuery.watermarkId" placeholder="全部" size="mini" clearable filterable>
          <el-option v-for="(item, index) in typeList.waterMarkList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <el-table ref="tableContainer" style="width: 100%" :data="[row]" border max-height="180px" :header-cell-style="{ 'background-color': '#dadde3' }" :row-key="(row) => row.random">
      <el-table-column label="图片" align="center" width="130">
        <template #default="{ row }">
          <img slot="reference" :src="row.image" />
        </template>
      </el-table-column>
      <el-table-column label="SKU" align="center" width="150">
        <template #default="{ row }">
          <div style="text-align: left">
            <i v-copy="row.sku" class="el-icon-document-copy" />
            <el-link :underline="false" type="primary" @click.native="getSkuInfo(row.sellerSku)">
              {{ row.sku }}
            </el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品中文名称" align="center">
        <template #default="{ row }">
          <div style="text-align: left">
            <div class="tooltipClass" v-copy="row.productNameCN">{{ row.productNameCN }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button type="primary" @click="copyPublishedCommit" size="mini" :loading="commitLoading">确 定</el-button>
    </span>
    <SkuInfoView :id="SkuNum" :visible.sync="SkuDialogVisible" append-to-body />
  </el-dialog>
</template>

<script>
import { getShopeeWatermarkTemplate, getCopyShopeePlatformAuthList, copyShopeeProduct } from "@/api/shopee/shopeePublish";
import { SkuInfoView, ScrollSelect, TreeSelect } from "@/components"
const defaultListQuery = {
  authId: [],
  watermarkId: "",
}
export default {
  name: "CopyPublished",
  components: {
    SkuInfoView,
    TreeSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      typeList: {
        channelList: [],
        waterMarkList: [],
      },
      SkuNum: "",
      SkuDialogVisible: false,
      rules: {
        authId: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      commitLoading: false
    }
  },
  destroyed() {
    this.close()
  },
  methods: {
    open() {
      getCopyShopeePlatformAuthList(this.row).then(res => {
        this.typeList.channelList = [{
          storeNameAs: "全选",
          children: res.data.filter(item => {
            return item
          })
        }]
      })
      getShopeeWatermarkTemplate().then(res => {
        this.typeList.waterMarkList = res.data
      })
    },
    close() {
      const { $emit, $nextTick, $refs } = this
      this.$emit("update:visible", false)
      setTimeout(() => {
        this.listQuery = Object.assign({}, defaultListQuery);
        $nextTick(() => {
          $refs.copyPublishedForm && $refs.copyPublishedForm.clearValidate()
        })
      }, 200)
    },
    getSkuInfo(id) {
      this.SkuDialogVisible = true;
      this.SkuNum = id;
    },
    copyPublishedCommit() {
      const { $refs, row, listQuery, close, $message } = this;
      $refs.copyPublishedForm.validate(async valid => {
        try {
          if (!valid) return;
          this.commitLoading = true
          const res = await copyShopeeProduct({
            ...listQuery,
            taskNo: row.taskNo,
            sku: row.sku
          })
          if (res.code === 200) {
            this.$emit("callback")
            close()
            $message.success(res.message)
          }
        } catch (error) { }
        this.commitLoading = false
      });
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0;
}
</style>
