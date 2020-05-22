<template>
    <div class="card">

        <header id="header">
             <span @click="goBack"> Back</span> <span class="text-center">  Pickup Address</span>
        </header>
        <div class="autocomplete">
            <input type="text" v-model="pickup" @input="onChange" class="input" ref="pick">
            <ul v-show="isOpen" class="autocomplete-results">
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
                dropoff: '',
                isLoading: true,
                results: [],
                isOpen: false,
                address: '',
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
                this.search = result;
                this.isOpen = false;
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
                        this.isOpen = false;
                        //use google auto complete
                    }
                }).catch(error => {
                    //use google auto complete
                    console.log(error.message);
                });
                console.log(this.pickup);
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

