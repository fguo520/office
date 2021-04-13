<template>
   
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <ShrinkCard>
      <el-form :inline="true" :model="listQuery" size="mini" label-width="100px">
        <el-form-item label="账号搜索：">
          <el-input v-model="listQuery.username" class="input-width" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名搜索：">
          <el-input v-model="listQuery.nickName" class="input-width" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="花名搜索：">
          <el-input v-model="listQuery.fullName" class="input-width" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #button>
        <el-button size="mini" class="btn-add" type="primary" @click="handleAdd()">添加</el-button>
        <el-button @click="handleResetSearch()" size="mini"> 重置 </el-button>
        <el-button type="primary" @click="handleSearchList()" size="mini" icon="el-icon-search">
          查询
        </el-button>
      </template>
    </ShrinkCard>
    <template #container>
      <u-table ref="tableContainer" :data="list" style="width: 100%" v-loading="listLoading" border height="100" use-virtual element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="编号" width="50" type="index" align="center"></u-table-column>
        <u-table-column label="账号" align="center">
          <template slot-scope="scope">
            <div v-copy="scope.row.username">
              {{ scope.row.username }}
            </div>
          </template>
        </u-table-column>
        <u-table-column label="姓名" align="center">
          <template slot-scope="scope"><span v-copy="scope.row.nickName">{{ scope.row.nickName }}</span></template>
        </u-table-column>
        <u-table-column label="花名" align="center">
          <template slot-scope="scope"><span v-copy="scope.row.fullName">{{ scope.row.fullName }}</span></template>
        </u-table-column>
        <u-table-column label="公司名称" align="center" width="200">
          <template slot-scope="scope">{{ scope.row.companyCn }}</template>
        </u-table-column>
        <u-table-column label="部门" align="center">
          <template slot-scope="scope">{{ scope.row.departmentCn }}</template>
        </u-table-column>
        <u-table-column label="职务" align="center">
          <template slot-scope="scope">{{ scope.row.dutyCn }}</template>
        </u-table-column>
        <u-table-column label="岗位" align="center">
          <template slot-scope="scope">{{ scope.row.jobCn }}</template>
        </u-table-column>
        <u-table-column label="权限类型" align="center">
          <template slot-scope="scope">{{ scope.row.permissionType }}</template>
        </u-table-column>
        <u-table-column label="邮箱" align="center" width="150">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </u-table-column>
        <u-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatDateTime
          }}</template>
        </u-table-column>
        <u-table-column label="最后登录" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.loginTime | formatDateTime
          }}</template>
        </u-table-column>
        <u-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.status">
            </el-switch>
          </template>
        </u-table-column>
        <u-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleSelectRole(scope.$index, scope.row)">分配角色
            </el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <!--<el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>-->
          </template>
        </u-table-column>
      </u-table>
    </template>
    <el-dialog :title="isEdit ? '编辑用户' : '添加用户'" :visible.sync="dialogVisible" v-if="dialogVisible" width="768px">
      <el-form :model="admin" ref="admin" label-width="150px" size="mini" :rules="rules">
        <el-form-item label="账号：" prop="username">
          <el-input v-model="admin.username" style="width: 250px" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="nickName">
          <el-input v-model="admin.nickName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="花名：" prop="fullName">
          <el-input v-model="admin.fullName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="赛盒用户id：" prop="shAdminId">
          <NumberInput v-model="admin.shAdminId" style="width: 250px"></NumberInput>
        </el-form-item>
        <el-form-item label="公司名称：" prop="company">
          <el-select v-model="admin.company" style="width: 250px">
            <el-option v-for="(item, index) in companies" :key="index" :value="item.parameterCode" :label="item.parameterName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门：" prop="department">
          <el-select v-model="admin.department" style="width: 250px">
            <el-option v-for="(item, index) in departments" :key="index" :value="item.parameterCode" :label="item.parameterName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务：" prop="duty">
          <el-select v-model="admin.duty" style="width: 250px">
            <el-option v-for="(item, index) in dutys" :key="index" :value="item.parameterCode" :label="item.parameterName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位：" prop="job">
          <el-select v-model="admin.job" style="width: 250px">
            <el-option v-for="(item, index) in jobs" :key="index" :value="item.parameterCode" :label="item.parameterName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="admin.email" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="admin.password" type="password" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="admin.note" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="admin.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传头像：" prop="icon">
          <el-radio-group v-model="admin.icon" class="icon-radio">
            <el-radio v-for="(item, index) in iconfileList" :key="index" :label="item" border><img :src="item" style="width: 100%" /></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限：">
          <el-radio-group v-model="authority">
            <el-radio :label="1">自己权限</el-radio>
            <el-radio :label="2">所有权限</el-radio>
            <el-radio :label="3">部门权限</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('admin')" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="allocDialogVisible" width="576px">
      <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="mini" style="width: 80%">
        <el-option v-for="item in allRoleList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleAllocDialogConfirm()" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </TabelPageLayout>
</template>
<script>
import {
  fetchList,
  createAdmin,
  updateAdmin,
  updateStatus,
  deleteAdmin,
  getRoleByAdmin,
  allocRole,
  userIcon,
} from "@/api/login";
import { fetchList as getType } from "@/api/cms/systemParameter";
import { fetchAllRoleList } from "@/api/ums/role";
import { formatDate } from "@/utils/date";
import { TabelPageLayout, ShrinkCard, NumberInput } from "@/components";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
  username: "",
  nickName: "",
  fullName: "",
  status: null
};
const defaultAdmin = {
  id: null,
  username: null,
  password: null,
  nickName: null,
  shAdminId: '',
  email: null,
  note: null,
  status: 1,
  company: "",
  department: "",
  duty: "",
  job: "",
  allUserAuthority: "", //所有
  chooseUserAuthority: "", //选择的部门权限
  onlyUserAuthority: "", //仅有自己权限
  icon: "",
  fullName: ''
};
export default {
  name: "adminList",
  components: {
    TabelPageLayout,
    ShrinkCard,
    NumberInput
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      admin: Object.assign({}, defaultAdmin),
      isEdit: false,
      allocDialogVisible: false,
      allocRoleIds: [],
      allRoleList: [],
      allocAdminId: null,
      authority: 1,
      dutys: [],
      jobs: [],
      companies: [],
      departments: [],
      iconfileList: [],
      statusList: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }],
      rules: {
        username: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        nickName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        company: [{ required: true, message: "此项不能为空", trigger: "change" }],
        department: [{ required: true, message: "此项不能为空", trigger: "change" }],
        duty: [{ required: true, message: "此项不能为空", trigger: "change" }],
        job: [{ required: true, message: "此项不能为空", trigger: "change" }],
        password: [{ required: true, message: "此项不能为空", trigger: "blur" }, { min: 3, message: '最低输入3位密码', trigger: 'blur' }],
        status: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        icon: [{ required: true, message: "此项不能为空", trigger: "change" }],
        fullName: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      }
    };
  },
  created() {
    this.getList();
    this.getAllRoleList();
    getType({
      parameterSearchType: "公司",
      isTopClass: false,
      pageNum: 1,
      pageSize: 100,
    }).then((res) => {
      //console.log('公司',res)
      this.companies = res.data.list;
    });
    getType({
      parameterSearchType: "部门",
      isTopClass: false,
      pageNum: 1,
      pageSize: 100,
    }).then((res) => {
      //console.log('部门',res)
      this.departments = res.data.list;
    });
    getType({
      parameterSearchType: "职务",
      isTopClass: false,
      pageNum: 1,
      pageSize: 100,
    }).then((res) => {
      //console.log('职务',res)
      this.dutys = res.data.list;
    });
    getType({
      parameterSearchType: "岗位",
      isTopClass: false,
      pageNum: 1,
      pageSize: 100,
    }).then((res) => {
      //console.log('岗位',res)
      this.jobs = res.data.list;
    });
    this.Tools.handleEnter(this.getList) //页面初始化时调用、把查询方法传递进来
  },
  beforeDestroy() {
    document.onkeydown = null; //离开当前路由，会直接调用beforeDestroy方法销毁回车事件
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.admin = Object.assign({}, defaultAdmin);
    },
    handleStatusChange(index, row) {
      this.$confirm("是否要修改该状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateStatus(row.id, { status: row.status }).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.getList()
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改",
          });
          this.getList();
        });
    },
    /* handleDelete(index, row) {
        this.$confirm('是否要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAdmin(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },*/
    handleUpdate(index, row) {
      // console.log(row)
      this.dialogVisible = true;
      this.isEdit = true;
      this.admin = Object.assign({}, row);
      // this.admin.iconFile=row.iconFile;
      if (row.onlyUserAuthority == true) {
        //自己权限
        this.authority = 1;
      } else if (row.allUserAuthority == true) {
        //所有权限
        this.authority = 2;
      } else if (row.chooseUserAuthority == true) {
        //部门权限
        this.authority = 3;
      }
    },
    handleDialogConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.authority === 1) {
            //自己权限
            this.admin.onlyUserAuthority = true;
            this.admin.allUserAuthority = false;
            this.admin.chooseUserAuthority = false;
          } else if (this.authority === 2) {
            //所有权限
            this.admin.allUserAuthority = true;
            this.admin.onlyUserAuthority = false;
            this.admin.chooseUserAuthority = false;
          } else if (this.authority === 3) {
            //部门权限
            this.admin.chooseUserAuthority = true;
            this.admin.allUserAuthority = false;
            this.admin.onlyUserAuthority = false;
          }
          if (this.isEdit) {
            updateAdmin(this.admin.id, this.admin).then((response) => {
              this.$message({
                message: "修改成功！",
                type: "success",
              });
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            createAdmin(this.admin).then((response) => {
              this.$message({
                message: "添加成功！",
                type: "success",
              });
              this.dialogVisible = false;
              this.getList();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    handleAllocDialogConfirm() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("adminId", this.allocAdminId);
        params.append("roleIds", this.allocRoleIds);
        allocRole(params).then((response) => {
          this.$message({
            message: "分配成功！",
            type: "success",
          });
          this.allocDialogVisible = false;
        });
      });
    },
    handleSelectRole(index, row) {
      this.allocAdminId = row.id;
      this.allocDialogVisible = true;
      this.getRoleListByAdmin(row.id);
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getAllRoleList() {
      fetchAllRoleList().then((response) => {
        this.allRoleList = response.data;
      });
      //用户头像
      userIcon().then((response) => {
        this.iconfileList = response.data;
      });
    },
    getRoleListByAdmin(adminId) {
      getRoleByAdmin(adminId).then((response) => {
        let allocRoleList = response.data;
        this.allocRoleIds = [];
        if (allocRoleList != null && allocRoleList.length > 0) {
          for (let i = 0; i < allocRoleList.length; i++) {
            this.allocRoleIds.push(allocRoleList[i].id);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  .input-limit {
    position: absolute;
    bottom: -5px;
    right: 10px;
    font-size: 1px;
    color: gray;
  }

  /deep/ .el-form-item__label {
    width: 120px !important;
  }

  .buttonContainer {
    width: 180px;
  }

  /deep/ .el-textarea__inner {
    width: 180px;
  }

  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }

  .el-zoom-in-top-enter,
  .el-zoom-in-bottom-enter,
  .el-zoom-in-top-leave-to,
  .el-zoom-in-bottom-leave-to {
    position: absolute;
  }
}
.el-dialog {
  .el-form {
    .icon-radio {
      .el-radio {
        float: left;
        width: 80px;
        height: 35px;

        /deep/ .el-radio__input {
          margin-bottom: 25px;
        }
        .el-radio__label img {
          width: 62% !important;
        }
      }
      .el-radio--mini.is-bordered {
        padding: 0px 15px 0 10px;
      }
      .el-radio.is-bordered + .el-radio.is-bordered {
        margin-left: 0px;
      }
    }
  }
}
</style>


