chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({
        url: "https://trackit.visualbrahma.tech/dashboard",
        active: true
    });
});