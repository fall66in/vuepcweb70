<template>
  <div class="login-wrap">
    <!-- 给组件加class，会把这个class作用到组件的跟元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <!-- 配置校验规则
        rules 规则对象配置到el-form上,rules中配置的校验字段必须和表单数据一致
        prop  检验字段配置到el-form-item上
      JavaScript 触发验证
        给el-form添加ref
        调用this.$refs['ref名字'].validate(valid => {}) 触发验证 -->
      <el-form
      ref="form"
      class="form-content"
      :model="form"
      :rules="rules"
      >
        <el-form-item prop="mobile">
          <el-input id="mobile" v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- el-col 栅格布局，一共24列； :span 用来指定占用的大小， :offect 用来指定偏移量 -->
          <el-col :span="14">
            <el-input v-model="form.code" id="codes" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
            <el-button
            @click="handleSendCode"
            :disabled="!!codeTimer"
            >{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码'}} </el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
          <span class="agree-text" >我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
        </el-form-item>
        <el-form-item>
          <!-- 页面会被重复刷新，只能后端来禁止获取短信的方式，规定你可以获取继承啊啥的，前端是没有办法来改变的 -->
          <el-button
          class="btn-login"
          id="code"
          type="primary"
          @click="handleLogin"
          :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt' // 引入极验 JavaScript SDK 文件，通过window.initGeetest来使用
import { saveUser } from '@/utils/auth' // 按需加载，加载模板中非export default 成员
const initCodeTimeSeconds = 60
export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据对象
        mobile: '',
        code: '',
        agree: ''
      },
      // form与rules的数据名字无关系，但是他们之间有关系
      rules: { // 验证规则对象
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { len: 11, message: '长度必须为11个字符', trigger: 'blur' }
          { pattern: /\d{11}/, message: '请输入有效的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          // { len: 6, message: '长度必须为6字符', trigger: 'blur' }
          { pattern: /\d{6}/, message: '请输入有效的验证码', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' },
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: initCodeTimeSeconds, // 倒计时时间
      loginLoading: false
    }
  },
  methods: {
    handleLogin () {
      // 使用form组件的validate方法触发校验，获取校验的结果状态，对整个表单进行校验
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录请求
        this.submitLogin()
      })
    },
    submitLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      })
        .then(res => {
          // 本地存储用户信息,在本地永久存储
          const userInfo = res.data.data
          // window.localStorage.setItem('user_info', JSON.stringify(userInfo))
          saveUser(userInfo)
          // >=200&&<400的状态码会进入then成功
          console.log(res.data)
          this.$message({
            message: '恭喜你，登录成功',
            type: 'success'
          })
          this.$router.push({
            name: 'home'
          })
        })
        .catch(e => {
          this.$message({
            message: '登录失败，手机号或密码错误',
            type: 'error'
          })
        })
    },
    handleSendCode () {
      // 对部分表单字段--手机号是否有效 进行校验
      this.$refs['form'].validateField('mobile', errorMessage => {
        // console.log('errorMessage => ', errorMessage)
        if (errorMessage.trim().length > 0) {
          return
        }
        // 初始化验证码--验证通过
        this.showGeetest()
      })
    },
    // 验证通过，初始化显示人机交互验证码
    showGeetest () {
      // 任何函数中的function 内部this指向window
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
          captchaObj => {
          // console.log(captchaObj)
            captchaObj
              .onReady(() => {
                captchaObj.verify() // 弹出验证码文本框
                console.log(captchaObj.verify())
              })
              .onSuccess(() => {
                // 极验得出的结果
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()
                axios({
                  method: 'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  params: {
                    challenge,
                    validate,
                    seccode
                  }
                }).then(res => {
                  // 发送短信成功，开启倒计时
                  this.codeCountDown()
                })
              })
              .onError(function () {})
          } // 在这里注册按钮的点击事件，然后进行验证用户是否输入手机号以及手机号格式是否正确
        )
      })
    },
    // 验证码倒计时
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          // 清除定时器，同时让倒计时的时间回归初始状态
          window.clearInterval(this.codeTimer)
          this.codeTimeSeconds = initCodeTimeSeconds
          this.codeTimer = null // 将存储定时器引用的变量重新赋值为null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  background: url(login_bg.jpg) 60% 40% no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .form-wrap {
    width: 350px;
    height: 290px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
  .agree-checkbox {
    margin-right:5px;
  }
}
</style>
