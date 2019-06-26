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
                label="操作">
                <template>
                  <el-button size="mini" type="primary" plain>修改</el-button>
                  <el-button size="mini" type="danger" plain>删除</el-button>
                </template>
            </el-table-column>
            </el-table>
            <!--
            数据分页
            page-size 配置每页大小，默认是10
            total 用来配置总记录数
            分页组件会根据每页大小和总记录数进行分页
            current-change:currentPage 改变时会触发
            -->
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="totalCount"
              @current-change="handleCurrentChange">
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
      ],
      pageSize: 10, // pageSize每页有十条
      totalCount: 0, // 总数据量
      page: 1 // 当前页码
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
        url: '/articles',
        params: {
          page: this.page, // 页码
          per_page: this.pageSize // 每页大小
        }
      })
      // console.log(data) // 返回401，token过期或未传
      this.articles = data.results
      this.totalCount = data.total_count
    },
    // 回调函数当前页
    handleCurrentChange (page) {
      console.log(page)
      // 将数据中的页面修改为当前最新改变的数据页码
      this.page = page
      // 页码改变，页面加载当前文字列表
      this.loadArticles()
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
