<template>
  <div>
    <el-backtop
      style="text-align: center; vertical-align: middle"
      :visibility-height="200"
      >↑</el-backtop
    >
    <div class="bg-books"></div>
    <div class="middle-books">
      <span
        style="
          font-size: 25px;
          padding-left: 630px;
          margin-top: 8px;
          display: inline-block;
          color: #4c4c4c;
        "
        class="el-icon-menu"
        >图书分类</span
      >

      <el-carousel height="265px" class="carousel-books" :interval="5000">
        <el-carousel-item v-for="item in pics" :key="item">
          <img class="pics-books" :src="item" alt="魔理沙偷走了重要的东西" />
        </el-carousel-item>
      </el-carousel>

      <el-tabs class="tab-books" v-model="activeTab">
        <el-tab-pane
          :label="label[index]"
          :name="label[index]"
          v-for="(tab, index) in label"
          :key="index"
        >
          <el-table
            class="el-table-books"
            :data="tableData"
            border
            :show-header="false"
            :cell-style="{ 'font-size': '8px', 'text-align': 'center' }"
          >
            <el-table-column
              width="auto"
              v-for="(item, index) in tableData[index]"
              :key="index"
            >
              <router-link to="/list">
                <el-button
                  type="text"
                  size="large"
                  class="a-tab-books"
                  @click="getTab(item)"
                >
                  {{ item }}</el-button
                >
              </router-link>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-divider><i class="el-icon-notebook-2"></i></el-divider>
      <span style="font-size: 25px; color: #4c4c4c" class="el-icon-s-management"
        >随机推荐</span
      >
      <el-button
        class="c1-books"
        icon="el-icon-refresh-right"
        style="float: right"
        @click="randomUrl()"
        >换一批</el-button
      >
      <div class="recommend-books">
        <ul>
          <li
            v-for="(list, index) in list"
            :key="index"
            style="list-style: none"
            class="list-li-books"
          >
            <div>
              <router-link to="/bookdetail"
                ><img
                  class="r-img-books"
                  v-lazy="list.imgFix"
                  :key="list.imgFix"
                  @click="goBook(list)"
              /></router-link>
            </div>
            <router-link to="/bookdetail" class="r-name-books"
              ><div class="r-name-overflow-books" @click="goBook(list)">
                {{ list.name }}
              </div></router-link
            >
            <div class="r-author-books">{{ list.author }}</div>
          </li>
        </ul>
      </div>

      <div
        style="
          font-size: 25px;
          color: #4c4c4c;
          margin-top: 2%;
          display: inline-block;
          vertical-align: top;
        "
        class="el-icon-reading"
      >
        在线阅读
      </div>
      <div
        class="el-icon-medal-1"
        style="
          font-size: 25px;
          color: #4c4c4c;
          margin-top: 2%;
          display: inline-block;
          float: right;
          padding-right: 140px;
          margin-left: 300px;
        "
      >
        新书榜
      </div>
      <div class="read-books">
        <div v-for="(item, index) in list1" :key="index" class="r1-books">
          <div class="rimg-books">
            <router-link to="/ndetail"
              ><img @click="goNovel(item)" v-lazy="item.imgFix"
            /></router-link>
          </div>
          <div class="rinfo-books">
            <router-link to="/ndetail"
              ><div @click="goNovel(item)" class="text1-books">
                {{ item.name }}
              </div></router-link
            >
            <div class="text2-books">{{ item.author }} 著</div>
            <div class="text3-books">{{ item.intro }}</div>
            <el-tag class="text4-books">{{ item.publish }}</el-tag>
          </div>
        </div>
      </div>
      <div class="list-books">
        <div class="ltop-books">
          <router-link to="ndetail"
            ><img @click="goNovel(top[4])" :src="top[0]" class="timg-books"
          /></router-link>
          <div style="display: inline-block; width: 150px">
            <router-link to="ndetail"
              ><div @click="goNovel(top[4])" class="ltext-books">
                {{ top[1] }}
              </div></router-link
            >
            <div class="ltext1-books">{{ top[2] }} 著</div>
            <div class="ltext2-books">{{ top[3] }}</div>
          </div>
          <el-tag
            type="danger"
            style="
              margin-left: -40px;
              margin-top: 59px;
              margin-bottom: 18px;
              position: absolute;
            "
            >1</el-tag
          >
        </div>

        <div v-for="(item, index) in ltop" :key="index" class="r-books">
          <div
            :class="{
              'rank-books': index > 1,
              'rank2-books': index == 0,
              'rank3-books': index == 1,
            }"
          >
            {{ index + 2 }}
          </div>
          <router-link to="ndetail"
            ><div @click="goNovel(item)" class="rtext-books">
              {{ item.name }}
            </div></router-link
          >
          <div class="rtext1-books">{{ item.num }} 推荐</div>
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
  name: "books",
  components: {},
  data() {
    return {
      //东方图库
      pics: [
        "./imgs/bg4.jpg",
        "./imgs/bg5.jpg",
        "./imgs/bg6.jpg",
        "./imgs/bg8.jpg",
      ],
      list: [], //书籍列表
      list1: [], //在线阅读
      length: "", //书籍列表长度
      top: [], //顶部小说信息
      ltop: [], //顶部小说下面

      activeTab: "古籍国学", //默认启动的tab标签页
      activeTabs: 0, //v-for嵌套只显示第一个,保证tab表不重复
      tableData: [
        [
          //tab标签数据
          "经部",
          "史部",
          "子部",
          "集部",
          "丛部",
          "国学入门",
          "国学著作",
        ],
        ["文学", "小说", "传记", "青春", "动漫", "艺术"],
        [
          "哲学",
          "宗教",
          "社会科学",
          "政治",
          "法律",
          "军事",
          "文化",
          "历史",
          "地理",
        ],
        ["经济", "管理", "自我实现"],
        ["家居", "美食", "旅游", "娱乐时尚", "体育", "健康", "婚恋", "育儿"],
        [
          "科普读物",
          "自然科学",
          "工业技术",
          "医学",
          "农业科学",
          "计算机",
          "交通运输",
        ],
        ["教育", "教材", "教辅", "考试", "外语"],
        [
          "低幼读物",
          "启蒙认知",
          "科普文化",
          "童话世界",
          "游戏乐园",
          "动漫世界",
          "综合读物",
        ],
        [
          "索引/目录",
          "哲学宗教",
          "社科工具",
          "百科工具",
          "外语工具",
          "历史地理",
          "医学工具",
        ],
        ["暂缺分类"],
      ],

      //tab列表跳转
      label: [
        "古籍国学",
        "文学艺术",
        "人文社科",
        "经济管理",
        "生活时尚",
        "科学技术",
        "教育教辅",
        "少儿读物",
        "工具书",
        "暂缺分类",
      ], //tab表标题for循环
    };
  },
  methods: {
    async randomUrl() {
      let random = Math.round(Math.random() * 100);
      while (random == 0) {
        random = Math.round(Math.random() * 100); //页数
      }

      let random1 = Math.round(Math.random() * 9); //分类
      let randomi = Math.round(Math.random() * 25); //从当前页第几个循环
      try {
        let result = await request({
          url: `/du/book/100${random1}_${random}.html`,
          method: "get",
        });
        if (result.status == 200) {
          this.list = []; //每次重启记得清空数组
          let html = result.data;
          let $ = cheerio.load(html, { decodeEntities: false });
          let length = $(".container .row .bookslist ul li").length;
          this.length = length;
          for (let i = randomi; i < 14 + randomi; i++) {
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
        }
      } catch (error) {
      }
    },

    async getTab(item) {
      let result = await request({
        url: `/du/help/1589.html`,
        method: "get",
      });
      let html = result.data;
      let $ = cheerio.load(html, { decodeEntities: false });
      let tabUrl = $(
        `.container .span19 .text p a:contains(│　├  ${item})`
      ).attr("href");
      if (typeof tabUrl == "undefined") tabUrl = "/book/1000.html";
      let mainstore = useStore();
      mainstore.tabUrl = tabUrl;
    },

    async goBook(item) {
      let mainstore = useStore();
      mainstore.bookUrl = item.bookUrl;
    },

    async goNovel(item) {
      let mainstore = useStore();
      mainstore.novelUrl = item.end || item;
    },

    async novel() {
      let result = await request({
        url: "/no",
        method: "get",
      });
      if (result.status == 200) {
        let html = result.data;
        let $ = cheerio.load(html, { decodeEntities: false });
        for (let i = 0; i < 8; i++) {
          let end = $(`.mind-showbook .book-info .bookname a`)
            .eq(i)
            .attr("href");
          let img = end.match(/\d{1,6}/g).join('')  
          let imgFix = `./imgs/novel/${img}.jpg`
          let name = $(`.mind-showbook .book-info .bookname a`).eq(i).text();
          let intro = $(`.mind-showbook .book-info .info a`).eq(i).text();
          let author = $(`.mind-showbook .book-info .author a`).eq(i).text();
          let publish = $(`.mind-showbook .book-info .updatenum`).eq(i).text();

          let list = { imgFix, end, name, intro, author, publish };
          this.list1.push(list);
        }

        let topName = $(`.top-two-blank-right .tab-lists .list-b .title`)
          .eq(0)
          .text();
        let topAuthor = $(`.top-two-blank-right .tab-lists .list-b .author`)
          .eq(0)
          .text();
        let topnum = $(`.top-two-blank-right .tab-lists .list-b span`)
          .eq(1)
          .text();
        let topend = $(`.top-two-blank-right .tab-lists .list-b .title`).attr(
          "href"
        );
        let topimg = topend.match(/\d{1,6}/g).join('') 
        let topImgFix = `./imgs/novel/${topimg}.jpg`
        this.top = [topImgFix, topName, topAuthor, topnum, topend];

        for (let i = 1; i < 10; i++) {
          let name = $(
            `.top-two-blank-right .tab-lists .lists li:nth-of-type(${i + 1}) a`
          )
            .eq(0)
            .text();
          let end = $(
            `.top-two-blank-right .tab-lists .lists li:nth-of-type(${i + 1}) a`
          )
            .eq(0)
            .attr("href");
          let num = $(
            `.top-two-blank-right .tab-lists .lists li:nth-of-type(${
              i + 1
            }) span`
          )
            .eq(0)
            .text();
          let list = { name, num, end };
          this.ltop.push(list);
        }
      }
    },
  },
  created() {
    this.randomUrl(); //开启获取随机
    this.novel();
  },
};
</script>

<style>
/* 轮播图 */
.carousel-books {
  top: -25px;
  width: 50%;
  display: inline-block;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 265px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/* 中央布局 */
.middle-books {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* 左右边栏背景 */
.bg-books {
  height: 100%;
  z-index: -112;
  background: no-repeat;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      #ffffff 30%,
      #ffffff 70%,
      rgba(255, 255, 255, 0) 100%
    ),
    url("../../public/imgs/bg1.jpg");
  background-size: cover;
  width: 100%;
  position: fixed;
}
@media (max-width: 736px) {
  .bg-books{
      background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 5%,
      rgba(255, 255, 255, 1) 95%,
      rgba(255, 255, 255, 0) 100%
    ),
    url("../../public/imgs/bg1.jpg");
  }  
}

/* tab栏 */
.tab-books {
  margin-left: 620px;
  width: 561px;
  margin-top: -269px;
}

/* tab高亮颜色 */
.el-tabs__active-bar {
  background-color: rgb(84, 92, 100);
}
.el-tabs__item.is-active {
  color: rgb(0, 0, 0);
}
/* 单个单元格样式 */
.a-tab-books {
  color: #606266;
  transition: color 0.25s ease;
  height: 160px;
}

/* 实在解决不了多格问题,只好限制高度了 */
.el-table-books {
  max-height: 186px;
}

/* 随机推荐 */
.recommend-books {
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 2%;
  min-height: 482px;
  background: #606266(0, 0, 0, 0.9);
  backdrop-filter: blur(10px)
}


/* 随机推荐li样式 */
.list-li-books {
  overflow: hidden;
  padding-left: 12px;
  width: 152px;
  height: 270px;
  display: inline-block;
  text-align: center;
}

.r-img-books {
  display: block;
  padding-top: 9px;
  padding-bottom: 13px;
  margin-bottom: 16px;
  height: 142px;
  width: 142px;
  transition-duration: 0.3s;
}

.r-img-books:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);
}

.r-name-books {
  color: #4c4c4c;
  font-size: 16px;
  font-weight: bold;
  transition-duration: 0.3s;
  max-height: 42px;
  display: inline-block;
  width: 152px;
  text-overflow: ellipsis;
}
.r-name-overflow-books {
  width: 152px;
  max-height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.r-author-books {
  text-align: center;
  font-size: 13px;
  color: #888;
  padding-top: 10px;
}
.r-name-books:hover {
  color: #409eff;
}
/* 轮播图图片大小 */
.pics-books {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 换一批按钮 */
.c1-books {
  border-radius: 4px;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  display: inline-block;
  line-height: 30px;
  padding-left: 19px;
  padding-right: 19px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-right: 3%;
  transition-duration: 0.3s;
}

/* 在线阅读整体盒子 */
.read-books {
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 2%;
  min-height: 482px;
  width: 936px;
  display: inline-block;
  background: #606266(0, 0, 0, 0.9);
  backdrop-filter: blur(10px)
}
/* 每个小说大盒子 */
.r1-books {
  width: 426px;
  height: 160px;
  display: inline-block;
  margin: 2%;
  vertical-align: top;
}
/* 图片 */
.rimg-books {
  height: 160px;
  width: 110px;
  display: inline-block;
  transition-duration: 0.3s;
}
.rimg-books:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);
}
/* 小说文本父 */
.rinfo-books {
  width: 300px;
  display: inline-block;
  vertical-align: top;
}

.text1-books {
  line-height: 25px;
  width: 280px;
  text-align: center;
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition-duration: 0.3s;
  padding-left: 9px;
  font-weight: bold;
  margin-left: 10px;
  color: #4c4c4c;
}
.text1-books:hover {
  color: #409eff;
}
.text2-books {
  color: #888;
  text-align: center;
  font-size: 13px;
  margin-top: 13px;
  margin-left: 20px;
}
.text3-books {
  color: #888;
  font-size: 13px;
  margin-top: 13px;
  margin-left: 20px;
}
.text4-books {
  float: right;
  margin-top: 12px;
  margin-right: 25px;
}
/* 在线阅读右边 */
.list-books {
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 2%;
  width: 236px;
  min-height: 482px;
  display: inline-block;
  margin-left: 24px;
  vertical-align: top;
  background: #606266(0, 0, 0, 0.9);
  backdrop-filter: blur(10px)
}
/* 右侧栏头部 */
.ltop-books {
  height: 102px;
  border-bottom: 1px solid #ddd;
  padding-left: 10px;
  padding-right: 10px;
}
.timg-books {
  min-height: 80px;
  width: 54.3px;
  vertical-align: top;
  line-height: 216px;
  margin: 10px 10px 10px 0px;
  transition-duration: 0.3s;
}
.timg-books:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);
}
.ltext-books {
  text-align: center;
  font-size: 13px;
  padding-top: 17px;
  color: #4c4c4c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 8px;
  display: inline-block;
  width: 142px;
}
.ltext-books:hover {
  color: #409eff;
}
.ltext1-books {
  font-size: 10px;
  padding-top: 8px;
  margin-left: 8px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.ltext2-books {
  font-size: 10px;
  padding-top: 8px;
  margin-left: 8px;
  color: #888;
  display: block;
}
/* 排名九个样式 */
.rtext-books {
  font-size: 13px;
  padding-top: 20px;
  color: #4c4c4c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 12px;
  display: inline-block;
  width: 162px;
  transition-duration: 0.3s;
}
.rtext-books:hover {
  color: #409eff;
}
.rtext1-books {
  font-size: 10px;
  margin-left: 160px;
  color: #888;
  display: inline-block;
  vertical-align: top;
}
/* 排名每个小盒子父 */
.r-books {
  border-bottom: 1px solid #ddd;
}
/* 排名小按钮2 */
.rank2-books {
  background-color: #fdf6ec;
  border: 1px solid #faecd8;
  color: #e6a23c;
  border-radius: 4px;
  height: 32px;
  display: inline-block;
  line-height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
  font-size: 12px;
  margin-left: 14px;
}
.rank3-books {
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  color: #67c23a;
  border-radius: 4px;
  height: 32px;
  display: inline-block;
  line-height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
  font-size: 12px;
  margin-left: 14px;
}
.rank-books {
  background-color: #f4f4f5;
  border: 1px solid #e9e9eb;
  color: #909399;
  border-radius: 4px;
  height: 32px;
  display: inline-block;
  line-height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
  font-size: 12px;
  margin-left: 14px;
}
</style>