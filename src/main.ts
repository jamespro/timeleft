import { Temporal } from "temporal-polyfill";
import "./style.css";

//0. NOTE: USE JavaScript Temporal API for all dates and calculations. USE Google Calendar API format for dates. USE ISO 8601 format for time.

const nowTemporal = Temporal.Now.zonedDateTimeISO().toString();
const now = Temporal.Now.zonedDateTimeISO();
const nowTime = now.toPlainTime();
const nowTimeZone = Temporal.Now.zonedDateTimeISO().timeZoneId;
console.info(`nowTemporal: ${nowTemporal}`);
console.info(`now: ${now}`);
console.info(`nowTime: ${nowTime}`);
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

// 2. Set variables with values for the period start and end dates and times.
const dayStart = Temporal.PlainTime.from("00:00:00");
const dayEnd = Temporal.PlainTime.from("23:59:59");
const earlyStart = Temporal.PlainTime.from("07:00:00");
const earlyEnd = Temporal.PlainTime.from("08:59:59");
const primeStart = Temporal.PlainTime.from("09:00:00");
const primeEnd = Temporal.PlainTime.from("16:59:59");
const lateStart = Temporal.PlainTime.from("17:00:00");
const lateEnd = Temporal.PlainTime.from("22:59:59");

let periodStart = dayStart;
let periodEnd = dayEnd;

// 3. Pass the current period start and end times into the functions to calculate the next period start and end times.

console.warn(`nowTime: ${nowTime.toString()}`);

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

console.warn(`periodStart: ${periodStart.toString()}`);
console.warn(`periodEnd: ${periodEnd.toString()}`);

// set defaults for any unused variables below:
let totalScale = 0;
let remainingScale = 0;
let timeNowTime = 0;
let currentTime = 0;
let actualTimeLeft = 0;
let timeLeft = 0;

totalScale = Temporal.Duration.from(periodStart.until(periodEnd)).total(
  "seconds"
);
remainingScale = Temporal.Duration.from(nowTime.until(periodEnd)).total(
  "seconds"
);
/**
 * Calculates the time remaining until a specified period end time.
 *
 * @param {Temporal.PlainTime} periodEnd - The end time of the period
 * @return {Object} An object containing the remaining hours, minutes, and seconds
 */
function getTimeUntilPeriodEnd(periodEnd: Temporal.PlainTime) {
  const now = Temporal.Now.plainTimeISO();

  let difference = periodEnd.since(now);

  return {
    hours: difference.hours,
    minutes: difference.minutes,
    seconds: difference.seconds,
  };
}

const timeUntilPeriodEnd = getTimeUntilPeriodEnd(periodEnd);
/**
 * Formats a duration object into a string representation of the duration in hours, minutes, and seconds.
 *
 * @param {object} duration - The duration object to be formatted.
 * @param {number} duration.hours - The number of hours in the duration.
 * @param {number} duration.minutes - The number of minutes in the duration.
 * @param {number} duration.seconds - The number of seconds in the duration.
 * @return {string} A string representation of the duration in the format "HH:MM:SS".
 */
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

let displayTimeLeft = formatTimeLeft(timeUntilPeriodEnd);

/**
 * Formats the time left based on the duration object.
 *
 * @param {{ hours: number; minutes: number; seconds: number; }} duration - The duration object containing hours, minutes, and seconds.
 * @return {string} The formatted time left in hh:mm:ss format.
 */
function formatTimeLeft(duration: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  return `${
    duration.hours > 0
      ? `${duration.hours}${
          duration.minutes > 0 || duration.seconds > 0 ? ":" : ""
        }`
      : ""
  }${
    duration.minutes > 0
      ? `${duration.minutes.toString().padStart(2, "0")}${
          duration.seconds > 0 ? ":" : ""
        }`
      : ""
  }${duration.seconds.toString().padStart(2, "0")}`;
}
/**
 * Update the gauge to visually represent the remaining time compared to the total time.
 *
 * @param {number} totalScale - the total scale of the gauge
 * @param {number} remainingScale - the remaining scale of the gauge
 * @return {void}
 */
function updateGauge(totalScale: number, remainingScale: number) {
  const proportion = (remainingScale / totalScale) * 100;
  const gauge = document.getElementById("timeGauge");
  gauge!.style.height = proportion + "%";

  // Update text to show the exact time remaining/total
  const text = `${remainingScale} seconds remaining of ${totalScale} total seconds`;
  document.getElementById("timeText")!.innerText = text;
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div class="container">
    <p>Time Left</p>
    <div class="card">
      <h1>${displayTimeLeft}</h1>
      <div id="timeGaugeContainer" style="width: 30px; height: 200px; background-color: #ddd; position: relative;">
      <div id="timeGauge" style="width: 100%; background-color: #4CAF50; position: absolute; bottom: 0;"></div>
      </div>
      <p id="timeText"></p>

    </div>
    <div class="debug" style="display: none;">
      <h4 style="color: blue">totalScale: ${totalScale}</h4>
      <h4 style="color: red">remainingScale: ${remainingScale}</h4>
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

updateGauge(totalScale, remainingScale);
