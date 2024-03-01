import { readFile, writeFile, readdir, appendFile } from "fs/promises";

const stringTo24HourTime=(timeString: string) => {

    const [time, meridian]=timeString.split(' ') as [string, 'am'|'pm'];
    const [hoursStr, minutesStr, secondsStr]=time.split(':') as [string, string, string];

    // Sanitize and convert hours to number:
    const hours=parseInt(hoursStr, 10);
    if (isNaN(hours)||hours<1||hours>12) {
        return new Error(`Invalid hour value: ${hoursStr}`);
    }

    // Handle meridian and adjust hours for 24-hour format:
    const adjustedHours=meridian==='pm'? hours+12:hours;

    // Convert minutes and seconds to numbers:
    const minutes=parseInt(minutesStr, 10);
    if (isNaN(minutes)||minutes<0||minutes>59) {
        return new Error(`Invalid minute value: ${minutesStr}`);
    }

    const seconds=parseInt(secondsStr, 10);
    if (isNaN(seconds)||seconds<0||seconds>59) {
        return new Error(`Invalid second value: ${secondsStr}`);
    }

    // Return the 24-hour time string:
    return `${adjustedHours.toString().padStart(2, '0')}:${minutesStr.toString().padStart(2, '0')}:${secondsStr.toString().padStart(2, '0')}`;
}

const cleanUser=async (file="data/auth_user.json") => {
    const users: {
        id: number;
        email: string;
        name: string;
    }[]=[];
    const jsonString=await readFile(file, 'utf8');
    const data: Array<any>=JSON.parse(jsonString);

    data.forEach(({ id, email, first_name, last_name }) => {
        if(email&&email.trim().length>0){
            users.push({
                id,
                email,
                name: `${first_name} ${last_name}`,
            })
        }
    });

    await writeFile("data/cleaned-users.json", JSON.stringify(users, null, 2));

    console.log("Original Users count: ", data.length);
    console.log("Cleaned Users count: ", users.length);
}

interface MemberPresence {
    name: string;
    joinTime: string;
    leaveTime: string;
    avatarUrl: string;
    attendedDuration: number;
}

interface Meeting {
    date: Date;
    name: string;
    meetLink: string;
    meetPlatform: string;
    startTime: Date;
    endTime: Date;
}

export interface AttendanceReport {
    isPublic: boolean;
    oldSlug: string;
    userId: number;
    meeting: Meeting;
    membersPresence: MemberPresence[];
}

const cleanAndStoreAttendanceReports=async (file: string) => {
    const attendanceReports: AttendanceReport[]=[];
    const jsonString=await readFile(file, 'utf8');
    const reports=JSON.parse(jsonString);

    reports.forEach((data: any) => {
        const meetDate=new Date(data.date);
        attendanceReports.push({
            isPublic: data.shared===1,
            oldSlug: data.slug,
            userId: data.userId_id,
            meeting: {
                date: meetDate,
                name: data.meetCode,
                meetLink: `https://meet.google.com/${data.meetCode}`,
                meetPlatform: 'GOOGLE_MEET',
                startTime: new Date(meetDate.getFullYear(), meetDate.getMonth(), meetDate.getDate(), parseInt(data.startTime.split(".")[0].split(":")[0]), parseInt(data.startTime.split(".")[0].split(":")[1]), parseInt(data.startTime.split(".")[0].split(":")[2])),
                endTime: new Date(meetDate.getFullYear(), meetDate.getMonth(), meetDate.getDate(), parseInt(data.stopTime.split(".")[0].split(":")[0]), parseInt(data.stopTime.split(".")[0].split(":")[1]), parseInt(data.stopTime.split(".")[0].split(":")[2])),
            },
            membersPresence: data.attendanceData.map(({ name, joinTime, leaveTime, avatarUrl, attendedDuration }: MemberPresence) => ({ name, joinTime, leaveTime, avatarUrl, attendedDuration })),
        });
    });

    return attendanceReports;
}

const cleanAndStoreReportsV0=async (file="data/mac_attendance_record.json") => {
    const attendanceReports: AttendanceReport[]=[];
    const jsonString=await readFile(file, 'utf8');
    const reports=JSON.parse(jsonString);

    reports.forEach((data: any) => {
        const meetDate=new Date(data.date);
        attendanceReports.push({
            isPublic: data.shared===1,
            oldSlug: "mac_"+data.slug,
            userId: data.user_id_id,
            meeting: {
                date: meetDate,
                name: data.meet_code,
                meetLink: `https://meet.google.com/${data.meet_code}`,
                meetPlatform: 'GOOGLE_MEET',
                startTime: new Date(meetDate.getFullYear(), meetDate.getMonth(), meetDate.getDate(), parseInt(data.start_time.split(".")[0].split(":")[0]), parseInt(data.start_time.split(".")[0].split(":")[1]), parseInt(data.start_time.split(".")[0].split(":")[2])),
                endTime: new Date(meetDate.getFullYear(), meetDate.getMonth(), meetDate.getDate(), parseInt(data.stop_time.split(".")[0].split(":")[0]), parseInt(data.stop_time.split(".")[0].split(":")[1]), parseInt(data.stop_time.split(".")[0].split(":")[2])),
            },
            membersPresence: data.student_names.map((name: any, idx: number) => ({
                name: name,
                joinTime: stringTo24HourTime(data.join_time[idx]),
                leaveTime: data.stop_time.split(".")[0],
                attendedDuration: data.attended_duration[idx],
            })),
        });
    });

    return attendanceReports;

}

const cleanAttendanceReports=async () => {

    const files=await readdir('data/shesh');
    await writeFile("data/attendance-reports-v2.json", "[");
    const reportsV0=await cleanAndStoreReportsV0();
    await appendFile('data/attendance-reports-v2.json', JSON.stringify(reportsV0, null, 2).slice(1, -1)+",");
    for (const file of files) {
        console.log(`Processing ${file}`)
        const reports=await cleanAndStoreAttendanceReports(`data/shesh/${file}`);
        // save attendanceReports to file
        console.log(`Writing to file`);
        await appendFile('data/attendance-reports-v2.json', JSON.stringify(reports, null, 2).slice(1, -1)+",");
    }
    const finalData=await readFile("data/attendance-reports-v2.json", "utf8");
    const data=JSON.parse(finalData.slice(0, -1)+"]");
    console.log("Reports count: ", data.length);
    console.log("Last report slug: ", data[data.length-1].oldSlug);
    await writeFile("data/attendance-reports-v2.json", finalData.slice(0, -1)+"]");
}

export const cleanData=async () => {
    await cleanUser();
    await cleanAttendanceReports();
}


