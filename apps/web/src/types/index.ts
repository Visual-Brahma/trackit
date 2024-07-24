import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface ThemeChangerProps {
  extended?: boolean;
  className?: string;
}

export type Point = {
  x: number;
  y: number;
};