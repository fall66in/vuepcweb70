<template>
    <!-- el-menu
        default-active: 设置默认激活项
        open、close:当菜单展开和收起时会被触发
      el-submenu
        index 用来区分不同的导航项目的，可以用作路由导航路径，必须唯一，否则会出现菜单冲突,唯一就可以，不管取什么名字
        router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
    -->
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
      >
      <el-menu-item index="/">
        <i class="iconfont icondocument"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="iconfont iconedit"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item index="/publicArticle">
          <i class="iconfont iconedit"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/article">
        <i class="iconfont iconedit"></i>
        <span slot="title">内容列表</span>
      </el-menu-item>
      <el-menu-item index="/commentList">
        <i class="iconfont iconedit"></i>
        <span slot="title">评论列表</span>
      </el-menu-item>
      <el-menu-item index="/sourceList">
        <i class="iconfont iconedit"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont iconfensi"></i>
          <span>粉丝管理</span>
        </template>
        <el-menu-item index="2-1">
          <i class="iconfont iconfensi"></i>
          <span slot="title">图文数据</span>
        </el-menu-item>
        <el-menu-item index="2-2">
        <i class="iconfont iconfensi"></i>
        <span slot="title">粉丝概况</span>
      </el-menu-item>
      <el-menu-item index="2-3">
        <i class="iconfont iconfensi"></i>
        <span slot="title">粉丝画像</span>
      </el-menu-item>
      <el-menu-item index="2-4">
        <i class="iconfont iconfensi"></i>
        <span slot="title">粉丝列表</span>
      </el-menu-item>
    </el-submenu>
      <el-menu-item index="/userList" >
        <i class="iconfont iconaccout"></i>
        <span slot="title">账户信息</span>
      </el-menu-item>
    </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {}
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
i {
  font-size: 25px;
  margin-right: 10px;
}
</style>
