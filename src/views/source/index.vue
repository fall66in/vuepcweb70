<template>
   <el-card>
     <div slot="header">
        <span>素材管理</span>
     </div>
     <div class="action" >
       <el-radio-group v-model="active">
         <el-radio-button label="全部"></el-radio-button>
         <el-radio-button label="收藏"></el-radio-button>
       </el-radio-group>
       <el-button type="primary">上传图片</el-button>
     </div>
     <el-row :gutter="20">
       <el-col :span="6" v-for="item in images" :key="item.id" style="margin-bottom: 10px">
        <el-card :body-style="{ padding: '0px' }">
          <img src="item.url" class="image" style="max-width: 100%">
          <div style="padding: 10px;">
            <div class="bottom clearfix">
              <el-button
              type="primary"
              plain
              class="button"
              :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle
              @click="handleCollect(item)"></el-button>
              <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              circle
              class="button"
              @click="handleDelete(item)"></el-button>
            </div>
          </div>
        </el-card>
       </el-col>
     </el-row>
     <el-pagination
        class="page"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="page"
        :disabled="imageLoading"
        :total="totalCount"
        @current-change="handleCurrentChange">
      </el-pagination>
   </el-card>
</template>

<script>
export default {
  name: 'AppSource',
  data () {
    return {
      active: '全部',
      images: [],
      pageSize: 12, // pageSize每页有十条
      totalCount: 0, // 总数据量
      page: 1,
      imageLoading: false
    }
  },
  created () {
    this.loadImage()
  },
  methods: {
    async loadImage (collect = false) {
      this.imageLoading = true
      try {
        const data = await this.$http({
          methods: 'GET',
          url: '/user/images',
          params: {
            collect, // 是否查询收藏图片，默认查询所有
            page: this.page,
            per_page: this.pageSize
          }
        })
        console.log(data)
        this.images = data.results
        this.totalCount = data.total_count
      } catch (err) {
        console.log(err)
        this.$message.error('加载图片素材失败')
      }
      this.imageLoading = false
    },
    async handleCollect (item) {
      const collect = !item.is_collected
      try {
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect
          }
        })
        item.is_collected = data.collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('收藏图片素材失败')
      }
    },
    handleCurrentChange (page) {
      console.log(page)
      this.page = page
      this.loadImage()
    },
    async handleDelete (item) {
      if (!window.confirm('确定要删除吗')){
        return
      }
      try {
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })
        this.$message({
          type: 'success',
          message: '删除素材成功'
        })
        this.loadImage()
      } catch (err) {
        this.$message.error('删除素材失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.action {
  display:flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.bottom {
  display:flex;
  justify-content: center;
}
.page {
  text-align: center;
  margin-top: 20px;
}
</style>
