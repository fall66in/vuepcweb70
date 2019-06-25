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
// 引入公共样式文件，最好在element样式文件之后，可以自定义修改element内置样式
import './styles/index.less'

// 配置axios的基础路径
// 发请求的时候就不需要每次都写http://xxx
// 例如我要请求登录，直接axios
// 路径最后的/，多退少补
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

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
