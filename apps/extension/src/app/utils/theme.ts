import { createContext } from "react";

type Theme = "dark" | "light";

const applyTheme = (theme: Theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

export const toggleTheme = () => {
  const darkModeEnabled = document.documentElement.classList.contains("dark");
  applyTheme(darkModeEnabled ? "light" : "dark");
};

export const initTheme = () => {
  const localStorageTheme = localStorage.getItem("theme");
  if (localStorageTheme) {
    return localStorageTheme as Theme;
  } else {
    // System theme
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
};

export const ThemeContext = createContext<Theme>("dark");
