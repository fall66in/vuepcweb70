<template>
    <el-card>
       <div slot="header">
         <span>评论管理</span>
       </div>
       <el-table style="width: 100%" :data="articles">
          <el-table-column prop="title" label="标题" width="400">
          </el-table-column>
          <el-table-column prop="total_comment_count" label="总评论数" width="180">
          </el-table-column>
          <el-table-column prop="fans_comment_count" label="评论粉丝数" width="180">
          </el-table-column>
          <el-table-column prop="address" label="允许评论" width="180">
             <template slot-scope="scope">
                <el-switch
                  :disabled="scope.row.disabled"
                  v-model="scope.row.comment_status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleChangeStatus(scope.row)">
                </el-switch>
             </template>
          </el-table-column>
      </el-table>
      <el-pagination
        class="page"
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="pageSize"
        :total="totalCount"
        :disabled="articleLoading"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
</template>

<script>
export default {
  name: 'ArticleComment',
  data () {
    return {
      articles: [],
      pageSize: 10, // pageSize每页有十条
      totalCount: 0, // 总数据量
      page: 1, // 当前页码
      articleLoading: false
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async loadArticles () {
      this.articleLoading = true
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            page: this.page, // 页码
            per_page: this.pageSize, // 每页大小
            response_type: 'comment'
          }
        })
        this.totalCount = data.total_count
        // 手动创造一个数据disabled，用来控制每一行的switch开关的启用状态
        data.results.forEach(item => {
          item.disabled = false
        })
        this.articles = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载文章列表失败')
      }
      this.articleLoading = false
    },
    async handleChangeStatus (item) {
      try {
        // 当前行的switch开关禁用
        item.disabled = true
        await this.$http({
          method: 'PUT',
          url: '/comments/status',
          params: {
            article_id: item.id.toString() // 注意：数据id转成字符串
          },
          data: {
            allow_comment: item.comment_status
          }
        })
        this.$message({
          type: 'success',
          message: `${item.comment_status ? '启用' : '禁用'} 修改评论状态成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('修改评论失败')

        // 评论状态失败，让客户端的评论状态回到原来的状态
        item.comment_status = !item.comment_status
      }
      // 启用当前行的switch的点击状态
      item.disabled = false
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
.page {
  margin-top: 20px;
  text-align: center;
}
</style>
