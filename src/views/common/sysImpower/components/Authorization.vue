<template>
  <el-dialog :visible.sync="visible" fullscreen :close-on-click-modal="false">
    <el-button size="mini" type="primary" class="closeButton" @click="closeDialog('cancel')">关闭授权页</el-button>
    <iframe :src="src" scrolling="no" frameborder="0" width="100%" class="iframe" ref="iframe"/>
  </el-dialog>
</template>

<script>
import { lzaAuthorizationWs, callBackUrl } from "@/api/common/sysImpower";
export default {
  name: "Authorization",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [Number, String],
      default: ""
    }
  },
  data() {
    return {
      notify: null,
      ws: null,
    }
  },
  destroyed() {
    this.closeDialog(false)
  },
  computed: {
    src() {
      return callBackUrl({
        id:this.id,
        operateName: this.$store.getters.name
      })
    },
    wsIp() {
      return lzaAuthorizationWs(this.id)
    },
    state() {
      return function (state) {
        switch (state) {
          case "cancel":
            return { type: '', message: "取消授权" };
          case "success":
            return { type: 'success', message: "授权成功" };
          case "error":
            return { type: 'error', message: "授权失败" };
        }
      }
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        const ws = this.ws = new WebSocket(this.wsIp);
        ws.onopen = () => {
          ws.send("主动打开授权页面");
        };
        ws.onmessage = ({ data }) => {
          if (data === "授权成功") this.closeDialog("success")
          if (data === "授权失败") this.closeDialog("error")
        };
        this.notify = this.$notify({
          title: '须知 | Notice',
          dangerouslyUseHTMLString: true,
          message: "‘<strong>国家</strong>’选项必须选择‘<strong>跨境卖家</strong>’<br> The'<strong>Country</strong>'option must be'<strong>Crossborder</strong>'",
          duration: 0,
          offset: 280,
          customClass: "AuthorizationNotify"
        });
      }
    }
  },
  methods: {
    closeDialog(flag) {
      const { notify, ws, state } = this;
      if (notify) notify.close()
      if (ws && (ws.readyState == ws.OPEN)) {
        ws.send("授权取消")
        ws.close()
      }
      this.$emit("update:visible", false);
      if (flag) this.$emit('message', this.state(flag))
    },
  },
}
</script>

<style lang="scss" scoped>
.iframe {
  height: 88vh;
  border: none;
}
/deep/ .el-dialog__body {
  padding: 0;
}
/deep/ .el-dialog__headerbtn {
  display: none;
}

/deep/ .closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
<style>
.AuthorizationNotify {
  z-index: 100000 !important;
}
</style>
