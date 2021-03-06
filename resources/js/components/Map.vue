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
          dropoff: {
              lat: this.$store.getters.dropoff_loc.lat,
              lng: this.$store.getters.dropoff_loc.long,
          },
          icons: {
              pickup: this.$store.getters.icons.pickup,
              dropoff: this.$store.getters.icons.dropoff,
          },
          state: this.$store.getters.active,
          checkout: this.$store.getters.checkout,
          key: 'AIzaSyBtUbk85zcb99ugoBfOKbuHbFf8eT3xhf8',
          marker1 : null,
          marker2: null,
          curveMarker: null,
      }
    },
    mounted() {
        if (this.state == 'default') {
            this.getUserLocation();
        }
        else if (this.state == 'pickup') {
            this.updatePickupLocation('direct');
        }
        else if (this.state == 'dropoff') {
            this.updateDropoffLocation('direct');
        }
    },

    computed: {
        endpoint() {
            return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.lng}&key=${this.key}`;
        }
    },

    methods: {
        updateDropoffLocation(type, map=null) {
            if (type == 'direct') {
                var map = this.initMap(this.dropoff.lat, this.dropoff.lng);
                this.marker2 = this.addMarker(this.dropoff.lat, this.dropoff.lng, this.icons.dropoff, map);
                let text = 'Dropoff >';
                let infowindow = this.setInfowindow(map, this.marker2, text);
                if (this.checkout) {
                    this.updatePickupLocation('referred', map);
                    this.centerMap(map);
                }
            }
            else {
                let marker = this.addMarker(this.dropoff.lat, this.dropoff.lng, this.icons.dropoff, map);
                let text = 'Dropoff >';
                let infowindow = this.setInfowindow(map, marker, text);
            }
        },

        updatePickupLocation(type, map=null) {
            if (type == 'direct') {
                var map = this.initMap(this.pickup.lat, this.pickup.lng);
                this.marker1 = this.addMarker(this.pickup.lat, this.pickup.lng, this.icons.pickup, map);
                let text = 'Pickup >';
                let infowindow = this.setInfowindow(map, this.marker1, text);
                if (this.checkout) {
                    this.updateDropoffLocation('referred', map);
                    this.centerMap(map);
                }
            }
            else  {
                let marker = this.addMarker(this.pickup.lat, this.pickup.lng, this.icons.pickup, map);
                let text = 'Pickup >';
                let infowindow = this.setInfowindow(map, marker, text);
            }
        },

        updateCurveMarker(map) {
            console.log('map', map);
            var pos1 = new google.maps.LatLng(this.pickup.lat, this.pickup.lng); // latlng
            var pos2 =  new google.maps.LatLng(this.dropoff.lat, this.dropoff.lng);
            console.log('pickup', this.pickup.lat, 'dropoff', this.dropoff.lat)

            var curvature = 0.5;
            var curveMarker;

            var projection = map.getProjection();
            var p1 = projection.fromLatLngToPoint(pos1); // xy
            var p2 = projection.fromLatLngToPoint(pos2);
            console.log('p1', p1, 'p2', p2);
            if (p1.x > p2.x){
                var temp = p2;
                p2 = p1;
                p1 = temp;
                pos1 = pos2;
            }
            var e = new google.maps.Point(p2.x - p1.x, p2.y - p1.y), // endpoint (p2 relative to p1)
            m = new google.maps.Point(e.x / 2, e.y / 2), // midpoint
            o = new google.maps.Point(e.y, -e.x), // orthogonal
            c = new google.maps.Point( // curve control point
                m.x + curvature * o.x,
                m.y + curvature * o.y);

            var pathDef = 'M 0,0 ' +
                'q ' + c.x + ',' + c.y + ' ' + e.x + ',' + e.y;

            var zoom = map.getZoom(),
                scale = 1 / (Math.pow(2, -zoom));

            var symbol = {
                path: pathDef,
                scale: scale,
                strokeColor: '#006400',
                strokeWeight: 2,
                fillColor: '#006400'
            };


            if (!this.curveMarker) {
                this.curveMarker = new google.maps.Marker({
                    position: pos1,
                    clickable: false,
                    draggable: false,
                    icon: symbol,
                    zIndex: 0, // behind the other markers
                    map: map
                });
            } else {
                this.curveMarker.setOptions({
                    position: pos1,
                    icon: symbol,
                });
            }
        },

        centerMap(map) {
             //Create LatLngBounds object.
            var latlngbounds = new google.maps.LatLngBounds();
            //Extend each marker's position in LatLngBounds object.
            latlngbounds.extend( new google.maps.LatLng(this.pickup.lat, this.pickup.lng));
            latlngbounds.extend( new google.maps.LatLng(this.dropoff.lat, this.dropoff.lng));
            //Get the boundaries of the Map.
            var bounds = new google.maps.LatLngBounds();

            //Center map and adjust Zoom based on the position of all markers.
            map.setCenter(latlngbounds.getCenter());
            map.fitBounds(latlngbounds);
            google.maps.event.addListener(map, 'projection_changed', () => {
                this.updateCurveMarker(map)
            });
            google.maps.event.addListener(map, 'zoom_changed',() => {
                this.updateCurveMarker(map)
            });
            google.maps.event.addListener(this.marker1, 'position_changed',() => {
                this.updateCurveMarker(map)
            });
            google.maps.event.addListener(this.marker2, 'position_changed', () => {
                this.updateCurveMarker(map)
            });
        },

        setInfowindow(map, marker, text) {
            let infowindow = new google.maps.InfoWindow();
            infowindow.setContent(`<div class="ui header">${text}</div>`);
            infowindow.open(map, marker);
            return infowindow;
        },

        addMarker(lat, lng, icon, map) {
            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                clickable: false,
                draggable: false,
                icon: this.getIcon(icon)
            });
            return marker;
        },

        getIcon(image) {
            var icon = {
                url: image, // url
                scaledSize: new google.maps.Size(25, 25),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 0)
            };
            return icon;
        },

        initMap(lat, lng) {
            var map = new google.maps.Map(this.$refs['map'], {
            zoom: 14,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: 'terrain',
            mapTypeControl: false,
            });
            return map;
        },

        getUserLocation() {
            navigator.geolocation.getCurrentPosition(
            position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.addDefaultLocation();
                this.getUserAddress();
            },
            error => {
                console.log("Error getting location");
            }
            );
        },

        addDefaultLocation() {
            let map = this.initMap(this.lat, this.lng);
            let marker = this.addMarker(this.lat, this.lng, this.icons.pickup, map);
            let text = 'Your Location';
            let infowindow = this.setInfowindow(map, marker, text);
        },

        getUserAddress() {
            api.get(this.endpoint)
            .then(res => {
                console.log('address', res);
                this.address = res.data.results[0].formatted_address;
                this.$store.commit('storeUserLocation', {'lat' : this.lat, 'long' : this.lng, 'address' : this.address});
            })
            .catch(error => {
                //console.log(error.message);
            });
        },

    },

}
</script>

