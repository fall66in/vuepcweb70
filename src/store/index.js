// vuex:集中式状态（数据）管理
//   1.npm i Vuex
//   2.在 store/index.js中
// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)
// 我们把不好进行组件通信交互的组件数据放在这里

// 使用从这里使用，修改也从这里修改
// 不要直接在组件中this.$store.state = xxx 操作修改,调试工具观察不到，也没有历史记录
// 怎么修改?
// 正确做法是： 在store中定义mutation修改state状态
//  mutation 就好比容器的methods
// 说白了正确的做法就是1.在store中定义一个mutation来修改state状态2.在组件中调用mutation函数完成对状态的修改
// this.$store.commit('mutation函数名称')调用mutation函数，或者提交mutation
// 这里的数据是和任何组件都无关的
// 这里的数据，任何组件都可以访问和修改
// 而且这里的数据也是响应式的，数据改变也会影响组件视图的更新

import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, saveUser } from '@/utils/auth'

Vue.use(Vuex)

// 如果在模块化构建系统中，请确保在开头调用了 Vue.use(Vuex)

const store = new Vuex.Store({
  // state 中的数据可以被任何组件访问
  //  在组件中直接this.$store.states
  state: {
    user: getUser() || {} // user 的初始数据来自本地存储
  },
  mutations: {
    // mutation函数默认接受一个参数：state，也就是容器的state
    // 我们可以在这里通过state.xxx = xxx 完成对容器状态的修改
    changeUser (state, user) {
      // 将参数user合并到state.user中，说白了就是对象拷贝
      Object.assign(state.user, user)
      // 将程序中最新的用户信息重新写入本地存储，防止刷新等到一个旧的用户信息
      saveUser(state.user)
    }
  }
})

export default store
