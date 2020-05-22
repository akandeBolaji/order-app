<template>
    <main>
        <Pickup @closePickup="closePickup($event)" v-if="active == 'pickup'"/>
        <Dropoff  @closeDropoff="closeDropoff($event)" v-else-if="active == 'dropoff'"/>
        <Home @openDropoff="openDropoff($event)" @openPickup="openPickup($event)" v-else/>
    </main>
</template>
<script>
  import Home from './components/Home.vue';
  import Dropoff from './components/Dropoff.vue';
  import Pickup from './components/Pickup.vue';
  export default {
    data() {
      return {
        active: 'home'
      }
    },
    components: {
        Home,
        Dropoff,
        Pickup
    },
    methods: {
        openDropoff(value) {
            this.active = 'dropoff'
        },
        openPickup(value) {
            this.active = 'pickup'
        },
        closePickup(value) {
            this.active = 'home'
        },
        closeDropoff(value) {
            this.active = 'home'
        },
    },
  }
</script>
