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

function calculateAvailableTime(workStart, workEnd, events, currentTimeStr) {
  let workStartTime = parseDateTime(workStart);
  let workEndTime = parseDateTime(workEnd);
  let currentTime = parseDateTime(currentTimeStr);
  let totalWorkMinutes = (workEndTime - workStartTime) / (1000 * 60);
  let remainingWorkMinutes =
    workEndTime > currentTime ? (workEndTime - currentTime) / (1000 * 60) : 0;

  let eventTimes = events
    .map((event) => ({
      start: Math.max(parseDateTime(event.start.dateTime), workStartTime),
      end: Math.min(parseDateTime(event.end.dateTime), workEndTime),
    }))
    .filter((event) => event.end > event.start); // Filter out events outside the workday

  let mergedEvents = mergeEvents(eventTimes.sort((a, b) => a.start - b.start));

  let totalEventMinutes = mergedEvents.reduce(
    (acc, event) => acc + (event.end - event.start) / (1000 * 60),
    0
  );

  let availableMinutes = totalWorkMinutes - totalEventMinutes;
  let remainingAvailableMinutes = Math.max(
    0,
    remainingWorkMinutes - totalEventMinutes
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
let workStart = "2024-03-17T09:00:00-05:00"; // Workday start
let workEnd = "2024-03-17T17:00:00-05:00"; // Workday end
let currentTimeStr = new Date().toISOString(); // Current time in ISO format

let eventsData = {
  items: [
    // ... include your events here
  ],
};

let availableTimes = calculateAvailableTime(
  workStart,
  workEnd,
  eventsData.items,
  currentTimeStr
);
console.log(
  `Available Time: ${availableTimes.availableTime.hours} hours, ${availableTimes.availableTime.minutes} minutes`
);
console.log(
  `Remaining Available Time: ${availableTimes.remainingAvailableTime.hours} hours, ${availableTimes.remainingAvailableTime.minutes} minutes`
);
