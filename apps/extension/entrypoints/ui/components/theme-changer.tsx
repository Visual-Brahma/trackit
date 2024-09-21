import { Button } from "@repo/ui/button";
import { SunIcon, MoonIcon } from "@repo/ui/icons";
import { ThemeContext } from "../providers/theme";
import { useContext } from "react";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      variant={"ghost"}
      className="px-2 py-2 rounded-md sm:ml-4"
      onClick={() => {
        toggleTheme();
      }}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
