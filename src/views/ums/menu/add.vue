<template> 
  <menu-detail :is-edit='is_edit'></menu-detail>
</template>
<script>
  import MenuDetail from './components/MenuDetail'
  export default {
    name: 'addMenu',
    components: { MenuDetail },
    data(){
      return{
        is_edit:true
      }
    }
  }
</script>
<style>
</style>


