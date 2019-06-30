<template>
  <el-card>
    <div slot="header">
      <span>账户设置</span>
    </div>
    <el-row>
      <el-col :span="10">
        <el-form v-loading="loading">
          <el-form-item label="媒体名称">
            <el-input v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item  label="媒体简介">
            <el-input v-model="user.intro"></el-input>
          </el-form-item >
          <el-form-item  label="头条号ID">
            <el-input disabled :value="user.id"></el-input>
          </el-form-item>
          <el-form-item  label="绑定手机号">
            <el-input disabled :value="user.mobile"></el-input>
          </el-form-item>
          <el-form-item  label="邮箱">
            <el-input  v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
            type="primary"
            @click="handleSave">保存更新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="10">
        <p>头像设置</p>
        <!-- 文件上传组件
        action：上传请求地址，必须的
        headers 配置上传请求的请求头
          如果有token则需要手动配置到这里
        data 默认只携带文件，如果需要别的数据，可以放到data中
        name 上传的文件字段名称，默认交file，如果你的接口要求的名字和这个不一致，需要单独配置
        show-file-list 是否显示文件预览列表
        on-success 当文件触发成功的回调
        before-upload 文件上传之前触发的回调
        http-request 如果他的默认配置无法满足你，则我们可以自己去发请求上传文件
        注意：这个组件不能配置请求方法，默认是POST
        -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :show-file-list="false"
          :http-request="handleUpload">
          <!-- 用来预览上传的图片 -->
          <img v-if="user.photo" :src="user.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p>点击上传头像</p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'AccountSettings',
  data () {
    return {
      user: {},
      loading: false
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    async loadUser () {
      this.loading = true
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/profile'
        })
        console.log(data)
        this.user = data
      } catch (err) {
        console.log(err)
        this.$message.error('获取用户信息失败', err)
      }
      this.loading = false
    },
    async handleSave () {
      try {
        const { name, intro, email } = this.user
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/profile',
          data: {
            name,
            intro,
            email
          }
        })
        this.$message({
          type: 'success',
          message: '修改用户信息成功'
        })
        // console.log(data)
        // 提交mutation，也就是调用mutation函数
        this.$store.commit('changeUser', data)
      } catch (err) {
        console.log(err)
        this.$message.error('保存修改用户信息失败')
      }
    },
    async handleUpload (upload) {
      try {
        // console.log(upload)
        // axios 上传文件
        // 1.构建一个formData对象
        //  将文件添加到formData对象中
        // 2.发起请求，将formdata对象作为axios的data请求体
        const formData = new FormData()
        formData.append('photo', upload.file)
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/photo',
          data: formData
        })
        this.user.photo = data.photo
        this.$store.commit('changeUser', this.user)
        this.$message({
          type: 'success',
          message: '上传头像成功'
        })
      } catch (err) {
        console.log(err)
        this.$message.error('上传头像失败')
      }
    }
  }
}
</script>

<!-- 无作用域的样式，作用到全局 -->
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<!-- 有作用域的样式，作用到局部 -->
<style lang="less" scoped>

</style>
