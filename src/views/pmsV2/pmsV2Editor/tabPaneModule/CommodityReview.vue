<template>
  <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
    <el-form-item label="开发情况：" prop="developStatus">
      <el-radio-group v-model="listQuery.developStatus">
        <el-radio :label="1">未审核</el-radio>
        <el-radio :label="3">审核不通过</el-radio>
        <el-radio :label="2">审核通过</el-radio>
      </el-radio-group>
    </el-form-item><br>
    <el-form-item label="审核拒绝原因：" prop="developRejectReasom">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="listQuery.developRejectReasom" style="width:400px;" maxlength="800" show-word-limit />
    </el-form-item><br>
    <el-form-item label="编辑情况：" prop="editStatus">
      <el-radio-group v-model="listQuery.editStatus">
        <el-radio :label="1">未审核</el-radio>
        <el-radio :label="3">审核不通过</el-radio>
        <el-radio :label="2">审核通过</el-radio>
      </el-radio-group>
    </el-form-item><br>
    <el-form-item label="审核拒绝原因：" prop="editRejectReason">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="listQuery.editRejectReason" style="width:400px;" maxlength="800" show-word-limit />
    </el-form-item><br>

    <el-form-item label="图片处理情况：" prop="imageStatus">
      <el-radio-group v-model="listQuery.imageStatus">
        <el-radio :label="1">未审核</el-radio>
        <el-radio :label="3">审核不通过</el-radio>
        <el-radio :label="2">审核通过</el-radio>
      </el-radio-group>
    </el-form-item><br>
    <el-form-item label="审核拒绝原因：" prop="imageRejectReason">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="listQuery.imageRejectReason" style="width:400px;" maxlength="800" show-word-limit />
    </el-form-item><br>

    <el-form-item label="终审情况：" prop="checkStatus">
      <el-radio-group v-model="listQuery.checkStatus">
        <el-radio :label="1">未审核</el-radio>
        <el-radio :label="3">审核不通过</el-radio>
        <el-radio :label="2">审核通过</el-radio>
      </el-radio-group>
    </el-form-item><br>
    <el-form-item label="审核拒绝原因：" prop="checkRejectReason">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="listQuery.checkRejectReason" style="width:400px;" maxlength="800" show-word-limit />
    </el-form-item><br>

    <div style="text-align:center;margin-bottom:10px;" v-if="!$route.query.readonly">
      <el-button type="primary" size="small" class="elButton" @click="home.commit" :loading="home.commitLoad">保存并继续编辑</el-button>
      <el-button type="primary" size="small" class="elButton" @click="$router.replace({ path:'/pmsV2/pmsV2List', query:{state: listQuery.productState} })">
        关闭页面
      </el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'CommodityReview',
  props: {
    home: null
  },
  data() {
    return {
      listQuery: {},
      rules: {},
    };
  },
  created() {
    this.listQuery = this.home.listQuery
  },
  methods: {
    developStatusChange(value) {
      console.log(value)
    }
  },
};
</script>

<style scoped lang='scss'>
</style>
