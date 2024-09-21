import { defineConfig } from "wxt";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
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
    host_permissions: import.meta.env.DEV
      ? ["http://localhost:3000/"]
      : ["https://trackit.visualbrahma.tech/"],
  },
});
