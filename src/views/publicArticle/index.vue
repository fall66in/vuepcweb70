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
                    <!-- <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select> -->
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
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        channel_id: '', // 频道
        cover: { // 封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        }
      },
      editorOption: ''
    }
  },
  methods: {
    async handlePublic (draft) {
      try {
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
      } catch (err) {
        this.$message.error('发布失败', err)
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
