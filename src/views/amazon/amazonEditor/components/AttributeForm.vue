<template>
  <div>
    <el-menu default-active="required">
      <el-submenu :index="index" v-for="(item,index) in formObj.addFormItemList" :key="index">
          <template slot="title">
            <span>{{index}}</span>
          </template>
          <el-menu-item-group>
            <DynamicFormItem :dynamicFormList="formObj.addFormItemList[index]" :skuObject="formObj.skuObject" :usedSellerSku='formObj.usedSellerSku' :ref="`dynamicForm${index}`" @upc="upcChange" />
          </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <p class="labelClass"><span style="color:red;">*</span> 产品图片（图片数量为1-9张）：</p>
    <UploadImage :fileList.sync="formObj.images" />
    <p class="labelClass"> <span style="color:red;">*</span> 商品详细描述：</p>
    <Tinymce :height="500" v-model="formObj.productdescription" :resetContent.sync="tinymceReset" limit="2000" showLimit limitHtml :limitReset="false" :editorImage="false" />
  </div>
</template>
<script>
import { Tinymce } from "@/components";
import DynamicFormItem from "./DynamicFormItem"
import UploadImage from "./UploadImage"
export default {
  name: "AttributeForm",
  props: {
    formObj: {
      type: Object,
      default: () => {
        return {
          addFormItemList: [],
          images: [],
          productdescription: ""
        }
      }
    },
  },
  components: {
    Tinymce, DynamicFormItem, UploadImage
  },
  data() {
    return {
      tinymceReset: true,
    }
  },
  methods: {
    upcChange(e) {
      this.$emit("upc", e)
    },
    hand(index) {
      // console.log(this.$refs[`dynamicForm${index}`][0].style.top)
    }
  }
}
</script>
<style lang="scss" scoped>
.labelClass {
  font-size: 14px;
  color: #606266;
}
.el-submenu {
  border-bottom: 1px solid #dcdfe6;
}
/deep/ .el-submenu__title {
  background-color: #fff !important;
  font-weight: bold !important;
  font-size: 18px !important;
}
</style>