<template>
  <el-row :gutter="20" class="header">
    <el-col :span="18"><i class="iconfont iconmenuhamburger1"></i>江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="6">
      <el-dropdown>
          <img width="30" :src="$store.state.user.photo">
          <span class="el-dropdown-link">
            {{ $store.state.user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">用户设置</el-dropdown-item>
            <!-- 清除用户存储信息 -->
            <!-- 我们可以使用.native 事件修饰符将原始的HTML页面注册到组件的根元素 -->
            <el-dropdown-item icon="el-icon-circle-plus" @click.native="handleLogin">退出</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { removeUser } from '@/utils/auth'
export default {
  name: 'AppHeader',
  data () {
    return {
      // userInfo: {}
    }
  },
  created () {
    // this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
    // this.userInfo = getUser()
  },
  methods: {
    handleLogin () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除本地存储中的user_info
        // window.localStorage.removeItem('user_info')
        removeUser()
        // 跳转到登录页
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  line-height: 60px;
  i {
    font-size: 20px;
    margin-right: 10px;
    font-weight:700;
  }
  img {
    width: 40px;
    border-radius: 20px;
    vertical-align: middle;
    margin-left: 10px;
  }

}
</style>
