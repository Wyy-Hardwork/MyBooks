import { number } from 'echarts'
import {defineStore} from 'pinia'

//name必须唯一,pinia会把容器挂载到根容器
export const useStore = defineStore('MyFirstPinia',{
    //类似data
    //必须是函数,也必须是箭头函数(为了避免服务端渲染数据污染)
    //不要在组件里面解构useStore,会导致不是响应式,需要导入storeToRefs这个api
    state:()=>{
        return {
            tabUrl:'/book/',//f5刷新会导致数据初始化注意
            bookUrl:'',
            novelUrl:'',
            search:'',
            isLogin:true,
            id:'',
            uid:'',
            tableData1:[],
            chapters:[],
            cindex:number,
            cname:'',
        }
    },
    persist:true,//持久化插件对数据进行localStorage缓存
    //类似computed
    getters:{},
    //封装业务逻辑修改state(methods)
    actions:{}
})