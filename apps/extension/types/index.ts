import { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export type Group = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type MeetingState = {
  version: number;
  uuid: string;
  name: string;
  meetCode: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  groupId?: string;
  ended: boolean;
  participants: Map<string, Participant>;
  meetDuration: number;
};

/*
  Google meet assigns each participant a unique id for each device they join the meeting with.
  For authenticated users, we can use their avatar url as the id.
  For unauthenticated users, we can use the device id.
*/
export type Participant = {
  id: string;
  name: string;
  joinTime: Date;
  leaveTime?: Date;
  notes: string[];
  avatarUrl: string;
  attendedDuration: number;
  lastAttendedTimeStamp: Date;
};
