<template>
    <div class="form card">

        <header id="header">
             <span @click="goBack"> Back</span> <span class="text-center">  Dropoff Address</span>
        </header>
        <input type="text" v-model="dropoff" ref="pick">
    </div>
</template>

<script>
    import { bus } from '../app'
    export default {
         data() {
            return {
                dropoff: this.$store.getters.dropoff,
                pickup: '',
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
                this.$emit('closeDropoff', {
                    'pickup' : this.pickup
                });
                this.$store.commit('changeDropoff', this.dropoff)
            }
        }
    }
</script>
