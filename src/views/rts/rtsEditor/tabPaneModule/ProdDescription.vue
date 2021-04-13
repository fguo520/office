<template>
  <vueScroll>
    <p class="labelClass"><span style="color:red;">*</span> 产品图片（图片数量必须为6张）：</p>
    <UploadImage :fileList.sync="home.listQuery.mainImages" :authId="home.listQuery.authId" />
    <p class="labelClass"> <span style="color:red;">*</span> 商品详细描述：</p>
    <Tinymce :height="500" v-model="home.listQuery.descriptionStr" :resetContent.sync="home.tinymceReset" :params="{sku:home.listQuery.sku, authId:home.listQuery.authId}" :action="action" />
  </vueScroll>
</template>

<script>
import { Tinymce } from "@/components";
import UploadImage from "../components/UploadImage"
export default {
  name: 'ProdDescription',
  components: {
    UploadImage,
    Tinymce
  },
  props: {
    home: null,
  },
  data() {
    return {
      action: `${process.env.RTS_API}/rts/photo/bank/upload`,
    };
  },
  methods: {
    validate() {
      const { descriptionStr, mainImages } = this.home.listQuery;
      return descriptionStr.length !== 0 && mainImages.length == 6
    }
  },
};
</script>

<style scoped lang='scss'>
.labelClass {
  font-size: 14px;
  color: #606266;
}
</style>
