<template>
  <el-row :gutter="20" class="header">
    <el-col :span="18"><i class="iconfont iconmenuhamburger1"></i>江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="6">
      <el-dropdown>
          <img src="http://toutiao.meiduo.site/Fkj6tQi3xJwVXi1u2swCElotfdCi">
          <span class="el-dropdown-link">
            {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">用户设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">退出</el-dropdown-item>
          </el-dropdown-menu>
    </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
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
