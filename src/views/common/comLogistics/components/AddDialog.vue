<template>
  <el-dialog title="物流属性配置" :visible.sync="visible" width="450px" :before-close="close">
    <el-form ref="form" label-width="120px" size="mini" :model="listQuery" :rules="addRules">
      <el-form-item label="平台" prop="platformCode">
        <el-select v-model="listQuery.platformCode" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:200px" @change="handPlat">
          <el-option v-for="(item, index) in typeList.platformList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流方式" >
        <ScrollSelect v-model="listQuery.logisticsMode" :list="logistocList" style="width:200px" />
      </el-form-item>
      <el-form-item label="禁止运输属性: " prop="banLogisticsAttr">
        <ScrollSelect v-model="listQuery.banLogisticsAttr" :list="AttrList" style="width:200px" />
      </el-form-item>
      <el-form-item label="刊登提示属性: " prop="promptLogisticsAttr">
        <ScrollSelect v-model="listQuery.promptLogisticsAttr" :list="AttrList" style="width:200px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="listQuery.status" placeholder="全部" size="mini" clearable class="input-width" filterable style="width:200px">
          <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value">
          </el-option>
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
import { logisticsAttradd, getAllLogisticMode, getAllWithBattery } from "@/api/common/comLogistics"
import { ScrollSelect } from "@/components";
const defaultListQuery = {
  platformCode: "",
  logisticsMode: "",
  banLogisticsAttr: [],
  promptLogisticsAttr: [],
  status: null
}
export default {
  name: "AddDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Object,
      default: () => ({
        platformList: [],
      })
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      addRules: {
        platformCode: [{ required: true, message: "此项不能为空", trigger: "change" }],
        banLogisticsAttr: [{ required: true, message: "此项不能为空", trigger: "change" }],
        promptLogisticsAttr: [{ required: true, message: "此项不能为空", trigger: "change" }],
        status: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      commitLoading: false,
      logistocList: [],
      statusList: [{ label: "启用", value: 1 },{ label: "停用", value: 0 }, ],
      AttrList:[]
    }
  },
  components: {
    ScrollSelect
  },
  beforeDestroy() {
    this.close()
  },
  created() {
    this.getType()
  },
  methods: {
    close() {
      this.$emit("update:visible", false)
      this.listQuery = Object.assign({}, defaultListQuery)
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
    },
    async getType() {
      const res = await getAllWithBattery()
      this.AttrList = res.data
    },
    handPlat() {
      if (this.listQuery.platformCode) {
        getAllLogisticMode({ platformCode: this.listQuery.platformCode }).then(res => {
          if (res.code == 200) {
            this.logistocList = res.data
          }
        })
      }
    },
    commit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const banLogisticsAttr = this.listQuery.banLogisticsAttr.join(",")
        const promptLogisticsAttr = this.listQuery.promptLogisticsAttr.join(",")
        const res = await logisticsAttradd({...this.listQuery,banLogisticsAttr,promptLogisticsAttr});
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功"
          })
          this.close();
          this.$emit("request")
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
