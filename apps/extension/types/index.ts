import { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export type Group = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type MeetingState={
  name: string;
  meetCode: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  groupId?: string;
};
