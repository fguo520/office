<template>
  <el-dialog :title="`${row?'编辑':'新增'}服务商授权`" :visible.sync="visible" width="700px" append-to-body :before-close="close" @open="open">
    <el-form ref="form" label-width="150px" size="mini" inline :model="listQuery" :rules="rules">
      <el-form-item label="服务商：" prop="logisticsServeice">
        <el-input v-model="listQuery.logisticsServeice" style="width:450px;" v-if="!row" />
        <div v-else> {{ listQuery.logisticsServeice }} </div>
      </el-form-item><br />
      <el-form-item label="服务商代码：" prop="logisticsServeiceCode">
        <el-input v-model="listQuery.logisticsServeiceCode" style="width:450px;" v-if="!row" />
        <div v-else>{{ listQuery.logisticsServeiceCode }}</div>
      </el-form-item><br />
      <el-form-item label="服务商名称：" prop="logisticsServeiceName">
        <el-input v-model="listQuery.logisticsServeiceName" style="width:450px;" />
      </el-form-item><br />
      <el-form-item label="服务商类型：" prop="logisticsType">
        <el-radio v-model="listQuery.logisticsType" :label="1">仓储</el-radio>
        <el-radio v-model="listQuery.logisticsType" :label="2">物流</el-radio>
      </el-form-item>
      <el-form-item label="服务商模式：" prop="model">
        <el-radio v-model="listQuery.model" :label="1">线上</el-radio>
        <el-radio v-model="listQuery.model" :label="2">线下</el-radio>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio v-model="listQuery.status" :label="1">启用</el-radio>
        <el-radio v-model="listQuery.status" :label="2">停用</el-radio>
      </el-form-item>
      <el-form-item label="负责人：" prop="serveiceAdminId">
        <el-select v-model="listQuery.serveiceAdminId" placeholder="全部" style="width:150px" filterable>
          <el-option v-for="(item, index) in typeList.principalList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="接口地址/打印地址：">
        <el-input v-model="listQuery.interfaceUrl" style="width:192px;" />
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="authorization()" type="primary" size="mini" :loading="commitLoading">授 权</el-button>
      <el-button @click="close" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getUmsAdminListByUserId, saveLogisticsService } from "@/api/logistics/serviceProvider"
const defaultListQuery = {
  id: null,
  logisticsServeice: '',
  logisticsServeiceCode: '',
  logisticsServeiceName: '',
  logisticsType: '',
  model: '',
  status: '',
  serveiceAdminId: '',
  interfaceUrl: '',
}
export default {
  name: "AuthDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: null
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      typeList: {
        principalList: []
      },
      rules: {
        logisticsServeice: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        logisticsServeiceCode: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        logisticsServeiceName: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        logisticsType: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        model: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        status: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
        serveiceAdminId: { required: true, message: '此项不能为空', trigger: ['change', 'blur'] },
      },
      defaultId: '',
      commitLoading: false
    }
  },
  created() {
    //获取当前账号对应的负责人
    getUmsAdminListByUserId().then(res => {
      this.defaultId = res.data.loginId;
      this.listQuery.serveiceAdminId = res.data.loginId
      this.typeList.principalList = res.data.principalList
    })
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    open() {
      if (!this.row) return
      this.listQuery = JSON.parse(JSON.stringify(this.row))
    },
    close() {
      const { $refs, defaultId } = this
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, defaultListQuery)
      this.listQuery.serveiceAdminId = defaultId
      setTimeout(() => { $refs.form && $refs.form.clearValidate() }, 50)
    },
    authorization() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        this.commitLoading = true
        try {
          const res = await saveLogisticsService(this.listQuery)
          this.$message.success(res.data)
          this.close()
          this.$emit('request')
        } catch (error) { }
        this.commitLoading = false
      })
    }
  }
}
</script>