<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="menu" :rules="rules[menu.type]" ref="menuFrom" label-width="150px" size="mini">
      <el-form-item label="类型：">
        <el-radio-group v-model="menu.type" @change="typeChange" >
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="menu.type == 1">
        <el-form-item label="菜单名称：" prop="title">
          <el-input v-model="menu.title"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：">
          <el-cascader :props="{ value: 'id', label: 'title', checkStrictly: true }" :options="selectMenuList" :show-all-levels="false" v-model="menu.parentId" placeholder="请选择菜单"></el-cascader>
        </el-form-item>
        <el-form-item label="前端名称：" prop="name">
          <el-input v-model="menu.name"></el-input>
        </el-form-item>
        <el-form-item label="前端图标：" prop="icon">
          <el-popover v-model="iconPopoverShow" placement="bottom" width="880" trigger="click">
            <div class="iconContainer" v-for="item in svgIcons" :key="item" @click="chooseIcon(item)">
              <svg-icon :icon-class="item" />
            </div>

            <el-input slot="reference" v-model="menu.icon">
              <svg-icon slot="suffix" :icon-class="menu.icon"></svg-icon>
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-radio-group v-model="menu.hidden">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="menu.sort" />
        </el-form-item>
      </template>
      <template v-if="menu.type == 2">
        <el-form-item label="按钮名称：" prop="name">
          <el-input v-model="menu.name" />
        </el-form-item>
        <el-form-item label="按钮菜单：" prop="pid">
          <el-cascader :props="{ value: 'id', label: 'title', checkStrictly: true }" :options="selectMenuList" :show-all-levels="false" v-model="menu.pid" placeholder="请选择菜单" />
        </el-form-item>
        <el-form-item label="按钮value：" prop="value">
          <el-input v-model="menu.value"></el-input>
        </el-form-item>
        <el-form-item label="按钮uri：" prop="uri">
          <el-input v-model="menu.uri"></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('menuFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('menuFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  treeListMenu,
  createMenu,
  updateMenu,
  getMenu,
  createPermissionBtn,
  updatePermissionBtn,
  queryPermissionById,
} from "@/api/ums/menu";
import svgIcons from "@/icons"

const defaultMenu = {
  title: "",
  parentId: 0,
  name: "",
  icon: "",
  hidden: 0,
  sort: 0,
  type: 1,
  pid: 0,
  uri: "",
};
export default {
  name: "MenuDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menu: Object.assign({}, defaultMenu),
      selectMenuList: [],
      svgIcons,
      iconPopoverShow: false,
      rules: {
        1: {
          title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
          name: [{ required: true, message: "请输入前端名称", trigger: "blur" }],
          icon: [{ required: true, message: "请输入或选择前端图标", trigger: "change" }],
        },
        2: {
          name: [{ required: true, message: "请输入按钮名称", trigger: "blur" }],
          value: [{ required: true, message: "请输入按钮value", trigger: "blur" }],
          pid: [{ required: true, message: "请选择按钮菜单", trigger: "blur" }],
          uri: [{ required: true, message: "请输入按钮uri", trigger: "blur" }],
        },
      },
    };
  },
  created() {
    if (!this.isEdit) {
      let id = this.$route.query.id;
      let isBtn = this.$route.query.isBtn;
      let handle = isBtn ? queryPermissionById : getMenu;
      handle(id).then((response) => {
        this.menu = response.data;
        if (this.menu.icon) {
          this.$set(this.menu, "type", 1);
        } else {
          this.$set(this.menu, "type", 2);
        }
      });
    } else {
      this.menu = Object.assign({}, defaultMenu);
    }
    this.getSelectMenuList();
  },
  methods: {
    getSelectMenuList() {
      treeListMenu().then((response) => {
        let arr = JSON.parse(JSON.stringify(response.data));
        this.selectMenuList = this.getTreeData(arr);
        this.selectMenuList.unshift({ id: 0, title: "无上级菜单" });
      });
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children || data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
          data[i].disabled = false;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          // data[i].disabled = false;
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    onSubmit(formName) {
      let params = JSON.parse(JSON.stringify(this.menu));
      params.parentId =
        typeof params.parentId == "object"
          ? params.parentId[params.parentId.length - 1]
          : params.parentId;
      params.pid =
        typeof params.pid == "object"
          ? params.pid[params.pid.length - 1]
          : params.pid;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const value = {
              name: params.name,
              pid: params.pid,
              type: params.type,
              uri: params.uri,
              value: params.value
            }
            if (!this.isEdit) {
              let handleRequest = params.type == 2 ? updatePermissionBtn : updateMenu;
              handleRequest(this.$route.query.id, params.type == 2 ? value : params).then((response) => {
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 1000,
                });
                this.$router.back();
              });
            } else {
              let handleRequest = params.type == 2 ? createPermissionBtn : createMenu;
              handleRequest(params.type == 2 ? value : params).then((response) => {
                this.$refs[formName].resetFields();
                this.resetForm(formName);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000,
                });
                this.$router.back();
              });
            }
          });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.menu = Object.assign({}, defaultMenu);
      this.getSelectMenuList();
    },
    typeChange() {
      this.$refs["menuFrom"] && this.$refs["menuFrom"].clearValidate();
      this.menu = Object.assign({}, defaultMenu, { type: this.menu.type })
    },
    chooseIcon(iconName) {
      this.menu.icon = iconName;
      this.iconPopoverShow = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.iconContainer {
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
  text-align: center;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .svg-icon {
      transform: scale(3);
    }
  }
}
</style>
