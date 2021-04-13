'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //生产环境
  // NODE_ENV: '"production"',
  // BASE_API: '"https://admin.lemontreegood.com"',
  // EXCEL_BASE_API: '"https://excels.lemontreegood.com"',
  // WS_API: '"wss://admin.lemontreegood.com"',
  // WALMART_API: '"https://admin.lemontreegood.com"',
  // SHOPPE_API: '"https://admin.lemontreegood.com"',
  // SELECT_API: '"https://admin.lemontreegood.com"',
  // RTS_API: '"https://admin.lemontreegood.com"',
  // GOTEN_API: '"https://admin.lemontreegood.com"',
  // AMAZON_API: '"https://admin.lemontreegood.com"',
  // LOGISTICS_API: '"https://admin.lemontreegood.com"',
  // PMSV2_API: '"https://admin.lemontreegood.com"',
  // FINANCE_API: '"https://admin.lemontreegood.com"',

  // 测试环境
  // BASE_API: '"http://47.115.128.207:8082"',
  // EXCEL_BASE_API: '"http://47.115.128.207:8087"',
  // WS_API: '"ws://47.115.128.207:8082"',
  // WALMART_API: '"http://47.115.128.207:8083"',
  // SHOPPE_API: '"http://47.115.128.207:8084"',
  // SELECT_API: '"http://47.115.128.207:8085"',
  // RTS_API: '"http://47.115.128.207:8086"',
  // GOTEN_API: '"http://47.115.128.207:8088"',
  // AMAZON_API: '"http://47.115.128.207:8089"',
  // LOGISTICS_API: '"http://47.115.128.207:8092"',
  // PMSV2_API: '"http://112.74.169.38:8091"',
  // FINANCE_API: '"http://112.74.169.38:18087"',

  // 开发环境
  BASE_API: '"http://192.168.60.94:8082"',
  EXCEL_BASE_API: '"http://192.168.60.60:8087"',
  WS_API: '"ws://192.168.60.60:8082"',
  WALMART_API: '"http://192.168.60.61:8083"',
  SHOPPE_API: '"http://192.168.60.60:8084"',
  SELECT_API: '"http://192.168.60.87:8085"',
  RTS_API: '"http://192.168.60.101:8086"',
  GOTEN_API: '"http://192.168.60.111:8088"',
  AMAZON_API: '"http://192.168.60.106:8089"',
  PMSV2_API: '"http://192.168.60.63:8091"',
  LOGISTICS_API: '"http://192.168.60.51:8092"',
  FINANCE_API: '"http://192.168.60.106:18087"',
  SUPPLIER_API: '"http://192.168.60.94:8093"'
})


