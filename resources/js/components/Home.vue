<template>
    <div class="main">
        <div class="form card">
            <header id="header" class="text-center">
                Parcel request
            </header>
            <input type="text" @focus="openPickup()" v-model="pickup" placeholder="Pickup Address" ref="picks">
            <input type="text" @focus="openDropoff()" v-model="dropoff" placeholder="Dropoff Address">
        </div>
        <Map :class="checkout ? 'map-with-checkout' : 'full-map'"/>
        <div class="card checkout" v-if="checkout">
            Checkout Form
        </div>
    </div>
</template>
<script>
  import { bus } from '../app';
  import Map from './Map.vue';
  export default {
    data() {
      return {
          checkout: this.$store.getters.checkout,
          pickup: this.$store.getters.pickup,
          dropoff: this.$store.getters.dropoff,
      }
    },
    components: {
        Map
    },
    mounted() {

    },

    methods: {
        openPickup() {
            //emit event on master
            this.$emit('openPickup', {
                'pickup' : this.pickup
            });
        },
        openDropoff() {
            //emit event on master
            this.$emit('openDropoff', {
                'dropoff' : this.dropoff
            });
        },
    }
  }
</script>
<style scoped>
    .main {
        height: 100vh;
        width: 100vw;
    }
    .form {
        height: 15vh;
    }
    .full-map {
        height: 85vh;
    }
    .map-with-checkout {
        height: 75vh;
    }
    .checkout {
        height: 10vh;
    }
</style>

