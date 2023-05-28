<template>
  <div>
    <el-backtop
      style="text-align: center; vertical-align: middle"
      :visibility-height="200"
      >↑</el-backtop
    >
    <div class="bg-ndetail"></div>

    <div class="middle-ndetail">
      <div class="title-ndetail">{{ name }}</div>
      <el-divider content-position="right">书是人类进步的阶梯</el-divider>
      <div class="book-ndetail">
        <div class="img-ndetail"><img :src="img" /></div>
        <div class="text-ndetail">
        <div class="tag-ndetail">
            <el-tag type="success" class="t">{{label[0]}}</el-tag>
            <el-tag type="warning" class="t">{{label[1]}}</el-tag>
            <el-tag type="danger" class="t">{{label[2]}}</el-tag>
            <el-tag type="info" v-for="item in label1" :key="item" class="t">{{item}}</el-tag>
        </div>
          <div class="text1-ndetail">
            <span class="text2-ndetail" v-for="item in nums" :key="item">{{item}}</span>
          </div>


<div style="font-size:17px;color: #4c4c4c;padding-left: 7px;" class="el-icon-time">最新章节</div>
  <div class="cbox1-ndetail">
    <router-link to="/read" v-for="(item,index) in chapter" :key="index"><div @click="goRead(item,catalog[catalog.length - 1],catalog[catalog.length - 1].length - index -1)" class="chapter-ndetail">{{item.name}}</div></router-link>
  </div>
  <div class="bbox-ndetail">
  <el-button v-if="favorites == false" @click="favorite()" class="b-ndetai el-icon-star-off">加入收藏</el-button>
  <el-button v-if="favorites == true"  @click="unFa()" class="b-ndetai fa-ne el-icon-star-on">取消收藏</el-button>
  </div>
        </div>
        <el-divider><i class="el-icon-notebook-2"></i></el-divider>
        <div class="title1-ndetail el-icon-tickets">内容简介</div>
        <div class="intro-ndetail">
          <div class="em-ndetail" v-for="item in intro" :key="item" v-html="item"></div>
        </div>
        <div class="title1-ndetail el-icon-document">图书目录</div>
        <div class="intro-ndetail">
        
          <div v-for="(item,index) in logName" :key="index" @click="cname(item)">
            <div  class="volume-ndetail">
            {{item}}
            </div>

<div class="cbox2-ndetail">
            <router-link to="/read">
            <div @click="goRead(item1,catalog[index],index1)" class="chapter1-ndetail" v-for="(item1,index1) in catalog[index]" :key="index1">
              {{item1.names}}
            </div>
            </router-link>
</div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "../api/request";
import cheerio from "cheerio";
import { useStore } from "@/store/index";
export default {
  name:'ndetail',
  components: {},
  data() {
    return {
      img: "",
      name: "",
      label:[],
      label1:[],
      nums:[],
      intro:[],
      chapter:[],
      logName:[],
      catalog:[[]],
      favorites:false,
    };
  },
  methods: {
    async getBook() {
      let mainStore = useStore();
      this.img= ""
      this.name= ""
      this.label=[]
      this.label1=[]
      this.nums=[]
      this.intro=[]
      this.chapter=[]
      this.logName=[]
      this.catalog=[]//初始化
      let result = await request({
        url: `/no${mainStore.novelUrl}`,
        method: "get",
      });
      if (result.status == 200) {
        let html = result.data;
        let $ = cheerio.load(html, { decodeEntities: false });
        this.name = $(`.book-html-box .book-detail .book-info h1`).text()
        let BigimgFix = mainStore.novelUrl.match(/\d{1,6}/g).join('')
        this.img = `./imgs/novel/${BigimgFix}.jpg`
        for (let i = 0; i < 3; i++) {
         this.label.push($(`.book-html-box .book-detail .book-label a`).eq(i).text())            
        }
        let length = $(`.book-html-box .book-detail .book-label span a`).length
        for (let i = 0; i < length; i++) {
         this.label1.push($(`.book-html-box .book-detail .book-label span a:nth-of-type(${i+1})`).text())            
        }
        for (let i = 0; i < 4; i++) {
         this.nums.push($(`.book-html-box .book-detail .nums span:nth-of-type(${i+1})`).text())            
        }
        let introLength = $(`.book-html-box .book-detail .book-dec p`).length
        for (let i = 0; i < introLength; i++) {
          this.intro.push($(`.book-html-box .book-detail .book-dec p`).eq(i).html())          
        }
        for(let i =0;i < 9;i++){
          let end = $(`.book-new-chapter .tit a`).eq(i).attr('href')
          let name = $(`.book-new-chapter .tit a`).eq(i).text()
          let list = {end,name}
          this.chapter.push(list)
        }
      }
    },

    async bookList(){
      let mainStore = useStore();
      let url = mainStore.novelUrl.replace('.html','/catalog')
      let result = await request({
        url: `/no${url}`,
        method: "get"
      });
      if (result.status == 200) {
        let html = result.data;
        let $ = cheerio.load(html, { decodeEntities: false });
        let allLength = $(`.volume-list .chapter-list`).children().length
        let chapter = -1
        let cindex

        for (let i = 0; i < allLength; i++) {
          let name = $(`.volume-list .chapter-list *`).eq(i*2)
          if(name.hasClass('volume')){
            cindex = 0
            this.logName.push(name.text())
            chapter++
            this.catalog[chapter] = new Array()
          }else{
            let url = name.find('.col-4 a').attr('href')
            url = url.replace('/linovelib','')
            let names = name.find('.col-4 a').text()
            let list = {url,names}
            try{
            this.catalog[chapter][cindex] = list
            }catch(err){
            // this.catalog[0][cindex] = list
            console.log(err);
            }
            cindex++
          }
        }
        
      }
    },
    async goRead(item,list,cindex){
    let mainStore = useStore();
    let chapters = list.map(item => item.url)
    mainStore.chapters = chapters
    mainStore.cindex = cindex
    },
    cname(item){
      let mainStore = useStore()
      mainStore.cname = item
    },
      async favorite(){
      let mainStore = useStore()
      let uid = mainStore.uid
      if(uid == ''){
        this.$message.warning('加入收藏失败,请登录后再进行收藏操作')
      }else{
      let url = mainStore.novelUrl
      let type = 1
      let result = await request.post('/base/favorite/1',{
        url,
        type,
        uid
      })
      if(result.data == 'yes'){
        this.$message.success('加入收藏成功')
        this.favorites = true
      }else{
        this.$message.error('加入收藏失败,原因:'+result.data)
      }
      }
    },
    // 检测是否收藏
    async isFa(){
      let mainStore = useStore()
      let url = mainStore.novelUrl
      let uid = mainStore.uid
      let result = await request.post('/base/favorite/3',{
        url,
        uid
      })
      if(result.data == 'exist'){
        this.favorites = true
      }else{
        this.favorites = false
      }
    },
    // 取消收藏
    async unFa(){
      let mainStore = useStore()
      let url = mainStore.novelUrl
      let uid = mainStore.uid
      let result = await request.post('/base/favorite/2',{
        url,
        uid
      })
      if(result.data == 'yes'){
        this.$message.success('取消收藏成功')
        this.favorites = false
      }else{
        this.$message.error(result.data)
      }
    }

  },
  created() {
    this.getBook();
    this.bookList()
  },

  watch:{
    novelChange(){
      this.getBook()
      this.bookList()
      this.isFa()
    },
  },
  computed:{
    novelChange: {
      get() {
        let mainStore = useStore();
        return mainStore.novelUrl;
      },
      set(val) {},
    },    
  },
  mounted(){
    this.isFa()
  }
};
</script>

<style>
/* 左右边栏背景 */
.bg-ndetail {
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
    url("../../public/imgs/bg7.jpg");
  background-size: cover;
  width: 100%;
  position: fixed;
}
@media (max-width: 736px) {
  .bg-ndetail{
      background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 3%,
      rgba(255, 255, 255, 1) 97%,
      rgba(255, 255, 255, 0) 100%
    ),
    url("../../public/imgs/bg7.jpg");
  }  
}
/* 介绍里的别名 */
.em-ndetail > em{
  font-style: normal !important;
  color: #409eff;
}
/* 中央布局 */
.middle-ndetail {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
/* 标题 */
.title-ndetail {
  margin-left: 3%;
  font-size: 25px;
  color: #4c4c4c;
  font-weight: bold;
  padding-top: 1.5%;
  transition-duration: 0.7s;
}
.title-ndetail:hover {
  color: #242222;
}
.title1-ndetail{
  margin-left: 3%;
  font-size: 22px;
  color: #4c4c4c;
  font-weight: bold;
  padding-bottom: 9px;
  transition-duration: 0.7s;
}
.title1-ndetail:hover{
  color: #242222;
}
/* 封面 */
.img-ndetail {
  margin-left: 2%;
  text-align: center;
  vertical-align: middle;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  vertical-align: middle;
  display: inline-block;
  transition-duration: 0.5s;
  vertical-align: top;
  border-radius: 5px;
  height: 290px;
}
.img-ndetail img{
  height: 290px;
  min-width: 200px;
  border-radius: 5px;
}
.img-ndetail:hover {
  border: 1.5px solid #666361;
}
.text1-ndetail {
  vertical-align: top;
  padding-bottom: 20px;
  padding-top: 13px;
  font-size: 19px;
  font-weight: bold;
  color: #4c4c4c;
}
.text2-ndetail {
  font-size: 17px;
  font-weight: 150;
  color: #888;
  padding-left: 7px;
  display: inline-block;
  min-width: 120px;
  margin-right: 16px;
  transition-duration: .7s;
}
.text2-ndetail:hover{
  color: #242222;
}
/* 图片右侧文本区域 */
.text-ndetail {
  display: inline-block;
  margin-left: 16px;
  max-width: 925px;
}
/* 介绍栏样式 */
.intro-ndetail {
  min-height: 120px;
  width: 1140px;
  margin-left:auto;
  margin-right:auto;
  vertical-align: top;
  border: solid 1px #ddd;
  color: #4c4c4c;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  transition-duration: 0.5s;
  margin-bottom: 23px;
  padding: 20px;
  line-height: 29px;
  font-size: 17px;
}
/* 展开介绍栏 */
.open-ndetail{
  width: 100px;
  background-color: red;
  position: absolute;
}
.intro-ndetail:hover {
  border: 1.5px solid #424647;
}
/* tag表 */
.tag-ndetail > .t{
    margin-right: 9px;
}
/* 最新章节大盒子 */
.cbox1-ndetail{
  height: 130px;
  margin-left: 7px;
  margin-top: 1%;
}
/* 最新单元盒子 */
.chapter-ndetail{
  width: 290px;
  border-bottom: dotted 1px #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  padding: 7px 0px 7px 7px;
  color: #888;
  transition-duration: .3s;
}
.chapter-ndetail:hover{
  color: #409eff;
}
/* 最新单元盒子 */
.chapter1-ndetail{
  width: 260px;
  border-bottom: dotted 1px #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  padding: 7px 0px 7px 7px;
  color: #888;
  transition-duration: .3s;
}
.chapter1-ndetail:hover{
  color: #409eff;
}
/* 分类栏小按钮 */
.b-ndetail{
  border-radius: 4px;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  line-height: 30px;
  padding: 8px 25px 8px 25px;
  transition-duration: .3s;
}
/* 两个按钮盒子 */
.bbox-ndetail{
  margin-left: 8px;
}
/* 章节第几章样式 */
.volume-ndetail{
    border-left: 4px solid #409eff;
    padding-left: 8px;
    height: 20px;
    line-height: 24px;
    margin-bottom: 8px;
    vertical-align:top;
    margin-top: 1%;
}
/* 详细章节内容大盒子 */
.cbox2-ndetail{
  margin-left: 7px;
  margin-top: 6px;
}
/* 取消隐藏高亮 */
.fa-ne{
  border: solid 1px #ddd;
  background-color: rgba(213, 238, 255, 0.507);
  color: #409eff;
}

</style>
