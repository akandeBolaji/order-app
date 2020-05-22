<template>
    <div class="form card">

        <header id="header">
             <span @click="goBack"> Back</span> <span class="text-center">  Pickup Address</span>
        </header>
        <input type="text" v-model="pickup" ref="pick">
    </div>
</template>

<script>
    export default {
         data() {
            return {
                pickup: '',
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
            }
        }
    }
</script>
