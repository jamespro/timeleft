import { Temporal } from "temporal-polyfill";
import { periods } from "./periods";
// import { eventsDataJSON } from "./eventsdata";
import "./style.css";

// Your existing code that uses the periods object...import "./style.css";

//NOTE: USE JavaScript Temporal API for all dates and calculations. USE Google Calendar API format for dates. USE ISO 8601 format for time.

//Functions for calculating time left

// function formatHMS(duration: {
//   hours: number;
//   minutes: number;
//   seconds: number;
// }) {
//   const hours = duration.hours.toString();
//   const minutes = duration.minutes.toString().padStart(2, "0");
//   const seconds = duration.seconds.toString().padStart(2, "0");

//   return `${hours}:${minutes}:${seconds}`;
// }

function formatDuration(duration: Temporal.Duration) {
  const hours = duration.hours.toString();
  const minutes = duration.minutes.toString().padStart(2, "0");
  const seconds = duration.seconds.toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

// this was doing weird things when the minutes or seconds is zero: not showing the colon after minutes, not showing the minutes...
// function formatTimeLeft(duration: {
//   hours: number;
//   minutes: number;
//   seconds: number;
// }) {
//   return `${
//     duration.hours > 0
//       ? `${duration.hours}${
//           duration.minutes > 0 || duration.seconds > 0 ? ":" : ":"
//         }`
//       : ""
//   }${
//     duration.minutes > 0
//       ? `${duration.minutes.toString().padStart(2, "0")}${
//           duration.seconds > 0 ? ":" : ":"
//         }`
//       : ""
//   }${duration.seconds.toString().padStart(2, "0")}`;
// }

// function updateGauge(totalScale: number, availableScale: number) {
//   const proportion = (availableScale / totalScale) * 100;
//   const gauge = document.getElementById("timeGauge");
//   gauge!.style.height = proportion + "%";

//   // Update text to show the exact time available/total
//   const text = `${availableScale} seconds available of ${totalScale} total seconds`;
//   document.getElementById("timeText")!.innerText = text;
// }

// 0. GET DATA: Set up a JSON object for sample events data. each event will have a start and end time. the start and end times will be in the same day.
//NOTE: maybe the periods are also data to get from somewhere?

// 1. Set up defaults for the current time and time zone.
const nowTemporal = Temporal.Now.zonedDateTimeISO().toString();
const now = Temporal.Now.zonedDateTimeISO();
const nowTime = now.toPlainTime();
const nowTimeZone = Temporal.Now.zonedDateTimeISO().timeZoneId;
console.info(`nowTemporal: ${nowTemporal}`);
console.info(`now: ${now}`);
console.info(`nowTime: ${nowTime}`);
console.info(`now time zone ID: ${nowTimeZone}`);

// 2. Set variables with values for the period start and end dates and times.

// example how to adjust one specific time:
//periods.prime.end = periods.prime.end.add({ minutes: 8 });

let periodStart = periods.day.start;
let periodEnd = periods.day.end;

// 3. Pass the current period start and end times into the functions to calculate the next period start and end times.

// console.warn(`nowTime: ${nowTime.toString()}`);
// 3a. start time
// Put the start times into an array to loop through and compare

// use periods to get the start times for each period

const startTimes = Object.values(periods).map((period) => period.start);

// Update periodStart to the closest past time
function getPeriodStart(
  nowTime: Temporal.PlainTime,
  startTimes: Temporal.PlainTime[]
) {
  console.log(startTimes);
  const closestPastTime = startTimes.reduce((acc, startTime) => {
    // If startTime is before nowTime and after the current closest time, update acc
    if (
      Temporal.PlainTime.compare(startTime, nowTime) === -1 &&
      Temporal.PlainTime.compare(startTime, acc) === 1
    ) {
      return startTime;
    }
    return acc;
  }, periods.day.start);

  periodStart = closestPastTime;
  return periodStart;
}
periodStart = getPeriodStart(nowTime, startTimes);

// 3b. end time
// Put the end times into an array to loop through and compare
const endTimes = Object.values(periods).map((period) => period.end);

function getPeriodEnd(
  nowTime: Temporal.PlainTime,
  endTimes: Temporal.PlainTime[]
) {
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
  }, periods.day.end); // Start with the latest possible time (dayEnd) and find the earliest that's still after now

  // Update periodEnd to the closest future time
  periodEnd = closestFutureTime;
  return periodEnd;
}

// Update periodEnd to the closest future time
periodEnd = getPeriodEnd(nowTime, endTimes);

console.warn(`periodStart: ${periodStart.toString()}`);
console.warn(`periodEnd: ${periodEnd.toString()}`);

// set defaults for any unused variables below:
// let totalScale = 0;
// let availableScale = 0;
// let currentTime = 0;
// let actualTimeLeft = 0;

// totalScale = Temporal.Duration.from(periodStart.until(periodEnd)).total(
//   "seconds"
// );
// availableScale = Temporal.Duration.from(nowTime.until(periodEnd)).total(
//   "seconds"
// );

// const durationUntilPeriodEnd = getDurationUntilPlainTime(periodEnd);

// console.log(`Time until periodEnd: ${formattedDuration}`);

// let timeLeftDisplay = formatHMS(durationUntilPeriodEnd);

// function updateTimeLeftDisplay(displayTime: Temporal.Duration) {
//   timeLeftDisplay = formatDuration(displayTime);
//   document.getElementById("timeLeftDisplay")!.innerHTML = timeLeftDisplay;
// }

// function getNewTotalScale(nowTime: Temporal.PlainTime): number {
//   totalScale = Temporal.Duration.from(periodStart.until(periodEnd)).total(
//     "seconds"
//   );
//   // let's also round the available scale
//   availableScale = Temporal.Duration.from(nowTime.until(periodEnd))
//     .round({ smallestUnit: "seconds", roundingMode: "halfExpand" })
//     .total("seconds");
//   return totalScale;
// }
function getPeriodTotalDuration(
  periodStart: Temporal.PlainTime,
  periodEnd: Temporal.PlainTime
): Temporal.Duration {
  return periodStart.until(periodEnd);
}
function getPeriodRemainingDuration(
  nowTime: Temporal.PlainTime,
  periodEnd: Temporal.PlainTime
): Temporal.Duration {
  return nowTime.until(periodEnd);
}
const periodTotalDuration = getPeriodTotalDuration(periodStart, periodEnd);
// console.log(periodTotalDuration.hours);
const periodRemainingDuration = getPeriodRemainingDuration(nowTime, periodEnd);
// console.log(periodRemainingDuration.hours);

let timeLeftDisplay = formatDuration(periodRemainingDuration);

//TODO: You can ADD a "availableProportion" instead of replacing this one, so that you could show both available and remaining
const remainingProportion =
  (Temporal.Duration.from(periodRemainingDuration).total("seconds") /
    Temporal.Duration.from(periodTotalDuration).total("seconds")) *
  100;

// new function to update every 100 milliseconds using setTimeout. Will updateGauge, updateDisplayTimeLeft.
// using setTimeout, will not use setInterval
function refresh() {
  setTimeout(() => {
    const nowTime = Temporal.Now.zonedDateTimeISO().toPlainTime();
    // console.log("refreshing...");
    // let totalScale = getNewTotalScale(nowTime);
    //let periodStart = getPeriodStart(nowTime, startTimes); //don't need to get a new periodStart?
    let periodEnd = getPeriodEnd(nowTime, endTimes);
    // const durationUntilPeriodEnd = getDurationUntilPlainTime(periodEnd);
    const periodTotalDuration = getPeriodTotalDuration(periodStart, periodEnd);
    const periodRemainingDuration = getPeriodRemainingDuration(
      nowTime,
      periodEnd
    );
    // console.log(periodTotalDuration.hours);

    // updateTimeLeftDisplay(periodRemainingDuration);
    // timeLeftDisplay = formatDuration(periodRemainingDuration);
    document.getElementById("timeLeftDisplay")!.innerHTML = formatDuration(
      periodRemainingDuration
    );

    // console.log(totalScale, availableScale);
    // call updateGauge with totalScale and availableScale. Must use types for input parameters
    //    updateGauge(totalScale, availableScale);
    //TODO: You can ADD a "availableProportion" instead of replacing this one, so that you could show both available and remaining
    const remainingProportion =
      (Temporal.Duration.from(periodRemainingDuration).total("seconds") /
        Temporal.Duration.from(periodTotalDuration).total("seconds")) *
      100;
    const gauge = document.getElementById("timeGauge");
    gauge!.style.height = remainingProportion + "%";

    refresh();
  }, 200);
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div class="container">
    <p>Time Left</p>
    <div class="card">
      <div id="timeLeftContainer">
        <h1 id="timeLeftDisplay">${timeLeftDisplay}</h1>
      </div>
      <div id="timeGaugeContainer" style="width: 30px; height: 200px; background-color: #ddd; position: relative;">
      <div id="timeGauge" style="width: 100%; height: ${remainingProportion}%; background-color: #4CAF50; position: absolute; bottom: 0;"></div>
      </div>
      <p id="timeText"></p>

    </div>
  </div>
`;

//updateGauge(totalScale, availableScale);
refresh();
