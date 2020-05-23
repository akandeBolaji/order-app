import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {
    markets: [],
    search: [],
    pickup: '',
    dropoff: '',
    user: {
        lat: '',
        long: '',
        address: '',
    },
    pickupLocation: {
        lat: '',
        long: ''
    }
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
    changePickup(state, pickup) {
        state.pickup = pickup
    },
    changeDropoff(state, dropoff) {
        state.dropoff = dropoff
    },
    storeUserLocation(state, location) {
        state.user = {
            lat: location.lat,
            long: location.long
        }
    },
    pickupLocation(state, location) {
        state.pickupLocation = {
            lat: location.lat,
            long: location.long
        }
    },
  },

  getters: {
    pickup: state => state.pickup,
    dropoff: state => state.dropoff,
    user: state => state.user,
    pickup_loc: state => state.pickupLocation,
  },

  strict: debug
});
