<template>
  <el-card class="form-container" shadow="never">
    <el-tree :data="menuTreeList" show-checkbox default-expand-all node-key="uuid" ref="tree" highlight-current :default-checked-keys='checkedMenuIds' :props="{label: 'title'}" check-strictly>
    </el-tree>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>

  </el-card>
</template>

<script>
import { fetchTreeList } from "@/api/ums/menu";
import { listMenuByRole, allocMenu } from "@/api/ums/role";

export default {
  name: "allocMenu",
  data() {
    return {
      menuTreeList: [],
      roleId: null,
      checkedMenuIds: [],
    };
  },
  created() {
    this.roleId = this.$route.query.roleId;
    this.getList();
  },
  methods: {
    getList() {
      fetchTreeList().then(res => {
        this.menuTreeList = res.data;
        // this.getRoleMenu(this.roleId);
      });
      listMenuByRole(this.roleId).then(res => {
        this.checkedMenuIds = res.data;
      })
    },
    //递归获取勾选的值
    // filterCheck(list, menuList) {
    //   if (list && list.length) {
    //     list.forEach((item) => {
    //       menuList.forEach((item2) => {
    //         if (item.uuid && item.uuid == item2) {
    //           this.checkedMenuIds.push(item.uuid);
    //         }
    //         if (item.children && item.children.length) {
    //           this.filterCheck(item.children, menuList);
    //         }
    //       });
    //     });
    //   }
    // },
    // getRoleMenu(roleId) {
    //   listMenuByRole(roleId).then((res) => {
    //     let menuList = res.data;
    //     this.checkedMenuIds = menuList
    //     this.filterCheck(this.menuTreeList, menuList);
    //     let checkArrs = Array.from(new Set(this.checkedMenuIds))
    //     this.$refs.tree.setCheckedKeys(checkArrs);
    //   });
    // },

    handleSave() {
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      //let halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes(); //getHalfCheckedKeys
      //console.log("111"+ Array.from(new Set([...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedNodes()])))
      let menuIds = new Set();
      let buttonIds = new Set();
      if (checkedNodes != null && checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
          let checkedNode = checkedNodes[i];
          // 1--菜单  2--按钮
          if (checkedNode.icon != null) {
            menuIds.add(checkedNode.id);
          } else if (checkedNode.icon == null) {
            //menuIds.add(halfCheckedNodes[0].id);
            //menuIds.add(halfCheckedNodes[1].id);
            buttonIds.add(checkedNode.id);
          }
          // if(checkedNode.parentId!==0){
          //   checkedMenuIds.add(checkedNode.parentId);
          // }
        }
      }
      this.$confirm("是否分配菜单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        //debugger
        params.append("roleId", this.roleId);
        params.append("menuIds", Array.from(menuIds));
        params.append("buttonIds", Array.from(buttonIds));

        // return;
        allocMenu(params).then((response) => {
          this.$message({
            message: "分配成功",
            type: "success",
            duration: 1000,
          });
          this.$router.back();
        });
      });
    },
    handleClear() {
      this.$refs.tree.setCheckedKeys([]);
    },
  },
};
</script>

<style scoped>
</style>
