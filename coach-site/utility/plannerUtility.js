export function getHoursObjectArray() {
    let hours = [];

    for (let i = 0; i < 24; i++) {
        let hour = { };
        hours.push(hour);
        
        if (i < 13) {
            let twelveHour = (i > 0) ? i : 12;
            let meridian = (i < 12) ? "AM" : "PM";

            hour.military = i;
            hour.militaryString = (i < 10) ? `0${i}` : `${i}`;
            hour.twelveHour = twelveHour;
            hour.meridian = meridian;
            hour.twelveHourString = `${twelveHour} ${meridian}`;
        } else if (i > 12) {
            let twelveHour = i % 12;

            hour.military = i;
            hour.militaryString = `${i}`;
            hour.twelveHour = twelveHour;
            hour.meridian = "PM";
            hour.twelveHourString = `${twelveHour} PM`;
        }
    }

    return hours;
}