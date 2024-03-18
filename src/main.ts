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

const nowTime = Temporal.PlainTime.from(now);
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

console.log("Since:");
console.warn(
  `periodStart since now: ${Temporal.Duration.from(
    periodStart.since(now)
  ).total("seconds")}`
);
console.warn(
  `periodEnd since now: ${Temporal.Duration.from(periodEnd.since(now)).total(
    "seconds"
  )}`
);
console.warn(
  `dayStart since now: ${Temporal.Duration.from(dayStart.since(now)).total(
    "seconds"
  )}`
);
console.warn(
  `earlyStart since now: ${Temporal.Duration.from(earlyStart.since(now)).total(
    "seconds"
  )}`
);
console.warn(
  `earlyEnd since now: ${Temporal.Duration.from(earlyEnd.since(now)).total(
    "seconds"
  )}`
);
console.warn(
  `primeStart since now: ${Temporal.Duration.from(primeStart.since(now)).total(
    "seconds"
  )}`
);
console.warn(
  `primeEnd since now: ${Temporal.Duration.from(primeEnd.since(now)).total(
    "seconds"
  )}`
);
console.warn(
  `lateStart since now: ${Temporal.Duration.from(lateStart.since(now)).total(
    "seconds"
  )}`
);
console.warn(
  `lateEnd since now: ${Temporal.Duration.from(lateEnd.since(now)).total(
    "seconds"
  )}`
);
console.warn(
  `dayEnd since now: ${Temporal.Duration.from(dayEnd.since(now)).total(
    "seconds"
  )}`
);

console.log("Until:");
console.warn(
  `periodStart until now: ${Temporal.Duration.from(
    periodStart.until(now)
  ).total("seconds")}`
);
console.warn(
  `periodEnd until now: ${Temporal.Duration.from(periodEnd.until(now)).total(
    "seconds"
  )}`
);
console.warn(
  `dayStart until now: ${Temporal.Duration.from(dayStart.until(now)).total(
    "seconds"
  )}`
);
console.warn(
  `earlyStart until now: ${Temporal.Duration.from(earlyStart.until(now)).total(
    "seconds"
  )}`
);
console.warn(
  `earlyEnd until now: ${Temporal.Duration.from(earlyEnd.until(now)).total(
    "seconds"
  )}`
);
console.warn(
  `primeStart until now: ${Temporal.Duration.from(primeStart.until(now)).total(
    "seconds"
  )}`
);
console.warn(
  `primeEnd until now: ${Temporal.Duration.from(primeEnd.until(now)).total(
    "seconds"
  )}`
);
console.warn(
  `lateStart until now: ${Temporal.Duration.from(lateStart.until(now)).total(
    "seconds"
  )}`
);
console.warn(
  `lateEnd until now: ${Temporal.Duration.from(lateEnd.until(now)).total(
    "seconds"
  )}`
);
console.warn(
  `dayEnd until now: ${Temporal.Duration.from(dayEnd.until(now)).total(
    "seconds"
  )}`
);

// Subgoal: Is the duration of time from now until primeStart a negative number?
// Subgoal: If so, set periodStart to primeStart.

// Subgoal: Is the time from now until primeEnd a positive number?
// Subgoal: If so, set periodEnd to primeEnd.

// define a variable as the Duration since periodStart until now?
// log periodStart and periodEnd before the function
console.log(`periodStart: ${periodStart.toString()}`);
console.log(`periodEnd: ${periodEnd.toString()}`);

// function to get the period start and end times. pass in

adjustPeriods(nowTime);

function adjustPeriods(time: Temporal.PlainTime): void {
  // if (!(time instanceof Temporal.PlainTime)) {
  //   console.log("time is not a Temporal.PlainTime object");
  //   throw new Error(
  //     "Invalid parameter: time must be a Temporal.PlainTime object"
  //   );
  // }
  // if (!(earlyStart instanceof Temporal.PlainTime)) {
  //   console.log("earlyStart is not a Temporal.PlainTime object");
  //   throw new Error(
  //     "Invalid parameter: earlyStart must be a Temporal.PlainTime object"
  //   );
  // }

  // adjustStart
  // compare periodStart to earlyStart
  // if periodStart is less than earlyStart, set periodStart to earlyStart
  if (
    Temporal.Duration.from(periodStart.since(now)).total("milliseconds") <
    Temporal.Duration.from(earlyStart.since(now)).total("milliseconds")
  ) {
    periodStart = earlyStart;
  }
  // compare periodStart to primeStart
  // if periodStart is less than primeStart, set periodStart to primeStart
  if (
    Temporal.Duration.from(periodStart.since(now)).total("milliseconds") <
    Temporal.Duration.from(primeStart.since(now)).total("milliseconds")
  ) {
    periodStart = primeStart;
  }
  // compare periodStart to lateStart
  // if periodStart is less than lateStart, set periodStart to lateStart

  if (
    Temporal.Duration.from(periodStart.since(now)).total("milliseconds") <
    Temporal.Duration.from(lateStart.since(now)).total("milliseconds")
  ) {
    periodStart = lateStart;
  }
  // adjustEnd
  // compare periodEnd to earlyEnd
  // if periodEnd is less than earlyEnd, set periodEnd to earlyEnd
  if (
    Temporal.Duration.from(periodEnd.until(now)).total("milliseconds") <
    Temporal.Duration.from(earlyEnd.until(now)).total("milliseconds")
  ) {
    console.log("setting periodEnd to earlyEnd");
    periodEnd = earlyEnd;
  }
  // compare periodEnd to primeEnd
  // if periodEnd is less than primeEnd, set periodEnd to primeEnd
  if (
    Temporal.Duration.from(periodEnd.until(now)).total("milliseconds") <
    Temporal.Duration.from(primeEnd.until(now)).total("milliseconds")
  ) {
    console.log("setting periodEnd to primeEnd");
    periodEnd = primeEnd;
  }
  // compare periodEnd to lateEnd
  // if periodEnd is less than lateEnd, set periodEnd to lateEnd

  if (
    Temporal.Duration.from(periodEnd.until(now)).total("milliseconds") <
    Temporal.Duration.from(lateEnd.until(now)).total("milliseconds")
  ) {
    console.log("setting periodEnd to lateEnd");
    periodEnd = lateEnd;
  }

  // if (time >= primeStart && time < primeEnd) {
  //   periodStart = primeStart;
  //   periodEnd = primeEnd;
  // } else {
  //   periodStart = lateEnd;
  //   periodEnd = dayEnd;
  // }
  // if (time < earlyStart) {
  //   periodStart = dayStart;
  //   periodEnd = earlyEnd;
  // } else if (time >= earlyStart && time < earlyEnd) {
  //   periodStart = earlyStart;
  //   periodEnd = earlyEnd;
  // } else if (time >= primeStart && time < primeEnd) {
  //   periodStart = primeStart;
  //   periodEnd = primeEnd;
  // } else if (time >= lateStart && time < lateEnd) {
  //   periodStart = lateStart;
  //   periodEnd = lateEnd;
  // } else {
  //   periodStart = lateEnd;
  //   periodEnd = dayEnd;
  // }
}

// log periodStart and periodEnd to the console for debugging:
console.log(`AFTER periodStart: ${periodStart.toString()}`);
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

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div class="container">
    <p>Time Left</p>
    <div class="card">
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
