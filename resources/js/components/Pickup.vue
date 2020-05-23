<template>
    <div class="card">

        <header id="header">
             <span @click="goBack"> Back</span> <span class="text-center">  Pickup Address</span>
        </header>
        <div class="autocomplete">
            <input type="text" v-model="pickup" @input="onChange" class="input" ref="pick">
            <ul v-if="isOpen" class="autocomplete-results">
            <li
            class="loading"
            v-if="isLoading">
            Loading results...
            </li>
           <li
           v-else
            v-for="(result, i) in results"
            :key="i"
            @click="setResult(result)"
            class="autocomplete-result"
            :class="{ 'is-active': i === arrowCounter }"
            @keydown.down="onArrowDown"
            @keydown.up="onArrowUp"
            @keydown.enter="onEnter"
            >
            {{ result.address }}
            </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { bus } from '../app';
    export default {
         data() {
            return {
                pickup: this.$store.getters.pickup,
                pickup_lat: '',
                pickup_long: '',
                isLoading: true,
                results: [],
                isOpen: false,
                address: {},
                arrowCounter: -1,
                user: {
                    lat: this.$store.getters.user.lat,
                    long: this.$store.getters.user.long,
                },
            }
        },
        mounted() {
            this.focusInput();
            console.log('Component mounted.')
        },
        methods: {
            onArrowDown() {
                if (this.arrowCounter < this.results.length) {
                this.arrowCounter = this.arrowCounter + 1;
                }
            },
            onArrowUp() {
                if (this.arrowCounter > 0) {
                this.arrowCounter = this.arrowCounter - 1;
                }
            },
            onEnter() {
                this.search = this.results[this.arrowCounter];
                this.isOpen = false;
                this.arrowCounter = -1;
            },
            setResult(result) {
                this.search = result.address;
                this.address = result;
            },
            onChange() {
                this.isOpen = true;
                //send request to server
                 api
                .post("/search/address", {
                    'search': this.pickup,
                })
                .then(res => {
                    this.results = res.data.results;
                    console.log(this.results);
                    if (this.results.length > 0) {
                        //display
                        this.isLoading = false;
                    }
                    else {
                        this.displayGoogleAutocomplete();
                        //use google auto complete
                    }
                }).catch(error => {
                    //use google auto complete
                    console.log(error.message);
                });
                console.log(this.pickup);
            },
            displayGoogleAutocomplete() {
                this.isOpen = false;
                    var circle = new google.maps.Circle({ center: new google.maps.LatLng(`${this.user.lat}, ${this.user.long}`), radius: 50000 })

                    var autocomplete = new google.maps.places.Autocomplete(
                    this.$refs["pick"], { types: [ 'geocode' ], componentRestrictions: { country: "ng" }, bounds: circle.getBounds(), strictbounds: true });
                    //console.log(this.autocomplete);
                    google.maps.event.addListener(autocomplete, 'place_changed', () => {
                        console.log('auto', autocomplete);
                        this.pickup_lat= place.geometry.location.lat();
                        this.pickup_long = place.geometry.location.lng();
                        this.pickup = place.formatted_address;
                        this.addAddress();
                        this.updateOnMap();
                })
            },
            addAddress() {
                api
                .post("/search/save", {
                    address: this.pickup,
                    latitude: this.pickup_lat,
                    longitude: this.pickup_long
                })
                .then(res => {
                    console.log(res.data);
                }).catch(error => {
                    console.log(error.message);
                });
            },
            updateOnMap() {

            },
            focusInput() {
                this.$refs.pick.focus();
            },
            goBack() {
                this.$emit('closePickup', {
                    'pickup' : this.pickup
                });
                this.$store.commit('changePickup', this.pickup)
                bus.$emit('pickup', this.pickup);
            },
        }
    }
</script>
<style scoped>
  .autocomplete {
    position: relative;
    width: 100vw;
  }

  input {
    width: 100vw;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    overflow: auto;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }

</style>

