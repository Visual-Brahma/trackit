"use client";
import { Button } from "@repo/ui/button";
import { signIn } from "next-auth/react";

export default function SignInButton({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  return (
    <Button onClick={() => signIn(undefined, { callbackUrl: callbackUrl })}>
      Sign In Now
    </Button>
  );
}
