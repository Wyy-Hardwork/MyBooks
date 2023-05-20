<template>
  <div class="bg-ad">
    <div class="content-ad">
      <div class="menu-box-ad">
        <!-- 展示与隐藏侧边栏 开始-->
        <input type="checkbox" id="menu-btn"  @click="collapse =!collapse" />
        <label for="menu-btn"><i class="el-icon-arrow-left"></i></label>
        <!-- 展示与隐藏侧边栏 结束-->
        <div class="menu">
          <router-link to="/favorites">
          <div class="menu-item-ad" @click="choice = 1" :class="{itemonAd : activeIndex == 'favorites'}">
              <i class="el-icon-star-on"></i>
              <span>个人收藏</span>
          </div>  
          </router-link>

          <router-link to="/edit">
          <div v-if="permission == 1" class="menu-item-ad" @click="choice = 2" :class="{itemonAd : activeIndex == 'edit'}">
              <i class="el-icon-edit-outline"></i>
              <span>书籍编辑</span>
          </div>
          </router-link>

        </div>
      </div>
    </div>
        <div class="left-ad" :class="{leAd:collapse}"></div>
        <router-view></router-view>
  </div>
</template>

<script>
import request from "../api/request";
import { useStore } from "@/store/index";
export default {
  components: {},
  data() {
    return {
      activeIndex:'',
      collapse:false,
      permission:0,
    };
  },
  methods: {
    async permiss(){
      let mainStore = useStore()
      let id = mainStore.uid
      let result = await request.post('/base/permiss',{
        uid:id
      })
      this.permission = result.data[0].permiss
    }
  },
  mounted() {
    this.activeIndex = this.$route.name
    this.permiss()
  },
  watch:{
    $route(to) {
      this.activeIndex = to.name;
    },
  }

};
</script>
<style>
/* 背景 */
.bg-ad {
  background: #d3d3d1 url("../../public/imgs/nbg/shenhui.png") repeat;
}

.left-ad{
  transition-duration: .5s;
  width: 180px;
  display: inline-block;
  height: 100%;
  background: #545c64;
}

.menu {
  font-size: 18px;
  width: 180px;
  min-height: 100%;
  cursor: pointer;
  overflow: hidden;
  transition: width var(--transition-menu-time);
  color: var(--font-color-mi);
}


/* 侧边栏大盒子 */
.menu-box-ad {
  border-top-color: transparent;
  letter-spacing: 0.5px;
  min-height: 100vh;
  position: relative;
  text-align: center;
  background-color: var(--color-menu-bg);
}
/* 侧边栏每一项 */
.menu-item-ad{
  text-align: center;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  white-space: nowrap;
  transition-duration: .3s;
  cursor: pointer;
  font-size: 14px;
  color:rgb(247, 242, 238)
}
.menu-item-ad:hover{
  background-color: rgb(67, 74, 80);
}

@media (max-width: 736px) {
.left-ad{
min-width: 84px;
width: 10vw;
}
.menu {
min-width: 84px;
width: 10vw;
}
.menu-item-ad{
  height: 50px;
  line-height: 50px;
  font-size: 12px;
  padding: 0 2vw;
}
}

.menu-box-ad > input#menu-btn:checked ~ .menu {
  width: 0;
}

.leAd{
  width: 0px !important;
  transition-duration: .5s;
  background: #545c64;
  color: #dfcdbd;
}

/* 侧边栏盒子 */
.list-ad {
  display: inline-block;
  vertical-align: top;
}

/*黑色主题，使用时把上面的白色主题注释掉，启用下面的css代码*/
:root {
  --color-bg: #e7e7e7;
  --color-menu-bg: rgb(84, 92, 100);
  --font-color-mi: #c9cdd4;
  --font-color-mi-hover: rgb(223, 205, 189);
  --color-bg-mi-hover: #303030;
  --border-radius-mi: 2px;
  --transition-menu-time: 0.5s;
  --color-line-bg: #4c4c4c;
}

/* 用于固定的总容器 */
.content-ad {
  display: inline-block;
  vertical-align: top;
  position: fixed;
}
/* 激活状态 */
.itemonAd{
  background-color: rgb(67, 74, 80);
  color: #dfcdbd;
}


.menu-box-ad input[type="checkbox"] {
  display: none;
}


/* 箭头标签label */
.menu-box-ad > label {
  position: absolute;
  top: 48%;
  right: 0;
  transform: translateX(50%);
  width: 20px;
  height: 20px;
  border-radius: 20px;
  box-shadow: 0px 0px 4px 0px #000;
  background-color: var(--color-menu-bg);
  color: var(--font-color-mi);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.menu-box-ad > label > i {
  font-weight: 900;
  text-indent: -3px;
  font-size: 17px;
  transition: transform var(--transition-menu-time);
  transform: rotate(0deg);
}

.menu-box-ad > label:hover {
  box-shadow: 0px 0px 2px 0px #000;
  color: var(--font-color-mi-hover);
}

.menu-box-ad > input#menu-btn:checked + label > i {
  transform: rotate(180deg);
}

</style>