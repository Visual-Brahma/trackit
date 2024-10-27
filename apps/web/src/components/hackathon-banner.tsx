"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@repo/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function HackathonBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem("hasSeenInohaxHackathonBanner");
    if (!hasSeenBanner) {
      setIsVisible(true);
    }

    const timer = setInterval(() => {
      const hackathonDate = new Date("2024-11-09T11:00:00+0530");
      const now = new Date();
      const difference = hackathonDate.getTime() - now.getTime();

      if (difference < 0) {
        setIsVisible(false);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenInohaxHackathonBanner", "true");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ scale: [1.0, 1.1, 1.0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </motion.div>
            <div>
              <p className="text-lg font-bold">Join the InoHax Hackathon!</p>
              <p className="text-sm">
                Unleash your creativity, build amazing projects, win big prizes!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">
              <span className="font-bold">{timeLeft}</span> left to register!
            </div>
            <Button asChild size="sm">
              <a
                href="https://inohax.inovact.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                Join Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-1"
                >
                  →
                </motion.div>
              </a>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
