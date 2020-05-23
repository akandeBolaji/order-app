<template>
    <div ref="map"></div>
</template>

<script>
import { bus } from '../app';
export default {
    data() {
      return {
          lat : 0,
          lng : 0,
          address: '',
          pickup: {
              lat: this.$store.getters.pickup_loc.lat,
              lng: this.$store.getters.pickup_loc.long,
          },
          key: 'AIzaSyBtUbk85zcb99ugoBfOKbuHbFf8eT3xhf8',
      }
    },
    mounted() {
        this.getUserLocation();
        bus.$on('pickup', () => {
            updatePickupLocation();
        });
    },
    methods: {
        getUserLocation() {
            console.log('hi');
            navigator.geolocation.getCurrentPosition(
            position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.addDefaultLocation();
                this.getUserAddress();
                this.$store.commit('storeUserLocation', {'lat' : this.lat, 'long' : this.lng, 'address' : this.address});
                console.log('hi',this.lng, this.lat);
            },
            error => {
                console.log("Error getting location");
            }
            );
        },

        updatePickupLocation() {
            var map = new google.maps.Map(this.$refs['map'], {
            zoom: 15,
            center: new google.maps.LatLng(this.pickup.lat, this.pickup.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
            });

            const lat = this.pickup.lat;
            const lng = this.pickup.lng;
            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map
            });
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(`<div class="ui header">Pickup</div>`);
            infowindow.open(map, marker);
        },

        getUserAddress() {
            api.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.lng}&key=${this.key}`
            )
            .then(res => {
                console.log('address', res);
                this.address = res.data.results[0].formatted_address;
            })
            .catch(error => {
                //console.log(error.message);
            });
        },

        addDefaultLocation() {
            var map = new google.maps.Map(this.$refs['map'], {
            zoom: 15,
            center: new google.maps.LatLng(this.lat, this.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
            });

            const lat = this.lat;
            const lng = this.lng;
            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map
            });
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(`<div class="ui header">Your location</div>`);
            infowindow.open(map, marker);


        },
    },

}
</script>

