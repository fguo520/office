<template>
  <vueScroll>
    <el-form ref="form" :model="this" label-width="100px" size="mini">
      <el-form-item label="定制服务：">
        <el-radio v-model="isCustomService" :label="true">支持定制</el-radio>
        <el-radio v-model="isCustomService" :label="false">不支持</el-radio>
      </el-form-item>

      <template v-if="isCustomService">
        <span class="spanTip">最多可添加五项: 已勾选：{{ checkList.length }} / 5</span>

        <el-checkbox-group v-model="checkList" :max="5">
          <transition-group name="list" tag="div">
            <span v-for="(item, index) in customAddAttrs" :key="item.customType">
              <el-checkbox :label="item" :ref="item.customType" @click.native="checkboxClick(index)" />

              <el-form-item :label="`${item.customType}：`" :rules="getRules(item.customType)" :prop="`customAddAttrs.${index}.minOrderQuantity`">
                <template #label>
                  <el-tooltip :content="item.customType" placement="top">
                    <div>{{ item.customType }}：</div>
                  </el-tooltip>
                </template>

                <NumberInput size="mini" v-model="item.minOrderQuantity" style="width:193px;" placeholder="请输入最小起订量" :disabled="getInputDisabled(item.customType)" />

                <i class="el-icon-delete" @click="deleteCustomAttrs(index, item.customType)" />
              </el-form-item>
            </span>
          </transition-group>
        </el-checkbox-group>

        <el-input size="mini" placeholder="自定义服务名称" v-model.trim="text" maxlength="50" show-word-limit style="width:193px;" @keyup.enter.native="addServiceAttrs" />
        <el-button size="mini" @click="addServiceAttrs" :disabled="!Boolean(text)">添加</el-button>
      </template>
    </el-form>

    <div style="text-align:center; position: absolute; bottom: 50px; width: 100%;">
      <el-divider />
      <el-button @click="home.submit(0)" v-show="!$route.query.check && !this.$route.query.listing" :loading="draftLoding">草稿</el-button>
      <el-button @click="close">关闭</el-button>
      <el-button @click="home.submit(1)" type="primary" v-show="!$route.query.check" :loading="submitLoading">{{ $route.query.listing ? '修改':'提交' }}</el-button>
    </div>
  </vueScroll>
</template>

<script>
import { NumberInput } from "@/components"
export default {
  name: 'Other',
  components: {
    NumberInput
  },
  props: {
    home: null
  },
  data() {
    return {
      isCustomService: true,
      checkList: [],
      customAddAttrs: [],
      text: "",
      draftLoding: false,
      submitLoading: false
    };
  },
  computed: {
    getInputDisabled() {
      const { $refs, checkList } = this
      return (key) => {
        if ($refs[key] && $refs[key][0]) return $refs[key][0].isLimitDisabled
        return checkList.length >= 5
      }
    },
    getRules() {
      return function (key) {
        const { $refs } = this;
        let required
        if ($refs[key] && $refs[key][0]) {
          required = $refs[key][0].isChecked
        } else {
          required = true
        }
        return { required, message: '此项不能为空', trigger: "blur" }
      }
    },
  },
  methods: {
    addServiceAttrs() {
      const { customAddAttrs, $message, text } = this
      if (!text) return
      if (escape(text).indexOf("%u") != -1) {
        $message.warning("只允许输入英文字符！")
        return
      }
      if (customAddAttrs.some(item => item.customType == text)) {
        $message.warning("服务的名称已存在！")
        return
      }
      customAddAttrs.push({
        customType: text,
        minOrderQuantity: ""
      })
      this.text = ""
    },
    deleteCustomAttrs(index, customType) {
      const { $refs, checkList, customAddAttrs } = this
      const isCheck = $refs[customType][0].isChecked
      customAddAttrs.splice(index, 1)
      delete $refs[customType]
      if (isCheck) {
        const deleteIndex = checkList.findIndex(item => item.customType === customType)
        checkList.splice(deleteIndex, 1)
      }
    },
    checkboxClick(index) {
      this.$refs.form.fields[index].clearValidate()
    },
    validate() {
      let callBackValid;
      this.$refs.form.validate((valid) => { callBackValid = valid })
      return callBackValid
    },
    close() {
      this.$router.replace({ path: "/rts/rtsPublish", query: { status: this.$route.query.routeStatus } });
    }
  },
};
</script>

<style scoped lang='scss'>
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.el-checkbox-group > div {
  display: inline-flex;
  flex-direction: column;

  > span {
    display: flex;
    align-items: center;
    margin-bottom: 18px;

    /deep/ .el-checkbox__label {
      display: none;
    }

    /deep/ .el-form-item {
      margin-bottom: 0px;
    }

    /deep/ .el-form-item__label {
      display: flex;
      div {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.spanTip {
  color: #606266;
  font-size: 14px;
  margin-left: 50px;
}
</style>
