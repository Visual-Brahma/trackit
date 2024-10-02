import { Button } from "@repo/ui/button";
import { TypographyP } from "@repo/ui/typography";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@repo/ui/input";
import { CheckIcon, PencilLineIcon, X } from "lucide-react";
import { MeetingState } from "@/types";

export const MeetingNameForm = ({
  name,
  setMeetingState,
}: {
  name: string;
  setMeetingState: Dispatch<SetStateAction<MeetingState>>;
}) => {
  const [meetName, setMeetName] = useState(name);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {!editMode ? (
        <TypographyP>{meetName}</TypographyP>
      ) : (
        <Input
          type="text"
          value={meetName}
          placeholder="Enter your full name"
          onChange={(e) => setMeetName(e.target.value)}
        />
      )}
      {editMode ? (
        <div className="flex items-center justify-center gap-2">
          <Button
            className="bg-transparent text-green-500"
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setMeetingState((prev) => ({ ...prev, name: meetName }));
              setEditMode(!editMode);
            }}
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            className="bg-transparent"
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setMeetName(name);
              setEditMode(!editMode);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          className="bg-transparent"
          variant={"ghost"}
          size={"icon"}
          onClick={() => setEditMode(!editMode)}
        >
          <PencilLineIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
