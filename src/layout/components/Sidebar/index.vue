<template>
    <vueScroll :ops="ops">
      <el-menu mode="vertical" 
        :show-timeout="200" 
        :default-active="$route.path" 
        :collapse="isCollapse" 
        :background-color="variables.menuBg" 
        :text-color="variables.menuText" 
        :active-text-color="variables.menuActiveText" 
        ondragstart="return false">
        <sidebar-item :routes="routes"></sidebar-item>
      </el-menu>
    </vueScroll>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from '@/styles/variables.scss';

export default {
  data() {
    return {
      ops: {
        scrollPanel: {
          scrollingX: false
        },
        bar: {
          size: '3px',
          opacity: 0.7,
        }
      }
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters(["sidebar", "routers"]),
    routes() {
      // return this.$router.options.routes
      return this.routers;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    variables() {
      return variables
    }
  },
};
</script>

