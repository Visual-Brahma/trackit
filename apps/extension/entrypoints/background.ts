export default defineBackground(async () => {
  const extension = await browser.management.getSelf();
  if (extension.installType !== "development") {
    browser.runtime.onInstalled.addListener(() => {
      browser.tabs.create({
        url: "https://trackit.visualbrahma.tech/dashboard",
        active: true,
      });
    });
  }

  browser.cookies.onChanged.addListener((changeInfo) => {
    const domain = import.meta.env.DEV
      ? "localhost"
      : "trackit.visulabrahma.tech";
    if (
      changeInfo.cookie.domain === domain &&
      changeInfo.cookie.name === "next-auth.session-token"
    ) {
      if (changeInfo.removed) {
        browser.storage.local.remove("authToken");
      } else {
        browser.storage.local.set({ authToken: changeInfo.cookie.value });
      }
    }
  });
});
