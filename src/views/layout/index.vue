<template>
  <el-container>
    <el-aside width="200px">
      <!-- 侧边栏 -->
      <AppAside></AppAside>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
         <AppHeader></AppHeader>
      </el-header>
      <!-- 主体 -->
      <el-main>
        <!--
          router-view默认会缓存x-y相同组件
          之前如下可以使用：
          <keep-alive  :key="$route.path">
              <router-view></router-view>
          </keep-alive>
         -->
        <router-view :key="$route.path"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background-color:rgb(84, 92, 100);
}
.el-main {
  background-color: #f3f4f6;
}
</style>
