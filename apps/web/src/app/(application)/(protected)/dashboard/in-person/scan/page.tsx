"use client";
import { checkInToInPersonEvent } from "@/lib/api/in-person";
import { Button } from "@repo/ui/button";
import Loading from "@repo/ui/loading";
import { toast } from "@repo/ui/sonner";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function QrCodeScanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const checkInUser = async (data: { eventId: number; userId: string }) => {
    setIsLoading(true);
    const res = await checkInToInPersonEvent({
      ...data,
      checkInTime: new Date().toISOString(),
    });

    if (res === true) {
      toast.success("Checked in successfully");
    } else if (res === false) {
      toast.error("Error checking in");
    } else {
      toast.error(res);
    }

    setIsLoading(false);
  };

  if (isScanning) {
    return (
      <div className="p-4">
        {isLoading && <Loading />}
        <QrReader
          onResult={(result) => {
            if (!!result) {
              if (!isLoading) {
                checkInUser(
                  JSON.parse(result.getText()) as {
                    eventId: number;
                    userId: string;
                  },
                );
              }
            }
          }}
          constraints={{
            width: 800,
            facingMode: "environment",
          }}
        />
      </div>
    );
  }
  return <Button onClick={() => setIsScanning(true)}>Scan Qr Code</Button>;
}
