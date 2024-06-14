"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@repo/ui/select";

const PreviewEmailTemplate = ({
  emailTemplates,
}: {
  emailTemplates: { id: string; name: string; email: string }[];
}) => {
  const [email, setEmail] = useState<string>("");

  const handleSelectChange = (value: string) => {
    const selectedEmailTemplate = emailTemplates.find(
      (emailTemplate) => emailTemplate.name === value,
    );
    if (selectedEmailTemplate) {
      setEmail(selectedEmailTemplate.email);
    }
  };

  return (
    <div className="p-2 min-h-screen">
      <div>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an email template to display" />
          </SelectTrigger>
          <SelectContent>
            {emailTemplates.map((emailTemplate) => (
              <SelectItem key={emailTemplate.id} value={emailTemplate.name}>
                {emailTemplate.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-center my-4">
        <div dangerouslySetInnerHTML={{ __html: email }} />
      </div>
    </div>
  );
};

export default PreviewEmailTemplate;
