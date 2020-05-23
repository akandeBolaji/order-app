<template>
    <div ref="map"></div>
</template>

<script>
import { bus } from '../app';
import GmapsCubicBezier from '../GmapsCubicBezier';
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
          dropoff: {
              lat: this.$store.getters.dropoff_loc.lat,
              lng: this.$store.getters.dropoff_loc.long,
          },
          icons: {
              pickup: this.$store.getters.icons.pickup,
              dropoff: this.$store.getters.icons.dropoff,
          },
          state: this.$store.getters.active,
          key: 'AIzaSyBtUbk85zcb99ugoBfOKbuHbFf8eT3xhf8',
      }
    },
    mounted() {
        if (this.state == 'default') {
            this.getUserLocation();
        }
        else if (this.state == 'pickup') {
            this.updatePickupLocation()
        }
        else if (this.state == 'dropoff') {
            this.updateDropoffLocation()
        }
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

        updateDropoffLocation() {
            console.log('lat', this.pickup.lat, 'lng', this.pickup.lng)
            var map = new google.maps.Map(this.$refs['map'], {
            zoom: 14,
            center: new google.maps.LatLng(this.pickup.lat, this.pickup.lng),
            mapTypeId: 'terrain',
            });

            // new GmapsCubicBezier(new google.maps.LatLng(this.pickup.lat, lng), new google.maps.LatLng(lat, lng), map);

            const lat = this.dropoff.lat;
            const lng = this.dropoff.lng;
            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: this.getIcon(this.icons.dropoff),
            });
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(`<div class="ui header">Dropoff</div>`);
            infowindow.open(map, marker);

            const pickup_lat = this.pickup.lat;
            const pickup_lng = this.pickup.lng;
            let pickup_marker = new google.maps.Marker({
                position: new google.maps.LatLng(pickup_lat, pickup_lng),
                map: map,
                icon: this.getIcon(this.icons.pickup),
            });
            var pickup_infowindow = new google.maps.InfoWindow();
            pickup_infowindow.setContent(`<div class="ui header">Pickup</div>`);
            pickup_infowindow.open(map, pickup_marker);

            var flightPlanCoordinates = [
                 {lat: this.pickup.lat, lng: this.pickup.lng},
                 {lat: this.dropoff.lat, lng: this.dropoff.lng},
            ];
            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#006400',
                strokeOpacity: 1.0,
                strokeWeight: 3
                });

            flightPath.setMap(map);
        },

        updatePickupLocation() {
            console.log('lat', this.pickup.lat, 'lng', this.pickup.lng)
            var map = new google.maps.Map(this.$refs['map'], {
            zoom: 14,
            center: new google.maps.LatLng(this.pickup.lat, this.pickup.lng),
            mapTypeId: 'terrain',
            });

            const lat = this.pickup.lat;
            const lng = this.pickup.lng;
            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: this.getIcon(this.icons.pickup)
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
            zoom: 14,
            center: new google.maps.LatLng(this.lat, this.lng),
           mapTypeId: 'terrain',
            });

            const lat = this.lat;
            const lng = this.lng;
            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: this.getIcon(this.icons.pickup)
            });
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(`<div class="ui header">Your location</div>`);
            infowindow.open(map, marker);
        },

        getIcon(image) {
            var icon = {
                url: image, // url
                scaledSize: new google.maps.Size(25, 25), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
            return icon;
        }
    },

}
</script>

