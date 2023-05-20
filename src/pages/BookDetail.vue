<template>
  <div>
    <el-backtop
      style="text-align: center; vertical-align: middle"
      :visibility-height="200"
      >↑</el-backtop
    >
    <div class="bg-detail"></div>

    <div class="middle-detail">
      <div class="title-detail">{{ name }}</div>
      <el-divider content-position="right">书是人类进步的阶梯</el-divider>
      <div class="book-detail">
        <div class="img-detail"><img :src="img" /></div>
        <div class="text-detail">
          <div class="text1-detail">
            参考价:<span class="price-detail">{{ price }}</span>
            <span class="fa1-detail" v-if="favorites == false"><el-button @click="favorite()" class=" el-icon-star-off">加入收藏</el-button></span>
            <span class="fa2-detail" v-if="favorites == true"><el-button @click="unFa()" class="fa2-de el-icon-star-on">取消收藏</el-button></span>
          </div>
          <div class="text1-detail">
            作者:<span class="text2-detail">{{ author }}</span>
          </div>
          <div class="text1-detail">
            出版社:
            <div class="text2-detail">{{ publisher }}</div>
            ISBN:
            <div class="text2-detail">{{ list[0] }}</div>
            开本:
            <div class="text2-detail">{{ list[3] }}</div>
          </div>
          <div class="text1-detail">
            丛编项:
            <div class="text2-detail">{{ cong }}</div>
            包装:
            <div class="text2-detail">{{ list[2] }}</div>
            出版时间:
            <div class="text2-detail">{{ list[1] }}</div>
            页数:
            <div class="text2-detail">{{ list[4] }}</div>
          </div>
        </div>
        <el-divider><i class="el-icon-notebook-2"></i></el-divider>
        <div class="title1-detail el-icon-tickets">内容简介</div>
        <div class="intro-detail">{{intro[0]}}</div>
        <div class="title1-detail el-icon-user-solid">作者简介</div>
        <div class="intro-detail">{{intro[1]}}</div>
        <div class="title1-detail el-icon-document">图书目录</div>
        <div class="intro-detail" v-html="intro3"></div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "../api/request";
import cheerio from "cheerio";
import { useStore } from "@/store/index";
export default {
  components: {},
  data() {
    return {
      img: "",
      name: "",
      price: "",
      author: "",
      publisher: "",
      cong: "",
      list: [],
      intro:[],
      intro3:"",
      favorites:false,
    };
  },
  methods: {
    async getBook() {
      let mainStore = useStore();
      let result = await request({
        url: `/du/${mainStore.bookUrl}`,
        method: "get",
      });
      if (result.status == 200) {
        let html = result.data;
        let $ = cheerio.load(html, { decodeEntities: false });
        let img = $(".container .bookdetails-left .book-pic .pic img").attr(
          "src"
        );
        this.name = $(".container .bookdetails-left .book-pic .pic img").attr(
          "alt"
        );
        this.price = $(".bookdetails-left .book-details .price .num").text();
        this.author = $(
          ".bookdetails-left .book-details #ctl00_c1_bookleft table td"
        )
          .eq(1)
          .text();
        this.publisher = $(
          ".bookdetails-left .book-details #ctl00_c1_bookleft table td"
        )
          .eq(3)
          .text();
        this.cong = $(
          ".bookdetails-left .book-details #ctl00_c1_bookleft table td"
        )
          .eq(5)
          .text();
        if (this.cong == "") this.cong = "暂无";

        for (let i = 0; i < 5; i++) {
          let item = $(".bookdetails-left .book-details .rt").eq(i).text();
          if (item == "") item = "暂未统计";
          //typeof判断nbsp编号,菜鸟可查
          this.list.push(item);
        }

        for (let i = 0; i < 2; i++) {
          let item = $(".bookdetails-left .txtsummary").eq(i).text();
          this.intro.push(item);
        }
        this.intro3 = $(".bookdetails-left .txtsummary").eq(2).html(); 
        let imgFix = img.replace("https://img.dushu.com", "/dt");
        this.img = imgFix;
      }
    },
    // 点击收藏
    async favorite(){
      let mainStore = useStore()
      let uid = mainStore.uid
      if(uid == ''){
        this.$message.warning('加入收藏失败,请登录后再进行收藏操作')
      }else{
      let url = mainStore.bookUrl
      let type = 0
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
      let url = mainStore.bookUrl
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
      let url = mainStore.bookUrl
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
  mounted() {
    this.getBook();
    this.isFa()
  },
};
</script>

<style>
/* 左右边栏背景 */
.bg-detail {
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
    url("../../public/imgs/bg3.jpg");
  background-size: cover;
  width: 100%;
  position: fixed;
}
@media (max-width: 736px) {
  .bg-detail{
      background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 3%,
      rgba(255, 255, 255, 1) 97%,
      rgba(255, 255, 255, 0) 100%
    ),
    url("../../public/imgs/bg3.jpg");
  }  
}
/* 中央布局 */
.middle-detail {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
/* 标题 */
.title-detail {
  margin-left: 3%;
  font-size: 25px;
  color: #4c4c4c;
  font-weight: bold;
  padding-top: 1.5%;
  transition-duration: 0.7s;
}
.title-detail:hover {
  color: #242222;
}
.title1-detail{
  margin-left: 3%;
  font-size: 22px;
  color: #4c4c4c;
  font-weight: bold;
  padding-bottom: 9px;
  transition-duration: 0.7s;
}
.title1-detail:hover{
  color: #242222;
}
/* 封面 */
.img-detail {
  margin-left: 2%;
  padding: 16px;
  height: 200px;
  width: 200px;
  text-align: center;
  vertical-align: middle;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  vertical-align: middle;
  display: inline-block;
  transition-duration: 0.5s;
  vertical-align: top;
}
.img-detail:hover {
  border: 1.5px solid #666361;
}
.text1-detail {
  vertical-align: top;
  padding-bottom: 20px;
  padding-top: 13px;
  font-size: 19px;
  font-weight: bold;
  color: #4c4c4c;
}
.text2-detail {
  font-size: 17px;
  font-weight: 150;
  color: #888;
  padding-left: 7px;
  display: inline-block;
  min-width: 90px;
  margin-right: 16px;
  transition-duration: .7s;
}
.text2-detail:hover{
  color: #242222;
}
/* 图片右侧文本区域 */
.text-detail {
  display: inline-block;
  margin-left: 16px;
  max-width: 925px;
}
/* 红色价格 */
.price-detail {
  color: #d47e74;
  display: inline-block;
  font-family: Arial;
  font-size: 24px;
  font-weight: bold;
  vertical-align: top;
  padding-left: 16px;
}
/* 介绍栏样式 */
.intro-detail {
  min-height: 130px;
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
.open-detail{
  width: 100px;
  background-color: red;
  position: absolute;
}
.intro-detail:hover {
  border: 1.5px solid #424647;
}
/* 两个收藏按钮 */
.fa1-detail{
  margin-left: 3%;
}
.fa2-detail{
  margin-left: 3%;
}
/* 取消隐藏高亮 */
.fa2-de{
  border: solid 1px #ddd;
  background-color: rgba(213, 238, 255, 0.507);
  color: #409eff;
}
</style>
