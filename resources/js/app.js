import 'es6-promise/auto'
import axios from 'axios'
import './bootstrap'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import Index from './Index'
import store from './store/index';

// Set Vue globally
window.Vue = Vue
Vue.use(VueAxios, axios)
axios.defaults.baseURL = `${process.env.MIX_APP_URL}/api`
// Load Index
Vue.component('index', Index)
const app = new Vue({
  store,
  el: '#app',
});
