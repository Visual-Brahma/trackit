import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "presets" | "content"> = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  presets: [sharedConfig],
};

export default config;
