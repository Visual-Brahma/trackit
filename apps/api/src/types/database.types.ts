import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Role = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER"
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export type AttendanceReport = {
    id: Generated<number>;
    meetingId: number;
    isPublic: Generated<boolean>;
};
export type AttendanceReportUserPresence = {
    id: Generated<number>;
    attendanceReportId: number;
    userId: number;
    isPresent: Generated<boolean>;
    joinTime: Timestamp;
    leaveTime: Timestamp;
    comments: string | null;
    meetingTrail: unknown | null;
};
export type ClassGroup = {
    id: Generated<number>;
    name: string;
    description: string | null;
    banner: string | null;
    joinCode: string;
    isAcceptingMembers: Generated<boolean>;
};
export type GroupMember = {
    id: Generated<number>;
    groupId: number;
    role: Generated<Role>;
    userId: number;
};
export type Meeting = {
    id: Generated<number>;
    groupId: number;
    date: Timestamp;
    isOnline: Generated<boolean>;
    meetCode: string | null;
    meetLink: string | null;
    startTime: Timestamp | null;
    endTime: Timestamp | null;
    venue: string | null;
    agenda: string | null;
};
export type MeetingNotes = {
    id: Generated<number>;
    date: Timestamp;
    notes: unknown;
    meetingId: number;
};
export type Message = {
    id: Generated<number>;
    date: Generated<Timestamp>;
    message: string;
    groupId: number;
    userId: number;
};
export type User = {
    id: Generated<number>;
    email: string;
    name: string | null;
    avatarUrl: string | null;
};
export type DB = {
    AttendanceReport: AttendanceReport;
    AttendanceReportUserPresence: AttendanceReportUserPresence;
    ClassGroup: ClassGroup;
    GroupMember: GroupMember;
    Meeting: Meeting;
    MeetingNotes: MeetingNotes;
    Message: Message;
    User: User;
};
