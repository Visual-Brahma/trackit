import { Heading, Hr, Button, Text, Link } from "@react-email/components";
import * as React from "react";
import EmailLayout from "./layout";
import { appName } from "@/lib/constants/brand";
import { buttonVariants } from "@repo/ui/button";
import { clientEnv } from "@/config/env/client";

export interface GroupInviteEmailProps {
  groupName: string;
  joinCode: string;
  inviterName: string;
}

export const GroupInviteEmail = ({
  groupName,
  joinCode,
  inviterName,
}: GroupInviteEmailProps) => {
  const url = `${clientEnv.NEXT_PUBLIC_URL}/dashboard/groups/join?code=${joinCode}`;
  const previewText = `You've been invited to join ${groupName} on Trackit`;

  return (
    <EmailLayout previewText={previewText}>
      <Heading className="text-2xl font-normal text-center my-8 mx-0">
        You've been invited!
      </Heading>
      <Text>
        Hello!<br />
        <br />
        {inviterName} has invited you to join the group <strong>{groupName}</strong> on {appName}.
      </Text>
      <Text>
        Use the button below to join the group:
      </Text>
      <Button href={url} className={buttonVariants()}>
        Join Group
      </Button>
      <Text>or use the join code: <strong>{joinCode}</strong></Text>
      <Text>Or copy and paste this URL into your browser:</Text>
      <Link href={url}>{url}</Link>

      <Hr className="border border-solid border-[#eaeaea] my-4 mx-0 w-full" />
      <Text className="text-muted">
        If you were not expecting this invitation, you can ignore this email.
      </Text>
    </EmailLayout>
  );
};

export default GroupInviteEmail;
