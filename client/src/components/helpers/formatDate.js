export const formatDate = (oldDate) => {
    var tmpDate = new Date(oldDate).toDateString();
    var tmpTime = new Date(oldDate).toTimeString().split(' ')[0];
    var hours = tmpTime.split(':')[0];
    var minutes = tmpTime.split(':')[1];
    // calculate
    var timeValue;
    if (hours > 0 && hours <= 12) {
        timeValue = "" + hours;
    } else if (hours > 12) {
        timeValue = "" + (hours - 12);
    } else if (hours === 0) {
        timeValue = "12";
    }
    timeValue += ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? "pm" : "am";  // get AM/PM

    return tmpDate + ' at ' + timeValue;

}
