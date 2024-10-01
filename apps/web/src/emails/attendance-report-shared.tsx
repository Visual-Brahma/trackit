import { Heading, Hr, Button, Text, Link } from "@react-email/components";
import * as React from "react";
import EmailLayout from "./layout";
import { buttonVariants } from "@repo/ui/button";
import { clientEnv } from "@/config/env/client";

export interface AttendanceReportShareEmailProps {
  name: string;
  url: string;
}

export const AttendanceReportSharedEmail = ({
  name,
  url,
}: AttendanceReportShareEmailProps) => {
  const previewText = `${name} has shared an attendance report with you.`;

  return (
    <EmailLayout previewText={previewText}>
      <Heading className="text-2xl font-normal text-center my-8 mx-0">
        {name} has shared an attendance report with you.
      </Heading>
      <Text>You can view the report by clicking the button below.</Text>
      <Button className={buttonVariants()} href={url}>
        View Report
      </Button>
      <Text>or copy and paste this URL into your browser:</Text>
      <Link href={url}>{url}</Link>

      <Hr className="border border-solid border-[#eaeaea] my-4 mx-0 w-full" />
      <Text className="text-muted">
        You're receiving this email because someone has shared an attendance
        report with you on <Link href={clientEnv.NEXT_PUBLIC_URL}>Trackit</Link>
        . If you were not expecting this email, you can ignore this email. If
        you are concerned about your account's safety, please reply to this
        email to get in touch with us.
      </Text>
    </EmailLayout>
  );
};

export default AttendanceReportSharedEmail;
