<template>
  <div>
    <el-backtop
      style="text-align: center; vertical-align: middle"
      :visibility-height="200"
      >↑</el-backtop
    >
    <div class="bg-list"></div>
    <div class="middle-list">
      <span
        style="
          font-size: 25px;
          margin-top: 1%;
          position: fixed;
          margin-left: 8px;
          margin-top: 8px;
          color: #4c4c4c;
        "
        class="el-icon-collection"
        >本目录推荐</span
      >
      <span
        style="
          font-size: 25px;
          margin-top: 1%;
          margin-left: 267px;
          margin-top: 8px;
          display: inline-block;
          color: #4c4c4c;
        "
        class="el-icon-reading"
        >书籍列表</span
      >

      <!-- 激活的标题不会显示 -->
      <!-- 复用注册个hoverOn还有给个hover方法就行,记得item带index -->
      <div class="left-list">
        <div v-for="(item, index) in list1" :key="index">
          <!-- 这个盒子用来限制超出长度 -->
          <transition-group name="t1">
            <div
              class="left-title-list"
              v-show="index !== hoverOn"
              @mouseover="hover(index)"
              :key="item.name1"
            >
              {{ item.name1 }}
            </div>
          </transition-group>

          <transition-group name="m1">
            <div
              class="left-main-list"
              v-show="index == hoverOn"
              :key="item.imgFix1"
            >
              <router-link to="/bookdetail"
                ><img
                  @click="goBook(item)"
                  class="left-img-list"
                  :src="item.imgFix1"
              /></router-link>
              <router-link to="/bookdetail"
                ><div class="left-title1-list" @click="goBook(item)">
                  {{ item.name1 }}
                </div></router-link
              >
            </div>
          </transition-group>
        </div>
      </div>

      <div class="list-list">
        <div v-for="(item, index) in list" :key="index" class="list-item-list">
          <router-link to="/bookdetail" style="display: inline-block">
            <img
              @click="goBook(item)"
              class="r-img-list"
              v-lazy="item.imgFix"
              :key="item.imgFix"
          /></router-link>
          <router-link to="/bookdetail" class="title-list">
            <div class="title-overflow-list" @click="goBook(item)">
              {{ item.name }}
            </div>
          </router-link>
          <span class="author-list">{{ item.author }}</span>
          <span class="intro-list">{{ item.introduction }}</span>
          <el-tag style="margin-left: 175px; margin-top: 10px">京东有售</el-tag>
        </div>
      </div>

   <div>
    <el-pagination
      class="page-list"
      background
      layout="prev, pager, next"
      :total="pages"
      @current-change="Currentpage"
      hide-on-single-page
    >
    </el-pagination>
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
      list: [], //书籍列表
      list1: [], //目录推荐列表
      length: "", //书籍列表长度
      page: "1", //当前页
      pages: 1000, //总页数*10
      hoverOn: 0, //侧边栏激活位置
    };
  },
  methods: {
    async getTabName() {
      let mainstore = useStore();
      try {
        if (mainstore.tabUrl == "/book/") {
          this.pages = 10; //判断默认页面与否
        } else {
          let test = mainstore.tabUrl.match(/_\d{1,3}.html/g); //第一页与否
          this.pages = 1000;
          if (test == null) {
            let end = mainstore.tabUrl.slice(-5);
            mainstore.tabUrl = mainstore.tabUrl.replace(end, `_1.html`);
          } else {
            let end = test.join("");
            mainstore.tabUrl = mainstore.tabUrl.replace(
              end,
              `_${this.page}.html`
            );
          }
        }
        let result = await request({
          url: `/du/${mainstore.tabUrl}`,
          method: "get",
        });
        if (result.status == 200) {
          try {
            this.list = []; //每次重启记得清空数组
            this.list1 = [];
            let html = result.data;
            let $ = cheerio.load(html, { decodeEntities: false });
            let length = $(".container .row .bookslist ul li").length;
            this.length = length;
            for (let i = 0; i < length; i++) {
              let img = $(
                `.container .row .bookslist li:nth-of-type(${
                  i + 1
                }) .img152 a img`
              ).attr("data-original");
              let name = $(
                `.container .row .bookslist li:nth-of-type(${
                  i + 1
                }) .img152 a img`
              ).attr("alt");
              let author = $(
                `.container .row .bookslist li:nth-of-type(${
                  i + 1
                }) p:nth-of-type(1)`
              ).text();
              let introduction = $(
                `.container .row .bookslist li:nth-of-type(${
                  i + 1
                }) p:nth-of-type(2)`
              ).text();
              let bookUrl = $(
                `.container .row .bookslist li:nth-of-type(${i + 1}) .img152 a`
              ).attr("href");
              let imgFix;
              if (typeof img == "undefined") {
                imgFix = "../../imgs/error.jpg";
              } else {
                imgFix = img.replace("https://img.dushu.com", "/dt");
              }

              let list = { imgFix, name, author, introduction, bookUrl }; //单个数据
              this.list.push(list); //数据插入
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
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async goBook(item) {
      let mainStore = useStore();
      let bookUrl = item.bookUrl || item.bookUrl1;
      mainStore.bookUrl = bookUrl;
    },

    Currentpage(val) {
      //当前页方法,配合Element-ui
      this.page = val;
      this.getTabName();
      this.$scrollTo();
    },

    hover(index) {
      this.hoverOn = index;
    },
  },
  //想要监测pinia中的值,现在只能先conputed取值到data内,然后再监控这个data;
  computed: {
    url: {
      get() {
        let mainStore = useStore();
        return mainStore.tabUrl;
      },
      set(val) {},
    },
  },
  watch: {
    //这个url用来检测主页到浏览也跳转的监视
    url() {
      this.getTabName();
    },
    //page用来换页的监视
    page() {
      this.getTabName();
    },
  },
  created() {
    this.getTabName();
  },
};
</script>

<style>
ul {
  padding-inline-start: 20px;
}
/* 左右边栏背景 */
.bg-list {
  height: 100%;
  z-index: -112;
  background: no-repeat;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 30%,
      rgba(255, 255, 255, 1) 70%,
      rgba(255, 255, 255, 0) 100%
    ),
    url("../../public/imgs/bg4.jpg");
  background-size: cover;
  width: 100%;
  position: fixed;
}
@media (max-width: 736px) {
  .bg-list{
      background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 10%,
      rgba(255, 255, 255, 1) 90%,
      rgba(255, 255, 255, 0) 100%
    ),
    url("../../public/imgs/bg4.jpg");
  }  
}

/* 中央布局 */
.middle-list {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* 左边推荐栏大盒子 */
.left-list {
  min-height: 503px;
  width: 238px;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 15px;
  position: fixed;
  background-image: url("../../public/imgs/icon1.png");
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: bottom;
}
/* 手风琴推荐栏动画组 */
.t1-enter-active,
.t1-leave-active {
  transition: 0.3s linear;
  overflow: hidden;
  height: 0px !important;
}
.t1-enter-from,
.t1-leave-to {
  height: 0px !important;
}
.t1-enter-to,
.t1-leave-from {
  height: 41px !important;
}
.m1-enter-active,
.m1-leave-active {
  transition: 0.3s linear;
  overflow: hidden;
  height: 0px !important;
}
.m1-enter-from,
.m1-leave-to {
  height: 0px !important;
}
.m1-enter-to,
.m1-leave-from {
  height: 147px !important;
}
/* 左边隐藏时的标题 */
.left-title-list {
  border-bottom: solid 1px rgb(190, 190, 190);
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
.left-main-list {
  border-bottom: solid 1px rgb(190, 190, 190);
  height: 146px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
}
/* 左边生效时候标题 */
.left-title1-list {
  margin-left: 9px;
  width: 110px;
  display: inline-block;
  vertical-align: top;
  padding-top: 16px;
  font-size: 20px;
  font-weight: bold;
  color: #4c4c4c;
  transition-duration: 0.5s;
  /* 两句使得英文换行 */
  word-wrap: break-word;
  word-break: break-all;
}
.left-title1-list:hover {
  color: #409eff;
}
/* 左边图片 */
.left-img-list {
  margin-left: 3px;
  margin-top: 17px;
  height: 115px;
  width: 115px;
  transition-duration: 0.5s;
}
.left-img-list:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);
}
/* list列表书籍样式 */
.list-list {
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 15px;
  display: inline-block;
  margin-left: 10px;
  width: 928px;
  margin-left: 259px;
  padding-top: 2%;
  min-height: 1500px;
  background: #606266(0, 0, 0, 0.9);
  backdrop-filter: blur(10px)
}
/* list每个单元样式 */
.list-item-list {
  width: 464px;
  height: 181px;
  display: inline-block;
  list-style-type: none;
  padding-bottom: 7px;
  border: solid 0.5px rgb(190, 190, 190);
  border-top-style: none;
  border-left-style: none;
  border-right-style: none;
  vertical-align: middle;
}
/* list图片样式 */
.r-img-list {
  position: absolute;
  margin: 0 auto;
  margin-left: 15px;
  height: 142px;
  width: 142px;
  transition-duration: 0.3s;
}
.r-img-list:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);
}
/* list文字标题 */
.title-list {
  padding-left: 170px;
  width: 270px;
  display: inline-block;
  text-align: center;
  font-size: 17px;
  font-weight: bold;
  color: #4c4c4c;
  text-overflow: ellipsis;
  vertical-align: top;
  transition-duration: 0.3s;
  margin-top: 24px;
}
/* 高亮标题,以及超出容器的处理 */
.title-overflow-list {
  width: 270px;
  max-height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.title-list:hover {
  color: #409eff;
}
/* 作者 */
.author-list {
  padding-left: 170px;
  width: 270px;
  display: inline-block;
  text-align: center;
  font-size: 13px;
  color: #888;
  padding-top: 10px;
}
.intro-list {
  padding-left: 170px;
  width: 285px;
  display: inline-block;
  font-size: 13px;
  color: #888;
  padding-top: 10px;
}
/* 分页器 */
.page-list {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>