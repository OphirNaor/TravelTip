import { storageService } from './storage-service.js';

export const locService = {
    getLocs,
    deleteLoc,
    getPlaceAddress,
    getCoordsByName,
    saveLoc

}

const KEY = 'locationDB'

//changed the const locs to gLocs, added storageservice function and limit of request so we dont get blocked, 
//not sure if i did it right so please CHECK, added Date.now() function for createdAt , now we will need to add one.
//should we also make a getrandomId function for our Id??? 

const gLocs = storageService.load('locationDB') || [
    { id: [], name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt: Date.now(), updatedAt: '' },
    { id: [], name: 'Neveragain', lat: 32.047201, lng: 34.832581, createdAt: Date.now(), updatedAt: '' },
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

// function createLoc()

function saveLoc(name, lat, lng) {
    gLocs.push({ name, lat, lng });
    storageService.saveToStorage('locationDB', gLocs);
}



function deleteLoc(id) {
    const locIdx = gLocs.findIndex(loc => {
        loc.id === id
    })
    gLocs.splice(locIdx, 1)
    storageService.save(KEY, gLocs)
}
//get firstly the index of the ID of loc
//we should use the splice method , to splice the .locs
//render the map again 

function getPlaceAddress(lat, lng) {

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD0XAO24vPlaRm9kjMFkABKNxoBrCrz7nQ`)
        .then((res) => {
            console.log(res.data);
            const address = res.data.results[0].formatted_address
            return address
        })
        .catch((err) => { console.log('Error', err); })
}

function getCoordsByName(cityName) {
    return axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=AIzaSyD0XAO24vPlaRm9kjMFkABKNxoBrCrz7nQ`
    )
        .then((res) => {
            const coords = {
                lat: res.data.results[0].geometry.location.lat,
                lng: res.data.results[0].geometry.location.lng,
            };
            return coords
        });
}