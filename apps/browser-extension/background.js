chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({
        url: "https://trackit.zeabur.app/dashboard",
        active: true
    });
});