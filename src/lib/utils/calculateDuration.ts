function convertMS(milliseconds: number) {
    let day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    // return `${day}d ${hour}h ${minute}m ${seconds}s`;
    return `${hour}h${minute}m`;
}

export function calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const duration = Math.abs(end.getTime() - start.getTime());

    return convertMS(duration);
}
