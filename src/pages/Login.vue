<template>
  <div class="bg">
    <h1 class="w3ls" style="font-family:'STHupo'">Sign In Your Account</h1>
    <div class="content-w3ls">
      <div class="content-agile1"></div>
      <div class="content-agile2">
        <p class="wthree1" v-if="isLogin">登录丨Login</p>
        <p class="wthree1" v-if="!isLogin">注册丨Register</p>

            <input
              class="account"
              placeholder="Account"
              title="请输入你的账号"
              required=""
              autocomplete="off"
              v-model="account"
              @keyup.enter="login()" 
              v-if="isLogin"
            />

            <input
              type="password"
              placeholder="Password"
              title="请输入你的密码"
              class="password"
              required=""
              autocomplete="off"
              v-model="password"
              @keyup.enter="login()" 
              v-if="isLogin"
            />

              <input
              class="account"
              placeholder="请输入你的账号"
              title="请输入你的账号"
              required=""
              autocomplete="off"
              v-model="account"
              @keyup.enter="login()" 
              v-if="!isLogin"
            />

            <input
              type="password"
              placeholder="请输入你的密码"
              title="请输入你的密码"
              class="password"
              required=""
              autocomplete="off"
              v-model="password1"
              @keyup.enter="login()" 
              v-if="!isLogin"
            />

              <input
              type="password"
              placeholder="请再次输入你的密码"
              title="请再次输入你的密码"
              class="password"
              required=""
              autocomplete="off"
              v-model="password"
              @keyup.enter="login()" 
              v-if="!isLogin"
            />
          <button class="login" @click="login()" type="reset" v-if="isLogin">登录</button>
          <button class="login" @click="register()" type="reset" v-if="!isLogin">注册</button>
          <p class="wthree2" v-if="isLogin">还没有账号?<span @click="isLogins(false)" class="register-navbar" style="cursor:pointer;">立即注册</span></p>
          <p class="wthree2" v-if="!isLogin"><span @click="isLogins(true)" class="register-navbar" style="cursor:pointer;">返回登录</span></p>
          <p class="wthree2" style="padding-top:8px" v-if="isLogin">Enjoy your reading time</p>


        
      </div>
    </div>
    <p class="copyright">
      © 2022 Official Signup Page. All Rights Reserved | Design by
      <a href="https://space.bilibili.com/24122825" target="_blank"
        >@Bilibili_枣伊吕波</a
      >
    </p>
  </div>
</template>

<script>
import request from "../api/request";
import {useStore} from '@/store/index'
export default {
    components:{
    },
    data() {
      return {
        account:'',
        password:'',
        password1:'',
      };
    },
    methods: {
    async login(){
      let result = await request.post(`/base/login`,{
        account:this.account,
        password:this.password    
      })
      if(result.status == 200){
      if(result.data !== 'no'){
        let mainStore = useStore()
        mainStore.id = result.data[0]
        mainStore.uid = result.data[1]
        this.$message.success('登录成功')
        this.$router.push('/favorites')
      }
      else{
        this.$message.error('账号或密码错误,请重试')
      }
      }else{
        console.log('服务器貌似没开');
      }
      },

    async register(){
      if(this.password !== this.password1){
        this.$message.error('两次输入密码不一致,请重新输入')
      }else{
      let result = await request.post('/base/register',{
        account:this.account,
        password:this.password
      })
      if(result.data.indexOf('Duplicate') !== -1){
        this.$message.warning('该账号已被注册,请重试')
      }else{
        this.$message.success('恭喜你,注册成功!欢迎来到我的书城')
        let mainStore = useStore()
        mainStore.uid = result.data
        mainStore.isLogin = true
      }
      }

    },
    
    isLogins(item){
      let mainStore = useStore();
      mainStore.isLogin = item
    },
    },
    computed:{
    isLogin: {
      get() {
        let mainStore = useStore();        
        return mainStore.isLogin;
      },
      set(val) {
        
      },
    },    
  },
}
</script>
<style>
div,
object,
h1,
p{
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}


a {
  text-decoration: none;
}
.txt-rt {
  text-align: right;
} 
.txt-lt {
  text-align: left;
} 
.txt-center {
  text-align: center;
  
} 
.float-rt {
  float: right;
} 
.float-lt {
  float: left;
} 
.clear {
  clear: both;
} 
.pos-relative {
  position: relative;
} 
.pos-absolute {
  position: absolute;
} 
.vertical-base {
  vertical-align: baseline;
} 
.vertical-top {
  vertical-align: top;
} 
nav.vertical ul li {
  display: block;
} 
nav.horizontal ul li {
  display: inline-block;
} 
img {
  max-width: 100%;
}


.bg {
  background: url(../../public/imgs/banner.jpg) no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  position: fixed;
  overflow: auto;
}
h1.w3ls {
  font-size: 65px;
  color: #fff;
  padding: 40px 0;
  text-align: center;
  
  text-transform: uppercase;
  font-weight: lighter;
}
.content-w3ls {
  background-color: #202123;
  width: 70%;
  height: 670px;
  margin: 0 auto 50px;
  padding: 0;
  transition-duration: .3s;
  border-radius: 5px;
}
.content-w3ls:hover{
  background-color: rgb(28, 29, 31);
}
.content-w3ls .content-agile1 {
  width: 50%;
  float: left;
  background: url(../../public/imgs/content.jpg) no-repeat;
  background-position: center;
  background-size: cover;
  height: 100%;
}

.content-w3ls .content-agile2 {
  width: 50%;
  float: left;
  padding: 25px 0 0;
}
.account,
.password{
  width: 300px;
  height: 50px;
  padding: 0 15px;
  color: #fff;
  font-size: 20px;
  font-weight: 200;
  background-color: transparent;
  
  border-bottom: 5px solid #fff;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  font-family: "Raleway", sans-serif;
  margin: 0 auto 20px;
  display: block;
  outline: none;
}
.account:focus,
.password:focus,
.account:hover,
.password:hover{
  color: #fff;
  border-bottom: 5px solid #545c64;
  transition-duration: .3s;
}

.login {
  border-radius: 15px;
  width: 300px;
  margin: 30px auto;
  margin-top: 60px;
  display: block;
  height: 50px;
  text-align: center;
  font-size: 17px;
  font-weight: normal;
  color: #fff;
  background-color: #545c64;
  border-color: transparent;
  font-family: "Raleway", sans-serif;
  
  transition: all 0.5s ease-in-out;
  cursor: pointer;
}
.login:hover {
  color: #fff;
  background-color: #363b41;
}
p.wthree2 {
  
  font-weight: normal;
  color: #fff;
  text-align: center;
  text-transform: capitalize;
  padding-bottom: 10px;
  font-weight: lighter;
}

p.wthree1 {
  font-size: 25px;
  font-weight: lighter;
  color: #fff;
  text-align: center;
  text-transform: capitalize;
  padding: 20px;
  margin-bottom: 3%;
  font-family: 'youyuan',"Raleway",sans-serif;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
p.copyright {
  font-size: 20px;
  text-align: center;
  color: #dadada;
  line-height: 30px;
  font-weight: lighter;
  
}
p.copyright a {
  color: #f15f22;
}
p.copyright a:hover {
  color: #36b051;
}


@media (max-width: 800px) {
  h1.w3ls {
    font-size: 36px;
  }
  .content-w3ls {
    width: 80%;
    margin: 0 auto 40px;
  }
  p.copyright {
    font-size: 17px;
  }
  p.wthree2 {
    font-size: 14px;
  }
  .account,
  .password{
    font-size: 15px;
  }
}

@media (max-width: 991px) {
  .content-w3ls {
    width: 85%;
  }
}

@media (max-width: 800px) {
  .account,
  .password{
    width: 260px;
  }
}

@media (max-width: 736px) {
  .content-w3ls .content-agile1 {
    width: 100%;
    height: 350px;
  }
  .content-w3ls .content-agile2 {
    width: 100%;
    padding: 25px 0 30px;
  }
  .content-w3ls {
    width: 85%;
    height: 80%;
    min-height: 800px;
  }
    p.copyright {
    font-size: 12px;
  }
  .login{
    margin-top: 10px;
  }
}

@media (max-width: 414px) {
  h1.w3ls {
    padding: 25px 0;
    font-size: 30px;
  }
  .content-w3ls {
    width: 85%;
    margin: 0 auto 10px;
  }
}

@media (max-width: 384px) {
  .account,
  .password{
    width: 230px;
    height: 40px;
  }

  p.wthree2 {
    font-size: 14px;
    padding: 0 15px 20px;
    line-height: 30px;
  }
}

@media (max-width: 375px) {
  h1.w3ls {
    padding: 25px 0;
    font-size: 27px;
  }
  .content-w3ls .content-agile1 {
    width: 100%;
    height: 200px;
  }
}

@media (max-width: 320px) {
  h1.w3ls {
    padding: 25px 0;
    font-size: 24px;
  }
  .content-w3ls .content-agile1 {
    width: 100%;
    height: 180px;
  }
  .account,
  .password{
    width: 195px;
    height: 40px;
    font-size: 14px;
  }
  .content-w3ls {
    width: 90%;
    margin: 0 auto;
  }

  p.wthree2 {
    font-size: 13px;
    padding: 0 15px 15px;
  }
  p.copyright {
    font-size: 13px;
  }
}
</style>