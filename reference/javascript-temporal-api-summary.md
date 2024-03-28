Temporal
Table of Contents
Introduction
Date has been a long-standing pain point in ECMAScript. This is a proposal for Temporal, a global Object that acts as a top-level namespace (like Math), that brings a modern date/time API to the ECMAScript language. For a detailed look at some of the problems with Date, and the motivations for Temporal, see: Fixing JavaScript Date.

Temporal fixes these problems by:

Providing easy-to-use APIs for date and time computations
First-class support for all time zones, including DST-safe arithmetic
Dealing only with objects representing fixed dates and times
Parsing a strictly specified string format
Supporting non-Gregorian calendars
Temporal provides separate ECMAScript classes for date-only, time-only, and other scoped use cases. This makes code more readable and prevents bugs caused by incorrectly assuming 0, UTC, or the local time zone for values that are actually unknown.

Cookbook
A cookbook to help you get started and learn the ins and outs of Temporal is available here.

API Documentation
The Temporal API follows a convention of using types whose names start with "Plain" (like Temporal.PlainDate, Temporal.PlainTime, and Temporal.PlainDateTime) for objects which do not have an associated time zone. Converting between such types and exact time types (Temporal.Instant and Temporal.ZonedDateTime) can be ambiguous because of time zones and daylight saving time, and the Temporal API lets developers configure how this ambiguity is resolved.

Several important concepts are explained elsewhere: exact time, wall-clock time, time zones, DST, handling ambiguity, and more.

Temporal.Now
Temporal.Now.instant() - get the current system exact time
Temporal.Now.timeZoneId() - get the current system time zone
Temporal.Now.zonedDateTime(calendar) - get the current date and wall-clock time in the system time zone and specified calendar
Temporal.Now.zonedDateTimeISO() - get the current date and wall-clock time in the system time zone and ISO-8601 calendar
Temporal.Now.plainDate(calendar) - get the current date in the system time zone and specified calendar
Temporal.Now.plainDateISO() - get the current date in the system time zone and ISO-8601 calendar
Temporal.Now.plainTimeISO() - get the current wall-clock time in the system time zone and ISO-8601 calendar
Temporal.Now.plainDateTime(calendar) - get the current system date/time in the system time zone, but return an object that doesn't remember its time zone so should NOT be used to derive other values (e.g. 12 hours later) in time zones that use Daylight Saving Time (DST).
Temporal.Now.plainDateTimeISO() - same as above, but return the DateTime in the ISO-8601 calendar
console.log('Initialization complete', Temporal.Now.instant());
// example output:
// Initialization complete 2021-01-13T20:57:01.500944804Z
See Temporal.Now Documentation for detailed documentation.

Temporal.Instant
A Temporal.Instant represents a fixed point in time (called "exact time"), without regard to calendar or location, e.g. July 20, 1969, at 20:17 UTC. For a human-readable local calendar date or clock time, use a Temporal.TimeZone and Temporal.Calendar to obtain a Temporal.ZonedDateTime or Temporal.PlainDateTime.

const instant = Temporal.Instant.from('1969-07-20T20:17Z');
instant.toString(); // => '1969-07-20T20:17:00Z'
instant.epochMilliseconds; // => -14182980000
See Temporal.Instant Documentation for detailed documentation.

Temporal.ZonedDateTime
A Temporal.ZonedDateTime is a timezone-aware, calendar-aware date/time object that represents a real event that has happened (or will happen) at a particular exact time from the perspective of a particular region on Earth, e.g. December 7th, 1995 at 3:24 AM in US Pacific time (in Gregorian calendar). This type is optimized for use cases that require a time zone, including DST-safe arithmetic and interoperability with RFC 5545 (iCalendar).

const zonedDateTime = Temporal.ZonedDateTime.from({
timeZone: 'America/Los_Angeles',
year: 1995,
month: 12,
day: 7,
hour: 3,
minute: 24,
second: 30,
millisecond: 0,
microsecond: 3,
nanosecond: 500
}); // => 1995-12-07T03:24:30.0000035-08:00[America/Los_Angeles]
As the broadest Temporal type, Temporal.ZonedDateTime can be considered a combination of Temporal.TimeZone, Temporal.Instant, and Temporal.PlainDateTime (which includes Temporal.Calendar).

See Temporal.ZonedDateTime Documentation for detailed documentation.

Temporal.PlainDate
A Temporal.PlainDate object represents a calendar date that is not associated with a particular time or time zone, e.g. August 24th, 2006.

const date = Temporal.PlainDate.from({ year: 2006, month: 8, day: 24 }); // => 2006-08-24
date.year; // => 2006
date.inLeapYear; // => false
date.toString(); // => '2006-08-24'
This can also be converted to partial dates such as Temporal.PlainYearMonth and Temporal.PlainMonthDay.

See Temporal.PlainDate Documentation for detailed documentation.

Temporal.PlainTime
A Temporal.PlainTime object represents a wall-clock time that is not associated with a particular date or time zone, e.g. 7:39 PM.

const time = Temporal.PlainTime.from({
hour: 19,
minute: 39,
second: 9,
millisecond: 68,
microsecond: 346,
nanosecond: 205
}); // => 19:39:09.068346205

time.second; // => 9
time.toString(); // => '19:39:09.068346205'
See Temporal.PlainTime Documentation for detailed documentation.

Temporal.PlainDateTime
A Temporal.PlainDateTime represents a calendar date and wall-clock time that does not carry time zone information, e.g. December 7th, 1995 at 3:00 PM (in the Gregorian calendar).

It can be converted to a Temporal.ZonedDateTime using a Temporal.TimeZone. For use cases that require a time zone, especially using arithmetic or other derived values, consider using Temporal.ZonedDateTime instead because that type automatically adjusts for Daylight Saving Time.

const dateTime = Temporal.PlainDateTime.from({
year: 1995,
month: 12,
day: 7,
hour: 15
}); // => 1995-12-07T15:00:00
const dateTime1 = dateTime.with({
minute: 17,
second: 19
}); // => 1995-12-07T15:17:19
See Temporal.PlainDateTime Documentation for detailed documentation.

Temporal.PlainYearMonth
A date without a day component. This is useful to express things like "the October 2020 meeting".

const yearMonth = Temporal.PlainYearMonth.from({ year: 2020, month: 10 }); // => 2020-10
yearMonth.daysInMonth; // => 31
yearMonth.daysInYear; // => 366
See Temporal.PlainYearMonth Documentation for detailed documentation.

Temporal.PlainMonthDay
A date without a year component. This is useful to express things like "Bastille Day is on the 14th of July".

const monthDay = Temporal.PlainMonthDay.from({ month: 7, day: 14 }); // => 07-14
const date = monthDay.toPlainDate({ year: 2030 }); // => 2030-07-14
date.dayOfWeek; // => 7
See Temporal.PlainMonthDay Documentation for detailed documentation.

Temporal.Duration
A Temporal.Duration expresses a length of time, e.g. 5 minutes and 30 seconds. This is used for date/time arithmetic and for measuring differences between Temporal objects.

const duration = Temporal.Duration.from({
hours: 130,
minutes: 20
});

duration.total({ unit: 'second' }); // => 469200
See Temporal.Duration Documentation for detailed documentation.

Balancing
Unlike the other Temporal types, the units in Temporal.Duration don't naturally wrap around to 0: you may want to have a duration of "90 minutes," and you don't want it to unexpectedly turn into "1 hour and 30 minutes."

See Duration balancing for more on this topic.

Temporal.TimeZone
A Temporal.TimeZone represents an IANA time zone, a specific UTC offset, or UTC itself. Time zones translate from a date/time in UTC to a local date/time. Because of this Temporal.TimeZone can be used to convert between Temporal.Instant and Temporal.PlainDateTime as well as finding out the offset at a specific Temporal.Instant.

It is also possible to implement your own time zones.

const timeZone = Temporal.TimeZone.from('Africa/Cairo');
timeZone.getInstantFor('2000-01-01T00:00'); // => 1999-12-31T22:00:00Z
timeZone.getPlainDateTimeFor('2000-01-01T00:00Z'); // => 2000-01-01T02:00:00
timeZone.getPreviousTransition(Temporal.Now.instant()); // => 2014-09-25T21:00:00Z
timeZone.getNextTransition(Temporal.Now.instant()); // => null
See Temporal.TimeZone Documentation for detailed documentation. A conceptual explanation of handling time zones, DST, and ambiguity in Temporal is also available.

Temporal.Calendar
A Temporal.Calendar represents a calendar system. Most code will use the ISO 8601 calendar, but other calendar systems are available.

Dates have associated Temporal.Calendar objects, to perform calendar-related math. Under the hood, this math is done by methods on the calendars.

It is also possible to implement your own calendars.

const cal = Temporal.Calendar.from('iso8601');
const date = cal.dateFromFields({ year: 1999, month: 12, day: 31 }, {});
date.monthsInYear; // => 12
date.daysInYear; // => 365
See Temporal.Calendar Documentation for detailed documentation.

## Temporal.Now

Temporal.Now
Table of Contents
The Temporal.Now object has several methods which give information about the current time and date.

NOTE: Because these methods return the current time, the return value will likely be different every time they are called. If you need to use the same value in more than one place, save the return value in a variable.

NOTE: These methods allow for up to nanosecond accuracy, but browsers and other environments may limit the accuracy for security reasons.

Methods
Temporal.Now.zonedDateTimeISO(timeZone: object | string = Temporal.Now.timeZone()) : Temporal.ZonedDateTime
Parameters:

timeZone (optional object or string): The time zone to get the current date and time in, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string. If not given, the current system time zone will be used.
Returns: a Temporal.ZonedDateTime object representing the current system date, time, time zone, and time zone offset.

This method gets the current date, time, time zone, and time zone offset according to the system settings, in the reckoning of the ISO 8601 calendar system. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

This method is the same as zonedDateTime(), but always uses the ISO 8601 calendar.

Example usage:

financialCentres = {
'New York': 'America/New_York',
London: 'Europe/London',
Tokyo: 'Asia/Tokyo'
};
console.log(`Here: ${Temporal.Now.zonedDateTimeISO()}`);
Object.entries(financialCentres).forEach(([name, timeZone]) => {
console.log(`${name}: ${Temporal.Now.zonedDateTimeISO(timeZone)}`);
});
// example output:
// Here: 2020-09-18T01:17:48.431957915-07:00[America/Los_Angeles]
// New York: 2020-09-18T04:17:48.435068431-04:00[America/New_York]
// London: 2020-09-18T09:17:48.438068435+01:00[Europe/London]
// Tokyo: 2020-09-18T17:17:48.441068438+09:00[Asia/Tokyo]
Temporal.Now.zonedDateTime(calendar: object | string, timeZone: object | string = Temporal.Now.timeZone()) : Temporal.ZonedDateTime
Parameters:

calendar (Temporal.Calendar, plain object, or string): The calendar system to get the current date and time in.
timeZone (optional object or string): The time zone to get the current date and time in, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string. If not given, the current system time zone will be used.
Returns: a Temporal.ZonedDateTime object representing the current system date, time, time zone, and time zone offset.

This method gets the current date, time, time zone, and time zone offset according to the system settings, in the reckoning of the given calendar system. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

If you only want to use the ISO 8601 calendar, use Temporal.Now.zonedDateTimeISO().

Temporal.Now.instant() : Temporal.Instant
Returns: a Temporal.Instant object representing the current system time.

This method gets the current exact system time, without regard to calendar or time zone. This is a good way to get a timestamp for an event, for example. It works like the old-style JavaScript Date.now(), but with nanosecond accuracy instead of milliseconds.

Example usage:

function timeit(func) {
start = Temporal.Now.instant();
try {
return func();
} finally {
end = Temporal.Now.instant();
console.log(`The function took ${end.since(start)}`);
}
}
timeit(() => JSON.parse(someData));
// example output:
// The function took PT0.001031756S
Temporal.Now.timeZoneId() : string
Returns: The identifier of time zone according to the current system settings.

This method gets the identifier of the current system time zone. This will usually be a named IANA time zone, as that is how most people configure their computers.

Example usage:

// When is the next daylight saving change from now, in the current location?
id = Temporal.Now.timeZoneId();
now = Temporal.Now.instant();
tz = Temporal.TimeZone.from(id);
nextTransition = tz.getNextTransition(now);
before = tz.getOffsetStringFor(nextTransition.subtract({ nanoseconds: 1 }));
after = tz.getOffsetStringFor(nextTransition.add({ nanoseconds: 1 }));
console.log(`At ${nextTransition.toZonedDateTimeISO(id)} the offset will change from UTC ${before} to ${after}`);
// example output:
// At 2021-03-14T03:00:00-07:00[America/Los_Angeles] the offset will change from UTC -08:00 to -07:00
Temporal.Now.plainDateTimeISO(timeZone: object | string = Temporal.Now.timeZone()) : Temporal.PlainDateTime
Parameters:

timeZone (optional object or string): The time zone to get the current date and time in, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string. If not given, the current system time zone will be used.
Returns: a Temporal.PlainDateTime object representing the current system date and time in the reckoning of the ISO 8601 calendar.

This method gets the current calendar date and wall-clock time according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

This method is the same as dateTime(), but always uses the ISO 8601 calendar.

Example usage:

financialCentres = {
'New York': 'America/New_York',
'London': 'Europe/London',
'Tokyo': 'Asia/Tokyo',
};
console.log(`Here: ${Temporal.Now.plainDateTimeISO()}`);
Object.entries(financialCentres).forEach(([name, timeZone]) => {
console.log(`${name}: ${Temporal.Now.plainDateTimeISO(timeZone)}`);
});
// example output:
// Here: 2020-01-24T21:51:02.142905166
// New York: 2020-01-25T00:52:14.756462142
// London: 2020-01-25T05:52:14.758534756
// Tokyo: 2020-01-25T14:52:14.759534758
Temporal.Now.plainDateTime(calendar: object | string, timeZone: object | string = Temporal.Now.timeZone()) : Temporal.PlainDateTime
Parameters:

calendar (Temporal.Calendar, plain object, or string): The calendar system to get the current date and time in.
timeZone (optional object or string): The time zone to get the current date and time in, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string. If not given, the current system time zone will be used.
Returns: a Temporal.PlainDateTime object representing the current system date and time in the reckoning of the given calendar system.

This method gets the current calendar date and wall-clock time according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

If you only want to use the ISO 8601 calendar, use Temporal.Now.plainDateTimeISO().

Temporal.Now.plainDateISO(timeZone: object | string = Temporal.Now.timeZone()) : Temporal.PlainDate
Parameters:

timeZone (optional object or string): The time zone to get the current date and time in, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string. If not given, the current system time zone will be used.
Returns: a Temporal.PlainDate object representing the current system date in the reckoning of the ISO 8601 calendar.

This method gets the current calendar date according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

This method is the same as date(), but always uses the ISO 8601 calendar.

Example usage:

// Is it New Year in the ISO 8601 calendar?
date = Temporal.Now.plainDateISO();
if (date.month === 1 && date.day === 1) console.log('New year!');
Temporal.Now.plainDate(calendar: object | string, timeZone: object | string = Temporal.Now.timeZone()) : Temporal.PlainDate
Parameters:

calendar (Temporal.Calendar, plain object, or string): The calendar system to get the current date and time in.
timeZone (optional object or string): The time zone to get the current date and time in, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string. If not given, the current system time zone will be used.
Returns: a Temporal.PlainDate object representing the current system date in the reckoning of the given calendar.

This method gets the current calendar date according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

If you only want to use the ISO 8601 calendar, use Temporal.Now.plainDateISO().

// Is it Nowruz (New Year in the Persian calendar)?
date = Temporal.Now.plainDate('persian');
if (date.month === 1 && date.day === 1) console.log('New year!');
Temporal.Now.plainTimeISO(timeZone: object | string = Temporal.Now.timeZone()) : Temporal.PlainTime
Parameters:

timeZone (optional object or string): The time zone to get the current date and time in, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string. If not given, the current system time zone will be used.
Returns: a Temporal.PlainTime object representing the current system time in the reckoning of the ISO 8601 calendar.

This method gets the current wall-clock time according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

Example usage:

// Is it lunchtime?
time = Temporal.Now.plainTimeISO();
if (time.hour === 12) console.log('Lunchtime!');

## Temporal.Instant

Temporal.Instant
Table of Contents
A Temporal.Instant is a single point in time (called "exact time"), with a precision in nanoseconds. No time zone or calendar information is present. To obtain local date/time units like year, month, day, or hour, a Temporal.Instant must be combined with a Temporal.TimeZone instance or a time zone string.

instant = Temporal.Instant.from('2020-01-01T00:00+05:30'); // => 2019-12-31T18:30:00Z
instant.epochNanoseconds; // => 1577817000000000000n

// `Temporal.Instant` lacks properties that depend on time zone or calendar
instant.year; // => undefined

zdtTokyo = instant.toZonedDateTimeISO('Asia/Tokyo'); // => 2020-01-01T03:30:00+09:00[Asia/Tokyo]
zdtTokyo.year; // => 2020
zdtTokyo.toPlainDate(); // => 2020-01-01

tzLA = Temporal.TimeZone.from('America/Los_Angeles');
zdtLA = instant.toZonedDateTimeISO(tzLA); // => 2019-12-31T10:30:00-08:00[America/Los_Angeles]
zdtLA.year; // => 2019
zdtLA.toPlainDate(); // => 2019-12-31
Temporal.Instant stores a count of integer nanoseconds since the Unix epoch: midnight UTC on January 1, 1970. For interoperability with Date and other APIs, Temporal.Instant also offers conversion properties and methods for seconds, milliseconds, or microseconds since epoch. A Temporal.Instant can also be created from an ISO 8601 / RFC 3339 string like '2020-01-23T17:04:36.491865121-08:00' or '2020-01-24T01:04Z'.

Like Unix time, Temporal.Instant ignores leap seconds.

Interoperability with Date
Temporal.Instant is the easiest way to interoperate between Temporal objects and code using Date. Because Date and Temporal.Instant both use a time-since-epoch data model, conversions between them are zero-parameter method calls that are lossless (except sub-millisecond precision is truncated when converting to Date).

// Convert from `Temporal.Instant` to `Date` (which uses millisecond precision)
instant = Temporal.Instant.from('2020-01-01T00:00:00.123456789+05:30');
// => 2019-12-31T18:30:00.123456789Z
date = new Date(instant.epochMilliseconds);
date.toISOString(); // => 2019-12-31T18:30:00.123Z

// Convert from `Date` to `Temporal.Instant`
sameInstant = date.toTemporalInstant(); // => 2019-12-31T18:30:00.123Z
A Date that's been converted to a Temporal.Instant can be easily converted to a Temporal.ZonedDateTime object by providing a time zone. From there, calendar and clock properties like day or hour are available. Conversions to narrower types like Temporal.PlainDate or Temporal.PlainTime are also provided.

date = new Date(2019, 11, 31, 18, 30); // => Tue Dec 31 2019 18:30:00 GMT-0800 (Pacific Standard Time)
instant = date.toTemporalInstant(); // => 2020-01-01T02:30:00Z
zonedDateTime = instant.toZonedDateTimeISO(Temporal.Now.timeZone());
// => 2019-12-31T18:30:00-08:00[America/Los_Angeles]
zonedDateTime.day; // => 31
dateOnly = zonedDateTime.toPlainDate(); // => 2019-12-31
Bugs in Date=>Temporal conversions can be caused by picking the wrong time zone when converting from Temporal.Instant to Temporal.ZonedDateTime. For example, the example above constructs the Date using local-timezone parameters, so it uses the system time zone: Temporal.Now.timeZone(). But if the Date had been initialized with a string like '2019-12-31', then getting the same date back in a Temporal.PlainDate would require using the 'UTC' time zone instead.

For discussion and code examples about picking the correct time zone, and also about Date<=>Temporal interoperability in general, see Converting between Temporal types and legacy Date in the documentation cookbook.

Constructor
new Temporal.Instant(epochNanoseconds : bigint) : Temporal.Instant
Parameters:

epochNanoseconds (bigint): A number of nanoseconds.
Returns: a new Temporal.Instant object.

Creates a new Temporal.Instant object that represents an exact time.

epochNanoseconds is the number of nanoseconds (10−9 seconds) between the Unix epoch (midnight UTC on January 1, 1970) and the desired exact time.

Use this constructor directly if you know the precise number of nanoseconds already and have it in bigint form, for example from a database. Otherwise, Temporal.Instant.from(), which accepts more kinds of input, is probably more convenient.

The range of allowed values for this type is the same as the old-style JavaScript Date, 100 million (108) days before or after the Unix epoch. This range covers approximately half a million years. If epochNanoseconds is outside of this range, a RangeError will be thrown.

Example usage:

instant = new Temporal.Instant(1553906700000000000n);
// When was the Unix epoch?
epoch = new Temporal.Instant(0n); // => 1970-01-01T00:00:00Z
// Dates before the Unix epoch are negative
turnOfTheCentury = new Temporal.Instant(-2208988800000000000n); // => 1900-01-01T00:00:00Z
Static methods
Temporal.Instant.from(thing: any) : Temporal.Instant
Parameters:

thing: The value representing the desired exact time.
Returns: a new Temporal.Instant object.

This static method creates a new Temporal.Instant object from another value. If the value is another Temporal.Instant object, a new object representing the same exact time is returned.

Any other value is converted to a string, which is expected to be in ISO 8601 format, including a date, a time, and a time zone. The time zone name, if given, is ignored; only the time zone offset is taken into account.

Example usage:

instant = Temporal.Instant.from('2019-03-30T01:45:00+01:00[Europe/Berlin]');
instant = Temporal.Instant.from('2019-03-30T01:45+01:00');
instant = Temporal.Instant.from('2019-03-30T00:45Z');
instant === Temporal.Instant.from(instant); // => false

// Not enough information to denote an exact time:
/_ WRONG _/ instant = Temporal.Instant.from('2019-03-30'); // => throws, no time
/_ WRONG _/ instant = Temporal.Instant.from('2019-03-30T01:45'); // => throws, no UTC offset
Temporal.Instant.fromEpochSeconds(epochSeconds: number) : Temporal.Instant
Parameters:

epochSeconds (number): A number of seconds.
Returns: a new Temporal.Instant object.

This static method creates a new Temporal.Instant object with seconds precision. epochSeconds is the number of seconds between the Unix epoch (midnight UTC on January 1, 1970) and the desired exact time.

The number of seconds since the Unix epoch is a common measure of exact time in many computer systems. Use this method if you need to interface with such a system.

Example usage:

// Same examples as in new Temporal.Instant(), but with seconds precision
instant = Temporal.Instant.fromEpochSeconds(1553906700);
epoch = Temporal.Instant.fromEpochSeconds(0); // => 1970-01-01T00:00:00Z
turnOfTheCentury = Temporal.Instant.fromEpochSeconds(-2208988800); // => 1900-01-01T00:00:00Z
Temporal.Instant.fromEpochMilliseconds(epochMilliseconds: number) : Temporal.Instant
Parameters:

epochMilliseconds (number): A number of milliseconds.
Returns: a new Temporal.Instant object.

Same as Temporal.Instant.fromEpochSeconds(), but with millisecond (10−3 second) precision.

The number of milliseconds since the Unix epoch is also returned from the getTime() and valueOf() methods of legacy JavaScript Date objects, as well as Date.now(). However, for conversion from legacy Date to Temporal.Instant, use Date.prototype.toTemporalInstant:

legacyDate = new Date('1995-12-17T03:24Z');
instant = Temporal.Instant.fromEpochMilliseconds(legacyDate.getTime()); // => 1995-12-17T03:24:00Z
instant = Temporal.Instant.fromEpochMilliseconds(legacyDate); // valueOf() called implicitly
instant = legacyDate.toTemporalInstant(); // recommended

// Use fromEpochMilliseconds, for example, if you have epoch millisecond data stored in a file
todayMs = Temporal.Instant.fromEpochMilliseconds(msReadFromFile);
Temporal.Instant.fromEpochMicroseconds(epochMicroseconds : bigint) : Temporal.Instant
Parameters:

epochMicroseconds (bigint): A number of microseconds.
Returns: a new Temporal.Instant object.

Same as Temporal.Instant.fromEpochSeconds(), but with microsecond (10−6 second) precision.

Temporal.Instant.fromEpochNanoseconds(epochNanoseconds : bigint) : Temporal.Instant
Parameters:

epochNanoseconds (bigint): A number of nanoseconds.
Returns: a new Temporal.Instant object.

Same as Temporal.Instant.fromEpochSeconds(), but with nanosecond (10−9 second) precision. Also the same as new Temporal.Instant(epochNanoseconds).

Temporal.Instant.compare(one: Temporal.Instant | string, two: Temporal.Instant | string) : number
Parameters:

one (Temporal.Instant or value convertible to one): First time to compare.
two (Temporal.Instant or value convertible to one): Second time to compare.
Returns: −1, 0, or 1.

Compares two Temporal.Instant objects. Returns an integer indicating whether one comes before or after or is equal to two.

−1 if one comes before two;
0 if one and two represent the same time;
1 if one comes after two.
If one and two are not Temporal.Instant objects, then they will be converted to one as if they were passed to Temporal.Instant.from().

This function can be used to sort arrays of Temporal.Instant objects. For example:

one = Temporal.Instant.fromEpochSeconds(1.0e9);
two = Temporal.Instant.fromEpochSeconds(1.1e9);
three = Temporal.Instant.fromEpochSeconds(1.2e9);
sorted = [three, one, two].sort(Temporal.Instant.compare);
sorted.join(' ');
// => '2001-09-09T01:46:40Z 2004-11-09T11:33:20Z 2008-01-10T21:20:00Z'
Properties
instant.epochSeconds : number
The value of this property is an integer number of seconds between the Unix epoch (midnight UTC on January 1, 1970) and instant. This number will be negative if instant is before 1970. The number of seconds is truncated towards zero.

Use this property if you need to interface with some other system that reckons time in seconds since the Unix epoch.

Example usage:

instant = Temporal.Instant.from('2019-03-30T01:45+01:00');
instant.epochSeconds; // => 1553906700
instant.epochMilliseconds : number
Same as epochSeconds, but with millisecond (10−3 second) precision. The number of seconds is truncated towards zero.

This method can be useful in particular to create an old-style JavaScript Date object, if one is needed. An example:

instant = Temporal.Instant.from('2019-03-30T00:45Z');
new Date(instant.epochMilliseconds); // => 2019-03-30T00:45:00.000Z
instant.epochMicroseconds : bigint
Same as epochSeconds, but the value is a bigint with microsecond (10−6 second) precision. The number of seconds is truncated towards zero.

instant.epochNanoseconds : bigint
Same as epochSeconds, but the value is a bigint with nanosecond (10−9 second) precision.

The value of this property is suitable to be passed to new Temporal.Instant().

Methods
instant.toZonedDateTimeISO(timeZone: object | string) : Temporal.ZonedDateTime
Parameters:

timeZone (object or string): either
a Temporal.TimeZone object
an object implementing the time zone protocol
a string description of the time zone; either its IANA name or UTC offset
an object with a timeZone property whose value is any of the above.
Returns: a Temporal.ZonedDateTime object representing the calendar date, wall-clock time, time zone offset, and timeZone, according to the reckoning of the ISO 8601 calendar, at the exact time indicated by instant.

For a list of IANA time zone names, see the current version of the IANA time zone database. A convenient list is also available on Wikipedia, although it might not reflect the latest official status.

This method is one way to convert a Temporal.Instant to a Temporal.ZonedDateTime. It is the same as toZonedDateTime(), but always uses the ISO 8601 calendar. Use this method if you are not doing computations in other calendars.

Example usage:

// Converting a specific exact time to a calendar date / wall-clock time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
timestamp.toZonedDateTimeISO('Europe/Berlin'); // => 2019-03-31T01:45:00+01:00[Europe/Berlin]
timestamp.toZonedDateTimeISO('UTC'); // => 2019-03-31T00:45:00+00:00[UTC]
timestamp.toZonedDateTimeISO('-08:00'); // => 2019-03-30T16:45:00-08:00[-08:00]
instant.toZonedDateTime(item: object) : Temporal.ZonedDateTime
Parameters:

item (object): an object with properties to be combined with instant. The following properties are recognized:
calendar (required calendar identifier string, Temporal.Calendar object, or object implementing the calendar protocol): the calendar in which to interpret instant.
timeZone (required time zone identifier string, Temporal.TimeZone object, or object implementing the time zone protocol): the time zone in which to interpret instant.
Returns: a Temporal.ZonedDateTime object representing the calendar date, wall-clock time, time zone offset, and timeZone, according to the reckoning of calendar, at the exact time indicated by instant.

For a list of IANA time zone names, see the current version of the IANA time zone database. A convenient list is also available on Wikipedia, although it might not reflect the latest official status.

For a list of calendar identifiers, see the documentation for Intl.DateTimeFormat.

If you only want to use the ISO 8601 calendar, use toZonedDateTimeISO().

Example usage:

// What time was the Unix epoch (timestamp 0) in Bell Labs (Murray Hill, New Jersey, USA) in the Gregorian calendar?
epoch = Temporal.Instant.fromEpochSeconds(0);
timeZone = Temporal.TimeZone.from('America/New_York');
epoch.toZonedDateTime({ timeZone, calendar: 'gregory' });
// => 1969-12-31T19:00:00-05:00[America/New_York][u-ca=gregory]

// What time was the Unix epoch in Tokyo in the Japanese calendar?
timeZone = Temporal.TimeZone.from('Asia/Tokyo');
calendar = Temporal.Calendar.from('japanese');
zdt = epoch.toZonedDateTime({ timeZone, calendar });
// => 1970-01-01T09:00:00+09:00[Asia/Tokyo][u-ca=japanese]
console.log(zdt.eraYear, zdt.era);
// => '45 showa'
instant.add(duration: Temporal.Duration | object | string) : Temporal.Instant
Parameters:

duration (Temporal.Duration or value convertible to one): The duration to add.
Returns: a new Temporal.Instant object which is the exact time indicated by instant plus duration.

This method adds duration to instant.

The duration argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a string such as PT5H30M, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

The years, months, weeks, and days fields of duration must be zero. Temporal.Instant is independent of time zones and calendars, and so years, months, weeks, and days may be different lengths depending on which calendar or time zone they are reckoned in. This makes an addition with those units ambiguous. To add those units, convert the Temporal.Instant to a Temporal.ZonedDateTime by specifying the desired calendar and time zone, add the duration, and then convert it back.

If the result is earlier or later than the range that Temporal.Instant can represent (approximately half a million years centered on the Unix epoch), a RangeError will be thrown.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Example usage:

// Temporal.Instant representing five hours from now
Temporal.Now.instant().add({ hours: 5 });
fiveHours = Temporal.Duration.from({ hours: 5 });
Temporal.Now.instant().add(fiveHours);
instant.subtract(duration: Temporal.Duration | object | string) : Temporal.Instant
Parameters:

duration (Temporal.Duration or value convertible to one): The duration to subtract.
Returns: a new Temporal.Instant object which is the exact time indicated by instant minus duration.

This method subtracts duration from instant.

The duration argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a string such as PT5H30M, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

The years, months, weeks, and days fields of duration must be zero. Temporal.Instant is independent of time zones and calendars, and so years, months, weeks, and days may be different lengths depending on which calendar or time zone they are reckoned in. This makes a subtraction with those units ambiguous. To subtract those units, convert the Temporal.Instant to a Temporal.ZonedDateTime by specifying the desired calendar and time zone, subtract the duration, and then convert it back.

If the result is earlier or later than the range that Temporal.Instant can represent (approximately half a million years centered on the Unix epoch), a RangeError will be thrown.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Example usage:

// Temporal.Instant representing this time an hour ago
Temporal.Now.instant().subtract({ hours: 1 });
oneHour = Temporal.Duration.from({ hours: 1 });
Temporal.Now.instant().subtract(oneHour);
instant.until(other: Temporal.Instant | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.Instant or value convertible to one): Another exact time until when to compute the difference.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are the same as for largestUnit. The default is 'nanosecond', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the difference between instant and other.

This method computes the elapsed time after the exact time represented by instant and until the exact time represented by other, optionally rounds it, and returns it as a Temporal.Duration object. If other is earlier than instant then the resulting duration will be negative.

If other is not a Temporal.Instant object, then it will be converted to one as if it were passed to Temporal.Instant.from().

The largestUnit option controls how the resulting duration is expressed. The returned Temporal.Duration object will not have any nonzero fields that are larger than the unit in largestUnit. A difference of two hours will become 7200 seconds when largestUnit is "seconds", for example. However, a difference of 30 seconds will still be 30 seconds even if largestUnit is "hours". A value of 'auto' means 'second', unless smallestUnit is 'hour' or 'minute', in which case largestUnit is equal to smallestUnit.

By default, the largest unit in the result is seconds. Weeks, months, years, and days are not allowed, unlike the difference methods of other Temporal types. This is because months and years can be different lengths depending on which month is meant, and whether the year is a leap year, which all depends on the start and end date of the difference. You cannot determine the start and end date of a difference between Temporal.Instants, because Temporal.Instant has no time zone or calendar. In addition, weeks can be different lengths in different calendars, and days can be different lengths when the time zone has a daylight saving transition.

To calculate the difference in days or larger units between two Temporal.Instants, first convert both (using the toZonedDateTimeISO or toZonedDateTime methods) to Temporal.ZonedDateTime objects in the same time zone and calendar. For example, you might decide to base the calculation on your user's current time zone, or on UTC, in the Gregorian calendar.

You can round the result using the smallestUnit, roundingIncrement, and roundingMode options. These behave as in the Temporal.Duration.round() method. The default is to do no rounding.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit. For some durations, the resulting value may overflow Number.MAX_SAFE_INTEGER and lose precision in its least significant digit(s). Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Example usage:

startOfMoonMission = Temporal.Instant.from('1969-07-16T13:32:00Z');
endOfMoonMission = Temporal.Instant.from('1969-07-24T16:50:35Z');
missionLength = startOfMoonMission.until(endOfMoonMission, { largestUnit: 'hour' });
// => PT195H18M35S
missionLength.toLocaleString();
// example output: '195 hours 18 minutes 35 seconds'

// Rounding, for example if you don't care about the minutes and seconds
approxMissionLength = startOfMoonMission.until(endOfMoonMission, {
largestUnit: 'hour',
smallestUnit: 'hour'
});
// => PT195H

// A billion (10^9) seconds since the epoch in different units
epoch = Temporal.Instant.fromEpochSeconds(0);
billion = Temporal.Instant.fromEpochSeconds(1e9);
epoch.until(billion);
// => PT1000000000S
epoch.until(billion, { largestUnit: 'hour' });
// => PT277777H46M40S
ns = epoch.until(billion, { largestUnit: 'nanosecond' });
// => PT1000000000S
ns.add({ nanoseconds: 1 });
// => PT1000000000S
// (lost precision)

// Calculate the difference in years, eliminating the ambiguity by
// explicitly using the corresponding calendar date in UTC:
epoch.toZonedDateTimeISO('UTC').until(
billion.toZonedDateTimeISO('UTC'),
{ largestUnit: 'year' }
);
// => P31Y8M8DT1H46M40S
instant.since(other: Temporal.Instant | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.Instant or value convertible to one): Another exact time since when to compute the difference.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are the same as for largestUnit. The default is 'nanosecond', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the difference between instant and other.

This method computes the elapsed time before the exact time represented by instant and since the exact time represented by other, optionally rounds it, and returns it as a Temporal.Duration object. If other is later than instant then the resulting duration will be negative.

This method does the same thing as the Temporal.Instant.prototype.until() method, but reversed. The outcome of instant1.since(instant2) is the same as instant1.until(instant2).negated().

Example usage:

// A billion (10^9) seconds since the epoch in different units
epoch = Temporal.Instant.fromEpochSeconds(0);
billion = Temporal.Instant.fromEpochSeconds(1e9);
billion.since(epoch); // => PT1000000000S
instant.round(roundTo: string | object) : Temporal.Instant
Parameters:

roundTo (string | object): A required string or object to control the operation.
If a string is provided, the resulting Temporal.Instant object will be rounded to that unit. Valid values are 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. A string parameter is treated the same as an object whose smallestUnit property value is that string.
If an object is passed, the following properties are recognized:
smallestUnit (required string): The unit to round to. Valid values are 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'halfExpand'.
Returns: a new Temporal.Instant object which is instant rounded to roundTo (if a string parameter is used) or roundingIncrement of smallestUnit (if an object parameter is used).

Rounds instant to the given unit and increment, and returns the result as a new Temporal.Instant object.

The smallestUnit option (or the value of roundTo if a string parameter is used) determines the unit to round to. For example, to round to the nearest minute, use smallestUnit: 'minute'. This option is required.

The roundingIncrement option allows rounding to an integer number of units. For example, to round to increments of a half hour, use smallestUnit: 'minute', roundingIncrement: 30.

The combination of roundingIncrement and smallestUnit must make an increment that divides evenly into 86400 seconds (one 24-hour solar day). (For example, increments of 15 minutes and 45 seconds are both allowed. 25 minutes, and 7 seconds are both not allowed.)

The roundingMode option controls how the rounding is performed.

ceil, expand: Always round up, towards the end of time.
floor, trunc: Always round down, towards the beginning of time.
halfCeil, halfExpand: Round to the nearest of the values allowed by roundingIncrement and smallestUnit. When there is a tie, round up, like ceil.
halfFloor, halfTrunc: Round to the nearest of the allowed values, like halfExpand, but when there is a tie, round down, like floor.
halfEven: Round to the nearest of the allowed values, but when there is a tie, round towards the value that is an even multiple of roundingIncrement. For example, with a roundingIncrement of 2, the number 7 would round up to 8 instead of down to 6, because 8 is an even multiple of 2 (2 × 4 = 8, and 4 is even), whereas 6 is an odd multiple (2 × 3 = 6, and 3 is odd).
Several pairs of modes behave the same as each other, but are both included for consistency with Temporal.Duration.round(), where they are not the same.

The default rounding mode is 'halfExpand' to match how rounding is often taught in school. Note that this is different than the 'trunc' default used by until and since options because rounding up would be an unexpected default for those operations. Other properties behave identically between these methods.

Example usage:

instant = Temporal.Instant.from('2019-03-30T02:45:59.999999999Z');

// Round to a particular unit
instant.round({ smallestUnit: 'second' }); // => 2019-03-30T02:46:00Z
// Round to an increment of a unit, e.g. an hour:
instant.round({ roundingIncrement: 60, smallestUnit: 'minute' });
// => 2019-03-30T03:00:00Z
// Round to the same increment but round down instead:
instant.round({ roundingIncrement: 60, smallestUnit: 'minute', roundingMode: 'floor' });
// => 2019-03-30T02:00:00Z
instant.equals(other: Temporal.Instant | string) : boolean
Parameters:

other (Temporal.Instant or value convertible to one): Another exact time to compare.
Returns: true if instant and other are equal, or false if not.

Compares two Temporal.Instant objects for equality.

This function exists because it's not possible to compare using instant == other or instant === other, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two times occur, then this function may be less typing and more efficient than Temporal.Instant.compare.

If other is not a Temporal.Instant object, then it will be converted to one as if it were passed to Temporal.Instant.from().

Example usage:

one = Temporal.Instant.fromEpochSeconds(1.0e9);
two = Temporal.Instant.fromEpochSeconds(1.1e9);
one.equals(two); // => false
one.equals(one); // => true
instant.toString(options?: object) : string
Parameters:

options (optional object): An object with properties representing options for the operation. The following options are recognized:
timeZone (string or object): the time zone to express instant in, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string. The default is to use UTC.
fractionalSecondDigits (number or string): How many digits to print after the decimal point in the output string. Valid values are 'auto', 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9. The default is 'auto'.
smallestUnit (string): The smallest unit of time to include in the output string. This option overrides fractionalSecondDigits if both are given. Valid values are 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc'.
Returns: a string in the ISO 8601 date format representing instant.

This method overrides the Object.prototype.toString() method and provides a convenient string representation of instant. The string can be passed to Temporal.Instant.from() to create a new Temporal.Instant object.

The output precision can be controlled with the fractionalSecondDigits or smallestUnit option. If no options are given, the default is fractionalSecondDigits: 'auto', which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the roundingMode option, as in Temporal.ZonedDateTime.round(). Note that rounding may change the value of other units as well.

If the timeZone option is not provided or is undefined, then the string will express the date and time in UTC and the Z offset designator will be appended. However, if the timeZone option is given, then the string will express the date and time in the given time zone, and contain the time zone's numeric UTC offset, rounded to the nearest minute.

Example usage:

instant = Temporal.Instant.fromEpochMilliseconds(1574074321816);
instant.toString(); // => '2019-11-18T10:52:01.816Z'
instant.toString({ timeZone: Temporal.TimeZone.from('UTC') });
// => '2019-11-18T10:52:01.816+00:00'
instant.toString({ timeZone: 'Asia/Seoul' });
// => '2019-11-18T19:52:01.816+09:00'

instant.toString({ smallestUnit: 'minute' });
// => '2019-11-18T10:52Z'
instant.toString({ fractionalSecondDigits: 0 });
// => '2019-11-18T10:52:01Z'
instant.toString({ fractionalSecondDigits: 4 });
// => '2019-11-18T10:52:01.8160Z'
instant.toString({ smallestUnit: 'second', roundingMode: 'halfExpand' });
// => '2019-11-18T10:52:02Z'
instant.toLocaleString(locales?: string | array<string>, options?: object) : string
Parameters:

locales (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
options (optional object): An object with properties influencing the formatting.
Returns: a language-sensitive representation of instant.

This method overrides Object.prototype.toLocaleString() to provide a human-readable, language-sensitive representation of instant.

The locales and options arguments are the same as in the constructor to Intl.DateTimeFormat.

Because Temporal.Instant does not carry a time zone, the time zone used for the output will be the timeZone property of options, if present; and otherwise, the current time zone from the environment, which is usually the system's time zone.

This is identical to how the time zone is determined in legacy Date's toLocaleString method.

NOTE: Be careful when calling this method in a server environment, where the server's time zone may be set to UTC.

Example usage:

instant = Temporal.Instant.from('2019-11-18T11:00:00.000Z');
instant.toLocaleString(); // example output: '2019-11-18, 3:00:00 a.m.'
instant.toLocaleString('de-DE'); // example output: '18.11.2019, 03:00:00'
instant.toLocaleString('de-DE', {
timeZone: 'Europe/Berlin',
year: 'numeric',
month: 'numeric',
day: 'numeric',
hour: 'numeric',
minute: 'numeric',
timeZoneName: 'long'
}); // => '18.11.2019, 12:00 Mitteleuropäische Normalzeit'
instant.toLocaleString('en-US-u-nu-fullwide-hc-h12', {
timeZone: 'Asia/Kolkata'
}); // => '１１/１８/２０１９, ４:３０:００ PM'
instant.toJSON() : string
Returns: a string in the ISO 8601 date format representing instant, in the UTC time zone.

This method is like instant.toString() but always produces a string in UTC time. It is usually not called directly, but it can be called automatically by JSON.stringify().

The reverse operation, recovering a Temporal.Instant object from a string, is Temporal.Instant.from(), but it cannot be called automatically by JSON.parse(). If you need to rebuild a Temporal.Instant object from a JSON string, then you need to know the names of the keys that should be interpreted as Temporal.Instants. In that case you can build a custom "reviver" function for your use case.

Example usage:

const meeting = {
id: 355,
name: 'Budget review',
location: 'https://meet.jit.si/ObjectiveTomatoesJokeSurely',
startInstant: Temporal.Instant.from('2020-03-30T15:00-04:00[America/New_York]'),
endInstant: Temporal.Instant.from('2020-03-30T16:00-04:00[America/New_York]')
};
const str = JSON.stringify(meeting, null, 2);
console.log(str);
// =>
// {
// "id": 355,
// "name": "Budget review",
// "location": "https://meet.jit.si/ObjectiveTomatoesJokeSurely",
// "startInstant": "2020-03-30T19:00Z",
// "endInstant": "2020-03-30T20:00Z"
// }

// To rebuild from the string:
function reviver(key, value) {
if (key.endsWith('Instant')) return Temporal.Instant.from(value);
return value;
}
JSON.parse(str, reviver);
instant.valueOf()
This method overrides Object.prototype.valueOf() and always throws an exception. This is because it's not possible to compare Temporal.Instant objects with the relational operators <, <=, >, or >=. Use Temporal.Instant.compare() for this, or instant.equals() for equality.

## Temporal.ZonedDateTime

Table of Contents
A Temporal.ZonedDateTime is a timezone-aware, calendar-aware date/time type that represents a real event that has happened (or will happen) at a particular instant from the perspective of a particular region on Earth. As the broadest Temporal type, Temporal.ZonedDateTime can be considered a combination of Temporal.TimeZone, Temporal.Instant, and Temporal.PlainDateTime (which includes Temporal.Calendar).

As the only Temporal type that persists a time zone, Temporal.ZonedDateTime is optimized for use cases that require a time zone:

Arithmetic automatically adjusts for Daylight Saving Time, using the rules defined in RFC 5545 (iCalendar) and adopted in other libraries like moment.js.
Creating derived values (e.g. change time to 2:30AM) can avoid worrying that the result will be invalid due to the time zone's DST rules.
Properties are available to easily measure attributes like "length of day" or "starting time of day" which may not be the same on all days in all time zones due to DST transitions or political changes to the definitions of time zones.
It's easy to flip back and forth between a human-readable representation (like Temporal.PlainDateTime) and the UTC timeline (like Temporal.Instant) without having to do any work to keep the two in sync.
A date/time, an offset, a time zone, and an optional calendar can be persisted in a single string. This behavior is also be helpful for developers who are not sure which of those components will be needed by later readers of this data.
Multiple time-zone-sensitive operations can be performed in a chain without having to repeatedly provide the same time zone.
A Temporal.ZonedDateTime instance can be losslessly converted into every other Temporal type except Temporal.Duration. Temporal.Instant, Temporal.PlainDateTime, Temporal.PlainDate, Temporal.PlainTime, Temporal.PlainYearMonth, and Temporal.PlainMonthDay all carry less information and can be used when complete information is not required.

The Temporal.ZonedDateTime API is a superset of Temporal.PlainDateTime, which makes it easy to port code back and forth between the two types as needed. Because Temporal.PlainDateTime is not aware of time zones, in use cases where the time zone is known it's recommended to use Temporal.ZonedDateTime which will automatically adjust for DST and can convert easily to Temporal.Instant without having to re-specify the time zone.

Constructor
new Temporal.ZonedDateTime(epochNanoseconds: bigint, timeZone: string | object, calendar: string | object = "iso8601") : Temporal.ZonedDateTime
Parameters:

epochNanoseconds (bigint): A number of nanoseconds.
timeZone (string, Temporal.TimeZone instance, or plain object): The time zone in which the event takes place.
calendar (optional string, Temporal.Calendar instance, or plain object): Calendar used to interpret dates and times.
Returns: a new Temporal.ZonedDateTime object.

Like all Temporal constructors, this constructor is an advanced API used to create instances for a narrow set of use cases. Instead of the constructor, Temporal.ZonedDateTime.from() is preferred instead because it accepts more kinds of input and provides options for handling ambiguity and overflow.

The range of allowed values for this type is the same as the old-style JavaScript Date: 100 million (108) days before or after the Unix epoch. This range covers approximately half a million years. If epochNanoseconds is outside of this range, a RangeError will be thrown.

Usually timeZone will be a string containing the identifier of a built-in time zone, such as 'UTC', 'Europe/Madrid', or '+05:30'. Usually calendar will be a string containing the identifier of a built-in calendar, such as 'islamic' or 'gregory'. Use an object if you need to supply custom calendar or custom time zone behaviour.

Usage examples:

// UNIX epoch in California
new Temporal.ZonedDateTime(0n, 'America/Los_Angeles', 'iso8601');
// => 1969-12-31T16:00:00-08:00[America/Los_Angeles]
new Temporal.ZonedDateTime(0n, 'America/Los_Angeles');
// => 1969-12-31T16:00:00-08:00[America/Los_Angeles]
// same, but shorter
Static methods
Temporal.ZonedDateTime.from(thing: any, options?: object) : Temporal.ZonedDateTime
Parameters:

thing: The value representing the desired date, time, time zone, and calendar.
options (optional object): An object which may have some or all of the following properties:
overflow (string): How to deal with out-of-range values if thing is an object. Allowed values are 'constrain' and 'reject'. The default is 'constrain'.
disambiguation (string): How to disambiguate if the date and time given by zonedDateTime does not exist in the time zone, or exists more than once. Allowed values are 'compatible', 'earlier', 'later', and 'reject'. The default is 'compatible'.
offset (string): How to interpret a provided time zone offset (e.g. -02:00) if it conflicts with the provided time zone (e.g. America/Sao_Paulo). Allowed values are 'use', 'ignore', 'prefer', and 'reject'. The default is 'reject'.
Returns: a new Temporal.ZonedDateTime object.

This static method creates a new Temporal.ZonedDateTime object from another value. If the value is another Temporal.ZonedDateTime object, a new but otherwise identical object will be returned. If the value is any other object, a Temporal.ZonedDateTime will be constructed from the values of any timeZone, year (or era and eraYear), month (or monthCode), day, hour, minute, second, millisecond, microsecond, nanosecond, and/or calendar properties that are present. At least the timeZone, year (or era and eraYear), month (or monthCode), and day properties must be present. Other properties are optional. If calendar is missing, it will be assumed to be 'iso8601' (identifying the ISO 8601 calendar). Any other missing properties will be assumed to be 0 (for time fields).

Date/time values will be interpreted in context of the provided offset and/or time zone, depending on the offset option.

Date/time values in object inputs will be interpreted in the context of calendar. However, date/time values in string inputs are always interpreted in the context of the ISO 8601 calendar.

Any non-object value is converted to a string, which is expected to be an ISO 8601 string that includes a time zone ID in brackets, and an optional calendar. For example:

2020-08-05T20:06:13+09:00[Asia/Tokyo][u-ca=japanese]
If the string isn't valid, then a RangeError will be thrown regardless of the value of overflow.

Note that this string format (albeit limited to the ISO 8601 calendar system) is also used by java.time and some other time-zone-aware libraries. For more information on Temporal's extensions to the ISO 8601 / RFC 3339 string format and the progress towards becoming a published standard, see String Parsing, Serialization, and Formatting.

The time zone ID is always required. 2020-08-05T20:06:13+09:00 and 2020-08-05T11:06:13Z are not valid inputs to this method because they don't include a time zone ID in square brackets. To parse these string formats, use Temporal.Instant:

Temporal.Instant.from('2020-08-05T20:06:13+0900').toZonedDateTimeISO('Asia/Tokyo');
Usually a named IANA time zone like Europe/Paris or America/Los_Angeles is used, but there are cases where adjusting for DST or other time zone offset changes is not desired. For these cases, non-DST-adjusting, single-offset time zones are available, e.g. Etc/GMT-14 through Etc/GMT+12. For historical reasons, signs are reversed between these time zones' names and their offsets. For example, Etc/GMT+8 would be used for cases where the UTC offset is always -08:00, e.g. ocean shipping off the coast of California. If a non-whole-hour single-offset time zone is needed, the offset can be used as the time zone ID of an offset time zone.

Temporal.ZonedDateTime.from('2020-08-05T20:06:13+05:45[+05:45]');
// OR
Temporal.Instant.from('2020-08-05T20:06:13+05:45').toZonedDateTimeISO('+05:45');
// => 2020-08-05T20:06:13+05:45[+05:45]
Note that using Temporal.ZonedDateTime with a single-offset time zone will not adjust for Daylight Saving Time or other time zone changes. Therefore, using offset time zones with Temporal.ZonedDateTime is relatively unusual. Instead of using Temporal.ZonedDateTime with an offset time zone, it may be easier for most use cases to use Temporal.PlainDateTime and/or Temporal.Instant instead.

The overflow option works as follows, if thing is an object:

In 'constrain' mode (the default), any out-of-range values are clamped to the nearest in-range value.
In 'reject' mode, the presence of out-of-range values will cause the function to throw a RangeError.
The overflow option is ignored if thing is a string.

Additionally, if the result is earlier or later than the range of dates that Temporal.PlainDateTime can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

NOTE: Although Temporal does not deal with leap seconds, dates coming from other software may have a second value of 60. In the default 'constrain' mode and when parsing an ISO 8601 string, this will be converted to 59. In 'reject' mode, this function will throw, so if you have to interoperate with times that may contain leap seconds, don't use reject.

If the input contains a time zone offset, in rare cases it's possible for those values to conflict for a particular local date and time. For example, this could happen if the definition of a time zone is changed (e.g. to abolish DST) after storing a Temporal.ZonedDateTime as a string representing a far-future event. If the time zone and offset are in conflict, then the offset option is used to resolve the conflict:

'use': Evaluate date/time values using the time zone offset if it's provided in the input. This will keep the exact time unchanged even if local time will be different than what was originally stored.
'ignore': Never use the time zone offset provided in the input. Instead, calculate the offset from the time zone. This will keep local time unchanged but may result in a different exact time than was originally stored.
'prefer': Evaluate date/time values using the offset if it's valid for this time zone. If the offset is invalid, then calculate the offset from the time zone. This option is rarely used when calling from(). See the documentation of with() for more details about why this option is used.
'reject': Throw a RangeError if the offset is not valid for the provided date and time in the provided time zone.
An example of why offset is needed is Brazil's abolition of DST in 2019. This change meant that previously-stored values for 2020 and beyond might now be ambiguous. For details about problems like this and how to solve them with offset, see Ambiguity Caused by Permanent Changes to a Time Zone Definition.

The offset option is ignored if an offset is not present in the input. In that case, the time zone and the disambiguation option are used to convert date/time values to exact time.

The disambiguation option controls what time zone offset is used when the input time is ambiguous (as in the repeated clock hour after DST ends) or invalid due to offset changes skipping clock time (as in the skipped clock hour after DST starts):

'compatible' (the default): Acts like 'earlier' for backward transitions and 'later' for forward transitions.
'earlier': The earlier of two possible times.
'later': The later of two possible times.
'reject': Throw a RangeError instead.
When interoperating with existing code or services, 'compatible' mode matches the behavior of legacy Date as well as libraries like moment.js, Luxon, and date-fns. This mode also matches the behavior of cross-platform standards like RFC 5545 (iCalendar).

During "skipped" clock time like the hour after DST starts, this method interprets invalid times using the pre-transition time zone offset if 'compatible' or 'later' is used or the post-transition time zone offset if 'earlier' is used. This behavior avoids exceptions when converting nonexistent local time values to Temporal.ZonedDateTime.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see Resolving Ambiguity.

The disambiguation option is only used if there is no offset in the input, or if the offset is ignored by using the offset option as described above. If the offset in the input is used, then there is no ambiguity and the disambiguation option is ignored.

NOTE: The allowed values for the thing.month property start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

Example usage:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00[Africa/Cairo]');
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00[Africa/Cairo][u-ca=islamic]');
zdt = Temporal.ZonedDateTime.from('19951207T032430+0200[Africa/Cairo]');
/_ WRONG _/ zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30'); // => throws RangeError: time zone ID required
/_ WRONG _/ zdt = Temporal.ZonedDateTime.from('1995-12-07T01:24:30Z'); // => throws RangeError: time zone ID required
/_ WRONG _/ zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00'); // => throws RangeError: time zone ID required
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00[+02:00]'); // OK (offset time zone) but rarely used
/_ WRONG _/ zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+03:00[Africa/Cairo]');
// => RangeError: Offset is invalid for '1995-12-07T03:24:30' in 'Africa/Cairo'. Provided: +03:00, expected: +02:00.

zdt = Temporal.ZonedDateTime.from({
timeZone: 'America/Los_Angeles',
year: 1995,
month: 12,
day: 7,
hour: 3,
minute: 24,
second: 30,
millisecond: 0,
microsecond: 3,
nanosecond: 500
}); // => 1995-12-07T03:24:30.0000035-08:00[America/Los_Angeles]

// Different overflow modes
zdt = Temporal.ZonedDateTime.from({ timeZone: 'Europe/Paris', year: 2001, month: 13, day: 1 }, { overflow: 'constrain' })
// => 2001-12-01T00:00:00+01:00[Europe/Paris]
zdt = Temporal.ZonedDateTime.from({ timeZone: 'Europe/Paris', year: 2001, month: 13, day: 1 }, { overflow: 'reject' })
// => throws RangeError
Temporal.ZonedDateTime.compare(one: Temporal.ZonedDateTime, two: Temporal.ZonedDateTime) : number
Parameters:

one (Temporal.ZonedDateTime): First value to compare.
two (Temporal.ZonedDateTime): Second value to compare.
Returns: an integer indicating whether one comes before or after or is equal to two.

−1 if one is less than two
Zero if the two instances describe the same exact instant, ignoring the time zone and calendar
1 if one is greater than two
Comparison uses exact time, not calendar date and clock time, because sorting is almost always based on when events happen in the real world (and note that sorting by clock time may not match the order of actual occurrence near discontinuities such as DST transitions).

Calendars and time zones are also ignored in the comparison for the same reason. For example, this method returns 0 for instances that fall on the same date and time in the ISO 8601 calendar and UTC time zone, even if fields like day or hour do not match due to use of different calendars and/or time zones.

This function can be used to sort arrays of Temporal.ZonedDateTime objects. For example:

arr = [
Temporal.ZonedDateTime.from('2020-02-01T12:30-05:00[America/Toronto]'),
Temporal.ZonedDateTime.from('2020-02-01T12:30-05:00[America/New_York]'),
Temporal.ZonedDateTime.from('2020-02-01T12:30+01:00[Europe/Brussels]'),
Temporal.ZonedDateTime.from('2020-02-01T12:30+00:00[Europe/London]')
];
sorted = arr.sort(Temporal.ZonedDateTime.compare);
JSON.stringify(sorted, undefined, 2);
// =>
// '[
// "2020-02-01T12:30+01:00[Europe/Brussels]",
// "2020-02-01T12:30+00:00[Europe/London]",
// "2020-02-01T12:30-05:00[America/Toronto]",
// "2020-02-01T12:30-05:00[America/New_York]"
// ]'
Note that in unusual cases like the repeated clock hour after DST ends, values that are later in the real world can be earlier in clock time, or vice versa. To sort Temporal.ZonedDateTime values according to clock time only (which is a very rare use case), convert each value to Temporal.PlainDateTime. For example:

one = Temporal.ZonedDateTime.from('2020-11-01T01:45-07:00[America/Los_Angeles]');
two = Temporal.ZonedDateTime.from('2020-11-01T01:15-08:00[America/Los_Angeles]');
Temporal.ZonedDateTime.compare(one, two);
// => -1
// (because `one` is earlier in the real world)
Temporal.PlainDateTime.compare(one.toPlainDateTime(), two.toPlainDateTime());
// => 1
// (because `one` is later in clock time)
Temporal.Instant.compare(one.toInstant(), two.toInstant());
// => -1
// (because `Temporal.Instant` and `Temporal.ZonedDateTime` both compare real-world exact times)
Properties
zonedDateTime.year : number
zonedDateTime.month : number
zonedDateTime.day : number
zonedDateTime.hour: number
zonedDateTime.minute: number
zonedDateTime.second: number
zonedDateTime.millisecond: number
zonedDateTime.microsecond: number
zonedDateTime.nanosecond: number
The above read-only properties allow accessing each component of a date or time individually.

Date unit details:

year is a signed integer representing the number of years relative to a calendar-specific epoch. For calendars that use eras, the anchor is usually aligned with the latest era so that eraYear === year for all dates in that era. However, some calendars like Japanese may use a different anchor.
month is a positive integer representing the ordinal index of the month in the current year. For calendars like Hebrew or Chinese that use leap months, the same-named month may have a different month value depending on the year. The first month in every year has month equal to 1. The last month of every year has month equal to the monthsInYear property. month values start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).
monthCode is a calendar-specific string that identifies the month in a year-independent way. For common (non-leap) months, monthCode should be `M${month}`, where month is zero padded up to two digits. For uncommon (leap) months in lunisolar calendars like Hebrew or Chinese, the month code is the previous month's code with an "L" suffix appended. Examples: 'M02' => February; 'M08L' => repeated 8th month in the Chinese calendar; 'M05L' => Adar I in the Hebrew calendar.
day is a positive integer representing the day of the month.
Either month or monthCode can be used in from or with to refer to the month. Similarly, in calendars that user eras an era/eraYear pair can be used in place of year when calling from or with.

Time unit details:

hour is an integer between 0 and 23
minute is an integer between 0 and 59
second is an integer between 0 and 59. If 60 (for a leap second) was provided to from or with, 59 will stored and will be returned by this property.
millisecond is an integer between 0 and 999
microsecond is an integer between 0 and 999
nanosecond is an integer between 0 and 999
Usage examples:

dt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500[Europe/Rome]');
dt.year; // => 1995
dt.month; // => 12
dt.monthCode; // => 'M12'
dt.day; // => 7
dt.hour; // => 3
dt.minute; // => 24
dt.second; // => 30
dt.millisecond; // => 0
dt.microsecond; // => 3
dt.nanosecond; // => 500

dt = Temporal.ZonedDateTime.from('2019-02-23T03:24:30.000003500[Europe/Rome][u-ca=hebrew]');
dt.year; // => 5779
dt.month; // => 6
dt.monthCode; // => 'M05L'
dt.day; // => 18
dt.hour; // => 3
dt.minute; // => 24
dt.second; // => 30
dt.millisecond; // => 0
dt.microsecond; // => 3
dt.nanosecond; // => 500
NOTE: The possible values for the month property start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

zonedDateTime.epochSeconds: number
zonedDateTime.epochMilliseconds: number
zonedDateTime.epochMicroseconds: bigint
zonedDateTime.epochNanoseconds: bigint
The above read-only properties return the integer number of full seconds, milliseconds, microseconds, or nanoseconds between zonedDateTime and 00:00 UTC on 1970-01-01, otherwise known as the UNIX Epoch.

These properties are equivalent to zonedDateTime.toInstant().epochSeconds, zonedDateTime.toInstant().epochMilliseconds, zonedDateTime.toInstant().epochMicroseconds, zonedDateTime.toInstant().epochNanoseconds, respectively. Any fractional remainders are truncated towards zero. The time zone is irrelevant to these properties, because there is only one epoch, not one per time zone.

Note that the epochSeconds and epochMilliseconds properties are of type number (although only integers are returned) while the epochMicroseconds and epochNanoseconds are of type bigint.

The epochMilliseconds property is the easiest way to construct a legacy Date object from a Temporal.ZonedDateTime instance.

zdt = Temporal.ZonedDateTime.from('2020-02-01T12:30+09:00[Asia/Tokyo]');
epochSecs = zdt.epochSeconds;
// => 1580527800
epochMs = zdt.epochMilliseconds;
// => 1580527800000
zdt.toInstant().epochMilliseconds;
// => 1580527800000
legacyDate = new Date(epochMs);
// => 2020-02-01T03:30:00.000Z
// (if the system time zone is America/Los_Angeles)
epochMicros = zdt.epochMicroseconds;
// => 1580527800000000n
epochNanos = zdt.epochNanoseconds;
// => 1580527800000000000n
zonedDateTime.calendarId : object
The calendarId read-only property gives the identifier of the calendar used to calculate date/time field values. If the date was created with a custom calendar object, this gives the id property of that object.

Calendar-sensitive values are used in most places, including:

Accessing properties like .year or .month
Setting properties using .from() or .with().
Creating Temporal.Duration instances with .since()
Interpreting Temporal.Duration instances with .add() or .subtract()
Localized formatting with toLocaleString(), although if the calendar is ISO then the calendar can be overridden via an option
All other places where date/time values are read or written, except as noted below
Calendar-specific date/time values are NOT used in only a few places:

Extended ISO strings emitted by .toString(), because ISO-string date/time values are, by definition, using the ISO 8601 calendar
In the values returned by the getISOFields() method which is explicitly used to provide ISO 8601 calendar values
In arguments to the Temporal.ZonedDateTime constructor which is used for advanced use cases only
zonedDateTime.timeZoneId : string
The timeZoneId read-only property is the identifier of the persistent time zone of zonedDateTime. If zonedDateTime was created with a custom time zone object, this gives the id property of that object.

By storing its time zone, Temporal.ZonedDateTime is able to use that time zone when deriving other values, e.g. to automatically perform DST adjustment when adding or subtracting time.

Usually, the time zone ID will be an IANA time zone ID. However, in unusual cases, a time zone can also be created from a time zone offset string like +05:30. Offset time zones function just like IANA time zones except that their offset can never change due to DST or political changes. This can be problematic for many use cases because by using an offset time zone you lose the ability to safely derive past or future dates because, even in time zones without DST, offsets sometimes change for political reasons (e.g. countries change their time zone). Therefore, using an IANA time zone is recommended wherever possible.

Time zone identifiers are normalized before being used to determine the time zone. For example, capitalization will be corrected to match the IANA time zone database, and offsets like +01 or +0100 will be converted to +01:00. Link names in the IANA Time Zone Database are not resolved to Zone names.

In very rare cases, you may choose to use UTC as your time zone ID. This is generally not advised because no humans actually live in the UTC time zone; it's just for computers. Also, UTC has no DST and always has a zero offset, which means that any action you'd take with Temporal.ZonedDateTime would return identical results to the same action on Temporal.PlainDateTime or Temporal.Instant. Therefore, you should almost always use Temporal.Instant to represent UTC times. When you want to convert UTC time to a real time zone, that's when Temporal.ZonedDateTime will be useful.

To change the time zone while keeping the exact time constant, use .withTimeZone(timeZone).

The time zone is a required property when creating Temporal.ZonedDateTime instances. If you don't know the time zone of your underlying data, please use Temporal.Instant and/or Temporal.PlainDateTime, neither of which have awareness of time zones.

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
`Time zone is: ${zdt.timeZoneId}`;
// => 'Time zone is: America/Los_Angeles'
zdt.withTimeZone('Asia/Kolkata').timeZoneId;
// => Asia/Kolkata
zdt.withTimeZone('Asia/Calcutta').timeZoneId;
// => Asia/Calcutta (does not follow links in the IANA Time Zone Database)

zdt.withTimeZone('europe/paris').timeZoneId;
// => Europe/Paris (normalized to match IANA Time Zone Database capitalization)

zdt.withTimeZone('+05:00').timeZoneId;
// => +05:00
zdt.withTimeZone('+05').timeZoneId;
// => +05:00 (normalized to ±HH:MM)
zdt.withTimeZone('+0500').timeZoneId;
// => +05:00 (normalized to ±HH:MM)
zonedDateTime.era : string | undefined
zonedDateTime.eraYear : number | undefined
In calendars that use eras, the era and eraYear read-only properties can be used together to resolve an era-relative year. Both properties are undefined when using the ISO 8601 calendar. As inputs to from or with, era and eraYear can be used instead of year. Unlike year, eraYear may decrease as time proceeds because some eras (like the BCE era in the Gregorian calendar) count years backwards.

date = Temporal.ZonedDateTime.from('-000015-01-01T12:30[Europe/Rome][u-ca=gregory]');
date.era;
// => 'bce'
date.eraYear;
// => 16
date.year;
// => -15
zonedDateTime.dayOfWeek : number
The dayOfWeek read-only property gives the weekday number that the date falls on. For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7. For an overview, see ISO 8601 on Wikipedia.

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][zdt.dayOfWeek - 1]; // => 'THU'
zonedDateTime.dayOfYear : number
The dayOfYear read-only property gives the ordinal day of the year that the date falls on. For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
// ISO ordinal date
console.log(zdt.year, zdt.dayOfYear); // => '1995 341'
zonedDateTime.weekOfYear : number
The weekOfYear read-only property gives the ISO week number of the date. For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well. ISO week 1 is the week containing the first Thursday of the year. For more information on ISO week numbers, see for example the Wikipedia article on ISO week date.

When combining the week number with a year number, make sure to use zonedDateTime.yearOfWeek instead of zonedDateTime.year. This is because the first few days of a calendar year may be part of the last week of the previous year, and the last few days of a calendar year may be part of the first week of the new year, depending on which year the first Thursday falls in.

Usage example:

zdt = Temporal.ZonedDateTime.from('2022-01-01T03:24-08:00[America/Los_Angeles]');
// ISO week date
console.log(zdt.yearOfWeek, zdt.weekOfYear, zdt.dayOfWeek); // => '2021 52 6'
zonedDateTime.yearOfWeek : number
The yearOfWeek read-only property gives the ISO "week calendar year" of the date, which is the year number corresponding to the ISO week number. For the ISO 8601 calendar, this is normally the same as zonedDateTime.year, but in a few cases it may be the previous or following year. For more information on ISO week numbers, see for example the Wikipedia article on ISO week date.

See weekOfYear for a usage example.

zonedDateTime.daysInWeek : number
The daysInWeek read-only property gives the number of days in the week that the date falls in. For the ISO 8601 calendar, this is always 7, but in other calendar systems it may differ from week to week.

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
zdt.daysInWeek; // => 7
zonedDateTime.daysInMonth : number
The daysInMonth read-only property gives the number of days in the month that the date falls in. For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
const zdt = Temporal.Now.zonedDateTimeISO().with({ month });
monthsByDays[zdt.daysInMonth] = (monthsByDays[zdt.daysInMonth] || []).concat(zdt);
}

const strings = monthsByDays[30].map((zdt) => zdt.toLocaleString('en', { month: 'long' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
zonedDateTime.daysInYear : number
The daysInYear read-only property gives the number of days in the year that the date falls in. For the ISO 8601 calendar, this is 365 or 366, depending on whether the year is a leap year.

Usage example:

zdt = Temporal.Now.zonedDateTimeISO();
percent = zdt.dayOfYear / zdt.daysInYear;
`The year is ${percent.toLocaleString('en', { style: 'percent' })} over!`;
// example output: "The year is 10% over!"
zonedDateTime.monthsInYear: number
The monthsInYear read-only property gives the number of months in the year that the date falls in. For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

zdt = Temporal.ZonedDateTime.from('1900-01-01T12:00+09:00[Asia/Tokyo]');
zdt.monthsInYear; // => 12
zonedDateTime.inLeapYear : boolean
The inLeapYear read-only property tells whether the year of this Temporal.ZonedDateTime is a leap year. Its value is true if the year is a leap year, and false if not.

NOTE: A "leap year" is a year that contains more days than other years (for solar or lunar calendars) or more months than other years (for lunisolar calendars like Hebrew or Chinese). In the ISO 8601 calendar, a year is a leap year (and has exactly one extra day, February 29) if it is evenly divisible by 4 but not 100 or if it is evenly divisible by 400.

Usage example:

// Is this year a leap year?
zdt = Temporal.Now.zonedDateTimeISO();
zdt.inLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
zdt.with({ year: 2100 }).inLeapYear; // => false
zonedDateTime.hoursInDay : number
The hoursInDay read-only property returns the number of real-world hours between the start of the current day (usually midnight) in zonedDateTime.timeZone to the start of the next calendar day in the same time zone. Normally days will be 24 hours long, but on days where there are DST changes or other time zone transitions, this property may return 23 or 25. In rare cases, other integers or even non-integer values may be returned, e.g. when time zone definitions change by less than one hour.

If a time zone offset transition happens exactly at midnight, the transition will impact the previous day's length.

Note that transitions that skip entire days (like the 2011 change of Pacific/Apia to the opposite side of the International Date Line) will return 24 because there are 24 real-world hours between one day's midnight and the next day's midnight.

Usage example:

Temporal.ZonedDateTime.from('2020-01-01T12:00-08:00[America/Los_Angeles]').hoursInDay;
// => 24
// (normal day)
Temporal.ZonedDateTime.from('2020-03-08T12:00-07:00[America/Los_Angeles]').hoursInDay;
// => 23
// (DST starts on this day)
Temporal.ZonedDateTime.from('2020-11-01T12:00-08:00[America/Los_Angeles]').hoursInDay;
// => 25
// (DST ends on this day)
zonedDateTime.offsetNanoseconds : number
The offsetNanoseconds read-only property is the offset (in nanoseconds) relative to UTC of zonedDateTime.

The value of this field will change after DST transitions or after political changes to a time zone, e.g. a country switching to a new time zone.

To change the offset using with (or from using an property bag object instead of a string), use the string-typed offset field. The numeric offsetNanoseconds field is read-only and is ignored in with and from.

zdt = Temporal.ZonedDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]');
zdt.offsetNanoseconds;
// => -25200000000000
// (-7 _ 3600 _ 1e9)
zonedDateTime.offset : string
The offset read-only property is the offset (formatted as a string) relative to UTC of the current time zone and exact instant. Examples: '-08:00' or '+05:30'

The format used is defined in the ISO 8601 standard.

The value of this field will change after DST transitions or after political changes to a time zone, e.g. a country switching to a new time zone.

This field is used to uniquely map date/time fields to an exact date/time in cases where the calendar date and clock time are ambiguous due to time zone offset transitions. Therefore, this field is accepted by from and with. The presence of this field means that zonedDateTime.toInstant() requires no parameters.

zdt = Temporal.ZonedDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]');
zdt.offset;
// => '-07:00'
zdt.withTimeZone('Asia/Kolkata').offset;
// => '+05:30'

minus8Hours = '-08:00';
daylightTime0130 = Temporal.ZonedDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]');
// => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
// This is Pacific Daylight Time 1:30AM
repeated0130 = daylightTime0130.with({ offset: minus8Hours });
// => 2020-11-01T01:30:00-08:00[America/Los_Angeles]
// This is Pacific Standard Time 1:30AM
Methods
zonedDateTime.with(zonedDateTimeLike: object, options?: object) : Temporal.ZonedDateTime
Parameters:

zonedDateTimeLike (object): an object with some of the properties of a Temporal.ZonedDateTime (including offset, but not timeZone or calendar).
options (optional object): An object which may have some or all of the following properties:
overflow (string): How to deal with out-of-range values. Allowed values are 'constrain' and 'reject'. The default is 'constrain'.
disambiguation (string): How to handle date/time values that are ambiguous or invalid due to DST or other time zone offset changes. Allowed values are 'compatible', 'earlier', 'later', and 'reject'. The default is 'compatible'.
offset (string): How to handle conflicts between time zone offset and time zone. Allowed values are 'prefer', 'use', 'ignore', and 'reject'. The default is 'prefer'.
Returns: a new Temporal.ZonedDateTime object.

This method creates a new Temporal.ZonedDateTime which is a copy of zonedDateTime, but any properties present on zonedDateTimeLike override the ones already present on zonedDateTime.

Since Temporal.ZonedDateTime objects each represent a fixed date and time, this method will create a new instance instead of modifying the existing instance.

If the result is earlier or later than the range of dates that Temporal.ZonedDateTime can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

NOTE: The allowed values for the zonedDateTimeLike.month property start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

If a timeZone or calendar property is included, this function will throw an exception. To convert to a new time zone while updating the clock time, use the withTimeZone() method, and to keep clock time as-is while resetting the time zone, use the .toPlainDateTime() method instead. Examples:

// update local time to match new time zone
const sameInstantInOtherTz = zdt.withTimeZone('Europe/London');
// create instance with same local time in a new time zone
const newTzSameLocalTime = zdt.toPlainDateTime().toZonedDateTime('Europe/London');
Some input values can cause conflict between zonedDateTime's time zone and its UTC offset. This can happen when offset is included in the input, and can also happen when setting date/time values on the opposite side of a time zone offset transition like DST starting or ending. The offset option can resolve this conflict.

Unlike the from() method where offset defaults to 'reject', the offset option in with defaults to 'prefer'. This default prevents DST disambiguation from causing unexpected one-hour changes in exact time after making small changes to clock time fields. For example, if a Temporal.ZonedDateTime is set to the "second" 1:30AM on a day where the 1-2AM clock hour is repeated after a backwards DST transition, then calling .with({minute: 45}) will result in an ambiguity which is resolved using the default offset: 'prefer' option. Because the existing offset is valid for the new time, it will be retained so the result will be the "second" 1:45AM. However, if the existing offset is not valid for the new result (e.g. .with({hour: 0})), then the default behavior will change the offset to match the new local time in that time zone.

If the offset option is set to 'ignore' (or in very rare cases when 'prefer' is used), then the object's current time zone and the disambiguation option determine the offset is used for times that are ambiguous due to DST and other time zone offset transitions. Otherwise, the offset option determines the offset during skipped or repeated clock times and the disambiguation option is ignored.

Other than the offset option behaviors noted above, options on with behave identically to options on from. See the documentation of from for more details on options behavior.

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:00-06:00[America/Chicago]');
zdt.with({ year: 2015, minute: 31 }); // => 2015-12-07T03:31:00-06:00[America/Chicago]
zonedDateTime.withPlainTime(plainTime?: object | string) : Temporal.PlainDateTime
Parameters:

plainTime (optional Temporal.PlainTime or plain object or string): The clock time that should replace the current clock time of zonedDateTime. If omitted, the clock time of the result will be 00:00:00.
Returns: a new Temporal.ZonedDateTime object which replaces the clock time of zonedDateTime with the clock time represented by plainTime.

Valid input to withPlainTime is the same as valid input to Temporal.PlainTime.from, including strings like 12:15:36, plain object property bags like { hour: 20, minute: 30 }, or Temporal objects that contain time fields: Temporal.PlainTime, Temporal.ZonedDateTime, or Temporal.PlainDateTime.

This method is similar to with, but with a few important differences:

withPlainTime accepts strings, Temporal objects, or object property bags. with only accepts object property bags and does not accept strings nor Temporal.PlainTime objects because they can contain calendar information.
withPlainTime will default all missing time units to zero, while with will only change units that are present in the input object.
withPlainTime does not accept options like disambiguation or offset. For fine-grained control, use with.
If plainTime is a Temporal.PlainTime object, then this method returns the same result as plainTime.toZonedDateTime({ plainTime: zonedDateTime, timeZone: zonedDateTime}) but can be easier to use, especially when chained to previous operations that return a Temporal.ZonedDateTime.

Usage example:

zdt = Temporal.ZonedDateTime.from('2015-12-07T03:24:30.000003500-08:00[America/Los_Angeles]');
zdt.withPlainTime({ hour: 10 }); // => 2015-12-07T10:00:00-08:00[America/Los_Angeles]
time = Temporal.PlainTime.from('11:22');
zdt.withPlainTime(time); // => 2015-12-07T11:22:00-08:00[America/Los_Angeles]
zdt.withPlainTime('12:34'); // => 2015-12-07T12:34:00-08:00[America/Los_Angeles]

// easier for chaining
zdt.add({ days: 2, hours: 22 }).withPlainTime('00:00'); // => 2015-12-10T00:00:00-08:00[America/Los_Angeles]
zonedDateTime.withPlainDate(plainDate: object | string) : Temporal.ZonedDateTime
Parameters:

plainDate (Temporal.PlainDate or plain object or string): The calendar date that should replace the current calendar date of zonedDateTime.
Returns: a new Temporal.ZonedDateTime object which replaces the calendar date of zonedDateTime with the calendar date represented by plainDate.

Valid input to withPlainDate is the same as valid input to Temporal.PlainDate.from, including strings like 2000-03-01, plain object property bags like { year: 2020, month: 3, day: 1 }, or Temporal objects that contain a year, month, and day property, including Temporal.PlainDate, Temporal.ZonedDateTime, or Temporal.PlainDateTime.

All three date units (year, month, and day) are required. Temporal.YearMonth and Temporal.MonthDay are not valid input because they lack all date units. Both of those types have a toPlainDate method that can be used to obtain a Temporal.PlainDate which can in turn be used as input to withPlainDate.

If plainDate contains a non-ISO 8601 calendar, then the result of withPlainDate will be the calendar of plainDate. However, if zonedDateTime.calendar is already a non-ISO 8601 calendar, then this method will throw a RangeError. To resolve the error, first convert one of the instances to the same calendar or the ISO 8601 calendar, e.g. using .withCalendar('iso8601').

This method is similar to with, but with a few important differences:

withPlainDate accepts strings, Temporal objects, or object property bags. with only accepts object property bags and does not accept strings nor Temporal.PlainDate objects because they can contain calendar information.
withPlainDate will update all date units, while with only changes individual units that are present in the input, e.g. setting the day to 1 while leaving month and year unchanged.
withPlainDate does not accept options like disambiguation or offset. For fine-grained control, use with.
If plainDate is a Temporal.PlainDate object, then this method returns the same result as plainDate.toZonedDateTime({ plainDate: zonedDateTime, timeZone: zonedDateTime}) but can be easier to use, especially when chained to previous operations that return a Temporal.ZonedDateTime.

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30-08:00[America/Los_Angeles]');
zdt.withPlainDate({ year: 2000, month: 6, day: 1 }); // => 2000-06-01T03:24:30-07:00[America/Los_Angeles]
date = Temporal.PlainDate.from('2020-01-23');
zdt.withPlainDate(date); // => 2020-01-23T03:24:30-08:00[America/Los_Angeles]
zdt.withPlainDate('2018-09-15'); // => 2018-09-15T03:24:30-07:00[America/Los_Angeles]

// easier for chaining
zdt.add({ hours: 12 }).withPlainDate('2000-06-01'); // => 2000-06-01T15:24:30-07:00[America/Los_Angeles]

// result contains a non-ISO calendar if present in the input
zdt.withCalendar('japanese').withPlainDate('2008-09-06'); // => 2008-09-06T03:24:30-07:00[America/Los_Angeles][u-ca=japanese]
zdt.withPlainDate('2017-09-06[u-ca=japanese]'); // => 2017-09-06T03:24:30-07:00[America/Los_Angeles][u-ca=japanese]
/_ WRONG _/ zdt.withCalendar('japanese').withPlainDate('2017-09-06[u-ca=hebrew]'); // => RangeError (calendar conflict)
zonedDateTime.withTimeZone(timeZone: object | string) : Temporal.ZonedDateTime
Parameters:

timeZone (Temporal.TimeZone or plain object or string): The time zone into which to project zonedDateTime.
Returns: a new Temporal.ZonedDateTime object which is the date indicated by zonedDateTime, projected into timeZone.

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+09:00[Asia/Tokyo]');
zdt.toString(); // => '1995-12-07T03:24:30+09:00[Asia/Tokyo]'
zdt.withTimeZone('Africa/Accra').toString(); // => '1995-12-06T18:24:30+00:00[Africa/Accra]'
zonedDateTime.withCalendar(calendar: object | string) : Temporal.ZonedDateTime
Parameters:

calendar (Temporal.Calendar or plain object or string): The calendar into which to project zonedDateTime.
Returns: a new Temporal.ZonedDateTime object which is the date indicated by zonedDateTime, projected into calendar.

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+09:00[Asia/Tokyo][u-ca=japanese]');
`${zdt.era} ${zdt.eraYear}`; // => 'heisei 7'
zdt.withCalendar('gregory').eraYear; // => 1995
zonedDateTime.add(duration: object, options?: object) : Temporal.ZonedDateTime
Parameters:

duration (object): A Temporal.Duration object or a duration-like object.
options (optional object): An object which may have some or all of the following properties:
overflow (string): How to deal with additions that result in out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.ZonedDateTime object representing the sum of zonedDateTime plus duration.

This method adds duration to zonedDateTime.

The duration argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a Temporal.Duration object. Adding a negative duration like { hours: -5, minutes: -30 } is equivalent to subtracting the absolute value of that duration.

Addition and subtraction are performed according to rules defined in RFC 5545 (iCalendar):

Add/subtract the date portion of a duration using calendar arithmetic (like Temporal.PlainDateTime). The result will automatically adjust for Daylight Saving Time using the rules of this instance's timeZone field.
Add/subtract the time portion of a duration using real-world time (like Temporal.Instant).
If a result is ambiguous or invalid due to a time zone offset transition, the later of the two possible instants will be used for time-skipped transitions and the earlier of the two possible instants will be used for time-repeated transitions. This behavior corresponds to the default disambiguation: 'compatible' option used in from and used by legacy Date and moment.js.
These rules make arithmetic with Temporal.ZonedDateTime "DST-safe", which means that the results most closely match the expectations of both real-world users and implementers of other standards-compliant calendar applications. These expectations include:

Adding or subtracting days should keep clock time consistent across DST transitions. For example, if you have an appointment on Saturday at 1:00PM and you ask to reschedule it 1 day later, you would expect the reschedule appointment to still be at 1:00PM, even if there was a DST transition overnight.
Adding or subtracting the time portion of a duration should ignore DST transitions. For example, a friend you've asked to meet in in 2 hours will be annoyed if you show up 1 hour or 3 hours later.
There should be a consistent and relatively-unsurprising order of operations.
If results are at or near a DST transition, ambiguities should be handled automatically (no crashing) and deterministically.
Some arithmetic operations may be ambiguous, e.g. because months have different lengths. For example, adding one month to August 31 would result in September 31, which doesn't exist. For these cases, the overflow option tells what to do:

In 'constrain' mode (the default), out-of-range values are clamped to the nearest in-range value.
In 'reject' mode, a result that would be out of range causes a RangeError to be thrown.
Additionally, if the result is earlier or later than the range of dates that Temporal.ZonedDateTime can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

Usage example:

zdt = Temporal.ZonedDateTime.from('2020-03-08T00:00-08:00[America/Los_Angeles]');
// Add a day to get midnight on the day after DST starts
laterDay = zdt.add({ days: 1 });
// => 2020-03-09T00:00:00-07:00[America/Los_Angeles]
// Note that the new offset is different, indicating the result is adjusted for DST.
laterDay.since(zdt, { largestUnit: 'hour' }).hours;
// => 23
// because one clock hour lost to DST

laterHours = zdt.add({ hours: 24 });
// => 2020-03-09T01:00:00-07:00[America/Los_Angeles]
// Adding time units doesn't adjust for DST. Result is 1:00AM: 24 real-world
// hours later because a clock hour was skipped by DST.
laterHours.since(zdt, { largestUnit: 'hour' }).hours; // => 24
zonedDateTime.subtract(duration: object, options?: object) : Temporal.ZonedDateTime
Parameters:

duration (object): A Temporal.Duration object or a duration-like object.
options (optional object): An object which may have some or all of the following properties:
overflow (string): How to deal with additions that result in out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.ZonedDateTime object representing the result of zonedDateTime minus duration.

This method subtracts a duration from zonedDateTime.

The duration argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a Temporal.Duration object. Subtracting a negative duration like { hours: -5, minutes: -30 } is equivalent to adding the absolute value of that duration.

Addition and subtraction are performed according to rules defined in RFC 5545 (iCalendar), as described above in add().

Some arithmetic operations may be ambiguous, e.g. because months have different lengths. For example, subtracting one month from October 31 would result in September 31, which doesn't exist. For these cases, the overflow option tells what to do:

In 'constrain' mode (the default), out-of-range values are clamped to the nearest in-range value.
In 'reject' mode, a result that would be out of range causes a RangeError to be thrown.
Additionally, if the result is earlier or later than the range of dates that Temporal.ZonedDateTime can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

Usage example:

zdt = Temporal.ZonedDateTime.from('2020-03-09T00:00-07:00[America/Los_Angeles]');
// Add a day to get midnight on the day after DST starts
earlierDay = zdt.subtract({ days: 1 });
// => 2020-03-08T00:00:00-08:00[America/Los_Angeles]
// Note that the new offset is different, indicating the result is adjusted for DST.
earlierDay.since(zdt, { largestUnit: 'hour' }).hours;
// => -23
// because one clock hour lost to DST

earlierHours = zdt.subtract({ hours: 24 });
// => 2020-03-07T23:00:00-08:00[America/Los_Angeles]
// Subtracting time units doesn't adjust for DST. Result is 11:00PM: 24 real-world
// hours earlier because a clock hour was skipped by DST.
earlierHours.since(zdt, { largestUnit: 'hour' }).hours; // => -24
zonedDateTime.until(other: Temporal.ZonedDateTime, options?: object) : Temporal.Duration
Parameters:

other (Temporal.LocalZonedDateTime): Another date/time until when to compute the difference.
options (optional object): An object which may have some or all of the following properties:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'nanosecond', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the elapsed time after zonedDateTime and until other.

This method computes the difference between the two times represented by zonedDateTime and other, optionally rounds it, and returns it as a Temporal.Duration object. If other is earlier than zonedDateTime then the resulting duration will be negative. If using the default options, adding the returned Temporal.Duration to zonedDateTime will yield other.

The largestUnit option controls how the resulting duration is expressed. The returned Temporal.Duration object will not have any nonzero fields that are larger than the unit in largestUnit. For example, a difference of two hours will become 7200 seconds when largestUnit is "seconds". However, a difference of 30 seconds will still be 30 seconds if largestUnit is "hours". A value of 'auto' means 'hour', unless smallestUnit is 'year', 'month', 'week', or 'day', in which case largestUnit is equal to smallestUnit.

You can round the result using the smallestUnit, roundingIncrement, and roundingMode options. These behave as in the Temporal.Duration.round() method, but increments of days and larger are allowed. Because rounding to an increment expressed in days or larger units requires a reference point, zonedDateTime is used as the starting point in that case. The default is to do no rounding.

The duration returned is a "hybrid" duration. This means that the duration's date portion represents full calendar days like Temporal.PlainDateTime.prototype.until() would return, while its time portion represents real-world elapsed time like Temporal.Instant.prototype.until() would return. This "hybrid duration" approach automatically adjusts for DST and matches widely-adopted industry standards like RFC 5545 (iCalendar). It also matches the behavior of popular JavaScript libraries like moment.js and date-fns.

Examples:

Difference between 2:30AM on the day before DST starts and 3:30AM on the day DST starts => P1DT1H (even though it's only 24 hours of real-world elapsed time)
Difference between 1:45AM on the day before DST starts and the "second" 1:15AM on the day DST ends => PT24H30M (because it hasn't been a full calendar day even though it's been 24.5 real-world hours).
If largestUnit is 'hour' or smaller, then the result will be the same as if Temporal.Instant.prototype.until() was used. If both values have the same local time, then the result will be the same as if Temporal.PlainDateTime.prototype.until() was used. To calculate the difference between calendar dates only, use .toPlainDate().until(other.toPlainDate()). To calculate the difference between clock times only, use .toPlainTime().until(other.toPlainTime()).

If the other Temporal.ZonedDateTime is in a different time zone, then the same days can be different lengths in each time zone, e.g. if only one of them observes DST. Therefore, a RangeError will be thrown if largestUnit is 'day' or larger and the two instances' time zones are not equal, using the same equality algorithm as Temporal.TimeZone.prototype.equals. To work around this same-time-zone requirement, transform one of the instances to the other's time zone using .withTimeZone(other.timeZone) and then calculate the same-timezone difference. Because of the complexity and ambiguity involved in cross-timezone calculations involving days or larger units, 'hour' is the default for largestUnit.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit. For some durations, the resulting value may overflow Number.MAX_SAFE_INTEGER and lose precision in its least significant digit(s). Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Computing the difference between two dates in different calendar systems is not supported. If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with zonedDateTime.withCalendar.

Usage example:

zdt1 = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+05:30[Asia/Kolkata]');
zdt2 = Temporal.ZonedDateTime.from('2019-01-31T15:30+05:30[Asia/Kolkata]');
zdt1.until(zdt2);
// => PT202956H5M29.9999965S
zdt1.until(zdt2, { largestUnit: 'year' });
// => P23Y1M24DT12H5M29.9999965S
zdt2.until(zdt1, { largestUnit: 'year' });
// => -P23Y1M24DT12H5M29.9999965S
zdt1.until(zdt2, { largestUnit: 'nanosecond' });
// => PT730641929.999996544S
// (precision lost)

// Rounding, for example if you don't care about sub-seconds
zdt1.until(zdt2, { smallestUnit: 'second' });
// => PT202956H5M29S

// Months and years can be different lengths
[jan1, feb1, mar1] = [1, 2, 3].map((month) =>
Temporal.ZonedDateTime.from({ year: 2020, month, day: 1, timeZone: 'Asia/Seoul' })
);
jan1.until(feb1, { largestUnit: 'day' }); // => P31D
jan1.until(feb1, { largestUnit: 'month' }); // => P1M
feb1.until(mar1, { largestUnit: 'day' }); // => P29D
feb1.until(mar1, { largestUnit: 'month' }); // => P1M
jan1.until(mar1, { largestUnit: 'day' }); // => P60D
zonedDateTime.since(other: Temporal.ZonedDateTime, options?: object) : Temporal.Duration
Parameters:

other (Temporal.LocalZonedDateTime): Another date/time since when to compute the difference.
options (optional object): An object which may have some or all of the following properties:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'nanosecond', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the elapsed time before zonedDateTime and since other.

This method computes the difference between the two times represented by zonedDateTime and other, optionally rounds it, and returns it as a Temporal.Duration object. If other is later than zonedDateTime then the resulting duration will be negative.

This method is similar to Temporal.ZonedDateTime.prototype.until(), but reversed. If using the default options, subtracting the returned Temporal.Duration from zonedDateTime will yield other, and zdt1.since(zdt2) will yield the same result as zdt1.until(zdt2).negated().

Usage example:

zdt1 = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+05:30[Asia/Kolkata]');
zdt2 = Temporal.ZonedDateTime.from('2019-01-31T15:30+05:30[Asia/Kolkata]');
zdt2.since(zdt1); // => PT202956H5M29.9999965S
zonedDateTime.round(roundTo: string | object) : Temporal.ZonedDateTime
Parameters:

roundTo (string | object): A required string or object to control the operation.
If a string is provided, the resulting Temporal.ZonedDateTime object will be rounded to that unit. Valid values are 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. A string parameter is treated the same as an object whose smallestUnit property value is that string.
If an object is passed, the following properties are recognized:
smallestUnit (required string): The unit to round to. Valid values are 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'halfExpand'.
Returns: a new Temporal.ZonedDateTime object which is zonedDateTime rounded to roundTo (if a string parameter is used) or roundingIncrement of smallestUnit (if an object parameter is used).

Rounds zonedDateTime to the given unit and increment, and returns the result as a new Temporal.ZonedDateTime object.

The smallestUnit option (or the value of roundTo if a string parameter is used) determines the unit to round to. For example, to round to the nearest minute, use smallestUnit: 'minute'. This option is required.

The roundingIncrement option allows rounding to an integer number of units. For example, to round to increments of a half hour, use { smallestUnit: 'minute', roundingIncrement: 30 }.

The value given as roundingIncrement must divide evenly into the next highest unit after smallestUnit, and must not be equal to it. (For example, if smallestUnit is 'minute', then the number of minutes given by roundingIncrement must divide evenly into 60 minutes, which is one hour. The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30. Instead of 60 minutes, use 1 hour.)

If smallestUnit is 'day', then 1 is the only allowed value for roundingIncrement.

The roundingMode option controls how the rounding is performed.

'ceil', 'expand': Always round up, towards the end of time.
'floor', 'trunc': Always round down, towards the beginning of time.
'halfCeil', 'halfExpand': Round to the nearest of the values allowed by roundingIncrement and smallestUnit. When there is a tie, round up, like 'ceil'.
'halfFloor', 'halfTrunc': Round to the nearest of the allowed values, like 'halfExpand', but when there is a tie, round down, like 'floor'.
'halfEven': Round to the nearest of the allowed values, but when there is a tie, round towards the value that is an even multiple of roundingIncrement. For example, with a roundingIncrement of 2, the number 7 would round up to 8 instead of down to 6, because 8 is an even multiple of 2 (2 × 4 = 8, and 4 is even), whereas 6 is an odd multiple (2 × 3 = 6, and 3 is odd).
Several pairs of modes behave the same as each other, but are both included for consistency with Temporal.Duration.round(), where they are not the same.

The default rounding mode is 'halfExpand' to match how rounding is often taught in school. Note that this is different than the 'trunc' default used by until and since options because rounding up would be an unexpected default for those operations. Other properties behave identically between these methods.

Example usage:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500-08:00[America/Los_Angeles]');

// Round to a particular unit
zdt.round({ smallestUnit: 'hour' });
// => 1995-12-07T03:00:00-08:00[America/Los_Angeles]
// Round to an increment of a unit, e.g. half an hour:
zdt.round({ roundingIncrement: 30, smallestUnit: 'minute' });
// => 1995-12-07T03:30:00-08:00[America/Los_Angeles]
// Round to the same increment but round down instead:
zdt.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'floor' });
// => 1995-12-07T03:00:00-08:00[America/Los_Angeles]
zonedDateTime.startOfDay() : Temporal.ZonedDateTime
Returns: A new Temporal.ZonedDateTime instance representing the earliest valid local clock time during the current calendar day and time zone of zonedDateTime.

This method returns a new Temporal.ZonedDateTime indicating the start of the day. The local time of the result is almost always 00:00, but in rare cases it could be a later time e.g. if DST starts at midnight in a time zone. For example:

const zdt = Temporal.ZonedDateTime.from('2015-10-18T12:00-02:00[America/Sao_Paulo]');
zdt.startOfDay(); // => 2015-10-18T01:00:00-02:00[America/Sao_Paulo]
Usage example:

zdt = Temporal.ZonedDateTime.from('2020-01-01T12:00-08:00[America/Los_Angeles]').startOfDay();
// => 2020-01-01T00:00:00-08:00[America/Los_Angeles]
zdt = Temporal.ZonedDateTime.from('2018-11-04T12:00-02:00[America/Sao_Paulo]').startOfDay();
// => 2018-11-04T01:00:00-02:00[America/Sao_Paulo]
// Note the 1:00AM start time because the first clock hour was skipped due to DST transition
// that started at midnight.
zonedDateTime.equals(other: Temporal.ZonedDateTime) : boolean
Parameters:

other (Temporal.ZonedDateTime): Another date/time to compare.
Returns: true if zonedDateTime and other are have equivalent fields (date/time fields, offset, time zone ID, and calendar ID), or false if not.

Compares two Temporal.ZonedDateTime objects for equality.

This function exists because it's not possible to compare using zonedDateTime == other or zonedDateTime === other, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which two events occur, then this function is easier to use than Temporal.ZonedDateTime.compare. However, there are subtle differences between the two methods—a true result from equals includes comparison of calendar and time zone, and is therefore stronger than a 0 result from compare (which ignores calendar and time zone).

Note that two Temporal.ZonedDateTime instances can have the same clock time, time zone, and calendar but still be unequal, e.g. when a clock hour is repeated after DST ends in the Fall. In this case, the two instances will have different offsetNanoseconds field values.

To ignore calendars, convert both instances to use the ISO 8601 calendar:

zdt.withCalendar('iso8601').equals(other.withCalendar('iso8601'));
To ignore both time zones and calendars, compare the instants of both:

zdt.toInstant().equals(other.toInstant());
Example usage:

zdt1 = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+01:00[Europe/Paris]');
zdt2 = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+01:00[Europe/Brussels]');
zdt1.equals(zdt2); // => false (same offset but different time zones)
zdt1.equals(zdt1); // => true
zonedDateTime.toString(options?: object) : string
Parameters:

options (optional object): An object with properties influencing the formatting. The following options are recognized:
offset (string): Whether to show the time zone offset in the return value. Valid values are 'auto' and 'never'. The default is 'auto'.
timeZoneName (string): Whether to show the time zone name annotation in the return value. Valid values are 'auto', 'never', and 'critical'. The default is 'auto'.
calendarName (string): Whether to show the calendar annotation in the return value. Valid values are 'auto', 'always', 'never', and 'critical'. The default is 'auto'.
fractionalSecondDigits (number or string): How many digits to print after the decimal point in the output string. Valid values are 'auto', 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9. The default is 'auto'.
smallestUnit (string): The smallest unit of time to include in the output string. This option overrides fractionalSecondDigits if both are given. Valid values are 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc'.
Returns: a string containing an ISO 8601 date+time+offset format, a bracketed time zone suffix, and (if the calendar is not iso8601) a calendar suffix.

Examples:

2011-12-03T10:15:30+01:00[Europe/Paris]
2011-12-03T10:15:30+09:00[Asia/Tokyo][u-ca=japanese]
This method overrides the Object.prototype.toString() method and provides a convenient string representation of zonedDateTime. The string is "round-trippable". This means that it can be passed to Temporal.ZonedDateTime.from() to create a new Temporal.ZonedDateTime object with the same field values as the original.

The output precision can be controlled with the fractionalSecondDigits or smallestUnit option. If no options are given, the default is fractionalSecondDigits: 'auto', which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the roundingMode option, as in Temporal.PlainDateTime.round(). Note that rounding may change the value of other units as well.

Normally, a calendar annotation is shown when zonedDateTime's calendar is not the ISO 8601 calendar. By setting the calendarName option to 'always' or 'never' this can be overridden to always or never show the annotation, respectively. Normally not necessary, a value of 'critical' is equivalent to 'always' but the annotation will contain an additional ! for certain interoperation use cases. For more information on the calendar annotation, see ISO string extensions.

Likewise, passing 'never' to the timeZoneName or offset options controls whether the time zone offset (+01:00) or name annotation ([Europe/Paris]) are shown. If the time zone offset is shown, it is always shown rounded to the nearest minute. The timeZoneName option can additionally be 'critical' which will add an additional ! to the annotation, similar to calendarName.

The string format output by this method can be parsed by java.time.ZonedDateTime as long as the calendar annotation is not output and 'critical' is not used. For more information on Temporal's extensions to the ISO 8601 / RFC 3339 string format and the progress towards becoming a published standard, see String Parsing, Serialization, and Formatting.

Example usage:

zdt = Temporal.ZonedDateTime.from({ year: 2019, month: 12, day: 1, hour: 12, timeZone: 'Africa/Lagos' });
zdt.toString(); // => '2019-12-01T12:00:00+01:00[Africa/Lagos]'
zdt = zdt.withCalendar('japanese');
zdt.toString(); // => '2019-12-01T12:00:00+01:00[Africa/Lagos][u-ca=japanese]'
zonedDateTime.toLocaleString(locales?: string | array<string>, options?: object) : string
Parameters:

locales (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
options (optional object): An object with properties influencing the formatting.
Returns: a language-sensitive representation of zonedDateTime.

This method overrides Object.prototype.toLocaleString() to provide a human-readable, language-sensitive representation of zonedDateTime.

The locales and options arguments are the same as in the constructor to Intl.DateTimeFormat.

options.timeZone will be automatically set from the time zone of zonedDateTime. If a different time zone ID is provided in options.timeZone, a RangeError will be thrown. To display a Temporal.ZonedDateTime value in a different time zone, use withTimeZone(timeZone).toLocaleString().

Example usage:

zdt = Temporal.ZonedDateTime.from('2019-12-01T12:00+01:00[Europe/Berlin]');
zdt.toLocaleString(); // example output: 12/1/2019, 12:00:00 PM
zdt.toLocaleString('de-DE'); // => '1.12.2019, 12:00:00 MEZ'
options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
zdt.toLocaleString('de-DE', options); // => 'Sonntag, 1. Dezember 2019'
/_ WRONG _/ zdt.toLocaleString('de-DE', { timeZone: 'Pacific/Auckland' });
// => RangeError: Time zone option Pacific/Auckland does not match actual time zone Europe/Berlin
zdt.withTimeZone('Pacific/Auckland').toLocaleString('de-DE'); // => '2.12.2019, 0:00:00 GMT+13'
zdt.toLocaleString('en-US-u-nu-fullwide-hc-h12'); // => '１２/１/２０１９, １２:００:００ PM GMT+１'
zonedDateTime.toJSON() : string
Returns: a string in the ISO 8601 date format representing zonedDateTime.

This method is the same as zonedDateTime.toString(). It is usually not called directly, but it can be called automatically by JSON.stringify().

The reverse operation, recovering a Temporal.ZonedDateTime object from a string, is Temporal.ZonedDateTime.from(), but it cannot be called automatically by JSON.parse(). If you need to rebuild a Temporal.ZonedDateTime object from a JSON string, then you need to know the names of the keys that should be interpreted as Temporal.ZonedDateTimes. In that case you can build a custom "reviver" function for your use case.

Example usage:

const event = {
id: 311,
name: 'FictionalConf 2018',
openingZonedDateTime: Temporal.ZonedDateTime.from('2018-07-06T10:00+05:30[Asia/Kolkata]'),
closingZonedDateTime: Temporal.ZonedDateTime.from('2018-07-08T18:15+05:30[Asia/Kolkata]')
};
const str = JSON.stringify(event, null, 2);
console.log(str);
// =>
// {
// "id": 311,
// "name": "FictionalConf 2018",
// "openingZonedDateTime": "2018-07-06T10:00+05:30[Asia/Kolkata]",
// "closingZonedDateTime": "2018-07-08T18:15+05:30[Asia/Kolkata]"
// }

// To rebuild from the string:
function reviver(key, value) {
if (key.endsWith('ZonedDateTime')) return Temporal.ZonedDateTime.from(value);
return value;
}
JSON.parse(str, reviver);
zonedDateTime.valueOf()
This method overrides Object.prototype.valueOf() and always throws an exception. This is because it's not possible to compare Temporal.ZonedDateTime objects with the relational operators <, <=, >, or >=. Use Temporal.ZonedDateTime.compare() for this, or zonedDateTime.equals() for equality.

zonedDateTime.toInstant() : Temporal.Instant
Returns: A Temporal.Instant object that represents the same instant as zonedDateTime.

zonedDateTime.toPlainDate() : Temporal.PlainDate
Returns: a Temporal.PlainDate object that is the same as the date portion of zonedDateTime.

zonedDateTime.toPlainTime() : Temporal.PlainTime
Returns: a Temporal.PlainTime object that is the same as the wall-clock time portion of zonedDateTime.

zonedDateTime.toPlainDateTime() : Temporal.PlainDateTime
Returns: a Temporal.PlainDateTime object that is the same as the date and time portion of zonedDateTime.

NOTE: After a Temporal.ZonedDateTime is converted to Temporal.PlainDateTime, it will no longer be aware of its time zone. This means that subsequent operations like arithmetic or with will not adjust for DST and may not yield the same results as equivalent operations with Temporal.ZonedDateTime. However, unless you perform those operations across a time zone offset transition, it's impossible to notice the difference. Therefore, be very careful when performing this conversion because subsequent results may look correct most of the time while failing around time zone transitions like when DST starts or ends.

zonedDateTime.toPlainYearMonth() : Temporal.PlainYearMonth
Returns: a Temporal.PlainYearMonth object that is the same as the year and month of zonedDateTime.

zonedDateTime.toPlainMonthDay() : Temporal.PlainMonthDay
Returns: a Temporal.PlainMonthDay object that is the same as the month and day of zonedDateTime.

The above six methods can be used to convert Temporal.ZonedDateTime into a Temporal.Instant, Temporal.PlainDate, Temporal.PlainTime, Temporal.PlainDateTime, Temporal.PlainYearMonth, or Temporal.PlainMonthDay respectively. The converted object carries a copy of all the relevant data of zonedDateTime (for example, in toPlainDate(), the year, month, and day properties are the same.)

Usage example:

zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00[Africa/Johannesburg]');
zdt.toInstant(); // => 1995-12-07T01:24:30Z
zdt.toPlainDateTime(); // => 1995-12-07T03:24:30
zdt.toPlainDate(); // => 1995-12-07
zdt.toPlainYearMonth(); // => 1995-12
zdt.toPlainMonthDay(); // => 12-07
zdt.toPlainTime(); // => 03:24:30
zonedDateTime.getCalendar(): object
Returns: a Temporal.Calendar instance or plain object representing the calendar in which zonedDateTime is reckoned.

This method is mainly useful if you need an object on which to call calendar methods. Most code will not need to use it.

zonedDateTime.getTimeZone(): object
Returns: a Temporal.TimeZone instance or plain object representing the time zone in which zonedDateTime is reckoned.

This method is mainly useful if you need an object on which to call time zone methods. Most code will not need to use it.

zonedDateTime.getISOFields(): { isoYear: number, isoMonth: number, isoDay: number, hour: number, minute: number, second: number, millisecond: number, microsecond: number, nanosecond: number, offset: string, timeZone: string | object, calendar: string | object }
Returns: a plain object with properties expressing zonedDateTime in the ISO 8601 calendar, including all date/time fields as well as the offset property, and the calendar and time zone (which are usually strings, but may be objects) in which zonedDateTime is reckoned.

This is an advanced method that's mainly useful if you are implementing a custom calendar. Most developers will not need to use it.

Usage example:

// get a Temporal.ZonedDateTime in `hebrew` calendar system
zdt = Temporal.ZonedDateTime.from('2019-02-23T03:24:30.000003500[Europe/Rome]').withCalendar('hebrew');

// Month in Hebrew calendar is month 6 of leap year 5779
zdt.month; // => 6
zdt.getISOFields().isoMonth; // => 2

// Instead of calling getISOFields, the pattern below is recommended for most use cases
zdt.withCalendar('iso8601').month; // => 2

## Temporal.PlainDate

Table of Contents
A Temporal.PlainDate represents a calendar date. "Calendar date" refers to the concept of a date as expressed in everyday usage, independent of any time zone. For example, it could be used to represent an event on a calendar which happens during the whole day no matter which time zone it's happening in.

Temporal.PlainDate refers to the whole of a specific day; if you need to refer to a specific time on that day, use Temporal.PlainDateTime. A Temporal.PlainDate can be converted into a Temporal.ZonedDateTime by combining it with a Temporal.PlainTime and Temporal.TimeZone using the toZonedDateTime() method. It can also be combined with a Temporal.PlainTime to yield a "zoneless" Temporal.PlainDateTime using the toPlainDateTime() method.

Temporal.PlainYearMonth and Temporal.PlainMonthDay carry less information than Temporal.PlainDate and should be used when complete information is not required.

Constructor
new Temporal.PlainDate(isoYear: number, isoMonth: number, isoDay: number, calendar: string | object = "iso8601") : Temporal.PlainDate
Parameters:

isoYear (number): A year.
isoMonth (number): A month, ranging between 1 and 12 inclusive.
isoDay (number): A day of the month, ranging between 1 and 31 inclusive.
calendar (optional string, Temporal.Calendar instance, or plain object): A calendar to project the date into.
Returns: a new Temporal.PlainDate object.

Use this constructor if you have the correct parameters for the date already as individual number values in the ISO 8601 calendar. Otherwise, Temporal.PlainDate.from(), which accepts more kinds of input, allows inputting dates in different calendar reckonings, and allows controlling the overflow behavior, is probably more convenient.

All values are given as reckoned in the ISO 8601 calendar. Together, isoYear, isoMonth, and isoDay must represent a valid date in that calendar, even if you are passing a different calendar as the calendar parameter.

The range of allowed values for this type is exactly enough that calling toPlainDate() on any valid Temporal.PlainDateTime will succeed. If isoYear, isoMonth, and isoDay form a date outside of this range, then this function will throw a RangeError.

Usually calendar will be a string containing the identifier of a built-in calendar, such as 'islamic' or 'gregory'. Use an object if you need to supply custom calendar behaviour.

NOTE: The isoMonth argument ranges from 1 to 12, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

Usage examples:

// Pi day in 2020
date = new Temporal.PlainDate(2020, 3, 14); // => 2020-03-14
Static methods
Temporal.PlainDate.from(thing: any, options?: object) : Temporal.PlainDate
Parameters:

thing: The value representing the desired date.
options (optional object): An object with properties representing options for constructing the date. The following options are recognized:
overflow (string): How to deal with out-of-range values if thing is an object. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDate object.

This static method creates a new Temporal.PlainDate object from another value. If the value is another Temporal.PlainDate object, a new object representing the same date is returned. If the value is any other object, it:

Must have a year property or (for calendars that support eras) an era and eraYear property.
Must have either a number month property or a string monthCode property.
May have a calendar property. If omitted, the ISO 8601 calendar will be used by default.
Any non-object value is converted to a string, which is expected to be in ISO 8601 format. Any time part is optional and will be ignored. Time zone or UTC offset information will also be ignored, with one exception: if a string contains a Z in place of a numeric UTC offset, then a RangeError will be thrown because interpreting these strings as a local date and time is usually a bug. Temporal.Instant.from should be used instead to parse these strings, and the result's toZonedDateTimeISO method can be used to obtain a timezone-local date and time.

In unusual cases of needing date or time components of Z-terminated timestamp strings (e.g. daily rollover of a UTC-timestamped log file), use the time zone 'UTC'. For example, the following code returns a "UTC date": Temporal.Instant.from(thing).toZonedDateTimeISO('UTC').toPlainDate().

If the string isn't valid according to ISO 8601, then a RangeError will be thrown regardless of the value of overflow.

The overflow option works as follows, if thing is an object:

In constrain mode (the default), any out-of-range values are clamped to the nearest in-range value.
In reject mode, the presence of out-of-range values will cause the function to throw a RangeError.
The overflow option is ignored if thing is a string.

Additionally, if the result is earlier or later than the range of dates that Temporal.PlainDate can represent (approximately half a million years centered on the Unix epoch), then this function will throw a RangeError regardless of overflow.

NOTE: The allowed values for the thing.month property start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

Example usage:

date = Temporal.PlainDate.from('2006-08-24'); // => 2006-08-24
date = Temporal.PlainDate.from('20060824'); // => 2006-08-24
date = Temporal.PlainDate.from('2006-08-24T15:43:27'); // => 2006-08-24
date = Temporal.PlainDate.from('2006-08-24T15:43:27+01:00[Europe/Brussels]');
// => 2006-08-24
date === Temporal.PlainDate.from(date); // => false

date = Temporal.PlainDate.from({ year: 2006, month: 8, day: 24 }); // => 2006-08-24
date = Temporal.PlainDate.from(Temporal.PlainDateTime.from('2006-08-24T15:43:27'));
// => 2006-08-24
// same as above; Temporal.PlainDateTime has year, month, and day properties

date = Temporal.PlainDate.from({ year: 1427, month: 8, day: 1, calendar: 'islamic' });
// => 2006-08-24[u-ca=islamic]

// Different overflow modes
date = Temporal.PlainDate.from({ year: 2001, month: 13, day: 1 }, { overflow: 'constrain' });
// => 2001-12-01
date = Temporal.PlainDate.from({ year: 2001, month: 1, day: 32 }, { overflow: 'constrain' });
// => 2001-01-31
date = Temporal.PlainDate.from({ year: 2001, month: 13, day: 1 }, { overflow: 'reject' });
// => throws
date = Temporal.PlainDate.from({ year: 2001, month: 1, day: 32 }, { overflow: 'reject' });
// => throws
Temporal.PlainDate.compare(one: Temporal.PlainDate | object | string, two: Temporal.PlainDate | object | string) : number
Parameters:

one (Temporal.PlainDate or value convertible to one): First date to compare.
two (Temporal.PlainDate or value convertible to one): Second date to compare.
Returns: −1, 0, or 1.

Compares two Temporal.PlainDate objects. Returns an integer indicating whether one comes before or after or is equal to two.

−1 if one comes before two
0 if one and two are the same date when projected into the ISO 8601 calendar
1 if one comes after two
If one or two are not Temporal.PlainDate objects, then they will be converted to one as if they were passed to Temporal.PlainDate.from().

Calendars are ignored in the comparison. For example, this method returns 0 for instances that fall on the same day in the ISO 8601 calendar, even if their calendars describe it with a different month, year, and/or day.

This function can be used to sort arrays of Temporal.PlainDate objects. For example:

one = Temporal.PlainDate.from('2006-08-24');
two = Temporal.PlainDate.from('2015-07-14');
three = Temporal.PlainDate.from('1930-02-18');
sorted = [one, two, three].sort(Temporal.PlainDate.compare);
sorted.join(' '); // => '1930-02-18 2006-08-24 2015-07-14'
Properties
date.year : number
date.month : number
date.monthCode : string
date.day : number
The above read-only properties allow accessing each component of a date individually.

year is a signed integer representing the number of years relative to a calendar-specific epoch. For calendars that use eras, the anchor is usually aligned with the latest era so that eraYear === year for all dates in that era. However, some calendars like Japanese may use a different anchor.
month is a positive integer representing the ordinal index of the month in the current year. For calendars like Hebrew or Chinese that use leap months, the same-named month may have a different month value depending on the year. The first month in every year has month equal to 1. The last month of every year has month equal to the monthsInYear property. month values start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).
monthCode is a calendar-specific string that identifies the month in a year-independent way. For common (non-leap) months, monthCode should be `M${month}`, where month is zero padded up to two digits. For uncommon (leap) months in lunisolar calendars like Hebrew or Chinese, the month code is the previous month's code with an "L" suffix appended. Examples: 'M02' => February; 'M08L' => repeated 8th month in the Chinese calendar; 'M05L' => Adar I in the Hebrew calendar.
day is a positive integer representing the day of the month.
Either month or monthCode can be used in from or with to refer to the month. Similarly, in calendars that user eras an era/eraYear pair can be used in place of year when calling from or with.

Usage examples:

date = Temporal.PlainDate.from('2006-08-24');
date.year; // => 2006
date.month; // => 8
date.monthCode; // => 'M08'
date.day; // => 24

date = Temporal.PlainDate.from('2019-02-23[u-ca=hebrew]');
date.year; // => 5779
date.month; // => 6
date.monthCode; // => 'M05L'
date.day; // => 18
date.calendarId : string
The calendarId read-only property gives the identifier of the calendar that the year, month, monthCode, and day properties are interpreted in. If the date was created with a custom calendar object, this gives the id property of that object.

date.era : string | undefined
date.eraYear : number | undefined
In calendars that use eras, the era and eraYear read-only properties can be used together to resolve an era-relative year. Both properties are undefined when using the ISO 8601 calendar. As inputs to from or with, era and eraYear can be used instead of year. Unlike year, eraYear may decrease as time proceeds because some eras (like the BCE era in the Gregorian calendar) count years backwards.

date = Temporal.PlainDate.from('-000015-01-01[u-ca=gregory]');
date.era;
// => 'bce'
date.eraYear;
// => 16
date.year;
// => -15
date.dayOfWeek : number
The dayOfWeek read-only property gives the weekday number that the date falls on. For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7. For an overview, see ISO 8601 on Wikipedia.

Usage example:

date = Temporal.PlainDate.from('2006-08-24');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][date.dayOfWeek - 1]; // => 'THU'
date.dayOfYear : number
The dayOfYear read-only property gives the ordinal day of the year that the date falls on. For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

date = Temporal.PlainDate.from('2006-08-24');
// ISO ordinal date
console.log(date.year, date.dayOfYear); // => '2006 236'
date.weekOfYear : number
The weekOfYear read-only property gives the ISO week number of the date. For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well. ISO week 1 is the week containing the first Thursday of the year. For more information on ISO week numbers, see for example the Wikipedia article on ISO week date.

When combining the week number with a year number, make sure to use date.yearOfWeek instead of date.year. This is because the first few days of a calendar year may be part of the last week of the previous year, and the last few days of a calendar year may be part of the first week of the new year, depending on which year the first Thursday falls in.

Usage example:

date = Temporal.PlainDate.from('2022-01-01');
// ISO week date
console.log(date.yearOfWeek, date.weekOfYear, date.dayOfWeek); // => '2021 52 6'
date.yearOfWeek : number
The yearOfWeek read-only property gives the ISO "week calendar year" of the date, which is the year number corresponding to the ISO week number. For the ISO 8601 calendar, this is normally the same as date.year, but in a few cases it may be the previous or following year. For more information on ISO week numbers, see for example the Wikipedia article on ISO week date.

See weekOfYear for a usage example.

date.daysInWeek : number
The daysInWeek read-only property gives the number of days in the week that the date falls in. For the ISO 8601 calendar, this is always 7, but in other calendar systems it may differ from week to week.

Usage example:

date = Temporal.PlainDate.from('2006-08-24');
date.daysInWeek; // => 7
date.daysInMonth : number
The daysInMonth read-only property gives the number of days in the month that the date falls in. For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
const date = Temporal.Now.plainDateISO().with({ month });
monthsByDays[date.daysInMonth] = (monthsByDays[date.daysInMonth] || []).concat(date);
}

const strings = monthsByDays[30].map((date) => date.toLocaleString('en', { month: 'long' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
date.daysInYear : number
The daysInYear read-only property gives the number of days in the year that the date falls in. For the ISO 8601 calendar, this is 365 or 366, depending on whether the year is a leap year.

Usage example:

date = Temporal.Now.plainDateISO();
percent = date.dayOfYear / date.daysInYear;
`The year is ${percent.toLocaleString('en', { style: 'percent' })} over!`;
// example output: "The year is 10% over!"
date.monthsInYear: number
The monthsInYear read-only property gives the number of months in the year that the date falls in. For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

date = Temporal.PlainDate.from('1900-01-01');
date.monthsInYear; // => 12
date.inLeapYear : boolean
The inLeapYear read-only property tells whether the year that the date falls in is a leap year or not. Its value is true if the year is a leap year, and false if not.

NOTE: A "leap year" is a year that contains more days than other years (for solar or lunar calendars) or more months than other years (for lunisolar calendars like Hebrew or Chinese). In the ISO 8601 calendar, a year is a leap year (and has exactly one extra day, February 29) if it is evenly divisible by 4 but not 100 or if it is evenly divisible by 400.

Usage example:

// Is this year a leap year?
date = Temporal.Now.plainDateISO();
date.inLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
date.with({ year: 2100 }).inLeapYear; // => false
Methods
date.with(dateLike: object, options?: object) : Temporal.PlainDate
Parameters:

dateLike (object): an object with some or all of the properties of a Temporal.PlainDate.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
overflow (string): How to deal with out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDate object.

This method creates a new Temporal.PlainDate which is a copy of date, but any properties present on dateLike override the ones already present on date.

Since Temporal.PlainDate objects each represent a fixed date, use this method instead of modifying one.

If the result is earlier or later than the range of dates that Temporal.PlainDate can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

NOTE: The allowed values for the dateLike.month property start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

NOTE: calendar and timeZone properties are not allowed on dateLike. See the withCalendar and toZonedDateTime methods instead.

Usage example:

date = Temporal.PlainDate.from('2006-01-24');
// What's the first day of this month?
date.with({ day: 1 }); // => 2006-01-01
// What's the last day of the next month?
const nextMonthDate = date.add({ months: 1 });
nextMonthDate.with({ day: nextMonthDate.daysInMonth }); // => 2006-02-28
date.withCalendar(calendar: object | string) : Temporal.PlainDate
Parameters:

calendar (Temporal.Calendar or plain object or string): The calendar into which to project date.
Returns: a new Temporal.PlainDate object which is the date indicated by date, projected into calendar.

Usage example:

date = Temporal.PlainDate.from('2006-08-24[u-ca=japanese]');
date.withCalendar('iso8601'); // => 2006-08-24
date.add(duration: Temporal.Duration | object | string, options?: object) : Temporal.PlainDate
Parameters:

duration (Temporal.Duration or value convertible to one): The duration to add.
options (optional object): An object with properties representing options for the addition. The following options are recognized:
overflow (optional string): How to deal with additions that result in out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDate object which is the date indicated by date plus duration.

This method adds duration to date, returning a date that is in the future relative to date.

The duration argument is an object with properties denoting a duration, such as { days: 5 }, or a string such as P5D, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

If duration has any units smaller than days, they will be treated as if they are being added to the first moment of the day given by date. Effectively, this means that adding things like { minutes: 5 } will be ignored.

Some additions may be ambiguous, because months have different lengths. For example, adding one month to August 31 would result in September 31, which doesn't exist. For these cases, the overflow option tells what to do:

In constrain mode (the default), out-of-range values are clamped to the nearest in-range value.
In reject mode, an addition that would result in an out-of-range value fails, and a RangeError is thrown.
Additionally, if the result is earlier or later than the range of dates that Temporal.PlainDate can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

date = Temporal.PlainDate.from('2006-08-24');
date.add({ years: 20, months: 4 }); // => 2026-12-24

date = Temporal.PlainDate.from('2019-01-31');
date.add({ months: 1 }); // => 2019-02-28
date.add({ months: 1 }, { overflow: 'reject' }); // => throws
date.subtract(duration: Temporal.Duration | object | string, options?: object) : Temporal.PlainDate
Parameters:

duration (Temporal.Duration or value convertible to one): The duration to subtract.
options (optional object): An object with properties representing options for the subtraction. The following options are recognized:
overflow (string): How to deal with subtractions that result in out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDate object which is the date indicated by date minus duration.

This method subtracts duration from date, returning a date that is in the past relative to date.

The duration argument is an object with properties denoting a duration, such as { days: 5 }, or a string such as P5D, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

If duration has any units smaller than days, they will be treated as if they are being subtracted from the last moment of the day given by date. Effectively, this means that subtracting things like { minutes: 5 } will be ignored.

Some subtractions may be ambiguous, because months have different lengths. For example, subtracting one month from July 31 would result in June 31, which doesn't exist. For these cases, the overflow option tells what to do:

In constrain mode (the default), out-of-range values are clamped to the nearest in-range value.
In reject mode, an addition that would result in an out-of-range value fails, and a RangeError is thrown.
Additionally, if the result is earlier or later than the range of dates that Temporal.PlainDate can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

date = Temporal.PlainDate.from('2006-08-24');
date.subtract({ years: 20, months: 4 }); // => 1986-04-24

date = Temporal.PlainDate.from('2019-03-31');
date.subtract({ months: 1 }); // => 2019-02-28
date.subtract({ months: 1 }, { overflow: 'reject' }); // => throws
date.until(other: Temporal.PlainDate | object | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.PlainDate or value convertible to one): Another date until when to compute the difference.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (optional string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'year', 'month', 'week', and 'day'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'year', 'month', 'week', 'day'. The default is 'day', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the time elapsed after date and until other.

This method computes the difference between the two dates represented by date and other, optionally rounds it, and returns it as a Temporal.Duration object. If other is earlier than date then the resulting duration will be negative. If using the default options, adding the returned Temporal.Duration to date will yield other.

If other is not a Temporal.PlainDate object, then it will be converted to one as if it were passed to Temporal.PlainDate.from().

The largestUnit option controls how the resulting duration is expressed. The returned Temporal.Duration object will not have any nonzero fields that are larger than the unit in largestUnit. A difference of two years will become 24 months when largestUnit is "months", for example. However, a difference of two months will still be two months even if largestUnit is "years". A value of 'auto' means 'day', unless smallestUnit is 'year', 'month', or 'week', in which case largestUnit is equal to smallestUnit.

By default, the largest unit in the result is days. This is because months and years can be different lengths depending on which month is meant and whether the year is a leap year.

You can round the result using the smallestUnit, roundingIncrement, and roundingMode options. These behave as in the Temporal.Duration.round() method, but increments of days and larger are allowed. Because rounding to calendar units requires a reference point, date is used as the starting point. The default is to do no rounding.

For rounding purposes, a Temporal.PlainDate instance will be treated the same as a Temporal.PlainDateTime instance with the time set to midnight. Therefore when rounding using the 'halfExpand' rounding mode, dates at the exact midpoint of the smallestUnit will be rounded down.

Unlike other Temporal types, hours and lower are not allowed for either largestUnit or smallestUnit, because the data model of Temporal.PlainDate doesn't have that accuracy.

Computing the difference between two dates in different calendar systems is not supported. If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with date.withCalendar().

Usage example:

earlier = Temporal.PlainDate.from('2006-08-24');
later = Temporal.PlainDate.from('2019-01-31');
earlier.until(later); // => P4543D
earlier.until(later, { largestUnit: 'year' }); // => P12Y5M7D
later.until(earlier, { largestUnit: 'year' }); // => -P12Y5M7D

// If you really need to calculate the difference between two Dates in
// hours, you can eliminate the ambiguity by explicitly choosing the
// point in time from which you want to reckon the difference. For
// example, using noon:
noon = Temporal.PlainTime.from('12:00');
earlier.toPlainDateTime(noon).until(later.toPlainDateTime(noon), { largestUnit: 'hour' });
// => PT109032H

newyear = Temporal.PlainDate.from('2020-01-01');
newyear.until('2020-01-15', { smallestUnit: 'month', roundingMode: 'halfExpand' });
// => PT0S
newyear.until('2020-01-16', { smallestUnit: 'month', roundingMode: 'halfExpand' });
// => PT0S (mid-month dates rounded down to match `Temporal.PlainDateTime` behavior)
newyear.until('2020-01-17', { smallestUnit: 'month', roundingMode: 'halfExpand' });
// => PT1M
date.since(other: Temporal.PlainDate | object | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.PlainDate or value convertible to one): Another date since when to compute the difference.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (optional string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'year', 'month', 'week', and 'day'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'year', 'month', 'week', 'day'. The default is 'day', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the time elapsed before date and since other.

This method computes the difference between the two dates represented by date and other, optionally rounds it, and returns it as a Temporal.Duration object. If other is later than date then the resulting duration will be negative.

This method is similar to Temporal.PlainDate.prototype.until(), but reversed. If using the default options, subtracting the returned Temporal.Duration from date will yield other, and date1.since(date2) will yield the same result as date1.until(date2).negated().

Usage example:

earlier = Temporal.PlainDate.from('2006-08-24');
later = Temporal.PlainDate.from('2019-01-31');
later.since(earlier); // => P4543D
date.equals(other: Temporal.PlainDate | object | string) : boolean
Parameters:

other (Temporal.PlainDate or value convertible to one): Another date to compare.
Returns: true if date and other are equal, or false if not.

Compares two Temporal.PlainDate objects for equality.

This function exists because it's not possible to compare using date == other or date === other, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two dates occur, then this function may be less typing and more efficient than Temporal.PlainDate.compare.

Note that this function will return false if the two objects have different calendar properties, even if the actual dates are equal.

If other is not a Temporal.PlainDate object, then it will be converted to one as if it were passed to Temporal.PlainDate.from().

Example usage:

date = Temporal.PlainDate.from('2006-08-24');
other = Temporal.PlainDate.from('2019-01-31');
date.equals(other); // => false
date.equals(date); // => true
date.toString(options?: object) : string
Parameters:

options (optional object): An object with properties influencing the formatting. The following options are recognized:
calendarName (string): Whether to show the calendar annotation in the return value. Valid values are 'auto', 'always', 'never', and 'critical'. The default is 'auto'.
Returns: a string in the ISO 8601 date format representing date.

This method overrides the Object.prototype.toString() method and provides a convenient, unambiguous string representation of date. The string can be passed to Temporal.PlainDate.from() to create a new Temporal.PlainDate object.

Normally, a calendar annotation is shown when date's calendar is not the ISO 8601 calendar. By setting the calendarName option to 'always' or 'never' this can be overridden to always or never show the annotation, respectively. Normally not necessary, a value of 'critical' is equivalent to 'always' but the annotation will contain an additional ! for certain interoperation use cases. For more information on the calendar annotation, see the Temporal string formats documentation.

Example usage:

date = Temporal.PlainDate.from('2006-08-24');
date.toString(); // => '2006-08-24'
date.toLocaleString(locales?: string | array<string>, options?: object) : string
Parameters:

locales (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
options (optional object): An object with properties influencing the formatting.
Returns: a language-sensitive representation of date.

This method overrides Object.prototype.toLocaleString() to provide a human-readable, language-sensitive representation of date.

The locales and options arguments are the same as in the constructor to Intl.DateTimeFormat.

Example usage:

date = Temporal.PlainDate.from('2006-08-24');
date.toLocaleString(); // example output: 8/24/2006
date.toLocaleString('de-DE'); // example output: '24.8.2006'
date.toLocaleString('de-DE', { weekday: 'long' }); // => 'Donnerstag'
date.toLocaleString('en-US-u-nu-fullwide'); // => '８/２４/２００６'
date.toJSON() : string
Returns: a string in the ISO 8601 date format representing date.

This method is the same as date.toString(). It is usually not called directly, but it can be called automatically by JSON.stringify().

The reverse operation, recovering a Temporal.PlainDate object from a string, is Temporal.PlainDate.from(), but it cannot be called automatically by JSON.parse(). If you need to rebuild a Temporal.PlainDate object from a JSON string, then you need to know the names of the keys that should be interpreted as Temporal.PlainDates. In that case you can build a custom "reviver" function for your use case.

Example usage:

const student = {
id: 429,
name: 'Emilia Connor',
birthDate: Temporal.PlainDate.from('1997-09-08')
};
const str = JSON.stringify(student, null, 2);
console.log(str);
// =>
// {
// "id": 429,
// "name": "Emilia Connor",
// "birthDate": "1997-09-08"
// }

// To rebuild from the string:
function reviver(key, value) {
if (key.endsWith('Date')) return Temporal.PlainDate.from(value);
return value;
}
JSON.parse(str, reviver);
date.valueOf()
This method overrides Object.prototype.valueOf() and always throws an exception. This is because it's not possible to compare Temporal.PlainDate objects with the relational operators <, <=, >, or >=. Use Temporal.PlainDate.compare() for this, or date.equals() for equality.

date.toZonedDateTime(item: object) : Temporal.ZonedDateTime
Parameters:

item (object): an object with properties to be added to date. The following properties are recognized:
plainTime (optional Temporal.PlainTime or value convertible to one): a time of day on date used to merge into a Temporal.ZonedDateTime.
timeZone (required Temporal.TimeZone or value convertible to one, or an object implementing the time zone protocol): the time zone in which to interpret date and plainTime.
Returns: a Temporal.ZonedDateTime object that represents the wall-clock time plainTime on the calendar date date projected into timeZone.

This method can be used to convert Temporal.PlainDate into a Temporal.ZonedDateTime, by supplying the time zone and time of day. The default plainTime, if it's not provided, is the first valid local time in timeZone on the calendar date date. Usually this is midnight (00:00), but may be a different time in rare circumstances like DST starting at midnight or calendars like ethiopic where each day doesn't start at midnight.

For a list of IANA time zone names, see the current version of the IANA time zone database. A convenient list is also available on Wikipedia, although it might not reflect the latest official status.

In addition to the timeZone, the converted object carries a copy of all the relevant fields of date and plainTime. If plainTime is provided but is not a Temporal.PlainTime object, then it will be converted to one as if it were passed to Temporal.PlainTime.from(). If plainTime is provided, this method is equivalent to Temporal.PlainTime.from(plainTime).toPlainDateTime(date).toZonedDateTime(timeZone).

In the case of ambiguity caused by DST or other time zone changes, the earlier time will be used for backward transitions and the later time for forward transitions. When interoperating with existing code or services, this matches the behavior of legacy Date as well as libraries like moment.js, Luxon, and date-fns. This mode also matches the behavior of cross-platform standards like RFC 5545 (iCalendar).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset. This behavior avoids exceptions when converting nonexistent date/time values to Temporal.ZonedDateTime, but it also means that values during these periods will result in a different Temporal.PlainTime value in "round-trip" conversions to Temporal.ZonedDateTime and back again.

For usage examples and a more complete explanation of how this disambiguation works, see Resolving ambiguity.

If the result is outside the range that Temporal.ZonedDateTime can represent (approximately half a million years centered on the Unix epoch), then a RangeError will be thrown.

Usage example:

plainDate = Temporal.PlainDate.from('2006-08-24');
plainTime = Temporal.PlainTime.from('15:23:30.003');
plainDate.toZonedDateTime({ timeZone: 'America/Los_Angeles', plainTime });
// => 2006-08-24T15:23:30.003-07:00[America/Los_Angeles]
plainDate.toZonedDateTime({ timeZone: 'America/Los_Angeles' });
// => 2006-08-24T00:00:00-07:00[America/Los_Angeles]
date.toPlainDateTime(time?: Temporal.PlainTime | object | string) : Temporal.PlainDateTime
Parameters:

time (optional Temporal.PlainTime or value convertible to one): A time of day on date.
Returns: a Temporal.PlainDateTime object that represents the wall-clock time time on the calendar date date.

This method can be used to convert Temporal.PlainDate into a Temporal.PlainDateTime, by supplying the time of day to use. The default time, if it is not given, is midnight (00:00). The converted object carries a copy of all the relevant fields of date and time.

If time is given, this is equivalent to Temporal.PlainTime.from(time).toPlainDateTime(date).

If time is given and is not a Temporal.PlainTime object, then it will be converted to one as if it were passed to Temporal.PlainTime.from().

Usage example:

date = Temporal.PlainDate.from('2006-08-24');
time = Temporal.PlainTime.from('15:23:30.003');
date.toPlainDateTime(time); // => 2006-08-24T15:23:30.003
date.toPlainDateTime(); // => 2006-08-24T00:00:00
date.toPlainYearMonth() : Temporal.PlainYearMonth
Returns: a Temporal.PlainYearMonth object that is the same as the year and month of date.

date.toPlainMonthDay() : Temporal.PlainMonthDay
Returns: a Temporal.PlainMonthDay object that is the same as the month and day of date.

The above two methods can be used to convert Temporal.PlainDate into a Temporal.PlainYearMonth or Temporal.PlainMonthDay respectively. The converted object carries a copy of all the relevant fields of date (for example, in toPlainYearMonth(), the year and month properties are copied.)

Usage example:

date = Temporal.PlainDate.from('2006-08-24');
date.toPlainYearMonth(); // => 2006-08
date.toPlainMonthDay(); // => 08-24
date.getCalendar(): object
Returns: a Temporal.Calendar instance or plain object representing the calendar in which date is reckoned.

This method is mainly useful if you need an object on which to call calendar methods. Most code will not need to use it.

date.getISOFields(): { isoYear: number, isoMonth: number, isoDay: number, calendar: string | object }
Returns: a plain object with properties expressing date in the ISO 8601 calendar, as well as the calendar (usually a string, but may be an object) in which date is reckoned.

This method is mainly useful if you are implementing a custom calendar. Most code will not need to use it.

Usage example:

date = Temporal.PlainDate.from('2006-08-24');
f = date.getISOFields();
f.isoDay; // => 24
// Fields correspond exactly to constructor arguments:
date2 = new Temporal.PlainDate(f.isoYear, f.isoMonth, f.isoDay, f.calendar);
date.equals(date2); // => true

// Date in other calendar
date = date.withCalendar('hebrew');
date.day; // => 30
date.getISOFields().isoDay; // => 24

// Most likely what you need is this:
date.withCalendar('iso8601').day; // => 24

## Temporal.PlainTime

Table of Contents
A Temporal.PlainTime represents a wall-clock time, with a precision in nanoseconds, and without any time zone. "Wall-clock time" refers to the concept of a time as expressed in everyday usage — the time that you read off the clock on the wall. For example, it could be used to represent an event that happens daily at a certain time, no matter what time zone.

Temporal.PlainTime refers to a time with no associated calendar date; if you need to refer to a specific time on a specific day, use Temporal.PlainDateTime. A Temporal.PlainTime can be converted into a Temporal.ZonedDateTime by combining it with a Temporal.PlainDate and Temporal.TimeZone using the toZonedDateTime() method. It can also be combined with a Temporal.PlainDate to yield a "zoneless" Temporal.PlainDateTime using the toPlainDateTime() method.

Constructor
new Temporal.PlainTime(isoHour: number = 0, isoMinute: number = 0, isoSecond: number = 0, isoMillisecond: number = 0, isoMicrosecond: number = 0, isoNanosecond: number = 0) : Temporal.PlainTime
Parameters:

isoHour (optional number): An hour of the day, ranging between 0 and 23 inclusive.
isoMinute (optional number): A minute, ranging between 0 and 59 inclusive.
isoSecond (optional number): A second, ranging between 0 and 59 inclusive.
isoMillisecond (optional number): A number of milliseconds, ranging between 0 and 999 inclusive.
isoMicrosecond (optional number): A number of microseconds, ranging between 0 and 999 inclusive.
isoNanosecond (optional number): A number of nanoseconds, ranging between 0 and 999 inclusive.
Returns: a new Temporal.PlainTime object.

Use this constructor if you have the correct parameters for the time already as individual number values in the ISO 8601 calendar. Otherwise, Temporal.PlainTime.from(), which accepts more kinds of input and allows controlling the overflow behavior, is probably more convenient.

All values are given as reckoned in the ISO 8601 calendar.

Usage examples:

// Leet hour
time = new Temporal.PlainTime(13, 37); // => 13:37:00
Static methods
Temporal.PlainTime.from(thing: any, options?: object) : Temporal.PlainTime
Parameters:

thing: The value representing the desired time.
options (optional object): An object with properties representing options for constructing the time. The following options are recognized:
overflow (optional string): How to deal with out-of-range values if thing is an object. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainTime object.

This static method creates a new Temporal.PlainTime object from another value. If the value is another Temporal.PlainTime object, a new object representing the same time is returned. If the value is any other object, a Temporal.PlainTime will be constructed from the values of any hour, minute, second, millisecond, microsecond, and nanosecond properties that are present. Any missing ones will be assumed to be 0.

If the calendar property is present, it must be the string 'iso8601' or the ISO 8601 calendar, for future compatibility.

Any non-object value will be converted to a string, which is expected to be in ISO 8601 format. If the string designates a date, it will be ignored. Time zone or UTC offset information will also be ignored, with one exception: if a string contains a Z in place of a numeric UTC offset, then a RangeError will be thrown because interpreting these strings as a local time is usually a bug. Temporal.Instant.from should be used instead to parse these strings, and the result's toZonedDateTimeISO method can be used to obtain a timezone-local date and time.

In unusual cases of needing date or time components of Z-terminated timestamp strings (e.g. daily rollover of a UTC-timestamped log file), use the time zone 'UTC'. For example, the following code returns a "UTC time": Temporal.Instant.from(thing).toZonedDateTimeISO('UTC').toPlainTime().

The overflow option works as follows, if thing is an object:

In constrain mode (the default), any out-of-range values are clamped to the nearest in-range value.
In reject mode, the presence of out-of-range values will cause the function to throw a RangeError.
The overflow option is ignored if thing is a string.

NOTE: Although Temporal does not deal with leap seconds, times coming from other software may have a second value of 60. In the default constrain mode, this will be converted to 59. In reject mode, the constructor will throw, so if you have to interoperate with times that may contain leap seconds, don't use reject. However, if parsing an ISO 8601 string with a seconds component of :60, then it will always result in a second value of 59, in accordance with POSIX.

Example usage:

time = Temporal.PlainTime.from('03:24:30'); // => 03:24:30
time = Temporal.PlainTime.from('032430'); // => 03:24:30
time = Temporal.PlainTime.from('1995-12-07T03:24:30'); // => 03:24:30
time = Temporal.PlainTime.from('1995-12-07T03:24:30+01:00[Europe/Brussels]');
// => 03:24:30
// (same as above; time zone is ignored)
time === Temporal.PlainTime.from(time); // => false

time = Temporal.PlainTime.from({
hour: 19,
minute: 39,
second: 9,
millisecond: 68,
microsecond: 346,
nanosecond: 205
}); // => 19:39:09.068346205
time = Temporal.PlainTime.from({ hour: 19, minute: 39, second: 9 }); // => 19:39:09
time = Temporal.PlainTime.from(Temporal.PlainDateTime.from('2020-02-15T19:39:09'));
// => 19:39:09
// (same as above; Temporal.PlainDateTime has hour, minute, etc. properties)

// Different overflow modes
time = Temporal.PlainTime.from({ hour: 15, minute: 60 }, { overflow: 'constrain' });
// => 15:59:00
time = Temporal.PlainTime.from({ hour: 15, minute: -1 }, { overflow: 'constrain' });
// => 15:00:00
time = Temporal.PlainTime.from({ hour: 15, minute: 60 }, { overflow: 'reject' });
// => throws
time = Temporal.PlainTime.from({ hour: 15, minute: -1 }, { overflow: 'reject' });
// => throws
Temporal.PlainTime.compare(one: Temporal.PlainTime | object | string, two: Temporal.PlainTime | object | string) : number
Parameters:

one (Temporal.PlainTime or value convertible to one): First time to compare.
two (Temporal.PlainTime or value convertible to one): Second time to compare.
Returns: −1, 0, or 1.

Compares two Temporal.PlainTime objects. Returns an integer indicating whether one comes before or after or is equal to two.

−1 if one comes before two;
0 if one and two are the same;
1 if one comes after two.
If one and two are not Temporal.PlainTime objects, then they will be converted to one as if they were passed to Temporal.PlainTime.from().

This function can be used to sort arrays of Temporal.PlainTime objects. For example:

one = Temporal.PlainTime.from('03:24');
two = Temporal.PlainTime.from('01:24');
three = Temporal.PlainTime.from('01:24:05');
sorted = [one, two, three].sort(Temporal.PlainTime.compare);
sorted.join(' '); // => '01:24:00 01:24:05 03:24:00'
Note that time zone offset transitions (like when Daylight Saving Time starts or ends ends) can produce unexpected results when comparing times, because clock times can be skipped or repeated. Therefore, Temporal.ZonedDateTime.compare (not Temporal.PlainTime.compare) should be used if the caller's actual intent is to compare specific instants, e.g. arrivals of two airplane flights. For example:

// Backward transitions will repeat clock times
zdtDst = Temporal.ZonedDateTime.from('2020-11-01T01:45-07:00[America/Los_Angeles]');
zdtStandard = Temporal.ZonedDateTime.from('2020-11-01T01:30-08:00[America/Los_Angeles]');
// The "first" 1:45 (in Daylight Time) is earlier than the "second" 1:30 (in Standard Time)
Temporal.ZonedDateTime.compare(zdtDst, zdtStandard); // => -1
// 1:45 is later than 1:30 when looking at a wall clock
Temporal.PlainTime.compare(zdtDst, zdtStandard); // => 1

// Forward transitions will skip clock times. Skipped times will be disambiguated.
zdtBase = Temporal.ZonedDateTime.from('2020-03-08[America/Los_Angeles]');
timeSkipped = Temporal.PlainTime.from('02:30');
timeValid = Temporal.PlainTime.from('03:30');
zdtSkipped = zdtBase.withPlainTime(timeSkipped);
zdtValid = zdtBase.withPlainTime(timeValid);
// The skipped time 2:30AM is disambiguated to 3:30AM, so the instants are equal
Temporal.ZonedDateTime.compare(zdtSkipped, zdtValid); // => 0
// 2:30 is earlier than 3:30 on a wall clock
Temporal.PlainTime.compare(timeSkipped, timeValid); // => -1
Properties
time.hour: number
time.minute: number
time.second: number
time.millisecond: number
time.microsecond: number
time.nanosecond: number
The above read-only properties allow accessing each component of the time individually.

Usage examples:

time = Temporal.PlainTime.from('19:39:09.068346205');
time.hour; // => 19
time.minute; // => 39
time.second; // => 9
time.millisecond; // => 68
time.microsecond; // => 346
time.nanosecond; // => 205
Methods
time.with(timeLike: object, options?: object) : Temporal.PlainTime
Parameters:

timeLike (object): an object with some or all of the properties of a Temporal.PlainTime.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
overflow (string): How to deal with out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainTime object.

This method creates a new Temporal.PlainTime which is a copy of time, but any properties present on timeLike override the ones already present on time.

Since Temporal.PlainTime objects each represent a fixed time, use this method instead of modifying one.

NOTE: calendar and timeZone properties are not allowed on timeLike. See the toPlainDateTime and toZonedDateTime methods instead.

Usage example:

time = Temporal.PlainTime.from('19:39:09.068346205');
// What's the top of the next hour?
time.add({ hours: 1 }).with({
minute: 0,
second: 0,
millisecond: 0,
microsecond: 0,
nanosecond: 0
}); // => 20:00:00
time.add(duration: Temporal.Duration | object | string) : Temporal.PlainTime
Parameters:

duration (Temporal.Duration or value convertible to one): The duration to add.
Returns: a new Temporal.PlainTime object which is the time indicated by time plus duration.

This method adds duration to time. Due to times wrapping around when reaching 24 hours, the returned point in time may be either in the future or in the past relative to time, or even the same time.

The duration argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a string such as PT5H30M, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

time = Temporal.PlainTime.from('19:39:09.068346205');
time.add({ minutes: 5, nanoseconds: 800 }); // => 19:44:09.068347005
time.subtract(duration: Temporal.Duration | object | string) : Temporal.PlainTime
Parameters:

duration (Temporal.Duration or value convertible to one): The duration to subtract.
Returns: a new Temporal.PlainTime object which is the time indicated by time minus duration.

This method subtracts duration from time. Due to times wrapping around when reaching 24 hours, the returned point in time may be either in the future or in the past relative to time, or even the same time.

The duration argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a string such as PT5H30M, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

time = Temporal.PlainTime.from('19:39:09.068346205');
time.subtract({ minutes: 5, nanoseconds: 800 }); // => 19:34:09.068345405
time.until(other: Temporal.PlainTime | object | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.PlainTime or value convertible to one): Another time until when to compute the difference.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'nanosecond', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the elapsed time after time and until other.

This method computes the difference between the two times represented by time and other, optionally rounds it, and returns it as a Temporal.Duration object. If other is earlier than time then the resulting duration will be negative. If using the default options, adding the returned Temporal.Duration to time will yield other.

If other is not a Temporal.PlainTime object, then it will be converted to one as if it were passed to Temporal.PlainTime.from().

The largestUnit parameter controls how the resulting duration is expressed. The returned Temporal.Duration object will not have any nonzero fields that are larger than the unit in largestUnit. A difference of two hours will become 7200 seconds when largestUnit is 'second', for example. However, a difference of 30 seconds will still be 30 seconds even if largestUnit is 'hour'. A value of 'auto' means 'hour'.

You can round the result using the smallestUnit, roundingIncrement, and roundingMode options. These behave as in the Temporal.Duration.round() method. The default is to do no rounding.

Usage example:

time = Temporal.PlainTime.from('20:13:20.971398099');
time.until(Temporal.PlainTime.from('22:39:09.068346205')); // => PT2H25M48.096948106S
time.until(Temporal.PlainTime.from('19:39:09.068346205')); // => -PT34M11.903051894S

// Rounding, for example if you don't care about sub-seconds
time.until(Temporal.PlainTime.from('22:39:09.068346205'), { smallestUnit: 'second' });
// => PT2H25M48S
time.since(other: Temporal.PlainTime | object | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.PlainTime or value convertible to one): Another time since when to compute the difference.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'nanosecond', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the elapsed time before time and since other.

This method computes the difference between the two times represented by time and other, optionally rounds it, and returns it as a Temporal.Duration object. If other is later than time then the resulting duration will be negative.

This method is similar to Temporal.PlainTime.prototype.until(), but reversed. If using the default options, subtracting the returned Temporal.Duration from time will yield other, and time1.since(time2) will yield the same result as time1.until(time2).negated().

Usage example:

time = Temporal.PlainTime.from('20:13:20.971398099');
time.since(Temporal.PlainTime.from('19:39:09.068346205')); // => PT34M11.903051894S
time.since(Temporal.PlainTime.from('22:39:09.068346205')); // => -PT2H25M48.096948106S
time.round(roundTo: string | object) : Temporal.PlainTime
Parameters:

roundTo (string | object): A required string or object to control the operation.
If a string is provided, the resulting Temporal.PlainTime object will be rounded to that unit. Valid values are 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. A string parameter is treated the same as an object whose smallestUnit property value is that string.
If an object is passed, the following properties are recognized:
smallestUnit (required string): The unit to round to. Valid values are 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'halfExpand'.
Returns: a new Temporal.PlainTime object which is time rounded to roundTo (if a string parameter is used) or roundingIncrement of smallestUnit (if an object parameter is used).

Rounds time to the given unit and increment, and returns the result as a new Temporal.PlainTime object.

The smallestUnit option (or the value of roundTo if a string parameter is used) determines the unit to round to. For example, to round to the nearest minute, use smallestUnit: 'minute'. This option is required.

The roundingIncrement option allows rounding to an integer number of units. For example, to round to increments of a half hour, use smallestUnit: 'minute', roundingIncrement: 30.

The value given as roundingIncrement must divide evenly into the next highest unit after smallestUnit, and must not be equal to it. (For example, if smallestUnit is 'minute', then the number of minutes given by roundingIncrement must divide evenly into 60 minutes, which is one hour. The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30. Instead of 60 minutes, use 1 hour.)

The roundingMode option controls how the rounding is performed.

ceil, expand: Always round up, towards 23:59:59.999999999.
floor, trunc: Always round down, towards 00:00.
halfCeil, halfExpand: Round to the nearest of the values allowed by roundingIncrement and smallestUnit. When there is a tie, round up, like ceil.
halfFloor, halfTrunc: Round to the nearest of the allowed values, like halfExpand, but when there is a tie, round down, like floor.
halfEven: Round to the nearest of the allowed values, but when there is a tie, round towards the value that is an even multiple of roundingIncrement. For example, with a roundingIncrement of 2, the number 7 would round up to 8 instead of down to 6, because 8 is an even multiple of 2 (2 × 4 = 8, and 4 is even), whereas 6 is an odd multiple (2 × 3 = 6, and 3 is odd).
Several pairs of modes behave the same as each other, but are both included for consistency with Temporal.Duration.round(), where they are not the same.

The default rounding mode is 'halfExpand' to match how rounding is often taught in school. Note that this is different than the 'trunc' default used by until and since options because rounding up would be an unexpected default for those operations. Other properties behave identically between these methods.

Example usage:

time = Temporal.PlainTime.from('19:39:09.068346205');

// Round to a particular unit
time.round({ smallestUnit: 'hour' }); // => 20:00:00
// Round to an increment of a unit, e.g. half an hour:
time.round({ roundingIncrement: 30, smallestUnit: 'minute' });
// => 19:30:00
// Round to the same increment but round up instead:
time.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'ceil' });
// => 20:00:00
time.equals(other: Temporal.PlainTime | object | string) : boolean
Parameters:

other (Temporal.PlainTime or value convertible to one): Another time to compare.
Returns: true if time and other are equal, or false if not.

Compares two Temporal.PlainTime objects for equality.

This function exists because it's not possible to compare using time == other or time === other, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two times occur, then this function may be less typing and more efficient than Temporal.PlainTime.compare.

If other is not a Temporal.PlainTime object, then it will be converted to one as if it were passed to Temporal.PlainTime.from().

Example usage:

time = Temporal.PlainTime.from('19:39:09.068346205');
other = Temporal.PlainTime.from('20:13:20.971398099');
time.equals(other); // => false
time.equals(time); // => true
time.toString(options?: object) : string
Parameters:

options (optional object): An object with properties representing options for the operation. The following options are recognized:
fractionalSecondDigits (number or string): How many digits to print after the decimal point in the output string. Valid values are 'auto', 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9. The default is 'auto'.
smallestUnit (string): The smallest unit of time to include in the output string. This option overrides fractionalSecondDigits if both are given. Valid values are 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc'.
Returns: a string in the ISO 8601 time format representing time.

This method overrides the Object.prototype.toString() method and provides a convenient, unambiguous string representation of time. The string can be passed to Temporal.PlainTime.from() to create a new Temporal.PlainTime object.

The output precision can be controlled with the fractionalSecondDigits or smallestUnit option. If no options are given, the default is fractionalSecondDigits: 'auto', which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the roundingMode option, as in Temporal.PlainDateTime.round(). Note that rounding may change the value of other units as well.

Example usage:

time = Temporal.PlainTime.from('19:39:09.068346205');
time.toString(); // => '19:39:09.068346205'

time.toString({ smallestUnit: 'minute' }); // => '19:39'
time.toString({ fractionalSecondDigits: 0 }); // => '19:39:09'
time.toString({ fractionalSecondDigits: 4 }); // => '19:39:09.0683'
time.toString({ fractionalSecondDigits: 5, roundingMode: 'halfExpand' });
// => '19:39:09.06835'
time.toLocaleString(locales?: string | array<string>, options?: object) : string
Parameters:

locales (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
options (optional object): An object with properties influencing the formatting.
Returns: a language-sensitive representation of time.

This method overrides Object.prototype.toLocaleString() to provide a human-readable, language-sensitive representation of time.

The locales and options arguments are the same as in the constructor to Intl.DateTimeFormat.

NOTE: Unlike in Temporal.Instant.prototype.toLocaleString(), locales.timeZone will have no effect, because Temporal.PlainTime carries no time zone information and is just a wall-clock time.

Example usage:

time = Temporal.PlainTime.from('19:39:09.068346205');
time.toLocaleString(); // example output: '7:39:09 PM'
time.toLocaleString('de-DE'); // example output: '19:39:09'
time.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }); // => '19:39:09'
time.toLocaleString('en-US-u-nu-fullwide-hc-h24'); // => '１９:３９:０９'
time.toJSON() : string
Returns: a string in the ISO 8601 date format representing time.

This method is the same as time.toString(). It is usually not called directly, but it can be called automatically by JSON.stringify().

The reverse operation, recovering a Temporal.PlainTime object from a string, is Temporal.PlainTime.from(), but it cannot be called automatically by JSON.parse(). If you need to rebuild a Temporal.PlainTime object from a JSON string, then you need to know the names of the keys that should be interpreted as Temporal.PlainTimes. In that case you can build a custom "reviver" function for your use case.

Example usage:

const workBreak = {
type: 'mandatory',
name: 'Lunch',
startTime: Temporal.PlainTime.from({ hour: 12 }),
endTime: Temporal.PlainTime.from({ hour: 13 })
};
const str = JSON.stringify(workBreak, null, 2);
console.log(str);
// =>
// {
// "type": "mandatory",
// "name": "Lunch",
// "startTime": "12:00",
// "endTime": "13:00"
// }

// To rebuild from the string:
function reviver(key, value) {
if (key.endsWith('Time')) return Temporal.PlainTime.from(value);
return value;
}
JSON.parse(str, reviver);
time.valueOf()
This method overrides Object.prototype.valueOf() and always throws an exception. This is because it's not possible to compare Temporal.PlainTime objects with the relational operators <, <=, >, or >=. Use Temporal.PlainTime.compare() for this, or time.equals() for equality.

time.toZonedDateTime(item: object) : Temporal.ZonedDateTime
Parameters:

item (object): an object with properties to be added to time. The following properties are recognized:
plainDate (required Temporal.PlainDate or value convertible to one): a date used to merge into a Temporal.ZonedDateTime along with time.
timeZone (required Temporal.TimeZone or value convertible to one, or an object implementing the time zone protocol): the time zone in which to interpret time and plainDate.
Returns: a Temporal.ZonedDateTime object that represents the clock time on the calendar plainDate projected into timeZone.

This method can be used to convert Temporal.PlainTime into a Temporal.ZonedDateTime, by supplying the time zone and date.

For a list of IANA time zone names, see the current version of the IANA time zone database. A convenient list is also available on Wikipedia, although it might not reflect the latest official status.

In addition to the timeZone, the converted object carries a copy of all the relevant fields of time and plainDate. If plainDate is not a Temporal.PlainDate object, then it will be converted to one as if it were passed to Temporal.PlainDate.from(). This method produces identical results to Temporal.PlainDate.from(plainDate).toPlainDateTime(time).toZonedDateTime(timeZone).

In the case of ambiguity caused by DST or other time zone changes, the earlier time will be used for backward transitions and the later time for forward transitions. When interoperating with existing code or services, this matches the behavior of legacy Date as well as libraries like moment.js, Luxon, and date-fns. This mode also matches the behavior of cross-platform standards like RFC 5545 (iCalendar).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset. This behavior avoids exceptions when converting nonexistent date/time values to Temporal.ZonedDateTime, but it also means that values during these periods will result in a different Temporal.PlainTime value in "round-trip" conversions to Temporal.ZonedDateTime and back again.

For usage examples and a more complete explanation of how this disambiguation works, see Resolving ambiguity.

If the result is outside the range that Temporal.ZonedDateTime can represent (approximately half a million years centered on the Unix epoch), then a RangeError will be thrown.

Usage example:

plainTime = Temporal.PlainTime.from('15:23:30.003');
plainDate = Temporal.PlainDate.from('2006-08-24');
plainTime.toZonedDateTime({ timeZone: 'America/Los_Angeles', plainDate });
// => 2006-08-24T15:23:30.003-07:00[America/Los_Angeles]
time.toPlainDateTime(date: Temporal.PlainDate | object | string) : Temporal.PlainDateTime
Parameters:

date (Temporal.PlainDate or value convertible to one): A calendar date on which to place time.
Returns: a Temporal.PlainDateTime object that represents the wall-clock time time on the calendar date date.

This method can be used to convert Temporal.PlainTime into a Temporal.PlainDateTime, by supplying the calendar date to use. The converted object carries a copy of all the relevant fields of date and time.

This has identical results to Temporal.PlainDate.from(date).toPlainDateTime(time).

If date is not a Temporal.PlainDate object, then it will be converted to one as if it were passed to Temporal.PlainDate.from().

Usage example:

time = Temporal.PlainTime.from('15:23:30.003');
date = Temporal.PlainDate.from('2006-08-24');
time.toPlainDateTime(date); // => 2006-08-24T15:23:30.003
time.getISOFields(): { isoHour: number, isoMinute: number, isoSecond: number, isoMillisecond: number, isoMicrosecond: number, isoNanosecond: number }
Returns: a plain object with properties expressing time in the ISO 8601 calendar.

This method is present for forward compatibility with custom calendars.

Usage example:

time = Temporal.PlainTime.from('03:20:00');
f = time.getISOFields();
f.isoHour; // => 3

## Temporal.PlainDateTime

Table of Contents
A Temporal.PlainDateTime represents a calendar date and wall-clock time, with a precision in nanoseconds, and without any time zone.

For use cases that require a time zone, especially using arithmetic or other derived values, consider using Temporal.ZonedDateTime instead because that type automatically adjusts for Daylight Saving Time. A Temporal.PlainDateTime can be converted to a Temporal.ZonedDateTime using a Temporal.TimeZone.

Temporal.PlainDate, Temporal.PlainTime, Temporal.PlainYearMonth, and Temporal.PlainMonthDay all carry less information and should be used when complete information is not required.

A Temporal.PlainDateTime can be converted into any of the types mentioned above using conversion methods like toZonedDateTime or toPlainDate.

Because Temporal.PlainDateTime does not represent an exact point in time, most date/time use cases are better handled using exact time types like Temporal.ZonedDateTime and Temporal.Instant. But there are cases where Temporal.PlainDateTime is the correct type to use:

Representing timezone-specific events where the time zone is not stored together with the date/time data. In this case, Temporal.PlainDateTime is an intermediate step before converting to/from Temporal.ZonedDateTime or Temporal.Instant using the separate time zone. Examples:
When the time zone is stored separately in a separate database column or a per-user setting.
Implicit time zones, e.g. stock exchange data that is always America/New_York
Interacting with poorly-designed legacy systems that record data in the server's non-UTC time zone.
Passing data to/from a component that is unaware of time zones, e.g. a UI date/time picker.
Modeling events that happen at the same local time in every time zone. For example, the British Commonwealth observes a two minute silence every November 11th at 11:00AM in local time.
When time zone is irrelevant, e.g. a sleep tracking device that only cares about the local time you went to sleep and woke up, regardless of where in the world you are.
Parsing local time from ISO 8601 strings like 2020-04-09T16:08-08:00 that have a numeric offset without an IANA time zone like America/Los_Angeles. These strings can also be parsed by Temporal.Instant, but to parse the local date and time then Temporal.PlainDateTime.from is required.
Performing arithmetic that deliberately ignores DST. Example: in a day-planner UI, the visual height of a meeting may be the same even if DST skips or repeats an hour.
To learn more about time zones and DST best practices, visit Time Zones and Resolving Ambiguity.

Constructor
new Temporal.PlainDateTime(isoYear: number, isoMonth: number, isoDay: number, isoHour: number = 0, isoMinute: number = 0, isoSecond: number = 0, isoMillisecond: number = 0, isoMicrosecond: number = 0, isoNanosecond: number = 0, calendar: string | object = "iso8601") : Temporal.PlainDateTime
Parameters:

isoYear (number): A year.
isoMonth (number): A month, ranging between 1 and 12 inclusive.
isoDay (number): A day of the month, ranging between 1 and 31 inclusive.
isoHour (optional number): An hour of the day, ranging between 0 and 23 inclusive.
isoMinute (optional number): A minute, ranging between 0 and 59 inclusive.
isoSecond (optional number): A second, ranging between 0 and 59 inclusive.
isoMillisecond (optional number): A number of milliseconds, ranging between 0 and 999 inclusive.
isoMicrosecond (optional number): A number of microseconds, ranging between 0 and 999 inclusive.
isoNanosecond (optional number): A number of nanoseconds, ranging between 0 and 999 inclusive.
calendar (optional string, Temporal.Calendar instance, or plain object): A calendar to project the datetime into.
Returns: a new Temporal.PlainDateTime object.

Use this constructor if you have the correct parameters for the datetime already as individual number values in the ISO 8601 calendar. Otherwise, Temporal.PlainDateTime.from(), which accepts more kinds of input, allows inputting dates and times in different calendar reckonings, and allows controlling the overflow behavior, is probably more convenient.

All values are given as reckoned in the ISO 8601 calendar. Together, isoYear, isoMonth, and isoDay must represent a valid date in that calendar, even if you are passing a different calendar as the calendar parameter, and the time parameters must represent a valid time of day.

NOTE: Although Temporal does not deal with leap seconds, dates coming from other software may have a second value of 60. This value will cause the constructor will throw, so if you have to interoperate with times that may contain leap seconds, use Temporal.PlainDateTime.from() instead.

The range of allowed values for this type is wider (by one nanosecond smaller than one day) on each end than the range of Temporal.Instant. Because the magnitude of built-in time zones' UTC offset will always be less than 24 hours, this extra range ensures that a valid Temporal.Instant can always be converted to a valid Temporal.PlainDateTime using any built-in time zone. Note that the reverse conversion is not guaranteed to succeed; a valid Temporal.PlainDateTime at the edge of its range may, for some built-in time zones, be out of range of Temporal.Instant. If the parameters passed in to this constructor are out of range, then this function will throw a RangeError.

Usually calendar will be a string containing the identifier of a built-in calendar, such as 'islamic' or 'gregory'. Use an object if you need to supply custom calendar behaviour.

NOTE: The isoMonth argument ranges from 1 to 12, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

Usage examples:

// Leet hour on pi day in 2020
datetime = new Temporal.PlainDateTime(2020, 3, 14, 13, 37); // => 2020-03-14T13:37:00
Static methods
Temporal.PlainDateTime.from(thing: any, options?: object) : Temporal.PlainDateTime
Parameters:

thing: The value representing the desired date and time.
options (optional object): An object with properties representing options for constructing the date and time. The following options are recognized:
overflow (string): How to deal with out-of-range values if thing is an object. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDateTime object.

This static method creates a new Temporal.PlainDateTime object from another value. If the value is another Temporal.PlainDateTime object, a new object representing the same date and time is returned. If the value is any other object, a Temporal.PlainDateTime will be constructed from the values of any year (or era and eraYear), month (or monthCode), day, hour, minute, second, millisecond, microsecond, nanosecond, and calendar properties that are present.

At least the year (or era and eraYear), month (or monthCode), and day properties must be present. Default values for other missing fields are determined by the calendar.

If the calendar property is not present, it's assumed to be 'iso8601' (identifying the ISO 8601 calendar). Any other missing properties will be assumed to be 0 (for time fields).

Any non-object value is converted to a string, which is expected to be in ISO 8601 format. Time zone or UTC offset information will be ignored, with one exception: if a string contains a Z in place of a numeric UTC offset, then a RangeError will be thrown because interpreting these strings as a local date and time is usually a bug. Temporal.Instant.from should be used instead to parse these strings, and the result's toZonedDateTimeISO method can be used to obtain a timezone-local date and time.

In unusual cases of needing date or time components of Z-terminated timestamp strings (e.g. daily rollover of a UTC-timestamped log file), use the time zone 'UTC'. For example, the following code returns a "UTC date": Temporal.Instant.from(thing).toZonedDateTimeISO('UTC').toPlainDate().

If the string isn't valid according to ISO 8601, then a RangeError will be thrown regardless of the value of overflow.

The overflow option works as follows, if thing is an object:

In constrain mode (the default), any out-of-range values are clamped to the nearest in-range value.
In reject mode, the presence of out-of-range values will cause the function to throw a RangeError.
The overflow option is ignored if thing is a string.

Additionally, if the result is earlier or later than the range of dates that Temporal.PlainDateTime can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

NOTE: Although Temporal does not deal with leap seconds, dates coming from other software may have a second value of 60. In the default constrain mode and when parsing an ISO 8601 string, this will be converted to 59. In reject mode, this function will throw, so if you have to interoperate with times that may contain leap seconds, don't use reject.

NOTE: The allowed values for the thing.month property start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

Example usage:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30');
dt = Temporal.PlainDateTime.from('19951207T032430');
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30+01:00[Europe/Brussels]');
// => 1995-12-07T03:24:30
// same as above; time zone is ignored
dt === Temporal.PlainDateTime.from(dt); // => false

dt = Temporal.PlainDateTime.from({
year: 1995,
month: 12,
day: 7,
hour: 3,
minute: 24,
second: 30,
millisecond: 0,
microsecond: 3,
nanosecond: 500
}); // => 1995-12-07T03:24:30.0000035
dt = Temporal.PlainDateTime.from({ year: 1995, month: 12, day: 7 }); // => 1995-12-07T00:00:00
dt = Temporal.PlainDateTime.from(Temporal.PlainDate.from('1995-12-07T03:24:30'));
// => 1995-12-07T00:00:00
// same as above; Temporal.PlainDate has year, month, and day properties

dt = Temporal.PlainDateTime.from({ year: 5756, month: 3, day: 14, hour: 3, minute: 24, second: 30, calendar: 'hebrew' });
// => 1995-12-07T03:24:30[u-ca=hebrew]

// Different overflow modes
dt = Temporal.PlainDateTime.from({ year: 2001, month: 13, day: 1 }, { overflow: 'constrain' });
// => 2001-12-01T00:00:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 32 }, { overflow: 'constrain' });
// => 2001-01-31T00:00:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, hour: 25 }, { overflow: 'constrain' });
// => 2001-01-01T23:00:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { overflow: 'constrain' });
// => 2001-01-01T00:59:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 13, day: 1 }, { overflow: 'reject' });
// => throws
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 32 }, { overflow: 'reject' });
// => throws
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, hour: 25 }, { overflow: 'reject' });
// => throws
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { overflow: 'reject' });
// => throws
Temporal.PlainDateTime.compare(one: Temporal.PlainDateTime | object | string, two: Temporal.PlainDateTime | object | string) : number
Parameters:

one (Temporal.PlainDateTime or value convertible to one): First date/time to compare.
two (Temporal.PlainDateTime or value convertible to one): Second date/time to compare.
Returns: −1, 0, or 1.

Compares two Temporal.PlainDateTime objects. Returns an integer indicating whether one comes before or after or is equal to two.

−1 if one comes before two
0 if one and two are the same date and time when projected into the ISO 8601 calendar
1 if one comes after two
If one and two are not Temporal.PlainDateTime objects, then they will be converted to one as if they were passed to Temporal.PlainDateTime.from().

Calendars are ignored in the comparison. For example, this method returns 0 for instances that fall on the same day and time in the ISO 8601 calendar, even if their calendars describe it with a different year, month, and/or day.

This function can be used to sort arrays of Temporal.PlainDateTime objects. For example:

one = Temporal.PlainDateTime.from('1995-12-07T03:24');
two = Temporal.PlainDateTime.from('1995-12-07T01:24');
three = Temporal.PlainDateTime.from('2015-12-07T01:24');
sorted = [one, two, three].sort(Temporal.PlainDateTime.compare);
sorted.join(' ');
// => '1995-12-07T01:24:00 1995-12-07T03:24:00 2015-12-07T01:24:00'
Properties
datetime.year : number
datetime.month : number
datetime.monthCode : string
datetime.day : number
datetime.hour: number
datetime.minute: number
datetime.second: number
datetime.millisecond: number
datetime.microsecond: number
datetime.nanosecond: number
The above read-only properties allow accessing each component of a date or time individually.

Date unit details:

year is a signed integer representing the number of years relative to a calendar-specific epoch. For calendars that use eras, the anchor is usually aligned with the latest era so that eraYear === year for all dates in that era. However, some calendars like Japanese may use a different anchor.
month is a positive integer representing the ordinal index of the month in the current year. For calendars like Hebrew or Chinese that use leap months, the same-named month may have a different month value depending on the year. The first month in every year has month equal to 1. The last month of every year has month equal to the monthsInYear property. month values start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).
monthCode is a calendar-specific string that identifies the month in a year-independent way. For common (non-leap) months, monthCode should be `M${month}`, where month is zero padded up to two digits. For uncommon (leap) months in lunisolar calendars like Hebrew or Chinese, the month code is the previous month's code with an "L" suffix appended. Examples: 'M02' => February; 'M08L' => repeated 8th month in the Chinese calendar; 'M05L' => Adar I in the Hebrew calendar.
day is a positive integer representing the day of the month.
Either month or monthCode can be used in from or with to refer to the month. Similarly, in calendars that user eras an era/eraYear pair can be used in place of year when calling from or with.

Time unit details:

hour is an integer between 0 and 23
minute is an integer between 0 and 59
second is an integer between 0 and 59. If 60 (for a leap second) was provided to from or with, 59 will stored and will be returned by this property.
millisecond is an integer between 0 and 999
microsecond is an integer between 0 and 999
nanosecond is an integer between 0 and 999
Usage examples:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.year; // => 1995
dt.month; // => 12
dt.monthCode; // => 'M12'
dt.day; // => 7
dt.hour; // => 3
dt.minute; // => 24
dt.second; // => 30
dt.millisecond; // => 0
dt.microsecond; // => 3
dt.nanosecond; // => 500

dt = Temporal.PlainDateTime.from('2019-02-23T03:24:30.000003500[u-ca=hebrew]');
dt.year; // => 5779
dt.month; // => 6
dt.monthCode; // => 'M05L'
dt.day; // => 18
dt.hour; // => 3
dt.minute; // => 24
dt.second; // => 30
dt.millisecond; // => 0
dt.microsecond; // => 3
dt.nanosecond; // => 500
datetime.calendarId : string
The calendarId read-only property gives the identifier of the calendar that the year, month, monthCode, and day properties are interpreted in. If the date was created with a custom calendar object, this gives the id property of that object.

datetime.era : string | undefined
datetime.eraYear : number | undefined
In calendars that use eras, the era and eraYear read-only properties can be used together to resolve an era-relative year. Both properties are undefined when using the ISO 8601 calendar. As inputs to from or with, era and eraYear can be used instead of year. Unlike year, eraYear may decrease as time proceeds because some eras (like the BCE era in the Gregorian calendar) count years backwards.

date = Temporal.PlainDateTime.from('-000015-01-01T12:30[u-ca=gregory]');
date.era;
// => 'bce'
date.eraYear;
// => 16
date.year;
// => -15
datetime.dayOfWeek : number
The dayOfWeek read-only property gives the weekday number that the date falls on. For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7. For an overview, see ISO 8601 on Wikipedia.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][dt.dayOfWeek - 1]; // => 'THU'
datetime.dayOfYear : number
The dayOfYear read-only property gives the ordinal day of the year that the date falls on. For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
// ISO ordinal date
console.log(dt.year, dt.dayOfYear); // => '1995 341'
datetime.weekOfYear : number
The weekOfYear read-only property gives the ISO week number of the date. For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well. ISO week 1 is the week containing the first Thursday of the year. For more information on ISO week numbers, see for example the Wikipedia article on ISO week date.

When combining the week number with a year number, make sure to use datetime.yearOfWeek instead of datetime.year. This is because the first few days of a calendar year may be part of the last week of the previous year, and the last few days of a calendar year may be part of the first week of the new year, depending on which year the first Thursday falls in.

Usage example:

dt = Temporal.PlainDateTime.from('2022-01-01T03:24:30.000003500');
// ISO week date
console.log(dt.yearOfWeek, dt.weekOfYear, dt.dayOfWeek); // => '2021 52 6'
datetime.yearOfWeek : number
The yearOfWeek read-only property gives the ISO "week calendar year" of the date, which is the year number corresponding to the ISO week number. For the ISO 8601 calendar, this is normally the same as datetime.year, but in a few cases it may be the previous or following year. For more information on ISO week numbers, see for example the Wikipedia article on ISO week date.

See weekOfYear for a usage example.

datetime.daysInWeek : number
The daysInWeek read-only property gives the number of days in the week that the date falls in. For the ISO 8601 calendar, this is always 7, but in other calendar systems it may differ from week to week.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.daysInWeek; // => 7
datetime.daysInMonth : number
The daysInMonth read-only property gives the number of days in the month that the date falls in. For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
const dt = Temporal.Now.plainDateTimeISO().with({ month });
monthsByDays[dt.daysInMonth] = (monthsByDays[dt.daysInMonth] || []).concat(dt);
}

const strings = monthsByDays[30].map((dt) => dt.toLocaleString('en', { month: 'long' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
datetime.daysInYear : number
The daysInYear read-only property gives the number of days in the year that the date falls in. For the ISO 8601 calendar, this is 365 or 366, depending on whether the year is a leap year.

Usage example:

dt = Temporal.Now.plainDateTimeISO();
percent = dt.dayOfYear / dt.daysInYear;
`The year is ${percent.toLocaleString('en', { style: 'percent' })} over!`;
// example output: "The year is 10% over!"
datetime.monthsInYear: number
The monthsInYear read-only property gives the number of months in the year that the date falls in. For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

dt = Temporal.PlainDate.from('1900-01-01T12:00');
dt.monthsInYear; // => 12
datetime.inLeapYear : boolean
The inLeapYear read-only property tells whether the year that the date falls in is a leap year or not. Its value is true if the year is a leap year, and false if not.

NOTE: A "leap year" is a year that contains more days than other years (for solar or lunar calendars) or more months than other years (for lunisolar calendars like Hebrew or Chinese). In the ISO 8601 calendar, a year is a leap year (and has exactly one extra day, February 29) if it is evenly divisible by 4 but not 100 or if it is evenly divisible by 400.

Usage example:

// Is this year a leap year?
dt = Temporal.Now.plainDateTime('iso8601');
dt.inLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
dt.with({ year: 2100 }).inLeapYear; // => false
Methods
datetime.with(dateTimeLike: object, options?: object) : Temporal.PlainDateTime
Parameters:

dateTimeLike (object): an object with some or all of the properties of a Temporal.PlainDateTime.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
overflow (string): How to deal with out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDateTime object.

This method creates a new Temporal.PlainDateTime which is a copy of datetime, but any properties present on dateTimeLike override the ones already present on datetime.

Since Temporal.PlainDateTime objects each represent a fixed date and time, use this method instead of modifying one.

If the result is earlier or later than the range of dates that Temporal.PlainDateTime can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

NOTE: The allowed values for the dateTimeLike.month property start at 1, which is different from legacy Date where months are represented by zero-based indices (0 to 11).

NOTE: calendar and timeZone properties are not allowed on dateTimeLike. See the withCalendar and toZonedDateTime methods instead.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.with({ year: 2015, second: 31 }); // => 2015-12-07T03:24:31.0000035
datetime.withPlainTime(plainTime?: object | string) : Temporal.PlainDateTime
Parameters:

plainTime (optional Temporal.PlainTime or plain object or string): The clock time that should replace the current clock time of datetime. If omitted, the clock time of the result will be 00:00:00.
Returns: a new Temporal.PlainDateTime object which is the date indicated by datetime, combined with the time represented by plainTime.

Valid input to withPlainTime is the same as valid input to Temporal.PlainTime.from, including strings like 12:15:36, plain object property bags like { hour: 20, minute: 30 }, or Temporal objects that contain time fields: Temporal.PlainTime, Temporal.ZonedDateTime, or Temporal.PlainDateTime.

This method is similar to with, but with a few important differences:

withPlainTime accepts strings, Temporal objects, or object property bags. with only accepts object property bags and does not accept strings nor Temporal.PlainTime objects because they can contain calendar information.
withPlainTime will default all missing time units to zero, while with will only change units that are present in the input object.
If plainTime is a Temporal.PlainTime object, then this method returns the same result as plainTime.toPlainDateTime(datetime) but can be easier to use, especially when chained to previous operations that return a Temporal.PlainDateTime.

Usage example:

dt = Temporal.PlainDateTime.from('2015-12-07T03:24:30.000003500');
dt.withPlainTime({ hour: 10 }); // => 2015-12-07T10:00:00
time = Temporal.PlainTime.from('11:22');
dt.withPlainTime(time); // => 2015-12-07T11:22:00
dt.withPlainTime('12:34'); // => 2015-12-07T12:34:00

// easier for chaining
dt.add({ days: 2, hours: 22 }).withPlainTime('00:00'); // => 2015-12-10T00:00:00
datetime.withPlainDate(plainDate: object | string) : Temporal.PlainDateTime
Parameters:

plainDate (Temporal.PlainDate or plain object or string): The calendar date that should replace the current calendar date of datetime.
Returns: a new Temporal.PlainDateTime object which is the date indicated by datetime, combined with the date represented by plainDate.

Valid input to withPlainDate is the same as valid input to Temporal.PlainDate.from, including strings like 2000-03-01, plain object property bags like { year: 2020, month: 3, day: 1 }, or Temporal objects that contain a year, month, and day property, including Temporal.PlainDate, Temporal.PlainDateTime, or Temporal.ZonedDateTime.

All three date units (year, month, and day) are required. Temporal.YearMonth and Temporal.MonthDay are not valid input because they lack all date units. Both of those types have a toPlainDate method that can be used to obtain a Temporal.PlainDate which can in turn be used as input to withPlainDate.

If plainDate contains a non-ISO 8601 calendar, then the result of withPlainDate will be the calendar of plainDate. However, if datetime.calendar is already a non-ISO 8601 calendar, then this method will throw a RangeError. To resolve the error, first convert one of the instances to the same calendar or the ISO 8601 calendar, e.g. using .withCalendar('iso8601').

This method is similar to with, but with a few important differences:

withPlainDate accepts strings, Temporal objects, or object property bags. with only accepts object property bags and does not accept strings nor Temporal.PlainDate objects because they can contain calendar information.
withPlainDate will update all date units, while with only changes individual units that are present in the input, e.g. setting the day to 1 while leaving month and year unchanged.
If plainDate is a Temporal.PlainDate object, then this method returns the same result as plainDate.toPlainDateTime(datetime) but can be easier to use, especially when chained to previous operations that return a Temporal.PlainDateTime.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30');
dt.withPlainDate({ year: 2000, month: 6, day: 1 }); // => 2000-06-01T03:24:30
date = Temporal.PlainDate.from('2020-01-23');
dt.withPlainDate(date); // => 2020-01-23T03:24:30
dt.withPlainDate('2018-09-15'); // => 2018-09-15T03:24:30

// easier for chaining
dt.add({ hours: 12 }).withPlainDate('2000-06-01'); // => 2000-06-01T15:24:30

// result contains a non-ISO calendar if present in the input
dt.withCalendar('japanese').withPlainDate('2008-09-06'); // => 2008-09-06T03:24:30[u-ca=japanese]
dt.withPlainDate('2017-09-06[u-ca=japanese]'); // => 2017-09-06T03:24:30[u-ca=japanese]
/_ WRONG _/ dt.withCalendar('japanese').withPlainDate('2017-09-06[u-ca=hebrew]'); // => RangeError (calendar conflict)
datetime.withCalendar(calendar: object | string) : Temporal.PlainDateTime
Parameters:

calendar (Temporal.Calendar or plain object or string): The calendar into which to project datetime.
Returns: a new Temporal.PlainDateTime object which is the date indicated by datetime, projected into calendar.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500[u-ca=japanese]');
dt.withCalendar('iso8601'); // => 1995-12-07T03:24:30.0000035
datetime.add(duration: Temporal.Duration | object | string, options?: object) : Temporal.PlainDateTime
Parameters:

duration (Temporal.Duration or value convertible to one): The duration to add.
options (optional object): An object with properties representing options for the addition. The following options are recognized:
overflow (string): How to deal with additions that result in out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDateTime object which is the date and time indicated by datetime plus duration.

This method adds duration to datetime, returning a point in time that is in the future relative to datetime.

The duration argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a string such as PT5H30M, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

Some additions may be ambiguous, because months have different lengths. For example, adding one month to August 31 would result in September 31, which doesn't exist. For these cases, the overflow option tells what to do:

In constrain mode (the default), out-of-range values are clamped to the nearest in-range value.
In reject mode, an addition that would result in an out-of-range value fails, and a RangeError is thrown.
Additionally, if the result is earlier or later than the range of dates that Temporal.PlainDateTime can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.add({ years: 20, months: 4, nanoseconds: 500 }); // => 2016-04-07T03:24:30.000004

dt = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt.add({ months: 1 }); // => 2019-02-28T15:30:00
dt.add({ months: 1 }, { overflow: 'reject' }); // => throws
datetime.subtract(duration: Temporal.Duration | object | string, options?: object) : Temporal.PlainDateTime
Parameters:

duration (Temporal.Duration or value convertible to one): The duration to subtract.
options (optional object): An object with properties representing options for the subtraction. The following options are recognized:
overflow (string): How to deal with subtractions that result in out-of-range values. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDateTime object which is the time indicated by datetime minus duration.

This method subtracts duration from datetime, returning a point in time that is in the past relative to datetime.

The duration argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a string such as PT5H30M, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

Some subtractions may be ambiguous, because months have different lengths. For example, subtracting one month from July 31 would result in June 31, which doesn't exist. For these cases, the overflow option tells what to do:

In constrain mode (the default), out-of-range values are clamped to the nearest in-range value.
In reject mode, an addition that would result in an out-of-range value fails, and a RangeError is thrown.
Additionally, if the result is earlier or later than the range of dates that Temporal.PlainDateTime can represent (approximately half a million years centered on the Unix epoch), then this method will throw a RangeError regardless of overflow.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.subtract({ years: 20, months: 4, nanoseconds: 500 }); // => 1975-08-07T03:24:30.000003

dt = Temporal.PlainDateTime.from('2019-03-31T15:30');
dt.subtract({ months: 1 }); // => 2019-02-28T15:30:00
dt.subtract({ months: 1 }, { overflow: 'reject' }); // => throws
datetime.until(other: Temporal.PlainDateTime | object | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.PlainDateTime or value convertible to one): Another date/time until when to compute the difference.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'nanosecond', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the elapsed time after datetime and until other.

This method computes the difference between the two times represented by datetime and other, optionally rounds it, and returns it as a Temporal.Duration object. If other is earlier than datetime then the resulting duration will be negative. If using the default options, adding the returned Temporal.Duration to datetime will yield other.

If other is not a Temporal.PlainDateTime object, then it will be converted to one as if it were passed to Temporal.PlainDateTime.from().

The largestUnit option controls how the resulting duration is expressed. The returned Temporal.Duration object will not have any nonzero fields that are larger than the unit in largestUnit. A difference of two hours will become 7200 seconds when largestUnit is "seconds", for example. However, a difference of 30 seconds will still be 30 seconds even if largestUnit is "hours". A value of 'auto' means 'day', unless smallestUnit is 'year', 'month', or 'week', in which case largestUnit is equal to smallestUnit.

By default, the largest unit in the result is days. This is because months and years can be different lengths depending on which month is meant and whether the year is a leap year.

You can round the result using the smallestUnit, roundingIncrement, and roundingMode options. These behave as in the Temporal.Duration.round() method, but increments of days and larger are allowed. Because rounding to an increment expressed in days or larger units requires a reference point, datetime is used as the starting point in that case. The default is to do no rounding.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit. For some durations, the resulting value may overflow Number.MAX_SAFE_INTEGER and lose precision in its least significant digit(s). Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Computing the difference between two date/times in different calendar systems is not supported. If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with datetime.withCalendar().

Usage example:

dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt1.until(dt2);
// => P8456DT12H5M29.9999965S
dt1.until(dt2, { largestUnit: 'year' });
// => P23Y1M24DT12H5M29.9999965S
dt2.until(dt1, { largestUnit: 'year' });
// => -P23Y1M24DT12H5M29.9999965S
dt1.until(dt2, { largestUnit: 'nanosecond' });
// => PT730641929.999996544S
// (precision lost)

// Rounding, for example if you don't care about sub-seconds
dt1.until(dt2, { smallestUnit: 'second' });
// => P8456DT12H5M29S

// Months and years can be different lengths
let [jan1, feb1, mar1] = [1, 2, 3].map((month) =>
Temporal.PlainDateTime.from({ year: 2020, month, day: 1 }));
jan1.until(feb1); // => P31D
jan1.until(feb1, { largestUnit: 'month' }); // => P1M
feb1.until(mar1); // => P29D
feb1.until(mar1, { largestUnit: 'month' }); // => P1M
jan1.until(mar1); // => P60D
datetime.since(other: Temporal.PlainDateTime | object | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.PlainDateTime or value convertible to one): Another date/time since when to compute the difference.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'nanosecond', i.e., no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc', which truncates any remainder towards zero.
Returns: a Temporal.Duration representing the elapsed time before datetime and since other.

This method computes the difference between the two times represented by datetime and other, optionally rounds it, and returns it as a Temporal.Duration object. If other is later than datetime then the resulting duration will be negative.

This method is similar to Temporal.PlainDateTime.prototype.until(), but reversed. If using the default options, subtracting the returned Temporal.Duration from datetime will yield other, and dt1.since(dt2) will yield the same result as dt1.until(dt2).negated().

Usage example:

dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt2.since(dt1); // => P8456DT12H5M29.9999965S
datetime.round(roundTo: string | object) : Temporal.PlainDateTime
Parameters:

roundTo (string | object): A required string or object to control the operation.
If a string is provided, the resulting Temporal.PlainDateTime object will be rounded to that unit. Valid values are 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. A string parameter is treated the same as an object whose smallestUnit property value is that string.
If an object is passed, the following properties are recognized:
smallestUnit (required string): The unit to round to. Valid values are 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'halfExpand'.
Returns: a new Temporal.PlainDateTime object which is datetime rounded to roundTo (if a string parameter is used) or roundingIncrement of smallestUnit (if an object parameter is used).

Rounds datetime to the given unit and increment, and returns the result as a new Temporal.PlainDateTime object.

The smallestUnit option (or the value of roundTo if a string parameter is used) determines the unit to round to. For example, to round to the nearest minute, use smallestUnit: 'minute'. This option is required.

The roundingIncrement option allows rounding to an integer number of units. For example, to round to increments of a half hour, use smallestUnit: 'minute', roundingIncrement: 30.

The value given as roundingIncrement must divide evenly into the next highest unit after smallestUnit, and must not be equal to it. (For example, if smallestUnit is 'minute', then the number of minutes given by roundingIncrement must divide evenly into 60 minutes, which is one hour. The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30. Instead of 60 minutes, use 1 hour.)

If smallestUnit is 'day', then 1 is the only allowed value for roundingIncrement.

The roundingMode option controls how the rounding is performed.

ceil, expand: Always round up, towards the end of time.
floor, trunc: Always round down, towards the beginning of time.
halfCeil, halfExpand: Round to the nearest of the values allowed by roundingIncrement and smallestUnit. When there is a tie, round up, like ceil.
halfFloor, halfTrunc: Round to the nearest of the allowed values, like halfExpand, but when there is a tie, round down, like floor.
halfEven: Round to the nearest of the allowed values, but when there is a tie, round towards the value that is an even multiple of roundingIncrement. For example, with a roundingIncrement of 2, the number 7 would round up to 8 instead of down to 6, because 8 is an even multiple of 2 (2 × 4 = 8, and 4 is even), whereas 6 is an odd multiple (2 × 3 = 6, and 3 is odd).
Several pairs of modes behave the same as each other, but are both included for consistency with Temporal.Duration.round(), where they are not the same.

The default rounding mode is 'halfExpand' to match how rounding is often taught in school. Note that this is different than the 'trunc' default used by until and since options because rounding up would be an unexpected default for those operations. Other properties behave identically between these methods.

Example usage:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');

// Round to a particular unit
dt.round({ smallestUnit: 'hour' }); // => 1995-12-07T03:00:00
// Round to an increment of a unit, e.g. half an hour:
dt.round({ roundingIncrement: 30, smallestUnit: 'minute' });
// => 1995-12-07T03:30:00
// Round to the same increment but round down instead:
dt.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'floor' });
// => 1995-12-07T03:00:00
datetime.equals(other: Temporal.PlainDateTime | object | string) : boolean
Parameters:

other (Temporal.PlainDateTime): Another date/time to compare.
Returns: true if datetime and other are equal, or false if not.

Compares two Temporal.PlainDateTime objects for equality.

This function exists because it's not possible to compare using datetime == other or datetime === other, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two dates/times occur, then this function may be less typing and more efficient than Temporal.PlainDateTime.compare.

Note that this function will return false if the two objects have different calendar properties, even if the actual dates and times are equal.

If other is not a Temporal.PlainDateTime object, then it will be converted to one as if it were passed to Temporal.PlainDateTime.from().

Example usage:

dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt1.equals(dt2); // => false
dt1.equals(dt1); // => true
datetime.toString(options?: object) : string
Parameters:

options (optional object): An object with properties representing options for the operation. The following options are recognized:
calendarName (string): Whether to show the calendar annotation in the return value. Valid values are 'auto', 'always', 'never', and 'critical'. The default is 'auto'.
fractionalSecondDigits (number or string): How many digits to print after the decimal point in the output string. Valid values are 'auto', 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9. The default is 'auto'.
smallestUnit (string): The smallest unit of time to include in the output string. This option overrides fractionalSecondDigits if both are given. Valid values are 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc'.
Returns: a string in the ISO 8601 date format representing datetime.

This method overrides the Object.prototype.toString() method and provides a convenient, unambiguous string representation of datetime. The string can be passed to Temporal.PlainDateTime.from() to create a new Temporal.PlainDateTime object.

The output precision can be controlled with the fractionalSecondDigits or smallestUnit option. If no options are given, the default is fractionalSecondDigits: 'auto', which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the roundingMode option, as in Temporal.PlainDateTime.round(). Note that rounding may change the value of other units as well.

Normally, a calendar annotation is shown when datetime's calendar is not the ISO 8601 calendar. By setting the calendarName option to 'always' or 'never' this can be overridden to always or never show the annotation, respectively. Normally not necessary, a value of 'critical' is equivalent to 'always' but the annotation will contain an additional ! for certain interoperation use cases. For more information on the calendar annotation, see the Temporal string formats documentation.

Example usage:

dt = Temporal.PlainDateTime.from({
year: 1999,
month: 12,
day: 31,
hour: 23,
minute: 59,
second: 59,
millisecond: 999,
microsecond: 999,
nanosecond: 999
});
dt.toString(); // => '1999-12-31T23:59:59.999999999'

dt.toString({ smallestUnit: 'minute' }); // => '1999-12-31T23:59'
dt.toString({ fractionalSecondDigits: 0 }); // => '1999-12-31T23:59:59'
dt.toString({ fractionalSecondDigits: 4 }); // => '1999-12-31T23:59:59.9999'
dt.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' });
// => '2000-01-01T00:00:00.00000000'
datetime.toLocaleString(locales?: string | array<string>, options?: object) : string
Parameters:

locales (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
options (optional object): An object with properties influencing the formatting.
Returns: a language-sensitive representation of datetime.

This method overrides Object.prototype.toLocaleString() to provide a human-readable, language-sensitive representation of datetime.

The locales and options arguments are the same as in the constructor to Intl.DateTimeFormat.

NOTE: Unlike in Temporal.Instant.prototype.toLocaleString(), options.timeZone will have no effect, because Temporal.PlainDateTime carries no time zone information. It's not always possible to uniquely determine the localized time zone name using the Temporal.PlainDateTime instance and the options.timeZone. Therefore, to display a localized date and time including its time zone, convert the Temporal.PlainDateTime to a Temporal.ZonedDateTime or Temporal.Instant and then call the toLocaleString() method.

Example usage:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.toLocaleString(); // example output: 1995-12-07, 3:24:30 a.m.
dt.toLocaleString('de-DE'); // example output: 7.12.1995, 03:24:30
dt.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'long' }); // => 'Donnerstag'
dt.toLocaleString('en-US-u-nu-fullwide-hc-h12'); // => '１２/７/１９９５, ３:２４:３０ AM'
datetime.toJSON() : string
Returns: a string in the ISO 8601 date format representing datetime.

This method is the same as datetime.toString(). It is usually not called directly, but it can be called automatically by JSON.stringify().

The reverse operation, recovering a Temporal.PlainDateTime object from a string, is Temporal.PlainDateTime.from(), but it cannot be called automatically by JSON.parse(). If you need to rebuild a Temporal.PlainDateTime object from a JSON string, then you need to know the names of the keys that should be interpreted as Temporal.PlainDateTimes. In that case you can build a custom "reviver" function for your use case.

Example usage:

const event = {
id: 311,
name: 'FictionalConf 2018',
openingDateTime: Temporal.PlainDateTime.from('2018-07-06T10:00'),
closingDateTime: Temporal.PlainDateTime.from('2018-07-08T18:15')
};
const str = JSON.stringify(event, null, 2);
console.log(str);
// =>
// {
// "id": 311,
// "name": "FictionalConf 2018",
// "openingDateTime": "2018-07-06T10:00",
// "closingDateTime": "2018-07-08T18:15"
// }

// To rebuild from the string:
function reviver(key, value) {
if (key.endsWith('DateTime')) return Temporal.PlainDateTime.from(value);
return value;
}
JSON.parse(str, reviver);
datetime.valueOf()
This method overrides Object.prototype.valueOf() and always throws an exception. This is because it's not possible to compare Temporal.PlainDateTime objects with the relational operators <, <=, >, or >=. Use Temporal.PlainDateTime.compare() for this, or datetime.equals() for equality.

datetime.toZonedDateTime(timeZone : object | string, options?: object) : Temporal.ZonedDateTime
Parameters:

timeZone (optional string or object): The time zone in which to interpret dateTime, as a Temporal.TimeZone object, an object implementing the time zone protocol, or a string.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
disambiguation (string): How to disambiguate if the date and time given by dateTime does not exist in the time zone, or exists more than once. Allowed values are 'compatible', 'earlier', 'later', and 'reject'. The default is 'compatible'.
Returns: A Temporal.ZonedDateTime object representing the calendar date and wall-clock time from dateTime projected into timeZone.

This method converts a Temporal.PlainDateTime to a Temporal.ZonedDateTime by adding a time zone.

For a list of IANA time zone names, see the current version of the IANA time zone database. A convenient list is also available on Wikipedia, although it might not reflect the latest official status.

In the case of ambiguity caused by DST or other time zone changes, the disambiguation option controls how to resolve the ambiguity:

'compatible' (the default): Acts like 'earlier' for backward transitions and 'later' for forward transitions.
'earlier': The earlier of two possible times.
'later': The later of two possible times.
'reject': Throw a RangeError instead.
When interoperating with existing code or services, 'compatible' mode matches the behavior of legacy Date as well as libraries like moment.js, Luxon, and date-fns. This mode also matches the behavior of cross-platform standards like RFC 5545 (iCalendar).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset if 'compatible' or 'later' is used or the post-transition time zone offset if 'earlier' is used. This behavior avoids exceptions when converting nonexistent Temporal.PlainDateTime values to Temporal.ZonedDateTime, but it also means that values during these periods will result in a different Temporal.PlainDateTime in "round-trip" conversions to Temporal.ZonedDateTime and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see Resolving ambiguity.

If the result is earlier or later than the range that Temporal.ZonedDateTime can represent (approximately half a million years centered on the Unix epoch), then a RangeError will be thrown, no matter the value of disambiguation.

datetime.toPlainDate() : Temporal.PlainDate
Returns: a Temporal.PlainDate object that is the same as the date portion of datetime.

datetime.toPlainYearMonth() : Temporal.PlainYearMonth
Returns: a Temporal.PlainYearMonth object that is the same as the year and month of datetime.

datetime.toPlainMonthDay() : Temporal.PlainMonthDay
Returns: a Temporal.PlainMonthDay object that is the same as the month and day of datetime.

datetime.toPlainTime() : Temporal.PlainTime
Returns: a Temporal.PlainTime object that is the same as the wall-clock time portion of datetime.

The above four methods can be used to convert Temporal.PlainDateTime into a Temporal.PlainDate, Temporal.PlainYearMonth, Temporal.PlainMonthDay, or Temporal.PlainTime respectively. The converted object carries a copy of all the relevant fields of datetime (for example, in toPlainDate(), the year, month, and day properties are copied.)

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.toPlainDate(); // => 1995-12-07
dt.toPlainYearMonth(); // => 1995-12
dt.toPlainMonthDay(); // => 12-07
dt.toPlainTime(); // => 03:24:30.0000035
datetime.getCalendar(): object
Returns: a Temporal.Calendar instance or plain object representing the calendar in which datetime is reckoned.

This method is mainly useful if you need an object on which to call calendar methods. Most code will not need to use it.

datetime.getISOFields(): { isoYear: number, isoMonth: number, isoDay: number, isoHour: number, isoMinute: number, isoSecond: number, isoMillisecond: number, isoMicrosecond: number, isoNanosecond: number, calendar: string | object }
Returns: a plain object with properties expressing datetime in the ISO 8601 calendar, as well as the calendar (usually a string, but may be an object) in which datetime is reckoned.

This method is mainly useful if you are implementing a custom calendar. Most code will not need to use it.

Usage example:

dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
f = dt.getISOFields();
f.isoDay; // => 7
// Fields correspond exactly to constructor arguments:
dt2 = new Temporal.PlainDateTime(f.isoYear, f.isoMonth, f.isoDay, f.isoHour, f.isoMinute,
f.isoSecond, f.isoMillisecond, f.isoMicrosecond, f.isoNanosecond, f.calendar);
dt.equals(dt2); // => true

// Date in other calendar
dt = dt.withCalendar('hebrew');
dt.day; // => 14
dt.getISOFields().isoDay; // => 7

// Most likely what you need is this:
dt.withCalendar('iso8601').day; // => 7

## Temporal.Duration

Table of Contents
A Temporal.Duration represents a duration of time which can be used in date/time arithmetic.

Temporal.Duration can be constructed directly or returned from Temporal.Duration.from(). It can also be obtained from the since() method of any other Temporal type that supports arithmetic, and is used in those types' add() and subtract() methods.

When printed, a Temporal.Duration produces a string according to the ISO 8601 notation for durations. The examples in this page use this notation extensively.

Briefly, the ISO 8601 notation consists of a P character, followed by years, months, weeks, and days, followed by a T character, followed by hours, minutes, and seconds with a decimal part, each with a single-letter suffix that indicates the unit. Any zero components may be omitted. For more detailed information, see the ISO 8601 standard or the Wikipedia page.

ISO 8601 Meaning
P1Y1M1DT1H1M1.1S One year, one month, one day, one hour, one minute, one second, and 100 milliseconds
P40D Forty days
P1Y1D A year and a day
P3DT4H59M Three days, four hours and 59 minutes
PT2H30M Two and a half hours
P1M One month
PT1M One minute
PT0.0021S 2.1 milliseconds (two milliseconds and 100 microseconds)
PT0S Zero
P0D Zero
NOTE: According to the ISO 8601-1 standard, weeks are not allowed to appear together with any other units, and durations can only be positive. As extensions to the standard, ISO 8601-2 allows a sign character at the start of the string, and allows combining weeks with other units. If you intend to use a string such as P3W1D, +P1M, or -P1M for interoperability, note that other programs may not accept it.

Constructor
new Temporal.Duration(years?: number, months?: number, weeks?: number, days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number, microseconds?: number, nanoseconds?: number) : Temporal.Duration
Parameters:

years (optional number): A number of years.
months (optional number): A number of months.
weeks (optional number): A number of weeks.
days (optional number): A number of days.
hours (optional number): A number of hours.
minutes (optional number): A number of minutes.
seconds (optional number): A number of seconds.
milliseconds (optional number): A number of milliseconds.
microseconds (optional number): A number of microseconds.
nanoseconds (optional number): A number of nanoseconds.
Returns: a new Temporal.Duration object.

All of the arguments are optional. Any missing or undefined numerical arguments are taken to be zero, and all arguments must be integers. Any non-zero arguments must all have the same sign.

Use this constructor directly if you have the correct parameters already as numerical values. Otherwise Temporal.Duration.from() is probably more convenient because it accepts more kinds of input and allows controlling the overflow behavior.

Usage examples:

new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321); // => P1Y2M3W4DT5H6M7.987654321S
new Temporal.Duration(0, 0, 0, 40); // => P40D
new Temporal.Duration(undefined, undefined, undefined, 40); // => P40D
new Temporal.Duration(); // => PT0S

/_ WRONG _/ new Temporal.Duration(0, 0, 0, 1.5); // => throws
Static methods
Temporal.Duration.from(thing: any) : Temporal.Duration
Parameters:

thing: A Duration-like object or a string from which to create a Temporal.Duration.
Returns: a new Temporal.Duration object.

This static method creates a new Temporal.Duration from another value. If the value is another Temporal.Duration object, a new object representing the same duration is returned. If the value is any other object, a Temporal.Duration will be constructed from the values of any years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, and nanoseconds properties that are present. Any missing ones will be assumed to be 0.

All non-zero values must be integers, must have the same sign, and must not be infinite. Otherwise, the function will throw a RangeError.

Any non-object value is converted to a string, which is expected to be in ISO 8601 format.

NOTE: This function understands strings where weeks and other units are combined, and strings with a single sign character at the start, which are extensions to the ISO 8601 standard described in ISO 8601-2. For example, P3W1D is understood to mean three weeks and one day, -P1Y1M is a negative duration of one year and one month, and +P1Y1M is one year and one month. If no sign character is present, then the sign is assumed to be positive.

Usage examples:

d = Temporal.Duration.from({ years: 1, days: 1 }); // => P1Y1D
d = Temporal.Duration.from({ days: -2, hours: -12 }); // => -P2DT12H

Temporal.Duration.from(d) === d; // => false

d = Temporal.Duration.from('P1Y1D'); // => P1Y1D
d = Temporal.Duration.from('-P2DT12H'); // => -P2DT12H
d = Temporal.Duration.from('P0D'); // => PT0S

// Non-integer numbers are never allowed, even if they are allowed in an ISO string:
/_ WRONG _/ d = Temporal.Duration.from({ seconds: 1.5 }); // => throws
d = Temporal.Duration.from("PT1.5S"); // ok
d = Temporal.Duration.from({ seconds: 1, milliseconds: 500 }); // ok

// Mixed-sign values are never allowed, even if overall positive:
/_ WRONG _/ d = Temporal.Duration.from({ hours: 1, minutes: -30 }); // => throws
Temporal.Duration.compare(one: Temporal.Duration | object | string, two: Temporal.Duration | object | string, options?: object) : number
Parameters:

one (Temporal.Duration or value convertible to one): First duration to compare.
two (Temporal.Duration or value convertible to one): Second duration to compare.
options (object): An object with properties representing options for the operation. The following option is recognized:
relativeTo (Temporal.PlainDate, Temporal.ZonedDateTime, or value convertible to one of those): The starting point to use when converting between years, months, weeks, and days.
Returns: −1, 0, or 1.

Compares two Temporal.Duration objects. Returns an integer indicating whether one is shorter or longer or is equal to two.

−1 if one is shorter than two;
0 if one and two are equally long;
1 if one is longer than two.
If one and two are not Temporal.Duration objects, then they will be converted to one as if they were passed to Temporal.Duration.from().

If any of the years, months, or weeks properties of either of the durations are nonzero, then the relativeTo option is required, since comparing durations with years, months, or weeks requires a point on the calendar to figure out how long they are.

Negative durations are treated as the same as negative numbers for comparison purposes: they are "less" (shorter) than zero.

The relativeTo option may be a Temporal.ZonedDateTime in which case time zone offset changes will be taken into account when comparing days with hours. If relativeTo is a Temporal.PlainDate, then days are always considered equal to 24 hours.

If relativeTo is neither a Temporal.PlainDate nor a Temporal.ZonedDateTime, then it will be converted to one of the two, as if it were first attempted with Temporal.ZonedDateTime.from() and then with Temporal.PlainDate.from(). This means that an ISO 8601 string with a time zone name annotation in it, or a property bag with a timeZone property, will be converted to a Temporal.ZonedDateTime, and an ISO 8601 string without a time zone name or a property bag without a timeZone property will be converted to a Temporal.PlainDate.

This function can be used to sort arrays of Temporal.Duration objects. For example:

one = Temporal.Duration.from({ hours: 79, minutes: 10 });
two = Temporal.Duration.from({ days: 3, hours: 7, seconds: 630 });
three = Temporal.Duration.from({ days: 3, hours: 6, minutes: 50 });
sorted = [one, two, three].sort(Temporal.Duration.compare);
sorted.join(' ');
// => 'P3DT6H50M PT79H10M P3DT7H630S'

// Sorting relative to a date, taking DST changes into account:
relativeTo = Temporal.ZonedDateTime.from('2020-11-01T00:00-07:00[America/Los_Angeles]');
sorted = [one, two, three].sort((one, two) => Temporal.Duration.compare(one, two, { relativeTo }));
sorted.join(' ');
// => 'PT79H10M P3DT6H50M P3DT7H630S'
Properties
duration.years : number
duration.months : number
duration.weeks : number
duration.days : number
duration.hours : number
duration.minutes : number
duration.seconds : number
duration.milliseconds : number
duration.microseconds : number
duration.nanoseconds : number
The above read-only properties allow accessing each component of the duration individually.

Usage examples:

d = Temporal.Duration.from('P1Y2M3W4DT5H6M7.987654321S');
d.years // => 1
d.months // => 2
d.weeks // => 3
d.days // => 4
d.hours // => 5
d.minutes // => 6
d.seconds // => 7
d.milliseconds // => 987
d.microseconds // => 654
d.nanoseconds // => 321
duration.sign : number
The read-only sign property has the value –1, 0, or 1, depending on whether the duration is negative, zero, or positive.

duration.blank : boolean
The read-only blank property is a convenience property that tells whether duration represents a zero length of time. In other words, duration.blank === (duration.sign === 0).

Usage example:

d = Temporal.Duration.from('PT0S');
d.blank; // => true

d = Temporal.Duration.from({ days: 0, hours: 0, minutes: 0 });
d.blank; // => true
Methods
duration.with(durationLike: object) : Temporal.Duration
Parameters:

durationLike (object): an object with some or all of the properties of a Temporal.Duration.
Returns: a new Temporal.Duration object.

This method creates a new Temporal.Duration which is a copy of duration, but any properties present on durationLike override the ones already present on duration.

Since Temporal.Duration objects each represent a fixed duration, use this method instead of modifying one.

All non-zero properties of durationLike must have the same sign, and they must additionally have the same sign as the non-zero properties of duration, unless they override all of these non-zero properties. If a property of durationLike is infinity, then this function will throw a RangeError.

Usage example:

duration = Temporal.Duration.from({ months: 50, days: 50, hours: 50, minutes: 100 });
// Perform a balance operation using additional ISO 8601 calendar rules:
let { years, months } = duration;
years += Math.floor(months / 12);
months %= 12;
duration = duration.with({ years, months });
// => P4Y2M50DT50H100M
duration.add(other: Temporal.Duration | object | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.Duration or value convertible to one): The duration to add.
options (optional object): An object with properties representing options for the addition. The following option is recognized:
relativeTo (Temporal.PlainDate, Temporal.ZonedDateTime, or value convertible to one of those): The starting point to use when adding years, months, weeks, and days.
Returns: a new Temporal.Duration object which represents the sum of the durations of duration and other.

This method adds other to duration, resulting in a longer duration.

The other argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a string such as PT5H30M, or a Temporal.Duration object. If other is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

In order to be valid, the resulting duration must not have fields with mixed signs, and so the result is balanced. For usage examples and a more complete explanation of how balancing works and why it is necessary, see Duration balancing.

By default, you cannot add durations with years, months, or weeks, as that could be ambiguous depending on the start date. To do this, you must provide a start date using the relativeTo option.

The relativeTo option may be a Temporal.ZonedDateTime in which case time zone offset changes will be taken into account when converting between days and hours. If relativeTo is omitted or is a Temporal.PlainDate, then days are always considered equal to 24 hours.

If relativeTo is neither a Temporal.PlainDate nor a Temporal.ZonedDateTime, then it will be converted to one of the two, as if it were first attempted with Temporal.ZonedDateTime.from() and then with Temporal.PlainDate.from(). This means that an ISO 8601 string with a time zone name annotation in it, or a property bag with a timeZone property, will be converted to a Temporal.ZonedDateTime, and an ISO 8601 string without a time zone name or a property bag without a timeZone property will be converted to a Temporal.PlainDate.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

hour = Temporal.Duration.from('PT1H');
hour.add({ minutes: 30 }); // => PT1H30M

// Examples of balancing:
one = Temporal.Duration.from({ hours: 1, minutes: 30 });
two = Temporal.Duration.from({ hours: 2, minutes: 45 });
result = one.add(two); // => PT4H15M

fifty = Temporal.Duration.from('P50Y50M50DT50H50M50.500500500S');
/_ WRONG _/ result = fifty.add(fifty); // => throws, need relativeTo
result = fifty.add(fifty, { relativeTo: '1900-01-01' }); // => P108Y7M12DT5H41M41.001001S

// Example of converting ambiguous units relative to a start date
oneAndAHalfMonth = Temporal.Duration.from({ months: 1, days: 15 });
/_ WRONG _/ oneAndAHalfMonth.add(oneAndAHalfMonth); // => throws
oneAndAHalfMonth.add(oneAndAHalfMonth, { relativeTo: '2000-02-01' }); // => P3M
oneAndAHalfMonth.add(oneAndAHalfMonth, { relativeTo: '2000-03-01' }); // => P2M30D
duration.subtract(other: Temporal.Duration | object | string, options?: object) : Temporal.Duration
Parameters:

other (Temporal.Duration or value convertible to one): The duration to subtract.
options (optional object): An object with properties representing options for the subtraction. The following option is recognized:
relativeTo (Temporal.PlainDate, Temporal.ZonedDateTime, or value convertible to one of those): The starting point to use when adding years, months, weeks, and days.
Returns: a new Temporal.Duration object which represents the duration of duration less the duration of other.

This method subtracts other from duration, resulting in a shorter duration.

The other argument is an object with properties denoting a duration, such as { hours: 5, minutes: 30 }, or a string such as PT5H30M, or a Temporal.Duration object. If duration is not a Temporal.Duration object, then it will be converted to one as if it were passed to Temporal.Duration.from().

If other is larger than duration and the subtraction would result in a negative duration, the method will throw a RangeError.

In order to be valid, the resulting duration must not have fields with mixed signs, and so the result is balanced. For usage examples and a more complete explanation of how balancing works and why it is necessary, see Duration balancing.

By default, you cannot subtract durations with years, months, or weeks, as that could be ambiguous depending on the start date. To do this, you must provide a start date using the relativeTo option.

The relativeTo option may be a Temporal.ZonedDateTime in which case time zone offset changes will be taken into account when converting between days and hours. If relativeTo is omitted or is a Temporal.PlainDate, then days are always considered equal to 24 hours.

If relativeTo is neither a Temporal.PlainDate nor a Temporal.ZonedDateTime, then it will be converted to one of the two, as if it were first attempted with Temporal.ZonedDateTime.from() and then with Temporal.PlainDate.from(). This means that an ISO 8601 string with a time zone name annotation in it, or a property bag with a timeZone property, will be converted to a Temporal.ZonedDateTime, and an ISO 8601 string without a time zone name or a property bag without a timeZone property will be converted to a Temporal.PlainDate.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

hourAndAHalf = Temporal.Duration.from('PT1H30M');
hourAndAHalf.subtract({ hours: 1 }); // => PT30M

one = Temporal.Duration.from({ minutes: 180 });
two = Temporal.Duration.from({ seconds: 30 });
one.subtract(two); // => PT179M30S
one.subtract(two).round({ largestUnit: 'hour' }); // => PT2H59M30S

// Example of converting ambiguous units relative to a start date
threeMonths = Temporal.Duration.from({ months: 3 });
oneAndAHalfMonth = Temporal.Duration.from({ months: 1, days: 15 });
/_ WRONG _/ threeMonths.subtract(oneAndAHalfMonth); // => throws
threeMonths.subtract(oneAndAHalfMonth, { relativeTo: '2000-02-01' }); // => P1M16D
threeMonths.subtract(oneAndAHalfMonth, { relativeTo: '2000-03-01' }); // => P1M15D
duration.negated() : Temporal.Duration
Returns: a new Temporal.Duration object with the opposite sign.

This method gives the negation of duration. It returns a newly constructed Temporal.Duration with all the fields having the opposite sign (positive if negative, and vice versa.) If duration is zero, then the returned object is a copy of duration.

Usage example:

d = Temporal.Duration.from('P1Y2M3DT4H5M6.987654321S');
d.sign; // 1
d.negated(); // -P1Y2M3DT4H5M6.987654321S
d.negated().sign; // -1
duration.abs() : Temporal.Duration
Returns: a new Temporal.Duration object that is always positive.

This method gives the absolute value of duration. It returns a newly constructed Temporal.Duration with all the fields having the same magnitude as those of duration, but positive. If duration is already positive or zero, then the returned object is a copy of duration.

Usage example:

d = Temporal.Duration.from('-PT8H30M');
d.abs(); // PT8H30M
duration.round(roundTo: string | object) : Temporal.Duration
Parameters:

roundTo (string | object): A required string or object to control the operation.
If a string is provided, the resulting Temporal.Duration object will be rounded to that unit. Valid values are 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. A string parameter is treated the same as an object whose smallestUnit property value is that string.
If an object is passed, the following properties are recognized:
largestUnit (string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'auto'.
smallestUnit (string): The smallest unit of time to round to in the resulting Temporal.Duration object. Valid values are 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. The default is 'nanosecond', i.e. no rounding.
roundingIncrement (number): The granularity to round to, of the unit given by smallestUnit. The default is 1.
roundingMode (string): How to handle the remainder, if rounding. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'halfExpand'.
relativeTo (Temporal.PlainDate, Temporal.ZonedDateTime, or value convertible to one of those): The starting point to use when converting between years, months, weeks, and days.
Returns: a new Temporal.Duration object which is duration, rounded and/or balanced.

Rounds and/or balances duration to the given largest and smallest units and rounding increment, and returns the result as a new Temporal.Duration object.

The largestUnit determines the largest unit allowed in the result. It will cause units larger than largestUnit to be converted into smaller units, and units smaller than largestUnit to be converted into larger units as much as possible. For example, with largestUnit: 'minute', a duration of 1 hour and 125 seconds will be converted into a duration of 62 minutes and 5 seconds. These durations are equally long, so no rounding takes place, but they are expressed differently. This operation is called "balancing."

For usage examples and a more complete explanation of how balancing works, see Duration balancing.

A largestUnit value of 'auto', which is the default if only smallestUnit is given (or if roundTo is a string), means that largestUnit should be the largest nonzero unit in the duration that is larger than smallestUnit. For example, in a duration of 3 days and 12 hours, largestUnit: 'auto' would mean the same as largestUnit: 'day'. This behavior implies that the default balancing behavior of this method to not "grow" the duration beyond its current largest unit unless needed for rounding.

The smallestUnit option (or the value of roundTo if a string parameter is used) determines the unit to round to. For example, to round to the nearest minute, use smallestUnit: 'minute'. The default, if only largestUnit is given, is to do no rounding of smaller units.

If an object parameter is used, at least one of largestUnit or smallestUnit is required.

Converting between years, months, weeks, and other units requires a reference point. If largestUnit or smallestUnit is years, months, or weeks, or the duration has nonzero years, months, or weeks, then the relativeTo option is required.

The roundingIncrement option allows rounding to an integer number of units. For example, to round to increments of a half hour, use smallestUnit: 'minute', roundingIncrement: 30.

Unless smallestUnit is years, months, weeks, or days, the value given as roundingIncrement must divide evenly into the next highest unit after smallestUnit, and must not be equal to it. For example, if smallestUnit is 'minute', then the number of minutes given by roundingIncrement must divide evenly into 60 minutes, which is one hour. The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30. Instead of 60 minutes, use 1 hour.

The roundingMode option controls how the rounding is performed.

halfExpand: Round to the nearest of the values allowed by roundingIncrement and smallestUnit. When there is a tie, round away from zero like ceil for positive durations and like floor for negative durations. This is the default, and matches how rounding is often taught in school.
ceil: Always round towards positive infinity. For negative durations this option will decrease the absolute value of the duration which may be unexpected. To round away from zero, use expand.
expand: Always round away from zero like ceil for positive durations and like floor for negative durations.
trunc: Always round towards zero, chopping off the part after the decimal point.
floor: Always round down, towards negative infinity. This mode acts the same as trunc for positive durations but for negative durations it will increase the absolute value of the result which may be unexpected. For this reason, trunc is recommended for most "round down" use cases.
halfCeil: Round to the nearest of the allowed values like halfExpand, but when there is a tie, round towards positive infinity like ceil.
halfFloor: Round to the nearest of the allowed values like halfExpand, but when there is a tie, round towards negative infinity like floor.
halfTrunc: Round to the nearest of the allowed values like halfExpand, but when there is a tie, round towards zero like trunc.
halfEven: Round to the nearest of the allowed values like halfExpand, but when there is a tie, round towards the value that is an even multiple of the roundingIncrement. For example, with a roundingIncrement of 2, the number 7 would round up to 8 instead of down to 6, because 8 is an even multiple of 2 (2 × 4 = 8, and 4 is even), whereas 6 is an odd multiple (2 × 3 = 6, and 3 is odd).
The relativeTo option gives the starting point used when converting between or rounding to years, months, weeks, or days. It may be a Temporal.ZonedDateTime in which case time zone offset changes will be taken into account when converting between days and hours. If relativeTo is omitted or is a Temporal.PlainDate, then days are always considered equal to 24 hours.

If relativeTo is neither a Temporal.PlainDate nor a Temporal.ZonedDateTime, then it will be converted to one of the two, as if it were first attempted with Temporal.ZonedDateTime.from() and then with Temporal.PlainDate.from(). This means that an ISO 8601 string with a time zone name annotation in it, or a property bag with a timeZone property, will be converted to a Temporal.ZonedDateTime, and an ISO 8601 string without a time zone name or a property bag without a timeZone property will be converted to a Temporal.PlainDate.

Example usage:

// Balance a duration as far as possible without knowing a starting point
d = Temporal.Duration.from({ minutes: 130 });
d.round({ largestUnit: 'day' }); // => PT2H10M

// Round to the nearest unit
d = Temporal.Duration.from({ minutes: 10, seconds: 52 });
d.round({ smallestUnit: 'minute' }); // => PT11M
d.round({ smallestUnit: 'minute', roundingMode: 'trunc' }); // => PT10M

// How many seconds in a multi-unit duration?
d = Temporal.Duration.from('PT2H34M18S');
d.round({ largestUnit: 'second' }).seconds; // => 9258

// Normalize, with and without taking DST into account
d = Temporal.Duration.from({ hours: 2756 });
d.round({
relativeTo: '2020-01-01T00:00+01:00[Europe/Rome]',
largestUnit: 'year'
}); // => P114DT21H
// (one hour longer because DST skipped an hour)
d.round({
relativeTo: '2020-01-01',
largestUnit: 'year'
}); // => P114DT20H
// (one hour shorter if ignoring DST)

// Normalize days into months or years
d = Temporal.Duration.from({ days: 190 });
refDate = Temporal.PlainDate.from('2020-01-01');
d.round({ relativeTo: refDate, largestUnit: 'year' }); // => P6M8D

// Same, but in a different calendar system
d.round({
relativeTo: refDate.withCalendar('hebrew'),
largestUnit: 'year'
}); // => P6M13D

// Round a duration up to the next 5-minute billing period
d = Temporal.Duration.from({ minutes: 6 });
d.round({
smallestUnit: 'minute',
roundingIncrement: 5,
roundingMode: 'ceil'
}); // => PT10M

// How many full 3-month quarters of this year, are in this duration?
d = Temporal.Duration.from({ months: 10, days: 15 });
d = d.round({
smallestUnit: 'month',
roundingIncrement: 3,
roundingMode: 'trunc',
relativeTo: Temporal.Now.plainDateISO()
});
quarters = d.months / 3;
quarters; // => 3
duration.total(totalOf: string | object) : number
Parameters:

totalOf (string | object): A required string or object to control the operation.
If a string is passed, it represents the unit of time that will be returned. Valid values are 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. A string parameter is treated the same as an object whose unit property value is that string.
If an object is passed, the following properties are recognized:
unit (string): The unit of time that will be returned. Valid values are 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and 'nanosecond'. There is no default; unit is required.
relativeTo (Temporal.PlainDate, Temporal.ZonedDateTime, or value convertible to one of those): The starting point to use when converting between years, months, weeks, and days.
Returns: a floating-point number representing the number of desired units in the Temporal.Duration.

Calculates the number of units of time that can fit in a particular Temporal.Duration. If the duration IS NOT evenly divisible by the desired unit, then a fractional remainder will be present in the result. If the duration IS evenly divisible by the desired unit, then the integer result will be identical to duration.round({ smallestUnit: unit, largestUnit: unit, relativeTo })[unit].

Interpreting years, months, or weeks requires a reference point. Therefore, if unit is 'year', 'month', or 'week', or the duration has nonzero 'year', 'month', or 'week', then the relativeTo option is required. For this reason, it's required to use the object (not string) form of totalOf in these cases.

The relativeTo option gives the starting point used when converting between or rounding to years, months, weeks, or days. It may be a Temporal.ZonedDateTime in which case time zone offset changes will be taken into account when converting between days and hours. If relativeTo is omitted or is a Temporal.PlainDate, then days are always considered equal to 24 hours.

If relativeTo is neither a Temporal.PlainDate nor a Temporal.ZonedDateTime, then it will be converted to one of the two, as if it were first attempted with Temporal.ZonedDateTime.from() and then with Temporal.PlainDate.from(). This means that an ISO 8601 string with a time zone name annotation in it, or a property bag with a timeZone property, will be converted to a Temporal.ZonedDateTime, and an ISO 8601 string without a time zone name or a property bag without a timeZone property will be converted to a Temporal.PlainDate.

Example usage:

// How many seconds in 130 hours and 20 minutes?
d = Temporal.Duration.from({ hours: 130, minutes: 20 });
d.total({ unit: 'second' }); // => 469200

// How many 24-hour days is 123456789 seconds?
d = Temporal.Duration.from('PT123456789S');
d.total({ unit: 'day' }); // 1428.8980208333332

// Find totals in months, with and without taking DST into account
d = Temporal.Duration.from({ hours: 2756 });
d.total({
relativeTo: '2020-01-01T00:00+01:00[Europe/Rome]',
unit: 'month'
}); // => 3.7958333333333334
d.total({
unit: 'month',
relativeTo: '2020-01-01'
}); // => 3.7944444444444443
duration.toString(options?: object) : string
Parameters:

options (optional object): An object with properties representing options for the operation. The following options are recognized:
fractionalSecondDigits (number or string): How many digits to print after the decimal point in the output string. Valid values are 'auto', 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9. The default is 'auto'.
smallestUnit (string): The smallest unit of time to include in the output string. This option overrides fractionalSecondDigits if both are given. Valid values are 'second', 'millisecond', 'microsecond', and 'nanosecond'.
roundingMode (string): How to handle the remainder. Valid values are 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', and 'halfEven'. The default is 'trunc'.
Returns: the duration as an ISO 8601 string.

This method overrides Object.prototype.toString() and provides the ISO 8601 description of the duration.

NOTE: If any of duration.milliseconds, duration.microseconds, or duration.nanoseconds are over 999, then deserializing from the result of duration.toString() will yield an equal but different object. See Duration balancing for more information.

The output precision can be controlled with the fractionalSecondDigits or smallestUnit option. If no options are given, the default is fractionalSecondDigits: 'auto', which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the roundingMode option, as in Temporal.Duration.round(). Note that rounding may change the value of other units as well.

Usage examples:

d = Temporal.Duration.from({ years: 1, days: 1 });
d.toString(); // => P1Y1D
d = Temporal.Duration.from({ years: -1, days: -1 });
d.toString(); // => -P1Y1D
d = Temporal.Duration.from({ milliseconds: 1000 });
d.toString(); // => PT1S

// The output format always balances units under 1 s, even if the
// underlying Temporal.Duration object doesn't.
nobal = Temporal.Duration.from({ milliseconds: 3500 });
console.log(`${nobal}`, nobal.seconds, nobal.milliseconds); // => 'PT3.5S 0 3500'
bal = nobal.round({ largestUnit: 'year' }); // balance through round
console.log(`${bal}`, bal.seconds, bal.milliseconds); // => 'PT3.5S 3 500'

d = Temporal.Duration.from('PT59.999999999S');
d.toString({ smallestUnit: 'second' }); // => PT59S
d.toString({ fractionalSecondDigits: 0 }); // => PT59S
d.toString({ fractionalSecondDigits: 4 }); // => PT59.9999S
d.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' });
// => PT60.00000000S
duration.toJSON() : string
Returns: a string representation of the duration that can be passed to Temporal.Duration.from().

This method is the same as duration.toString(). It is usually not called directly, but it can be called automatically by JSON.stringify().

NOTE: The same caution about milliseconds, microseconds, or nanoseconds greater than 999 applies to this method as well.

The reverse operation, recovering a Temporal.Duration object from a string, is Temporal.Duration.from(), but it cannot be called automatically by JSON.parse(). If you need to rebuild a Temporal.Duration object from a JSON string, then you need to know the names of the keys that should be interpreted as Temporal.Durations. In that case you can build a custom "reviver" function for your use case.

Example usage:

const ban = {
reason: 'cooldown',
banDuration: Temporal.Duration.from({ hours: 48 })
};
const str = JSON.stringify(ban, null, 2);
console.log(str);
// =>
// {
// "reason": "cooldown",
// "banDuration": "PT48H"
// }

// To rebuild from the string:
function reviver(key, value) {
if (key.endsWith('Duration')) return Temporal.Duration.from(value);
return value;
}
JSON.parse(str, reviver);
duration.toLocaleString(locales?: string | array<string>, options?: object) : string
Parameters:

locales (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
options (optional object): An object with properties influencing the formatting.
Returns: a language-sensitive representation of the duration.

This method overrides Object.prototype.toLocaleString() to provide a human-readable, language-sensitive representation of duration.

The locales and options arguments are the same as in the constructor to Intl.DurationFormat.

NOTE: This method requires that your JavaScript environment supports Intl.DurationFormat. That is still an early-stage proposal and at the time of writing it is not supported anywhere. If Intl.DurationFormat is not available, then the output of this method is the same as that of duration.toString(), and the locales and options arguments are ignored.

Usage examples:

d = Temporal.Duration.from('P1DT6H30M');
d.toLocaleString(); // example output: '1 day 6 hours 30 minutes'
d.toLocaleString('de-DE'); // example output: '1 Tag 6 Stunden 30 Minuten'
d.toLocaleString('en-US', { day: 'numeric', hour: 'numeric' }); // example output: '1 day 6 hours'
duration.valueOf()
This method overrides Object.prototype.valueOf() and always throws an exception. This is because it's not possible to compare Temporal.Duration objects with the relational operators <, <=, >, or >=.

### Balancing - Duration balancing

Unlike the other Temporal types, the units in Temporal.Duration don't naturally wrap around to 0: you may want to have a duration of "90 minutes," and you don't want it to unexpectedly turn into "1 hour and 30 minutes."

Duration Balancing
With most types in Temporal, each unit has a natural maximum. For example, there is no such time as 11:87, so when creating a Temporal.PlainTime from 11:87 the time is either clipped to 11:59 ("constrain" mode) or an exception is thrown ("reject" mode).

With Temporal.Duration, however, maximums are less clear-cut. Take, for example, a duration of 100 seconds: Temporal.Duration.from({ seconds: 100 }). 100 seconds is equal to 1 minute and 40 seconds. In some cases you may want to "balance" it, yielding 1 minute and 40 seconds. In other cases you may want to keep it as an "unbalanced" duration of 100 seconds.

When a Temporal.Duration object is constructed from a string or a property bag object, no balancing is performed.

d = Temporal.Duration.from({ seconds: 100 });
d.minutes; // => 0
d.seconds; // => 100
d = Temporal.Duration.from('PT100S');
d.minutes; // => 0
d.seconds; // => 100
The most common kind of unbalanced duration is a "top-heavy" duration where only the largest nonzero unit is unbalanced, e.g. { days: 45, hours: 10 }. Unbalanced durations that are not top-heavy, like { days: 4, hours: 60 }, are rarely used.

Balancing Durations with round()
Temporal.Duration.prototype.round(), in addition to rounding duration units at the low end, can also balance durations too.

By default, round() will not enlarge a top-heavy unbalanced duration. By default, the largest unit in the input will be largest unit in the output.

d = Temporal.Duration.from({ minutes: 80, seconds: 30 }); // => PT80M30S
d.round({ largestUnit: 'auto' }); // => PT80M30S (unchanged)
However, round() will balance units smaller than the largest one. This only matters in the rare case that an unbalanced duration isn't top-heavy.

d = Temporal.Duration.from({ minutes: 80, seconds: 90 }); // => PT80M90S
d.round({ largestUnit: 'auto' });
// => PT81M30S (seconds balance to minutes, but not minutes=>hours)
To fully balance a duration, use the largestUnit option:

d = Temporal.Duration.from({ minutes: 80, seconds: 90 }); // => PT80M90S
d.round({ largestUnit: 'hour' }); // => PT1H21M30S (fully balanced)
Balancing Relative to a Reference Point
Balancing that includes days, weeks, months, and years is more complicated because those units can be different lengths. In the default ISO 8601 calendar, a year can be 365 or 366 days, and a month can be 28, 29, 30, or 31 days. In other calendars, years aren't always 12 months long and weeks aren't always 7 days. Finally, in time zones that use Daylight Saving Time (DST) days are not always 24 hours long.

Therefore, any Duration object with nonzero days, weeks, months, or years can refer to a different length of time depending on the specific date and time that it starts from. To handle this potential ambiguity, the relativeTo option is used to provide a starting point. relativeTo must be (or be parseable into) a Temporal.ZonedDateTime for timezone-specific durations or Temporal.PlainDate for timezone-neutral data. relativeTo is required when balancing to or from weeks, months, or years.

d = Temporal.Duration.from({ days: 370 }); // => P370D
/_ WRONG _/ d.round({ largestUnit: 'year' }); // => RangeError (`relativeTo` is required)
d.round({ largestUnit: 'year', relativeTo: '2019-01-01' }); // => P1Y5D
d.round({ largestUnit: 'year', relativeTo: '2020-01-01' }); // => P1Y4D (leap year)
relativeTo is optional when balancing to or from days, and if relativeTo is omitted then days are assumed to be 24 hours long. However, if the duration is timezone-specific, then it's recommended to use a Temporal.ZonedDateTime reference point to ensure that DST transitions are accounted for.

d = Temporal.Duration.from({ hours: 48 }); // => PT48H
d.round({ largestUnit: 'day' });
// => P2D
d.round({ largestUnit: 'day', relativeTo: '2020-03-08T00:00-08:00[America/Los_Angeles]' });
// => P2DT1H
// (because one clock hour was skipped by DST starting)
Balancing in Duration Arithmetic
In addition to round() as described above, add() and subtract() also balance their output into either a fully-balanced or a top-heavy duration depending on the largestUnit option.

By default, add() and subtract() on Temporal.Duration instances will only balance up to the largest unit in either input duration.

d1 = Temporal.Duration.from({ hours: 26, minutes: 45 }); // => PT26H45M
d2 = Temporal.Duration.from({ minutes: 30 }); // => PT30M
d1.add(d2); // => PT27H15M
The largestUnit option can be used to balance to larger units than the inputs.

d1 = Temporal.Duration.from({ minutes: 80, seconds: 90 }); // => PT80M90S
d2 = Temporal.Duration.from({ minutes: 100, seconds: 15 }); // => PT100M15S
d1.add(d2).round({ largestUnit: 'hour' }); // => PT3H1M45S (fully balanced)
The relativeTo option can be used to balance to, or from, weeks, months or years (or days for timezone-aware durations). relativeTo is interpreted relative to this, not to other, which allows the same relativeTo value to be used for a chain of arithmetic operations.

d1 = Temporal.Duration.from({ hours: 48 }); // => PT48H
d2 = Temporal.Duration.from({ hours: 24 }); // => PT24H
d1.add(d2).round({ largestUnit: 'day' });
// => P3D
d1.add(d2).round({ largestUnit: 'day', relativeTo: '2020-03-08T00:00-08:00[America/Los_Angeles]' });
// => P3DT1H
// (because one clock hour was skipped by DST starting)
Serialization of Fractional Seconds
Normally, any Temporal object can be serialized to a string with its toString() method, and deserialized by calling from() on the string. This goes for Temporal.Duration as well. However, if any of the milliseconds, microseconds, or nanoseconds properties are greater than 999, then Temporal.Duration.from(duration.toString()) will not yield an identical Temporal.Duration object. The deserialized object will represent an equally long duration, but the sub-second fields will be balanced with the seconds field so that they become 999 or less. For example, 1000 nanoseconds will become 1 microsecond.

This is because the ISO 8601 string format for durations, which is used for serialization for reasons of interoperability, does not allow for specifying sub-second units separately, only as a decimal fraction of seconds. If you need to serialize a Temporal.Duration into a string that preserves unbalanced sub-second fields, you will need to use a custom serialization format or serialize it into an object or JSON instead.

## Temporal.TimeZone

Table of Contents
A Temporal.TimeZone is a representation of a time zone:

either an IANA time zone that defines the offset between local time and UTC and how that offset changes in response to daylight saving time (DST) and/or other political changes;
or an "offset time zone": a fixed UTC offset.
To combine a time zone with a date/time value, and to perform DST-safe operations like "add one day", use Temporal.ZonedDateTime.

Time zone identifiers
Time zones in Temporal are represented by string identifiers from the IANA Time Zone Database (like Asia/Tokyo, America/Los_Angeles, or UTC) or by a fixed UTC offset like +05:30.

A string identifier can be used in place of a Temporal.TimeZone object when passing parameters to ECMAScript methods. Furthermore, string identifiers allow ECMAScript implementations to perform optimizations that are not possible when passing time zone objects. Therefore, it's recommended to always pass string identifiers instead of time zone objects whenever this is convenient. For example:

inBerlin = Temporal.ZonedDateTime.from('2022-01-28T19:53+01:00[Europe/Berlin]');
inTokyo = inBerlin.withTimeZone('Asia/Tokyo'); // May be faster and/or use less RAM
inTokyo = inBerlin.withTimeZone(Temporal.TimeZone.from('Asia/Tokyo')); // OK, but not optimal
Handling changes to the IANA Time Zone Database
Time zone identifiers are occasionally renamed or merged in the IANA Time Zone Database. For example, Asia/Calcutta was renamed to Asia/Kolkata, and America/Montreal was merged into America/Toronto because both identifiers are in the same country and share the same time zone rules since 1970.

Identifiers that have been renamed or merged are considered equivalent by ECMAScript. Both identifiers will continue to be accepted by ECMAScript methods and will behave identically, except for toString(), id, and other code that returns the identifier string. Equivalence can be tested using Temporal.TimeZone.prototype.equals.

function areTimeZoneIdentifiersEquivalent(id1, id2) {
return Temporal.TimeZone.from(id1).equals(id2);
// DON'T DO THIS: return id1 === id2;
}
areTimeZoneIdentifiersEquivalent('Asia/Calcutta', 'ASIA/KOLKATA'); // => true
areTimeZoneIdentifiersEquivalent('Asia/Calcutta', '+05:30'); // => false
areTimeZoneIdentifiersEquivalent('UTC', '+00:00'); // => false
Time zones that resolve to different Zones in the IANA Time Zone Database are not equivalent, even if those Zones use the same offsets. Similarly, a numeric-offset identifier is never equivalent to an IANA time zone identifier, even if they always represent the same offset.

In any set of equivalent identifiers, only one identifier will be considered canonical. To avoid redundancy, only canonical identifiers are returned by Intl.supportedValuesOf('timeZone'). Furthermore, only canonical identifiers are output methods that returns the system's current time zone, such as Temporal.Now.timeZoneId(). Other than those few cases, canonicalization is not observable in ECMAScript code, which ensures that changes to the IANA Time Zone Database will have minimal impact on the behavior of existing applications.

Variation between ECMAScript and other consumers of the IANA Time Zone Database
The IANA Time Zone Database can be built with different options that can change which time zones are equivalent. ECMAScript implementations generally use build options that guarantee at least one canonical identifier for every ISO 3166-1 Alpha-2 country code, and that ensure that identifiers for different country codes are never equivalent. This behavior avoids the risk that future political changes in one country can affect the behavior of ECMAScript code using a different country's time zones.

For example, the default build options consider Europe/Oslo, Europe/Stockholm, Europe/Copenhagen, and Europe/Berlin to be equivalent. However, ECMAScript implementations generally do not treat those as equivalent.

Custom time zones
To enable specialized applications to perform calculations in a time zone that is not built-in, a custom time zone can be implemented. There are two ways to do this.

The recommended way is to create a class inheriting from Temporal.TimeZone. You must use one of the built-in time zones as the "base time zone". In the class's constructor, call super() with the identifier of a built-in time zone to serve as a base. The class must override the id prototype property, and should override toString() and toJSON() to match. Overriding all the other properties of Temporal.TimeZone.prototype is optional. Any property that is not overridden will behave as in the base time zone.

The other, more difficult, way to create a custom time zone is to create a plain object implementing the Temporal.TimeZone protocol, without subclassing. The object must have at least getOffsetNanosecondsFor() and getPossibleInstantsFor() methods, and an id property. Any object with those three methods will return the correct output from any Temporal property or method. However, most other code will assume that custom time zones act like built-in Temporal.TimeZone objects. To interoperate with libraries or other code that you didn't write, then you should implement all the other Temporal.TimeZone members as well: toString(), toJSON(), equals(), getOffsetStringFor(), getPlainDateTimeFor(), getInstantFor(), getNextTransition(), getPreviousTransition().

Custom time zone identifiers
Identifiers of custom time zones are returned from the time zone's id getter (as well as toString() and toJSON()) and must follow the rules described in the tzdata documentation:

A valid identifier has one or more components separated by slashes (/)
Each component must consist of between one and 14 characters.
Valid characters are ASCII letters, ., -, and \_.

- may not appear as the first character of a component, and a component may not be a single dot . nor two dots ...
  If a custom time zone is not intended to be equivalent to any built-in time zone, then its id must not case-insensitively match the identifier of any IANA time zone. A list of all IANA time zone identifiers is available here.

However, a custom time zone that is intended to be equivalent to a built-in time zone must return the same id as the corresponding built-in time zone.

Constructor
new Temporal.TimeZone(timeZoneIdentifier: string) : Temporal.TimeZone
Parameters:

timeZoneIdentifier (string): A description of the time zone; either its IANA name, or a UTC offset.
Returns: a new Temporal.TimeZone object.

For a list of IANA time zone names, see the current version of the IANA time zone database. A convenient list is also available on Wikipedia, although it might not reflect the latest official status.

The string timeZoneIdentifier is normalized before being used to determine the time zone. For example, capitalization will be corrected to match the IANA Time Zone Database, and offsets like +01 or +0100 will be converted to ±HH:MM format like+01:00. If no time zone can be determined from timeZoneIdentifier, then a RangeError is thrown.

Use this constructor directly if you have a string that is known to be a correct time zone identifier. If you have an ISO 8601 date-time string, Temporal.TimeZone.from() is probably more convenient.

Example usage:

new Temporal.TimeZone('UTC'); // => UTC
new Temporal.TimeZone('Etc/UTC'); // => Etc/UTC (Links are not followed)
new Temporal.TimeZone('Africa/Cairo'); // => Africa/Cairo
new Temporal.TimeZone('aSiA/TOKYO'); // => Asia/Tokyo (capitalization is normalized)
new Temporal.TimeZone('Asia/Kolkata'); // => Asia/Kolkata
new Temporal.TimeZone('Asia/Calcutta'); // => Asia/Calcutta (Links are not followed)
new Temporal.TimeZone('-04:00'); // => -04:00
new Temporal.TimeZone('-0400'); // => -04:00 (offset formats are normalized)
new Temporal.TimeZone('-04'); // => -04:00 (offset formats are normalized)

/_ WRONG _/ new Temporal.TimeZone('hi'); // => throws, not a time zone identifier
/_ WRONG _/ new Temporal.TimeZone('2020-01-13T16:31:00.06-08:00[America/Vancouver]');
// => throws, use from() to parse time zones from ISO 8601 strings
Difference between IANA time zones and numeric UTC offsets
The returned time zone object behaves slightly differently, depending on whether an IANA time zone name is given (e.g., Europe/Berlin), or a numeric UTC offset (e.g., +01:00). IANA time zones may have UTC offset transitions (e.g., because of DST), while the other kind never changes its offset. For example:

tz1 = new Temporal.TimeZone('-08:00');
tz2 = new Temporal.TimeZone('America/Vancouver');
inst = Temporal.ZonedDateTime.from({ year: 2020, month: 1, day: 1, timeZone: tz2 }).toInstant();
tz2.getPreviousTransition(inst); // => 2019-11-03T09:00:00Z
tz1.getNextTransition(inst); // => null
Static methods
Temporal.TimeZone.from(thing: any) : Temporal.TimeZone
Parameters:

thing: A time zone object, a Temporal object that carries a time zone, or a value from which to create a Temporal.TimeZone.
Returns: a time zone object.

This static method creates a new time zone from another value. If the value is another Temporal.TimeZone object, or object implementing the time zone protocol, the same object is returned. If the value is another Temporal object that carries a time zone or an object with a timeZone property, such as Temporal.ZonedDateTime, the object's time zone is returned.

Any other value is required to be a string in one of the following formats:

A time zone identifier accepted by new Temporal.TimeZone().
A string like 2020-01-01[Asia/Tokyo] or 2020-01-01T00:00+09:00[Asia/Tokyo] in ISO 8601 format with a time zone identifier suffix in square brackets. When a time zone identifier suffix is present, any UTC offset outside the brackets will be ignored.
An ISO 8601 string like 2020-01-01T00:00+09:00 that includes a numeric time zone offset, which results in a Temporal.TimeZone object with an identifier that is the normalized ±HH:MM form of the offset.
An ISO 8601 string like 2020-01-01T00:00Z that uses the Z offset designator, which results in a Temporal.TimeZone object with the identifier "UTC".
This function is often more convenient to use than new Temporal.TimeZone() because it handles a wider range of input.

Usage examples:

// IANA time zone names and UTC offsets
Temporal.TimeZone.from('UTC'); // => UTC
Temporal.TimeZone.from('Etc/UTC'); // => Etc/UTC (Links are not followed)
Temporal.TimeZone.from('Africa/Cairo'); // => Africa/Cairo
Temporal.TimeZone.from('aSiA/TOKYO'); // => Asia/Tokyo (capitalization is normalized)
Temporal.TimeZone.from('Asia/Kolkata'); // => Asia/Kolkata
Temporal.TimeZone.from('Asia/Calcutta'); // => Asia/Calcutta (Links are not followed)
Temporal.TimeZone.from('-04:00'); // => -04:00
Temporal.TimeZone.from('-0400'); // => -04:00 (offset formats are normalized)
Temporal.TimeZone.from('-04'); // => -04:00 (offset formats are normalized)

// ISO 8601 string with bracketed time zone identifier
Temporal.TimeZone.from('2020-01-13T16:31:00.06+09:00[Asia/Tokyo]'); // => Asia/Tokyo
Temporal.TimeZone.from('2020-01-14T00:31:00.06Z[Asia/Tokyo]'); // => Asia/Tokyo
Temporal.TimeZone.from('20200114T003100.06Z[Asia/Tokyo]'); // => Asia/Tokyo
Temporal.TimeZone.from('2020-01-13T16:31:00.06+09:00[+09:00]'); // => +09:00

// ISO 8601 string with only a time zone offset part
Temporal.TimeZone.from('2020-01-14T00:31:00.065858086Z'); // => UTC
Temporal.TimeZone.from('2020-01-13T16:31:00.065858086-08:00'); // => -08:00

// Existing TimeZone object
Temporal.TimeZone.from(Temporal.TimeZone.from('Asia/Tokyo')); // => Asia/Tokyo

/_ WRONG _/ tz = Temporal.TimeZone.from('local'); // => throws, not a time zone
/_ WRONG _/ tz = Temporal.TimeZone.from('2020-01-14T00:31'); // => throws, no time zone
/_ WRONG _/ tz = Temporal.TimeZone.from('-08:00[Asia/Aden]'); // => throws, no date/time
Properties
timeZone.id : string
The id property gives an unambiguous identifier for the time zone. This is the normalized version of whatever timeZoneIdentifier was passed as a parameter to the constructor.

When subclassing Temporal.TimeZone, this property must be overridden to provide an identifier for the custom time zone. When overriding id, toString() and toJSON() should also be overridden.

Methods
timeZone.equals(other: Temporal.TimeZone | object | string) : boolean
Parameters:

other (Temporal.TimeZone object, object implementing the Temporal.TimeZone protocol, or a string time zone identifier): Another time zone to compare.
Returns: true if timeZone and other are equivalent, or false if not.

Compares two time zones for equivalence. Equality is determined by the following algorithm:

If timeZone === other, then the time zones are equivalent.
Otherwise, timeZone.id is compared to other (or other.id if other is an object). If any of the following conditions are true, then the time zones are equivalent:
Both string identifiers are Zone or Link names in the IANA Time Zone Database, and they resolve to the same Zone name. This resolution is case-insensitive.
Both string identifiers are custom time zone identifiers that are equal according to ===. This comparison is case-sensitive and does not normalize different Unicode characters.
Both identifiers are numeric offset time zone identifiers like "+05:30", and they represent the same offset.
Otherwise, the time zones are not equivalent.
Note that "resolve to the same Zone name" noted above is behavior that can vary between ECMAScript and other consumers of the IANA Time Zone Database. ECMAScript implementations generally do not allow identifiers to be equivalent if they represent different ISO 3166-1 Alpha-2 country codes. However, non-ECMAScript platforms may merge Zone names across country boundaries. See above to learn more about this variation.

Time zones that resolve to different Zones in the IANA Time Zone Database are not equivalent, even if those Zones always use the same offsets. Offset time zones and IANA time zones are also never equivalent.

Example usage:

kolkata = Temporal.TimeZone.from('Asia/Kolkata');
kolkata.id; // => "Asia/Kolkata"
calcutta = Temporal.TimeZone.from('Asia/Calcutta');
calcutta.id; // => "Asia/Calcutta"
kolkata.equals(calcutta); // => true
kolkata.equals('Asia/Calcutta'); // => true
kolkata.equals('Asia/Colombo'); // => false

// IANA Time Zone Database identifiers are case insensitive
kolkata.equals('asia/calcutta'); // => true

// Offset time zones are never equivalent to named time zones
kolkata.equals('+05:30'); // => false
zeroOffset = Temporal.TimeZone.from('+00:00');
zeroOffset.equals('UTC'); // false

// For offset time zones, any valid format is accepted
zeroOffset.equals('+00:00'); // => true
zeroOffset.equals('+0000'); // => true
zeroOffset.equals('+00'); // => true

// Custom time zone identifiers are compared case-sensitively
class Custom1 extends Temporal.TimeZone {
constructor() { super('UTC'); }
get id() { return 'Moon/Cheese'; }
}
class Custom2 extends Temporal.TimeZone {
constructor() { super('UTC'); }
get id() { return 'Moon/CHEESE'; }
}
new Custom1().equals(new Custom1()); // => true
new Custom1().equals(new Custom2()); // => false
timeZone.getOffsetNanosecondsFor(instant: Temporal.Instant | string) : number
Parameters:

instant (Temporal.Instant or value convertible to one): The time for which to compute the time zone's UTC offset.
Returns: The UTC offset at the given time, in nanoseconds.

Since the UTC offset can change throughout the year in time zones that employ DST as well as because of special political decisions, this method queries the UTC offset at a particular time.

Note that Temporal.TimeZone objects constructed from an IANA time zone name may change offsets, depending on instant. However, other time zones (some IANA time zones like Etc/GMT+5 and all time zones constructed from numeric UTC offsets) have fixed offsets that never change, regardless of instant.

If instant is not a Temporal.Instant object, then it will be converted to one as if it were passed to Temporal.Instant.from().

Example usage:

// Getting the UTC offset for a time zone at a particular time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
tz = Temporal.TimeZone.from('Europe/Berlin');
tz.getOffsetNanosecondsFor(timestamp); // => 3600000000000

// TimeZone with a fixed UTC offset
tz = Temporal.TimeZone.from('-08:00');
tz.getOffsetNanosecondsFor(timestamp); // => -28800000000000
// UTC is always 0 offset
tz = Temporal.TimeZone.from('UTC');
tz.getOffsetNanosecondsFor(timestamp); // => 0

// Differences between DST and non-DST
tz = Temporal.TimeZone.from('Europe/London');
tz.getOffsetNanosecondsFor('2020-08-06T15:00Z'); // => 3600000000000
tz.getOffsetNanosecondsFor('2020-11-06T01:00Z'); // => 0
When implementing this method in a custom time zone, note that the absolute value of the returned UTC offset must be smaller than 24 hours (86,400,000,000,000 nanoseconds). Any time this method is called as part of another Temporal operation, this will be checked, so if your custom time zone returns a longer offset, most built-in time zone operations will not work.

timeZone.getOffsetStringFor(instant: Temporal.Instant | string) : string
Parameters:

instant (Temporal.Instant or value convertible to one): The time for which to compute the time zone's UTC offset.
Returns: a string indicating the UTC offset at the given time.

This method is similar to timeZone.getOffsetNanosecondsFor(), but returns the offset formatted as a string, with sign, hours, and minutes. In the rare case where the offset is not aligned on a minute boundary, then seconds (and fractional seconds, if present) are also included in the returned string.

If timeZone is a time zone constructed from a numeric UTC offset, this method returns the same value as timeZone.id.

If instant is not a Temporal.Instant object, then it will be converted to one as if it were passed to Temporal.Instant.from().

When subclassing Temporal.TimeZone, this method doesn't need to be overridden because the default implementation creates an offset string using the result of calling timeZone.getOffsetNanosecondsFor().

Example usage:

// Getting the UTC offset for a time zone at a particular time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
tz = Temporal.TimeZone.from('Europe/Berlin');
tz.getOffsetStringFor(timestamp); // => '+01:00'

// TimeZone with a fixed UTC offset
tz = Temporal.TimeZone.from('-08:00');
tz.getOffsetStringFor(timestamp); // => '-08:00'
tz.id; // => '-08:00'

// Historical offset that was not aligned on a minute boundary
tz = Temporal.TimeZone.from('Europe/Paris');
tz.getOffsetStringFor('1900-02-01T12:00Z'); // => '+00:09:21'
timeZone.getPlainDateTimeFor(instant: Temporal.Instant | string, calendar?: object | string) : Temporal.PlainDateTime
Parameters:

instant (Temporal.Instant or value convertible to one): An exact time to convert.
calendar (optional object or string): A Temporal.Calendar object, or a plain object, or a calendar identifier. The default is to use the ISO 8601 calendar.
Returns: A Temporal.PlainDateTime object indicating the calendar date and wall-clock time in timeZone, according to the reckoning of calendar, at the exact time indicated by instant.

This method is one way to convert a Temporal.Instant to a Temporal.PlainDateTime.

If instant is not a Temporal.Instant object, then it will be converted to one as if it were passed to Temporal.Instant.from().

When subclassing Temporal.TimeZone, this method doesn't need to be overridden, because the default implementation creates a Temporal.PlainDateTime from instant using a UTC offset which is the result of calling timeZone.getOffsetNanosecondsFor().

Example usage:

// Converting an exact time to a calendar date / wall-clock time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
tz = Temporal.TimeZone.from('Europe/Berlin');
tz.getPlainDateTimeFor(timestamp); // => 2019-03-31T01:45:00

// What time was the Unix Epoch (timestamp 0) in Bell Labs (Murray Hill, New Jersey, USA)?
epoch = Temporal.Instant.fromEpochSeconds(0);
tz = Temporal.TimeZone.from('America/New_York');
tz.getPlainDateTimeFor(epoch); // => 1969-12-31T19:00:00
timeZone.getInstantFor(dateTime: Temporal.PlainDateTime | object | string, options?: object) : Temporal.Instant
Parameters:

dateTime (Temporal.PlainDateTime or value convertible to one): A calendar date and wall-clock time to convert.
options (optional object): An object with properties representing options for the operation. The following options are recognized:
disambiguation (string): How to disambiguate if the date and time given by dateTime does not exist in the time zone, or exists more than once. Allowed values are 'compatible', 'earlier', 'later', and 'reject'. The default is 'compatible'.
Returns: A Temporal.Instant object indicating the exact time in timeZone at the time of the calendar date and wall-clock time from dateTime.

This method is one way to convert a Temporal.PlainDateTime to a Temporal.Instant. The result is identical to dateTime.toZonedDateTime(timeZone, { disambiguation }).toInstant().

If dateTime is not a Temporal.PlainDateTime object, then it will be converted to one as if it were passed to Temporal.PlainDateTime.from().

In the case of ambiguity, the disambiguation option controls what instant to return:

'compatible' (the default): Acts like 'earlier' for backward transitions and 'later' for forward transitions.
'earlier': The earlier of two possible times.
'later': The later of two possible times.
'reject': Throw a RangeError instead.
When interoperating with existing code or services, 'compatible' mode matches the behavior of legacy Date as well as libraries like Moment.js, Luxon, and date-fns. This mode also matches the behavior of cross-platform standards like RFC 5545 (iCalendar).

During "skipped" clock time like, e.g., the hour after DST starts in the spring, this method interprets invalid times using the pre-transition time zone offset if 'compatible' or 'later' is used, or the post-transition time zone offset if 'earlier' is used. This behavior avoids exceptions when converting nonexistent Temporal.PlainDateTime values to Temporal.Instant, but it also means that values during these periods will result in a different Temporal.PlainDateTime in "round-trip" conversions to Temporal.Instant and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see Resolving ambiguity.

If the result is earlier or later than the range that Temporal.Instant can represent (approximately half a million years centered on the Unix epoch), then a RangeError will be thrown, no matter the value of disambiguation.

When subclassing Temporal.TimeZone, this method doesn't need to be overridden, because the default implementation calls timeZone.getPossibleInstantsFor(), and, if there is more than one possible instant, uses disambiguation to pick which one to return.

timeZone.getPossibleInstantsFor(dateTime: Temporal.PlainDateTime | object | string) : array<Temporal.Instant>
Parameters:

dateTime (Temporal.PlainDateTime or value convertible to one): A calendar date and wall-clock time to convert.
Returns: An array of Temporal.Instant objects, which may be empty.

This method returns an array of all the possible exact times that could correspond to the calendar date and wall-clock time indicated by dateTime.

If dateTime is not a Temporal.PlainDateTime object, then it will be converted to one as if it were passed to Temporal.PlainDateTime.from().

Normally there is only one possible exact time corresponding to a wall-clock time, but around a daylight saving or other offset change, a wall-clock time may not exist, or the same wall-clock time may exist twice. See Resolving ambiguity for usage examples and a more complete explanation.

Although this method is useful for implementing a custom time zone or custom disambiguation behavior, but otherwise getInstantFor() should be used instead, because it is more convenient, because it's compatible with the behavior of other methods and libraries, and because it always returns a single value. For example, during "skipped" clock time like the hour after DST starts in the spring, getPossibleInstantsFor() returns an empty array while getInstantFor() returns a Temporal.Instant.

timeZone.getNextTransition(startingPoint: Temporal.Instant | string) : Temporal.Instant
Parameters:

startingPoint (Temporal.Instant or value convertible to one): Time after which to find the next UTC offset transition.
Returns: A Temporal.Instant object representing the next UTC offset transition in this time zone, or null if no transitions later than startingPoint could be found.

This method is used to calculate a possible future UTC offset transition after startingPoint for this time zone. A "transition" is a point in time where the UTC offset of a time zone changes, for example when Daylight Saving Time starts or stops. Transitions can also be caused by other political changes like a country permanently changing the UTC offset of its time zone.

The returned Temporal.Instant will represent the first nanosecond where the new UTC offset is used, not the last nanosecond where the previous UTC offset is used.

When no more transitions are expected, this method will return null. Some time zones (e.g., Etc/GMT+5 or -05:00) have no offset transitions and will return null for all values of startingPoint.

If instant is not a Temporal.Instant object, then it will be converted to one as if it were passed to Temporal.Instant.from().

When subclassing Temporal.TimeZone, this method should be overridden if the time zone changes offsets. Single-offset time zones can use the default implementation which returns null.

Example usage:

// How long until the next offset change from now, in the current location?
tz = Temporal.Now.timeZone();
now = Temporal.Now.instant();
nextTransition = tz.getNextTransition(now);
duration = nextTransition.since(now);
duration.toLocaleString(); // output will vary
timeZone.getPreviousTransition(startingPoint: Temporal.Instant | string) : Temporal.Instant
Parameters:

startingPoint (Temporal.Instant or value convertible to one): Time before which to find the previous UTC offset transition.
Returns: A Temporal.Instant object representing the previous UTC offset transition in this time zone, or null if no transitions earlier than startingPoint could be found.

This method is used to calculate a possible past UTC offset transition before startingPoint for this time zone. A "transition" is a point in time where the UTC offset of a time zone changes, for example when Daylight Saving Time starts or stops. Transitions can also be caused by other political changes like a country permanently changing the UTC offset of its time zone.

The returned Temporal.Instant will represent the first nanosecond where the new UTC offset is used, not the last nanosecond where the previous UTC offset is used.

When no previous transitions exist, this method will return null. Some time zones (e.g., Etc/GMT+5 or -05:00) have no offset transitions and will return null for all values of startingPoint.

If instant is not a Temporal.Instant object, then it will be converted to one as if it were passed to Temporal.Instant.from().

When subclassing Temporal.TimeZone, this method should be overridden if the time zone changes offsets. Single-offset time zones can use the default implementation which returns null.

Example usage:

// How long until the previous offset change from now, in the current location?
tz = Temporal.Now.timeZone();
now = Temporal.Now.instant();
previousTransition = tz.getPreviousTransition(now);
duration = now.since(previousTransition);
duration.toLocaleString(); // output will vary
timeZone.toString() : string
Returns: The string given by timeZone.id.

By overriding Object.prototype.toString(), this method ensures that coercing a Temporal.TimeZone to a string will yield its identifier.

This capability allows allows Temporal.TimeZone instances to be used in contexts where a time zone identifier string is expected, like the timeZone option of the Intl.DateTimeFormat constructor.

ins = Temporal.Instant.from('2020-06-10T00:00Z');
timeZone = Temporal.TimeZone.from('America/Chicago');
new Intl.DateTimeFormat('en', { timeZone: timeZone.id }).format(ins); // => '6/9/2020, 7:00:00 PM'
new Intl.DateTimeFormat('en', { timeZone }).format(ins); // => '6/9/2020, 7:00:00 PM'
timeZone.toJSON() : string
Returns: the string given by timeZone.id.

This method is the same as timeZone.toString(). It is usually not called directly, but it can be called automatically by JSON.stringify().

The reverse operation, recovering a Temporal.TimeZone object from a string, is Temporal.TimeZone.from(), but it cannot be called automatically by JSON.parse(). If you need to rebuild a Temporal.TimeZone object from a JSON string, then you need to know the names of the keys that should be interpreted as Temporal.TimeZones. In that case you can build a custom "reviver" function for your use case.

When subclassing Temporal.TimeZone, this method doesn't need to be overridden because the default implementation returns the result of calling timeZone.toString().

Example usage:

const user = {
id: 775,
username: 'robotcat',
password: 'hunter2', // Note: Don't really store passwords like that
userTimeZone: Temporal.TimeZone.from('Europe/Madrid')
};
const str = JSON.stringify(user, null, 2);
console.log(str);
// =>
// {
// "id": 775,
// "username": "robotcat",
// "password": "hunter2",
// "userTimeZone": "Europe/Madrid"
// }

// To rebuild from the string:
function reviver(key, value) {
if (key.endsWith('TimeZone')) return Temporal.TimeZone.from(value);
return value;
}
JSON.parse(str, reviver);

## Time Zones and Resolving Ambiguity

Table of Contents
Understanding Clock Time vs. Exact Time
The core concept in Temporal is the distinction between wall-clock time (also called "local time" or "clock time") which depends on the time zone of the clock and exact time (also called "UTC time") which is the same everywhere.

Wall-clock time is controlled by local governmental authorities, so it can abruptly change. When Daylight Saving Time (DST) starts or if a country moves to another time zone, then local clocks will instantly change. Exact time however has a consistent global definition and is represented by a special time zone called UTC (from Wikipedia):

Coordinated Universal Time (or UTC) is the primary time standard by which the world regulates clocks and time. It is within about 1 second of mean solar time at 0° longitude, and is not adjusted for daylight saving time. It is effectively a successor to Greenwich Mean Time (GMT).

Every wall-clock time is defined using a UTC Offset: the amount of exact time that a particular clock is set ahead or behind UTC. For example, on January 19, 2020 in California, the UTC Offset (or "offset" for short) was -08:00 which means that wall-clock time in San Francisco was 8 hours behind UTC, so 10:00AM locally on that day was 18:00 UTC. However the same calendar date and wall-clock time India would have an offset of +05:30: 5½ hours later than UTC.

ISO 8601 and RFC 3339 define standard representations for exact times as a date and time value, e.g. 2020-09-06T17:35:24.485Z. The Z suffix indicates that this is an exact UTC time.

Temporal has two types that store exact time: Temporal.Instant (which only stores exact time and no other information) and Temporal.ZonedDateTime which stores exact time, a time zone, and a calendar system

Another way to represent exact time is using a single number representing the amount of time after or before Unix epoch (midnight UTC on January 1, 1970). For example, Temporal.Instant (an exact-time type) can be constructed using only a BigInt value of nanoseconds since epoch.

Another term developers often encounter is "timestamp". This most often refers to an exact time represented by the number of seconds since Unix epoch. Temporal avoids using this terminology, however, because of historical ambiguity surrounding the term "timestamp". For example, many databases have a type called TIMESTAMP, but its meaning varies: in MySQL, it is an exact time; in Oracle Database, it is the number of seconds since the wall-clock time January 1, 1970 (a quantity one might call a "local timestamp"); and in Microsoft SQL Server, it is a monotonically increasing value unrelated to date and time.

Understanding Time Zones, Offset Changes, and DST
A Time Zone defines the rules that control how local wall-clock time relates to UTC. You can think of a time zone as a function that accepts an exact time and returns a UTC offset, and a corresponding function for conversions in the opposite direction. (See below for why exact → local conversions are 1:1, but local → exact conversions can be ambiguous.)

Temporal uses the IANA Time Zone Database (or "TZ database"), which you can think of as a global repository of time zone functions. Each IANA time zone has:

A time zone ID that usually refers to a geographic area anchored by a city (e.g. Europe/Paris or Africa/Kampala) but can also denote single-offset time zones like UTC (a consistent +00:00 offset) or Etc/GMT+5 (which for historical reasons is a negative offset -05:00).
A time zone definition defines the offset for any UTC value since January 1, 1970. You can think of these definitions as a table that maps UTC date/time ranges (including future ranges) to specific offsets. In some time zones, temporary offset changes happen twice each year due to Daylight Saving Time (DST) starting in the Spring and ending each Fall. Offsets can also change permanently due to political changes, e.g. a country switching time zones.
The IANA Time Zone Database is updated several times per year in response to political changes around the world. Each update contains changes to time zone definitions. These changes usually affect only future date/time values, but occasionally fixes are made to past ranges too, for example when new historical sources are discovered about early-20th century timekeeping.

Wall-Clock Time, Exact Time, and Time Zones in Temporal
In Temporal:

The Temporal.Instant type represents exact time only.
The Temporal.PlainDateTime type represents calendar date and wall-clock time, as do other narrower types: Temporal.PlainDate, Temporal.PlainTime, Temporal.PlainYearMonth, and Temporal.PlainMonthDay. These types all carry a calendar system, which by default is 'iso8601' (the ISO 8601 calendar) but can be overridden for other calendars like 'islamic' or 'japanese'.
The Temporal.TimeZone represents a time zone function that converts between exact time and wall-clock time and vice-versa. It also includes helper functions, e.g. to fetch the current time zone offset for a particular exact time.
The Temporal.ZonedDateTime type encapsulates all of the types above: an exact time (like a Temporal.Instant), its wall-clock equivalent (like a Temporal.PlainDateTime), and the time zone that links the two (like a Temporal.TimeZone).
There are two ways to get a human-readable calendar date and clock time from a Temporal type that stores exact time.

If the exact time is already represented by a Temporal.ZonedDateTime instance then the wall-clock time values are trivially available using the properties and methods of that type, e.g. .year, .hour, or .toLocaleString().
However, if the exact time is represented by a Temporal.Instant, use a time zone and optional calendar to create a Temporal.ZonedDateTime. Example:
instant = Temporal.Instant.from('2019-09-03T08:34:05Z');
formatOptions = {
era: 'short',
year: 'numeric',
month: 'short',
day: 'numeric',
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
};

zdt = instant.toZonedDateTimeISO('Asia/Tokyo');
// => 2019-09-03T17:34:05+09:00[Asia/Tokyo]
zdt.toLocaleString('en-us', { ...formatOptions, calendar: zdt.calendar });
// => 'Sep 3, 2019 AD, 5:34:05 PM'
zdt.year;
// => 2019
zdt = instant.toZonedDateTime({timeZone: 'Asia/Tokyo', calendar: 'iso8601'}).toLocaleString('ja-jp', formatOptions);
// => '西暦 2019 年 9 月 3 日 17:34:05'

zdt = instant.toZonedDateTime({timeZone: 'Asia/Tokyo', calendar: 'japanese'});
// => 2019-09-03T17:34:05+09:00[Asia/Tokyo][u-ca=japanese]
zdt.toLocaleString('en-us', { ...formatOptions, calendar: zdt.calendar });
// => 'Sep 3, 1 Reiwa, 5:34:05 PM'
zdt.eraYear;
// => 1
Conversions from calendar date and/or wall clock time to exact time are also supported:

// Convert various local time types to an exact time type by providing a time zone
date = Temporal.PlainDate.from('2019-12-17');
// If time is omitted, local time defaults to start of day
zdt = date.toZonedDateTime('Asia/Tokyo');
// => 2019-12-17T00:00:00+09:00[Asia/Tokyo]
zdt = date.toZonedDateTime({ timeZone: 'Asia/Tokyo', plainTime: '10:00' });
// => 2019-12-17T10:00:00+09:00[Asia/Tokyo]
time = Temporal.PlainTime.from('14:35');
zdt = time.toZonedDateTime({ timeZone: 'Asia/Tokyo', plainDate: Temporal.PlainDate.from('2020-08-27') });
// => 2020-08-27T14:35:00+09:00[Asia/Tokyo]
dateTime = Temporal.PlainDateTime.from('2019-12-17T07:48');
zdt = dateTime.toZonedDateTime('Asia/Tokyo');
// => 2019-12-17T07:48:00+09:00[Asia/Tokyo]

// Get the exact time in seconds, milliseconds, or nanoseconds since the UNIX epoch.
inst = zdt.toInstant();
epochNano = inst.epochNanoseconds; // => 1576536480000000000n
epochMilli = inst.epochMilliseconds; // => 1576536480000
epochSecs = inst.epochSeconds; // => 1576536480
Ambiguity Due to DST or Other Time Zone Offset Changes
Usually, a time zone definition provides a bidirectional 1:1 mapping between any particular local date and clock time and its corresponding UTC date and time. However, near a time zone offset transition there can be time ambiguity where it's not clear what offset should be used to convert a wall-clock time into an exact time. This ambiguity leads to two possible UTC times for one clock time.

When offsets change in a backward direction, the same clock time will be repeated. For example, 1:30AM happened twice on Sunday, 4 November 2018 in California. The "first" 1:30AM on that date was in Pacific Daylight Time (offset -07:00). 30 exact minutes later, DST ended and Pacific Standard Time (offset -08:00) became active. After 30 more exact minutes, the "second" 1:30AM happened. This means that "1:30AM on Sunday, 4 November 2018" is not sufficient to know which 1:30AM it is. The clock time is ambiguous.
When offsets change in a forward direction, local clock times are skipped. For example, DST started on Sunday, 11 March 2018 in California. When the clock advanced from 1:59AM to 2:00AM, local time immediately skipped to 3:00AM. 2:30AM didn't happen! To avoid errors in this one-hour-per year case, most computing environments (including ECMAScript) will convert skipped clock times to exact times using either the offset before the transition or the offset after the transition.
In both cases, resolving the ambiguity when converting the local time into exact time requires choosing which of two possible offsets to use, or deciding to throw an exception.

Resolving Time Ambiguity in Temporal
In Temporal, if the exact time or time zone offset is known, then there is no ambiguity possible. For example:

// No ambiguity possible because source is exact time in UTC
inst = Temporal.Instant.from('2020-09-06T17:35:24.485Z');
// => 2020-09-06T17:35:24.485Z
// An offset can make a local time "exact" with no ambiguity possible.
inst = Temporal.Instant.from('2020-09-06T10:35:24.485-07:00');
// => 2020-09-06T17:35:24.485Z
zdt = Temporal.ZonedDateTime.from('2020-09-06T10:35:24.485-07:00[America/Los_Angeles]');
// => 2020-09-06T10:35:24.485-07:00[America/Los_Angeles]
// if the source is an exact Temporal object, then no ambiguity is possible.
zdt = inst.toZonedDateTimeISO('America/Los_Angeles');
// => 2020-09-06T10:35:24.485-07:00[America/Los_Angeles]
inst2 = zdt.toInstant();
// => 2020-09-06T17:35:24.485Z
However, opportunities for ambiguity are present when creating an exact-time type (Temporal.ZonedDateTime or Temporal.Instant) from a non-exact source. For example:

// Offset is not known. Ambiguity is possible!
zdt = Temporal.PlainDate.from('2019-02-19').toZonedDateTime('America/Sao_Paulo'); // can be ambiguous
zdt = Temporal.PlainDateTime.from('2019-02-19T00:00').toZonedDateTime('America/Sao_Paulo'); // can be ambiguous

// Even if the offset is present in the source string, if the type (like PlainDateTime)
// isn't an exact type then the offset is ignored when parsing so ambiguity is possible.
dt = Temporal.PlainDateTime.from('2019-02-19T00:00-03:00');
zdt = dt.toZonedDateTime('America/Sao_Paulo'); // can be ambiguous

// the offset is lost when converting from an exact type to a non-exact type
zdt = Temporal.ZonedDateTime.from('2020-11-01T01:30-08:00[America/Los_Angeles]');
// => 2020-11-01T01:30:00-08:00[America/Los_Angeles]
dt = zdt.toPlainDateTime(); // offset is lost!
// => 2020-11-01T01:30:00
zdtAmbiguous = dt.toZonedDateTime('America/Los_Angeles'); // can be ambiguous
// => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
// note that the offset is now -07:00 (Pacific Daylight Time) which is the "first" 1:30AM
// not -08:00 (Pacific Standard Time) like the original time which was the "second" 1:30AM
To resolve this possible ambiguity, Temporal methods that create exact types from inexact sources accept a disambiguation option, which controls what exact time to return in the case of ambiguity:

'compatible' (the default): Acts like 'earlier' for backward transitions and 'later' for forward transitions.
'earlier': The earlier of two possible exact times will be returned.
'later': The later of two possible exact times will be returned.
'reject': A RangeError will be thrown.
When interoperating with existing code or services, 'compatible' mode matches the behavior of legacy Date as well as libraries like moment.js, Luxon, and date-fns. This mode also matches the behavior of cross-platform standards like RFC 5545 (iCalendar).

Methods where this option is present include:

Temporal.ZonedDateTime.from with object argument
Temporal.ZonedDateTime.prototype.with
Temporal.PlainDateTime.prototype.toZonedDateTime
Temporal.TimeZone.prototype.getInstantFor.
Examples: DST Disambiguation
This explanation was adapted from the moment-timezone documentation.

When entering DST, clocks move forward an hour. In reality, it is not time that is moving, it is the offset moving. Moving the offset forward gives the illusion that an hour has disappeared. If you watch your computer's digital clock, you can see it move from 1:58 to 1:59 to 3:00. It is easier to see what is actually happening when you include the offset.

1:58 -08:00
1:59 -08:00
3:00 -07:00
3:01 -07:00
The result is that any time between 1:59:59 and 3:00:00 never actually happened. In 'earlier' mode, the exact time that is returned will be as if the post-change UTC offset had continued before the change, effectively skipping backwards by the amount of the DST gap (usually 1 hour). In 'later' mode, the exact time that is returned will be as if the pre-change UTC offset had continued after the change, effectively skipping forwards by the amount of the DST gap. In 'compatible' mode, the same time is returned as 'later' mode, which matches the behavior of existing JavaScript code that uses legacy Date.

// Different disambiguation modes for times in the skipped clock hour after DST starts in the Spring
// Offset of -07:00 is Daylight Saving Time, while offset of -08:00 indicates Standard Time.
props = { timeZone: 'America/Los_Angeles', year: 2020, month: 3, day: 8, hour: 2, minute: 30 };
zdt = Temporal.ZonedDateTime.from(props, { disambiguation: 'compatible' });
// => 2020-03-08T03:30:00-07:00[America/Los_Angeles]
zdt = Temporal.ZonedDateTime.from(props);
// => 2020-03-08T03:30:00-07:00[America/Los_Angeles]
// ('compatible' is the default)
earlier = Temporal.ZonedDateTime.from(props, { disambiguation: 'earlier' });
// => 2020-03-08T01:30:00-08:00[America/Los_Angeles]
// (1:30 clock time; still in Standard Time)
later = Temporal.ZonedDateTime.from(props, { disambiguation: 'later' });
// => 2020-03-08T03:30:00-07:00[America/Los_Angeles]
// ('later' is same as 'compatible' for backwards transitions)
later.toPlainDateTime().since(earlier.toPlainDateTime());
// => PT2H
// (2 hour difference in clock time...
later.since(earlier);
// => PT1H
// ... but 1 hour later in real-world time)
Likewise, at the end of DST, clocks move backward an hour. In this case, the illusion is that an hour repeats itself. In 'earlier' mode, the exact time will be the earlier instance of the duplicated wall-clock time. In 'later' mode, the exact time will be the later instance of the duplicated time. In 'compatible' mode, the same time is returned as 'earlier' mode, which matches the behavior of existing JavaScript code that uses legacy Date.

// Different disambiguation modes for times in the repeated clock hour after DST ends in the Fall
// Offset of -07:00 is Daylight Saving Time, while offset of -08:00 indicates Standard Time.
props = { timeZone: 'America/Los_Angeles', year: 2020, month: 11, day: 1, hour: 1, minute: 30 };
zdt = Temporal.ZonedDateTime.from(props, { disambiguation: 'compatible' });
// => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
zdt = Temporal.ZonedDateTime.from(props);
// => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
// 'compatible' is the default.
earlier = Temporal.ZonedDateTime.from(props, { disambiguation: 'earlier' });
// => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
// 'earlier' is same as 'compatible' for backwards transitions.
later = Temporal.ZonedDateTime.from(props, { disambiguation: 'later' });
// => 2020-11-01T01:30:00-08:00[America/Los_Angeles]
// Same clock time, but one hour later.
// -08:00 offset indicates Standard Time.
later.toPlainDateTime().since(earlier.toPlainDateTime());
// => PT0S
// (same clock time...
later.since(earlier);
// => PT1H
// ... but 1 hour later in real-world time)
Ambiguity Caused by Permanent Changes to a Time Zone Definition
Time zone definitions can change. Almost always these changes are forward-looking so don't affect historical data. But computers sometimes store data about the future! For example, a calendar app might record that a user wants to be reminded of a friend's birthday next year.

When date/time data for future times is stored with both the offset and the time zone, and if the time zone definition changes, then it's possible that the new time zone definition may conflict with previously-stored data. In this case, then the offset option to Temporal.ZonedDateTime.from is used to resolve the conflict:

'use': Evaluate date/time values using the time zone offset if it's provided in the input. This will keep the exact time unchanged even if local time will be different than what was originally stored.
'ignore': Never use the time zone offset provided in the input. Instead, calculate the offset from the time zone. This will keep local time unchanged but may result in a different exact time than was originally stored.
'prefer': Evaluate date/time values using the offset if it's valid for this time zone. If the offset is invalid, then calculate the offset from the time zone. This option is rarely used when calling from(). See the documentation of with() for more details about why this option is used.
'reject': Throw a RangeError if the offset is not valid for the provided date and time in the provided time zone.
The default is reject for Temporal.ZonedDateTime.from because there is no obvious default solution. Instead, the developer needs to decide how to fix the now-invalid data.

For Temporal.ZonedDateTime.with the default is 'prefer'. This default is helpful to prevent DST disambiguation from causing unexpected one-hour changes in exact time after making small changes to clock time fields. For example, if a Temporal.ZonedDateTime is set to the "second" 1:30AM on a day where the 1-2AM clock hour is repeated after a backwards DST transition, then calling .with({minute: 45}) will result in an ambiguity which is resolved using the default offset: 'prefer' option. Because the existing offset is valid for the new time, it will be retained so the result will be the "second" 1:45AM. However, if the existing offset is not valid for the new result (e.g. .with({hour: 0})), then the default behavior will change the offset to match the new local time in that time zone.

Note that offset vs. timezone conflicts only matter for Temporal.ZonedDateTime because no other Temporal type accepts both an IANA time zone and a time zone offset as an input to any method. For example, Temporal.Instant.from will never run into conflicts because the Temporal.Instant type ignores the time zone in the input and only uses the offset.

Examples: offset option
The primary reason to use the offset option is for parsing values which were saved before a change to that time zone's time zone definition. For example, Brazil stopped observing Daylight Saving Time in 2019, with the final transition out of DST on February 16, 2019. The change to stop DST permanently was announced in April 2019. Now imagine that an app running in 2018 (before these changes were announced) had saved a far-future time in a string format that contained both offset and IANA time zone. Such a format is used by Temporal.ZonedDateTime.prototype.toString as well as other platforms and libraries that use the same format like Java.time.ZonedDateTime. Let's assume the stored future time was noon on January 15, 2020 in São Paulo:

zdt = Temporal.ZonedDateTime.from({ year: 2020, month: 1, day: 15, hour: 12, timeZone: 'America/Sao_Paulo' });
zdt.toString();
// => '2020-01-15T12:00:00-02:00[America/Sao_Paulo]'
// Assume this string is saved in an external database.
// Note that the offset is `-02:00` which is Daylight Saving Time

// Also note that if you run the code above today, it will return an offset
// of `-03:00` because that reflects the current time zone definition after
// DST was abolished. But this code running in 2018 would have returned `-02:00`
// which corresponds to the then-current Daylight Saving Time in Brazil.
This string was valid at the time is was created and saved in 2018. But after the time zone rules were changed in April 2019, 2020-01-15T12:00-02:00[America/Sao_Paulo] is no longer valid because the correct offset for this time is now -03:00. When parsing this string using current time zone rules, Temporal needs to know how to interpret it. The offset option helps deal with this case.

savedUsingOldTzDefinition = '2020-01-01T12:00-02:00[America/Sao_Paulo]'; // string that was saved earlier
/_ WRONG _/ zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition);
// => RangeError: Offset is invalid for '2020-01-01T12:00' in 'America/Sao*Paulo'. Provided: -02:00, expected: -03:00.
// Default is to throw when the offset and time zone conflict.
/* WRONG \_/ zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition, { offset: 'reject' });
// => RangeError: Offset is invalid for '2020-01-01T12:00' in 'America/Sao_Paulo'. Provided: -02:00, expected: -03:00.
zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition, { offset: 'use' });
// => 2020-01-01T11:00:00-03:00[America/Sao_Paulo]
// Evaluate date/time string using old offset, which keeps UTC time constant as local time changes to 11:00
zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition, { offset: 'ignore' });
// => 2020-01-01T12:00:00-03:00[America/Sao_Paulo]
// Use current time zone rules to calculate offset, ignoring any saved offset
zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition, { offset: 'prefer' });
// => 2020-01-01T12:00:00-03:00[America/Sao_Paulo]
// Saved offset is invalid for current time zone rules, so use time zone to to calculate offset.

## Temporal.Calendar

Table of Contents
A Temporal.Calendar is a representation of a calendar system. It includes information about how many days are in each year, how many months are in each year, how many days are in each month, and how to do arithmetic in that calendar system.

Much of the world uses the Gregorian calendar, which was invented in 1582 C.E. The ISO 8601 standard extends the Gregorian date reckoning backwards ("proleptically") to cover the period of history before its invention, to allow designating dates before 1582. The ISO 8601 calendar is the system most often used in computing, on the modern Internet.

A significant number of places in the world use another calendar system as the main calendar, or use the Gregorian calendar alongside another calendar system as a commonly-used civil or religious calendar. Even places that use almost exclusively the Gregorian calendar today, often use a different calendar to denote dates before the invention or adoption of the Gregorian calendar.

When to use Temporal.Calendar
It is best practice to specify a calendar system when performing calendar-sensitive operations, which are those involving arithmetic or other calculation in months or years.

For example, to add a month to a date in the Hebrew calendar:

date.withCalendar('hebrew').add({ months: 1 });
Temporal types' toLocaleString() methods use the user's preferred calendar, without needing to call withCalendar(). To perform arithmetic consistently with the toLocaleString() calendar system:

const calendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
date.withCalendar(calendar).add({ months: 1 });
Invariants Across Calendars
The following "invariants" (statements that are always true) hold for all built-in calendars, and should also hold for any properly-authored custom calendar that supports years, months, and days units:

Any date can be serialized to an object using only four properties: { year, month, day, calendar }
year is always an integer (which may be zero or negative) that increases as time goes forward
month and day are always positive integers that increase as time goes forward, except they reset at the boundary of a year or month, respectively
month is always continuous (no gaps)
date.month === 1 during the first month of any year, because month always represents the order of months in that year.
obj.with({ day: 1 }) will always return the first day of the object's month, even if the resulting day is not 1.
obj.with({ day: Number.MAX_VALUE }) will always return the last day of the object's month.
obj.with({ month: 1, day: 1 }) will always return the first day of the object's year.
obj.with({ month: obj.monthsInYear, day: Number.MAX_VALUE }) will always return the last day of the object's year.
obj.month === obj.monthsInYear during the last month of any year
dayOfWeek, dayOfYear, and weekOfYear are 1-based positive integers, that increase consecutively as time goes forward, except they reset at the boundary of a week or year, respectively
Writing Cross-Calendar Code
Here are best practices for writing code that will work regardless of the calendar used:

Validate or coerce the calendar of all external input. If your code receives a Temporal object from an external source, you should check that its calendar is what you expect, and if you are not prepared to handle other calendars, convert it to the ISO 8601 calendar using withCalendar('iso8601'). Otherwise, you may end up with unexpected behavior in your app or introduce security or performance issues by introducing an unexpected calendar.
Use compare methods (e.g. Temporal.PlainDate.compare(date1, '2000-01-01')) instead of manually comparing individual properties (e.g. date.year > 2000) whose meaning may vary across calendars.
Never compare field values in different calendars. A month or year in one calendar is unrelated to the same property values in another calendar. To compare dates across calendars, use the compare method.
When comparing dates for equality that might be in different calendars, convert them both to the same calendar using withCalendar. The same ISO date in different calendars will return false from the equals method because the calendars are not equal.
When looping through all months in a year, use monthsInYear as the upper bound instead of assuming that every year has 12 months.
Don't assume that date.month===12 is the last month of the year. Instead, use date.month===date.monthsInYear.
Use until or since to count years, months, or days between dates. Manually calculating differences (e.g. Math.floor(months/12)) will fail for some calendars.
Use daysInMonth instead of assuming that each month has the same number of days in every year.
Days in a month are not always continuous. There can be gaps due to political changes in calendars and/or time zones. For this reason, instead of looping through a month from 1 to date.daysInMonth, it's better to start a loop with the first day of the month (.with({day: 1})) and add one day at a time until the month property returns a different value.
Use daysInYear instead of assuming that every year has 365 days (366 in a leap year).
Don't assume that inLeapYear===true implies that the year is one day longer than a regular year. Some calendars add leap months, making the year 29 or 30 days longer than a normal year!
Use toLocaleString to format dates to users. DO NOT localize manually with code like ${month}/${day}/${year}.
Don't assume that month has the same name in every year.
Some calendars like Hebrew or Chinese have leap months that cause months to vary across years.
Use the correct property to refer to months. If you care about the order of the month in a particular year (e.g. when looping through all the months in a year) use month. If you care about the name of the month regardless of what year it is (e.g. storing a birthday), use the monthCode string property.
When using the Temporal.PlainMonthDay type (e.g. for birthdays or holidays), use its monthCode property only. The month property is not present on this type because some calendars' month indexes vary from year to year.
When calling Temporal.PlainMonthDay.prototype.toPlainDate(year), be prepared for the resulting date to have a different day of the month and/or a different month, because leap days and leap months are not present in every year.
Use toLocaleString to fetch month names instead of caching an array of names. Example: date.toLocaleString('en-US', { calendar: date.calendar, month: 'long' }). If you absolutely must cache month names, a string key like ${date.calendar.id}|{date.monthCode}|{date.inLeapYear} will work for all built-in calendars.
Don't assume that era or eraYear properties are always present. They are not present in some calendars.
era and eraYear should always be used as a pair. Don't use one property without also using the other.
Don't combine month and monthCode in the same property bag. Pick one month representation and use it consistently.
Don't combine year and era/eraYear in the same property bag. Pick one year representation and use it consistently.
Read the documentation of your calendar to determine the meaning of monthCode and era.
Don't show monthCode and era values in a UI. Instead, use toLocaleString to convert these values into localized strings.
Don't assume that the year before { eraYear: 1 } is the last year of the previous era. Some calendars have a "year zero", and the oldest era in era-using calendars typically allows negative eraYear values.
Custom calendars
For specialized applications where you need to do calculations in a calendar system that is not supported by Intl, you can implement a custom calendar. There are two ways to do this.

The recommended way is to create a class inheriting from Temporal.Calendar. You must use one of the built-in calendars as the "base calendar". In the class's constructor, call super() with the identifier of a built-in calendar to serve as a base. The class must override the id prototype property, and should also override toString() and toJSON() to match. Overriding all the other properties of Temporal.Calendar.prototype is optional. Any property that's not overridden will behave as in the base calendar. It's recommended to override dateFromFields(), monthDayFromFields(), yearMonthFromFields(), and dateAdd()so that they return Temporal objects with the custom calendar and not the base calendar.

The other, more difficult, way to create a custom calendar is to create a plain object implementing the Temporal.Calendar protocol, without subclassing. The object must implement all of the Temporal.Calendar properties and methods except for toString() and toJSON(). Any object with the required properties and methods will return the correct output from any Temporal property or method. However, most other code will assume that custom calendars act like built-in Temporal.Calendar objects. To interoperate with libraries or other code that you didn't write, then you should implement the toString() and toJSON() methods as well.

The identifier of a custom calendar must consist of one or more components of between 3 and 8 ASCII alphanumeric characters each, separated by dashes, as described in Unicode Technical Standard 35.

Custom calendars are responsible for interpreting and validating all inputs, including options. Calendars should (and built-in calendars will) throw a TypeError if a required option is missing or has the wrong type, but throw a RangeError if it's present but has an invalid value.

Calendars are also responsible for assigning default values. For example, if the overflow option is undefined, it will be interpreted by built-in calendars as 'constrain'. Custom calendars should maintain this behavior unless there's a good reason not to. Calendars can also accept additional non-default values for existing options or can accept new options that built-in calendars don't. When adding new options, calendar authors should use a unique prefix, e.g. the name of the calendar, to avoid potential conflicts with future options which may be used by Temporal.

Handling unusual dates: leap days, leap months, and skipped or repeated periods
Calendars can vary from year to year. Solar calendars like 'gregory' use leap days. Lunar calendars like 'islamic' adjust month lengths to lunar cycles. Lunisolar calendars like 'hebrew' or 'chinese' have "leap months": extra months added every few years.

Calendars may also have one-time changes. The built-in 'gregory' calendar in ECMAScript doesn't skip days because it's a proleptic Gregorian calendar, but other calendars may skip days, months, or even years. For example, a non-proleptic custom calendar for France would have 4 October 1582 (the last day of the Julian calendar) directly followed by 15 October 1582 (the first day of the Gregorian calendar), skipping 10 calendar days.

Calendar variation across years means that programs may encounter historical dates that are valid in one year but invalid in another. A common example is calling toPlainDate on a Temporal.PlainMonthDay object to convert a birthday or anniversary that originally fell on a leap day, leap month, or other skipped period. Temporal types' with or from methods can run into the same issue.

When Temporal encounters inputs representing a month and/or day that doesn't exist in the desired calendar year, by default (overridable in with or from via the overflow option) the inputs will be adjusted using the following algorithm:

First, pick the closest day in the same month. If there are two equally-close dates in that month, pick the later one.
If the month is a leap month that doesn't exist in the desired year, then pick another date according to the cultural conventions of that calendar's users. Usually this will result in the same day in the month before or the month after where that month would normally fall in a leap year.
Otherwise, pick the closest date to the provided date that is still in the same year. If there are two equally-close dates, pick the later one.
If the entire year doesn't exist, then pick the closest date to the provided date. If there are two equally-close dates, pick the later one.
Authors of custom calendars (especially Julian-to-Gregorian calendars that include a skipped period) must follow the rules above; otherwise, callers may experience unexpected behavior.

Finally, just like calendars can sometimes skip days or months, it is possible for real-world calendars to repeat dates, for example when a country transitions from one calendar system to another. No current built-in calendar repeats dates, but a custom calendar that includes repeated dates may add custom fields and/or options to help users handle this case.

Constructor
new Temporal.Calendar(calendarIdentifier: string) : Temporal.Calendar
Parameters:

calendarIdentifier (string): An identifier for the calendar.
Returns: a new Temporal.Calendar object.

For a list of calendar identifiers, see the documentation for Intl.DateTimeFormat. If calendarIdentifier is not a built-in calendar, then a RangeError is thrown.

Use this constructor directly if you have a string that is known to be a correct built-in calendar identifier. If you have an ISO 8601 date-time string with a [u-ca=identifier] annotation, then Temporal.Calendar.from() is more convenient than parsing the identifier out of the string.

Example usage:

cal = new Temporal.Calendar('iso8601');
cal = new Temporal.Calendar('gregory');
/_ WRONG _/ cal = new Temporal.Calendar('discordian'); // => throws, not a built-in calendar
Static methods
Temporal.Calendar.from(thing: any) : Temporal.Calendar
Parameters:

thing: A calendar object, a Temporal object that carries a calendar, or a value from which to create a Temporal.Calendar.
Returns: a calendar object.

This static method creates a new calendar from another value. If the value is another Temporal.Calendar object, or object implementing the calendar protocol, the same object is returned. If the value is another Temporal object that carries a calendar or an object with a calendar property, such as a Temporal.ZonedDateTime, the object's calendar is returned.

Any other value is required to be a string that is either:

a calendar idenfier accepted by new Temporal.Calendar(); or
a string in the ISO 8601 format.
Note that the ISO 8601 string can be extended with a [u-ca=identifier] annotation in square brackets appended to it. Without such an annotation, the calendar is taken to be iso8601.

This function is often more convenient to use than new Temporal.Calendar() because it handles a wider range of input.

Usage examples:

// Calendar names
cal = Temporal.Calendar.from('iso8601');
cal = Temporal.Calendar.from('gregory');

// ISO 8601 string with or without calendar annotation
cal = Temporal.Calendar.from('2020-01-13T16:31:00.065858086');
cal = Temporal.Calendar.from('2020-01-13T16:31:00.065858086-08:00[America/Vancouver][u-ca=iso8601]');
/_ WRONG _/ cal = Temporal.Calendar.from('[u-ca-iso8601]'); // => throws, lone annotation not a valid ISO 8601 string

// Existing calendar object
cal2 = Temporal.Calendar.from(cal);

// Custom calendar names cannot be parsed from strings
/_ WRONG _/ cal = Temporal.Calendar.from('discordian'); // => throws, not a built-in calendar
Properties
calendar.id : string
The id property gives an unambiguous identifier for the calendar. Effectively, this is whatever calendarIdentifier was passed as a parameter to the constructor.

When subclassing Temporal.Calendar, this property must be overridden to provide an identifier for the custom calendar.

Methods
calendar.era(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : string | undefined
calendar.eraYear(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : number | undefined
calendar.year(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : number
calendar.month(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : number
calendar.monthCode(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | Temporal.PlainMonthDay | object | string) : string
calendar.day(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainMonthDay | object | string) : number
calendar.dayOfWeek(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number
calendar.dayOfYear(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number
calendar.weekOfYear(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number
calendar.yearOfWeek(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number
calendar.daysInWeek(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number
calendar.daysInMonth(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number
calendar.daysInYear(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number
calendar.monthsInYear(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number
calendar.inLeapYear(date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): boolean
The above methods are all similar. They provide a way to query properties of a particular date in the calendar's date reckoning.

Parameters:

date (Temporal.PlainDate, or value convertible to one): A date.
Returns: some piece of data (year, month, day, etc., depending on the method) associated with date, in calendar's calendar system.

If date is not one of the appropriate Temporal objects, then it will be converted to a Temporal.PlainDate as if it were passed to Temporal.PlainDate.from().

None of the above methods need to be called directly except in specialized code. They are called indirectly when reading the various properties of Temporal.ZonedDateTime, Temporal.PlainDateTime, Temporal.PlainDate, Temporal.PlainMonthDay, or Temporal.PlainYearMonth.

For example:

const date = Temporal.PlainDate.from('2019-02-06').withCalendar('hebrew');
date.year; // => 5779
date.calendar.year(date); // same result, but calling the method directly
date.monthCode; // => 'M05L'
date.calendar.monthCode(date); // same result, but calling the method directly
date.daysInYear; // => 385
date.calendar.daysInYear(date); // same result, but calling the method directly
calendar.dateFromFields(fields: object, options: object) : Temporal.PlainDate
calendar.yearMonthFromFields(fields: object, options: object) : Temporal.PlainYearMonth
calendar.monthDayFromFields(fields: object, options: object) : Temporal.PlainMonthDay
The above three methods are similar. They provide a way to construct other Temporal objects from values in the calendar's date or time reckoning.

Parameters:

fields (object): An object with properties similar to what is passed to Temporal.PlainDate.from(), Temporal.PlainYearMonth.from(), or Temporal.PlainMonthDay.from(), respectively.
options: (object): An object with properties representing options for constructing the Temporal object. The following options are recognized:
overflow (string): How to deal with out-of-range values in fields. Allowed values are constrain, and reject. The default is constrain.
Returns: a new Temporal.PlainDate, Temporal.PlainYearMonth, or Temporal.PlainMonthDay object, respectively.

None of the above methods need to be called directly except in specialized code. They are called indirectly when using Temporal.PlainDate.from(), Temporal.PlainDateTime.from(), Temporal.PlainYearMonth.from(), and Temporal.PlainMonthDay.from().

A custom implementation of these methods would convert the calendar-space arguments to the ISO 8601 calendar, and return an object created using new Temporal.PlainDate(...isoArgs), with PlainYearMonth and PlainMonthDay substituted for PlainDate as appropriate.

For example:

date = Temporal.PlainDate.from({ year: 5779, monthCode: 'M05L', day: 18, calendar: 'hebrew' });
date.year; // => 5779
date.month; // => 6
date.monthCode; // => 'M05L'
date.day; // => 18
date.toString(); // => '2019-02-23[u-ca=hebrew]'
date.toLocaleString('en-US', { calendar: 'hebrew' }); // => '18 Adar I 5779'

// same result, but calling the method directly and using month index instead of month code:
date = Temporal.Calendar.from('hebrew').dateFromFields(
{ year: 5779, month: 6, day: 18 },
{ overflow: 'constrain' }
);
calendar.dateAdd(date: Temporal.PlainDate | object | string, duration: Temporal.Duration | object | string, options: object) : Temporal.PlainDate
This method provides a way to do time arithmetic in the calendar's date reckoning.

Parameters:

date (Temporal.PlainDate, or value convertible to one): A date.
duration (Temporal.Duration, or value convertible to one): A duration to add to date. For subtraction, add a negative duration.
options (object): An object with properties representing options for performing the addition or subtraction. The following options are recognized:
overflow (string): How to deal with out-of-range values in the result of the addition or subtraction. Allowed values are constrain and reject. The default is constrain.
Returns: a new Temporal.PlainDate object.

If date is not a Temporal.PlainDate object, or duration not a Temporal.Duration object, then they will be converted to one as if they were passed to Temporal.PlainDate.from() or Temporal.Duration.from(), respectively.

This method does not need to be called directly except in specialized code. It is called indirectly when using add() and subtract() of Temporal.PlainDateTime, Temporal.PlainDate, and Temporal.PlainYearMonth.

A custom implementation of this method would perform the calendar-specific addition, convert the result to the ISO 8601 calendar, and return an object created using new Temporal.PlainDate(...isoArgs).

For example:

date = Temporal.PlainDate.from('2020-05-29')
.withCalendar('islamic')
.add(Temporal.Duration.from({ months: 1 }), { overflow: 'reject' });
date.year; // => 1441
date.month; // => 11
date.day; // => 7
date.toString(); // => '2020-06-28[u-ca=islamic]'

// same result, but calling the method directly:
date = Temporal.Calendar.from('islamic').dateAdd(
Temporal.PlainDate.from('2020-05-29'),
Temporal.Duration.from({ months: 1 }),
{ overflow: 'reject' }
);
date.year; // => 1441
date.month; // => 11
date.day; // => 7
date.toString(); // => '2020-06-28[u-ca=islamic]'
calendar.dateUntil(one: Temporal.PlainDate | object | string, two: Temporal.PlainDate | object | string, options: object) : Temporal.Duration
Parameters:

one (Temporal.PlainDate, or value convertible to one): A date.
two (Temporal.PlainDate, or value convertible to one): Another date.
options (object): An object with properties representing options for the operation. The following options are recognized:
largestUnit (optional string): The largest unit of time to allow in the resulting Temporal.Duration object. Valid values are 'auto', 'year', 'month', and 'day'. The default is 'auto'.
Returns: a Temporal.Duration representing the time elapsed after one and until two.

If either of one or two are not Temporal.PlainDate objects, then they will be converted to one as if they were passed to Temporal.PlainDate.from().

This method does not need to be called directly except in specialized code. It is called indirectly when using the until() and since() methods of Temporal.PlainDateTime, Temporal.PlainDate, Temporal.PlainYearMonth, and Temporal.ZonedDateTime.

If one is later than two, then the resulting duration should be negative.

The default largestUnit value of 'auto' is the same as 'day'.

NOTE: Unlike Temporal.Calendar.dateAdd(), the options object that this method receives is not always the same object passed to the respective until() or since() method. Depending on the type, a copy may be made of the object.

For example:

d1 = Temporal.PlainDate.from('2020-07-29').withCalendar('chinese');
d2 = Temporal.PlainDate.from('2020-08-29').withCalendar('chinese');
d1.until(d2, { largestUnit: 'month' }); // => P1M2D

// same result, but calling the method directly:
Temporal.Calendar.from('chinese').dateUntil(
Temporal.PlainDate.from('2020-07-29'),
Temporal.PlainDate.from('2020-08-29'),
{ largestUnit: 'month' }
); // => P1M2D
calendar.fields(fields: Iterable<string>) : string[]
Parameters:

fields (array of strings, or other iterable yielding strings): A list of field names.
Returns: a new array of field names.

This method does not need to be called directly except in specialized code. It is called indirectly when using the from() static methods and with() methods of Temporal.PlainDateTime, Temporal.PlainDate, Temporal.PlainMonthDay, Temporal.PlainYearMonth, and Temporal.ZonedDateTime, and a number of other methods.

Custom calendars should override this method if they accept fields in from() or with() other than the standard set of built-in calendar fields: year, month, monthCode, and day. The input array contains the field names that are necessary for a particular operation (for example, 'monthCode' and 'day' for Temporal.PlainMonthDay.prototype.with()). The method should make a copy of the array and add additional fields as needed.

When subclassing Temporal.Calendar, this method doesn't need to be overridden, unless your calendar requires extra fields, because the default implementation returns a copy of fields.

Usage example:

// In the ISO 8601 calendar, this method just makes a copy of the input array
Temporal.Calendar.from('iso8601').fields(['monthCode', 'day']);
// => [ 'monthCode', 'day' ]
calendar.mergeFields(fields: object, additionalFields: object) : object
Parameters:

fields (object): A plain object with properties representing calendar units.
additionalFields (object): Another plain object with properties representing calendar units.
Returns: a new object with properties from both fields and additionalFields.

This method does not need to be called directly except in specialized code. It is called indirectly when using the with() methods of Temporal.PlainDateTime, Temporal.PlainDate, Temporal.PlainMonthDay, Temporal.PlainYearMonth, and Temporal.ZonedDateTime.

Custom calendars should override this method if they allow a calendar unit to be specified in more than one way. (For example, the Gregorian calendar allows years to be specified either by a year property or a combination of era and eraYear.) The overridden implementation should return an object with some or all of the properties from the original fields object and additionalFields copied onto it.

When subclassing Temporal.Calendar, this method doesn't need to be overridden, unless your calendar adds more ways to specify a unit other than the built-in properties monthCode, era, and eraYear. The default implementation copies all properties from additionalFields onto fields, taking into account that months may be specified either by month or monthCode properties, and any other special cases required by built-in calendars.

Usage example:

// In built-in calendars, this method copies properties, taking `month`
// and `monthCode` into account
Temporal.Calendar.from('iso8601').mergeFields(
{ year: 2006, month: 7, day: 31 },
{ monthCode: 'M08' }
);
// => { year: 2006, monthCode: 'M08', day: 31 }
calendar.toString() : string
Returns: The string given by calendar.id.

This method overrides Object.prototype.toString() and provides the calendar's id property as a human-readable description.

Example usage:

Temporal.PlainDate.from('2020-05-29[u-ca=gregory]').calendar.toString(); // => 'gregory'
calendar.toJSON() : string
Returns: The string given by calendar.id.

This method is the same as calendar.toString(). It is usually not called directly, but it can be called automatically by JSON.stringify().

The reverse operation, recovering a Temporal.Calendar object from a string, is Temporal.Calendar.from(), but it cannot be called automatically by JSON.parse(). If you need to rebuild a Temporal.Calendar object from a JSON string, then you need to know the names of the keys that should be interpreted as Temporal.Calendars. In that case you can build a custom "reviver" function for your use case.

When subclassing Temporal.Calendar, this method doesn't need to be overridden because the default implementation returns the result of calling calendar.toString().

Example usage:

const user = {
id: 775,
username: 'robotcat',
password: 'hunter2', // Note: Don't really store passwords like that
userCalendar: Temporal.Calendar.from('gregory')
};
const str = JSON.stringify(user, null, 2);
console.log(str);
// =>
// {
// "id": 775,
// "username": "robotcat",
// "password": "hunter2",
// "userCalendar": "gregory"
// }

// To rebuild from the string:
function reviver(key, value) {
if (key.endsWith('Calendar')) return Temporal.Calendar.from(value);
return value;
}
JSON.parse(str, reviver);
