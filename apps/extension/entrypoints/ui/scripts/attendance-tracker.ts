import { MeetingState, Participant } from "@/types";
import { BASE_URL } from "@/utils/constants";
import { isSameDay } from "date-fns";

const SAVE_INTERVAL = 60000;
let lastSaveTime = new Date().getTime();
let trackingInterval: NodeJS.Timeout;

const track_attendance = ({
  meetActionButtons,
  participantsButtonIndex,
}: {
  meetActionButtons: HTMLCollectionOf<Element>;
  participantsButtonIndex: number;
}) => {
  const currentParticipants = document.getElementsByClassName("KjWwNd");
  const currentParticipantsName = document.getElementsByClassName("zWGUib");

  if (currentParticipants.length > 0) {
    const participants = new Map();

    for (let i = 0; i < currentParticipants.length; i++) {
      participants.set(
        (currentParticipants[i]! as HTMLImageElement).src,
        currentParticipantsName[i]!.innerHTML.toUpperCase()
      );
    }

    participants.forEach(function (name, avatarUrl) {
      if (window.trackit.meetData.participants.has(avatarUrl)) {
        let data = window.trackit.meetData.participants.get(avatarUrl)!;
        data.attendedDuration += 1;
        data.lastAttendedTimeStamp = new Date();
        window.trackit.meetData.participants.set(avatarUrl, data);
      } else {
        let joinTime = new Date();
        const data: Participant = {
          id: avatarUrl,
          avatarUrl: avatarUrl,
          name: name,
          joinTime: joinTime,
          attendedDuration: 1,
          lastAttendedTimeStamp: joinTime,
          notes: [],
        };
        window.trackit.meetData.participants.set(avatarUrl, data);
      }
    });
    window.trackit.meetData.meetDuration += 1;

    const now = new Date();
    if (now.getTime() - lastSaveTime >= SAVE_INTERVAL) {
      saveAttendanceData(false);
      lastSaveTime = now.getTime();
    }
  } else {
    try {
      (
        meetActionButtons[
          participantsButtonIndex % meetActionButtons.length
        ]! as HTMLButtonElement
      ).click();
    } catch (error) {
      console.log("Participants button not found.");
      clearInterval(trackingInterval);
      saveAttendanceData(true);
    }
  }
};

export const replacer = (_key: string, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
};

const reviver = (_key: string, value: any) => {
  if (value && typeof value === "object") {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }

  if (value && typeof value === "string") {
    const date = Date.parse(value);
    if (!isNaN(date)) {
      return new Date(value);
    }
  }

  return value;
};

export const loadAttendanceData = async (meetCode: string) => {
  const attendanceRecords = await browser.storage.local.get(null);

  for (let key in attendanceRecords) {
    if (key.startsWith("meet_attendance_report_") && attendanceRecords[key]) {
      const data = JSON.parse(attendanceRecords[key], reviver) as MeetingState;
      if (
        data.meetCode === meetCode &&
        !data.ended &&
        isSameDay(new Date(), new Date(data.date))
      ) {
        // console.log("Attendance data loaded from storage.");
        // console.log(data);
        return data;
      }
    }
  }

  return null;
};

const saveAttendanceData = async (isFinal = false) => {
  const endTime = new Date();
  window.trackit.meetData.ended = isFinal;
  window.trackit.meetData.endTime = endTime;

  window.trackit.meetData.participants.forEach((participant) => {
    participant.leaveTime = participant.lastAttendedTimeStamp;
  });

  await browser.storage.local.set({
    [window.trackit.meetData.uuid]: JSON.stringify(
      window.trackit.meetData,
      replacer
    ),
  });

  if (isFinal) {
    window.open(`${BASE_URL}/save-report`);
  }
};

export const tracker = () => {
  const meetActionButtons = document.getElementsByClassName("NtU4hc");
  if (meetActionButtons.length === 0) {
    throw new Error("Meeting not started yet.");
  }

  if (window.trackit.meetData.meetDuration == 0) {
    window.trackit.meetData.date = new Date();
    window.trackit.meetData.startTime = new Date();
  }

  trackingInterval = setInterval(track_attendance, 1000, {
    meetActionButtons,
    participantsButtonIndex: 1,
  });
};
