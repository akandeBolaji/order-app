<template>
    <div>
        <h3 class="m-2 d-flex justify-content-between">
             <div @click="goBack"><i class="fas fa-chevron-left"></i>Back</div> <div>Pickup</div><div style="visibility: hidden">space</div>
        </h3>
        <div class="autocomplete mx-2">
            <form >
                <div class="form-group">
                    <input type="text" v-model="pickup" ref="pick"  @input="onChange" class="form-control bg-light" placeholder="Pickup Address">
                </div>
            </form>
            <button type="button" class="btn btn-success btn-lg btn-block" v-if="!isOpen && !pickup" @click="useLocation">Use your location</button>
            <ul v-else-if="isOpen" class="autocomplete-results">
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
            <span class="ml-2">
                <i class="fa fa-map-marker" style="color: grey;"></i>
            </span>
            <span class="ml-3"><b>{{ result.address }}</b></span>
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
                    address: this.$store.getters.user.address,
                },
                showUser: true
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
                this.pickup_lat= result.latitude;
                this.pickup_long = result.longitude;
                this.pickup = result.address;
                this.$emit('closePickup', {
                    'pickup' : this.pickup
                });
                this.updateOnMap();
            },
            onChange() {
                this.isOpen = true;
                //send request to server
                 api
                .post("/search/address", {
                    'search': this.pickup,
                    'lat': this.user.lat,
                    'long': this.user.long
                })
                .then(res => {
                    console.log(this.results);
                    if (res.data.results.length > 0) {
                        //display
                        this.results = res.data.results;
                        this.isLoading = false;
                    }
                    else {
                         //use google auto complete
                         console.log('re', this.results);
                        this.displayGoogleAutocomplete();
                    }
                }).catch(error => {
                    //use google auto complete
                    console.log(error.message);
                });
                console.log(this.pickup);
            },
            displayGoogleAutocomplete() {
                //this.isOpen = false;
                    //var circle = new google.maps.Circle({ center: new google.maps.LatLng(`${this.user.lat}, ${this.user.long}`), radius: 50000 })

                    var autocomplete = new google.maps.places.Autocomplete(
                    this.$refs["pick"], { types: [ 'geocode' ], location: new google.maps.LatLng(`${this.user.lat}, ${this.user.long}`), radius:50000, strictbounds: true });

                    //console.log(this.autocomplete);
                    google.maps.event.addListener(autocomplete, 'place_changed', () => {
                        this.isOpen = false;
                        this.$emit('closePickup', {
                            'pickup' : this.pickup
                        });
                        console.log('auto', autocomplete);
                        var place = autocomplete.getPlace();
                        this.pickup_lat= place.geometry.location.lat();
                        this.pickup_long = place.geometry.location.lng();
                        this.pickup = place.formatted_address;
                        this.updateOnMap();
                        this.addAddress();
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
                    console.log(res);
                }).catch(error => {
                    console.log(error.message);
                });
            },
            useLocation() {
                this.pickup = this.user.address;
                this.pickup_lat = this.user.lat;
                this.pickup_long = this.user.long;
                console.log('pickup', this.pickup);
                this.$emit('closePickup', {
                    'pickup' : this.pickup
                });
                this.updateOnMap();
            },
            updateOnMap() {
                this.$store.commit('pickupLocation', {lat: this.pickup_lat, long: this.pickup_long})
                this.$store.commit('changePickup', this.pickup)

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
<style>
  .autocomplete {
    position: relative;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    min-height: 90vw !important;
    /* overflow: auto; */
  }

  .pac-container {
      min-height: 90% !important;
  }

  .pac-item {
    min-height: 60px;
    padding: 4px 2px;
  }

  .autocomplete-result{
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    border-bottom: 1px solid grey;
    min-height: 60px;
    cursor: pointer;
  }

  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }

  .gm-ui-hover-effect, .gm-style-iw-t::after, .gm-svpc, .gm-control-active, .gmnoprint {
      display: none !important;
  }

</style>

