"use client";
import { useContext } from "react";
import { Button } from "@repo/ui/button";
import { ThemeContext, toggleTheme } from "./utils/theme";

export default function App() {
  const theme = useContext(ThemeContext);

  return (
    <div style={{ width: 300, height: 400 }} className="bg-background">
      <div className={`fixed top-0 w-full z-30 transition-all`}>
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <a className="flex items-center font-display text-2xl" href="/">
            <img
              alt="Trackit logo"
              className={"p-2 rounded-sm bg-transparent"}
              height={50}
              src="/logo.png"
              style={{ color: "transparent" }}
              title="Trackit logo"
              width={50}
            />
            <p className="font-display text-2xl font-bold drop-shadow-sm md:text-3xl">
              Trackit
            </p>
          </a>
          <div className="flex items-center justify-center gap-1">
            <Button
              onClick={() => {
                window.chrome.tabs.create({
                  url: "https://trackit.visualbrahma.tech/dashboard",
                });
              }}
            >
              {"Get Started"}
            </Button>
          </div>
          <Button
            onClick={() => {
              toggleTheme();
            }}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </div>
    </div>
  );
}
