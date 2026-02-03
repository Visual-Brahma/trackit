import { MeetingState, Participant } from "@/types";
import { BASE_URL } from "@/utils/constants";
import { isSameDay, format } from "date-fns";

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

  const dataString = JSON.stringify(window.trackit.meetData, replacer);

  await browser.storage.local.set({
    [window.trackit.meetData.uuid]: dataString,
  });

  if (isFinal) {
    const uploaded = await uploadAttendanceData(window.trackit.meetData);
    if (uploaded && !uploaded.redirected) {
      // If uploaded successfully, we can remove it from local storage
      await browser.storage.local.remove(window.trackit.meetData.uuid);
      // Redirect to the report page
      window.open(`${BASE_URL}/g/${uploaded.groupId}/r/${uploaded.slug}`);
    } else if (uploaded?.redirected) {
      // Do nothing, user was redirected to login
    } else {
      // Fallback to the old method
      alert("Direct upload failed. Falling back to local storage method.");
      window.open(`${BASE_URL}/save-report`);
    }
  }
};

const uploadAttendanceData = async (meetData: MeetingState) => {
  try {
    const { authToken } = await browser.storage.local.get("authToken");
    if (!authToken) {
      console.log("No auth token found, redirecting to login.");
      const confirmLogin = window.confirm("You are not signed in. Would you like to sign in to save your attendance report directly to the cloud?");
      if (confirmLogin) {
        window.open(`${BASE_URL}/api/auth/signin`);
        return { redirected: true }; // Special return value to indicate redirection
      }
      return null;
    }

    const participants = Array.from(meetData.participants.values()).map((p) => ({
      name: p.name,
      joinTime: p.joinTime.toISOString(),
      leaveTime: p.leaveTime?.toISOString() || p.lastAttendedTimeStamp.toISOString(),
      avatarUrl: p.avatarUrl,
      attendedDuration: p.attendedDuration,
    }));

    const payload = {
      meetCode: meetData.meetCode,
      date: format(meetData.date, "dd/MM/yyyy"),
      startTime: format(meetData.startTime, "HH:mm:ss"),
      stopTime: format(meetData.endTime, "HH:mm:ss"),
      participants,
      groupId: meetData.groupId,
    };

    const response = await fetch(`${BASE_URL}/api/reports/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else if (response.status === 401) {
      console.log("Unauthorized, token might be expired.");
    }
  } catch (error) {
    console.error("Error uploading attendance data:", error);
  }
  return null;
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
