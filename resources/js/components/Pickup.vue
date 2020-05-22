<template>
    <div class="form card">

        <header id="header">
             <span @click="goBack"> Back</span> <span class="text-center">  Pickup Address</span>
        </header>
        <input type="text" id='filtro' v-model="pickup" data-type="search" ref="pick">
    </div>
</template>

<script>
    import { bus } from '../app'
    export default {
         data() {
            return {
                pickup: this.$store.getters.pickup,
                dropoff: '',
            }
        },
        mounted() {
            this.focusInput();
            console.log('Component mounted.')
        },
        methods: {
            focusInput() {
                this.$refs.pick.focus();
            },
            goBack() {
                this.$emit('closePickup', {
                    'pickup' : this.pickup
                });
                this.$store.commit('changePickup', this.pickup)
                bus.$emit('pickup', this.pickup);
            }
        }
    }
</script>
