import { useState, useEffect } from "react";
import Draggable from "./components/draggable";
import ThemeSwitcher from "./components/theme-changer";
import logo from "@/assets/logo.svg";
import { Button } from "@repo/ui/button";
import { AuthContext } from "./providers/auth";
import { buildApiUrl } from "../../utils/constants";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import SignInPrompt from "./components/signin-prompt";
import { Group, MeetingState, Participant } from "@/types";
import MeetingInfo from "./components/meeting-info";
import { cn } from "@/lib/utils";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [meetingState, setMeetingState] = useState<MeetingState>(
    window.trackit.meetData,
  );

  const { isAuthenticated, token } = useContext(AuthContext)!;

  const fetchGroups = useCallback(async () => {
    const response = await fetch(buildApiUrl("/groups"), {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();

    const groups: Group[] = [];

    for (const group of data) {
      if (group.isDefault) {
        setMeetingState((prev) => ({ ...prev, groupId: group.id }));
      }
      groups.push({
        id: group.id,
        name: group.name,
        isDefault: group.isDefault,
      });
    }
    setGroups(groups);
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    } else {
      setMeetingState((prev) => ({ ...prev, groupId: undefined }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    window.trackit.meetData.name = meetingState.name;
    window.trackit.meetData.groupId = meetingState.groupId;
  }, [meetingState]);

  return (
    <Draggable className={cn("max-w-xl", isOpen ? "w-full" : "")}>
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center font-display text-2xl">
          <img
            alt="Trackit logo"
            className="p-2 rounded-sm bg-transparent"
            height={50}
            src={logo}
            style={{ color: "transparent" }}
            title="Trackit logo"
            width={50}
          />
          <p className="font-display text-2xl font-bold drop-shadow-sm md:text-3xl">
            Trackit
          </p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <ThemeSwitcher />
          <Button size={"icon"} onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? (
              <Minimize2Icon className="h-4 w-4" />
            ) : (
              <Maximize2Icon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="mt-4 space-y-2">
          <MeetingInfo
            {...meetingState}
            groups={groups}
            setMeetingState={setMeetingState}
          />
          {!isAuthenticated && <SignInPrompt />}
        </div>
      )}
    </Draggable>
  );
}
