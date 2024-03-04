function parseAndFilterEvents(items, workStartTime, workEndTime) {
  return items
    .map((event) => {
      return {
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
      };
    })
    .filter((event) => event.end > workStartTime && event.start < workEndTime)
    .map((event) => {
      return {
        start: new Date(Math.max(event.start, workStartTime)),
        end: new Date(Math.min(event.end, workEndTime)),
      };
    })
    .sort((a, b) => a.start - b.start);
}

function mergeOverlappingEvents(events) {
  const mergedEvents = [];
  let lastEvent = null;

  events.forEach((event) => {
    if (!lastEvent || event.start > lastEvent.end) {
      mergedEvents.push(event);
      lastEvent = event;
    } else if (event.end > lastEvent.end) {
      lastEvent.end = event.end;
    }
  });

  return mergedEvents;
}

function calculateAvailableTime(workStart, workEnd, items) {
  const workStartTime = new Date(workStart);
  const workEndTime = new Date(workEnd);
  const workDuration = (workEndTime - workStartTime) / (1000 * 60); // in minutes

  const relevantEvents = parseAndFilterEvents(
    items,
    workStartTime,
    workEndTime
  );
  const mergedEvents = mergeOverlappingEvents(relevantEvents);

  const eventDuration = mergedEvents.reduce((total, event) => {
    return total + (event.end - event.start) / (1000 * 60); // in minutes
  }, 0);

  const availableMinutes = workDuration - eventDuration;
  return {
    hours: Math.floor(availableMinutes / 60),
    minutes: availableMinutes % 60,
  };
}

// Example usage with your provided event data
const workStart = "2024-03-17T09:00:00-05:00"; // Sample workday start time
const workEnd = "2024-03-17T17:00:00-05:00"; // Sample workday end time
const availableTime = calculateAvailableTime(
  workStart,
  workEnd,
  eventData.items
); // eventData should be your JSON data

console.log(
  `Available Time: ${availableTime.hours} hours, ${availableTime.minutes} minutes`
);
