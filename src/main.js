import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'
import './common/css/style.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import 'vxe-table/lib/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import  {getRequest} from "./util/api";
import  {postRequest} from "./util/api";
import  {putRequest} from "./util/api";
import  {deleteRequest} from "./util/api";
import  {postKeyValueRequest} from "./util/api";
/*封装请求方法*/
Vue.prototype.getRequest=getRequest;
Vue.prototype.postRequest=postRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.deleteRequest=deleteRequest;
Vue.prototype.postKeyValueRequest=postKeyValueRequest;


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VXETable)
VXETable.use(VXETablePluginElement)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
