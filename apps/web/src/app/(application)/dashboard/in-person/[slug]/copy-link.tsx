"use client";
import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/sonner";

export default function CopyAttendanceLink({ slug }: { slug: string }) {
  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(
          `${location.origin}/in-person/${slug}`,
        );
        toast.success("Link copied to clipboard");
      }}
    >
      Share
    </Button>
  );
}
