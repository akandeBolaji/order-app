<template>
    <div>
        <h3 class="my-2 d-flex justify-content-between">
             <div @click="goBack"><i class="fa fa-chevron-left"></i>Back</div>
             <div>Dropoff</div>
             <div></div>
        </h3>
        <div class="autocomplete mx-2">
             <form>
                <div class="form-group">
                    <input type="text" v-model="dropoff" ref="drop"  @input="onChange" class="form-control bg-light" placeholder="Dropoff Address">
                </div>
            </form>
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
            <span class="ml-2">
                <i class="fa fa-map-marker fa-2x"></i>
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
                dropoff: this.$store.getters.dropoff,
                dropoff_lat: '',
                dropoff_long: '',
                isLoading: true,
                pickup: {
                    lat: this.$store.getters.pickup_loc.lat,
                    lng: this.$store.getters.pickup_loc.long,
                },
                results: [],
                isOpen: false,
                address: {},
                arrowCounter: -1,
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
                this.$emit('closeDropoff', {
                    'dropoff' : this.dropoff
                });
                this.dropoff_lat= result.latitude;
                this.dropoff_long = result.longitude;
                this.dropoff = result.address;
                this.updateOnMap();
            },
            onChange() {
                this.isOpen = true;
                //send request to server
                 api
                .post("/search/address", {
                    'search': this.dropoff,
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
                console.log(this.dropoff);
            },
            displayGoogleAutocomplete() {
                //this.isOpen = false;
                    var circle = new google.maps.Circle({ center: new google.maps.LatLng(`${this.pickup.lat}, ${this.pickup.long}`), radius: 50000 })

                    var autocomplete = new google.maps.places.Autocomplete(
                    this.$refs["drop"], { types: [ 'geocode' ], componentRestrictions: { country: "ng" }, bounds: circle.getBounds(), strictbounds: true });
                    //console.log(this.autocomplete);
                    google.maps.event.addListener(autocomplete, 'place_changed', () => {
                        this.$emit('closeDropoff', {
                            'dropoff' : this.dropoff
                        });
                        console.log('auto', autocomplete);
                        var place = autocomplete.getPlace();
                        this.dropoff_lat= place.geometry.location.lat();
                        this.dropoff_long = place.geometry.location.lng();
                        this.dropoff = place.formatted_address;
                        this.updateOnMap();
                        this.addAddress();
                })
            },
            addAddress() {
                api
                .post("/search/save", {
                    address: this.dropoff,
                    latitude: this.dropoff_lat,
                    longitude: this.dropoff_long
                })
                .then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error.message);
                });
            },
            updateOnMap() {
                this.$store.commit('dropoffLocation', {lat: this.dropoff_lat, long: this.dropoff_long})
                this.$store.commit('changeDropoff', this.dropoff)
            },
            focusInput() {
                this.$refs.drop.focus();
            },
            goBack() {
                this.$emit('closeDropoff', {
                    'dropoff' : this.dropoff
                });
                this.$store.commit('changeDropoff', this.dropoff)
                bus.$emit('dropoff', this.dropoff);
            },
        }
    }
</script>
<style scoped>
  .autocomplete {
    position: relative;
  }

  .autocomplete-results, .pac-container {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 90vw;
    /* overflow: auto; */
  }


  .autocomplete-result, .pac-container {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    border-bottom: 1px solid #000;
    min-height: 40px;
    cursor: pointer;
  }

  .autocomplete-result:hover, .pac-container:hover {
    background-color: #4AAE9B;
    color: white;
  }

</style>

