<template>
    <div class="login-container">

        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <div class="login-conter">

                <div class="login-input-bg">
                    <!-- <div class="login-input-bg-top">
                        <img class="login-input-bg-top-logo" src="../../assets/images/logo.png" alt="">
                        <span class="login-input-bg-top-title">CB Evaluation</span>
                    </div> -->
                </div>

                <div class="login-input">

                    <div class="login-input-top">
                        <img class="login-input-top-logo" src="../../assets/images/login_cb_logo.png" alt="">
                        <!-- <span class="login-input-top-title">虹桥国际学校</span> -->
                    </div>

                    <div class="login-input-username">
                        <div class="login-input-u">
                            <img class="login-input-u-img" src="../../assets/images/login_username_2@.png" alt="">
                            <input class="login-input-u-input" name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
                        </div>
                        <div class="login-input-u-line"></div>
                    </div>

                    <div class="login-input-password">
                        <div class="login-input-p">
                            <img class="login-input-p-img" src="../../assets/images/login_password_2@.png" alt="">
                            <!-- <el-input placeholder="请输入密码" v-model="loginForm.password" show-password @keyup.enter.native="handleLogin"></el-input> -->
                            <input class="login-input-p-input" name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码" />
                        </div>
                        <div class="login-input-p-line"></div>
                    </div>

                    <div class="login-input-btn">
                        <el-button type="primary" class="button" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
                    </div>

                </div>

            </div>
        </el-form>

        <div class="login-bottom login-bottom-display">
            <span style="cursor:pointer" class="login-bottom-title" @click="handlePush">操作说明</span>
            <span class="login-bottom-separator"></span>
            <img class="login-bottom-img" src="../../assets/images/login_logo.png" alt="">
            <span class="login-bottom-title">孔裔六艺（上海）教育科技有限公司版权所有© 2017 沪ICP备17044267号-1</span>
        </div>

    </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'

export default {
  components: { LangSelect, SocialSign },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!isvalidUsername(value)) {
      //   callback(new Error('Please enter the correct user name'))
      // } else {
      //   callback()
      // }

      callback()
    }
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 6) {
      //   callback(new Error('The password can not be less than 6 digits'))
      // } else {
      //   callback()
      // }
      callback()
    }
    return {
      loginForm: {
        // username: 'admin',
        // password: '123456'
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    handleLogin() {
      if (this.loginForm.username === '' || this.loginForm.password === '') {
        this.$message.error('请输入用户名或密码')
        return
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // 去除空格
          this.loginForm.username = this.loginForm.username.replace(
            /\s*/g,
            ''
          )
          this.loginForm.password = this.loginForm.password.replace(
            /\s*/g,
            ''
          )
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(data => {
              if (data.result === 'success') {
                this.loading = false
                this.$router.push({ path: '/' })
              } else if (data.result === 'fail') {
                this.$message.error('用户名或密码错误')
                this.loading = false
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handlePush() {
      this.$router.push({ path: '/operationalInstructions' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 中等屏幕（桌面显示器，大于等于 992px） */
/* @media (min-width: 992px) and (max-width: 992px) {  } */
/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media screen and (max-height: 600px) {
    .login-bottom-display {
        display: none !important;
    }
}

.login-container {
    background: url(../../assets/images/login_bg.jpg) no-repeat;
    background-size: cover;
    position: fixed;
    height: 100%;
    width: 100%;
}

.login-form {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.login-conter {
    width: 800px;
    height: 500px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 25px 0px rgba(24, 27, 37, 0.2);
    border-radius: 10px;
    display: flex;

    .login-input-bg {
        width: 400px;
        height: 500px;
        border-radius: 10px 0px 0px 10px;
        background: url(../../assets/images/login_input_bg.png) no-repeat;

        .login-input-bg-top {
            margin: 80px auto 0;
            display: flex;
            justify-content: center;
            align-items: center;
            .login-input-bg-top-logo {
                height: 40px;
                margin-right: 10px;
            }
            .login-input-bg-top-title {
                font-size: 24px;
                font-family: "PingFangSC-Medium";
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
            }
        }
    }

    input::placeholder {
        font-size: 16px;
        font-family: "PingFangSC-Regular";
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
    }
    .login-input {
        width: 400px;
        height: 500px;
        border-radius: 10px 0px 0px 10px;

        .login-input-top {
            margin-top: 80px;
            margin-left: 78px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 230px;
            .login-input-top-logo {
                // height: 40px;
                // margin-right: 10px;
            }
            .login-input-top-title {
                font-size: 30px;
                font-family: "PingFangSC-Medium";
                font-weight: 500;
                color: rgba(33, 35, 51, 1);
            }
        }

        .login-input-username {
            margin: 70px auto 0;
            width: 300px;
            display: flex;
            align-items: center;
            flex-direction: column;

            .login-input-u {
                display: flex;
                align-items: center;
                width: 100%;
                .login-input-u-img {
                    width: 18px;
                    height: 20px;
                }
                .login-input-u-input {
                    margin-left: 20px;
                    width: 90%;
                    font-family: "PingFangSC-Medium";
                    font-weight: 400;
                    background-color: transparent;
                    border: 0;
                    outline: none;
                    box-shadow: 0 0 0px 1000px white inset;
                    font-size: 16px;
                }
            }
            .login-input-u-line {
                margin-top: 10px;
                width: 300px;
                height: 1px;
                background: rgba(232, 232, 232, 1);
            }
        }
        .login-input-password {
            margin: 36px auto 0;
            width: 300px;
            display: flex;
            align-items: center;
            flex-direction: column;

            .login-input-p {
                display: flex;
                align-items: center;
                width: 100%;
                .login-input-p-img {
                    width: 18px;
                    height: 20px;
                }
                .login-input-p-input {
                    margin-left: 20px;
                    width: 90%;
                    font-family: "PingFangSC-Medium";
                    font-weight: 400;
                    background-color: transparent;
                    border: 0;
                    outline: none;
                    box-shadow: 0 0 0px 1000px white inset;
                    font-size: 16px;
                }
            }
            .login-input-p-line {
                margin-top: 10px;
                width: 300px;
                height: 1px;
                background: rgba(232, 232, 232, 1);
            }
        }

        .login-input-btn {
            margin: 60px auto 0;
            width: 300px;
            height: 50px;
            .button {
                width: 300px;
                height: 50px;
                background: rgba(255, 209, 0, 1);
                border-radius: 25px;
                border-color: white;

                font-size: 16px;
                font-family: "PingFangSC-Medium";
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
            }
        }
    }
}

.login-bottom-display {
    display: flex;
}
.login-bottom {
    margin: -50px auto;
    // width: 600px;
    justify-content: center;
    align-items: center;
    .login-bottom-title {
        font-size: 14px;
        font-family: "PingFangSC-Medium";
        font-weight: 400;
        color: rgba(198, 201, 227, 1);
    }
    .login-bottom-separator{
        margin: 0 30px;
        height: 14px;
        width: 1px;
        background-color: #c6c9e3;
    }
    .login-bottom-img {
        width: 20px;
        height: 20px;
        margin-right: 13px;
    }
}
</style>

// cursor:pointer