import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {
    markets: [],
    search: []
  },

  actions: {
    async getAllMarkets({ commit }) {
      return commit('setMarkets', await api.get('/admin/get_all'))
    },
    async searchResult({ commit }) {
        return commit('setSearch', await api.get('/search'))
    },
  },

  mutations: {
    setMarkets(state, response) {
      state.markets = response.data.data;
    },
    setSearch(state, response) {
        state.search = response.data.data;
    },
  },
  strict: debug
});
