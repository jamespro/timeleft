import "./style.css";

// 1. Events data: JSON array of events. Use the Google Calendar API as an example for sample data. Must contain 9 events. One event must start and end at the same time. One event must start before the period and end within the period. One event must start and end after the period. One event must be within the period. One event must overlap with the period end. One event must overlap with another event. Every event must start on March 5, 2024.

// 2. Events data: Fetch events. Currently coming from Google Calendar API.
// 3. Truncate event times: Ensure all event times are clipped to the period's start and end bounaries. If an event starts before the period, change it to start at the period's start. If an event ends after the period, change it to end at the period's end.
// 4. Merge overlapping events: Combine events that overlap into a single event to avoid double counting.
// 5. Calculate total unavailable time: calculate the total duration of all (merged) events.
// 6. Calculate available time: subtract the total unavailable time from the total time in the period.

// Types of periods. Each period must include a start time and end time during the same 24 hours.
// early
// prime
// late

// Task 1. display current date and time. set a javascript variable with date and time to output in the HTML.
// Task 2. display time of next event.

const currentDate = new Date();
const currentMonth = currentDate.getMonth().toString().padStart(2, "0");
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

console.log(datePart);
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

let actualTimeLeft = 123; //set a default value

console.log(periodStart);
console.log(periodEnd);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div>
    <p>Time Left Today</p>
    <p>Time Now: ${currentTime}</p>
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
