function convertMS(milliseconds: number) {
    let day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return `${day}d ${hour}h ${minute}m ${seconds}s`;
}

export function calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const duration = Math.abs(end.getTime() - start.getTime());

    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // If the duration is less than 1 hour, only show minutes and seconds.
    // Otherwise, show hours, minutes, and seconds.
    if (hours === 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${hours}h ${minutes}m`;
    }
}
