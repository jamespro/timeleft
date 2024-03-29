// list of functions:
// parseDateTime
// mergeEvents
// calculateAvailableTime

// outline what calculateAvailableTime does
// it takes in a period start, end, and an array of events
// it returns the amount of time available in minutes
// what other functions does calculateAvailableTime depend on?
// it depends on parseDateTime
// it depends on mergeEvents
// it depends on calculateAvailableTime

function parseDateTime(dateTimeStr) {
  return new Date(dateTimeStr);
}

function mergeEvents(events) {
  if (!events.length) return [];

  let merged = [];
  let last = events[0];

  for (let i = 1; i < events.length; i++) {
    if (events[i].start <= last.end) {
      last.end = new Date(Math.max(last.end, events[i].end));
    } else {
      merged.push(last);
      last = events[i];
    }
  }
  merged.push(last);
  return merged;
}

function calculateAvailableTime(
  periodStart,
  periodEnd,
  events,
  currentTimeStr
) {
  let periodStartTime = parseDateTime(periodStart);
  let periodEndTime = parseDateTime(periodEnd);
  let currentTime = parseDateTime(currentTimeStr);
  let totalPeriodMinutes = (periodEndTime - periodStartTime) / (1000 * 60);
  let remainingPeriodMinutes =
    periodEndTime > currentTime
      ? (periodEndTime - currentTime) / (1000 * 60)
      : 0;

  let eventTimes = events
    .map((event) => ({
      start: Math.max(parseDateTime(event.start.dateTime), periodStartTime),
      end: Math.min(parseDateTime(event.end.dateTime), periodEndTime),
    }))
    .filter((event) => event.end > event.start); // Filter out events outside the periodday

  let mergedEvents = mergeEvents(eventTimes.sort((a, b) => a.start - b.start));

  let totalEventMinutes = mergedEvents.reduce(
    (acc, event) => acc + (event.end - event.start) / (1000 * 60),
    0
  );

  let availableMinutes = totalPeriodMinutes - totalEventMinutes;
  let remainingAvailableMinutes = Math.max(
    0,
    remainingPeriodMinutes - totalEventMinutes
  );

  return {
    availableTime: {
      hours: Math.floor(availableMinutes / 60),
      minutes: availableMinutes % 60,
    },
    remainingAvailableTime: {
      hours: Math.floor(remainingAvailableMinutes / 60),
      minutes: remainingAvailableMinutes % 60,
    },
  };
}

// Example usage:
let periodStart = "2024-03-17T09:00:00-05:00"; // Periodday start
let periodEnd = "2024-03-17T17:00:00-05:00"; // Periodday end
let currentTimeStr = new Date().toISOString(); // Current time in ISO format

let eventsData = {
  items: [
    // ... include your events here
  ],
};

let availableTimes = calculateAvailableTime(
  periodStart,
  periodEnd,
  eventsData.items,
  currentTimeStr
);
console.log(
  `Available Time: ${availableTimes.availableTime.hours} hours, ${availableTimes.availableTime.minutes} minutes`
);
console.log(
  `Remaining Available Time: ${availableTimes.remainingAvailableTime.hours} hours, ${availableTimes.remainingAvailableTime.minutes} minutes`
);
