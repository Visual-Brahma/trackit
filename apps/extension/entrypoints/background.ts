import { BASE_URL } from "@/utils/constants";

const nextAuthCookieNameRegex = /^(__Secure-)?next-auth\.session-token$/;

export default defineBackground(() => {
  const handleOnInstall = async () => {
    const extension = await browser.management.getSelf();
    if (extension.installType !== "development") {
      browser.runtime.onInstalled.addListener(() => {
        browser.tabs.create({
          url: `${BASE_URL}/dashboard`,
          active: true,
        });
      });
    }
  };

  handleOnInstall();

  browser.cookies.onChanged.addListener((changeInfo) => {
    const domain = new URL(BASE_URL).hostname;
    if (
      changeInfo.cookie.domain === domain &&
      changeInfo.cookie.name.match(nextAuthCookieNameRegex)
    ) {
      if (changeInfo.removed) {
        browser.storage.local.remove("authToken");
      } else {
        browser.storage.local.set({ authToken: changeInfo.cookie.value });
      }
    }
  });
});
