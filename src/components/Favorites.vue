<template>
<div class="box-fa">
<div style="font-size: 25px; color: #4c4c4c;padding-left:1%;padding-top:1%" class="el-icon-star-on">个人收藏</div>
<div class="bg-fa" id="a-fa">
  <div class="el-icon-folder-opened em-fa" v-if="list1.length == 0">暂无收藏</div>

        <div>
        <ul>
          <li
            v-for="(list, index) in list1"
            :key="index"
            style="list-style: none"
            class="list-li-fa"
          >
            <div class="ul-fa">
              <router-link to="/bookdetail"
                ><img
                  class="r-img-fa"
                  v-lazy="list.imgFix"
                  :key="list.imgFix"
                  @click="goBook(list)"
              /></router-link>
            </div>
            <router-link to="/bookdetail" class="r-name-fa"
              ><div class="r-name-overflow-fa" @click="goBook(list)">
                {{ list.name }}
              </div></router-link
            >
            <div class="r-author-fa">{{ list.author }}</div>
          </li>
        </ul>
      </div>

</div>
<div class="bg-fa" id="b-fa">
  <div class="el-icon-folder-opened em-fa" v-if="list2.length == 0">暂无收藏</div>

          <div>
        <ul>
          <li
            v-for="(list, index) in list2"
            :key="index"
            style="list-style: none"
            class="list-li-fa"
          >
            <div class="ul-fa">
              <router-link to="/ndetail"
                ><img
                  class="r-img-fa1"
                  v-lazy="list.imgFix"
                  :key="list.imgFix"
                  @click="goNovel(list)"
              /></router-link>
            </div>
            <router-link to="/ndetail" class="r-name-fa"
              ><div class="r-name-overflow-fa" @click="goNovel(list)">
                {{ list.name }}
              </div></router-link
            >
            <div class="r-author-fa">{{ list.author }}</div>
          </li>
        </ul>
      </div>

</div>
</div>
</template>

<script>
import request from "../api/request";
import { useStore } from "@/store/index";
import cheerio from "cheerio";
export default {
components: {},
data() {
return {
    list1:[],
    list2:[],
};
},
methods: {
    async getBook(){
      let mainStore = useStore()
      let result = await request.post('/base/fa',{
        uid:mainStore.uid,
        type:0
      })
      for (let key of result.data) {
        let result = await request.get(`/du/${key.url}`)
        let html = result.data;
        let $ = cheerio.load(html, { decodeEntities: false });
        let img = $(".container .bookdetails-left .book-pic .pic img").attr('src')
        let imgFix = img.replace("https://img.dushu.com", "/dt");
        let name = $(".container .bookdetails-left .book-pic .pic img").attr("alt");
        let author = $(".bookdetails-left .book-details #ctl00_c1_bookleft table td").eq(1).text();
        let bookUrl = `${key.url}`
        let item = {imgFix,name,author,bookUrl}
        this.list1.push(item)
      }
    },
    async getNovel(){
      let mainStore = useStore()
      let result = await request.post('/base/fa/1',{
        uid:mainStore.uid,
      })
      for (const key of result.data) {
        key.imgFix = `./imgs/novel/${key.img}.jpg`
      }
      this.list2 = result.data
    },
    goBook(item) {
      let mainstore = useStore();
      mainstore.bookUrl = item.bookUrl;
    },
    goNovel(item) {
      let mainstore = useStore();
      mainstore.novelUrl = item.novelUrl;
    },
},
mounted(){
  this.getBook()
  this.getNovel()
}
}
</script>
<style>
/* 大盒子 */
.box-fa{
  display: inline-block;
  width: calc(100% - 13vw);
  margin-left: 1%;
}
/* 每个盒子的样式 */
.bg-fa {
  border-radius: 4px;
  border: solid 1px #ddd;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  background: #606266(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  background: #d3d3d1 url("../../public/imgs/nbg/hui.png") repeat;
  margin-top: 1%;
  margin-left: 1%;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow-y: scroll;
}

/* 没有东西的字 */
.em-fa{
  font-size: 30px;
  color: #606266;
  padding: 1%;
}

@media (max-width: 736px) {
  .box-fa{
  display: inline-block;
  width: 71vw;
  margin-left: 18px;
}
}

#a-fa{
    width: 100%;
    height: 50vh;
}

#b-fa{
    width: 100%;
    height: 50vh;
}

/* 每个单元 */
.list-li-fa {
  overflow: hidden;
  padding-left: 14px;
  width: 152px;
  height: 270px;
  display: inline-block;
  text-align: center;
}
.r-img-fa {
  display: block;
  padding-top: 9px;
  padding-bottom: 13px;
  margin-bottom: 16px;
  height: 142px;
  width: 142px;
  transition-duration: 0.3s;
}

.r-img-fa:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);
}

.r-name-fa {
  color: #4c4c4c;
  font-size: 16px;
  font-weight: bold;
  transition-duration: 0.3s;
  max-height: 42px;
  display: inline-block;
  width: 152px;
  text-overflow: ellipsis;
}
.r-name-overflow-fa {
  width: 152px;
  max-height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.r-author-fa {
  text-align: center;
  font-size: 13px;
  color: #888;
  padding-top: 10px;
}
.r-name-fa:hover {
  color: #409eff;
}
.ul-fa {
  margin-left: auto;
  margin-right: auto;
}
.r-img-fa1 {
  display: block;
  padding-top: 9px;
  padding-bottom: 13px;
  margin-bottom: 16px;
  height: 142px;
  width: 102px;
  margin-left: auto;
  margin-right: auto;
  transition-duration: 0.3s;
}
.r-img-fa1:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);
}
</style>