function calculateFreeTimes(workStart, workEnd, meetings, currentTime) {
  // Clip meetings to workday boundaries and merge overlaps
  const clippedMeetings = meetings.map((meeting) => ({
    start: Math.max(workStart, meeting.start),
    end: Math.min(workEnd, meeting.end),
  }));
  const mergedMeetings = mergeMeetings(clippedMeetings);

  // Calculate total meeting duration within the workday
  const totalMeetingTime = mergedMeetings.reduce(
    (acc, meeting) => acc + (meeting.end - meeting.start),
    0
  );

  // Calculate total workday duration
  const totalWorkdayTime = workEnd - workStart;

  // Calculate total free time in the workday
  const totalFreeTime = totalWorkdayTime - totalMeetingTime;

  // Adjust work start time based on current time for remaining free time calculation
  const effectiveWorkStart = Math.max(workStart, currentTime);

  // Calculate total meeting time after the current time
  const remainingMeetingTime = mergedMeetings.reduce((acc, meeting) => {
    if (meeting.start >= effectiveWorkStart) {
      return acc + (meeting.end - meeting.start);
    }
    return acc;
  }, 0);

  // Calculate remaining workday duration from current time
  const remainingWorkdayTime = workEnd - effectiveWorkStart;

  // Calculate remaining free time in the workday
  const remainingFreeTime = Math.max(
    0,
    remainingWorkdayTime - remainingMeetingTime
  ); // Ensure non-negative result

  // Return both total and remaining free times
  return {
    totalFreeTime,
    remainingFreeTime,
  };
}

// Example usage
const workStart = 9 * 60; // 9:00 AM in minutes
const workEnd = 17 * 60; // 5:00 PM in minutes
const currentTime = getMinutesSinceMidnight(new Date()); // Current time in minutes since midnight

// Convert event data to meeting objects with start and end times in minutes
const meetings = eventData.map((event) => {
  const start = new Date(
    parseDateTime(event.start.dateTime, event.start.timeZone)
  );
  const end = new Date(parseDateTime(event.end.dateTime, event.end.timeZone));
  return {
    start: getMinutesSinceMidnight(start),
    end: getMinutesSinceMidnight(end),
  };
});

const { totalFreeTime, remainingFreeTime } = calculateFreeTimes(
  workStart,
  workEnd,
  meetings,
  currentTime
);
console.log(
  `Total free time: ${totalFreeTime} minutes, Remaining free time: ${remainingFreeTime} minutes`
);
