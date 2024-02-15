export const formatDatetime=(datetimeStr: string): string|null => {
    try {
        const date=new Date(datetimeStr);

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