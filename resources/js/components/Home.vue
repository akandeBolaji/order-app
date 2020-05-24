<template>
    <div class="main">
        <div class="form card">
            <header id="header" class="text-center py-1 lead">
                <h3>Parcel request</h3>
            </header>
            <form class="mx-2">
                <div class="form-group">
                    <input type="text"  @focus="openPickup()" v-model="pickup" class="form-control bg-light" placeholder="Pickup Address">
                </div>
                <div class="form-group">
                    <input type="text" @focus="openDropoff()" v-model="dropoff" class="form-control bg-light" placeholder="Dropoff Address">
                </div>
            </form>
        </div>
        <Map :class="checkout ? 'map-with-checkout' : 'full-map'"/>
        <div class="card checkout px-2" v-if="checkout">
            <h2 class="d-flex mt-2">
                <div class="mr-auto">&#8358;1500,00</div>
                <div>3.3km | 24 mins</div>
            </h2>
            <button type="button" class="btn btn-success btn-lg btn-block">Enter Parcel Details</button>
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
        height: 70vh;
    }
    .checkout {
        height: 15vh;
    }
</style>

