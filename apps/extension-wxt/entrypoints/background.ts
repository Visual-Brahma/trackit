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
});
