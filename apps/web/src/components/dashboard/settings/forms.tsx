"use client";

import { setNewsletterPreference, setUserName } from "@/lib/api/user";
import { Button } from "@repo/ui/button";
import { Switch } from "@repo/ui/switch";
import { TypographyH3, TypographyP } from "@repo/ui/typography";
import { useState } from "react";
import { SquarePen } from "@repo/ui/icons";
import { Input } from "@repo/ui/input";
import { CheckIcon, X } from "lucide-react";
import { toast } from "@repo/ui/sonner";

export const EmailPreferenceForm = ({
  checked,
  email,
}: {
  checked: boolean;
  email: string;
}) => {
  const [newsletter, setNewsletter] = useState(checked);
  return (
    <div className="my-4 mt-6">
      <div className="flex items-center space-x-4 w-full justify-between max-w-screen-md">
        <TypographyH3>Email Notifications</TypographyH3>
        <Switch
          checked={newsletter}
          onCheckedChange={async () => {
            if (await setNewsletterPreference(!newsletter, email)) {
              setNewsletter(!newsletter);
            } else {
              toast.error("Error updating email preference");
            }
          }}
        />
      </div>
      <TypographyP className="max-w-screen-md">
        Control whether to recieve e-mail from Trackit. You will still recieve
        administrative emails even if this setting is turned off.
      </TypographyP>
    </div>
  );
};

export const NameForm = ({ name, email }: { name: string; email: string }) => {
  const [fullName, setFullName] = useState(name);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="flex items-center space-x-4 w-full justify-between">
      <TypographyP>Name</TypographyP>
      <div className="flex items-center gap-2">
        {!editMode ? (
          <TypographyP>{fullName}</TypographyP>
        ) : (
          <Input
            type="text"
            value={fullName}
            placeholder="Enter your full name"
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        {editMode ? (
          <div className="flex items-center justify-center gap-2">
            <Button
              className="bg-transparent text-green-200"
              variant={"outline"}
              size={"icon"}
              onClick={async () => {
                if (!(await setUserName(fullName, email))) {
                  toast.error("Error updating name");
                  setFullName(name);
                }
                setEditMode(!editMode);
              }}
            >
              <CheckIcon />
            </Button>
            <Button
              className="bg-transparent"
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                setFullName(name);
                setEditMode(!editMode);
              }}
            >
              <X />
            </Button>
          </div>
        ) : (
          <Button
            className="bg-transparent"
            variant={"outline"}
            size={"icon"}
            onClick={() => setEditMode(!editMode)}
          >
            <SquarePen />
          </Button>
        )}
      </div>
    </div>
  );
};
