<template>
    <div ref="map"></div>
</template>

<script>
export default {
    data() {
      return {
          lag : 0,
          lng : 0,
      }
    },
    mounted() {
        this.getUserLocation();
    },
    methods: {
        getUserLocation() {
            console.log('hi');
            navigator.geolocation.getCurrentPosition(
            position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.addDefaultLocation()
                console.log('hi',this.lng, this.lat);
            },
            error => {
                console.log("Error getting location");
            }
            );
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

