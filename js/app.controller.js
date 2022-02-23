import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage-service.js'
import { utilsService } from './services/utils-service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onDelete = onDelete;



function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        console.log("Locations:", locs);
        var strHtml = locs.map(
            (loc) =>
                `<tr>
              <td>${loc.name}</td>
              <td>${loc.lat}</td>
              <td>${loc.lng}</td>
              <td><button onclick="onGoToLoc(${loc.lat}, ${loc.lng})">Go</button></td>
              <td><button onclick="onDeleteLoc(${loc.lat}, ${loc.lng})">Delete</button></td>
              <td><button onclick="onCopyLink(${loc.lat}, ${loc.lng})">Copy Link</button></td>
          </tr>`
        );
        document.querySelector(".locs").innerHTML = strHtml.join("");
        document.querySelector(".locs-container").classList.remove("hide");
    });
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function renderLoc(locs) {

}

//GOOGLE GEOCODE API KEY AIzaSyD0XAO24vPlaRm9kjMFkABKNxoBrCrz7nQ
// function onFindPlace() {
//     const elInput = document.querySelector('input').value;
//     mapService.geoCode(place)




// }

function onSearch() {
    const cityName = document.querySelector('.search-place').value;
    locService.getCoordsByName(cityName).then((res) => {
        mapService.panTo(res.lat, res.lng);
        locService.saveLoc(cityName, res.lat, res.lng);
        onGetLocs();
        mapService.addMarker(res, cityName);
        const infoWindow = mapService.getInfoWindow();
        infoWindow.close();
    });
}

function onDelete(id) {
    locService.deleteLoc(id)
    onGetLocs();
}

//7.a. Go – pans the map to that location to look up what have we done in PLACEKEEPER
// 8. Create a “my-location” button that pan the map to the user’s location. Function SAVE like in meme




