import { Temporal } from "@js-temporal/polyfill";
import "./style.css";

// 1. Determine period start and end dates and times. The full day starts at 00:00:00 and ends at 23:59:59. The "early" period starts at 07:00:00 and ends at 08:59:59. The "late" period starts at 17:00:00 and ends at 21:59:59. The "prime" period of work starts at 09:00:00 and ends at 16:59:59. The current period will be passed into the functions that calculate the times. Every time the times are calculated, the current time will change the period start and end times that are passed into the functions. If it is before the "early" period start time, then the period start time will be set to 00:00:00 and the period end time will be set to 07:59:59. So, if it is after the "early" period start time, but before the "early" period end time, then the period start time will be set to 07:00:00 and the period end time will be set to 08:59:59. If it is after the "prime" period start time, but before the "prime" period end time, then the period start time will be set to 09:00:00 and the period end time will be set to 16:59:59. If it is after the "late" period start time, but before the "late" period end time, then the period start time will be set to 17:00:00 and the period end time will be set to 21:59:59. If it is after the "late" period end time, then the period start time will be set to 22:00:00 and the period end time will be set to 23:59:59.

// 2. Events data: JSON array of events. Use the Google Calendar API as an example for sample data. Must contain 9 events. One event must start and end at the same time. One event must start before the period and end within the period. One event must start and end after the period. One event must be within the period. One event must overlap with the period end. One event must overlap with another event. Every event must start on March 5, 2024.

// 3. Events data: Fetch events. Currently coming from Google Calendar API.
// 4. Truncate event times: Ensure all event times are clipped to the period's start and end bounaries. If an event starts before the period, change it to start at the period's start. If an event ends after the period, change it to end at the period's end.
// 5. Merge overlapping events: Combine events that overlap into a single event to avoid double counting.
// 6. Calculate total time in the period. This is based on period start and end times.
// 7. Calculate total unavailable time: calculate the total duration of all (merged) events.
// 8. Calculate available time: subtract the total unavailable time from the total time in the period.

// Types of periods. Each period must include a start time and end time during the same 24 hours.
// early
// prime
// late

/*
// set the variables for all of the periods and start and end times in javascript:
const timePeriods = ["early", "prime", "late"]; // set the variables for all of the periods and start and end times in javascript:

function getCurrentTime() {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${hour}:${minute}:${second}`;
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

*/
const currentDate = new Date();

const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const currentDay = currentDate.getDate().toString().padStart(2, "0");
const currentHour = currentDate.getHours().toString().padStart(2, "0");
const currentMinute = currentDate.getMinutes().toString().padStart(2, "0");
const currentSecond = currentDate.getSeconds().toString().padStart(2, "0");
const currentYear = currentDate.getFullYear();

const currentTime = `${currentHour}:${currentMinute}:${currentSecond}`;

/* 
SET DEFAULTS FOR TIME PERIODS
*/

const timeNow = new Date();

// 2024-02-25T00:00:01-05:00
const datePart = currentYear + "-" + currentMonth + "-" + currentDay;

const dayStart = new Date(`${datePart}T00:00:01-05:00`);
const dayEnd = new Date(`${datePart}T23:59:59-05:00`);
const primeStart = new Date(`${datePart}T09:00:00-05:00`);
const primeEnd = new Date(`${datePart}T17:00:00-05:00`);
const earlyStart = new Date(`${datePart}T07:00:00-05:00`);
const earlyEnd = primeEnd;
const lateStart = primeEnd;
const lateEnd = new Date(`${datePart}T21:00:00-05:00`);

let periodStart = dayStart;
let periodEnd = dayEnd;

if (timeNow > earlyStart) {
  periodStart = earlyStart;
  periodEnd = earlyEnd;
}

if (timeNow > primeStart) {
  periodStart = primeStart;
  periodEnd = primeEnd;
}

if (timeNow > lateStart) {
  periodStart = lateStart;
  periodEnd = lateEnd;
}

if (timeNow > lateEnd) {
  periodStart = lateEnd;
  periodEnd = dayEnd;
}

//use typescript to give actualTimeLeft a type of number

let actualTimeLeft: number = 123;
// set actualTimeLeft = the difference between periodStart and periodEnd

// convert periodStart to milliseconds
let periodStartTime = periodStart.getTime();
let periodEndTime = periodEnd.getTime();
// convert timeNow to milliseconds
let timeNowTime = timeNow.getTime();
// subtract timeNow from periodStart
actualTimeLeft = periodEndTime - periodStartTime;
let totalScale = periodEndTime - periodStartTime;
let remainingScale = periodEndTime - timeNowTime;

/**
 * Converts the given actual time left in milliseconds to an object containing hours, minutes, and seconds.
 *
 * @param {number} actualTimeLeft - The actual time left in milliseconds.
 * @return {{ hours: number, minutes: number, seconds: number }} An object containing the converted time in hours, minutes, and seconds.
 */
function convertToHMS(actualTimeLeft: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const seconds: number = Math.floor(actualTimeLeft / 1000);
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const remainingSeconds: number = seconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  };
}

/**
 * Converts the given actual time left in milliseconds to an object containing days, hours, minutes, and seconds using Temporal JS.
 *
 * @param {number} actualTimeLeft - The actual time left in milliseconds.
 * @return {{ days: number, hours: number, minutes: number, seconds: number }} An object containing the converted time in days, hours, minutes, and seconds.
 */
function convertToDHMS(actualTimeLeft: number) {
  const duration = Temporal.Duration.from({ milliseconds: actualTimeLeft });
  const days = duration.days;
  const hours = duration.hours;
  const minutes = duration.minutes;
  const seconds = duration.seconds;
  const milliseconds = duration.milliseconds;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}
let actualTimeLeftObj = convertToDHMS(actualTimeLeft);

let actualTimeLeftDisplay =
  actualTimeLeftObj.days +
  " days, " +
  actualTimeLeftObj.hours +
  " hours, " +
  actualTimeLeftObj.minutes +
  " minutes, " +
  actualTimeLeftObj.milliseconds +
  " milliseconds";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div class="container">
    <p>Time Left</p>
    <p>${actualTimeLeft}</p>
    <p>${actualTimeLeftDisplay}</p>
    <div class="card">
      <h4>periodEndTime ${periodEndTime}</h4>
      <h4>periodStartTime ${periodStartTime}</h4>
      <h1 style="color: blue">totalScale: ${totalScale}</h1>
      <h4>periodEndTime: ${periodEndTime}</h4>
      <h4>timenowtime: ${timeNowTime}</h4>
      <h1 style="color: red">remainingScale: ${remainingScale}</h1>
    </div>
    <div class="debug">
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
