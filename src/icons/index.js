import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)


const re = /\.\/(.*)\.svg/
const getSvgIconsName = requireContext => requireContext.keys().map(i => i.match(re)[1])
const svgIcons = getSvgIconsName(req)

export default svgIcons
