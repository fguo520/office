<template>
  <el-dialog :visible.sync="visible" fullscreen :close-on-click-modal="false">
    <el-button size="mini" type="primary" class="closeButton" @click="closeDialog('cancel')">关闭授权页</el-button>
    <div class="content">请在弹出框中授权！</div>
  </el-dialog>
</template>

<script>
let newWindow = {
  window:null,
  timer:null,
  create(url){
    this.window = window.open(url, '', 'width=1200,height=800')
    return this
  },
  close() {
    if(this.window) this.window.close()
    clearTimeout(this.timer)
  },
  onClose(callBack){
    if(!this.window) return;
    this.timer = setTimeout(() => {
      if(this.window.closed) {
        clearTimeout(this.timer)
        this.timer= null;
        callBack();
        return
      };
      this.onClose(callBack)
    },500)
  }
}
import { lzaAuthorizationWs, getAuthRequestUrlRts } from "@/api/common/sysImpower";
export default {
  name: "RtsAuth",
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
      ws: null
    }
  },
  beforeDestroyed() {
    this.closeDialog(false)
  },
  computed: {
    wsIp() {
      return lzaAuthorizationWs(this.id)
    },
    state() {
      return function (state, message) {
        switch (state) {
          case "cancel":
            return { type: '', message: "取消授权" };
          case "success":
            return { type: 'success', message: "授权成功" };
          case "error":
            return { type: 'error', message };
        }
      }
    }
  },
  watch: {
    async visible(newValue) {
      if (newValue) {
        const res = await getAuthRequestUrlRts(this.id)
        newWindow.create(res.data).onClose(() => {this.closeDialog('cancel')})
        const ws = this.ws = new WebSocket(this.wsIp);
        ws.onopen = () => {
          ws.send("主动打开授权页面");
        };
        ws.onmessage = ({ data }) => {
          if (data === "授权成功") this.closeDialog("success", data)
          if (data.includes("授权失败")) this.closeDialog("error", data)
        };
      }
    }
  },
  methods: {
    closeDialog(flag, message) {
      const { ws, state, openWindow } = this;
      if (ws && (ws.readyState == ws.OPEN)) {
        ws.send("授权取消")
        ws.close()
      }
      newWindow.close();
      this.$emit("update:visible", false);
      if (flag) this.$emit('message', this.state(flag, message))
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0;
}

.content{
  height: 88vh;
  line-height: 88vh;
  font-size: 50px;
  width: 100%;
  text-align: center;
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
