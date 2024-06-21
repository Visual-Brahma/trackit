"use client";
import { ThemeChangerProps } from "@/types";
import { useTheme } from "next-themes";
import { LaptopIcon } from "lucide-react";
import { Button } from "@repo/ui/button";
import { SunIcon, MoonIcon } from "@/components/icons";
import { cn } from "@repo/ui/utils";

const ThemeSelector = ({ extended, className }: ThemeChangerProps) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      icon: <MoonIcon />,
      name: "Dark",
      value: "dark",
    },
    {
      icon: <SunIcon />,
      name: "Light",
      value: "light",
    },
    {
      icon: <LaptopIcon />,
      name: "System",
      value: "system",
    },
  ];

  if (!extended) {
    return (
      <Button
        variant={"ghost"}
        className={cn("px-2 py-2 rounded-md sm:ml-4", className)}
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
    <div
      className={cn(
        "flex rounded-full ring-1 p-1 ring-primary items-center justify-start max-w-fit space-x-2",
        className,
      )}
    >
      {themes.map((t) => (
        <Button
          key={t.value}
          variant={theme === t.value ? "default" : "ghost"}
          className="px-3 py-3 h-10 rounded-full"
          onClick={() => setTheme(t.value)}
          title={t.name}
        >
          {t.icon}
          {/* {theme == t.value && t.name} */}
        </Button>
      ))}
    </div>
  );
};

export default ThemeSelector;
