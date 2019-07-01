<template>
   <el-card>
     <div slot="header">
        <span>素材管理</span>
     </div>
     <div class="action" >
       <el-radio-group v-model="active">
         <!-- click,dbclick 是原生的DOM事件
         el-xxx是什么？这是组件标签
         el-button 怎么有呢？因为这个组件将内部的点击事件，做了对外发布$emit
         使用@click给el-button注册点击事件，只是让你看起来像在注册点击事件，实则是他在内部将原生DOM的点击事件做了对外发布$emit('click',事件参数)
         如果想要给一个组件注册一个原生事件，@原生事件.native -->
         <el-radio-button
         label="全部"
         @click.native="loadImage(false)"
         ></el-radio-button>
         <el-radio-button
         label="收藏"
         @click.native="loadImage(true)"
         ></el-radio-button>
       </el-radio-group>
       <!--
         这里我们可以直接使用upload上传组件进行图片上传
         upload 组件支持自动请求，不用我们自己写代码，只需要配置一下请求接口
         如果要使用它默认的请求能力，就无法使用我们在axios中做的那些配置了，例如baseURL
         1.action: 请求地址
         2.on-success 文件上传成功的钩子
         3.headers 请求头
         :on-success="loadImages"
           将loadImages配置为on-success的成功调用函数
           那么当上传成功的时候，upload组件就会调用loadImage(response, file, fileList)
           loadImage函数，期望参数是一个布尔值
       -->
       <el-upload
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
          name="image"
          :on-success= "handleSuccess"
          :show-file-list = false>
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
     </div>
     <el-row :gutter="20">
       <el-col :span="4" v-for="item in images" :key="item.id" style="margin-bottom: 10px; width:200px;height: 200px;">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="max-width:100%">
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
        :disabled="Loadingimage"
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
      Loadingimage: false
    }
  },
  created () {
    this.loadImage()
  },
  methods: {
    async loadImage (collect = false) {
      this.Loadingimage = true
      try {
        const data = await this.$http({
          method: 'GET',
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
      this.Loadingimage = false
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
      if (!window.confirm('确定要删除吗')) {
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
    },
    handleSuccess () {
      this.loadImage()
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
