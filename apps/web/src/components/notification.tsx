"use client";

import { toast } from "@repo/ui/sonner";
import { useEffect } from "react";

export const GlobalNotifications = () => {
  useEffect(() => {
    const scheduledMaintenance = new Date("2024-06-27 03:00 UTC").getTime();
    setTimeout(() => {
      scheduledMaintenance + 1000 * 60 * 35 > new Date().getTime() &&
        toast.info(
          <div className="p-2">
            <span className="font-bold">Scheduled Maintenance: </span>
            {scheduledMaintenance > new Date().getTime()
              ? `Trackit will be down for maintenance on 2024-06-27 03:00 to 3:35 UTC`
              : `Trackit is currently down for maintenance`}
          </div>,
          {
            duration: 10000,
          },
        );
    }, 500);
  }, []);

  return null;
};
