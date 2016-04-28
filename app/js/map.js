// <------------ User Location --------------->
function getLocation() {
  if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(setCoords);
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}


function setCoords(position) {
  lat = position.coords.latitude
  long = position.coords.longitude

  // centers the map at the current position of the user
  map.setCenter({lat: lat, lng: long})
}


function setMarkers() {

}
