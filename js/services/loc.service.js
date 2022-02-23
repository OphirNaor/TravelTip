import { storageService } from './storage-service.js';
import { utilsService } from './utils-service.js';

export const locService = {
    getLocs,addLocation, deleteLoc,

}

const KEY = 'locationDB'
var gLocs;
createLocations()


function createLocations() {
    var locs = storageService.loadFromStorage(KEY);
    if (!locs || locs.length === 0) {
        locs = [
            createLoc('Berlin',52.52437, 13.41053,0,0 ),
            createLoc('New-York',40.71427, -74.00597,0,0)
        ];
    }
    gLocs = locs,
    storageService.saveToStorage(KEY,locs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

function createLoc(name, lat , lng, updatedAt=0) {
    var newLoc = {
        id: utilsService.makeId,
        name,
        lat,
        lng,
        createdAt: new Date(Date.now()).toLocaleString(),
        updatedAt
    }
    return newLoc;
    }


function addLocation(name, lat, lng, updatedAt) {
    const addLoc = createLoc(name, lat, lng, updatedAt);
    gLocs.push(addLoc)
    storageService.saveToStorage(KEY,gLocs)
}

function deleteLoc(id) {
    const locIdx = gLocs.findIndex(loc => {
        loc.id === id
    })
    gLocs.splice(locIdx, 1)
    storageService.saveToStorage(KEY, gLocs)
}
