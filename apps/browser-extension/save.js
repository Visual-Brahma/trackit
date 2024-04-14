chrome.storage.local.get(null, function(item) {

    for (let key in item) {
        if (item[key] != null && item[key] != undefined && item[key] != "undefined") {
            localStorage.setItem(key, JSON.stringify(item[key]));
            chrome.storage.local.remove(key);
        }
    }

});