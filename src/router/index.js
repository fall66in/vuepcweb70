import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'

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
        },
        {
          name: 'articleList', // 文章列表
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'publicArticles', // 发布文章
          path: '/publicArticle',
          component: () => import('@/views/publicArticle')
        },
        {
          name: 'publicArticles-edit', // 编辑文章
          path: '/publicArticle/:id',
          component: () => import('@/views/publicArticle')
        },
        {
          name: 'commentList', // 评论列表
          path: '/commentList',
          component: () => import('@/views/comment')
        },
        {
          name: 'userList', // 账户设置
          path: '/userList',
          component: () => import('@/views/account')
        },
        {
          name: 'sourceList', // 素材管理
          path: '/sourceList',
          component: () => import('@/views/source')
        },
        {
          name: 'fansList', // 粉丝管理
          path: '/fansList',
          component: () => import('@/views/fansStart')
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
  // const userInfo = window.localStorage.getItem('user_info')
  const userInfo = getUser()
  if (to.path !== '/login') {
    // 非登录页
    //   如果登录了，允许通过
    //   没有登录，跳转到登录页面
    if (!userInfo) {
      // 如果来自登录页的页面，是不会重新进行页面导航的，也就不会触发后面的afterEach钩子
      // 所以在这里手动结束动画，防止出现在登录页访问其他页面顶部一直loading的问题
      if (from.path === '/login') {
        // 关闭进度条
        nprogress.done()
      }
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
