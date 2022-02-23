import { locService } from "./services/loc.service.js";
import { mapService } from "./services/map.service.js";
import { storageService } from "./services/storage-service.js";
import { utilsService } from "./services/utils-service.js";

//NEEDS REPAIRING: MY LOCATION IS WORKING WITHOUT MARKER/
//REPAIR SEARCH FUNCTION,WORKING BAD/
//ADDING LOCATION NEEDS IMPROVE/
//ADDING ID TO TABLE/
//ADDING WEATHER/
//TODO
//REFACTOR CODE VARS&FOO NAMES, REFACTOR FILES, MAKE BETTER CSS, ADD WEATHER

window.onload = onInit;

var gUserCurrLoc = {
  lat: 0,
  lng: 0,
};

function onInit() {
  addEventListeners();
  mapService
    .initMap()
    .then((map) => {
      mapClickedEv(map);
      gMap = map;
      onSearch(map);
    })
    .catch(() => console.log("Error: cannot init map"));
  locService.getLocs().then((locs) => {
    renderLocations(locs);
  });
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log("Getting Pos");
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function addEventListeners() {
  document.querySelector(".btn-add-loc").addEventListener("click", (ev) => {
    // console.log("Adding a marker");
    const title = prompt("Name desired location");
    mapService.addMarker(
      { lat: gUserCurrLoc.lat, lng: gUserCurrLoc.lng },
      title
    );
    onAddLoc(title, gUserCurrLoc.lat, gUserCurrLoc.lng);
  });
  document.querySelector(".btn-user-pos").addEventListener("click", (ev) => {
    getPosition()
      .then((pos) => {
        console.log("User position is:", pos.coords);
        document.querySelector(
          ".user-pos"
        ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
        mapService.panTo(pos.coords.latitude, pos.coords.longitude);
      })
      .catch((err) => {
        console.log("err!!!", err);
      });
  });
}

function renderLocations(locs) {
  const strHtmls = locs.map((loc) => {
    return `<tr>
        <td>${loc.name}</td>
        <td>${loc.createdAt}</td>
        <td><button class="btn-go" data-lat="${loc.lat}" data-lng="${loc.lng}">Go to</button></td>
        <td><button class="btn-delete" data-i="${loc.id}">X</button></td>
      </tr>`;
  });
  document.querySelector(".locs").innerHTML = strHtmls.join("");
  [...document.querySelectorAll(".btn-go")].forEach((item) => {
    item.addEventListener("click", (ev) => {
      onGoToLoc(ev);
    });
  });

  [...document.querySelectorAll(".btn-delete")].forEach((item) => {
    item.addEventListener("click", (ev) => {
      onDelete(ev);
    });
  });
}

function mapClickedEv(map) {
  map.addListener("click", (mapsMouseEvent) => {
    var latitude = mapsMouseEvent.latLng.lat();
    var longtitude = mapsMouseEvent.latLng.lng();
    gUserCurrLoc.lat = latitude;
    gUserCurrLoc.lng = longtitude;
  });
}
function onGoToLoc(ev) {
  const locLat = ev.target.getAttribute("data-lat");
  const locLng = ev.target.getAttribute("data-lng");
  console.log(locLat, locLng);

  mapService.panTo(locLat, locLng);
  mapService.addMarker({ lat: +locLat, lng: +locLng });
}

// function renderLoc(locs) {}

//GOOGLE GEOCODE API KEY AIzaSyD0XAO24vPlaRm9kjMFkABKNxoBrCrz7nQ

function onSearch(map) {
  const geocoder = new google.maps.Geocoder();
  document.querySelector(".submit-address").addEventListener("click", () => {
    geocode(geocoder, map);
  });
}

function geocode(geocoder, resultsMap) {
  const address = document.querySelector(".input-address").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);

      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
    onAddLoc(
      address,
      results[0].geometry.location.lat(),
      results[0].geometry.location.lng()
    );
  });
}

function onAddLoc(name, lat, lng, updatedAt) {
  locService.addLocation(name, lat, lng, updatedAt);
  locService.getLocs().then((locs) => {
    renderLocations(locs);
  });
}

function onDelete(ev) {
  locService.deleteLoc(ev.target.getAttribute("data-i"));
  locService.getLocs().then((locs) => {
    renderLocations(locs);
  });
}

//7.a. Go – pans the map to that location to look up what have we done in PLACEKEEPER
// 8. Create a “my-location” button that pan the map to the user’s location. Function SAVE like in meme
