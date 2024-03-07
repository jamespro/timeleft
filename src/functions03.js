function parseAndFilterEvents(items, periodStartTime, periodEndTime) {
  return items
    .map((event) => {
      return {
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
      };
    })
    .filter(
      (event) => event.end > periodStartTime && event.start < periodEndTime
    )
    .map((event) => {
      return {
        start: new Date(Math.max(event.start, periodStartTime)),
        end: new Date(Math.min(event.end, periodEndTime)),
      };
    })
    .sort((a, b) => a.start - b.start);
}

function mergeOverlappingEvents(events) {
  const mergedEvents = [];
  let lastEvent = null;
  // loop through all the events
  events.forEach((event) => {
    // if there is no last event or the current event starts after the last event ends
    if (!lastEvent || event.start > lastEvent.end) {
      // add the current event to the merged events
      mergedEvents.push(event);
      // update the last event to the current event
      lastEvent = event;
    } else if (event.end > lastEvent.end) {
      // else if the current event ends after the last event ends
      // then update the end time of the last event to the end time of the current event
      lastEvent.end = event.end;
    }
  });
  // return the merged events array
  return mergedEvents;
}

function calculateAvailableTime(periodStart, periodEnd, items) {
  const periodStartTime = new Date(periodStart);
  const periodEndTime = new Date(periodEnd);
  // NOTE: do I need to keep track of the duration in seconds?
  const periodDuration = (periodEndTime - periodStartTime) / (1000 * 60); // in minutes

  // why is this called "relevant" events?
  // because it only includes events that are in the period
  const relevantEvents = parseAndFilterEvents(
    items,
    periodStartTime,
    periodEndTime
  );
  // this function will merge overlapping events
  const mergedEvents = mergeOverlappingEvents(relevantEvents);

  // this function will calculate the duration of the merged events
  const eventDuration = mergedEvents.reduce((total, event) => {
    return total + (event.end - event.start) / (1000 * 60); // in minutes
  }, 0);

  // now we can calculate the available time
  const availableMinutes = periodDuration - eventDuration;
  return {
    hours: Math.floor(availableMinutes / 60),
    minutes: availableMinutes % 60,
  };
}

// Example usage with your provided event data
const periodStart = "2024-03-17T09:00:00-05:00"; // Sample periodday start time
const periodEnd = "2024-03-17T17:00:00-05:00"; // Sample periodday end time
const availableTime = calculateAvailableTime(
  periodStart,
  periodEnd,
  eventData.items
); // eventData should be your JSON data

console.log(
  `Available Time: ${availableTime.hours} hours, ${availableTime.minutes} minutes`
);
