<template>
  <div>
    <el-backtop
      style="text-align: center; vertical-align: middle"
      :visibility-height="200"
      >↑</el-backtop
    >

    <div class="bg-chapter"></div>
    <div class="main-chapter">
      <div class="title-chapter" v-if="isSearch == true && amount !== 0">
        搜索列表中有<em>{{ this.amount }}</em
        >项符合"<em>{{ this.input }}</em
        >"以及筛选条件的结果
      </div>
      <div class="title-chapter" v-if="isSearch == true && amount == 0">
        很抱歉！搜索列表中没有找到与"<em>{{ this.input }}</em
        >"相关的图书，试着重新搜索一下吧！
      </div>
      <div>
        <el-button
          v-if="isSearch == true"
          class="btag-chapter el-icon-close"
          @click="
            page = 1;
            Novel();
          "
          >返回推荐排序</el-button
        >
        <div
          style="
            font-size: 25px;
            margin-left: 1%;
            margin-bottom: 13px;
            color: #4c4c4c;
          "
          class="el-icon-search"
          v-if="isSearch == true"
        >
          搜索结果
        </div>
      </div>

      <div class="content-chapter" v-for="(item, index) in list" :key="index">
        <router-link to="/ndetail"
          ><img
            @click="goBook(item)"
            class="img1-chapter"
            v-lazy="item.imgFix || item.img"
        /></router-link>
        <router-link to="/ndetail"
          ><div
            @click="goBook(item)"
            class="con1-chapter"
            v-html="item.title"
          ></div
        ></router-link>
        <div class="con2-chapter">
          <el-tag type="success" style="margin-right: 9px">{{
            item.author
          }}</el-tag>
          <el-tag type="warning" style="margin-right: 9px">{{
            item.publisher
          }}</el-tag>
          <el-tag type="danger" style="margin-right: 9px">{{
            item.isEnd
          }}</el-tag>
        </div>
        <div class="con3-chapter">{{ item.intro }}</div>
        <div class="con4-chapter">
          <el-tag type="info" style="margin-right: 9px">最新章节</el-tag
          >{{ item.last }}
        </div>
      </div>
      <div>
        <el-pagination
          class="page-chapter"
          background
          layout="prev, pager, next"
          :total="Math.ceil(this.amount / 20) * 10"
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
import request from "../api/request";
import { useStore } from "@/store/index";
export default {
  components: {},
  data() {
    return {
      page: 1, //当前页
      list: [],
      amount: 3596, //搜索总量
      input: "",
      isSearch: false,
      isAmount: false, //已经查询过页数，无需重复
    };
  },
  methods: {
    async Novel() {
      let mainStore = useStore();
      mainStore.search = "";
      this.isSearch = false;
      this.amount = 3596;
      let result = await request.post(`/base/novel/0`, { page: this.page });
      for (const key of result.data) {
        key.img = `./imgs/novel/${key.img}.jpg`;
      }
      this.list = result.data;
    },
    // 跳转到详情页
    async goBook(item) {
      let mainStore = useStore();
      let NovelUrl = item.NovelUrl;
      mainStore.novelUrl = NovelUrl;
    },
    async novelSearch() {
      let mainStore = useStore();
      this.input = mainStore.search;
      if (this.input == "") return; //这句话解决了取消搜索状态后,不能重复搜索刚才搜索结果的情况，产生的原因是computed变动
      let result = await request.post(`/base/novel/`, {
        search: this.search,
        page: this.page,
      });
      for (const key of result.data) {
        key.img = `./imgs/novel/${key.img}.jpg`;
      }
      this.list = result.data;
      this.isSearch = true;
      if (this.isAmount == false) {
        let result1 = await request.post(`/base/novel/1`, {
          search: this.search,
        });
        this.amount = result1.data[0].amount;
        this.isAmount = true;
      }
    },
    Currentpage(val) {
      //当前页方法,配合Element-ui
      this.page = val;
      //根据是否搜索状态判断分页
      if (this.isSearch == false) {
        this.Novel();
      } else {
        this.novelSearch();
      }
      this.$scrollTo();
    },
  },
  mounted() {
    this.Novel();
  },
  watch: {
    search() {
      this.page = 1;
      this.isAmount = false;
      this.novelSearch();
    },
  },
  computed: {
    search: {
      get() {
        let mainStore = useStore();
        return mainStore.search;
      },
      set(val) {},
    },
  },
};
</script>

<style>
.title-chapter > em{
  font-style: normal !important;
  color: #409eff;
}
/* 首行提示字 */
.title-chapter{
  font-size: 20px;
  height: 60px;
  line-height: 60px;
  display: inline-block;
}
.main-chapter {
  width: 1200px;
  min-height: 2000px;
  margin-left: auto;
  margin-right: auto;
}

.bg-chapter {
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
    url("../../public/imgs/bg2.jpg");
  background-size: cover;
  width: 100%;
  position: fixed;
}

@media (max-width: 736px) {
  .bg-chapter {
    background-image: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 10%,
        rgba(255, 255, 255, 1) 90%,
        rgba(255, 255, 255, 0) 100%
      ),
      url("../../public/imgs/bg2.jpg");
  }
}

.content-chapter {
  width: 1200px;
  min-height: 225px;
  margin-left: 1%;
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
  padding-top: 20px;
  padding-bottom: 20px;
}
/* 列表图片 */
.img1-chapter {
  height: 200px;
  width: 142px;
  transition-duration: 0.3s;
  position: absolute;
  margin-left: 25px;
}
.img1-chapter:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 10px -10px rgba(85, 122, 245, 0.5);
}
/* 列表文字 */
.con1-chapter {
  margin-top: 13px;
  vertical-align: top;
  max-width: 700px;
  max-height: 54px;
  padding-left: 195px;
  font-size: 22px;
  line-height: 22px;
  max-height: 66px;
  font-weight: bold;
  transition-duration: 0.3s;
  color: #4c4c4c;
}
.con1-chapter:hover {
  color: #409eff;
}
.con2-chapter {
  vertical-align: top;
  max-width: 700px;
  height: 60px;
  line-height: 60px;
  padding-left: 195px;
  color: #888;
}
.con3-chapter {
  vertical-align: top;
  max-width: 1000px;
  padding-left: 195px;
  color: #888;
  line-height: 24px;
  max-height: 96px;
}
.con4-chapter {
  vertical-align: top;
  max-width: 1000px;
  padding-left: 195px;
  color: #888;
  font-size: 13px;
  margin-top: 12px;
}
/* 取消搜索 */
.btag-chapter {
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
/* 分页器 */
.page-chapter {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
