<template>
  <TabelPageLayout :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @request="getList">
    <div>
      <el-button type="primary" size="mini" @click="handSave" v-if="rolePermissionJudge('/lzd/info/add')">添加</el-button>
    </div>
    <template #container>
      <u-table ref="tableContainer" style="width: 100%" :data="list" v-loading="listLoading" border height="100" use-virtual  element-loading-text="数据加载中" :header-cell-style="{ 'background-color': '#dadde3' }">
        <u-table-column label="平台" align="center" width="100">
          <template #default="{ row }">
            <div v-copy="row.platform">{{ row.platform|platformFilter }}</div>
          </template>
        </u-table-column>
        <u-table-column label="店铺" align="center" width="150">
          <template #default="{ row }">
            <el-tooltip class="item" effect="dark" :content="row.storeName" placement="top">
              <div><span v-copy="row.storeName" class="tooltipClass">{{ row.storeName }}</span></div>
            </el-tooltip>
          </template>
        </u-table-column>
        <u-table-column label="站点" align="center" width="150">
          <template #default="{ row }">
            <div v-copy="row.site">{{ row.site |siteFilter}}</div>
          </template>
        </u-table-column>
        <u-table-column label="SKU" align="center">
          <template #default="{ row }">
            <div v-copy="row.sku">{{ row.sku }}</div>
          </template>
        </u-table-column>
        <u-table-column label="itemID" align="center">
          <template #default="{ row }">
            <div v-copy="row.itemId">{{ row.itemId }}</div>
          </template>
        </u-table-column>
        <u-table-column label="数据类型" align="center" width="200">
          <template #default="{ row }">
            <div>{{ row.type |typeFilter}}</div>
          </template>
        </u-table-column>
        <u-table-column label="拉取状态" align="center" width="100">
          <template #default="{ row }">
            <div v-copy="row.status">{{ row.status |statusFilter}}</div>
          </template>
        </u-table-column>
        <u-table-column label="错误描述" align="center">
          <template #default="{ row }">
            <div style="text-align:left">
              <el-tooltip class="item" effect="dark" :content="row.errorDec" placement="top">
                <div v-copy="row.errorDec" class="tooltipClass">{{ row.errorDec}}</div>
              </el-tooltip>
            </div>
          </template>
        </u-table-column>

        <u-table-column label="操作人" align="center" width="100">
          <template #default="{ row }">
            <div v-copy="row.username">{{ row.username }}</div>
          </template>
        </u-table-column>
        <u-table-column label="时间" align="center" width="230">
          <template #default="{ row }">
            <div v-show="row.createTime">创建时间: {{ row.createTime }}</div>
            <div v-show="row.pullTime">拉取状态: {{ row.pullTime }}</div>
          </template>
        </u-table-column>
      </u-table>
    </template>
    <el-dialog title="手动拉取数据规则" :visible.sync="dialogFormVisible" width="768px" custom-class="formDiv" v-if="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <div class="formDialog">
          <div class="formDialog_item">
            <el-form-item label="平台: " prop="platform">
              <el-select v-model="ruleForm.platform" placeholder="全部" size="mini" clearable class="input-width" filterable>
                <el-option v-for="(item, index) in platformNameList" :key="index" :label="item.parameterValue" :value="item.parameterCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="数据类型: " prop="type">
              <el-select v-model="ruleForm.type" placeholder="全部" size="mini" clearable class="input-width" filterable>
                <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="店铺: " prop="authId">
              <el-select v-model="ruleForm.authId" placeholder="全部" size="mini" clearable class="input-width" filterable>
                <el-option v-for="(item, index) in shopList" :key="index" :label="item.storeNameAs" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="站点: " prop="site">
              <el-select v-model="ruleForm.site" placeholder="全部" size="mini" clearable class="input-width" filterable>
                <el-option v-for="(item, index) in countryList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="SKU: ">
              <el-input v-model="ruleForm.sku" size="mini"></el-input>
            </el-form-item>
          </div>
          <div class="formDialog_item">
            <el-form-item label="itemID: ">
              <el-input v-model="ruleForm.itemId" size="mini"></el-input>
            </el-form-item>
          </div>
          <div style="clear:both"></div>
          <div style="text-align:right">
            <el-form-item label-width="0">
              <el-button @click="dialogFormVisible=false" size="mini">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </TabelPageLayout>
</template>
<script>
import { TabelPageLayout } from "@/components";
import {
  getList,
  addPullDataTask,
  getSysParameterName,
  getLmSysPlatformAuthList,
} from "@/api/lazada/pullInfo";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 50,
};
const defaultruleForm = {
  authId: null,
  itemId: "",
  platform: "",
  site: "",
  sku: "",
  type: null,
};
export default {
  name: "pullInfo",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: [],
      total: null,
      dialogFormVisible: false,
      ruleForm: Object.assign({}, defaultruleForm),
      rules: {
        authId: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        type: [{ required: true, message: "此项不能为空", trigger: "change" }],
        platform: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        site: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      platformNameList: [],
      typeList: [{ label: "lazadaListing", value: 1 }],
      countryList: [
        { label: "马来西亚", value: 10349 },
        { label: "菲律宾", value: 10350 },
        { label: "新加坡", value: 10351 },
        { label: "越南", value: 10352 },
        { label: "泰国", value: 10353 },
        { label: "印度尼西亚", value: 10354 },
      ],
      shopList: [],
    };
  },
  components: {
    TabelPageLayout,
  },
  filters: {
    siteFilter(type) {
      switch (type) {
        case '10349':
          return "马来西亚";
        case '10350':
          return "菲律宾";
        case '10351':
          return "新加坡";
        case '10352':
          return "越南";
        case '10353':
          return "泰国";
        case '10354':
          return "印度尼西亚";
        default:
          return "未知";
      }
    },
    platformFilter(type) {
      switch (type) {
        case "10061":
          return "lazada";
        case "10376":
          return "walmart";
        default:
          return "未知";
      }
    },
    statusFilter(type) {
      switch (type) {
        case 0:
          return "待拉取";
        case 1:
          return "拉取中";
        case 2:
          return "拉取成功";
        case 3:
          return "拉取失败";
        default:
          return "未知";
      }
    },
    typeFilter(type) {
      switch (type) {
        case 1:
          return "lazadaListing";
        default:
          return "未知";
      }
    },
  },
  created() {
    this.getList();
    this.getType();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      try {
        const res = await getList(this.listQuery);
        this.list = res.data.list;
        this.total = res.data.total;
      } catch (error) {
        this.list = [];
        this.total = 0;
      }
      this.listLoading = false;
    },
    getType() {
      getSysParameterName({
        isTopClass: 0,
        parameterName: "",
        parameterSearchType: "平台",
      }).then((res) => {
        this.platformNameList = res.data;
      });
      getLmSysPlatformAuthList({ platform: "10061" }).then((res) => {
        this.shopList = res.data;
      });
    },
    handSave() {
      this.dialogFormVisible = true;
      this.ruleForm = Object.assign({}, defaultruleForm);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addPullDataTask(this.ruleForm).then((res) => {
            this.$message.success(res.message);
            this.dialogFormVisible = false;
            this.getList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  .el-divider {
    margin: 0;
    margin-bottom: 24px;
  }
}
.formDiv .el-dialog__body {
  .el-form {
    .formDialog {
      overflow: hidden;
      .formDialog_item {
        width: 50%;
        float: left;
        .el-form-item /deep/.el-form-item__content {
          width: 180px;
        }
      }
    }
  }
}
</style>