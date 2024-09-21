import { LayoutProps } from "@/types";
import { createContext } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export default function ThemeProvider({ children }: LayoutProps) {
  const [theme, setTheme] = useState<Theme>("light");

  const getTheme = () => {
    const theme =
      (localStorage.getItem("trackit-theme") as Theme) ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    return theme;
  };

  const applyTheme = (theme: Theme) => {
    const shadowRootHtml = document.querySelector("trackit-attendance-ui")
      ?.shadowRoot?.firstElementChild;
    if (theme === "dark") {
      shadowRootHtml?.classList.add("dark");
      localStorage.setItem("trackit-theme", "dark");
    } else {
      shadowRootHtml?.classList.remove("dark");
      localStorage.setItem("trackit-theme", "light");
    }

    setTheme(theme);
  };

  const toggleTheme = () => {
    const darkModeEnabled = document
      .querySelector("trackit-attendance-ui")
      ?.shadowRoot?.firstElementChild?.classList.contains("dark");
    applyTheme(darkModeEnabled ? "light" : "dark");
  };

  useEffect(() => {
    const theme = getTheme();
    applyTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
