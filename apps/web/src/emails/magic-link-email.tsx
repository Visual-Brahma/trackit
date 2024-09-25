import { Heading, Hr, Button, Text, Link } from "@react-email/components";
import * as React from "react";
import EmailLayout from "./layout";
import { appName } from "@/lib/constants/brand";
import { buttonVariants } from "@repo/ui/button";
import { clientEnv } from "@/config/env/client";

export interface MagicLinkEmailProps {
  url: string;
  host: string;
}

export const MagicLinkEmail = ({ url, host }: MagicLinkEmailProps) => {
  const previewText = `Your Login Link to signin to Trackit`;

  return (
    <EmailLayout previewText={previewText}>
      <Heading className="text-2xl font-normal text-center my-8 mx-0">
        Your Login Link
      </Heading>
      <Text>
        Welcome to {appName}!<br />
        <br />
        Please click the magic link below to sign in to your account.
      </Text>
      <Button href={url} className={buttonVariants()}>
        Sign in
      </Button>
      <Text>or copy and paste this URL into your browser:</Text>
      <Link href={url}>{url}</Link>

      <Hr className="border border-solid border-[#eaeaea] my-4 mx-0 w-full" />
      <Text className="text-muted">
        You're receiving this email because you or someone else wants to sign in
        to <Link href={clientEnv.NEXT_PUBLIC_URL}>Trackit</Link>. If you were
        not expecting this email, you can ignore this email. If you are
        concerned about your account's safety, please reply to this email to get
        in touch with us.
      </Text>
    </EmailLayout>
  );
};

export default MagicLinkEmail;
