import { BASE_URL } from "@/utils/constants";

browser.tabs.create({
  url: `${BASE_URL}/dashboard`,
  active: true,
});
