<template>
  <div>
    <el-backtop
      style="text-align: center; vertical-align: middle"
      :visibility-height="200"
      >↑</el-backtop
    >
    <div class="bg-search"></div>
    <div class="middle-search">
      <div class="title-search" v-if="!isNaN(amount)&&page <= 50">搜索列表中有<em>{{this.amount}}</em>项符合"<em>{{this.input}}</em>"以及筛选条件的结果</div>
      <div class="title-search" v-if="!isNaN(amount)&&page > 50">搜索列表中有<em>{{this.amount}}</em>项符合"<em>{{this.input}}</em>"以及筛选条件的结果，只返回前50页搜索结果，请修改关键词缩小搜索范围。</div>
      <div class="title-search" v-if="isNaN(amount)">很抱歉！搜索列表中没有找到与"<em>{{this.input}}</em>"相关的图书，试着重新搜索一下吧！</div>

<div style="width:245px;display:inline-block;float:right">
      <div
        v-if="this.tags == ''"
        style="
          font-size: 25px;
          margin-top: 13px;
          float:right;
          color: #4c4c4c;
          margin-right:105px
        "
        class="el-icon-s-grid"
        >分类筛选</div>

      <div class="left1-search" v-if="this.tags == ''">
        <div class="l1-search" v-for="(item,index) in list2" :key="index" @click="goTag(item)">{{item.name}}</div>
      </div>
      
      <div
        style="
          font-size: 25px;
          margin-top: 23px;
          float:right;
          color: #4c4c4c;
          margin-right:105px
        "
        class="el-icon-collection"
        >读书推荐</div>

      <div class="left-search">
        <div v-for="(item, index) in list1" :key="index">
          <!-- 这个盒子用来限制超出长度 -->
          <transition-group name="t1">
          <div class="left-title-search" v-show="index !== hoverOn" @mouseover="hover(index)" :key="item.name1">
            {{ item.name1 }}
          </div>          
          </transition-group>

      <transition-group name="m1">
          <div class="left-main-search" v-show="index == hoverOn" :key="item.imgFix1">
            <router-link to="/bookdetail"
              ><img
                @click="goBook(item)"
                class="left-img-search"
                :src="item.imgFix1"
            /></router-link>
            <router-link to="/bookdetail"
              ><div class="left-title1-search" @click="goBook(item)">{{ item.name1 }}</div></router-link>
          </div>
      </transition-group>

        </div>        


      </div>
</div>

<div style="width:950px;display:inline-block">
      <div class="classify-search">排序方式:
        <el-button class="c1-search el-icon-bottom" :class="{'active-search':change==0}" @click.native="changes(0)">相关度</el-button>
        <el-button class="c1-search el-icon-bottom" :class="{'active-search':change==1}" @click.native="changes(1)">更新时间</el-button>
        <el-button class="c1-search el-icon-top" :class="{'active-search':change==2}" @click.native="changes(2)">出版日期</el-button>
        <el-button class="c1-search el-icon-bottom" :class="{'active-search':change==3}" @click.native="changes(3)">出版日期</el-button>
      </div>

      <div style="
          font-size: 25px;
          margin-left: 1%;
          margin-bottom:13px;
          color: #4c4c4c;
          display:inline-block
        "
        class="el-icon-search">搜索结果</div>

      <transition name="t2">      
      <el-button v-if="tags !== ''" class="btag-search el-icon-close" @click="cancelTag()">取消分类筛选</el-button>
      </transition>

        <div class="content-search" v-for="(item,index) in list" :key="index">
        <router-link to="/bookdetail"><img @click="goBook(item)" class="img1-search" v-lazy="item.imgFix"></router-link>
        <router-link to="/bookdetail"><div @click="goBook(item)" class="con1-search" v-html="item.name"></div></router-link>
        <div class="con2-search" v-html="item.author"></div>
        <div class="con3-search">{{item.intro}}</div>
      </div>
</div>

    <div>
      <el-pagination
      class="page-search"
        background
        layout="prev, pager, next"
        :total="Math.ceil(this.amount/20)*10"
        @current-change="Currentpage"
        :current-page="page"
        hide-on-single-page
        >
      </el-pagination>
    </div>

    </div>
  </div>
</template>

<script>
import { useStore } from "@/store/index";
import request from "@/api/request";
import cheerio from "cheerio";
export default {
  components: {},
  data() {
    return {
      index: "0",
      page: 1,
      hoverOn: 0, //侧边栏激活位置
      list:[],//书籍
      list1:[],//推荐
      list2:[],//分类筛选
      tags:'',//分类筛选tag
      change:0,//排序方式序号
      amount:0,//搜索总数量
    };
  },
  methods: {
    async goSearch() {
    let mainStore = useStore()
    this.input = mainStore.search

      let result = await request({
        url: `/du/search.aspx?wd=${mainStore.search}&t=${this.index}&p=${this.page}${this.tags}`,
        method: "get",
      });
      if (result.status == 200) {

          this.list = []; //每次重启记得清空数组
          this.list1 = [];
          this.list2 = [];
          let html = result.data;
          let $ = cheerio.load(html, { decodeEntities: false });
          let length = $(".container .bookdetails-left .searchlist ul li").length;
          this.amount = $(".container .bookdetails-left h4 .text-dot").eq(0).text()
        for (let i = 0; i < length; i++) {
          let bookUrl = $(`.bookdetails-left .searchlist li:nth-of-type(${i+1}) .book-info .img152 a`).attr('href')
          let img = $(`.bookdetails-left .searchlist li:nth-of-type(${i+1}) .book-info .img152 a img`).attr('data-original')         
          let imgFix;
            if (typeof img == "undefined") {
              imgFix = "../../imgs/error.jpg";
            } else {
              imgFix = img.replace("https://img.dushu.com", "/dt");
            }
            let name = $(`.bookdetails-left .searchlist li:nth-of-type(${i+1}) .book-info h3 a`).html()
            let author = $(`.bookdetails-left .searchlist li:nth-of-type(${i+1}) .book-info p:nth-of-type(1)`).html()
            let intro = $(`.bookdetails-left .searchlist li:nth-of-type(${i+1}) .book-info p:nth-of-type(2)`).text()
            let list = { imgFix, name, author, intro, bookUrl }; 
            this.list.push(list); 
        }

            for (let n = 0; n < 10; n++) {
              let img1 = $(
                `#J_commend li:nth-of-type(${n + 1}) .unfold .img80 a img`
              ).attr("src");
              let imgFix1;
              if (typeof img1 == "undefined") {
                imgFix1 = "../../imgs/error.jpg";
              } else {
                imgFix1 = img1.replace("https://img.dushu.com", "/dt");
              }
              let name1 = $(
                `#J_commend li:nth-of-type(${n + 1}) .unfold h3`
              ).text();
              let bookUrl1 = $(
                `#J_commend li:nth-of-type(${n + 1}) .unfold .img80 a`
              ).attr("href");
              let list1 = { imgFix1, name1, bookUrl1 };
              this.list1.push(list1);
            }
        let tLength = $(`.bookdetails-right .active dd`).length
        for (let i = 0; i < tLength; i++) {
          let tag = $(`.bookdetails-right .active dd:nth-of-type(${i+1}) a`).attr('href')
          let name = $(`.bookdetails-right .active dd:nth-of-type(${i+1}) a`).text()
          let end = tag.match(/&cid=\d{1,6}/g).join('')
          let list = {name,end}
          this.list2.push(list)
        }


        }
    },

    async goBook(item) {
      let mainStore = useStore();
      let bookUrl = item.bookUrl || item.bookUrl1;
      mainStore.bookUrl = bookUrl;
    },
  //换分类排序
    async changes(num){
      this.index = `${num}`
      this.change = num
      this.page = 1
      this.goSearch()
    },
    //侧边栏分类筛选
    async goTag(item){
      this.tags = item.end
      this.list2 = []//点击之后清空tag数组
      this.$scrollTo()
    },
    async cancelTag(){//取消分类筛选
      this.tags = ''
      this.change = 0
      this.goSearch()
    },

  //侧边栏配合css
    hover(index) {
      this.hoverOn = index;
    },
  //换页
    Currentpage(val) {//e-ui不需要在标签那里写括号传值
      this.page = val;
      this.goSearch();
      this.$scrollTo();
    },

  },
  watch:{
    input(){
      this.index = "0"; //url类初始化
      this.page = 1;//url页初始化
      this.change = 0;//排序初始化
      this.tags = '';//筛选标签初始化
      this.goSearch()
    },
    tags(){
      if(this.tags !== ''){//从无变有就执行,从有变无是input执行的,就不必执行了
      this.index = "0"; //url类初始化
      this.page = 1;//url页初始化
      this.change = 0;//排序初始化
      this.goSearch()    
      }  
    }
  },
  computed:{
    input: {
      get() {
        let mainStore = useStore();
        return mainStore.search;
      },
      set(val) {},
    },    
  },
  created() {
    this.goSearch()
  },
};
</script>
<style>
.bg-search {
  height: 100%;
  z-index: -112;
  background: no-repeat;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 20%,
      rgba(255, 255, 255, 1) 80%,
      rgba(255, 255, 255, 0) 100%
    ),
    url("../../public/imgs/bg6.jpg");
  background-size: cover;
  width: 100%;
  position: fixed;
}
@media (max-width: 736px) {
  .bg-search{
      background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 10%,
      rgba(255, 255, 255, 1) 90%,
      rgba(255, 255, 255, 0) 100%
    ),
    url("../../public/imgs/bg6.jpg");
  }  
}
/* 中央布局 */
.middle-search {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.left-search {
  float: right;
  min-height: 503px;
  width: 238px;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 13px;
  background-image: url('../../public/imgs/icon2.png');
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: bottom;
  
}
/* 侧边分类栏边框 */
.left1-search {
  float: right;
  width: 238px;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 13px;
    background: #606266(0, 0, 0, 0.9);
  backdrop-filter: blur(10px)
}
/* 侧边分类栏单元行 */
.l1-search{
  padding: 13px;
  text-align: center;
  font-size: 16px;
  color: #4c4c4c;
  cursor:pointer;
  border-bottom: dotted 1px #888;
  transition-duration: .3s;
}
.l1-search:hover{
 color: #409eff;
}
.t1-enter-active,
.t1-leave-active {
  transition: .3s linear;
  overflow: hidden;
  height: 0px !important;
}
.t1-enter-from,
.t1-leave-to {
  height: 0px !important;
}
.t1-enter-to,
.t1-leave-from{
  height: 41px !important;
}
.m1-enter-active,
.m1-leave-active {
  transition: .3s linear;
  overflow: hidden;
  height: 0px !important;
}
.m1-enter-from,
.m1-leave-to {
  height: 0px !important;
}
.m1-enter-to,
.m1-leave-from{
  height: 147px !important;
}
/* 取消筛选的动画 */
.t2-enter-active,
.t2-leave-active {
  transition: .3s linear;
}
.t2-enter-from,
.t2-leave-to {
  opacity: 0;
}
.t2-enter-to,
.t2-leave-from{
  opacity: 1;
}
/* 左边隐藏时的标题 */
.left-title-search{
  border-bottom:solid 1px rgb(190, 190, 190);
  padding-left: 20px;
  padding-right: 20px;
  font-size: 17px;
  color: rgb(76, 76, 76);
  line-height: 40px;
  height: 40px;
  width: 198px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: white;
}
/* 左边生效时小盒子 */
.left-main-search{
  border-bottom:solid 1px rgb(190, 190, 190);
  height: 146px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
}
/* 左边生效时候标题 */
.left-title1-search{
  margin-left: 9px;
  width: 110px;
  display: inline-block;
  vertical-align: top;
  padding-top: 16px;
  font-size: 20px;
  font-weight: bold;
  color:#4c4c4c;
  transition-duration: .5s;
  /* 两句使得英文换行 */
  word-wrap:break-word;
  word-break:break-all;
}
.left-title1-search:hover{
  color: #409eff;
}
/* 左边图片 */
.left-img-search{
  margin-left: 3px;
  margin-top: 17px;
  height: 115px;
  width: 115px;
  transition-duration: .5s;
}
.left-img-search:hover{
  transform: scale(1.05);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);  
}
/* 分类栏 */
.classify-search{
  margin-left: 1%;
  height: 75px;
  line-height: 75px;
  width: 890px;
  vertical-align: top;
  border: solid 1px #ddd;
  color: #4c4c4c;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  transition-duration: 0.5s;
  margin-bottom: 23px;
  padding-left: 28px;
  border-radius: 5px;
    background: #606266(0, 0, 0, 0.9);
  backdrop-filter: blur(10px)
}
/* 分类栏小按钮 */
.c1-search{
  border-radius: 4px;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  display:inline-block;
  line-height: 30px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: 30px;
  margin-right: 15px;
  transition-duration: .3s;
}
/* 排序激活时保持颜色 */
.active-search{
  background-color: rgba(213, 238, 255, 0.507);
  color: #409eff;
}

/* 首行提示字 */
.title-search{
  font-size: 20px;
  height: 60px;
  line-height: 60px;
  display: inline-block;
}
/* 搜索列表盒子 */
.content-search{
  width:918px;
  height: 181px;
  margin-left: 1%;
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
  padding-top: 20px;
  padding-bottom: 20px;
}
/* 列表图片 */
.img1-search{
  height: 142px;
  width:142px;
  transition-duration: .3s;
  position: absolute;
  margin-left: 25px;
}
.img1-search:hover{
  transform: scale(1.1);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);  
}
/* 列表文字 */
.con1-search{
  margin-top: 13px;
  vertical-align: top;
  max-width: 700px;
  max-height: 54px;
  padding-left: 195px;
  font-size: 22px;
  line-height: 22px;
  max-height: 66px;
  font-weight: bold;
  transition-duration: .3s;
  color: #4c4c4c;
}
.con1-search:hover{
  color: #409eff;
}
.con2-search{
  vertical-align: top;
  max-width: 700px;
  max-height: 72px;
  line-height: 24px;
  padding-left: 195px;
  margin-top: 12px;
  color: #888;
}
.con3-search{
  vertical-align: top;
  max-width: 700px;
  padding-left: 195px;
  margin-top: 7px;
  color: #888;
  line-height: 24px;
  max-height: 72px;
}
/* 强调字样式 */
.title-search > em{
  font-style: normal !important;
  color: #409eff;
}
.con1-search > em{
  font-style: normal !important;
  color: #409eff;
}
.con2-search > em{
  font-style: normal !important;
  color: #409eff;
}
/* 分页器 */
.page-search {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.btag-search{
  display: block;
  line-height: 30px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-right: 45px;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  float: right;
  background-color: rgba(213, 238, 255, 0.507);
  color: #409eff;
}
</style>