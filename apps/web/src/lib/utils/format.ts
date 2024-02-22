export const formatDatetime=(date: Date): string|null => {
    try {

        if (!isNaN(date.getTime())) {
            const formattedDate=date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });

            return formattedDate;
        } else {
            throw new Error('Invalid datetime string format');
        }
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return null;
    }
}

export const formatTime=(date: Date): string => {
    const hours=date.getHours();
    const minutes=date.getMinutes().toString().padStart(2, "0");
    const meridian=hours<12? "AM":"PM";
    const adjustedHours=hours===0? 12:(hours>12)? hours-12:hours;

    return `${adjustedHours}:${minutes} ${meridian}`;
}

export const getDurationBetweenDates=(date1: Date, date2: Date): string => {
    const difference=Math.abs(date2.getTime()-date1.getTime());

    const seconds=Math.floor(difference/1000);
    const minutes=Math.floor(seconds/60);
    const hours=Math.floor(minutes/60);
    const days=Math.floor(hours/24);
    const years=Math.floor(days/365);

    // Build the human-readable string
    let durationString="";
    if (years>0) {
        durationString+=`${years} year${years>1? "s":""}`;
        if (days%365>0) {
            durationString+=`, ${days%365} day${days%365>1? "s":""}`;
        }
    } else if (days>0) {
        durationString+=`${days} day${days>1? "s":""}`;
        if (hours%24>0) {
            durationString+=`, ${hours%24} hour${hours%24>1? "s":""}`;
        }
    } else if (hours>0) {
        durationString+=`${hours} hour${hours>1? "s":""}`;
        if (minutes%60>0) {
            durationString+=`, ${minutes%60} minute${minutes%60>1? "s":""}`;
        }
    } else if (minutes>0) {
        durationString+=`${minutes} minute${minutes>1? "s":""}`;
        if (seconds%60>0) {
            durationString+=`, ${seconds%60} second${seconds%60>1? "s":""}`;
        }
    } else {
        durationString=`${seconds} second${seconds>1? "s":""}`;
    }

    return durationString;
}

export const extractMeetCodeFromLink=(url: string): string => {
    const regex=/https:\/\/meet\.google\.com\/(.*)$/;
    const match=url.match(regex);

    if (match) {
        const code=match[1];
        return code||"-";
    } else {
        console.error("Invalid URL format");
        return "-";
    }
}