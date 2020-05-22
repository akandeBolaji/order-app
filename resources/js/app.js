import 'es6-promise/auto'
import axios from 'axios'
import './bootstrap'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import Index from './Index'
import store from './store/index'
import Autocomplete from 'v-autocomplete'

// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'v-autocomplete/dist/v-autocomplete.css'



// Set Vue globally
window.Vue = Vue
Vue.use(VueAxios, axios)
Vue.use(Autocomplete)
Vue.directive('focus', {
    inserted: function (el) {
        el.focus();
    },
    update: function (el) {
        Vue.nextTick(function() {
              el.focus();
        })
    }
})
axios.defaults.baseURL = `${process.env.MIX_APP_URL}/api`
//create event bus
export const bus = new Vue();
// Load Index
Vue.component('index', Index)
const app = new Vue({
  store,
  el: '#app',
});
