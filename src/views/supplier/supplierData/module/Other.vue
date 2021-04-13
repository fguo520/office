<template>
  <vueScroll>
    <el-form ref="form" :model="listQuery" label-width="100px" inline size="mini" :rules="rules" style="height: 530px;overflow-y: auto" :disabled="this.check">
      <el-form-item label="是否开票:">
        <el-radio-group v-model="listQuery.isInvoice">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <div v-if="listQuery.isInvoice">
        <el-form-item label="票据类型:" prop="invoiceType">
          <el-select v-model="listQuery.invoiceType" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.invoiceTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票人资质:" prop="drawerQualifications">
          <el-select v-model="listQuery.drawerQualifications" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.drawerQualificationsList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="开票人类型:" prop="drawerType">
          <el-select v-model="listQuery.drawerType" placeholder="请选择" size="mini" clearable class="input-width" filterable>
            <el-option v-for="(item, index) in typeList.drawerTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票所在地:" prop="drawerAddressCity">
          <el-select v-model="listQuery.drawerAddressProvince" placeholder="省" size="mini" clearable style="width:155px" filterable @change="supplierShipChange">
            <el-option v-for="(item, index) in typeList.supplierShipList" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.drawerAddressCity" placeholder="市" size="mini" clearable style="width:155px" filterable>
            <el-option v-for="(item, index) in typeList.drawerAddressCityList" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="增值税率:">
          <NumberInput v-model="listQuery.vatRate" max="20" min="0" float="2" class="input-width" clearable /><i style="position: absolute;right: 30px;top: 1px">%</i>
        </el-form-item>
        <el-form-item label="开票加点税:" prop="drawerVatRate">
          <NumberInput v-model="listQuery.drawerVatRate" max="20" min="0" float="2" class="input-width" clearable /><i style="position: absolute;right: 30px;top: 1px">%</i>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="listQuery.isUpdateProduct">同时更新至该供应商所有产品</el-checkbox>
        </el-form-item>
        <br>
      </div>
      <el-form-item>
        <template #label>
          <span>
            <el-tooltip placement="top" effect="light">
              <div slot="content">提供贴FBA条码服务的供应商对应<br />的产品支持走海外仓直采流程</div>
              <i class="el-icon-question" style="color:green"></i>
            </el-tooltip>支持贴标:
          </span>
        </template>
        <el-radio-group v-model="listQuery.isSupportLabeling">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <el-form-item label="支持退换货:">
        <el-radio-group v-model="listQuery.isSupportReturn">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <el-form-item label="支持海运装柜:">
        <el-radio-group v-model="listQuery.isSupportSea">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <el-form-item label="需要验厂:">
        <el-radio-group v-model="listQuery.isFactoryInspection">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <div v-if="listQuery.isFactoryInspection">
        <el-form-item label="" style="margin-left:100px">
          <el-upload ref="upload" class="upload-demo" action :on-change="handleChange" :on-exceed="maxChange" :show-file-list="false" :auto-upload="false" multiple :limit="5" :on-remove="onRemove" :file-list="listQuery.factoryUploads">
            <el-button size="mini" type="primary" :loading="isLoading">上传附件</el-button>
            <el-tooltip placement="top" effect="light">
              <div slot="content">最多可上传5个文件。仅支持使用以下格式的文件上传<br />1. 图片格式：jpg、jpeg、png<br />2. 文件格式：txt、xls、xlsx、doc、docx、csv、pdf<br />3. 压缩包格式：rar、zip</div>
              <i class="el-icon-question" style="color:green"></i>
            </el-tooltip>
          </el-upload>
        </el-form-item>
        <el-table style="width: 742px;margin:0px 0px 10px 100px" v-if="listQuery.factoryUploads.length>0" :data="listQuery.factoryUploads" border max-height="500px" :header-cell-style="{ 'background-color': 'rgb(218, 221, 227)' }">
          <el-table-column width="360" align="center">
            <template #header>
              <div style="color:black"><span>文件名称</span></div>
            </template>
            <template #default="{ row }">
              <div style="text-align:left">{{row.fileName}}</div>
            </template>
          </el-table-column>
          <el-table-column width="210" align="center">
            <template #header>
              <div style="color:black"><span>操作人 / 操作时间</span></div>
            </template>
            <template #default="{ row }">
              <div>{{row.createPerson}} {{row.createTime}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template #header>
              <div style="color:black"><span>操作</span></div>
            </template>
            <template slot-scope="scope">
              <span style="color:#41AF7C;font-size:12px;cursor: pointer;;margin-right:10px" @click="down(scope.row)" v-if="rolePermissionJudge('/supplierData/factory')">下载</span>
              <el-button size="mini" type="text" @click="remove(scope.$index)" v-if="rolePermissionJudge('/supplierData/factorydelect')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form-item label="黑名单:">
        <el-radio-group v-model="listQuery.isBlacklist">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <div v-if="listQuery.isBlacklist">
        <el-form-item label="黑名单备注" prop="blacklistRemark">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="listQuery.blacklistRemark" maxlength="5000" placeholder="请输入原因" show-word-limit class="inputLegth" />
        </el-form-item><br>
      </div>
      <el-form-item label="登录供货链接:">
        <el-input v-model="listQuery.supplyVisitLinks" maxlength="100" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="登录供货账号:">
        <el-input v-model="listQuery.supplyAccount" maxlength="100" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="登录供货密码:">
        <el-input v-model="listQuery.supplyPwd" maxlength="100" show-word-limit class="inputLegth" />
      </el-form-item><br>
    </el-form>
    <div style="text-align:center; position: absolute; bottom:0px; width: 100%;">
      <el-button @click="home.close">取消</el-button>
      <el-button @click="home.submit" type="primary" :loading="home.submitLoading" v-if="!this.check">保存</el-button>
    </div>
  </vueScroll>
</template>
<script>
import { getProvinceInfo, uploadImage } from "@/api/supplier/supplierData"
import { NumberInput } from '@/components'
export default {
  name: "Other",
  props: {
    home: null,
    check: {
      type: Boolean,
      default: false
    }
  },
  components: { NumberInput },
  data() {
    return {
      listQuery: {},
      typeList: {},
      rules: {
        invoiceType: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        drawerQualifications: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        drawerType: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        drawerAddressCity: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        drawerVatRate: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        blacklistRemark: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
      },
      isLoading: false
    }
  },
  watch: {
    'listQuery.supplierShippingAddressCity': function (newValue) {
      if (newValue) {
        if (this.listQuery.id) return
        this.typeList.drawerAddressCityList = this.typeList.supplierCityList
        this.listQuery.drawerAddressProvince = this.listQuery.supplierShippingAddressProvince
        this.listQuery.drawerAddressCity = this.listQuery.supplierShippingAddressCity
      }
    }
  },
  created() {
    this.listQuery = this.home.listQuery
    this.typeList = this.home.list
  },
  methods: {
    async supplierShipChange(drawerAddressProvince, check) {
      this.typeList.drawerAddressCityList = []
      if (!check) { this.listQuery.drawerAddressCity = "" }
      if (!this.listQuery.drawerAddressProvince) return
      const res = await getProvinceInfo({ provinceCode: drawerAddressProvince })
      this.typeList.drawerAddressCityList = res.data
    },
    maxChange(files, fileList) {
      console.log(files, fileList)
      if (files.length > 5) {
        this.$message.warning("最多上传5个文件");
      }
      if (fileList.length == 5) {
        this.$message.warning("最多上传5个文件");
      }
    },
    async handleChange(e, fileList) {
      const isLt20M = e.size / 1024 / 1024 < 10;
      if (!isLt20M) {
        this.$message.warning('上传的附件大小不能超过10M!');
        return false;
      }
      const file = e.raw;
      if (!file) return;
      const Xls = e.name.split(".");
      if (Xls[Xls.length - 1] !== "jpg" && Xls[Xls.length - 1] !== "jpeg" && Xls[Xls.length - 1] !== "png" && Xls[Xls.length - 1] !== "txt" && Xls[Xls.length - 1] !== "xls" && Xls[Xls.length - 1] !== "xlsx" && Xls[Xls.length - 1] !== "doc" && Xls[Xls.length - 1] !== "docx" && Xls[Xls.length - 1] !== "csv" && Xls[Xls.length - 1] !== "rar" && Xls[Xls.length - 1] !== "zip") {
        this.$message.warning("请选择正确格式文件");
        if (this.$refs.upload) { this.$refs.upload.clearFiles(); }
        return false;
      }
      const arr = []
      arr.push(file)
      if (arr.length > 5) {
        this.$message.warning("最多上传5个文件");
        return
      }
      this.isLoading = true
      for (let i in arr) {
        const formData = new FormData();
        formData.append("file", arr[i]);
        const res = await uploadImage(formData)
        this.listQuery.factoryUploads.push(res.data)
      }
      this.isLoading = false
    },
    onRemove(file, fileList) {
      this.listQuery.factoryUploads = this.listQuery.factoryUploads.filter(item => item.uid !== file.uid)
    },
    down(row) { window.open(row.fileUrl, '_blank') },
    remove(index) {
      this.listQuery.factoryUploads.splice(index, 1)
    },
    validate() {
      let callBackValid;
      this.$refs.form.validate((valid) => { callBackValid = valid })
      return callBackValid
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/ .inputLegth {
  width: 742px;
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}
/deep/ .el-textarea .el-input__count {
  position: absolute;
  right: -58px;
  bottom: 0;
}
/deep/ .upload-demo {
  .el-upload-list {
    display: none !important;
  }
}
</style>