//为什么我的js无效?想想你有没有导入进main
import Vue from 'vue'
import gif from '../public/imgs/load.gif'
import error from '../public/imgs/error.jpg'
import App from './App.vue'
import { router } from './router'
import Lazyload from 'vue-lazyload'
import { PiniaVuePlugin, createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import {VueMasonryPlugin} from 'vue-masonry';


//e-ui部分
import {
  Tag,
  Table,
  TableColumn,
  Breadcrumb,
  BreadcrumbItem,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Button,
  Input,
  Carousel,
  CarouselItem,
  Tabs,
  TabPane,
  Radio,
  RadioButton,
  RadioGroup,
  Divider,
  Message,
  Pagination,
  Backtop,

} from 'element-ui';

//e-ui部分

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(Button);
Vue.use(Input);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(Divider);
Vue.use(Pagination);
Vue.use(Backtop);
Vue.prototype.$message = Message

Vue.use(PiniaVuePlugin)

Vue.use(VueMasonryPlugin)


const pinia = createPinia()

Vue.use(router)
Vue.use(Lazyload, {
  loading: gif,
  error,
  attempt: 1
})

pinia.use(piniaPersist)

Vue.config.productionTip = false

Vue.prototype.$scrollTo = (x = 0, y = 0, type = 'smooth') => {
	window.scrollTo({
		top: x,
		left: y,
		behavior: type // 滚动行为：smooth平滑滚动，instant瞬间滚动，默认值auto，等同于instant
    //来源是网上
	})
}


new Vue({
  render: h => h(App),
  router,
  pinia,
}).$mount('#app')
