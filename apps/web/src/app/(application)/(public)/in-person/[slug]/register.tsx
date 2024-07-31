"use client";

import { registerToInPersonEvent } from "@/lib/api/in-person";
import { Button } from "@repo/ui/button";
import { LoadingCircle } from "@repo/ui/icons";
import { toast } from "@repo/ui/sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterToInPersonEventAction({
  eventId,
}: {
  eventId: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setIsLoading(true);

    const success = await registerToInPersonEvent({
      registrationTime: new Date().toISOString(),
      eventId,
    });

    if (success) {
      toast.success("You have successfully registered for this event.");
      router.refresh();
    } else {
      toast.error("Failed to register for the event.");
    }
    setIsLoading(false);
  };
  return (
    <Button onClick={handleRegister} disabled={isLoading}>
      {isLoading ? <LoadingCircle /> : "Register"}
    </Button>
  );
}
