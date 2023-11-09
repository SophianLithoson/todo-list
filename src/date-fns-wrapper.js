import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import isFuture from "date-fns/isFuture";
import format from "date-fns/format";

function daysFromNow(date) {
    const _resultString = formatDistanceToNowStrict(date, {unit: "day", roundingMethod: "ceil"});
    if (isFuture(date)) {
        return +_resultString.slice(0, _resultString.indexOf(" "));
    }
    else {
        return (0 - _resultString.slice(0, _resultString.indexOf(" ")));
    }
    
}

function formatDisplayedDate(date) {
    const _formattedDate = format(date, "MM/dd/yyyy");
    return _formattedDate;
}

function formatShortDisplayDate(date) {
    const _formattedDate = format(date, "MM/dd");
    return _formattedDate;
}

function dateToDateString(date) {
    const _formattedDate = format(date, "yyyy-MM-dd");
    return _formattedDate;
}

export {daysFromNow, formatDisplayedDate, formatShortDisplayDate, dateToDateString};