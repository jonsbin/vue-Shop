import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/welcome.vue'
import Users from '@/components/user/Users.vue'
import Rights from '@/components/pwer/rights.vue'
import Roles from '@/components/pwer/roles.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {path:'/',redirect:'/login'},
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {path:'/home',name:Home,
      component:Home,
      redirect:'/welcome',
      children:[
      {path:'/welcome', component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles}
    ]}
  ]
})

//挂载路由导航守卫

router.beforeEach((to,from,next)=>{
  //to将要访问的路径
  //from代表哪个路径跳转而来
  //next是一个函数，表示放行 next()放行 next('/login')
  if(to.path == '/login') return next();
  //获取toke
  const tokeStr = window.sessionStorage.getItem('token');
  if(!tokeStr) return next('/login');
  next();
})

export default router