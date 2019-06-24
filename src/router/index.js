import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
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
      name: 'layout', // layout显示到跟组件的路由出口
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
