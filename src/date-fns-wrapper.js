import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import isFuture from "date-fns/isFuture";

function daysFromNow(date) {
    const resultString = formatDistanceToNowStrict(date, {unit: "day", roundingMethod: "ceil"});
    if (isFuture(date)) {
        return +resultString.slice(0, resultString.indexOf(" "));
    }
    else {
        return (0 - resultString.slice(0, resultString.indexOf(" ")));
    }
    
}

export {daysFromNow};