import type { ColumnType, GeneratedAlways } from "kysely";
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
    meetingId: number;
    isPublic: Generated<boolean>;
    sharedWith: string[];
};
export type AttendanceReportUserPresence = {
    id: GeneratedAlways<number>;
    attendanceReportId: number;
    userId: string;
    isPresent: Generated<boolean>;
    joinTime: Timestamp;
    leaveTime: Timestamp;
    comment: string | null;
    meetingTrail: unknown | null;
};
export type Group = {
    id: GeneratedAlways<number>;
    name: string;
    description: string | null;
    banner: string | null;
    joinCode: Generated<string>;
    isAcceptingMembers: Generated<boolean>;
};
export type GroupMember = {
    id: GeneratedAlways<number>;
    groupId: number;
    role: Generated<Role>;
    userId: string;
};
export type Meeting = {
    id: GeneratedAlways<number>;
    groupId: number;
    date: Timestamp;
    isOnline: Generated<boolean>;
    name: string;
    meetLink: string | null;
    startTime: Timestamp | null;
    endTime: Timestamp | null;
    venue: string | null;
    agenda: unknown | null;
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
    groupId: number;
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
};
export type VerificationToken = {
    identifier: string;
    token: string;
    expires: Timestamp;
};
export type DB = {
    Account: Account;
    AttendanceReport: AttendanceReport;
    AttendanceReportUserPresence: AttendanceReportUserPresence;
    Group: Group;
    GroupMember: GroupMember;
    Meeting: Meeting;
    MeetingNotes: MeetingNotes;
    Message: Message;
    Session: Session;
    User: User;
    VerificationToken: VerificationToken;
};
