import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   // name为路由的名字
    //   name: 'home',
    //   path: '/',
    //   // 在整个项目中，模板路径中的@表示的是src目录
    //   // 无论你当前模块在哪里，@都可以直接定位到src// 默认加载一个目录可以加载他的index.js,index.vue,index.json...
    //   component: () => import('@/views/home')
    // },
    {
      // name: 'layout', // layout显示到跟组件的路由出口，使用JavaScript命名路由导航不会渲染默认子路由
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有children路由现在都在父路由中的router-view中
        {
          name: 'home',
          path: '', // 父路由的默认内容
          component: () => import('@/views/home')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      // 懒加载
      component: () => import('@/views/login')
    }
  ]
})
// 全局前置守卫
// 当你访问路由页面的时候，会进入这里
// to 要去哪里的相关参数
// from 来自哪里的相关数据
// next 允许通过的方法
router.beforeEach((to, from, next) => {
  // 路由导航前开启进度条
  nprogress.start()
  // console.log(to)
  const userInfo = window.localStorage.getItem('user_info')
  if (to.path !== '/login') {
    // 非登录页
    //   如果登录了，允许通过
    //   没有登录，跳转到登录页面
    if (!userInfo) {
      next({ name: 'login' })
      // next('/login')
      // next({ path: '/login' })
    } else {
      next()
    }
  } else {
    // 登录页面
    //   没有登录，允许通过
    //   登录了，不允许通过
    if (!userInfo) {
      next()
    } else {
      // next(false) // 中断当前导航
      window.location.href = '/#/'
      window.location.reload()
    }
  }
})
// 全局后置守卫
router.afterEach((to, from) => {
  //  路由导航结束后关闭进度条
  nprogress.done()
})
export default router
