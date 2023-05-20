<template>
<div class="fix-navbar">
        
  <div class="menu-bg-navbar">
          
          <el-menu
            class="el-menu-navbar"
            :default-active="activeIndex"
            mode="horizontal"
            background-color="#545c64"
            text-color="#f7f2ee"
            active-text-color="#dfcdbd"
            router
          >
            <el-menu-item index="echart" >数据可视化</el-menu-item>
            <el-menu-item index="books" >图书主页</el-menu-item>
            <el-menu-item index="list" >书籍浏览</el-menu-item>
            <el-menu-item index="chapter" >在线阅读</el-menu-item>
          </el-menu>

  <div class="right-navbar">
    <div class="abox-navbar">

          <div class="a-img-navbar">
            <img  v-if="id ==''" src="../../public/imgs/avator.png">
            <img  v-if="id !==''" src="../../public/imgs/avt1.png" style="width:100%;height:100%">
          </div>

        <div class="avatar-navbar" v-if="id ==''">  
          <div style="font-size:18px;margin-bottom:10px">还没有登录,请先登录或注册</div>        
            <router-link to="/login" style="text-decoration: none">
            <div class="choice-navbar" @click="isLogin(true)">立即登录</div>
            </router-link>
            <div style="font-size:18px;margin-top:20px">还没有账号?点我<router-link to="/login"><span @click="isLogin(false)" class="register-navbar">立即注册</span></router-link></div>
            <div class="round-navbar"></div>
            <div class="round-navbar1"></div>
        </div>

        <div class="avatar-navbar" v-if="id !==''">  
          <div style="font-size:18px;margin-bottom:10px">欢迎!<span style="color:#409eff">{{id}}</span></div> 
            <router-link to="/favorites"><div class="choice-navbar">个人空间</div></router-link>
            <router-link to="/books"><div class="choice1-navbar" @click="quit('')">退出登录</div></router-link>
            <div class="round-navbar"></div>
            <div class="round-navbar1"></div>
        </div>

  </div>
      <div class="input-navbar">
        <el-input
          placeholder="输入书籍名称搜索"
          v-model="input"
          @keyup.enter.native="search()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="debounce()"
          ></el-button>
        </el-input>
        </div>

</div>

  </div>
</div>

</template>

<script>
import { useStore } from "@/store/index";
import request from '@/api/request';
export default {
  data() {
    return {
      input: "",
      activeIndex: this.$route.name,
      timer:null,
    };
  },
  methods: {
    search() {
      if (this.input == "") {
        this.$message({
          showClose: true,
          message: "请输入内容后再搜索",
          type: "warning",
        });
      } else {
        let mainStore = useStore();
        mainStore.search = this.input;
      if(this.$route.name == 'edit'){
        this.editSearch()
        this.$scrollTo();
      }else if(this.$route.name == 'chapter'){
        this.novelSearch()
        this.$scrollTo();
      }
      else{
        this.$router.push("/search");
        this.$scrollTo();
      }
      }
    },
    // 用于判断注册页面的状态,true登录,false注册
    isLogin(item){
      let mainStore = useStore()
      mainStore.isLogin = item
    },
    quit(item){
    let mainStore = useStore()
    mainStore.id = item
    mainStore.uid = item
    this.isLogin(false) 
    },
    async editSearch(){
      let mainStore = useStore()
      let result = await request.post('/base/admin/1',{search:this.input})
      for (let key of result.data) {
        key['iseditor'] = false
        key.date = key.date.replace('T16:00:00.000Z','')
      }
      mainStore.tableData1 = result.data
    },
    async novelSearch(){
      let mainStore = useStore()
      mainStore.novelSearch = this.input
    },
    debounce(){
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.search()
      }, 300);
    }
  },
  watch: {
    $route(to) {
      this.activeIndex = to.name;
    },
  },
  computed:{
    id:{
      get(){
        let mainStore = useStore()
        return mainStore.id
      },
      set(val){

      }
    }
  }
};
</script>
  <style>
/* fixed后内容错位,用这个撑住 */
.fix-navbar {
  height: 60px;
  width: 100%;
}

/* 大背景同时也是父容器 */
.menu-bg-navbar {
  z-index: 99;
  background-color: rgb(84, 92, 100);
  height: 60px;
  width: 100%;
  display: block;
  position: fixed;
}
.el-menu-navbar {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
/* 输入栏和游客父盒子 */
.right-navbar{
  width: 760px;
  margin-left: auto;
  margin-right: auto;
  transform: translate(150px,-60px);

}
.input-navbar {
  width: 350px;
  margin: -50px,-450px ;
  float: right;
  margin-top: 10px;
}
/* 头像框展开前总父盒子 */
.abox-navbar{
  float: right;
  width: 45px;
  height: 45px;
  margin-left: 100px;
  margin-top: 7px;
  border-radius: 5px;
  overflow: hidden;
  transition-duration: .5s;
}
/* 展开后父盒子大小 */
.abox-navbar:hover{
  width: 270px;
  height: 276px;
  border:0px;
  background: rgba(0, 0, 0, 0);
}
/* 常驻详细信息 */
.avatar-navbar{
  width: 1px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  transition-duration: .5s;
  background-color: #ffffff;
  border-radius: 5px;
  font-family: 'youyuan';
  color: #a4a1a1;
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
}
/* 展开后详细信息 */
.abox-navbar:hover .avatar-navbar {
  text-align: center;
  width: 268px;
  height: 180px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 5%;
  margin-left: auto;
  margin-right: auto;
  border:1px solid #a4a1a1;
  border-radius: 5px;
  background-color: #ffffff;
  margin-top: -50px;
  padding-top: 55px;
  font-family: 'youyuan';
  color: #a4a1a1;
  font-size: 20px;
  white-space: nowrap;
  position: relative;
}
/* 常驻头像 */
.a-img-navbar{
  width: 45px;
  height: 45px;
  margin-left: auto;
  margin-right: auto;
  transition-duration: .5s;
  background-color: #fefefe;
}
/* 展开头像 */
.abox-navbar:hover .a-img-navbar{
  overflow: hidden;
  z-index: 2;
  height: 80px;
  width: 80px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  transform: translateY(1px);
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
/* 立即注册这几个字 */
.register-navbar{
  color: #409EFF;
  text-decoration: underline;
}
/* 展开详细里每一行可选样式 */
.choice-navbar{
  z-index: 2;
  background: rgb(181, 223, 255);
  color:#a4a1a1;
  transition-duration: .5s;
}
.choice-navbar:hover{
  z-index: 2;
  background: rgba(28, 140, 226);
  color: #409EFF;
}

.choice1-navbar{
  z-index: 2;
  color:#a4a1a1;
  transition-duration: .5s;
}
.choice1-navbar:hover{
  z-index: 2;
  background: rgba(28, 140, 226);
  color: #409EFF;
}
/* 圆形小装饰 */
.round-navbar{
  z-index: 1;
  height: 0px;
  width: 360px;
  transition-duration: 1.2s;
}
.abox-navbar:hover .round-navbar{
  z-index: 1;
  background-color: rgba(223, 205, 189,0.9);
  height: 280px;
  border-radius: 50%;
  margin-left: -60px;
  margin-top: -170px;
}
.round-navbar1{
  z-index: -1;
  height: 0px;
  width: 390px;
  transition-duration: 1.5s;
}
.abox-navbar:hover .round-navbar1{
  z-index: -1;
  background-color: rgba(157, 226, 222, 0.5);
  height: 120px;
  border-radius: 50%;
  margin-left: -60px;
  margin-top: -110px;
}

/* 下拉菜单盒子位置 */
.el-popper[x-placement^="bottom"] {
  position: fixed !important;
  margin-left: calc(1320px + 13%);
}
.el-input-group__append:hover {
  color: rgb(84, 92, 100);
}

</style>
