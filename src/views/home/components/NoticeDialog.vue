<template>
  <el-dialog :visible.sync="visible" width="600px" :before-close="close" center>
    <template #title>
      <div style="font-weight:bold;font-size:20px;">公告通知</div>
    </template>

    <div class="rowClass">
      <span class="rowLabel">版本号：</span>
      <div>{{ row.versions }}</div>
    </div>
    <div class="rowClass">
      <span class="rowLabel">公告类型：</span>
      <div>{{ getType(row.type) }}</div>
    </div>
    <div class="rowClass">
      <span class="rowLabel">发布时间：</span>
      <div>{{ row.releaseTime }}</div>
    </div>
    <div class="rowClass">
      <span class="rowLabel">公告标题：</span>
      <div v-html="row.title" style="flex:1;"></div>
    </div>
    <div class="rowClass">
      <span class="rowLabel">公告内容：</span>
      <vueScroll style="flex:1;">
        <div v-html="row.content" style="max-height:300px;"></div>
      </vueScroll>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" type="primary" size="mini">知道了</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { readAnnouncement } from "@/api/cms/announcement"
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
  },
  beforeDestroy() {
    //登出跳转路由时会触发close导致报错
    // this.close()
  },
  computed: {
    getType() {
      return (type) => {
        switch (type) {
          case 1:
            return '系统公告'
          case 2:
            return '发版公告'
          case 3:
            return '放假公告'
          default:
            return '未知类型';
        }
      }
    },
  },
  methods: {
    async close() {
      this.$emit("update:visible", false)
      readAnnouncement({ id: this.row.id })
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
