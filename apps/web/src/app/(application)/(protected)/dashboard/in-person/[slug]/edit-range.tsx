"use client";
import { formatDistance } from "@/lib/utils/format";
import { useState } from "react";
import DistanceInput from "../new/distance";
import { Button } from "@repo/ui/button";
import { CheckIcon, X } from "lucide-react";
import { LoadingCircle, SquarePen } from "@repo/ui/icons";
import { editInPersonEvent } from "@/lib/api/in-person";
import { toast } from "@repo/ui/sonner";

export default function EditInPersonEventAllowedRange({
  allowedRange,
  eventId,
}: {
  allowedRange: number;
  eventId: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState(allowedRange);

  if (!isEditing) {
    return (
      <div className="flex gap-2 items-center justify-between">
        <span>{formatDistance(range)}</span>
        <Button
          className="bg-transparent"
          variant={"outline"}
          size={"icon"}
          onClick={() => setIsEditing(true)}
        >
          <SquarePen />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center justify-center">
      <DistanceInput value={range} onChange={setRange} />

      <div className="flex items-center justify-center gap-2">
        <Button
          className="bg-transparent text-green-200"
          variant={"outline"}
          size={"icon"}
          onClick={async () => {
            setIsLoading(true);
            const res = await editInPersonEvent({
              allowedRange: range,
              id: eventId,
            });
            if (!res) {
              toast.error("Error updating range");
              setRange(allowedRange);
            }
            setIsEditing(false);
            setIsLoading(false);
          }}
        >
          {isLoading ? <LoadingCircle /> : <CheckIcon />}
        </Button>
        {!isLoading && (
          <Button
            className="bg-transparent"
            variant={"outline"}
            size={"icon"}
            onClick={() => {
              setRange(allowedRange);
              setIsEditing(false);
            }}
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
