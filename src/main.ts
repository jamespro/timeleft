import { Temporal } from "temporal-polyfill";
import "./style.css";

const nowTemporal = Temporal.Now.zonedDateTimeISO().toString();
console.info(`nowTemporal: ${nowTemporal}`);
//0. NOTE: USE JavaScript Temporal API for all dates and calculations. USE Google Calendar API format for dates. USE ISO 8601 format for time.

// set up a variable for the current datetime that will be used in all future calculations in the program:

const now = Temporal.Now.zonedDateTimeISO();
// console log the variable with the variable name and value:
console.info(`now: ${now}`);

// variable, using now, get the PlainTime object that will be used in all future calculations in the program:

const nowTime = now.toPlainTime();
// console log the variable with the variable name and value:

console.info(`nowTime: ${nowTime}`);

// set up a variable that will be used for the current time zone in all future calculations in the program:

const nowTimeZone = Temporal.Now.zonedDateTimeISO().timeZoneId;
// console log the variable with the variable name and value:

console.info(`now time zone ID: ${nowTimeZone}`);

//1. set up a JSON object for sample events data. each event will have a start and end time. the start and end times will be in the same day.

const eventsDataJSON = [
  {
    start: {
      dateTime: "2024-03-16T08:30:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-16T10:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-16T09:30:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-16T11:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-16T12:00:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-16T13:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-16T14:00:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-16T15:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-16T16:30:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-16T17:30:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-16T18:00:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-16T19:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-16T20:30:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-16T21:30:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-16T22:00:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-16T22:30:00-05:00",
      timeZone: "America/New_York",
    },
  },
];

// 2. Set variables with values for the period start and end dates and times. The full day starts at 00:00:00 and ends at 23:59:59. The "early" period starts at 07:00:00 and ends at 08:59:59. The "late" period starts at 17:00:00 and ends at 21:59:59. The "prime" period of work starts at 09:00:00 and ends at 16:59:59. The names of the variables will end with "Start" or "End" and begin with the name of the period. For example, the "early" period start time will be called "earlyStart" and the "late" period end time will be called "lateEnd". The dates must not have a hard-coded date because this application could be used on any day.
// each period needs to have a default value which is hours:minutes:seconds in a timestamp format based on the logic expressed above. These times need to be in a Temporal PlainTime type:

const dayStart = Temporal.PlainTime.from("00:00:00");
const dayEnd = Temporal.PlainTime.from("23:59:59");
const earlyStart = Temporal.PlainTime.from("07:00:00");
const earlyEnd = Temporal.PlainTime.from("08:59:59");
const primeStart = Temporal.PlainTime.from("09:00:00");
const primeEnd = Temporal.PlainTime.from("16:59:59");
const lateStart = Temporal.PlainTime.from("17:00:00");
const lateEnd = Temporal.PlainTime.from("22:59:59");

// periodStart and periodEnd will be initialed with dayStart and dayEnd. Later, it will be updated with the current start and end. Use the syntax from Temporal API where applicable:

let periodStart = dayStart;
let periodEnd = dayEnd;

// 3. The current period will be passed into the functions that calculate the times. Every time the times are calculated, the current time will change the period start and end times that are passed into the functions. If it is before the "early" period start time, then the period start time will be set to 00:00:00 and the period end time will be set to 07:59:59. So, if it is after the "early" period start time, but before the "early" period end time, then the period start time will be set to 07:00:00 and the period end time will be set to 08:59:59. If it is after the "prime" period start time, but before the "prime" period end time, then the period start time will be set to 09:00:00 and the period end time will be set to 16:59:59. If it is after the "late" period start time, but before the "late" period end time, then the period start time will be set to 17:00:00 and the period end time will be set to 21:59:59. If it is after the "late" period end time, then the period start time will be set to 22:00:00 and the period end time will be set to 23:59:59.  Therefore this code needs to adjust for the current day. Important: This application is using the JavaScript Temporal API for time calculations. Update the value of periodStart depending on the current time today using the Temporal API:

// use a function to compare the time of now to the periods and adjust the periodStart and periodEnd:

/**
 * Adjusts the period start and end times based on the given Temporal.PlainTime object.
 * @param {Temporal.PlainTime} time The time to use to adjust the periods.
 * @return {void}
 */
const comparePlainTime = Temporal.PlainTime.compare;

console.warn(`nowTime: ${nowTime.toString()}`);
console.warn(`primeStart:${primeStart.toString()}`);
// Temporal "Duration" is where you send it a quantity like hours and minutes and you get back a Temporal.PlainTime object? if you do duration.toString(), then you get back something in a format like "P8M5D" (for 8 months, 5 days). If you do duration.total("seconds"), then you get back the total number of seconds in the duration. But you don't give it a start and end time. A typical way to do it is sending it an object with the hours or minutes and seconds. like Temporal.Duration.from({ hours: 8, minutes: 5 }).total("seconds").
// So should I get the time "since" with the start and end, and pass that to get a Duration in seconds?

//TODO: CURRENT QUESTION: should i update periodStart and periodEnd separately?

// Primary goal right now: Is the time now in the prime period? If so, use primeStart and primeEnd. If not, use lateEnd and dayEnd.
// Subgoal: What is the duration of time in total seconds from now until primeStart? Determine this using Temporal API:

// function to get the period start and end times. pass in

// Array of start times to compare
const startTimes = [dayStart, earlyStart, primeStart, lateStart];

// Find the closest past time to "nowTime"
const closestPastTime = startTimes.reduce((acc, startTime) => {
  // If startTime is before nowTime and after the current closest time, update acc
  if (
    Temporal.PlainTime.compare(startTime, nowTime) === -1 &&
    Temporal.PlainTime.compare(startTime, acc) === 1
  ) {
    return startTime;
  }
  return acc;
}, dayStart); // Start with the earliest possible time (dayStart) and find the latest that's still before now

// Update periodStart to the closest past time
periodStart = closestPastTime;

console.log(`The closest past time period start is: ${periodStart}`);

// log periodStart and periodEnd to the console for debugging:
console.log(`AFTER periodStart: ${periodStart.toString()}`);

// Array of end times to compare
const endTimes = [earlyEnd, primeEnd, lateEnd, dayEnd];

// Find the closest future time to "nowTime"
const closestFutureTime = endTimes.reduce((acc, endTime) => {
  // If endTime is after nowTime and before the current closest time, update acc
  if (
    Temporal.PlainTime.compare(endTime, nowTime) === 1 &&
    Temporal.PlainTime.compare(endTime, acc) === -1
  ) {
    return endTime;
  }
  return acc;
}, dayEnd); // Start with the latest possible time (dayEnd) and find the earliest that's still after now

// Update periodEnd to the closest future time
periodEnd = closestFutureTime;

console.log(`The closest future time period end is: ${periodEnd}`);

console.log(`AFTER periodEnd: ${periodEnd.toString()}`);

// create a variable to include below to output the value for all of the variable names for the periods, for debugging:
const debugPeriods = [
  earlyStart,
  earlyEnd,
  primeStart,
  primeEnd,
  lateStart,
  lateEnd,
  dayStart,
  dayEnd,
  periodStart,
  periodEnd,
];

const debugPeriodNames = [
  "dayStart",
  "dayEnd",
  "earlyStart",
  "earlyEnd",
  "primeStart",
  "primeEnd",
  "lateStart",
  "lateEnd",
  "periodStart",
  "periodEnd",
];

// set defaults for any unused variables below:
let totalScale = 0;
let remainingScale = 0;
let timeNowTime = 0;
let currentTime = 0;
let actualTimeLeft = 0;
let timeLeft = 0;

// calculate the totalScale which is the positive duration of time between periodEnd and periodStart in seconds;
totalScale = Temporal.Duration.from(periodStart.until(periodEnd)).total(
  "seconds"
);
// calculate the remainingScale which is the positive duration of time between nowTime and periodEnd in seconds;
remainingScale = Temporal.Duration.from(nowTime.until(periodEnd)).total(
  "seconds"
);
function getTimeUntilPeriodEnd(periodEnd: Temporal.PlainTime) {
  // Get the current time in the same timezone as periodEnd
  const now = Temporal.Now.plainTimeISO();

  // Calculate the difference between now and periodEnd
  let difference = periodEnd.since(now);

  // Check if the periodEnd is already passed, adjust according to your needs
  // if (Temporal.PlainTime.compare(periodEnd, now) === -1) {
  //   console.log('periodEnd is in the past. Adjusting to next day or handling accordingly.');
  //   // You might want to adjust this part based on how you handle periodEnd in the past.
  //   // For example, to calculate the time until periodEnd tomorrow, you can add 24 hours to the difference.
  //   // This is just an illustrative example.
  //   difference = periodEnd.add({ hours: 24 }).since(now);
  // }

  // Return the time until periodEnd in hours, minutes, and seconds
  return {
    hours: difference.hours,
    minutes: difference.minutes,
    seconds: difference.seconds,
  };
}

const timeUntilPeriodEnd = getTimeUntilPeriodEnd(periodEnd);
function formatDuration(duration: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  const hours = duration.hours.toString();
  const minutes = duration.minutes.toString().padStart(2, "0");
  const seconds = duration.seconds.toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
const durationUntilPeriodEnd = getTimeUntilPeriodEnd(periodEnd);
const formattedDuration = formatDuration(durationUntilPeriodEnd);

console.log(`Time until periodEnd: ${formattedDuration}`);

console.log(
  `TimeLeft: ${timeUntilPeriodEnd.hours} hours, ${timeUntilPeriodEnd.minutes} minutes, and ${timeUntilPeriodEnd.seconds} seconds.`
);

// let displayTimeLeft = `${timeUntilPeriodEnd.hours} hours, ${timeUntilPeriodEnd.minutes} minutes, and ${timeUntilPeriodEnd.seconds} seconds.`;
let displayTimeLeft = formatTimeLeft(timeUntilPeriodEnd);

function formatTimeLeft(duration: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  return `${
    duration.hours > 0
      ? `${duration.hours} hours${
          duration.minutes > 0 || duration.seconds > 0 ? ", " : ""
        }`
      : ""
  }${
    duration.minutes > 0
      ? `${duration.minutes.toString().padStart(2, "0")} minutes${
          duration.seconds > 0 ? ", and " : ""
        }`
      : ""
  }${duration.seconds.toString().padStart(2, "0")} seconds`;
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div class="container">
    <p>Time Left</p>
    <div class="card">
      <h1>TimeLeft: ${displayTimeLeft}</h1>
      <h4>periodEnd ${periodEnd}</h4>
      <h4>periodStart ${periodStart}</h4>
      <h1 style="color: blue">totalScale: ${totalScale}</h1>
      <h4>periodEnd: ${periodEnd}</h4>
      <h4>timenowtime: ${timeNowTime}</h4>
      <h1 style="color: red">remainingScale: ${remainingScale}</h1>
    </div>
    <div class="debug">
      <p>debug periods: ${debugPeriods}</p>
      <p>debug period names: ${debugPeriodNames}</p>
    <p>Time Now: ${currentTime}</p>
      <p>${periodEnd} - ${periodStart}</p>
      <p>NEXT THING STARTS AT WHEN??:</p>
      <p>Time Left: ${actualTimeLeft}</p>
      <p class="footer-text">
        Don't let your dreams be dreams
      </p>
    </div>
  </div>
`;
