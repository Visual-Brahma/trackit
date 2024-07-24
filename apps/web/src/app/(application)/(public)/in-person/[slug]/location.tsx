"use client";

import MapInput from "@/components/map-input";
import { checkInToInPersonEvent } from "@/lib/api/in-person";
import { Button } from "@repo/ui/button";
import { LoadingCircle } from "@repo/ui/icons";
import { toast } from "@repo/ui/sonner";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { CheckCircleIcon } from "lucide-react";

export default function InPersonEventAttendance({
  eventId,
  eventLocation,
  allowedRange
}: {
  eventId: number;
  eventLocation: { lat: number; lng: number };
  allowedRange: number;
}) {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  }>();

  const [isLoading, setIsLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const checkIn = async () => {
    if (!location) return;
    setIsLoading(true);

    const res = await checkInToInPersonEvent({
      userLocation: location,
      checkInTime: new Date().toISOString(),
      eventId: eventId,
      eventLocation: eventLocation,
      allowedRange: allowedRange
    });

    if (res === true) {
      toast.success("You have successfully checked in.");
      setCheckedIn(true);
    } else {
      toast.error(
        res === false ? "Failed to check in. Please try again." : res
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-lg my-4 space-y-4">
      {checkedIn ? (
        <Alert variant="success">
          <CheckCircleIcon className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            You have successfully checked in to the event.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <MapInput
            location={location}
            onChange={(value) => setLocation(value)}
            defaultMessage="Your current location is needed to use this feature. It will be used to check if you are within the allowed range."
          />
          {location && (
            <Button onClick={checkIn}>
              {isLoading ? <LoadingCircle /> : "Check In"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
