"use client";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { CheckIcon, CopyIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next13-progressbar";
import { LoadingCircle } from "@repo/ui/icons";
import { toast } from "@repo/ui/sonner";
import { updateGroupJoinCode } from "@/lib/api/groups/settings";
import { Input } from "@repo/ui/input";

export default function GroupJoinCodeSettings({
  groupId,
  joinCode,
}: {
  groupId: string;
  joinCode: string;
}) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const regenerateJoinCode = async () => {
    setIsLoading(true);
    const res = await updateGroupJoinCode({ groupId });
    if (res.success) {
      toast.success("Join code regenerated successfully");
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className={"mt-4"}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
    >
      <Card className="rounded-2xl shadow-xl overflow-hidden bg-secondary/40">
        <CardHeader className="flex flex-row justify-between gap-2 items-center">
          <CardTitle>Join Code</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center space-x-2 mb-2">
          <Input value={joinCode} readOnly className="flex-grow" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={copied ? "check" : "copy"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `Join my group on Trackit using this code: ${joinCode}`,
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="min-w-[80px]"
                variant={"secondary"}
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
          <Button onClick={regenerateJoinCode}>
            {isLoading ? (
              <LoadingCircle className="mr-2 w-4 h-4" />
            ) : (
              <RefreshCcwIcon className="mr-2 w-4 h-4" />
            )}
            Regenerate
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
