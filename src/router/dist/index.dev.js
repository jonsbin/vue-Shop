"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Login = _interopRequireDefault(require("@/components/Login.vue"));

var _Home = _interopRequireDefault(require("@/components/Home.vue"));

var _welcome = _interopRequireDefault(require("@/components/welcome.vue"));

var _Users = _interopRequireDefault(require("@/components/user/Users.vue"));

var _rights = _interopRequireDefault(require("@/components/pwer/rights.vue"));

var _roles = _interopRequireDefault(require("@/components/pwer/roles.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var router = new _vueRouter["default"]({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'Login',
    component: _Login["default"]
  }, {
    path: '/home',
    name: _Home["default"],
    component: _Home["default"],
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: _welcome["default"]
    }, {
      path: '/users',
      component: _Users["default"]
    }, {
      path: '/rights',
      component: _rights["default"]
    }, {
      path: '/roles',
      component: _roles["default"]
    }]
  }]
}); //挂载路由导航守卫

router.beforeEach(function (to, from, next) {
  //to将要访问的路径
  //from代表哪个路径跳转而来
  //next是一个函数，表示放行 next()放行 next('/login')
  if (to.path == '/login') return next(); //获取toke

  var tokeStr = window.sessionStorage.getItem('token');
  if (!tokeStr) return next('/login');
  next();
});
var _default = router;
exports["default"] = _default;