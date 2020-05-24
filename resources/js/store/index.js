import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {
    search: [],
    pickup: '',
    dropoff: '',
    user: {
        lat: '',
        long: '',
        address: '',
    },
    active: 'default',
    checkout: false,
    pickupLocation: {
        lat: '',
        long: ''
    },
    dropoffLocation: {
        lat: '',
        long: ''
    },
    icons: {
        pickup: '/images/pickup.png',
        dropoff: '/images/dropoff.png'
    },
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
        console.log('l', location)
        state.user = {
            lat: location.lat,
            long: location.long,
            address: location.address,
        }
    },
    pickupLocation(state, location) {
        state.pickupLocation = {
            lat: location.lat,
            long: location.long
        };
        state.active = 'pickup';
        if (state.dropoffLocation.lat && state.dropoffLocation.long) {
            state.checkout = true;
        }
    },
    dropoffLocation(state, location) {
        state.dropoffLocation = {
            lat: location.lat,
            long: location.long
        };
        state.active = 'dropoff';
        if (state.pickupLocation.lat && state.pickupLocation.long) {
            state.checkout = true;
        }
    },
  },

  getters: {
    pickup: state => state.pickup,
    dropoff: state => state.dropoff,
    user: state => state.user,
    pickup_loc: state => state.pickupLocation,
    dropoff_loc: state => state.dropoffLocation,
    active: state => state.active,
    checkout: state => state.checkout,
    icons: state => state.icons,
  },

  strict: debug
});
