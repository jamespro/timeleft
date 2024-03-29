# Temporal API - JavaScript - cookbook - code examples

Frequently Asked Questions
These are some of the most common tasks that people ask questions about on StackOverflow with legacy Date. Here's how they would look using Temporal.

Current date and time
How to get the current date and time in the local time zone?

/\*\*

- Get the current date in JavaScript
- This is a popular question on Stack Overflow for dates in JS
- https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
- \*/

const date = Temporal.Now.plainDateISO(); // Gets the current date
date.toString(); // returns the date in ISO 8601 date format

// If you additionally want the time:
Temporal.Now.plainDateTimeISO().toString(); // date and time in ISO 8601 format
Note that if you just want the date and not the time, you should use Temporal.PlainDate. If you want both, use Temporal.PlainDateTime.

Unix timestamp
How to get a Unix timestamp?

/\*\*

- Get a (Unix) timestamp in JavaScript
- This is the No.1 voted question on Stack Overflow for dates in JS
- https://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
- \*/

const timeStamp = Temporal.Now.instant();

// Timestamp in Milliseconds
timeStamp.epochMilliseconds;
// Timestamp in Seconds
timeStamp.epochSeconds;
Converting between Temporal types and legacy Date
Legacy Date => Temporal.Instant and/or Temporal.ZonedDateTime
Here's how to convert legacy ECMAScript Date into a Temporal.Instant or Temporal.ZonedDateTime instance corresponding to the same instant in exact time.

const legacyDate = new Date('1970-01-01T00:00:01Z');
const instant = legacyDate.toTemporalInstant();

assert.equal(instant.epochMilliseconds, legacyDate.getTime());
assert.equal(instant.toString(), '1970-01-01T00:00:01Z');

// If you need a ZonedDateTime, use the toZonedDateTime() or
// toZonedDateTimeISO() method of the resulting Instant.
// You will need to specify a time zone, because legacy Date only
// stores an exact time, and does not store a time zone.

// When calling methods on a legacy Date instance, you must decide
// whether you want that exact time interpreted as a UTC value
// (using methods containing "UTC" in their names) or in the
// current system time zone (using other methods). This is
// confusing, so Temporal has a more explicit way to do this.

// To use the system's local time zone, which corresponds to using
// legacy Date's getFullYear(), getMonth(), etc. methods, pass
// Temporal.Now.timeZone() as the time zone. In a browser, this
// will be the user's time zone, but on a server the value may not
// be what you expect, so avoid doing this in a server context.

const zoned = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId());

assert.equal(zoned.epochMilliseconds, legacyDate.getTime());

// Here's an example of using a particular time zone. Especially
// in a server context, you would be getting this time zone from
// elsewhere in the data that you are processing.

const zoned2 = instant.toZonedDateTimeISO('Asia/Shanghai');

assert.equal(zoned2.epochMilliseconds, legacyDate.getTime());
assert.equal(zoned2.timeZoneId, 'Asia/Shanghai');

// (And if the legacy Date instance was accessed using the
// getUTCFullYear(), getUTCMonth(), etc. methods, consider just
// using Instant. If you have to use ZonedDateTime, the specific
// time zone may need to be 'UTC'.)
Date-only values: legacy Date => Temporal.PlainDate
A common bug arises from a simple question: what date (year, month, and day) is represented by this Date? The problem: the answer depends on the time zone. The same Date can be December 31 in San Francisco but January 1 in London or Tokyo.

Therefore, it's critical to interpret the Date in context of the correct time zone before trying to extract the year, month, or day, or before doing calculations like "did this happen yesterday?" involving date units. For this reason, Temporal.Instant (which is the Temporal equivalent of Date) does not have year, month, day properties. To access date or time units in Temporal, a time zone must be provided, as described in the code example above.

Another bug-prone case is when Date is (ab)used to store a date-only value, like a user's date of birth. With Date these values are typically stored with midnight times, but to read back the date correctly you need to know which time zone's midnight was used to create the Date. For example, new Date(2000, 0, 1) uses the caller's time zone, while new Date('2000-01-01') uses UTC.

To correctly convert a date-only Date to a Temporal.PlainDate without being vulnerable to off-by-one-day bugs, you must determine which time zone's midnight was used to construct the Date, and then use that same time zone when converting from Temporal.Instant to Temporal.PlainDate.

// Convert a year/month/day `Date` to a `Temporal.PlainDate`. Uses the caller's time zone.
let date = new Date(2000, 0, 1); // => Sat Jan 01 2000 00:00:00 GMT-0800 (Pacific Standard Time)
let plainDate = date
.toTemporalInstant() // => 2000-01-01T08:00:00Z
.toZonedDateTimeISO(Temporal.Now.timeZoneId()) // => 2000-01-01T00:00:00-08:00[America/Los_Angeles]
.toPlainDate(); // => 2000-01-01

assert.equal(plainDate.toString(), '2000-01-01');

// Convert a year/month/day `Date` to a `Temporal.PlainDate`. Uses UTC.
date = new Date(Date.UTC(2000, 0, 1)); // => Fri Dec 31 1999 16:00:00 GMT-0800 (Pacific Standard Time)
date = new Date('2000-01-01T00:00Z'); // => Fri Dec 31 1999 16:00:00 GMT-0800 (Pacific Standard Time)
plainDate = date
.toTemporalInstant() // => 2000-01-01T00:00:00Z
.toZonedDateTimeISO('UTC') // => 2000-01-01T00:00:00+00:00[UTC]
.toPlainDate(); // => 2000-01-01

assert.equal(plainDate.toString(), '2000-01-01');
Temporal types => legacy Date
Legacy Date represents an exact time, so it's straightforward to convert a Temporal.Instant or Temporal.ZonedDateTime instance into a legacy Date instance that corresponds to it.

// To convert Instant to legacy Date, use the epochMilliseconds property.

const instant = Temporal.Instant.from('2020-01-01T00:00:01.000999Z');
const result = new Date(instant.epochMilliseconds);

assert.equal(result.getTime(), 1577836801000); // ms since Unix epoch
assert.equal(result.toISOString(), '2020-01-01T00:00:01.000Z');

// Same thing for ZonedDateTime.
// Note that legacy Date will not preserve the ZonedDateTime's time zone.

const zoned = Temporal.ZonedDateTime.from('2020-01-01T00:00:01.001[Asia/Tokyo]');
const result2 = new Date(zoned.epochMilliseconds);

assert.equal(result2.getTime(), 1577804401001); // note, different time
assert.equal(result2.toISOString(), '2019-12-31T15:00:01.001Z');

// For most use cases, new Date(x.epochMilliseconds) is fine.
// You may need to add an extra round() step if you want other
// rounding behaviour than truncation. For example, here the 999
// microseconds is rounded to 1 millisecond.

const result3 = new Date(instant.round({ smallestUnit: 'millisecond' }).epochMilliseconds);

assert.equal(result3.getTime(), 1577836801001);
assert.equal(result3.toISOString(), '2020-01-01T00:00:01.001Z');
Construction
Time zone object from name
Temporal.TimeZone.from() can convert an IANA time zone name into a Temporal.TimeZone object, if you need to call Temporal.TimeZone methods. Usually this is not necessary.

// Construct a Temporal.TimeZone from an IANA name:
const tz = Temporal.TimeZone.from('Europe/London');

// Cast the timezone back to an IANA name, two ways:
tz.toString(); // Europe/London
tz.id; // Europe/London
Calendar input element
You can use Temporal objects to set properties on a calendar control. Here is an example using an HTML <input type="date"> element with any day beyond “today” disabled and not selectable.

03/28/2024
const datePicker = document.getElementById('calendar-input');
const today = Temporal.Now.plainDateISO();
datePicker.max = today;
datePicker.value = today;
Converting between types
Noon on a particular date
An example of combining a calendar date (Temporal.PlainDate) and a wall-clock time (Temporal.PlainTime) into a Temporal.PlainDateTime.

const date = Temporal.PlainDate.from('2020-05-14');

const noonOnDate = date.toPlainDateTime(Temporal.PlainTime.from({ hour: 12 }));

assert(noonOnDate instanceof Temporal.PlainDateTime);
assert.equal(noonOnDate.toString(), '2020-05-14T12:00:00');
Birthday in 2030
An example of combining a day on the calendar (Temporal.PlainMonthDay) and a year into a Temporal.PlainDate.

const birthday = Temporal.PlainMonthDay.from('12-15');

const birthdayIn2030 = birthday.toPlainDate({ year: 2030 });
birthdayIn2030.dayOfWeek; // => 7

assert(birthdayIn2030 instanceof Temporal.PlainDate);
assert.equal(birthdayIn2030.toString(), '2030-12-15');
Serialization
Zoned instant from instant and time zone
To serialize an exact-time Temporal.Instant into a string, use toString(). Without any arguments, this gives you a string in UTC time.

If you need your string to include a UTC offset, then use the timeZone option of Temporal.Instant.prototype.toString() which will return a string serialization of the wall-clock time in that time zone corresponding to the exact time.

This loses the information about which time zone the string was in, because it only preserves the UTC offset from the time zone at that particular exact time. If you need your string to include the time zone name, use Temporal.ZonedDateTime instead, which retains this information.

const instant = Temporal.Instant.from('2020-01-03T10:41:51Z');

const result = instant.toString();

assert.equal(result, '2020-01-03T10:41:51Z');
assert(instant.equals(Temporal.Instant.from(result)));

// Include the UTC offset of a particular time zone:

const result2 = instant.toString({ timeZone: 'America/Yellowknife' });

assert.equal(result2, '2020-01-03T03:41:51-07:00');
assert(instant.equals(Temporal.Instant.from(result2)));

// Include the UTC offset as well as preserving the time zone name:

const zoned = instant.toZonedDateTimeISO('Asia/Seoul');
const result3 = zoned.toString();

assert.equal(result3, '2020-01-03T19:41:51+09:00[Asia/Seoul]');
assert(instant.equals(Temporal.Instant.from(result3)));
assert(zoned.equals(Temporal.ZonedDateTime.from(result3)));
Sorting
Each Temporal type has a compare() static method, which can be passed to Array.prototype.sort() as the compare function in order to sort an array of Temporal types.

Sort PlainDateTime values
Sort a list of Temporal.PlainDateTimes, for example in order to get a conference schedule in the correct order. Sorting other Temporal types would work exactly the same way.

/\*\*

- getSortedLocalDateTimes will sort an array of zoneless Temporal.PlainDateTime instances by the
- corresponding local date and time of day (e.g., for building a conference schedule).
-
-
- @param {Temporal.PlainDateTime[]} dateTimes - This is a DateTime instance
- @param {boolean} [reverse=false] - Return in reversed order
- @returns {Temporal.PlainDateTime[]} the array from dateTimes, sorted
  \*/
  function getSortedLocalDateTimes(dateTimes, reverse = false) {
  let newDateTimes = Array.from(dateTimes).sort(Temporal.PlainDateTime.compare);

return reverse ? newDateTimes.reverse() : newDateTimes;
}

// Sorting some conferences without timezones for example vue.js Amsterdam 2020
let a = Temporal.PlainDateTime.from({
year: 2020,
day: 20,
month: 2,
hour: 8,
minute: 45
}); // Introduction
let b = Temporal.PlainDateTime.from({
year: 2020,
day: 21,
month: 2,
hour: 13,
minute: 10
}); // Lunch Break
let c = Temporal.PlainDateTime.from({
year: 2020,
day: 20,
month: 2,
hour: 15,
minute: 30
}); // Coffee Break
const results = getSortedLocalDateTimes([a, b, c]);
assert.deepEqual(
results.map((x) => x.toString()),
['2020-02-20T08:45:00', '2020-02-20T15:30:00', '2020-02-21T13:10:00']
);
Sort ISO date/time strings
Sort a list of ISO 8601 date/time strings, for example to place log entries in order.

/\*\*

- sortInstantStrings will sort an array of strings (each of which is
- parseable as a Temporal.Instant and may or may not include an IANA time
- zone name) by the corresponding exact time (e.g., for presenting global
- log events sequentially).
-
- @param {string[]} strings - an array of ISO strings
- @param {boolean} [reverse=false] - ascending or descending order
- @returns {string[]} the array from strings, sorted
  \*/
  function sortInstantStrings(strings, reverse = false) {
  const sortedInstants = strings
  .map((v) => [v, Temporal.Instant.from(v)])
  .sort(([, i1], [, i2]) => Temporal.Instant.compare(i1, i2))
  .map(([str]) => str);

return reverse ? sortedInstants.reverse() : sortedInstants;
}

// simple string comparison order would not be correct here:
const a = '2020-01-23T17:04:36.491865121-08:00';
const b = '2020-02-10T17:04:36.491865121-08:00';
const c = '2020-04-01T05:01:00-04:00[America/New_York]';
const d = '2020-04-01T10:00:00+01:00[Europe/London]';
const e = '2020-04-01T11:02:00+02:00[Europe/Berlin]';

const results = sortInstantStrings([a, b, c, d, e]);

// results will have correct order
assert.deepEqual(results, [
'2020-01-23T17:04:36.491865121-08:00',
'2020-02-10T17:04:36.491865121-08:00',
'2020-04-01T10:00:00+01:00[Europe/London]',
'2020-04-01T05:01:00-04:00[America/New_York]',
'2020-04-01T11:02:00+02:00[Europe/Berlin]'
]);
Rounding
Round a time down to whole hours
Use the round() method of each Temporal type if you want to round the time fields. Here's an example of rounding a time down to the previously occurring whole hour:

const time = Temporal.PlainTime.from('12:38:28.138818731');

const wholeHour = time.round({ smallestUnit: 'hour', roundingMode: 'floor' });

assert.equal(wholeHour.toString(), '12:00:00');
Round a date to the nearest start of the month
Rounding is only defined for time fields. Rounding a date field can be ambiguous, so date-only types such as Temporal.PlainDate don't have a round() method. If you need to round a date to the nearest month, for example, then you must explicitly pick what kind of rounding you want. Here is an example of rounding to the nearest start of a month, rounding up in case of a tie:

const date = Temporal.PlainDate.from('2018-09-16');

const firstOfCurrentMonth = date.with({ day: 1 });
const firstOfNextMonth = firstOfCurrentMonth.add({ months: 1 });

const sinceCurrent = date.since(firstOfCurrentMonth);
const untilNext = date.until(firstOfNextMonth);

const isCloserToNextMonth = Temporal.Duration.compare(sinceCurrent, untilNext) >= 0;
const nearestMonth = isCloserToNextMonth ? firstOfNextMonth : firstOfCurrentMonth;

assert.equal(nearestMonth.toString(), '2018-10-01');
See also Push back a launch date for an easier way to round up unconditionally to the next start of a month.

Time zone conversion
Preserving local time
Map a zoneless date and time of day into a Temporal.Instant instance at which the local date and time of day in a specified time zone matches it. This is easily done with dateTime.toZonedDateTime(timeZone).toInstant(), but here is an example of implementing different disambiguation behaviors than the 'compatible', 'earlier', 'later', and 'reject' ones built in to Temporal.

/\*\*

- Get an exact time corresponding with a calendar date / wall-clock time in a
- particular time zone, the same as Temporal.TimeZone.getInstantFor() or
- Temporal.PlainDateTime.toInstant(), but with more disambiguation options.
-
- As well as the default Temporal disambiguation options 'compatible',
- 'earlier', 'later', and 'reject', there are additional options possible:
-
- - 'clipEarlier': Equivalent to 'earlier' when turning the clock back, and
- when setting the clock forward returns the time just before the clock
- changes.
- - 'clipLater': Equivalent to 'later' when turning the clock back, and when
- setting the clock forward returns the exact time of the clock change.
-
- @param {Temporal.PlainDateTime} dateTime - Calendar date and wall-clock time to
- convert
- @param {Temporal.TimeZone} timeZone - Time zone in which to consider the
- wall-clock time
- @param {string} [disambiguation='earlier'] - Disambiguation mode, see description.
- @returns {Temporal.Instant} Absolute time in timeZone at the time of the
- calendar date and wall-clock time from dateTime
  \*/
  function getInstantWithLocalTimeInZone(dateTime, timeZone, disambiguation = 'earlier') {
  // Handle the built-in modes first
  if (['compatible', 'earlier', 'later', 'reject'].includes(disambiguation)) {
  return timeZone.getInstantFor(dateTime, { disambiguation });
  }

const possible = timeZone.getPossibleInstantsFor(dateTime);

// Return only possibility if no disambiguation needed
if (possible.length === 1) return possible[0];

switch (disambiguation) {
case 'clipEarlier':
if (possible.length === 0) {
const before = timeZone.getInstantFor(dateTime, { disambiguation: 'earlier' });
return timeZone.getNextTransition(before).subtract({ nanoseconds: 1 });
}
return possible[0];
case 'clipLater':
if (possible.length === 0) {
const before = timeZone.getInstantFor(dateTime, { disambiguation: 'earlier' });
return timeZone.getNextTransition(before);
}
return possible[possible.length - 1];
}
throw new RangeError(`invalid disambiguation ${disambiguation}`);
}

const germany = Temporal.TimeZone.from('Europe/Berlin');
const nonexistentGermanWallTime = Temporal.PlainDateTime.from('2019-03-31T02:45');

const germanResults = {
earlier: /\* _/ '2019-03-31T01:45:00+01:00',
later: /_ _/ '2019-03-31T03:45:00+02:00',
compatible: /_ _/ '2019-03-31T03:45:00+02:00',
clipEarlier: /_ _/ '2019-03-31T01:59:59.999999999+01:00',
clipLater: /_ \*/ '2019-03-31T03:00:00+02:00'
};
for (const [disambiguation, result] of Object.entries(germanResults)) {
assert.equal(
getInstantWithLocalTimeInZone(nonexistentGermanWallTime, germany, disambiguation).toString({ timeZone: germany }),
result
);
}

const brazilEast = Temporal.TimeZone.from('America/Sao_Paulo');
const doubleEasternBrazilianWallTime = Temporal.PlainDateTime.from('2019-02-16T23:45');

const brazilianResults = {
earlier: /\* _/ '2019-02-16T23:45:00-02:00',
later: /_ _/ '2019-02-16T23:45:00-03:00',
compatible: /_ _/ '2019-02-16T23:45:00-02:00',
clipEarlier: /_ _/ '2019-02-16T23:45:00-02:00',
clipLater: /_ \*/ '2019-02-16T23:45:00-03:00'
};
for (const [disambiguation, result] of Object.entries(brazilianResults)) {
assert.equal(
getInstantWithLocalTimeInZone(doubleEasternBrazilianWallTime, brazilEast, disambiguation).toString({
timeZone: brazilEast
}),
result
);
}
Preserving exact time
Map a zoned date and time of day into another zoned date and time of day in a target time zone at the corresponding exact time. This could be used when converting user-input date-time values between time zones.

const source = Temporal.ZonedDateTime.from('2020-01-09T00:00[America/Chicago]');

const result = source.withTimeZone('America/Los_Angeles');

// On this date, when it's midnight in Chicago, it's 10 PM the previous night in LA
assert.equal(result.toString(), '2020-01-08T22:00:00-08:00[America/Los_Angeles]');
Here is another example similar to the previous one, using the time zone for future events. The times and locations of a series of future meetings are stored as a pair of strings: one for the calendar date and wall-clock time, and one for the time zone. They cannot be stored as an exact time because between now and the time when the event happens, the time zone rules for daylight saving time could change — for example, Brazil abolished daylight saving time in 2019 — but the meeting would still be held at the same wall-clock time on that date. So if the time zone rules changed, the event's exact time would change.

This example calculates the starting times of all the Ecma TC39 meetings in 2019, in local time in Tokyo.

// Dates of the 2019 TC39 meetings:
const tc39meetings = [
{
dateTime: '2019-01-28T10:00',
timeZone: 'America/Phoenix'
},
{
dateTime: '2019-03-26T10:00',
timeZone: 'America/New_York'
},
{
dateTime: '2019-06-04T10:00',
timeZone: 'Europe/Berlin'
},
{
dateTime: '2019-07-23T10:00',
timeZone: 'America/Los_Angeles'
},
{
dateTime: '2019-10-01T10:00',
timeZone: 'America/New_York'
},
{
dateTime: '2019-12-03T10:00',
timeZone: 'America/Los_Angeles'
}
];

// To follow the meetings remotely from Tokyo, calculate the times you would
// need to join:
const localTimeZone = 'Asia/Tokyo';
const localTimes = tc39meetings.map(({ dateTime, timeZone }) => {
return Temporal.PlainDateTime.from(dateTime)
.toZonedDateTime(timeZone, { disambiguation: 'reject' })
.withTimeZone(localTimeZone)
.toPlainDateTime();
});

assert.deepEqual(
localTimes.map((dt) => dt.toString()),
[
'2019-01-29T02:00:00',
'2019-03-26T23:00:00',
'2019-06-04T17:00:00',
'2019-07-24T02:00:00',
'2019-10-01T23:00:00',
'2019-12-04T03:00:00'
]
);
Daily occurrence in local time
Similar to the previous recipe, calculate the exact times of a daily occurrence that happens at a particular local time in a particular time zone.

/\*\*

- Returns an iterator of the exact times corresponding to a daily occurrence
- starting on a particular date, and happening at a particular local time in a
- particular time zone.
-
- @param {Temporal.PlainDate} startDate - Starting date
- @param {Temporal.PlainTime} plainTime - Local time that event occurs at
- @param {string} timeZone - Time zone in which event is defined
  _/
  function_ calculateDailyOccurrence(startDate, plainTime, timeZone) {
  for (let date = startDate; ; date = date.add({ days: 1 })) {
  yield date.toZonedDateTime({ plainTime, timeZone }).toInstant();
  }
  }

// Daily meeting at 8 AM California time
const startDate = Temporal.PlainDate.from('2017-03-10');
const time = Temporal.PlainTime.from('08:00');
const timeZone = 'America/Los_Angeles';
const iter = calculateDailyOccurrence(startDate, time, timeZone);

assert.equal(iter.next().value.toString(), '2017-03-10T16:00:00Z');
assert.equal(iter.next().value.toString(), '2017-03-11T16:00:00Z');
// DST change:
assert.equal(iter.next().value.toString(), '2017-03-12T15:00:00Z');
assert.equal(iter.next().value.toString(), '2017-03-13T15:00:00Z');
UTC offset for a zoned event, as a string
Use Temporal.TimeZone.getOffsetStringFor() or Temporal.ZonedDateTime.offset to map a Temporal.Instant instance and a time zone into the UTC offset at that exact time in that time zone, as a string.

const instant = Temporal.Instant.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');

nyc.getOffsetStringFor(instant); // => '-05:00'

// Can also be done with ZonedDateTime.offset:
const source = instant.toZonedDateTimeISO(nyc);
source.offset; // => '-05:00'
UTC offset for a zoned event, as a number of seconds
Similarly, use Temporal.TimeZone.getOffsetNanosecondsFor() to do the same thing for the offset as a number of seconds. (Remember to divide by 109 to convert nanoseconds to seconds.)

const instant = Temporal.Instant.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');

nyc.getOffsetNanosecondsFor(instant) / 1e9; // => -18000
Offset between two time zones at an exact time
Also using Temporal.TimeZone.getOffsetNanosecondsFor(), we can map a Temporal.Instant instance and two time zones into the signed difference of UTC offsets between those time zones at that exact time, as a number of seconds.

/\*\*

- Returns the number of seconds' difference between the UTC offsets of two
- time zones, at an exact time
-
- @param {Temporal.Instant} instant - An exact time
- @param {Temporal.TimeZone} sourceTimeZone - A time zone to examine
- @param {Temporal.TimeZone} targetTimeZone - A second time zone to examine
- @returns {number} The number of seconds difference between the time zones'
- UTC offsets
  \*/
  function getUtcOffsetDifferenceSecondsAtInstant(instant, sourceTimeZone, targetTimeZone) {
  const sourceOffsetNs = sourceTimeZone.getOffsetNanosecondsFor(instant);
  const targetOffsetNs = targetTimeZone.getOffsetNanosecondsFor(instant);
  return (targetOffsetNs - sourceOffsetNs) / 1e9;
  }

const instant = Temporal.Instant.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');
const chicago = Temporal.TimeZone.from('America/Chicago');

// At this exact time, Chicago is 3600 seconds earlier than New York
assert.equal(getUtcOffsetDifferenceSecondsAtInstant(instant, nyc, chicago), -3600);
Dealing with dates and times in a fixed location
Here is an example of Temporal used in a graph, showing fictitious activity for a storage tank in a fixed location (Stockholm, Sweden). The graph always starts at midnight in the tank's location, but the graph labels are in the viewer's time zone.

// tankDataX and tankDataY are X and Y-axis data for the last 24 hours,
// obtained from elsewhere, e.g. const [tankDataX, tankDataY] = fetchData();
// tankDataX is an array of Temporal.Instant, and tankDataY is an array of numbers.

// Show data starting from the most recent midnight in the tank's location (Stockholm)
const tankTimeZone = 'Europe/Stockholm';
const labelFormatter = new Intl.DateTimeFormat(undefined, {
weekday: 'short',
hour: 'numeric',
minute: 'numeric',
timeZone: Temporal.Now.timeZoneId()
});
const browserCalendar = labelFormatter.resolvedOptions().calendar;
const tankMidnight = Temporal.Now.zonedDateTime(browserCalendar).withTimeZone(tankTimeZone).startOfDay().toInstant();
const atOrAfterMidnight = (x) => Temporal.Instant.compare(x, tankMidnight) >= 0;
const dataStartIndex = tankDataX.findIndex(atOrAfterMidnight);
const graphLabels = tankDataX.slice(dataStartIndex).map((x) => labelFormatter.format(x));
const graphPoints = tankDataY.slice(dataStartIndex);

const ctx = document.getElementById('storage-tank').getContext('2d');
// The graph is made with Chart.js (https://www.chartjs.org/)
new Chart(ctx, {
type: 'line',
data: {
labels: graphLabels,
datasets: [
{
label: 'Fill level',
data: graphPoints
}
]
},
options: {
title: {
display: true,
text: 'Stockholm storage tank'
},
scales: {
yAxes: [
{
ticks: {
beginAtZero: true
}
}
]
}
}
});
Book a meeting across time zones
Across the web there are several tools for finding meeting times that are appropriate for all the participants' time zones, such as World Time Buddy, World Clock Meeting Planner, and built into various calendar software.

Here (UTC-04:00) Mar 28 1 AM 2 AM 3 AM 4 AM 5 AM 6 AM 7 AM 8 AM 9 AM 10 AM 11 AM 12 PM 1 PM 2 PM 3 PM 4 PM 5 PM 6 PM 7 PM 8 PM 9 PM 10 PM 11 PM
New York (UTC-04:00) Mar 28 1 AM 2 AM 3 AM 4 AM 5 AM 6 AM 7 AM 8 AM 9 AM 10 AM 11 AM 12 PM 1 PM 2 PM 3 PM 4 PM 5 PM 6 PM 7 PM 8 PM 9 PM 10 PM 11 PM
London (UTC+00:00) 4 AM 5 AM 6 AM 7 AM 8 AM 9 AM 10 AM 11 AM 12 PM 1 PM 2 PM 3 PM 4 PM 5 PM 6 PM 7 PM 8 PM 9 PM 10 PM 11 PM Mar 29 1 AM 2 AM 3 AM
Tokyo (UTC+09:00) 1 PM 2 PM 3 PM 4 PM 5 PM 6 PM 7 PM 8 PM 9 PM 10 PM 11 PM Mar 29 1 AM 2 AM 3 AM 4 AM 5 AM 6 AM 7 AM 8 AM 9 AM 10 AM 11 AM 12 PM
// Display local time zone and three others
const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
const now = Temporal.Now.zonedDateTime(browserCalendar);
const timeZones = [
{ name: 'Here', tz: now.timeZoneId },
{ name: 'New York', tz: 'America/New_York' },
{ name: 'London', tz: 'Europe/London' },
{ name: 'Tokyo', tz: 'Asia/Tokyo' }
];

// Start the table at midnight local time
const startTime = now.startOfDay();

// Build the table
const table = document.getElementById('meeting-planner');
timeZones.forEach(({ name, tz }) => {
const row = document.createElement('tr');

const title = document.createElement('td');
const startTimeHere = startTime.withTimeZone(tz);
title.textContent = `${name} (UTC${startTimeHere.offset})`;
row.appendChild(title);

for (let hours = 0; hours < 24; hours++) {
const cell = document.createElement('td');

    const columnTime = startTimeHere.add({ hours });
    cell.className = `time-${columnTime.hour}`;

    // Highlight the current hour in each row
    if (hours === now.hour) cell.className += ' time-current';

    // Show the date in midnight cells
    let formatOptions;
    if (columnTime.hour === columnTime.startOfDay().hour) {
      formatOptions = { month: 'short', day: 'numeric' };
    } else {
      formatOptions = { hour: 'numeric' };
    }
    cell.textContent = columnTime.toLocaleString(undefined, formatOptions);
    row.appendChild(cell);

}

table.appendChild(row);
});
Arithmetic
How many days until a future date
An example HTML form inspired by Days Calculator on timeanddate.com:

Enter future date:
mm/dd/yyyy
Submit
// Form parameters
const params = new URL(document.location).searchParams;
const futuredateParam = params.get('futuredate');

// If you have Intl.DurationFormat, then you can do this with
// until.toLocaleString() and untilMonths.toLocaleString(). This
// example will be updated when that becomes possible. For now, we can
// generate the string only in English.
function englishPlural(n, singular, plural) {
return `${n} ${n === 1 ? singular : plural}`;
}

// When form data posted:
if (futuredateParam !== null) {
const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
const futureDate = Temporal.PlainDate.from(futuredateParam).withCalendar(browserCalendar);
const today = Temporal.Now.plainDate(browserCalendar);
const until = today.until(futureDate, { largestUnit: 'day' });
const untilMonths = until.round({ largestUnit: 'month', relativeTo: today });

const dayString = englishPlural(until.days, 'day', 'days');
const monthString =
`${englishPlural(untilMonths.months, 'month', 'months')}` +
(untilMonths.days !== 0 ? `, ${englishPlural(untilMonths.days, 'day', 'days')}` : '');

const results = document.getElementById('futuredate-results');
results.innerHTML = `   <p>From and including: <strong>${today.toLocaleString()}</strong></p>
    <p>To but not including: <strong>${futureDate.toLocaleString()}</strong></p>
    <h4>Result: ${dayString}</h4>
    <p>It is ${dayString} from the start date to the end date, but not
    including the end date.</p>
    <p>Or ${monthString} excluding the end date.</p>
`;
}
Unit-constrained duration between now and a past/future zoned event
Take the difference between two Temporal.Instant instances as a Temporal.Duration instance (positive or negative), representing the duration between the two instants without using units coarser than specified (e.g., for presenting a meaningful countdown with vs. without using months or days).

const result = Temporal.Instant.from('2020-01-09T04:00Z').since(Temporal.Instant.from('2020-01-09T00:00Z'), {
largestUnit: 'hour'
});
assert.equal(`${result}`, 'PT4H');

const result2 = Temporal.Instant.from('2020-01-09T00:00Z').until(Temporal.Instant.from('2020-01-09T04:00Z'), {
largestUnit: 'minute'
});
assert.equal(`${result2}`, 'PT240M');

// Example of using it in a countdown:

const duration = Temporal.Now.instant().until(Temporal.Instant.from('2020-04-01T13:00-07:00[America/Los_Angeles]'));
// Note that this does not work unless you have Intl.DurationFormat, which is
// still an early-stage proposal.
`It's ${duration.toLocaleString()} ${duration.sign < 0 ? 'until' : 'since'} the TC39 Temporal presentation`;
Nearest offset transition in a time zone
Map a Temporal.Instant instance and a Temporal.TimeZone object into a Temporal.Instant instance representing the nearest following exact time at which there is an offset transition in the time zone (e.g., for setting reminders).

/\*\*

- Get the nearest following exact time that the given time zone transitions
- to another UTC offset, inclusive or exclusive.
-
- @param {Temporal.Instant} instant - Starting exact time to consider
- @param {Temporal.TimeZone} timeZone - Time zone to consider
- @param {boolean} inclusive - Include the start time, or not
- @returns {(Temporal.Instant|null)} - Next UTC offset transition, or null if
- none known at this time
  \*/
  function getInstantOfNearestOffsetTransitionToInstant(instant, timeZone, inclusive) {
  let nearest;
  if (inclusive) {
  // In case instant itself is the exact time of a transition:
  nearest = timeZone.getNextTransition(instant.subtract({ nanoseconds: 1 }));
  } else {
  nearest = timeZone.getNextTransition(instant);
  }
  return nearest;
  }

const instant = Temporal.Instant.from('2019-04-16T21:01Z');

const nyc = Temporal.TimeZone.from('America/New_York');
const nextTransition = getInstantOfNearestOffsetTransitionToInstant(instant, nyc, false);
assert.equal(nextTransition.toString(), '2019-11-03T06:00:00Z');

// Inclusive
const sameTransition = getInstantOfNearestOffsetTransitionToInstant(nextTransition, nyc, true);
assert.equal(sameTransition.toString(), nextTransition.toString());

// No known future DST transitions in a time zone
const regina = Temporal.TimeZone.from('America/Regina');
assert.equal(getInstantOfNearestOffsetTransitionToInstant(instant, regina), null);
Comparison of an exact time to business hours
This example takes a roster of wall-clock opening and closing times for a business, and maps an exact time into a time-sensitive state indicator ("opening soon" vs. "open" vs. "closing soon" vs. "closed").

/\*\*

- Compare the given exact time to the business hours of a business located in
- a particular time zone, and return a string indicating whether the business
- is open, closed, opening soon, or closing soon. The length of "soon" can be
- controlled using the `soonWindow` parameter.
-
- @param {Temporal.ZonedDateTime} now - Date and Time at which to consider
- whether the business is open
- @param {(Object|null)[]} businessHours - Array of length 7 indicating
- business hours during the week
- @param {Temporal.PlainTime} businessHours[].open - Time at which the business
- opens
- @param {Temporal.PlainTime} businessHours[].close - Time at which the business
- closes
- @param {Temporal.Duration} soonWindow - Length of time before the opening
- or closing time during which the business should be considered "opening
- soon" or "closing soon"
- @returns {string} "open", "closed", "opening soon", or "closing soon"
  \*/
  function getBusinessOpenStateText(now, businessHours, soonWindow) {
  const compare = Temporal.ZonedDateTime.compare;
  function inRange(zdt, start, end) {
  return compare(zdt, start) >= 0 && compare(zdt, end) < 0;
  }

// Because of times wrapping around at midnight, we may need to consider
// yesterday's and tomorrow's hours as well
for (const delta of [-1, 0]) {
const openDate = now.toPlainDate().add({ days: delta });
// convert weekday (1..7) to 0-based index, for array:
const index = (openDate.dayOfWeek + 7) % 7;
if (!businessHours[index]) continue;

    const timeZone = now.timeZoneId;
    const { open: openTime, close: closeTime } = businessHours[index];
    const open = openDate.toZonedDateTime({ plainTime: openTime, timeZone });
    const isWrap = Temporal.PlainTime.compare(closeTime, openTime) < 0;
    const closeDate = isWrap ? openDate.add({ days: 1 }) : openDate;
    const close = closeDate.toZonedDateTime({ plainTime: closeTime, timeZone });

    if (inRange(now, open, close)) {
      return compare(now, close.subtract(soonWindow)) >= 0 ? 'closing soon' : 'open';
    }
    if (inRange(now.add(soonWindow), open, close)) return 'opening soon';

}
return 'closed';
}

// For example, a restaurant or bar might have opening hours that go past
// midnight; make sure this is handled correctly
const businessHours = [
/* Sun */ { open: Temporal.PlainTime.from('13:00'), close: Temporal.PlainTime.from('20:30') },
/* Mon */ null, // closed Mondays
/* Tue */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('20:30') },
/* Wed */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('20:30') },
/* Thu */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('22:00') },
/* Fri */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('00:00') },
/* Sat */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('02:00') }
];

const now = Temporal.ZonedDateTime.from('2019-04-07T00:00+02:00[Europe/Berlin]');
const soonWindow = Temporal.Duration.from({ minutes: 30 });
const saturdayNightState = getBusinessOpenStateText(now, businessHours, soonWindow);
assert.equal(saturdayNightState, 'open');

const lastCall = now.add({ hours: 1, minutes: 50 });
assert.equal(lastCall.toString(), '2019-04-07T01:50:00+02:00[Europe/Berlin]');
const lastCallState = getBusinessOpenStateText(lastCall, businessHours, soonWindow);
assert.equal(lastCallState, 'closing soon');

const tuesdayEarly = now.add({ days: 2, hours: 6 });
const tuesdayEarlyState = getBusinessOpenStateText(tuesdayEarly, businessHours, soonWindow);
assert.equal(tuesdayEarlyState, 'closed');
Flight arrival/departure/duration
Map localized trip departure and arrival times into trip duration in units no larger than hours. (By default, differences between ZonedDateTime instances are exact differences in time units.)

const departure = Temporal.ZonedDateTime.from('2020-03-08T11:55:00+08:00[Asia/Hong_Kong]');
const arrival = Temporal.ZonedDateTime.from('2020-03-08T09:50:00-07:00[America/Los_Angeles]');

const flightTime = departure.until(arrival);

assert.equal(flightTime.toString(), 'PT12H55M');
Given a departure time with time zone and a flight duration, get an arrival time in the destination time zone, using time zone-aware math.

const departure = Temporal.ZonedDateTime.from('2020-03-08T11:55:00+08:00[Asia/Hong_Kong]');
const flightTime = Temporal.Duration.from({ minutes: 775 });

const arrival = departure.add(flightTime).withTimeZone('America/Los_Angeles');

assert.equal(arrival.toString(), '2020-03-08T09:50:00-07:00[America/Los_Angeles]');
Push back a launch date
Add the number of days it took to get an approval, and advance to the start of the following month.

/\*\*

- Take a date, add a number of days' delay, and round to the start of the next
- month.
-
- @param {Temporal.PlainDate} date - Original date
- @param {number} delayDays - Number of days' delay
- @returns {Temporal.PlainDate} - Beginning of the next month after the delay
  \*/
  function plusAndRoundToMonthStart(date, delayDays) {
  return date
  .add({ days: delayDays })
  .add({ months: 1 }) // constrains to end of month if needed, e.g. Jan 31 -> Feb 28
  .with({ day: 1 });
  }

const oldLaunchDate = Temporal.PlainDate.from('2019-06-01');

const fifteenDaysDelay = plusAndRoundToMonthStart(oldLaunchDate, 15);
assert.equal(fifteenDaysDelay.toString(), '2019-07-01');

const sixtyDaysDelay = plusAndRoundToMonthStart(oldLaunchDate, 60);
assert.equal(sixtyDaysDelay.toString(), '2019-08-01');
Schedule a reminder ahead of matching a record-setting duration
When considering a record (for example, a personal-best time in a sport), you might want to receive an alert just before the record is about to be broken. This example takes a record as a Temporal.Duration, the starting exact time of the current attempt as a Temporal.Instant, and another Temporal.Duration indicating how long before the potentially record-setting exact time you would like to receive an alert. It returns the exact time at which a notification could be sent, for example "Keep going! 5 more minutes and it will be your personal best!"

This could be used for workout tracking, racing (including long and potentially time-zone-crossing races like the Bullrun Rally, Iditarod, Self-Transcendence 3100, and Clipper Round The World), or even open-ended analogs like event-every-day "streaks".

/\*\*

- Retrieve an exact time at which to give advance notice of a record that
- is potentially about to be broken.
-
- @param {Temporal.Instant} start - Starting exact time of the event
- @param {Temporal.Duration} previousRecord - Existing record to be broken
- @param {Temporal.Duration} noticeWindow - Advance notice time
- @returns {Temporal.Instant} Exact time at which to give advance notice of
- breaking the record
  \*/
  function getInstantBeforeOldRecord(start, previousRecord, noticeWindow) {
  return start.add(previousRecord).subtract(noticeWindow);
  }

// Start of the men's 10000 meters at the Rio de Janeiro 2016 Olympic Games
const raceStart = Temporal.Instant.from('2016-08-13T21:27-03:00[America/Sao_Paulo]');
// Kenenisa Bekele's world record set in 2005
const record = Temporal.Duration.from({ minutes: 26, seconds: 17, milliseconds: 530 });
const noticeWindow = Temporal.Duration.from({ minutes: 1 });
// Time to send a "hurry up, can you finish the race in 1 minute?" push
// notification to all the runners
const reminderAt = getInstantBeforeOldRecord(raceStart, record, noticeWindow);

assert.equal(reminderAt.toString(), '2016-08-14T00:52:17.53Z');
Nth weekday of the month
Example of getting a Temporal.PlainDate representing the first Tuesday of the given Temporal.PlainYearMonth, adaptable to other weekdays.

/\*\*

- Gets the first Tuesday of the month and returns its date
-
- @param {Temporal.PlainYearMonth} queriedMonth - YearMonth instance to query
- @returns {Temporal.PlainDate} Temporal.PlainDate Instance which gives first tuesday
  \*/
  function getFirstTuesday(queriedMonth) {
  // We first need to convert to a date
  const firstOfMonth = queriedMonth.toPlainDate({ day: 1 });

// We have Monday = 1, Sunday = 7, and we want to add a positive number
// smaller than 7 to get to the first Tuesday.
// If we're already on a Tuesday (2) then we want to add 0.
// So for the first of the month being a Monday through Sunday the additions are:
// 1, 0, 6, 5, 4, 3, 2 which is given by that formula.
// This lookup table makes this example easier to read, but you can also
// calculate the answer: (7 + desiredWeekday - firstOfMonth.dayOfWeek) % 7
return firstOfMonth.add({ days: [1, 0, 6, 5, 4, 3, 2][firstOfMonth.dayOfWeek - 1] });
}

const myMonth = Temporal.PlainYearMonth.from('2020-02');
const firstTuesdayOfMonth = getFirstTuesday(myMonth);
assert.equal(firstTuesdayOfMonth.toString(), '2020-02-04');
assert.equal(firstTuesdayOfMonth.dayOfWeek, 2);

// Similarly, to get the second Tuesday:
const secondWeek = myMonth.toPlainDate({ day: 8 });
const secondTuesday = secondWeek.add({ days: [1, 0, 6, 5, 4, 3, 2][secondWeek.dayOfWeek - 1] });
assert.equal(secondTuesday.day, firstTuesdayOfMonth.day + 7);

// And the last Tuesday:
const lastOfMonth = myMonth.toPlainDate({ day: myMonth.daysInMonth });
const lastTuesday = lastOfMonth.subtract({ days: [6, 0, 1, 2, 3, 4, 5][lastOfMonth.dayOfWeek - 1] });
assert.equal(lastTuesday.toString(), '2020-02-25');
assert.equal(lastTuesday.dayOfWeek, 2);
// or:
const lastTuesday2 = lastOfMonth.subtract({ days: (7 + lastOfMonth.dayOfWeek - 2) % 7 });
assert.equal(Temporal.PlainDate.compare(lastTuesday, lastTuesday2), 0);
Given a Temporal.PlainYearMonth instance and an ISO 8601 ordinal calendar day of the week ranging from 1 (Monday) to 7 (Sunday), return a chronologically ordered array of Temporal.PlainDate instances corresponding with every day in the month that is the specified day of the week (of which there will always be either four or five).

/\*\*

- Gets an array of Temporal.PlainDates of every day in the given month, that falls
- on the given day of the week.
-
- @param {Temporal.PlainYearMonth} yearMonth - Year and month to query
- @param {number} dayNumberOfTheWeek - Day of the week, Monday=1, Sunday=7
- @returns {Temporal.PlainDate[]} Array of dates
  \*/
  function getWeeklyDaysInMonth(yearMonth, dayNumberOfTheWeek) {
  const firstOfMonth = yearMonth.toPlainDate({ day: 1 });
  let nextWeekday = firstOfMonth.add({ days: (7 + dayNumberOfTheWeek - firstOfMonth.dayOfWeek) % 7 });
  const result = [];
  while (nextWeekday.month === yearMonth.month) {
  result.push(nextWeekday);
  nextWeekday = nextWeekday.add({ days: 7 });
  }
  return result;
  }

assert.equal(
getWeeklyDaysInMonth(Temporal.PlainYearMonth.from('2020-02'), 1).join(' '),
'2020-02-03 2020-02-10 2020-02-17 2020-02-24'
);
assert.equal(
getWeeklyDaysInMonth(Temporal.PlainYearMonth.from('2020-02'), 6).join(' '),
'2020-02-01 2020-02-08 2020-02-15 2020-02-22 2020-02-29'
);
Given a Temporal.PlainDate instance, return the count of preceding days in its month that share its day of the week.

/\*\*

- Gets the number of preceding days in the same month as `date` that fall on
- the same day of the week as `date`.
-
- @param {Temporal.PlainDate} date - Starting date
- @returns {number} Number of days
  \*/
  function countPrecedingWeeklyDaysInMonth(date) {
  // This doesn't actually require Temporal
  return Math.floor((date.day - 1) / 7);
  }

assert.equal(countPrecedingWeeklyDaysInMonth(Temporal.PlainDate.from('2020-02-28')), 3);
assert.equal(countPrecedingWeeklyDaysInMonth(Temporal.PlainDate.from('2020-02-29')), 4);
Manipulating the day of the month
Here are some examples of taking an existing date, and adjusting the day of the month.

const date = Temporal.PlainDate.from('2020-04-14');

// Third day of next month:

const thirdOfNextMonth = date.add({ months: 1 }).with({ day: 3 });

assert.equal(thirdOfNextMonth.toString(), '2020-05-03');

// Last day of this month:

const lastOfThisMonth = date.with({ day: date.daysInMonth });

assert.equal(lastOfThisMonth.toString(), '2020-04-30');

// On the 18th of this month at 8 PM:

const thisMonth18thAt8PM = date.with({ day: 18 }).toPlainDateTime(Temporal.PlainTime.from('20:00'));

assert.equal(thisMonth18thAt8PM.toString(), '2020-04-18T20:00:00');
Same date in another month
Likewise, here are some examples of taking an existing date and adjusting the month, but keeping the day and year the same.

Depending on the behavior you want, you will need to pick the right overflow option, but the default of "constrain" should be correct for most cases.

const date = Temporal.PlainDate.from('2020-05-31');

// Same date and time, but in February
// (and use the last day if the date doesn't exist in February):

const feb = date.with({ month: 2 });

assert.equal(feb.toString(), '2020-02-29');

// Same date and time, but in April
// (and throw an exception if the date doesn't exist in April):

assert.throws(() => {
date.with({ month: 4 }, { overflow: 'reject' });
});
Next weekly occurrence
From a Temporal.ZonedDateTime instance, get a Temporal.ZonedDateTime representing the next occurrence of a weekly event that is scheduled on a particular weekday and time in a particular time zone. (For example, "weekly on Thursdays at 08:45 California time").

/\*\*

- Returns the local date and time for the next occurrence of a weekly occurring
- event.
-
- @param {Temporal.ZonedDateTime} now - Starting point
- @param {number} weekday - Weekday event occurs on (Monday=1, Sunday=7)
- @param {Temporal.PlainTime} eventTime - Time event occurs at
- @param {Temporal.TimeZone} eventTimeZone - Time zone where event is planned
- @returns {Temporal.ZonedDateTime} Local date and time of next occurrence
  \*/
  function nextWeeklyOccurrence(now, weekday, eventTime, eventTimeZone) {
  const nowInEventTimeZone = now.withTimeZone(eventTimeZone);
  const nextDate = nowInEventTimeZone.toPlainDate().add({ days: (weekday + 7 - nowInEventTimeZone.dayOfWeek) % 7 });
  let nextOccurrence = nextDate.toZonedDateTime({ plainTime: eventTime, timeZone: eventTimeZone });

// Handle the case where the event is today but already happened
if (Temporal.ZonedDateTime.compare(now, nextOccurrence) > 0) {
nextOccurrence = nextOccurrence.add({ weeks: 1 });
}

return nextOccurrence.withTimeZone(now.timeZoneId);
}

// "Weekly on Thursdays at 08:45 California time":
const weekday = 4;
const eventTime = Temporal.PlainTime.from('08:45');
const eventTimeZone = 'America/Los_Angeles';

const rightBefore = Temporal.ZonedDateTime.from('2020-03-26T15:30+00:00[Europe/London]');
let next = nextWeeklyOccurrence(rightBefore, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-03-26T15:45:00+00:00[Europe/London]');

const rightAfter = Temporal.ZonedDateTime.from('2020-03-26T16:00+00:00[Europe/London]');
next = nextWeeklyOccurrence(rightAfter, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-04-02T16:45:00+01:00[Europe/London]');
Weekday of yearly occurrence
In some countries, when a public holiday falls on a Tuesday or Thursday, an extra "bridge" public holiday is observed on Monday or Friday in order to give workers a long weekend off. The following example calculates this.

/\*\*

- Calculates the days that need to be taken off work in order to have a long
- weekend around a public holiday, "bridging" the holiday if it falls on a
- Tuesday or Thursday.
-
- @param {Temporal.PlainMonthDay} holiday - Yearly date on the calendar
- @param {number} year - Year in which to calculate the bridge days
- @returns {Temporal.PlainDate[]} List of dates to be taken off work
  \*/
  function bridgePublicHolidays(holiday, year) {
  const date = holiday.toPlainDate({ year });
  switch (date.dayOfWeek) {
  case 1: // Mon
  case 3: // Wed
  case 5: // Fri
  return [date];
  case 2: // Tue; take Monday off
  return [date.subtract({ days: 1 }), date];
  case 4: // Thu; take Friday off
  return [date, date.add({ days: 1 })];
  case 6: // Sat
  case 7: // Sun
  return [];
  }
  }

const labourDay = Temporal.PlainMonthDay.from('05-01');

// No bridge day
assert.deepEqual(
bridgePublicHolidays(labourDay, 2020).map((d) => d.toString()),
['2020-05-01']
);

// Bridge day
assert.deepEqual(
bridgePublicHolidays(labourDay, 2018).map((d) => d.toString()),
['2018-04-30', '2018-05-01']
);

// Bad luck, the holiday is already on a weekend
assert.deepEqual(
bridgePublicHolidays(labourDay, 2021).map((d) => d.toString()),
[]
);
