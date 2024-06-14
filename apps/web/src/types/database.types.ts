import type { ColumnType, GeneratedAlways } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Role = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const MeetingPlatform = {
  GOOGLE_MEET: "GOOGLE_MEET",
} as const;
export type MeetingPlatform =
  (typeof MeetingPlatform)[keyof typeof MeetingPlatform];
export type Account = {
  id: GeneratedAlways<string>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};
export type AttendanceReport = {
  id: GeneratedAlways<number>;
  slug: Generated<string>;
  meetingId: number;
  isPublic: Generated<boolean>;
  sharedWith: Generated<string[]>;
  membersPresence: Generated<unknown>;
};
export type Group = {
  id: GeneratedAlways<string>;
  name: string;
  description: string | null;
  banner: string | null;
  joinCode: Generated<string>;
  isAcceptingMembers: Generated<boolean>;
  /**
   * true, if the group was creating automatically on user signup
   */
  isDefault: Generated<boolean>;
};
export type GroupMember = {
  id: GeneratedAlways<number>;
  groupId: string;
  role: Generated<Role>;
  userId: string;
};
export type Meeting = {
  id: GeneratedAlways<number>;
  groupId: string;
  date: Timestamp;
  isOnline: Generated<boolean>;
  name: string;
  meetLink: string | null;
  meetPlatform: MeetingPlatform | null;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  venue: string | null;
  agenda: unknown | null;
  recurringMeetingId: number | null;
};
export type MeetingNotes = {
  id: GeneratedAlways<number>;
  createdAt: Generated<Timestamp>;
  content: unknown;
  isPrivate: Generated<boolean>;
  meetingId: number;
  userId: string | null;
};
export type Message = {
  id: GeneratedAlways<number>;
  timestamp: Generated<Timestamp>;
  message: unknown;
  groupId: string;
  userId: string;
};
export type Session = {
  id: GeneratedAlways<string>;
  sessionToken: string;
  userId: string;
  expires: Timestamp;
};
export type User = {
  id: GeneratedAlways<string>;
  name: string | null;
  email: string;
  emailVerified: Timestamp | null;
  image: string | null;
  newsletter: Generated<boolean>;
};
export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Timestamp;
};
export type DB = {
  Account: Account;
  AttendanceReport: AttendanceReport;
  Group: Group;
  GroupMember: GroupMember;
  Meeting: Meeting;
  MeetingNotes: MeetingNotes;
  Message: Message;
  Session: Session;
  User: User;
  VerificationToken: VerificationToken;
};
