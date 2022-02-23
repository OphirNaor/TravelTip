export const locService = {
    getLocs

}

const KEY = 'location'
// let gId = []


const locs = [
    // { name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt, updatedAt },
    // { name: 'Neveragain', lat: 32.047201, lng: 34.832581, createdAt, updatedAt },
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

// function createLoc()



// function deleteLoc()
//get firstly the index of the ID of loc
//we should use the splice method , to splice the .locs
//render the map again 