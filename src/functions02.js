function mergeMeetings(meetings) {
  // Sort meetings by start time
  meetings.sort((a, b) => a.start - b.start);

  const merged = [];
  for (let meeting of meetings) {
    // If the list of merged meetings is empty or if the current
    // meeting does not overlap with the previous, simply append it.
    if (!merged.length || merged[merged.length - 1].end < meeting.start) {
      merged.push(meeting);
    } else {
      // Otherwise, there is an overlap, so we merge the current and previous
      // meetings by updating the end time of the last merged meeting to the
      // later of the two end times.
      merged[merged.length - 1].end = Math.max(
        merged[merged.length - 1].end,
        meeting.end
      );
    }
  }
  return merged;
}

function calculateAvailableTime(periodStart, periodEnd, meetings) {
  // Convert thisperiod start and end to minutes
  const thisperiodStart = periodStart.hour * 60 + periodStart.minute;
  const thisperiodEnd = periodEnd.hour * 60 + periodEnd.minute;
  const thisperiodDuration = thisperiodEnd - thisperiodStart;

  // Normalize and merge meetings
  const normalizedMeetings = meetings.map((meeting) => ({
    start: Math.max(
      thisperiodStart,
      meeting.start.hour * 60 + meeting.start.minute
    ),
    end: Math.min(thisperiodEnd, meeting.end.hour * 60 + meeting.end.minute),
  }));
  const mergedMeetings = mergeMeetings(normalizedMeetings);

  // Calculate the total duration of meetings
  const totalMeetingDuration = mergedMeetings.reduce(
    (total, meeting) => total + (meeting.end - meeting.start),
    0
  );

  // Subtract total meeting duration from thisperiod duration to get available time
  return thisperiodDuration - totalMeetingDuration;
}

// Example usage
const periodStart = { hour: 9, minute: 0 };
const periodEnd = { hour: 17, minute: 0 };
const meetings = [
  { start: { hour: 8, minute: 30 }, end: { hour: 10, minute: 30 } },
  { start: { hour: 11, minute: 0 }, end: { hour: 12, minute: 0 } },
  { start: { hour: 14, minute: 30 }, end: { hour: 15, minute: 30 } },
  { start: { hour: 15, minute: 0 }, end: { hour: 16, minute: 0 } },
];

const availableTime = calculateAvailableTime(periodStart, periodEnd, meetings);
console.log(`Available time in minutes: ${availableTime}`); // Outputs the available time in minutes
