var map;

var curvature = 0.5; // how curvy to make the arc

function init(lat1, lng1, lat2, lng2, ref) {
  var Map = google.maps.Map,
    LatLng = google.maps.LatLng,
    LatLngBounds = google.maps.LatLngBounds,
    Marker = google.maps.Marker,
    Point = google.maps.Point;

  // This is the initial location of the points
  // (you can drag the markers around after the map loads)
  var pos1 = new LatLng(lat1, lng1);
  var pos2 = new LatLng(lat2, lng2);

  var bounds = new LatLngBounds();
  bounds.extend(pos1);
  bounds.extend(pos2);

  map = new Map(ref, {
    center: bounds.getCenter(),
    zoom: 12
  });
  map.fitBounds(bounds);

  var markerP1 = new Marker({
    position: pos1,
    label: "1",
    draggable: false,
    map: map
  });
  var markerP2 = new Marker({
    position: pos2,
    label: "2",
    draggable: false,
    map: map
  });
  drawCurve(pos2, pos1, map);
}

function drawCurve(P1, P2, map) {
  var lineLength = google.maps.geometry.spherical.computeDistanceBetween(P1, P2);
  var lineHeading = google.maps.geometry.spherical.computeHeading(P1, P2);
  var lineHeading1, lineHeading2;
  if (lineHeading < 0) {
    lineHeading1 = lineHeading + 45;
    lineHeading2 = lineHeading + 135;
  } else {
    lineHeading1 = lineHeading + -45;
    lineHeading2 = lineHeading + -135;
  }
  var pA = google.maps.geometry.spherical.computeOffset(P1, lineLength / 2.2, lineHeading1);
  var pB = google.maps.geometry.spherical.computeOffset(P2, lineLength / 2.2, lineHeading2);

  var curvedLine = new GmapsCubicBezier(P1, pA, pB, P2, 0.01, map);
}


// google.maps.event.addDomListener(window, 'load', initialize);
// original Belzier Curve code from nicoabie's answer to this question on StackOverflow:
// http://stackoverflow.com/questions/5347984/letting-users-draw-curved-lines-on-a-google-map
var GmapsCubicBezier = function(latlong1, latlong2, latlong3, latlong4, resolution, map) {
  var lat1 = latlong1.lat();
  var long1 = latlong1.lng();
  var lat2 = latlong2.lat();
  var long2 = latlong2.lng();
  var lat3 = latlong3.lat();
  var long3 = latlong3.lng();
  var lat4 = latlong4.lat();
  var long4 = latlong4.lng();

  var points = [];

  for (it = 0; it <= 1; it += resolution) {
    points.push(this.getBezier({
      x: lat1,
      y: long1
    }, {
      x: lat2,
      y: long2
    }, {
      x: lat3,
      y: long3
    }, {
      x: lat4,
      y: long4
    }, it));
  }
  var path = [];
  for (var i = 0; i < points.length - 1; i++) {
    path.push(new google.maps.LatLng(points[i].x, points[i].y));
    path.push(new google.maps.LatLng(points[i + 1].x, points[i + 1].y, false));
  }

  var Line = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: "##35495e",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    icons: [{
      icon: {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 5,
      },
      offset: '100%'
    }],
  });

  Line.setMap(map);

  return Line;
};


GmapsCubicBezier.prototype = {

  B1: function(t) {
    return t * t * t;
  },
  B2: function(t) {
    return 3 * t * t * (1 - t);
  },
  B3: function(t) {
    return 3 * t * (1 - t) * (1 - t);
  },
  B4: function(t) {
    return (1 - t) * (1 - t) * (1 - t);
  },
  getBezier: function(C1, C2, C3, C4, percent) {
    var pos = {};
    pos.x = C1.x * this.B1(percent) + C2.x * this.B2(percent) + C3.x * this.B3(percent) + C4.x * this.B4(percent);
    pos.y = C1.y * this.B1(percent) + C2.y * this.B2(percent) + C3.y * this.B3(percent) + C4.y * this.B4(percent);
    return pos;
  }
};

export default init;
