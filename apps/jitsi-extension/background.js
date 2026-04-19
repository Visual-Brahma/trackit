let activeTabs = new Set();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "TRACKING_STARTED" && sender.tab) {
        activeTabs.add(sender.tab.id);
    } else if (msg.type === "TRACKING_STOPPED" && sender.tab) {
        if (activeTabs.has(sender.tab.id)) {
            activeTabs.delete(sender.tab.id);
            chrome.tabs.create({ url: "https://trackit.visualbrahma.tech/save-report" });
        }
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (activeTabs.has(tabId)) {
        activeTabs.delete(tabId);
        chrome.tabs.create({ url: "https://trackit.visualbrahma.tech/save-report" });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (activeTabs.has(tabId) && changeInfo.url) {
        if (!changeInfo.url.includes("meet.jit.si") || changeInfo.url.includes("close") || changeInfo.url.includes("static")) {
            activeTabs.delete(tabId);
            chrome.tabs.create({ url: "https://trackit.visualbrahma.tech/save-report" });
        }
    }
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({
        url: "https://trackit.visualbrahma.tech/dashboard",
        active: true
    });
});