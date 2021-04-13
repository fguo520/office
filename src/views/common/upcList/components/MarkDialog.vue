<template>
  <el-dialog title="标记" :visible.sync="visible" width="400px" :before-close="close">
    <el-form ref="form" label-width="100px" size="mini" :model="listQuery" :rules="addRules">
      <el-form-item label="状态" prop="userStatus">
        <el-select v-model="listQuery.userStatus" placeholder="请选择状态">
          <el-option v-for="item in typeList.useingState" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="自定义SKU" prop="customSku">
        <el-input style="width:193px;" v-model="listQuery.customSku" />
      </el-form-item>
      <el-form-item label="平台：" prop="platformCode">
        <el-select v-model="listQuery.platformCode" placeholder="全部" size="mini" clearable class="input-width" filterable @change="handPlatformCode">
          <el-option v-for="(item, index) in typeList.platformCodeList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道" prop="authId">
        <el-select v-model="listQuery.authId" placeholder="请选择渠道">
          <el-option v-for="item in typeList.channelList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button @click="commit" type="primary" size="mini" :loading="commitLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPlatforms, marker, getChannels } from "@/api/common/upcList"
const defaultListQuery = {
  userStatus: "",
  customSku: "",
  authId: "",
  id: "",
  platformCode:''
}
export default {
  name: "MarkDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    markId: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addRules: {
        userStatus: [{ required: true, message: "此项不能为空", trigger: "change" }],
        customSku: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        authId: [{ required: true, message: "此项不能为空", trigger: "change" }],
        platformCode: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      typeList: {
        useingState: [{ label: "未使用", value: 0 }, { label: "已使用", value: 1 }],
        channelList: [],
        platformCodeList: []
      },
      commitLoading: false,
    }
  },
  created() {
    getPlatforms().then(res => {
      this.typeList.platformCodeList = res.data;
    })
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, defaultListQuery)
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
    },
    commit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const res = await marker({ ...this.listQuery, id: this.markId });
        if (res.code === 200) {
          this.$message.success(res.data)
          this.close();
          this.$emit("request")
        }
      })
    },
    handPlatformCode() {
      this.listQuery.authId=""
      if (this.listQuery.platformCode) {
        getChannels({ platformCode: this.listQuery.platformCode }).then(res => {
          this.typeList.channelList = res.data
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
