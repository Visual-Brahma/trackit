export default defineContentScript({
  matches: import.meta.env.DEV
    ? ["http://localhost:3000/*"]
    : ["https://trackit.visualbrahma.tech/*"],
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
