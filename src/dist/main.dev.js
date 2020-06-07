"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App"));

var _router = _interopRequireDefault(require("./router"));

var _elementUi = _interopRequireDefault(require("element-ui"));

require("element-ui/lib/theme-chalk/index.css");

require("./assets/css/global.css");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
_vue["default"].use(_elementUi["default"]); //导入全局样式


var Less = require('Less');

_vue["default"].use(Less);

//配置请求的跟路径
_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'; //通过axios请求拦截器添加token，保证有效获取数据的权限。
//axios请求拦截

_axios["default"].interceptors.request.use(function (config) {
  //为请求头对象添加token验证的Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token'); //必须返回config

  return config;
});

_vue["default"].prototype.$http = _axios["default"];
_vue["default"].config.productionTip = false;
/* eslint-disable no-new */

new _vue["default"]({
  el: '#app',
  router: _router["default"],
  components: {
    App: _App["default"]
  },
  template: '<App/>'
});