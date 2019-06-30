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
              <el-button type="primary" plain class="button" :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle ></el-button>
              <el-button type="danger" icon="el-icon-delete" plain circle class="button" ></el-button>
            </div>
          </div>
        </el-card>
       </el-col>
     </el-row>
   </el-card> 
</template>

<script>
export default {
  name: 'AppSource',
  data () {
    return {
      active: '全部',
      images: []
    }
  },
  created () {
    this.loadImage()
  },
  methods: {
    async loadImage (collect = false) {
      try {
        const data = await this.$http({
          methods: 'GET',
          url: '/user/images',
          params: {
            collect, // 是否查询收藏图片，默认查询所有
            page: 1,
            per_page: 10
          }
        })
        console.log(data)
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载图片素材失败')
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
</style>
