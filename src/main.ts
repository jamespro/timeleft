import "@js-temporal/polyfill";
import "./style.css";
import { setupCounter } from "./counter.ts";
console.warn(`quick goals:`);
console.warn(`quick goals:`);
console.warn(` get a number for "time" that we can work with`);

let actualTimeLeft = 123;

// 2024-02-25T00:00:01-05:00
const datePart = "2024-02-27";
const datePartNextday = "2024-02-28";

const dayStart = new Date(`${datePart}T00:00:01-05:00`); // Start of the day on Feb 17, 2024, in EST
const dayEnd = new Date(`${datePart}T23:59:59-05:00`); // End of the day on Feb 17, 2024, in EST
const workdayStart = new Date(`${datePart}T09:00:00-05:00`); // Start of the workday on Feb 17, 2024, in EST
const workdayEnd = new Date(`${datePart}T17:00:00-05:00`); // End of the workday on Feb 17, 2024, in EST
const earlyStart = new Date(`${datePart}T07:00:00-05:00`); // Start of late on Feb 17, 2024, in EST
const earlyEnd = workdayEnd;
const lateStart = workdayEnd; // Start of late on Feb 17, 2024, in EST
const lateEnd = new Date(`${datePart}T21:00:00-05:00`); // End of late on Feb 17, 2024, in EST

const event1Start = new Date(`${datePart}T10:00:00.000-05:00`); // 10 AM EST
const event1End = new Date(`${datePart}T11:00:00.000-05:00`); // 11 AM EST
const event2Start = new Date(`${datePart}T16:30:00.000-05:00`); // 9 AM EST the next day
const event2End = new Date(`${datePart}T17:30:00.000-05:00`); // 9 AM EST the next day
const event3Start = new Date(`${datePartNextday}T09:00:00.000-05:00`); // 9 AM EST the next day
const event3End = new Date(`${datePartNextday}T10:00:00.000-05:00`); // 9 AM EST the next day

const timeNow = new Date();

let periodStart = dayStart;
let periodEnd = dayEnd;

if (timeNow > earlyStart) {
  periodStart = earlyStart;
  periodEnd = earlyEnd;
}

if (timeNow > workdayStart) {
  periodStart = workdayStart;
  periodEnd = workdayEnd;
}

if (timeNow > lateStart) {
  periodStart = lateStart;
  periodEnd = lateEnd;
}

if (timeNow > lateEnd) {
  periodStart = lateEnd;
  periodEnd = dayEnd;
}

console.warn("if now is > periodStart, then periodStart = now");
//TODO: WAIT, IS THIS WRONG? "if now is > periodStart, then periodStart = now" THIS IS SUPPOSED TO BE THE MAX TIME, or
//NOTE: WHAT REPRESENTS THE MAX TIME? ohhhhh "Scale"?
//NOTE: Oh, maybe this is okay because then the "period" is just from this minute to the end of the "day"
if (timeNow > periodStart) {
  periodStart = timeNow;
}

console.warn(
  `- [ ] how much time between workdayStart and workdayEnd = workdayTime = totalTime?`
);

const totalTime = periodEnd.getTime() - periodStart.getTime();
console.log(`=> totalTime: ${totalTime}`);
// const totalTime = periodEnd - periodStart;
// console.log(`=> totalTime: ${totalTime}`);

console.warn(
  `- [x] how much time between event1Start and event1End = event1Time = unavailableTime?`
);
const unavailableTime = event1End - event1Start;
console.log(`=> unavailableTime: ${unavailableTime}`);

console.warn(`- [x] -- figure out when any event overlaps start / end times`);

console.warn(` subtract unavailableTime from totalTime = availableTime?`);
const availableTime = totalTime - unavailableTime;
console.log(`=> availableTime: ${Math.round(availableTime / 60 / 1000)}`);

console.warn(
  `- [ ] -- multiple events... what format? (ical is more common) format and example code for multiple events`
);

console.warn(`- [ ] -- add up all the unavailable times, all the events`);

console.warn(`- [ ] -- figure out when any event overlaps start / end times`);

// Did one event start after another?
if (event1Start > event2Start) {
  console.log("Event 1 starts after Event 2");
} else {
  console.log("Event 1 starts before or at the same time as Event 2");
}

// Did one event end before another?
if (event1End < event2End) {
  console.log("Event 1 ends before Event 2");
} else {
  console.log("Event 1 ends after or at the same time as Event 2");
}

// If an event started before a certain date/time but ended after that date/time, calculate elapsed minutes
//const certainDateTime = new Date("2024-02-17T11:00:00.000-05:00"); // A certain time in EST
let certainDateTime = workdayStart;
const elapsed = (event1End - certainDateTime) / (1000 * 60); // Convert milliseconds to minutes
if (event1Start < certainDateTime && event1End > certainDateTime) {
  console.log(`Elapsed minutes after certain date/time: ${elapsed}`);
} else {
  console.log(`Elapsed minutes after certain date/time: ${elapsed}`);
}

actualTimeLeft = Math.round(availableTime / 60 / 1000);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div>
    <p>Time Left Today</p>
    <!-- <div class="card">
      <button id="counter" type="button"></button>
    </div> -->
    <div class="card">
      <h4>${periodStart} - ${periodEnd}</h4>
      <h4>NEXT THING STARTS AT WHEN??:</h4>
      <h4>${actualTimeLeft}</h4>
      <p class="footer-text">
        Don't let your dreams be dreams
      </p>
    </div>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
