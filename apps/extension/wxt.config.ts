import { defineConfig } from "wxt";
import path from "path";
import { BASE_URL } from "./utils/constants";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  dev: {
    server: {
      port: 5000,
    },
  },
  vite: () => ({
    resolve: {
      alias: {
        "@/lib/utils": path.resolve(__dirname, "../../packages/ui/lib/utils"),
      },
    },
  }),
  manifest: {
    name: "Trackit | Meet Attendance Tracker",
    author: "Shubham Tiwari",
    action: {
      default_title: "Trackit | Meet Attendance Tracker",
    },
    permissions: ["storage", "cookies"],
    host_permissions: [BASE_URL],
  },
});
