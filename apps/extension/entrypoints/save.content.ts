import { BASE_URL } from "@/utils/constants";

const baseUrl = new URL(BASE_URL);

export default defineContentScript({
  matches: [`${baseUrl.protocol}//${baseUrl.hostname}/*`],
  async main() {
    const attendanceRecords = await browser.storage.local.get(null);

    for (let key in attendanceRecords) {
      if (attendanceRecords[key]) {
        localStorage.setItem(key, JSON.stringify(attendanceRecords[key]));
        browser.storage.local.remove(key);
      }
    }
  },
});
