import { Temporal } from "temporal-polyfill";
import { periods } from "./periods";
import { eventsDataJSON } from "./eventsdata";
// import "./style.css";

//For Fly.io, you can set environment variables through their web interface or CLI
//const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
//const clientSecret = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_SECRET;

//Where should we restrict to only today's events? (What if you want to work after midnight?)
// Storing data in LocalStorage
localStorage.setItem("eventsData", JSON.stringify(eventsDataJSON));
let eventsData: {
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
}[] = [];

// Retrieving data from LocalStorage
const retrievedDataJSON = localStorage.getItem("eventsData");
// Parse the string back to an object
if (retrievedDataJSON) {
  eventsData = JSON.parse(retrievedDataJSON);
}

// const eventsData = eventsDataJSON;
// if (eventsData.length === 0) {
//   console.log(eventsData);
// }

//NOTE: USE JavaScript Temporal API for all dates and calculations. USE Google Calendar API format for dates. USE ISO 8601 format for time.

//Functions for calculating time left

function formatDuration(duration: Temporal.Duration) {
  const hours = duration.hours.toString();
  const minutes = duration.minutes.toString().padStart(2, "0");
  const seconds = duration.seconds.toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

//NOTE: maybe the periods are also data to get from somewhere?

// 1. Set up defaults for the current time and time zone.
const now = Temporal.Now.zonedDateTimeISO();
const nowTime = now.toPlainTime();
const nowTimeZone = Temporal.Now.zonedDateTimeISO().timeZoneId;
console.info(`now: ${now}`);
console.info(`nowTime: ${nowTime}`);
console.info(`now time zone ID: ${nowTimeZone}`);

// 2. Set variables with values for the period start and end dates and times.

// Temporal APIexample how to adjust one specific time:
//periods.prime.end = periods.prime.end.add({ minutes: 8 });

let periodStart = periods.day.start;
let periodEnd = periods.day.end;

// 3. Pass the current period start and end times into the functions to calculate the next period start and end times.

// console.warn(`nowTime: ${nowTime.toString()}`);

// 3a. start time
// Put the start times into an array to loop through and compare
// use periods to get the start times for each period

const startTimes = Object.values(periods).map((period) => period.start);

// Update periodStart to the closest PAST time
function getPeriodStart(
  nowTime: Temporal.PlainTime,
  startTimes: Temporal.PlainTime[]
) {
  // console.log(startTimes);
  const closestPastTime = startTimes.reduce((acc, startTime) => {
    // If startTime is before nowTime and after the current closest time, update acc
    // If comparing to -1, then the first will be before the second
    if (
      Temporal.PlainTime.compare(startTime, nowTime) < 0 &&
      Temporal.PlainTime.compare(acc, startTime) < 0
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
    // If comparing to -1, then the first will be before the second
    if (
      Temporal.PlainTime.compare(nowTime, endTime) < 0 &&
      Temporal.PlainTime.compare(endTime, acc) < 0
    ) {
      return endTime;
    }
    return acc;
  }, periods.day.end); // Start with the latest possible time (dayEnd) and find the earliest that's still after now

  // Update periodEnd to the closest future time
  periodEnd = closestFutureTime;
  return periodEnd;
}

// Update periodEnd to the closest FUTURE time
periodEnd = getPeriodEnd(nowTime, endTimes);

console.warn(`periodStart: ${periodStart.toString()}`);
console.warn(`periodEnd: ${periodEnd.toString()}`);

function getPeriodTotalDuration(
  periodStart: Temporal.PlainTime,
  periodEnd: Temporal.PlainTime
): Temporal.Duration {
  return periodStart.until(periodEnd);
}

// function getPeriodRemainingDuration(
//   nowTime: Temporal.PlainTime,
//   periodEnd: Temporal.PlainTime
// ): Temporal.Duration {
//   return nowTime.until(periodEnd);
// }

function clipEvents(
  clipStart: Temporal.PlainTime,
  clipEnd: Temporal.PlainTime,
  eventsData: { start: Temporal.PlainTime; end: Temporal.PlainTime }[]
) {
  // console.log("unfiltered: ", eventsData);
  // console.table(
  //   eventsData.map((event) => ({
  //     Start: `${event.start.hour}:${event.start.minute}`,
  //     End: `${event.end.hour}:${event.end.minute}`,
  //   }))
  // );

  let result = eventsData
    .map((event) => {
      return {
        start: Temporal.PlainTime.from(event.start),
        end: Temporal.PlainTime.from(event.end),
      };
    })
    // clip the events to the period. If the start time is before the period start, set it to the period start. If the end time is after the period end, set it to the period end.
    .map((event) => {
      return {
        start:
          Temporal.PlainTime.compare(event.start, clipStart) < 0
            ? clipStart
            : event.start,
        end:
          Temporal.PlainTime.compare(event.end, clipEnd) > 0
            ? clipEnd
            : event.end,
      };
    })
    .sort((a, b) => Temporal.PlainTime.compare(a.start, b.start))
    // filter out the events that are not in the period
    .filter(
      (event) =>
        Temporal.PlainTime.compare(event.end, clipStart) > 0 &&
        Temporal.PlainTime.compare(event.start, clipEnd) < 0
    );

  // console.log("clippedEvents: ");
  // console.table(
  //   result.map((event) => ({
  //     Start: `${event.start.hour}:${event.start.minute}`,
  //     End: `${event.end.hour}:${event.end.minute}`,
  //   }))
  // );

  return result;
}

function mergeEvents(
  events: { start: Temporal.PlainTime; end: Temporal.PlainTime }[]
): { start: Temporal.PlainTime; end: Temporal.PlainTime }[] {
  const mergedEvents: { start: Temporal.PlainTime; end: Temporal.PlainTime }[] =
    [];
  let lastEvent: null | { start: Temporal.PlainTime; end: Temporal.PlainTime } =
    null;

  events.forEach((event) => {
    // if there is no last event or the current event starts after the last event ends
    if (
      !lastEvent ||
      Temporal.PlainTime.compare(event.start, lastEvent.end) > 0
    ) {
      // add the current event to the merged events
      mergedEvents.push(event);
      // update the last event to the current event
      lastEvent = event;
    } else if (Temporal.PlainTime.compare(event.end, lastEvent.end) > 0) {
      // else if the current event ends after the last event ends
      // then update the end time of the last event to the end time of the current event
      lastEvent.end = event.end;
    }
  });
  // console.log("mergedEvents: ");
  // console.table(
  //   mergedEvents.map((event) => ({
  //     Start: `${event.start.hour}:${event.start.minute}`,
  //     End: `${event.end.hour}:${event.end.minute}`,
  //   }))
  // );
  return mergedEvents;
}

function getPeriodAvailableDuration(
  nowTime: Temporal.PlainTime,
  periodEnd: Temporal.PlainTime,
  eventsData: {
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
  }[]
): Temporal.Duration {
  let remainingDuration = nowTime.until(periodEnd);
  // using EventsData
  // console.log("getperiodavailableduration:");
  // console.log(eventsData);
  // extract start and end times only, into PlainTime -- removes the date information
  // FIRST, need to filter out any events that are not the same day as the current period
  // FUTURE: DO WE INCLUDE DATE WHEN COMPARING? JUST USE ZonedDateTime FOR PeriodStart and PeriodEnd?

  // console.log("inside getPeriodAvailableDuration");
  // console.log(eventsData);
  const events = eventsData
    //this was comparing by TIME as well as DATE, so it was doing something unexpected... I switched to comparing by PlainDate, by adding ".toPlainDate()" and using Temporal.PlainDate.compare() -- if you want to switch it back.
    .filter(
      (event) =>
        Temporal.PlainDate.compare(
          Temporal.Instant.from(event.start.dateTime)
            .toZonedDateTime({
              timeZone: event.start.timeZone,
              calendar: "iso8601",
            })
            .toPlainDate(),
          now.toPlainDate()
        ) == 0 &&
        Temporal.PlainDate.compare(
          Temporal.Instant.from(event.end.dateTime)
            .toZonedDateTime({
              timeZone: event.end.timeZone,
              calendar: "iso8601",
            })
            .toPlainDate(),
          now.toPlainDate()
        ) == 0
    )
    .map((event) => {
      return {
        start: Temporal.PlainTime.from(event.start.dateTime),
        end: Temporal.PlainTime.from(event.end.dateTime),
      };
    });
  // console.log("filteredEvents: ");
  // console.table(
  //   events.map((event) => ({
  //     Start: `${event.start.hour}:${event.start.minute}`,
  //     End: `${event.end.hour}:${event.end.minute}`,
  //   }))
  // );

  // loop through eventsData to remove any events that end before the nowTime or start after the periodEnd. Then modify any events that start before the nowTime and change the start time to nowTime. Then modify any events that end after the periodEnd and change the end time to periodEnd. This will be "clippedEvents"
  let clippedEvents = clipEvents(nowTime, periodEnd, events);

  // now create a function "mergeEvents" to merge the clippedEvents so that no events overlap, into an array that can be used to calculate the unavailable time

  let mergedEvents = mergeEvents(clippedEvents);

  // so now we have "mergedEvents" that can be used to calculate the unavailable time as a Temporal.Duration

  // loop through mergedEvents to calculate the unavailable time as a Temporal.Duration; default value is 0 as a Duration
  let unavailableTime = mergedEvents.reduce(
    (acc, event) => {
      // console.log(Temporal.PlainTime.compare(nowTime, event.end));
      // only count events if the event end time is after the nowTime
      if (Temporal.PlainTime.compare(nowTime, event.end) < 0) {
        // add to the unavailable time: the duration of time from event start to the event end time
        return (acc = acc.add(event.end.since(event.start)));
      }
      return acc;
    },
    Temporal.Duration.from({
      seconds: 0,
    })
  );

  let availableTime = remainingDuration.subtract(unavailableTime);
  // console.log("remainingDuration: " + remainingDuration.toString());
  // console.log("unavailableTime: " + unavailableTime.toString());
  // console.log("availableTime: " + availableTime.toString());
  return availableTime;
}

const periodAvailableDuration = getPeriodAvailableDuration(
  nowTime,
  periodEnd,
  eventsData
);

const periodTotalDuration = getPeriodTotalDuration(periodStart, periodEnd);
//const periodRemainingDuration = getPeriodRemainingDuration(nowTime, periodEnd);

// let timeLeftDisplay = formatDuration(periodRemainingDuration);
let timeLeftDisplay = formatDuration(periodAvailableDuration);

//TODO: You can ADD a "availableProportion" instead of replacing this one, so that you could show both available and remaining
const remainingProportion =
  (Temporal.Duration.from(periodAvailableDuration).total("seconds") /
    Temporal.Duration.from(periodTotalDuration).total("seconds")) *
  100;

// new function to update every 100 milliseconds using setTimeout. Will update all the times and the UI elements
// using setTimeout, will not use setInterval
function refresh() {
  setTimeout(() => {
    const nowTime = Temporal.Now.zonedDateTimeISO().toPlainTime();
    const retrievedDataJSON = localStorage.getItem("eventsData");
    // Parse the string back to an object
    if (retrievedDataJSON) {
      eventsData = JSON.parse(retrievedDataJSON);
    }

    // console.log("refreshing...");
    // let periodStart = getPeriodStart(nowTime, startTimes); //don't need to get a new periodStart?
    let periodEnd = getPeriodEnd(nowTime, endTimes);
    const periodTotalDuration = getPeriodTotalDuration(periodStart, periodEnd);
    // *
    // console.log("periodTotalDuration: " + periodTotalDuration.toString());

    // const periodRemainingDuration = getPeriodRemainingDuration(
    //   nowTime,
    //   periodEnd
    // );
    // NOTE: DEBUG
    // console.log("inside refresh:");
    // console.log(eventsData);
    const periodAvailableDuration = getPeriodAvailableDuration(
      nowTime,
      periodEnd,
      eventsData
    );
    // *
    // console.log(
    //   "periodAvailableDuration: " + periodAvailableDuration.toString()
    // );
    document.getElementById("timeLeftDisplay")!.innerHTML = formatDuration(
      periodAvailableDuration
    );

    //TODO: You can ADD a "availableProportion" instead of replacing this one, so that you could show both available and remaining
    const remainingProportion =
      (Temporal.Duration.from(periodAvailableDuration).total("seconds") /
        Temporal.Duration.from(periodTotalDuration).total("seconds")) *
      100;
    const gauge = document.getElementById("timeGauge");
    gauge!.style.height = remainingProportion + "%";
    if (
      remainingProportion < 4 ||
      Temporal.Duration.from(periodAvailableDuration).total("minutes") < 10
    ) {
      gauge!.style.backgroundColor = "#990000";
    } else {
      gauge!.style.backgroundColor = "#4CAF50";
    }

    refresh();
  }, 200);
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div class="container">
    <p id="appTitle">Time Left</p>
    <h1 id="timeLeftDisplay">${timeLeftDisplay}</h1>
    <div id="timeGaugeContainer" style="width: 300px; height: 300px; background-color: #ddd; position: relative;">
      <div id="timeGauge" style="width: 100%; height: ${remainingProportion}%; background-color: #4CAF50; position: absolute; bottom: 0;"></div>
    </div>
    <p id="timeText"></p>
  </div>
`;

refresh();
