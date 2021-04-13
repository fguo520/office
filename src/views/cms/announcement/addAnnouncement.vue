<template>
  <el-card>
    <el-form ref="form" :model="listQuery" label-width="150px" inline :rules="rules" size="mini">
      <el-divider content-position="left">新增公告</el-divider>
      <el-form-item label="版本号：">
        <el-input v-model="listQuery.versions" style="width:193px;" placeholder="格式 v--.--.--" />
      </el-form-item><br>
      <el-form-item label="公告类型：">
        <el-select v-model="listQuery.type" placeholder="请选择">
          <el-option v-for="item in typeList.editionList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item><br>
      <el-form-item label="发布时间：">
        <el-date-picker v-model="listQuery.releaseTime" type="datetime" placeholder="选择日期时间" style="width:193px;" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" />
      </el-form-item><br>

      <el-form-item prop="title" label="公告标题：">
        <el-input type="textarea" :rows="5" v-model="listQuery.title" style="width:400px;" placeholder="请输入" maxlength="500" show-word-limit />
      </el-form-item><br />

      <el-form-item prop="content" label="公告内容：" class="specialFormItem">
        <Tinymce :height="500" v-model="listQuery.content" :resetContent.sync="tinymceReset" :editorImage="false" />
      </el-form-item><br />

      <el-divider />
      <div style="text-align: center; margin-bottom: 150px">
        <el-button @click="close">关闭页面</el-button>
        <el-button type="primary" @click="onSubmit()">提交</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import { saveAnnouncement } from "@/api/cms/announcement"
import Tinymce from "@/components/Tinymce"
import { formatDate } from "@/utils/date"
export default {
  name: "addAnnouncement",
  components: {
    Tinymce
  },
  data() {
    return {
      listQuery: {
        versions: '',
        type: '',
        releaseTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        title: '',
        content: ''
      },
      rules: {},
      tinymceReset: true,
      typeList: {
        editionList: [
          { label: '系统公告', value: 1 },
          { label: '发版公告', value: 2 },
          { label: '放假公告', value: 3 },
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000;
        }
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      const noticeInfo = this.$store.state.announcement.editNoticeInfo
      this.listQuery = {
        versions: noticeInfo.versions,
        type: noticeInfo.type,
        releaseTime: noticeInfo.releaseTime,
        title: noticeInfo.title,
        content: noticeInfo.content
      }
    }
  },
  computed: {
  },
  methods: {
    close() {
      this.$router.replace('/cms/announcement')
    },
    async onSubmit() {
      const res = await saveAnnouncement({ ...this.listQuery, id: this.$route.query.id })
      if (res.code === 200) {
        this.$message.success(res.data)
        this.$router.replace('/cms/announcement')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.specialFormItem {
  display: flex;
  /deep/ .el-form-item__content {
    flex: 1;
  }
}
</style>
