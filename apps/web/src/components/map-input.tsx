"use client";

import { Button } from "@repo/ui/button";
import { LoadingCircle } from "@repo/ui/icons";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { toast } from "@repo/ui/sonner";
import { TypographyP } from "@repo/ui/typography";
import { useEffect, useState } from "react";

export default function MapInput({
  location,
  onChange
}: {
  location?: {
    lat: number;
    lng: number;
  };
  onChange: (location: { lat: number; lng: number }) => void;
}) {
  const [locationError, setLocationError] = useState<{
    message: string;
    isError: boolean | null;
    code?: number;
  }>({
    message: "Get location",
    isError: null
  });
  const [geolocationEnabled, setGeolocationEnabled] = useState<boolean>();
  const [loading, setLoading] = useState<{
    isLoading: boolean;
    initial?: boolean;
  }>({
    initial: true,
    isLoading: true
  });

  const getLocation = () => {
    setLoading({
      isLoading: true,
      initial: false
    });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;

        setLocationError({
          message: "Location permission granted.",
          isError: false
        });

        onChange({ lat: latitude, lng: longitude });
        setLoading({ isLoading: false });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied.");
          setLocationError({
            message:
              "Location permission denied. Please allow location permission to move ahead.",
            isError: true,
            code: error.code
          });
        } else if (error.code === error.TIMEOUT) {
          toast.error(
            "Unable to get location. Make sure your device location is enabled and try again."
          );
          setLocationError({
            message:
              "Unable to get location. Make sure your device location is enabled and try again.",
            isError: true,
            code: error.code
          });
        }
        setLoading({ isLoading: false });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    setLoading({ isLoading: false });
    if ("geolocation" in navigator) {
      setGeolocationEnabled(true);
    } else {
      setGeolocationEnabled(false);
    }
  }, []);

  if (loading.isLoading && loading.initial) {
    return <TypographyP>Checking device geolocation support.</TypographyP>;
  }

  if (geolocationEnabled === false) {
    return (
      <TypographyP>Geolocation is not supported by your browser.</TypographyP>
    );
  }

  return (
    <div className="flex items-start justify-between gap-2">
      {locationError.isError ? (
        <>
          <TypographyP className="text-sm text-destructive">
            {locationError.message}
          </TypographyP>
          {locationError.code !== 1 && (
            <Button type="button" onClick={getLocation}>
              {loading.isLoading ? <LoadingCircle /> : "Try Again"}
            </Button>
          )}
        </>
      ) : locationError.isError === false ? (
        <>
          <div>
            <Label>Latitude</Label>
            <Input
              value={location?.lat}
              onChange={(e) =>
                onChange({
                  lat: parseFloat(e.target.value),
                  lng: location?.lng || 0
                })
              }
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              value={location?.lng}
              onChange={(e) =>
                onChange({
                  lat: location?.lat || 0,
                  lng: parseFloat(e.target.value)
                })
              }
            />
          </div>
        </>
      ) : (
        <>
          <TypographyP className="text-sm">
            Your current location is needed to use this feature. It will be used
            to check if the attendees are within the allowed range.
          </TypographyP>
          <Button type="button" onClick={getLocation}>
            {loading.isLoading ? <LoadingCircle /> : "Get Location"}
          </Button>
        </>
      )}
    </div>
  );
}
