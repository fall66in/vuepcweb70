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
             <template>

             </template>
          </el-table-column>
      </el-table>
    </el-card>
</template>

<script>
export default {
  name: 'ArticleComment',
  data () {
    return {
      articles: []
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async loadArticles () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            response_type: 'comment'
          }
        })
        this.articles = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载文章列表失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
