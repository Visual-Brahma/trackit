"use client";
import { useState, useEffect } from "react";
import { LayoutProps } from "@/types";
import Link from "next/link";
import Image from "next/image";
import ThemeSelector from "./theme_changer";
import { buttonVariants } from "@repo/ui/button";
import Footer from "./footer";

const Layout = ({ children }: LayoutProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div
        className={`fixed top-0 w-full ${
          isScrolled ? "border-b border-border backdrop-blur-xl" : ""
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link className="flex items-center font-display text-2xl" href="/">
            <Image
              alt="Trackit logo"
              src="/logo.svg"
              className="mr-2 rounded-sm"
              height={45}
              width={45}
              loading="lazy"
              style={{ color: "transparent" }}
            />
            <p className="font-display text-2xl font-bold drop-shadow-sm md:text-3xl">
              Trackit
            </p>
          </Link>
          <div className="flex items-center justify-center gap-1">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "default" })}
            >
              {"Get Started"}
            </Link>
            <ThemeSelector />
          </div>
        </div>
      </div>
      <div className="w-full py-5 text-center self-end">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
