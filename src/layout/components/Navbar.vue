<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened" />
    <breadcrumb />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <el-tooltip content="历史公告" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect">
            <svg-icon icon-class="gonggao" @click.native="announcement" />
          </div>
        </el-tooltip>

        <el-tooltip content="项目文档" effect="dark" placement="bottom">
          <Doc class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="布局设置" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>
    </div>

    <el-dropdown class="avatar-container">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar" />
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <span @click="passwordVisible = true;" style="display: block">
          <el-dropdown-item divided> 修改密码 </el-dropdown-item>
        </span>
        <span @click="logout" style="display: block">
          <el-dropdown-item divided> 退出 </el-dropdown-item>
        </span>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog title="修改密码" :visible.sync="passwordVisible" :close-on-click-modal="false" v-if="passwordVisible" width="20%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <HistoryAnnouncement :visible.sync="noticeVisible" />
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Doc from "@/components/Doc"; //文档
import Screenfull from "@/components/Screenfull"; //全屏
import SizeSelect from "@/components/SizeSelect"; //布局
// import Search from '@/components/HeaderSearch'
import { updatePassword } from "@/api/login";
import { getCookie } from "@/utils/support";
import HistoryAnnouncement from './HistoryAnnouncement'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Doc,
    HistoryAnnouncement
    // Search
  },
  data() {
    return {
      passwordVisible: false,
      ruleForm: {
        newPassword: "",
        oldPassword: "",
        username: "",
      },
      rules: {
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" }, { min: 3, message: '最低输入3位密码', trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
      },
      noticeVisible: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("LogOut");
      this.$router.push("/login");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.username = getCookie("username")
          updatePassword(this.ruleForm).then((response) => {
            this.passwordVisible = false
            for (let i in this.ruleForm) {
              this.ruleForm[i] = ""
            }
            this.$message.success(response.message)
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    announcement() {
      this.noticeVisible = true
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  overflow: hidden;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    width: 252px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

