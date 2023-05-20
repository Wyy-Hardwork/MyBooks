<template>
<div class="bg-read">
  <div class="middle-read">
    <div class="isNight-read" v-if="isNight == false"><i class="el-icon-sunny"></i>  --{{cname}}--</div>
    <div class="isNight-read" v-if="isNight == true"><i class="el-icon-moon"></i>  --{{cname}}--</div>
    <div v-html="text" class="text-read"></div>
    <div class="button-read">
      <div class="big-read">
        <el-button type="info" @click="goRead(nextPage)" v-if="this.nextName !=='下一章'"> {{nextName}}<i class="el-icon-arrow-right"></i> </el-button>
      </div>
      <div class="bu1-read">
        <el-button type="info" v-if="cindex == 0" disabled> 这里是本卷的第一章 </el-button>
        <el-button type="info" @click="prev()" v-if="cindex !== 0"> <i class="el-icon-arrow-left"></i>上一章 </el-button>
        <el-button type="info" @click="back()" v-if="nextName !=='看完了,点我返回目录'"> <i class="el-icon-tickets"></i> 返回目录</el-button>
        <el-button type="info" @click="next()" v-if="cindex !== maxPage"> 下一章<i class="el-icon-arrow-right"></i> </el-button>
        <el-button type="info" v-if="cindex == maxPage" disabled> 已经是本卷最后一章 </el-button>
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
  components: {},
  data() {
    return {
    text:'',
    maxPage:0,
    isNight: false,
    nextPage:'',
    nextName:'',
    isRead:false,//看你是换章节还是长按钮,false换章节，true长按钮显示什么作用什么
    cd:false,//防止长按钮下一章死循环
    };
  },
  methods: {
    async goRead(item) {
      if(this.nextName == '看完了,点我返回目录'){
        this.$router.push('ndetail')
        return
      }else if(this.nextName == '下一章'){
        
      }
      let mainStore = useStore();
      let url
      if(this.isRead == false){
        url = mainStore.chapters[mainStore.cindex]
        this.isRead = true
      }else{
        url = item
      }
      let result = await request({
        url: `/no${url}`,
        method: "get"
      });
      if (result.status == 200) {
        let html = result.data
        let $ = cheerio.load(html, { decodeEntities: false });
        let text = $(`#mlfy_main_text`).html()
        this.nextPage = $(`.mlfy_page a:nth-of-type(5)`).attr('href')
        let nextName = $(`.mlfy_page a:nth-of-type(5)`).text()
        if(nextName.includes('返回')){
          this.nextName = '看完了,点我返回目录'
        }else{
          this.nextName = nextName
        }
        const regex = /https:\/\/img1\.readpai\.com/g;
        text = text.replace(regex,'/pic')
        this.text = text.replace
(/|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||/g,function(match){//replace第二个参数用函数,return值
          let map = {
            "":"液",
            "":"阴",
            "":"射",
            "":"肉",
            "":"裸",
            "":"舔",
            "":"穴",
            "":"呻",
            "":"胸",
            "":"乳",
            "":"脱",
            "":"私",
            "":"美",
            "":"成",
            "":"交",
            "":"小",
            "":"之",
            "":"后",
            "":"还",
            "":"如",
            "":"地",
            "":"和",
            "":"大",
            "":"家",
            "":"到",
            "":"时",
            "":"这",
            "":"会",
            "":"去",
            "":"里",
            "":"们",
            "":"然",
            "":"多",
            "":"发",
            "":"么",
            "":"事",
            "":"也",
            "":"好",
            "":"以",
            "":"上",
            "":"作",
            "":"于",
            "":"天",
            "":"为",
            "":"心",
            "":"只",
            "":"她",
            "":"样",
            "":"没",
            "":"第",
            "":"对",
            "":"起",
            "":"下",
            "":"看",
            "":"道",
            "":"想",
            "":"要",
            "":"个",
            "":"开",
            "":"来",
            "":"唇",
            "":"过",
            "":"性",
            "":"当",
            "":"把",
            "":"种",
            "":"自",
            "":"得",
            "":"而",
            "":"出",
            "":"学",
            "":"能",
            "":"都",
            "":"用",
            "":"欲",
            "":"可",
          };
          //字典是一种特殊的键值对,学到了
          return map[match]
        })
      }
      if(this.nextName.includes('下')){
        this.$scrollTo();
      }
        

    },
    async next(){
      let mainStore = useStore()
      mainStore.cindex++
      this.isRead = false
      this.goRead()
      this.$scrollTo();
    },
    async prev(){
      let mainStore = useStore()
      mainStore.cindex--
      this.isRead = false
      this.goRead()
      this.$scrollTo();
    },
    async back(){
      this.$router.push('ndetail')
    },
    getMaxPage(){
      let mainStore = useStore()
      this.maxPage = mainStore.chapters.length - 1
    }
  },
  created(){
    this.goRead()
    this.getMaxPage()
  },
  mounted() {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDarkMode) {
      this.isNight = true
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (event.matches) {
        this.isNight = true
      } else {
        this.isNight = false
      }
    })
  },
  computed:{
    cindex: {
      get() {
        let mainStore = useStore();
        return mainStore.cindex;
      },
      set(val) {},
    },
    cname: {
      get() {
        let mainStore = useStore();
        return mainStore.cname;
      },
      set(val) {},
    },    
  }
};
</script>
<style>
.bg-read{
  background: #d3d3d1 url('../../public/imgs/nbg/shenhui.png') repeat;
  min-height: 100vh;
}
.middle-read {
  width: 60vw;
  margin-left: auto;
  margin-right: auto;
  background: #efe3bf url('../../public/imgs/nbg/hui.png') repeat;
  min-height: 100vh;
}
.isNight-read{
  padding-left: 1px;
  padding: 1vw;
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #4c4c4c;
  max-width: 58vw;
  vertical-align: middle;
}
.isNight-read > .el-icon-sunny{
  margin-right: 1vw;
}
.isNight-read > .el-icon-moon{
  margin-right: 1vw;
}

.text-read >div{
    text-indent: 2em;
    word-wrap: break-word;
    word-break: break-word;
    padding: 4vw;
    font-size: 20px;
    line-height: 45px;
    color: #4c4c4c;
}

/* 标题 */
.text-read > h1 {
    text-align: center;
    padding-bottom: 2vh;
    border-bottom: 1px dotted #9e9e9e;
    background-size: 100%;
    font-size: 30px;
    line-height: 60px;
    color: #4c4c4c;
}

@media (prefers-color-scheme: dark) {
.bg-read{
  background: #d3d3d1 url('../../public/imgs/nbg/shenhei.png') repeat;
}
.middle-read {
  background: #efe3bf url('../../public/imgs/nbg/hei.png') repeat;
}
.text-read >div{
  color :#e4e3e0
}
.text-read > h1{
  color :#e4e3e0
}
.isNight-read{
  color: #e4e3e0;
}
}


@media (max-width: 736px) {
  .middle-read{
    width: 100vw;
    padding: 0 1rem;
    font-size: 25px;
    line-height: 60px;
  }
  .isNight-read{
    max-width: 90vw;
  }
  .isNight-read > .el-icon-sunny{
  margin-right: 7vw;
  }
.isNight-read > .el-icon-moon{
  margin-right: 7vw;
  }  
}
/* 大按钮 */
.big-read > .el-button{
  width: 100%;
  margin: 1vw 0;
}
/* 按钮大盒子 */
.button-read{
  border-top: 1px dotted #9e9e9e;
  padding: 1vh;
}
/* 按钮子 */
.bu1-read{
  margin: 2vh 0;
  width: 100%;
  display: flex;
  justify-content: space-around
}
</style>