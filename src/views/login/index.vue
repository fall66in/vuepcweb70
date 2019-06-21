<template>
  <div class="login-wrap">
    <!-- 给组件加class，会把这个class作用到组件的跟元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form ref="form" class="form-content" :model="form">
        <el-form-item>
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- el-col 栅格布局，一共24列； :span 用来指定占用的大小， :offect 用来指定偏移量 -->
          <el-col :span="14">
            <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <el-button @click="handleSendCode">获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt' // 引入极验 JavaScript SDK 文件
export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleSendCode () {
      // console.log(1)
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // 获取后端数据的data
        const data = res.data.data
        // console.log(res.data)
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind' // 隐藏，直接弹出式
          },
          function (captchaObj) {
            // console.log(captchaObj)
            captchaObj
              .onReady(function () {
                captchaObj.verify() // 弹出验证码文本框
              })
              .onSuccess(function () {
                // 极验得出的结果
                console.log(captchaObj.getValidate())
              })
              .onError(function () {})

            // 在这里注册按钮的点击事件，然后进行验证用户是否输入手机号以及手机号格式是否正确
          }
        )
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  background: url(login_bg.jpg) 60% 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    img {
      width: 200px;
    }
  }
  .form-wrap {
    width: 350px;
    height: 250px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
