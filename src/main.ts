import { Temporal } from "temporal-polyfill";
import "./style.css";

//NOTE: USE JavaScript Temporal API for all dates and calculations. USE Google Calendar API format for dates. USE ISO 8601 format for time.

//Functions for calculating time left
function getDurationUntilPlainTime(time: Temporal.PlainTime): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = Temporal.Now.plainTimeISO();

  let difference = time.since(now);

  return {
    hours: difference.hours,
    minutes: difference.minutes,
    seconds: difference.seconds,
  };
}

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

// this was doing weird things when the minutes or seconds is zero: not showing the colon after minutes, not showing the minutes...
function formatTimeLeft(duration: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  return `${
    duration.hours > 0
      ? `${duration.hours}${
          duration.minutes > 0 || duration.seconds > 0 ? ":" : ":"
        }`
      : ""
  }${
    duration.minutes > 0
      ? `${duration.minutes.toString().padStart(2, "0")}${
          duration.seconds > 0 ? ":" : ":"
        }`
      : ""
  }${duration.seconds.toString().padStart(2, "0")}`;
}

function updateGauge(totalScale: number, availableScale: number) {
  const proportion = (availableScale / totalScale) * 100;
  const gauge = document.getElementById("timeGauge");
  gauge!.style.height = proportion + "%";

  // Update text to show the exact time available/total
  const text = `${availableScale} seconds available of ${totalScale} total seconds`;
  document.getElementById("timeText")!.innerText = text;
}

// 0. GET DATA: Set up a JSON object for sample events data. each event will have a start and end time. the start and end times will be in the same day.
//NOTE: maybe the periods are also data to get from somewhere?

const eventsDataJSON = [
  {
    start: {
      dateTime: "2024-03-24T08:30:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T10:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-24T09:30:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T11:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-24T12:00:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T13:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-24T14:00:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T15:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-24T16:30:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T17:30:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-24T18:00:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T19:00:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-24T20:30:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T21:30:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-24T22:00:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T22:29:00-05:00",
      timeZone: "America/New_York",
    },
  },
  {
    start: {
      dateTime: "2024-03-24T22:55:00-05:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2024-03-24T22:57:00-05:00",
      timeZone: "America/New_York",
    },
  },
];

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

// refactor the start times into an object. put the actual times into the object definition, so I can replace the code above:
const periods = {
  day: {
    start: Temporal.PlainTime.from("00:00:00"),
    end: Temporal.PlainTime.from("23:59:59"),
  },
  early: {
    start: Temporal.PlainTime.from("07:00:00"),
    end: Temporal.PlainTime.from("08:59:59"),
  },
  prime: {
    start: Temporal.PlainTime.from("09:00:00"),
    end: Temporal.PlainTime.from("17:00:00"),
  },
  late: {
    start: Temporal.PlainTime.from("17:00:00"),
    end: Temporal.PlainTime.from("22:59:59"),
  },
};

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

// create a new object based on the eventsDataJSON data,  with only the start and end times. Use Temporal API to put them into a PlainTime format.
const eventsData: { start: Temporal.PlainTime; end: Temporal.PlainTime }[] =
  eventsDataJSON.map((event) => {
    return {
      start: Temporal.PlainTime.from(event.start.dateTime),
      end: Temporal.PlainTime.from(event.end.dateTime),
    };
  });

function clipEvents(
  periodStart: Temporal.PlainTime,
  periodEnd: Temporal.PlainTime,
  eventsData: { start: Temporal.PlainTime; end: Temporal.PlainTime }[]
) {
  return eventsData
    .map((event) => {
      return {
        start: Temporal.PlainTime.from(event.start),
        end: Temporal.PlainTime.from(event.end),
      };
    })
    .filter(
      (event) =>
        Temporal.PlainTime.compare(event.end, periodStart) > 0 &&
        Temporal.PlainTime.compare(event.start, periodEnd) < 0
    )
    .map((event) => {
      return {
        start:
          Temporal.PlainTime.compare(event.start, periodStart) <= 0
            ? event.start
            : periodStart,
        end:
          Temporal.PlainTime.compare(event.end, periodEnd) >= 0
            ? event.end
            : periodStart,
      };
    })
    .sort((a, b) => Temporal.PlainTime.compare(a.start, b.start));
}

let clippedEvents = clipEvents(periodStart, periodEnd, eventsData);

function mergeOverlappingEvents(
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
  // return the merged events array
  return mergedEvents;
}

let mergedEvents = mergeOverlappingEvents(clippedEvents);

// const eventDuration = mergedEvents.reduce((total, event) => {
//   return total + (event.end - event.start) / (1000 * 60); // in minutes
// }, 0);

function getEventsDuration(
  mergedEvents: {
    start: Temporal.PlainTime;
    end: Temporal.PlainTime;
  }[]
): number {
  return mergedEvents.reduce((total, event) => {
    return total + event.end.since(event.start).total("seconds");
    // return total + (event.end - event.start) / (1000 * 60); // in minutes
  }, 0);
}

// set defaults for any unused variables below:
let totalScale: number = 0;
let availableScale: number = 0;

totalScale = Temporal.Duration.from(periodStart.until(periodEnd)).total(
  "seconds"
);
availableScale = Temporal.Duration.from(nowTime.until(periodEnd)).total(
  "seconds"
);

const durationUntilPeriodEnd = getDurationUntilPlainTime(periodEnd);

// console.log(`Time until periodEnd: ${formattedDuration}`);

let timeLeftDisplay = formatDuration(durationUntilPeriodEnd);

function updateTimeLeftDisplay(durationUntilPeriodEnd: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  timeLeftDisplay = formatDuration(durationUntilPeriodEnd);
  document.getElementById("timeLeftDisplay")!.innerHTML = timeLeftDisplay;
}

function getNewTotalScale(nowTime: Temporal.PlainTime): number {
  totalScale = Temporal.Duration.from(periodStart.until(periodEnd)).total(
    "seconds"
  );
  // let's also round the available scale
  availableScale = Temporal.Duration.from(nowTime.until(periodEnd))
    .round({ smallestUnit: "seconds", roundingMode: "halfExpand" })
    .total("seconds");
  return totalScale;
}

// new function to update every 100 milliseconds using setTimeout. Will updateGauge, updateDisplayTimeLeft.
// using setTimeout, will not use setInterval
function refresh() {
  setTimeout(() => {
    // console.log("refreshing...");
    const nowTime = Temporal.Now.zonedDateTimeISO().toPlainTime();
    //let periodStart = getPeriodStart(nowTime, startTimes); //don't need to get a new periodStart?
    let periodEnd = getPeriodEnd(nowTime, endTimes);
    // let totalScale = getNewTotalScale(nowTime);
    let totalScale = Temporal.Duration.from(periodStart.until(periodEnd)).total(
      "seconds"
    );
    // let's also round the available scale
    let availableScale = Temporal.Duration.from(nowTime.until(periodEnd))
      .round({ smallestUnit: "seconds", roundingMode: "halfExpand" })
      .total("seconds");

    const durationUntilPeriodEnd = getDurationUntilPlainTime(periodEnd);
    const eventsDuration = getEventsDuration(mergedEvents);
    // const availableDuration = durationUntilPeriodEnd - eventsDuration;
    // console.log(totalScale, availableScale);
    // update totalScale and availableScale to subtract eventsDuration
    // update eventsDurationDisplay to display eventsDuration
    document.getElementById("eventsDurationDisplay")!.innerHTML = `${
      availableScale - eventsDuration
    } seconds`;
    // from the gauge, reduce the time of the events during this period
    availableScale = availableScale - eventsDuration;
    updateGauge(totalScale, availableScale);

    // from the time display, reduce the time of the events during this period
    // durationUntilPeriodEnd = durationUntilPeriodEnd - eventsDuration;
    updateTimeLeftDisplay(durationUntilPeriodEnd);

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
      <div id="timeGaugeContainer" style="width: 60px; height: 200px; background-color: #ddd; position: relative;">
      <div id="timeGauge" style="width: 100%; background-color: #4CAF50; position: absolute; bottom: 0;"></div>
      </div>
      <p id="timeText"></p>
      <p id="eventsDurationDisplay"></p>
    </div>
  </div>
`;

updateGauge(totalScale, availableScale);
refresh();
