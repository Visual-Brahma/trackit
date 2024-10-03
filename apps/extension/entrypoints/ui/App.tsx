import { useState, useEffect } from "react";
import Draggable from "./components/draggable";
import ThemeSwitcher from "./components/theme-changer";
import logo from "@/assets/logo.svg";
import { Button } from "@repo/ui/button";
import { AuthContext } from "./providers/auth";
import { buildUrl } from "../utils/constants";
import AttendanceTracker from "./tracker";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import SignInPrompt from "./components/signin-prompt";
import { Group, MeetingState, Participant } from "@/types";
import MeetingInfo from "./components/meeting-info";
import { cn } from "@/lib/utils";

export default function App() {
  const meetCode = location.pathname.substring(1);

  const initialMeetingInfo = useMemo(
    () => ({
      uuid: `meet_attendance_report_${meetCode}_${new Date().getTime()}`,
      name: meetCode,
      meetCode: meetCode,
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
    }),
    [],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [meetingInfo, setMeetingInfo] =
    useState<MeetingState>(initialMeetingInfo);

  const { isAuthenticated, token } = useContext(AuthContext)!;

  const fetchGroups = useCallback(async () => {
    const response = await fetch(buildUrl("/groups"), {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();

    const groups: Group[] = [];

    for (const group of data) {
      if (group.isDefault) {
        setMeetingInfo((prev) => ({ ...prev, groupId: group.id }));
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
      setMeetingInfo((prev) => ({ ...prev, groupId: undefined }));
    }
  }, [isAuthenticated]);

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
            {...meetingInfo}
            groups={groups}
            participants={participants.length}
            setMeetingState={setMeetingInfo}
          />
          {!isAuthenticated && <SignInPrompt />}
        </div>
      )}
      <AttendanceTracker
        participants={participants}
        setParticipants={setParticipants}
      />
    </Draggable>
  );
}
