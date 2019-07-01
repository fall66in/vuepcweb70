<template>
    <div>
        <el-card class="public-card" >
            <div slot="header" class="header">
                <span>发表文章</span>
                <div>
                    <el-button type="success" @click="handlePublic(false)">发布</el-button>
                    <el-button type="primary" @click="handlePublic(true)">存入草稿</el-button>
                </div>
            </div>
            <el-col :span="20">
              <el-form ref="form" :model="articleForm" label-width="80px">
                <!-- 文章标题：{5,30} -->
                <el-form-item label="文章标题">
                    <el-input v-model="articleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="文章内容">
                    <!-- bidirectional data binding（双向数据绑定） -->
                    <!-- 富文本编辑器 -->
                  <quill-editor v-model="articleForm.content"
                      ref="myQuillEditor"
                      :options="editorOption"
                      >
                  </quill-editor>

                </el-form-item>
                <el-form-item label="文章封面">
                    <el-radio-group v-model="articleForm.cover.type">
                       <el-radio :label="1">单图</el-radio>
                       <el-radio :label="3">三图</el-radio>
                       <el-radio :label="0">无图</el-radio>
                       <el-radio :label="-1">自动</el-radio>
                    </el-radio-group>
                    <!-- 根据不同的type遍历显示上传图片组件 -->
                    <template v-if="articleForm.cover.type > 0">
                      <el-row>
                        <el-col :span="6" v-for="n in articleForm.cover.type" :key="n">
                           <UploadImage></UploadImage>
                        </el-col>
                      </el-row>
                    </template>
                </el-form-item>
                <el-form-item label="文章频道">
                     <!-- <el-select v-model="articleForm.channel_id" placeholder="请选择文章频道">
                    </el-select> -->
                    <article-channel v-model="articleForm.channel_id"></article-channel>
                </el-form-item>
            </el-form>
            </el-col>
        </el-card>

    </div>
</template>

<script>
import UploadImage from './components/upload-image'
import ArticleChannel from '@/components/article-channel'

// 富文本组件挂载
// 引入富文本编辑器的主体（全局）样式
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 富文本编辑器的自定义样式
import './quillUse.css'

// 加载富文本编辑器
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'AppPublish',
  components: {
    ArticleChannel,
    quillEditor,
    UploadImage
  },
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        channel_id: '', // 频道
        cover: { // 封面
          type: 1, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        }
      },
      editorOption: '' // 富文本编辑器配置选项
    }
  },

  // 监视
  // 可以监视实例中的数据成员
  // 当被监视数据发送变化时，就会调用处理函数
  // watch: {
  //   // 监视实例（this)中的$route，当$route发生变化时，执行对应的处理函数
  //   '$route' (to, from) {
  //   // console.log(this.$route)
  //     // 对路由变化作出响应...

  //     // 从编辑到发布，由于是一个组件，路由会缓存，不会重新创建
  //     // 所以这里加一个处理：
  //     // 对于当前这个组件来说，如果你是从编辑到发布，则表单内容清空

  //     if (from.name === 'publicArticles-edit') {
  //       this.articleForm = {
  //         title: '', // 标题
  //         content: '', // 内容
  //         channel_id: '', // 频道
  //         cover: { // 封面
  //           type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
  //           images: []
  //         }
  //       }
  //     }
  //   }
  // },
  created () {
    if (this.$route.name === 'publicArticles-edit') {
      this.loadArticle()
    }
  },
  methods: {
    async loadArticle () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: `/articles/${this.$route.params.id}`
        })
        this.articleForm = data
      } catch (err) {
        console.log(err)
        this.$message.error('获取文章失败')
      }
    },
    async handlePublic (draft) {
      try {
        if (this.$route.name === 'publicArticles') {
          await this.$http({
            method: 'POST',
            url: '/articles',
            params: {
              draft
            },
            data: this.articleForm
          })
          this.$message({
            type: 'success',
            message: '发布成功'
          })
          this.$router.push({
            name: 'articleList'
          })
        } else if (this.$route.name === 'publicArticles-edit') {
          await this.$http({
            method: 'PUT',
            url: `/articles/${this.$route.params.id}`,
            params: {
              draft
            },
            data: this.articleForm
          })
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.$router.push({
            name: 'articleList'
          })
        }
      } catch (err) {
        this.$message.error('操作失败', err)
      }
    }
  }
}
</script>

<style scoped lang="less">
.public-card {
    min-height: 100%;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
}
</style>
