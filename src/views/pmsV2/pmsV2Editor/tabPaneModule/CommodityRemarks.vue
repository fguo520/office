<template>
  <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
    <el-form-item label="是否预售：" prop="isPersell">
      <el-checkbox v-model="listQuery.isPersell" :true-label="1" :false-label="0">预售产品</el-checkbox>
    </el-form-item><br>
    <el-form-item label="预售到货日期：" prop="persellArrivalDate">
      <el-date-picker style="width: 350px;" v-model="listQuery.persellArrivalDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" />
    </el-form-item><br>
    <el-form-item label="出售时间：">
      <el-date-picker v-model="createTimeAndEndTime" type="daterange" size="mini" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
    </el-form-item><br>
    <el-form-item label="开发备注说明：" prop="toDevelopMemo">
      <el-input v-model="listQuery.toDevelopMemo" style="width:800px;" maxlength="400" show-word-limit />
    </el-form-item><br>
    <el-form-item label="商品包装清单：" prop="packingList">
      <el-input type="textarea" rows="4" v-model="listQuery.packingListDesc" maxlength="500" show-word-limit style="width:800px;" />
    </el-form-item><br>
    <el-form-item label="采购收货备注说明：" prop="receiptRemark">
      <el-input type="textarea" rows="4" v-model="listQuery.receiptRemark" style="width:800px;" maxlength="400" show-word-limit />
    </el-form-item><br>
    <el-form-item label="商品状态打包：" prop="needToPackType">
      <el-radio-group v-model="listQuery.needToPackType">
        <el-radio label="1">不需打包</el-radio>
        <el-radio label="2">需自行打包</el-radio>
        <el-radio label="4">需供应商打包</el-radio>
      </el-radio-group>
    </el-form-item><br>
    <el-form-item label="上传附件：" prop="upAttachmentUrl">
      <el-upload action="#" :auto-upload="false" :file-list="fileList" :on-change="handleChange" ref="uploadFile" :on-remove="removeFile">
        <!-- :before-remove="brforeRemove" -->
        <el-button size="small" type="primary" :loading="updateLoading">点击上传</el-button>
        <el-button size="small" type="primary" @click.stop="downloadFile" v-if="listQuery.upAttachmentUrl">下载文件</el-button>
      </el-upload>
    </el-form-item><br>
    <el-form-item label="编辑备注：" prop="toEditorMemo">
      <Tinymce :height="500" :width="800" v-model="listQuery.toEditorMemo" :resetContent.sync="tinymceReset" :plugins="[]" :editorImage="false" limit="800" showLimit limitReset limitHtml />
    </el-form-item><br>
    <el-form-item label="质检备注：" prop="toProcurementCheckMemo">
      <Tinymce :height="500" :width="800" v-model="listQuery.toProcurementCheckMemo" :resetContent.sync="tinymceReset" :plugins="[]" :editorImage="false" limit="800" showLimit limitReset limitHtml />
    </el-form-item><br>
    <el-form-item label="图片处理备注：" prop="imageMemo">
      <Tinymce :height="500" :width="800" v-model="listQuery.imageMemo" :resetContent.sync="tinymceReset" :plugins="[]" :editorImage="false" limit="800" showLimit limitReset limitHtml />
    </el-form-item><br>
    <el-form-item label="发货打包备注：" prop="toDeliveryPackNoteMemo">
      <Tinymce :height="500" :width="800" v-model="listQuery.toDeliveryPackNoteMemo" :resetContent.sync="tinymceReset" :plugins="[]" :editorImage="false" limit="800" showLimit limitReset limitHtml />
    </el-form-item><br>

    <div style="text-align:center;margin:30px 0;" v-if="!$route.query.readonly">
      <el-button type="primary" size="small" class="elButton" @click="home.commit" :loading="home.commitLoad">保存并继续编辑</el-button>
      <el-button type="primary" size="small" class="elButton" @click="$router.replace({ path:'/pmsV2/pmsV2List', query:{state: listQuery.productState} })">
        关闭页面
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { uploadFile, deleteOssFile } from '@/api/pmsV2/pmsV2Editor'
import { Tinymce } from "@/components"
export default {
  name: 'CommodityRemarks',
  components: {
    Tinymce
  },
  props: {
    home: null
  },
  data() {
    return {
      listQuery: {},
      createTimeAndEndTime: null,
      tinymceReset: true,
      rules: {},
      updateLoading: false
    };
  },
  created() {
    this.listQuery = this.home.listQuery;
  },
  computed: {
    fileList() {
      const { upAttachmentUrl } = this.listQuery;
      return upAttachmentUrl ? [{ url: upAttachmentUrl, name: upAttachmentUrl.split('/').slice(-1)[0] }] : []
    }
  },
  watch: {
    createTimeAndEndTime: function (newValue) {
      const timeArr = newValue === null ? ['', ''] : newValue;
      this.listQuery.persellSdate = timeArr[0];
      this.listQuery.pesellEdate = timeArr[1];
    },
  },
  methods: {
    async handleChange(file) {
      this.updateLoading = true
      try {
        this.$refs.uploadFile.handleRemove(file)
        if (file.size / 1024 / 1024 >= 10) {
          this.$message.warning("上传的文件需小于10MB")
          throw new Error()
        }
        const formData = new FormData()
        formData.append('file', file.raw)
        const res = await uploadFile(formData)
        this.$message.success('上传成功')
        this.listQuery.upAttachmentUrl = res.data
      } catch (error) { }
      this.updateLoading = false
    },
    // brforeRemove() {
    //   if (this.listQuery.upAttachmentUrl === '') return true
    //   return this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', { type: 'warning' })
    // },
    async removeFile(file) {
      // if (this.listQuery.upAttachmentUrl === '') return
      // const res = await deleteOssFile({
      //   ossUrl: this.listQuery.upAttachmentUrl,
      //   type: 2,
      //   id: this.$route.query.id || ''
      // })
      // this.$message.success(res.data)
      this.listQuery.upAttachmentUrl = ''
    },
    downloadFile() {
      window.open(this.listQuery.upAttachmentUrl, '_self')
    },
  },
};
</script>

<style scoped lang='scss'>
</style>
