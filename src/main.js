// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入全局样式
import './assets/css/global.css';
var Less = require('Less')
Vue.use(Less);

import axios from 'axios'
//配置请求的跟路径
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/';
//通过axios请求拦截器添加token，保证有效获取数据的权限。
//axios请求拦截
axios.interceptors.request.use(config=>{
  //为请求头对象添加token验证的Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须返回config
  return config
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
