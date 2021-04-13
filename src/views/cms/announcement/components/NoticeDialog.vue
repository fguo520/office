<template>
  <el-dialog title="公告查看" :visible.sync="visible" width="600px" :before-close="close" v-bind="$attrs">
    <div class="rowClass">
      <span class="rowLabel">版本号：</span>
      <div>{{ row.versions }}</div>
    </div>
    <div class="rowClass">
      <span class="rowLabel">公告类型：</span>
      <div>{{ row.type }}</div>
    </div>
    <div class="rowClass">
      <span class="rowLabel">发布时间：</span>
      <div>{{ row.releaseTime }}</div>
    </div>
    <div class="rowClass">
      <span class="rowLabel">公告标题：</span>
      <div style="flex:1;">{{ row.title }}</div>
    </div>
    <div class="rowClass">
      <span class="rowLabel">公告内容：</span>
      <vueScroll style="flex:1;">
        <div v-html="row.content" style="max-height:300px;"></div>
      </vueScroll>
    </div>
    <span slot="footer" class="dialog-footer" v-show="check">
      <el-button @click="close" size="mini">关 闭</el-button>
      <el-button @click="commit" type="primary" size="mini">审核通过</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reviewAnnouncement } from "@/api/cms/announcement"
export default {
  name: "NoticeDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    },
    check: {
      type: Boolean,
      default: false
    },
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
    },
    async commit() {
      try {
        const res = await reviewAnnouncement({
          id: this.row.id,
          reviewStatus: 0
        })
        if (res.code === 200) {
          this.$message.success('审核通过');
          this.$emit('request')
          this.close()
        }
      } catch (error) { }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 5px;
}
.rowClass {
  display: flex;
  margin: 15px 0;

  .rowLabel {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
    font-weight: bold;
    width: 81px;
  }
}
</style>
