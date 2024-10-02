import { Participant } from "@/types";
import { Dispatch, SetStateAction } from "react";

export default function AttendanceTracker({
  participants,
  setParticipants,
}: {
  participants: Participant[];
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
}) {
  const trackAttendees = () => {};

  useEffect(() => {
    trackAttendees();
  }, []);

  return null;
}
