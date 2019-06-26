import Vue from 'vue'
// import router from './router'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 加载进度条的路由css文件
import 'nprogress/nprogress.css'
// 先找文件，没有就找目录
// 如果找到目录，优先加载目录中的index
import router from './router'
import axios from 'axios'
import { getUser, removeUser } from '@/utils/auth'
// 引入公共样式文件，最好在element样式文件之后，可以自定义修改element内置样式
import './styles/index.less'

// 配置axios的基础路径
// 发请求的时候就不需要每次都写http://xxx
// 例如我要请求登录，直接axios
// 路径最后的/，多退少补
// axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'

// axios请求拦截器：axios发出去的请求会先经过这里
// return config 允许请求发送的开关
// 我们可以在这之前进行一些业务逻辑操作
axios.interceptors.request.use(config => {
  // console.log('请求进入了拦截器')
  const user = getUser()
  // config 是本次请求的相关配置对象
  // console.log(config)

  // 如果有user数据，则往本次请求中添加用户token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
    // config.headers.Authorization = `Bearer 123`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// axios响应拦截器:axios收到的响应会先经过这里

axios.interceptors.response.use(response => { // >=200 && < 400 的状态码会进入这里
  // console.log('进入响应拦截器', response)
  // response就是响应结果对象
  // 这里将response原样返回，那么你发请求的地方收到的就是response
  // 我们可以控制请求收到的响应数据格式
  if (typeof response.data === 'object' && response.data.data) { // 如果response.data是对象的话，就这么输出
    return response.data.data
  } else { // 如果response.data是字符串或数字时，原封不动的输出
    return response.data
  }
}, error => { // >=400的状态码进入这里
  // console.log('状态码异常', error)
  // 如果用户token无效，让其跳转到登录页
  if (error.response.status === 401) {
    // 清除本地存储中的无效token的用户信息
    removeUser()
    // 让他返回登录页面
    router.push({
      name: 'login'
    })
  }
  // console.log(dir)
  return Promise.reject(error)
})

Vue.use(ElementUI)

// 所有组件都是vue实例
// 我们可以把一些需要在组件中频繁使用的成员放到vue.prototype 中
// Vue.prototype.foo = 'bar'

// 给vue原型扩展成员的时候，最好加上一个$前缀，避免和组件内部的数据成员冲突
// 几乎所有组件都去发请求，这样配置完之后，我们再组件中发请求就可以直接this.$http({method、url})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
