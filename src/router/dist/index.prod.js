"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _vue=_interopRequireDefault(require("vue")),_vueRouter=_interopRequireDefault(require("vue-router")),_Login=_interopRequireDefault(require("@/components/Login.vue")),_Home=_interopRequireDefault(require("@/components/Home.vue")),_welcome=_interopRequireDefault(require("@/components/welcome.vue")),_Users=_interopRequireDefault(require("@/components/user/Users.vue")),_rights=_interopRequireDefault(require("@/components/pwer/rights.vue")),_roles=_interopRequireDefault(require("@/components/pwer/roles.vue"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}_vue.default.use(_vueRouter.default);var router=new _vueRouter.default({routes:[{path:"/",redirect:"/login"},{path:"/login",name:"Login",component:_Login.default},{path:"/home",name:_Home.default,component:_Home.default,redirect:"/welcome",children:[{path:"/welcome",component:_welcome.default},{path:"/users",component:_Users.default},{path:"/rights",component:_rights.default},{path:"/roles",component:_roles.default}]}]});router.beforeEach(function(e,r,t){return"/login"==e.path?t():window.sessionStorage.getItem("token")?void t():t("/login")});var _default=router;exports.default=router;