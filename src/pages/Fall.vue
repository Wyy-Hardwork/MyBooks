<template>
  <div>
    <div class="bg-p"></div>
    <div class="big-p" v-if="big" @click="changeBig()">
      <img class="bigImg-p" :src="bigImg" />
    </div>
    <div v-masonry item-selector=".item-p" class="masonry-p" ref="masonry">
      <div v-masonry-tile class="item-p" v-for="item in pics" :key="item">
        <img
          class="image-p"
          @click="
            open(item);
            changeBig(item);
          "
          v-lazy="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      pics: [],
      nums: [],
      big: false,
      bigImg: "",
      first:1,
      max:8
    };
  },
  methods: {
    open(item) {
      this.bigImg = newImg;
    },
    changeBig(item) {
      this.big = !this.big;
      while(item == undefined){
        this.bigImg = ''
        return
      }
    },
    random() {
      let allCount = 3000
      for (let i = 0; i < this.max; i++) {
        let num = Math.floor(Math.random() * allCount) + 1;
        while (this.nums.indexOf(num) !== -1) {
          num = Math.floor(Math.random() * allCount) + 1;
        }
        this.nums.push(num);
        let item = `./imgs/novel/${num}.jpg`;
        this.pics.push(item);
      }
      while (this.first == 1) {
        this.max = 4
        this.first = 0
      }
    },
    handleScroll() {
      // 获取当前窗口滚动的位置
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // 判断是否滚动到底部
      if (
        scrollTop + window.innerHeight >=
        document.documentElement.scrollHeight - (window.innerHeight*0.4)
      ) {
        // 执行需要触发的函数
        this.random();
      }
    },
    throttle(fn, delay) {
      let timer = null;
      return function () {
        let context = this;
        let args = arguments;
        if (!timer) {
          timer = setTimeout(function () {
            fn.apply(context, args);
            timer = null;
          }, delay);
        }
      };
    },
  },
  mounted() {
    this.random();
    window.addEventListener("scroll", this.throttle(this.handleScroll, 500));
    setTimeout(() => {
      this.$message.success('书籍封面,测试用')
    }, 1000);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.throttle(this.handleScroll, 500));
  },
};
</script>

<style>
.bg-p {
  height: 100%;
  z-index: -112;
  background: no-repeat;
  background-image: url("../../public/imgs/bg5.jpg");
  background-size: cover;
  width: 100%;
  position: fixed;
}
.pic-p{
  text-align: center;
}
.pic1-p{
  transition-duration: .5s;
}
.pic1-p:hover{
  transform: scale(1.03);
}
/* 所有图片盒子 */
.masonry-p {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
/* 单个图片容器 */
.item-p {
  width: 25%;
  margin-bottom: 0.5vh;
  box-sizing: border-box;
  border-radius: 5px;
  padding-left: 0.25%;
  padding-right: 0.25%;
}

.item-p img {
  display: block;
  width: 100%;
}

.image-p {
  animation: fadeIn 1.5s ease-in-out forwards;
}

.big-p {
  background-color: rgba(39, 36, 36, 0.8);
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 5;
  padding: auto;
}

.bigImg-p {
  animation: fadeIn 0.3s ease-in-out forwards;
  height: 85vh;
  display: block;
  top: 45%;
  left: 50%;
  transform: translate(-50%,-50%);
  position: absolute;
}
@media (max-width: 736px) {
  .masonry-p {
  width: 100vw;
  margin-left: auto;
  margin-right: auto;
  }
  .item-p {
    width: 50%;
    padding-left: 0.5%;
    padding-right: 0.5%;
  }
  .bigImg-p {
    height: auto;
    width: 88vw;
  }
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>