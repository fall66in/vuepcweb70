<template>
  <div>
      <el-card class="box-card  header">
        <div slot="header" class="clearfix" >
            <span>数据筛选</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>文章列表</span>
        </div>
        <!--
        table表格不需要我们手动v-for遍历
        只需要将数组数据交给table表格的data属性
        然后配置el-table-colum表格列组件

        label 列头标题
        prop 遍历项中的数据字段
        width 列的宽度

        表格默认把数据当做文本去输出
        如果需要其他数据格式，可以自定义表格列
        -->
                <el-table
            :data="articles"
            style="width: 100%"
            class="table">
            <el-table-column
                label="封面"
                width="180">
                <!--
                   template 中的内容就是自定义表格列内容
                   如果需要在template中访问遍历项数据，则需要给template配置slot-scope
                   slot-scope 属性名是固定的
                   scope 值是自己随便起的名字
                   结果就是我们可以通过scope.row访问到当前遍历项对象，就好比我们自己遍历的item一样
                 -->
                <template slot-scope="scope">
                  <!-- 这是只有一张图片 -->
                  <!-- <img :src="scope.row.cover.images[0]"> -->

                  <!-- 这是有多张图片 -->
                  <img
                  width="20"
                  v-for="item in scope.row.cover.images"
                  :key="item"
                  :src="item">
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题"
                width="180">
            </el-table-column>
            <el-table-column
                label="状态"
                width="180">
                <template slot-scope="scope">
                   <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="pubdate"
                label="发布时间"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="1000">
            </el-pagination>
      </el-card>

  </div>
</template>

<script>
// import { getUser } from '@/utils/auth'
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          lable: '审核失败'
        },
        {
          type: 'danger',
          lable: '已删除'
        }
      ]
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async loadArticles () {
      // const token = getUser().token
      // 除了登录相关接口之后，其他接口都必须在请求头中通过Authorization 字段提供用户token
      // 当我们登录成功，服务端会生成一个token令牌，放到用户信息中
      const data = await this.$http({
        method: 'GET',
        url: '/articles'
      })
      // console.log(data) // 返回401，token过期或未传
      this.articles = data.results
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 20px;
}
.table {
  margin-bottom: 20px;
}
</style>
