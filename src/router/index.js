import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    meta: { title: '首页', icon: 'home' },
    alwaysShow: true,
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' },
    }]
  },
]

export const asyncRouterMap = [
  {
    path: '/cms',
    component: Layout,
    redirect: '/cms/systemParameter',
    name: 'cms',
    meta: { title: '基础配置', icon: 'jichupeizhi' },
    children: [
      {
        path: 'systemParameter',
        name: 'systemParameter',
        component: () => import('@/views/cms/systemParameter/systemParameter'),
        meta: { title: '参数配置', icon: 'canshuconfig' },
        //alwaysShow: true
      },
      {
        path: 'syschannelMent',
        name: 'syschannelMent',
        component: () => import('@/views/cms/syschannelMent/syschannelMent'),
        meta: { title: '渠道管理', icon: 'qudaoguanli' },
        //alwaysShow: true
      },
      {
        path: 'sysExchangeRate',
        name: 'sysExchangeRate',
        component: () => import('@/views/cms/sysExchangeRate/sysExchangeRate'),
        meta: { title: '汇率管理', icon: 'huishuaiguanli' },
        //alwaysShow: true
      },
      {
        path: 'announcement',
        name: 'announcement',
        component: () => import('@/views/cms/announcement/announcement'),
        meta: { title: '公告管理', icon: 'gonggao' },
        //alwaysShow: true
      },
      {
        path: 'addAnnouncement',
        // name: 'announcement',
        component: () => import('@/views/cms/announcement/addAnnouncement'),
        meta: { title: '新增公告', icon: 'gonggao' },
        hidden: true
      },
    ]
  },
  {
    path: '/pmsV2',
    component: Layout,
    redirect: '/pmsV2/pmsV2List',
    name: 'pmsV2',
    meta: { title: '商品管理V2', icon: 'product-cate' },
    children: [
      {
        path: 'pmsV2List',
        name: 'pmsV2List',
        component: () => import('@/views/pmsV2/pmsV2List/pmsV2List'),
        meta: { title: '商品管理列表', icon: 'chanpinxinxi' }
      },
      {
        path: 'pmsV2Editor',
        // name: 'pmsV2Editor',
        component: () => import("@/views/pmsV2/pmsV2Editor/pmsV2Editor"),
        meta: { title: '商品管理编辑', icon: 'kandengguanli' },
        hidden: true
      },
    ]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/productClass',
    name: 'pms',
    meta: { title: '商品管理', icon: 'guanli' },
    children: [
      {
        path: 'productClass',
        name: 'productClass',
        component: () => import('@/views/pms/productClass/productClass'),
        meta: { title: '产品分类', icon: 'product-cate' }
      },
      {
        path: 'productInfo',
        name: 'productInfo',
        component: () => import('@/views/pms/productInfo/productInfo'),
        meta: { title: '产品信息', icon: 'chanpinxinxi' }
      },
      {
        path: 'productAliExpress',
        name: 'productAliExpress',
        component: () => import('@/views/pms/productAliExpress/productAliExpress'),
        meta: { title: '速卖通Listing', icon: 'sumaitong' }
      },
      {
        path: 'productEbay',
        name: 'productEbay',
        component: () => import('@/views/pms/productEbay/productEbay'),
        meta: { title: 'eBayListing', icon: 'ebay' }
      },
      {
        path: 'productAmazon',
        name: 'productAmazon',
        component: () => import('@/views/pms/productAmazon/productAmazon'),
        meta: { title: 'AmazonListing', icon: 'yamaxun' }
      }
    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/wareInventory',
    name: 'wms',
    meta: { title: '仓库管理', icon: 'cangkuguanli' },
    children: [
      {
        path: 'wareInventory',
        name: 'wareInventory',
        component: () => import('@/views/wms/wareInventory/wareInventory'),
        meta: { title: '所有库存', icon: 'kucun' },
        //alwaysShow: true
      },
      {
        path: 'wareList',
        name: 'wareList',
        component: () => import('@/views/wms/wareList/wareList'),
        meta: { title: '仓库列表', icon: 'kucunliebiao' },
        //alwaysShow: true
      },
    ]
  },
  {
    path: '/lm',
    component: Layout,
    redirect: '/lm/excel',
    name: 'lm',
    meta: { title: '报表管理', icon: 'baobiaoguanli' },
    children: [
      {
        path: 'excel',
        name: 'excel',
        component: () => import('@/views/lm/excel/excel'),
        meta: { title: '任务监控', icon: 'renwujiankong' },
        //alwaysShow: true
      },
      {
        path: 'excelData',
        name: 'excelData',
        component: () => import('@/views/lm/excelData/excelData'),
        meta: { title: '报告中心', icon: 'shujuzhongxin' },
        //alwaysShow: true
      },
      {
        path: 'listingMonitoring',
        name: 'listingMonitoring',
        component: () => import('@/views/lm/listingMonitoring/listingMonitoring'),
        meta: { title: 'listing监控', icon: 'jiankong' },
        //alwaysShow: true
      },
      {
        path: 'listingCheck',
        name: 'listingCheck',
        component: () => import('@/views/lm/listingCheck/listingCheck'),
        meta: { title: 'listing监控check', icon: 'jiance' },
        //alwaysShow: true
      },
      {
        path: 'excelTask',
        name: 'excelTask',
        component: () => import('@/views/lm/excelTask/excelTask'),
        meta: { title: 'EXCLE报告', icon: 'excle' },
        //alwaysShow: true
      },
      {
        path: 'excelPublish',
        name: 'excelPublish',
        component: () => import('@/views/lm/excelPublish/excelPublish'),
        meta: { title: '刊登统计', icon: 'excle' },
        //alwaysShow: true
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: { title: '权限', icon: 'ums' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin'),
        meta: { title: '用户列表', icon: 'ums-admin' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: { title: '角色列表', icon: 'ums-role' }
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu'),
        meta: { title: '分配菜单' },
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource'),
        meta: { title: '分配资源' },
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index'),
        meta: { title: '菜单列表', icon: 'ums-menu' }
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/ums/menu/add'),
        meta: { title: '添加菜单' },
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/ums/menu/update'),
        meta: { title: '修改菜单' },
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index'),
        meta: { title: '资源列表', icon: 'ums-resource' }
      },
      /*{
        path: 'systemParameter',
        name: 'systemParameter',
        component: () => import('@/views/ums/systemParameter/index'),
        meta: {title: '系统参数', icon: 'ums-resource'}
      },*/
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList'),
        meta: { title: '资源分类' },
        hidden: true
      }
    ]
  },
  {
    path: '/lazada',
    component: Layout,
    redirect: '/lazada/lzdPublish',
    name: 'lazada',
    meta: { title: 'lazada刊登', icon: 'lazada' },
    children: [
      {
        path: 'lzdClass',
        name: 'lzdClass',
        component: () => import('@/views/lazada/lzdClass/lzdClass'),
        meta: { title: 'Lazada分类', icon: 'Lazadapingtai' }
      },
      {
        path: 'lzdPublish',
        name: 'lzdPublish',
        component: () => import('@/views/lazada/lzdPublish/lzdPublish'),
        meta: { title: '刊登管理', icon: 'kandengguanli' }
      },
      {
        path: 'lzdPublishEditor',
        name: 'lzdPublishEditor',
        component: () => import('@/views/lazada/lzdPublish/lzdPublishEditor'),
        props: (route) => ({ routeSku: route.query.routeSku, routeTaskNo: route.query.routeTaskNo, routeStatus: route.query.routeStatus }),
        meta: { title: '刊登管理编辑', icon: 'kandengguanli' },
        hidden: true
      },
      {
        path: 'lzdCopyPublishEditor',
        name: 'lzdCopyPublishEditor',
        component: () => import('@/views/lazada/lzdPublish/lzdCopyPublishEditor'),
        props: (route) => ({ routeSku: route.query.routeSku, routeTaskNo: route.query.routeTaskNo, routeStatus: route.query.routeStatus }),
        meta: { title: '复制刊登管理编辑', icon: 'kandengguanli' },
        hidden: true
      },
      {
        path: 'lzdReadonly',
        name: 'lzdReadonly',
        component: () => import('@/views/lazada/lzdPublish/lzdReadonly'),
        props: (route) => ({ routeSku: route.query.routeSku, routeTaskNo: route.query.routeTaskNo, routeStatus: route.query.routeStatus }),
        meta: { title: '刊登管理查看', icon: 'kandengguanli' },
        hidden: true
      },
      {
        path: 'lzdListing',
        name: 'lzdListing',
        component: () => import('@/views/lazada/lzdListing/lzdListing'),
        meta: { title: 'Listing管理', icon: 'listing' }
      },
      {
        path: 'lzdListingEditor/:routeItemId/:routeSku',
        name: 'lzdListingEditor',
        component: () => import('@/views/lazada/lzdListing/lzdListingEditor'),
        props: true,
        meta: { title: 'Listing列表编辑', icon: 'listing' },
        hidden: true
      },
      {
        path: 'lzdCharge',
        name: 'lzdCharge',
        component: () => import('@/views/lazada/lzdCharge/lzdCharge'),
        meta: { title: '费率维护', icon: 'feishuai' }
      },
      {
        path: 'lzdQueue',
        name: 'lzdQueue',
        component: () => import('@/views/lazada/lzdQueue/lzdQueue'),
        meta: { title: 'Lazada队列', icon: 'duiliefuwu' }
      },
      {
        path: 'pullInfo',
        name: 'pullInfo',
        component: () => import('@/views/lazada/pullInfo/pullInfo'),
        meta: { title: '拉取信息', icon: 'pull' },
      }
    ]
  },
  {
    path: '/walmart',
    component: Layout,
    redirect: '/walmart/walmartClass',
    name: 'walmart',
    meta: { title: 'Walmart刊登', icon: 'woerma' },
    children: [
      {
        path: 'walmartClass',
        name: 'walmartClass',
        component: () => import('@/views/walmart/walmartClass/walmartClass'),
        meta: { title: 'Walmart分类', icon: 'woermafeilei' }
      },
      {
        path: 'walmartPublish',
        name: 'walmartPublish',
        component: () => import('@/views/walmart/walmartPublish/walmartPublish'),
        meta: { title: '刊登列表', icon: 'kandengguanli' },
      },
      {
        path: 'walmartListing',
        name: 'walmartListing',
        component: () => import('@/views/walmart/walmartListing/walmartListing'),
        meta: { title: 'Listing管理', icon: 'listing' },
      },
      {
        path: 'walmartEditor',
        name: 'walmartEditor',
        component: () => import('@/views/walmart/walmartEditor/walmartEditor'),
        props: (route) => ({ routeSku: route.query.routeSku, routeTaskNo: route.query.routeTaskNo, editorType: route.query.editorType, routeStatus: route.query.routeStatus }),
        meta: { title: '刊登编辑', icon: 'kandengguanli' },
        hidden: true
      },
      {
        path: 'walmartQueue',
        name: 'walmartQueue',
        component: () => import('@/views/walmart/walmartQueue/walmartQueue'),
        meta: { title: 'walmart队列', icon: 'duiliefuwu' },
      },
      {
        path: 'infringement',
        name: 'infringement',
        component: () => import('@/views/walmart/infringement/infringement'),
        meta: { title: '侵权禁售列表', icon: 'qinquan' },
      },
      {
        path: 'walmartFreight',
        name: 'walmartFreight',
        component: () => import('@/views/walmart/walmartFreight/walmartFreight'),
        meta: { title: '运费报价', icon: 'total-yesterday' },
      },
      {
        path: 'walmartUpdate',
        name: 'walmartUpdate',
        component: () => import('@/views/walmart/walmartUpdate/walmartUpdate'),
        meta: { title: 'Listing更新', icon: 'sms-new' },
      }
    ]
  },
  {
    path: '/selection',
    component: Layout,
    redirect: "",
    name: "selection",
    meta: { title: "选品管理", icon: "xuanpinguanli" },
    children: [
      {
        path: 'sensitiveWords',
        name: 'sensitiveWords',
        component: () => import('@/views/selection/sensitiveWords/sensitiveWords'),
        meta: { title: '敏感词库管理', icon: 'minganciku' }
      },
      {
        path: 'selectionLink',
        name: 'selectionLink',
        component: () => import('@/views/selection/selectionLink/selectionLink'),
        meta: { title: '添加链接', icon: 'product-brand' }
      },
      {
        path: 'selectionManagement',
        name: 'selectionManagement',
        component: () => import('@/views/selection/selectionManagement/selectionManagement'),
        meta: { title: '选品列表', icon: 'guanliliebiao' }
      },
      {
        path: 'productLibrary',
        name: 'productLibrary',
        component: () => import('@/views/selection/productLibrary/productLibrary'),
        meta: { title: '选品库', icon: 'chanpinku' }
      }
    ]
  },
  {
    path: '/common',
    component: Layout,
    redirect: "",
    name: "common",
    meta: { title: "公共模块", icon: "list" },
    children: [
      {
        path: 'sysImpower',
        name: 'sysImpower',
        component: () => import('@/views/common/sysImpower/sysImpower'),
        meta: { title: '渠道授权', icon: 'qudaoshouquan' },
        //alwaysShow: true
      },
      {
        path: 'sysImpower1688',
        name: 'sysImpower1688',
        component: () => import('@/views/common/sysImpower1688/sysImpower1688'),
        meta: { title: '1688授权', icon: 'timing' },
        // alwaysShow: true
      },
      {
        path: 'sysWatermark',
        name: 'sysWatermark',
        component: () => import('@/views/common/sysWatermark/sysWatermark'),
        props: true,
        meta: { title: '水印管理', icon: 'shuiyinguanli' },
      },
      {
        path: 'sysWatermarkEditor',
        // name: 'sysWatermarkEditor',
        component: () => import('@/views/common/sysWatermark/sysWatermarkEditor'),
        props: (route) => ({ id: route.query.id }),
        meta: { title: '水印编辑', icon: 'shuiyinguanli' },
        hidden: true
      },

      {
        path: 'walmartBrand',
        name: 'walmartBrand',
        component: () => import('@/views/common/walmartBrand/walmartBrand'),
        meta: { title: '品牌维护', icon: 'pinpai' },
      }, {
        path: 'comLogistics',
        name: 'comLogistics',
        component: () => import('@/views/common/comLogistics/comLogistics'),
        props: (route) => ({ id: route.query.id }),
        meta: { title: '物流属性配置', icon: 'menu' },
      },
      {
        path: 'sysSensitiveword',
        name: 'sysSensitiveword',
        component: () => import('@/views/common/sysSensitiveword/sysSensitiveword'),
        meta: { title: '敏感词库', icon: 'kucun' },
      },
      {
        path: 'upcList',
        name: "upcList",
        component: () => import('@/views/common/upcList/upcList'),
        meta: { title: 'upc列表', icon: 'upce' },
      },
      {
        path: 'sysTort',
        name: "sysTort",
        component: () => import('@/views/common/sysTort/sysTort'),
        meta: { title: '侵权记录', icon: 'upce' },
      }
    ]
  },
  {
    path: '/shopee',
    component: Layout,
    redirect: "",
    name: "shopee",
    meta: { title: "Shopee刊登", icon: "shopping" },
    children: [
      {
        path: 'shopeeClass',
        name: 'shopeeClass',
        component: () => import('@/views/shopee/shopeeClass/shopeeClass'),
        meta: { title: '平台类目', icon: 'woermafeilei' },
        //alwaysShow: true
      },
      {
        path: 'shopeeLogistics',
        name: 'shopeeLogistics',
        component: () => import('@/views/shopee/shopeeLogistics/shopeeLogistics'),
        meta: { title: '物流方式管理', icon: 'pinpai' },
        //alwaysShow: true
      }, {
        path: 'shopeeListing',
        name: 'shopeeListing',
        component: () => import('@/views/shopee/shopeeListing/shopeeListing'),
        meta: { title: 'Listing管理', icon: 'monitor' },
        //alwaysShow: true
      }, {
        path: 'shopeePublish',
        name: 'shopeePublish',
        component: () => import('@/views/shopee/shopeePublish/shopeePublish'),
        meta: { title: '刊登管理', icon: 'guanliliebiao' },
        //alwaysShow: true
      },
      {
        path: 'shopeeEditor',
        name: 'shopeeEditor',
        component: () => import('@/views/shopee/shopeeEditor/shopeeEditor'),
        props: (route) => ({ routeSku: route.query.routeSku, routeTaskNo: route.query.routeTaskNo, routeIsture: route.query.routeIsture, routeStatus: route.query.routeStatus }),
        meta: { title: '刊登编辑', icon: 'kandengguanli' },
        hidden: true
      },
      {
        path: 'shopeeListEditor',
        name: 'shopeeListEditor',
        component: () => import('@/views/shopee/shopeeEditor/shopeeListEditor'),
        props: (route) => ({ routeitemId: route.query.routeitemId, routeStatus: route.query.routeStatus }),
        meta: { title: '刊登编辑', icon: 'kandengguanli' },
        hidden: true
      },
      {
        path: 'shopeeQueue',
        name: 'shopeeQueue',
        component: () => import('@/views/shopee/shopeeQueue/shopeeQueue'),
        meta: { title: 'shopee队列', icon: 'duiliefuwu' },
      }, {
        path: 'shopeeBulkimport',
        name: 'shopeeBulkimport',
        component: () => import('@/views/shopee/shopeeBulkimport/shopeeBulkimport'),
        meta: { title: '批量导入刊登', icon: 'order' },
      },]
  },
  {
    path: '/rts',
    component: Layout,
    redirect: "",
    name: "rts",
    meta: { title: "RTS刊登", icon: "rts" },
    children: [
      {
        path: 'rtsClass',
        name: 'rtsClass',
        component: () => import('@/views/rts/rtsClass/rtsClass'),
        meta: { title: '平台类目', icon: 'woermafeilei' },
        //alwaysShow: true
      },
      {
        path: 'rtsProductGroup',
        name: 'rtsProductGroup',
        component: () => import('@/views/rts/rtsProductGroup/rtsProductGroup'),
        meta: { title: '产品分组', icon: 'chanpinfenzu' },
        //alwaysShow: true
      },
      {
        path: 'rtsPublish',
        name: 'rtsPublish',
        component: () => import('@/views/rts/rtsPublish/rtsPublish'),
        meta: { title: '刊登管理', icon: 'kandengguanli' },
        //alwaysShow: true
      },
      {
        path: 'rtsEditor',
        name: 'rtsEditor',
        component: () => import('@/views/rts/rtsEditor/rtsEditor'),
        meta: { title: '刊登编辑', icon: 'kandengguanli' },
        //alwaysShow: true
        hidden: true
      },
      {
        path: 'rtsTopsearch',
        name: 'rtsTopsearch',
        component: () => import('@/views/rts/rtsTopsearch/rtsTopsearch'),
        meta: { title: '热搜词', icon: 'user1' },
        //alwaysShow: true
      },
      {
        path: 'rtsListing',
        name: 'rtsListing',
        component: () => import('@/views/rts/rtsListing/rtsListing'),
        meta: { title: 'Listing管理', icon: 'monitor' },
        //alwaysShow: true
      },
      {
        path: 'rtsQueue',
        name: 'rtsQueue',
        component: () => import('@/views/rts/rtsQueue/rtsQueue'),
        meta: { title: '定时队列', icon: 'duiliefuwu' },
        //alwaysShow: true
      },

      {
        path: 'rtsRates',
        name: 'rtsRates',
        component: () => import('@/views/rts/rtsRates/rtsRates'),
        meta: { title: '费率维护', icon: 'image' },
        //alwaysShow: true
      }
    ]
  },
  {
    path: '/goten',
    component: Layout,
    redirect: '',
    name: 'goten',
    meta: { title: '冠通分销', icon: 'goten' },
    children: [
      {
        path: 'distributionOfGoods',
        name: 'distributionOfGoods',
        component: () => import('@/views/goten/distributionOfGoods/distributionOfGoods'),
        meta: { title: '分销商品', icon: 'guanliliebiao' },
      },
      {
        path: 'distributionLibrary',
        name: 'distributionLibrary',
        component: () => import('@/views/goten/distributionLibrary/distributionLibrary'),
        meta: { title: '分销库', icon: 'chanpinku' },
      }
    ]
  },
  {
    path: '/amazon',
    component: Layout,
    redirect: '',
    name: 'amazon',
    meta: { title: 'Amazon刊登', icon: 'amazon' },
    children: [
      {
        path: 'amazonClass',
        name: 'amazonClass',
        component: () => import('@/views/amazon/amazonClass/amazonClass'),
        meta: { title: '平台类目', icon: 'swagger' },
      },
      {
        path: 'amazonQueue',
        name: 'amazonQueue',
        component: () => import('@/views/amazon/amazonQueue/amazonQueue'),
        meta: { title: '定时队列', icon: 'duiliefuwu' },
      },
      {
        path: 'amazonListing',
        name: 'amazonListing',
        component: () => import('@/views/amazon/amazonListing/amazonListing'),
        meta: { title: 'Listing管理', icon: 'monitor' },
      },
      {
        path: 'amazonEditor',
        // name: 'amazonEditor',
        component: () => import('@/views/amazon/amazonEditor/amazonEditor'),
        props: (route) => ({ routeId: route.query.routeId, routeStatus: route.query.routeStatus }),
        meta: { title: '刊登编辑', icon: 'kandengguanli' },
        hidden: true
      },
      {
        path: 'amazonPublish',
        name: 'amazonPublish',
        component: () => import('@/views/amazon/amazonPublish/amazonPublish'),
        meta: { title: '刊登管理', icon: 'kandengguanli' },
      },
      {
        path: 'amazonReport',
        name: 'amazonReport',
        component: () => import('@/views/amazon/amazonReport/amazonReport'),
        meta: { title: '报表', icon: 'baobiaoguanli' },
      },
      {
        path: 'logisticsRemove',
        // name: 'logisticsRemove',
        component: () => import('@/views/amazon/amazonReport/logisticsRemove/logisticsRemove'),
        meta: { title: '', icon: 'baobiaoguanli' },
        hidden: true,
      },
      {
        path: 'logisticsRefund',
        // name: 'logisticsRefund',
        component: () => import('@/views/amazon/amazonReport/logisticsRefund/logisticsRefund'),
        meta: { title: '', icon: 'baobiaoguanli' },
        hidden: true,
      },
      {
        path: 'inventoryAge',
        // name: 'inventoryAge',
        component: () => import('@/views/amazon/amazonReport/inventoryAge/inventoryAge'),
        meta: { title: '', icon: 'baobiaoguanli' },
        hidden: true,
      },
      {
        path: 'classification',
        // name: 'classification',
        component: () => import('@/views/amazon/amazonReport/classification/classification'),
        meta: { title: '', icon: 'baobiaoguanli' },
        hidden: true,
      },
      {
        path: 'logisticsWarehousing',
        // name: 'classification',
        component: () => import('@/views/amazon/amazonReport/logisticsWarehousing/logisticsWarehousing'),
        meta: { title: '', icon: 'baobiaoguanli' },
        hidden: true,
      },
      {
        path: 'logisticsInventory',
        // name: 'classification',
        component: () => import('@/views/amazon/amazonReport/logisticsInventory/logisticsInventory'),
        meta: { title: '', icon: 'baobiaoguanli' },
        hidden: true,
      },
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '',
    name: 'finance',
    meta: { title: '财务管理', icon: 'order-return-reason' },
    children: [
      {
        path: 'financeCost',
        name: 'financeCost',
        component: () => import('@/views/finance/financeCost/financeCost'),
        meta: { title: '费用申请', icon: 'edit' },
      },
    ]
  },
  {
    path: '/logistics',
    component: Layout,
    redirect: '',
    name: 'logistics',
    meta: { title: '物流管理', icon: 'order-return-reason' },
    children: [
      {
        path: 'logisticsQuotation',
        name: 'logisticsQuotation',
        component: () => import('@/views/logistics/logisticsQuotation/logisticsQuotation'),
        meta: { title: '运费报价', icon: 'edit' },
      },
      {
        path: 'serviceProvider',
        name: 'serviceProvider',
        component: () => import('@/views/logistics/serviceProvider/serviceProvider'),
        meta: { title: '服务商管理', icon: 'ums-role' },
      },
      {
        path: 'reportingRules',
        name: 'reportingRules',
        component: () => import('@/views/logistics/reportingRules/reportingRules'),
        meta: { title: '申报规则', icon: 'table' },
      },
    ]
  },
  {
    path: '/track',
    component: Layout,
    redirect: '',
    name: 'track',
    meta: { title: '物流轨迹', icon: 'order-return-reason' },
    children: [
      {
        path: 'trackNode',
        name: 'trackNode',
        component: () => import('@/views/track/trackNode/trackNode'),
        meta: { title: '物流节点', icon: 'edit' },
      },
      {
        path: 'trackTrace',
        name: 'trackTrace',
        component: () => import('@/views/track/trackTrace/trackTrace'),
        meta: { title: '物流追踪', icon: 'edit' },
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    redirect: '',
    name: 'supplier',
    meta: { title: '供应商管理', icon: 'order-return-reason' },
    children: [
      {
        path: 'supplierData',
        name: 'supplierData',
        component: () => import('@/views/supplier/supplierData/supplierData'),
        meta: { title: '供应商资料', icon: 'edit' },
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router


