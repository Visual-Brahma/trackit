"use client";
import { ThemeChangerProps } from "@/types";
import { useTheme } from "next-themes";
import { LaptopIcon } from "lucide-react";
import { Button } from "@repo/ui/button";
import { SunIcon, MoonIcon } from "@/components/icons";

const ThemeSelector = ({ extended }: ThemeChangerProps) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { icon: <MoonIcon />, name: "Dark", value: "dark" },
    { icon: <SunIcon />, name: "Light", value: "light" },
    { icon: <LaptopIcon />, name: "System", value: "system" },
  ];

  if (!extended) {
    return (
      <Button
        variant={"ghost"}
        className="px-2 py-2 rounded-md sm:ml-4"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === undefined ? (
          <LaptopIcon />
        ) : theme === "dark" ? (
          <SunIcon />
        ) : (
          <MoonIcon />
        )}
      </Button>
    );
  }

  return (
    <div className="flex rounded-full ring-1 p-1 ring-primary items-center justify-center space-x-2 ">
      {themes.map((t) => (
        <Button
          key={t.value}
          variant={"ghost"}
          className={`px-3 py-3 w-10 h-10 rounded-full ${
            theme === t.value ? "bg-primary" : ""
          }`}
          onClick={() => setTheme(t.value)}
          title={t.name}
        >
          {t.icon}
        </Button>
      ))}
    </div>
  );
};

export default ThemeSelector;
