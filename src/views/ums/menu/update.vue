<template>
   
  <menu-detail :is-edit="arr.isEdit"></menu-detail>
</template>
<script>
import MenuDetail from "./components/MenuDetail";
export default {
  name: "updateMenu",
  components: { MenuDetail },
  data() {
    return {
      arr: this.$route.query,
    };
  },
};
</script>
<style>
</style>


