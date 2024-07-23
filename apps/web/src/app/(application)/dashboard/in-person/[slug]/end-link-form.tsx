"use client";
import { endInPersonEvent } from "@/lib/api/in-person";
import { Button } from "@repo/ui/button";
import Loading from "@repo/ui/loading";
import { toast } from "@repo/ui/sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StopAcceptingResponsesForm({ id }: { id: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await endInPersonEvent({
      id: id,
      endTime: new Date().toISOString()
    });

    if (res) {
      toast.success("Successfully stopped accepting responses");
      router.refresh();
    } else {
      toast.error("Failed to stop accepting responses");
    }
    setIsLoading(false);
  };
  return (
    <Button onClick={handleSubmit}>
      {isLoading ? <Loading /> : "Stop Accepting Responses"}
    </Button>
  );
}
