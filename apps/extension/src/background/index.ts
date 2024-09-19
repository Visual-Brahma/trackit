/* eslint-disable no-undef */
import { watchChanges } from "./hot-reload";

chrome.management.getSelf((self) => {
  if (self.installType === "development") {
    chrome.runtime.getPackageDirectoryEntry((dir) => watchChanges(dir));
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      // NB: see https://github.com/xpl/crx-hotreload/issues/5
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({
    url: "https://trackit.visualbrahma.tech/dashboard",
    active: true,
  });
});
