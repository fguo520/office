<template>
  <div class="bg">
    <el-card class="login-form-layout">
      <el-form autocomplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <p class="qqq"></p>
        <div style="text-align: center">
          <!-- <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon> -->
          <img src="@/assets/images/lemontree-logo.png" style="height: 56px" />
        </div>
        <h2 class="login-title color-main">柠檬树之家</h2>
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="loginForm.username" autocomplete="on" size="medium" placeholder="请输入用户名">
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autocomplete="on" size="medium" placeholder="请输入密码">
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix" @click="showPwd">
              <svg-icon icon-class="eye" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: center; margin-bottom: 60px">
          <el-button style="width: 100%" type="primary" size="medium" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="text-btm">
      <p>
        Copyright ©2020 lemontree Corporation, All Rights Reserved
        <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" style="color:blue">粤ICP备20065763号-2</a>
      </p>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { setSupport, getSupport, setCookie, getCookie } from "@/utils/support";
import { callback } from "@/api/login";
import { getCallbackRequestUrl } from "@/api/common/sysImpower"
const url = window.location.href;
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("密码不能小于3位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
      },
      loading: false,
      pwdType: "password",
      dialogVisible: false,
      supportDialogVisible: false,
    };
  },
  created() {
    this.loginForm.username = getCookie("username");
    if (
      this.loginForm.username === undefined ||
      this.loginForm.username == null ||
      this.loginForm.username === ""
    ) {
      this.loginForm.username = "";
    }
    if (
      this.loginForm.password === undefined ||
      this.loginForm.password == null
    ) {
      this.loginForm.password = "";
    }
    this.requestUrl()
  },
  methods: {
    requestUrl() {
      var paramRequest = new Object();
      if (url.indexOf("amazon_callback_uri") != -1) {
        var str = url.substr(31);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          paramRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
        getCallbackRequestUrl({
          amazonCallbackUri: paramRequest['amazon_callback_uri'],
          amazonState: paramRequest['amazon_state'],
        }).then(res => {
          window.open(res.data, "_blank")
        })
      }
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.pwdType = "password";
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              setCookie("username", this.loginForm.username, 15);
              setCookie("password", this.loginForm.password, 15);
              this.$router.push({ path: "/" });

            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("参数验证不合法！");
          return false;
        }
      });
    },
    handleTry() {
      this.dialogVisible = true;
    },
    dialogConfirm() {
      this.dialogVisible = false;
      setSupport(true);
    },
    dialogCancel() {
      this.dialogVisible = false;
      setSupport(false);
    },
  },
};
</script>

<style scoped>
.bg {
  position: fixed;
  display: inline-block;
  background-color: red;
  height: 100%;
  width: 100%;
  background: url("../../assets/images/bgLogin.jpg") fixed no-repeat 100% 100%;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form-layout {
  width: 360px;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: saturate(180%) blur(20px);
  z-index: 1000;
}

.login-title {
  text-align: center;
}

.text-btm {
  width: 100%;
  position: absolute;
  bottom: 0;
  text-align: center;
  color: #fff;
  user-select: none;
}
.helpClass {
  font-size: 13px;
  float: right;
}
</style>
