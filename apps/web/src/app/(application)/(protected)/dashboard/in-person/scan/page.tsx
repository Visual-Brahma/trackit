"use client";
import { checkInToInPersonEvent } from "@/lib/api/in-person";
import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/sonner";
import { TypographyP } from "@repo/ui/typography";
import { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import {
  MediaPermissionsError,
  MediaPermissionsErrorType,
  requestMediaPermissions,
} from "mic-check";
import { LoadingCircle } from "@repo/ui/icons";

export default function QrCodeScanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastResult = useRef<string>();

  useEffect(() => {
    checkMediaPermissions();
  }, []);

  const checkMediaPermissions = () => {
    requestMediaPermissions({ video: true, audio: false })
      .then(() => {})
      .catch((error: MediaPermissionsError) => {
        console.log("MediaOnboardingDialog: ", error);
        if (error.type === MediaPermissionsErrorType.SystemPermissionDenied) {
          // user denied permission
          setError(
            "Permission to access camera was denied. Please allow camera access to scan Qr code.",
          );
        } else if (
          error.type === MediaPermissionsErrorType.UserPermissionDenied
        ) {
          // browser doesn't have access to devices
          setError(
            "It seems like your browser doesn't have access to camera. Please allow camera access to scan Qr code.",
          );
        } else if (
          error.type === MediaPermissionsErrorType.CouldNotStartVideoSource
        ) {
          // most likely when other apps or tabs are using the cam/mic (mostly windows)
          setError(
            "Other applications or browser tab might be using camera. Please close other camera applications or tabs and try again.",
          );
        }
      });
  };

  const checkInUser = async (data: { eventId: number; userId: string }) => {
    setIsLoading(true);
    setIsScanning(false);
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
        <QrReader
          onResult={(result) => {
            if (result) {
              if (lastResult.current === result.getText()) {
                return;
              }

              lastResult.current = result.getText();
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
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <TypographyP className="text-center">
        Click the button below to scan attendee Qr Code. Camera permission is
        required to scan Qr code.
      </TypographyP>
      {error && <TypographyP className="text-destructive">{error}</TypographyP>}
      <Button onClick={() => setIsScanning(true)} disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingCircle /> Checking In user
          </>
        ) : (
          "Scan Qr Code"
        )}
      </Button>
    </div>
  );
}
