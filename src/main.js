import 'babel-polyfill'//兼容
require('es6-promise').polyfill()
// import Vue from 'vue'

// import { UTable, UTableColumn } from 'umy-ui';
// Vue.component(UTable.name, UTable);
// Vue.component(UTableColumn.name, UTableColumn);

// import ElementUI from 'element-ui'
import '../theme/index.css';
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
ELEMENT.Dialog.props.closeOnClickModal.default = false;
// Vue.use(ElementUI, { locale })

// import VeLine from 'v-charts/lib/line.common'
// Vue.component(VeLine.name, VeLine)
// import VePie from 'v-charts/lib/pie.common'
// Vue.component(VePie.name, VePie)
// import VeRing from 'v-charts/lib/ring.common'
// Vue.component(VeRing.name, VeRing)
// import VeHistogram from 'v-charts/lib/histogram.common'
// Vue.component(VeHistogram.name, VeHistogram)
// import VCharts from 'v-charts'
// Vue.use(VCharts)

// 滚动条
// import vuescroll from 'vuescroll/dist/vuescroll-native';
// Vue.use(vuescroll, {
//   name: "vueScroll",
//   ops: {
//     vuescroll: {
//       wheelScrollDuration: 300
//     },
//     bar: {
//       background: 'rgba(168, 168, 168, 0.8)'
//     },
//   },
// });
Vue.prototype.$vuescrollConfig = {
  vuescroll: {
    wheelScrollDuration: 300
  },
  bar: {
    background: 'rgba(168, 168, 168, 0.8)'
  }
};

// 注册全局指令样式
import clipboard from '@/directive/clipboard/index.js'
Vue.use(clipboard)
import { message } from "@/utils/resetMessage"
Vue.prototype.$message = message;

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/styles/index.scss' // global css
import '@/permission' // permission control
import authorityControl from './authorityControl' // 公共权限判断mixins函数
Vue.mixin(authorityControl)

//回车点击事件
import Tools from '@/utils/tools';
import Vue from 'vue';
Vue.prototype.Tools = Tools;

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

