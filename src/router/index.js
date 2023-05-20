import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
import routes from './routes'

export let router = new VueRouter({
    mode:'history',
    routes,
    scrollBehavior (to, from, savedPosition) {
        return {y:0}
    }
})

router.beforeEach((to,from,next)=>{
    next()
})//先挂一个路由守卫

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}//连续点击的报错问题
