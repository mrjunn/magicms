import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

console.log('store.state.menus', store.state.menus)
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      // {
      //   path: '/login',
      //   redirect: to => {
      //     return 'AssistantHello'
      //   }
      // },
      {
        path: '/',
        name: 'Index',
        component: () => import('@/modules/index/_sm_/Index.vue')
      },
      {
        path: 'magic', // 超级成员内部业务办公
        component: () => import('@/views/Office.vue'),  
        children: [
          {
            path: '/',
            name: 'MagicIndex',
            component: () => import('@/modules/magic/Index.vue')
          },
          {
            path: 'settings/menu/supmemb',
            name: 'SupMembMenu',
            component: () => import('@/modules/magic/settings/menu/SupMembMenu.vue')
          },
          {
            path: 'settings/menu/member',
            name: 'MemberMenu',
            component: () => import('@/modules/magic/settings/menu/MemberMenu.vue')
          },
          {
            path: '*',
            name: 'BadRoute',
            component: () => import('@/components/BadRoute.vue')
          },
        ]
      },
      // {
      //   path: 'office', // 办公菜单页
      //   component: () => import('@/views/Office.vue'),  
      //   // 二级路由
      //   children: [ // 配置菜单后 获取菜单 push到children里，第一个元素的path设成'/'
      //     {
      //       path: '/', // path: '/',
      //       name: 'MemberIndex',
      //       component: () => import('@/modules/office/_m_/Module1Index.vue')
      //     },
      //     {
      //       path: '*',
      //       name: 'BadRoute',
      //       component: () => import('@/components/BadRoute.vue')
      //     },
      //   ]
      // },
      {
        path: '*',
        name: 'BadRoute',
        component: () => import('@/components/BadRoute.vue')
      },
    ]
  },
  {
    path: '*',
    redirect: '/'
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})


// 路由守卫
router.beforeEach((to, from, next) => {
  // console.log('store.state.token', store.state.token)
  // if (to.path !== '/' && store.state.token === '') next({ path: '/' })
  if (to.path !== '/login' && store.state.userData.token === '') next({ path: '/login' })
  else next()
})

export default router
