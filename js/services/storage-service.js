export const storageService = {
    saveToStorage,
    loadFromStorage
}
function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}
//added the regular storage functions and the new module stuff with exporting.