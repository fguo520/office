<template>
  <vueScroll>
    <el-divider content-position="left">基本信息</el-divider>
    <el-form ref="form" :model="listQuery" label-width="100px" inline :rules="rules" size="mini">
      <el-form-item label="渠道：" prop="authId">
        <el-select v-model="listQuery.authId" placeholder="请选择" @change="authIdChange">
          <el-option v-for="item in typeList.authIdList" :key="item.id" :label="item.storeNameAs" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="母体SKU：" prop="sku">
        <el-input v-model="listQuery.sku" style="width:193px;" @change="skuChange" />
      </el-form-item><br>
      <el-form-item label="类目：" prop="categoryId">
        <el-cascader :props="categoryProps" v-model="listQuery.categoryId" filterable @change="categoryChange" ref="categoryCascader" />
      </el-form-item>
      <el-form-item label="产品分组：" prop="groupId">
        <el-cascader v-model="listQuery.groupId" :options="typeList.groupList" :placeholder="listQuery.authId?'请选择':'请先选择渠道'" :props="{ label:'groupName', value:'groupId' }" clearable ref="groupIdCascader" />
      </el-form-item><br>
      <el-form-item label="商品名称：" prop="subject">
        <el-input v-model="listQuery.subject" maxlength="128" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="关键字1：" prop="keywordOne">
        <el-input v-model="listQuery.keywordOne" maxlength="128" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="关键字2：" prop="keywordtTwo">
        <el-input v-model="listQuery.keywordtTwo" maxlength="128" show-word-limit class="inputLegth" />
      </el-form-item><br>
      <el-form-item label="关键字3：" prop="keywordThree">
        <el-input v-model="listQuery.keywordThree" maxlength="128" show-word-limit class="inputLegth" />
      </el-form-item>
    </el-form>

    <el-divider content-position="left">产品属性</el-divider>
    <DynamicFormItem :dynamicFormList="home.addFormItemList" ref="attrsForm" />

    <el-divider content-position="left">自定义属性</el-divider>
    <el-form :model="{ attrsList : home.customAttrs }" ref="customForm" label-width="100px" size="mini" class="customTable">
      <transition-group name="list" tag="div">
        <span v-for="(item, index) in home.customAttrs" :key="item.attributeNameCn">
          <el-form-item :label="`${item.attributeNameCn}：`" :rules="getCustomRules" :prop="`attrsList.${index}.valueName`">
            <template #label>
              <el-tooltip :content="item.attributeNameCn" placement="top">
                <div>{{ item.attributeNameCn }}：</div>
              </el-tooltip>
            </template>

            <el-input v-model.trim="item.valueName" style="width:193px;" maxlength="69" />
            <i class="el-icon-delete" @click="deleteCustomAttrs(index)" />
          </el-form-item>
        </span>
      </transition-group>
    </el-form>

    <el-input size="mini" placeholder="自定义属性名称" v-model.trim="addAttrKey" style="width:193px;" @keyup.enter.native="addAttrsButton" />
    <el-button size="mini" @click="addAttrsButton" :disabled="!Boolean(addAttrKey)">添加</el-button>

    <el-divider content-position="left" v-if="home.addProdSpecsList && Object.keys(home.addProdSpecsList).length !== 0">产品规格</el-divider>
    <DynamicFormItem :dynamicFormList="home.addProdSpecsList" ref="specForm" />
  </vueScroll>
</template>

<script>
import DynamicFormItem from "../components/DynamicFormItem"
import { categoryPage, categoryAttr, authList, shippingList, productGroupTree, skuDetail, keyword } from "@/api/rts/rtsEditor"
function filterTree(data) {
  for (var i = 0; i < data.length; i++) {
    if (!data[i].children) break;
    if (data[i].children.length < 1) {
      // children若为空数组，则将children设为undefined
      data[i].children = undefined;
    } else {
      // children若不为空数组，则继续 递归调用 本方法
      filterTree(data[i].children);
    }
  }
  return data;
}
export default {
  name: 'ProdInfo',
  components: {
    DynamicFormItem
  },
  props: {
    home: null,
  },
  data() {
    return {
      listQuery: {},
      typeList: {
        authIdList: [],
        groupList: [],
      },
      rules: {
        authId: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        sku: [{ required: this.$route.query.listing ? false : true, message: '此项为必填项', trigger: 'blur' }],
        categoryId: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        subject: [{ required: true, message: '此项为必填项', trigger: ['change', 'blur'] }],
        keywordOne: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
      },
      categoryCallBack: () => { },
      categoryProps: {
        lazy: true,
        label: 'categoryNameCn',
        value: 'categoryId',
        leaf: 'leafCategory',
        lazyLoad: async (node, resolve) => {
          const { value } = node;
          const res = await categoryPage({ parentCategoryId: value || 0 })
          if (this.$route.query.id && this.listQuery.categoryId.length == 0) {
            this.categoryCallBack = () => {
              resolve(res.data.list)
            }
          } else {
            resolve(res.data.list)
          }
        }
      },
      addAttrKey: ''
    };
  },
  created() {
    this.listQuery = this.home.listQuery
    this.getTypeList()
  },
  computed: {
    getCustomRules() {
      return { required: true, message: '此项不能为空', trigger: "blur" }
    }
  },
  watch: {
    'home.customAttrs': {
      handler(newValue, oldValue) {
        if (oldValue == null) return
        this.setTinymceContent()
      },
      deep: true,
    },
  },
  methods: {
    getTypeList() {
      if (this.listQuery.categoryId.length !== 0) this.categoryChange(this.listQuery.categoryId)
      authList().then(res => { this.typeList.authIdList = res.data })
    },
    authIdChange(authId) {
      productGroupTree({ authId }).then(res => {
        this.typeList.groupList = filterTree(res.data)
      })
      shippingList({ authId }).then(res => {
        this.home.typeList.shippingList = res.data;
      })
    },
    async skuChange(sku) {
      const { listQuery, home } = this;
      try {
        if (!sku) throw new Error();
        const res = await skuDetail({ sku })
        listQuery.subject = res.data.subject;
        listQuery.mainImages = res.data.mainImage.map(item => ({ url: item }));
        listQuery.packageLength = res.data.packLength
        listQuery.packageWidth = res.data.packWidth
        listQuery.packageHeight = res.data.packHeight
        listQuery.wholesaleTrade.weight = res.data.packWeight

        // home.typeList.unitTypeList = res.data.unitTypeList;
        listQuery.wholesaleTrade.unitType = ''

        home.tinymceReset = true;
        home.tinymceContent = res.data.description;
        this.setTinymceContent()
      } catch (error) {
        listQuery.subject = "";
        listQuery.mainImages = [];
        // home.typeList.unitTypeList = [];
        listQuery.wholesaleTrade.unitType = ''
        home.tinymceReset = true;
        home.tinymceContent = "";
        listQuery.packageLength = ''
        listQuery.packageWidth = ''
        listQuery.packageHeight = ''
        listQuery.wholesaleTrade.weight = ''
      }
    },
    async categoryChange(value) {
      this.listQuery.priceType = 1;
      const categoryId = value.slice(-1)[0]
      keyword({ categoryId }).then(res => {
        this.listQuery.keywordOne = res.data[0] || ""
        this.listQuery.keywordtTwo = res.data[1] || ""
        this.listQuery.keywordThree = res.data[2] || ""
      })
      categoryAttr({ categoryId }).then(res => {
        let formList = [];
        let prodSpecsList = [];
        res.data.forEach(item => {
          let list = item.skuAttribute ? prodSpecsList : formList;
          list.push({
            ...item,
            attributeName: item.attributeNameEn,
            showType: item.skuAttribute ? item.inputType === 'input' ? 'multInput' : 'check_box' : item.showType,
            valueName: item.skuAttribute ? [] : '',
            valueId: item.skuAttribute ? [] : '',
            itemAttrs: ''
          })
          if (item.attributeId === 1) {
            list[list.length - 1].valueName = 'China';
            list[list.length - 1].valueId = 100000458;
            list[list.length - 1].itemAttrs = {
              attrValueId: 100000458,
              attrValueNameEn: "China"
            };
          }
        })
        this.home.addFormItemList = formList;
        this.home.addProdSpecsList = prodSpecsList;
      })
    },
    setTinymceContent() {
      const { home, home: { tinymceContent, customAttrs, listQuery } } = this;
      const content = customAttrs.reduce((str, item) => {
        return str + `
            <tr>
              <td style="width: 50%; text-align: center;">${item.attributeNameCn}</td>
              <td style="width: 50%; text-align: center;">${item.valueName}</td>
            </tr>`
      }, '')
      home.tinymceReset = true;
      listQuery.descriptionStr = `
          <table style="border-collapse: collapse; width: 100%;" border="1">
          <tbody>
          ${content}
          </tbody>
          </table><br>
          ${tinymceContent}
        `
    },
    addAttrsButton() {
      const { home: { customAttrs }, $message, addAttrKey } = this
      if (!addAttrKey) return
      if (escape(addAttrKey).indexOf("%u") != -1) {
        $message.warning("只允许输入英文字符！")
        return
      }
      if (customAttrs.some(item => item.attributeNameCn == addAttrKey)) {
        $message.warning("属性名已存在，请不要输入重复项！")
        return
      }
      customAttrs.push({
        attributeName: addAttrKey,
        attributeNameCn: addAttrKey,
        attributeNameEn: addAttrKey,
        valueId: '',
        valueName: ''
      })
      this.addAttrKey = ''
    },
    deleteCustomAttrs(index) {
      const { home: { customAttrs } } = this
      customAttrs.splice(index, 1)
    },
    validate() {
      let fromValid, attrsFormValid, customFormValid, specFormValid;
      this.$refs.form.validate((valid) => { fromValid = valid })
      this.$refs.attrsForm.validate((valid) => { attrsFormValid = valid })
      this.$refs.customForm.validate((valid) => { customFormValid = valid })
      this.$refs.specForm.validate((valid) => { specFormValid = valid })
      return fromValid && attrsFormValid && customFormValid && specFormValid
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
/deep/ .inputLegth {
  width: 500px;
  .el-input__suffix {
    position: absolute;
    right: -55px;
  }
}
.customTable {
  > div {
    display: flex;
    flex-direction: column;

    > span {
      display: inline-block;
    }
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
</style>
