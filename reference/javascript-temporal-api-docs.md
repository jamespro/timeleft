Stage 3 Draft / March 28, 2024
Temporal proposal
Introduction
The venerable ECMAScript Date object has a number of challenges, including lack of immutability, lack of support for time zones, lack of support for use cases that require dates only or times only, a confusing and non-ergonomic API, and many other challenges.

The Temporal set of types addresses these challenges with a built-in date and time API for ECMAScript that includes:

First-class support for all time zones, including DST-safe arithmetic
Strongly-typed objects for dates, times, date/time values, year/month values, month/day values, "zoned" date/time values, and durations
Immutability for all Temporal objects
String serialization and interoperability via standardized formats
Compliance with industry standards like ISO 8601, RFC 3339, and RFC5545 (iCalendar)
Full support for non-Gregorian calendars
Figure 1: Temporal Object Relationships

Figure 2: Temporal String Persistence

This specification consists of three parts:

The specification of the Temporal object and everything related to it, proposed to be added to ECMA-262 in new sections;
A list of amendments to be made to ECMA-262, other than the new sections above;
A list of amendments to be made to ECMA-402.
1 The Temporal Object
The Temporal object:

is the intrinsic object %Temporal%.
is the initial value of the "Temporal" property of the global object.
is an ordinary object.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
is not a function object.
does not have a [[Construct]] internal method; it cannot be used as a constructor with the new operator.
does not have a [[Call]] internal method; it cannot be invoked as a function.
1.1 Value Properties of the Temporal Object
1.1.1 Temporal [ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

1.2 Constructor Properties of the Temporal Object
1.2.1 Temporal.Calendar ( . . . )
See 12.

1.2.2 Temporal.Instant ( . . . )
See 8.

1.2.3 Temporal.PlainDateTime ( . . . )
See 5.

1.2.4 Temporal.PlainDate ( . . . )
See 3.

1.2.5 Temporal.PlainTime ( . . . )
See 4.

1.2.6 Temporal.PlainYearMonth ( . . . )
See 9.

1.2.7 Temporal.PlainMonthDay ( . . . )
See 10.

1.2.8 Temporal.TimeZone ( . . . )
See 11.

1.2.9 Temporal.Duration ( . . . )
See 7.

1.2.10 Temporal.ZonedDateTime ( . . . )
See 6.

1.3 Other Properties of the Temporal Object
1.3.1 Temporal.Now
See 2.

2 The Temporal.Now Object
The Temporal.Now object:

is an ordinary object.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
is not a function object.
does not have a [[Construct]] internal method; it cannot be used as a constructor with the new operator.
does not have a [[Call]] internal method; it cannot be invoked as a function.
2.1 Value Properties of the Temporal.Now Object
2.1.1 Temporal.Now [ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.Now".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

2.2 Function Properties of the Temporal.Now Object
2.2.1 Temporal.Now.timeZoneId ( )
This function performs the following steps when called:

1. Return SystemTimeZoneIdentifier().
   2.2.2 Temporal.Now.instant ( )
   This function performs the following steps when called:

1. Return ! SystemInstant().
   2.2.3 Temporal.Now.plainDateTime ( calendarLike [ , temporalTimeZoneLike ] )
   This function performs the following steps when called:

1. Return ? SystemDateTime(temporalTimeZoneLike, calendarLike).
   2.2.4 Temporal.Now.plainDateTimeISO ( [ temporalTimeZoneLike ] )
   This function performs the following steps when called:

1. Return ? SystemDateTime(temporalTimeZoneLike, "iso8601").
   2.2.5 Temporal.Now.zonedDateTime ( calendarLike [ , temporalTimeZoneLike ] )
   This function performs the following steps when called:

1. Return ? SystemZonedDateTime(temporalTimeZoneLike, calendarLike).
   2.2.6 Temporal.Now.zonedDateTimeISO ( [ temporalTimeZoneLike ] )
   This function performs the following steps when called:

1. Return ? SystemZonedDateTime(temporalTimeZoneLike, "iso8601").
   2.2.7 Temporal.Now.plainDate ( calendarLike [ , temporalTimeZoneLike ] )
   This function performs the following steps when called:

1. Let dateTime be ? SystemDateTime(temporalTimeZoneLike, calendarLike).
1. Return ! CreateTemporalDate(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[Calendar]]).
   2.2.8 Temporal.Now.plainDateISO ( [ temporalTimeZoneLike ] )
   This function performs the following steps when called:

1. Let dateTime be ? SystemDateTime(temporalTimeZoneLike, "iso8601").
1. Return ! CreateTemporalDate(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], "iso8601").
   2.2.9 Temporal.Now.plainTimeISO ( [ temporalTimeZoneLike ] )
   This function performs the following steps when called:

1. Let dateTime be ? SystemDateTime(temporalTimeZoneLike, "iso8601").
1. Return ! CreateTemporalTime(dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]]).
   2.3 Abstract Operations
   2.3.1 HostSystemUTCEpochNanoseconds ( global )
   The host-defined abstract operation HostSystemUTCEpochNanoseconds takes argument global (a global object) and returns an integer. It allows host environments to reduce the precision of the result. In particular, web browsers artificially limit it to prevent abuse of security flaws (e.g., Spectre) and to avoid certain methods of fingerprinting.

An implementation of HostSystemUTCEpochNanoseconds must conform to the following requirements:

Its result must be between nsMinInstant and nsMaxInstant.
NOTE
This requirement is necessary if the system clock is set to a time outside the range that Temporal.Instant can represent. This is not expected to affect implementations in practice.

The default implementation of HostSystemUTCEpochNanoseconds performs the following steps when called:

1. Let ns be the approximate current UTC date and time, in nanoseconds since the epoch.
2. Return the result of clamping ns between nsMinInstant and nsMaxInstant.
   ECMAScript hosts that are not web browsers must use the default implementation of HostSystemUTCEpochNanoseconds.

2.3.2 SystemUTCEpochMilliseconds ( )

1. Let global be GetGlobalObject().
2. Let nowNs be HostSystemUTCEpochNanoseconds(global).
3. Return 𝔽(floor(nowNs / 10\*\*6)).
   2.3.3 SystemUTCEpochNanoseconds ( )
4. Let global be GetGlobalObject().
5. Let nowNs be HostSystemUTCEpochNanoseconds(global).
6. Return ℤ(nowNs).
   2.3.4 SystemInstant ( )
7. Let ns be ! SystemUTCEpochNanoseconds().
8. Return ! CreateTemporalInstant(ns).
   2.3.5 SystemDateTime ( temporalTimeZoneLike, calendarLike )
9. If temporalTimeZoneLike is undefined, then
   a. Let timeZone be SystemTimeZoneIdentifier().
10. Else,
    a. Let timeZone be ? ToTemporalTimeZoneSlotValue(temporalTimeZoneLike).
11. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike).
12. Let instant be ! SystemInstant().
13. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR »).
14. Return ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
    2.3.6 SystemZonedDateTime ( temporalTimeZoneLike, calendarLike )
15. If temporalTimeZoneLike is undefined, then
    a. Let timeZone be SystemTimeZoneIdentifier().
16. Else,
    a. Let timeZone be ? ToTemporalTimeZoneSlotValue(temporalTimeZoneLike).
17. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike).
18. Let ns be ! SystemUTCEpochNanoseconds().
19. Return ! CreateTemporalZonedDateTime(ns, timeZone, calendar).
    3 Temporal.PlainDate Objects
    A Temporal.PlainDate object is an Object that contains integers corresponding to a particular year, month, and day in the ISO8601 calendar, as well as an Object value used to interpret those integers in a particular calendar.

3.1 The Temporal.PlainDate Constructor
The Temporal.PlainDate constructor:

creates and initializes a new Temporal.PlainDate object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.PlainDate behaviour must include a super call to the %Temporal.PlainDate% constructor to create and initialize subclass instances with the necessary internal slots.
3.1.1 Temporal.PlainDate ( isoYear, isoMonth, isoDay [ , calendarLike ] )
This function performs the following steps when called:

1. If NewTarget is undefined, throw a TypeError exception.
2. Let y be ? ToIntegerWithTruncation(isoYear).
3. Let m be ? ToIntegerWithTruncation(isoMonth).
4. Let d be ? ToIntegerWithTruncation(isoDay).
5. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike, "iso8601").
6. Return ? CreateTemporalDate(y, m, d, calendar, NewTarget).
   3.2 Properties of the Temporal.PlainDate Constructor
   The Temporal.PlainDate constructor:

has a [[Prototype]] internal slot whose value is %Function.prototype%.
has the following properties:
3.2.1 Temporal.PlainDate.prototype
The initial value of Temporal.PlainDate.prototype is %Temporal.PlainDate.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

3.2.2 Temporal.PlainDate.from ( item [ , options ] )
This function performs the following steps when called:

1. Set options to ? GetOptionsObject(options).
2. If Type(item) is Object and item has an [[InitializedTemporalDate]] internal slot, then
   a. Perform ? ToTemporalOverflow(options).
   b. Return ! CreateTemporalDate(item.[[ISOYear]], item.[[ISOMonth]], item.[[ISODay]], item.[[Calendar]]).
3. Return ? ToTemporalDate(item, options).
   3.2.3 Temporal.PlainDate.compare ( one, two )
   This function performs the following steps when called:

4. Set one to ? ToTemporalDate(one).
5. Set two to ? ToTemporalDate(two).
6. Return 𝔽(! CompareISODate(one.[[ISOYear]], one.[[ISOMonth]], one.[[ISODay]], two.[[ISOYear]], two.[[ISOMonth]], two.[[ISODay]])).
   3.3 Properties of the Temporal.PlainDate Prototype Object
   The Temporal.PlainDate prototype object

is itself an ordinary object.
is not a Temporal.PlainDate instance and does not have a [[InitializedTemporalDate]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
NOTE
An ECMAScript implementation that includes the ECMA-402 Internationalization API extends this prototype with additional properties in order to represent calendar data.
3.3.1 Temporal.PlainDate.prototype.constructor
The initial value of Temporal.PlainDate.prototype.constructor is %Temporal.PlainDate%.

3.3.2 Temporal.PlainDate.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.PlainDate".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

3.3.3 get Temporal.PlainDate.prototype.calendarId
Temporal.PlainDate.prototype.calendarId is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let temporalDate be the this value.
2. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
3. Return ? ToTemporalCalendarIdentifier(temporalDate.[[Calendar]]).
   3.3.4 get Temporal.PlainDate.prototype.year
   Temporal.PlainDate.prototype.year is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

4. Let temporalDate be the this value.
5. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
6. Let calendar be temporalDate.[[Calendar]].
7. Return 𝔽(? CalendarYear(calendar, temporalDate)).
   3.3.5 get Temporal.PlainDate.prototype.month
   Temporal.PlainDate.prototype.month is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

8. Let temporalDate be the this value.
9. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
10. Let calendar be temporalDate.[[Calendar]].
11. Return 𝔽(? CalendarMonth(calendar, temporalDate)).
    3.3.6 get Temporal.PlainDate.prototype.monthCode
    Temporal.PlainDate.prototype.monthCode is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

12. Let temporalDate be the this value.
13. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
14. Let calendar be temporalDate.[[Calendar]].
15. Return ? CalendarMonthCode(calendar, temporalDate).
    3.3.7 get Temporal.PlainDate.prototype.day
    Temporal.PlainDate.prototype.day is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

16. Let temporalDate be the this value.
17. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
18. Let calendarRec be ? CreateCalendarMethodsRecord(temporalDate.[[Calendar]], « DAY »).
19. Return 𝔽(? CalendarDay(calendarRec, temporalDate)).
    3.3.8 get Temporal.PlainDate.prototype.dayOfWeek
    Temporal.PlainDate.prototype.dayOfWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

20. Let temporalDate be the this value.
21. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
22. Let calendar be temporalDate.[[Calendar]].
23. Return 𝔽(? CalendarDayOfWeek(calendar, temporalDate)).
    3.3.9 get Temporal.PlainDate.prototype.dayOfYear
    Temporal.PlainDate.prototype.dayOfYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

24. Let temporalDate be the this value.
25. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
26. Let calendar be temporalDate.[[Calendar]].
27. Return 𝔽(? CalendarDayOfYear(calendar, temporalDate)).
    3.3.10 get Temporal.PlainDate.prototype.weekOfYear
    Temporal.PlainDate.prototype.weekOfYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

28. Let temporalDate be the this value.
29. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
30. Let calendar be temporalDate.[[Calendar]].
31. Return 𝔽(? CalendarWeekOfYear(calendar, temporalDate)).
    3.3.11 get Temporal.PlainDate.prototype.yearOfWeek
    Temporal.PlainDate.prototype.yearOfWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

32. Let temporalDate be the this value.
33. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
34. Let calendar be temporalDate.[[Calendar]].
35. Return 𝔽(? CalendarYearOfWeek(calendar, temporalDate)).
    3.3.12 get Temporal.PlainDate.prototype.daysInWeek
    Temporal.PlainDate.prototype.daysInWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

36. Let temporalDate be the this value.
37. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
38. Let calendar be temporalDate.[[Calendar]].
39. Return 𝔽(? CalendarDaysInWeek(calendar, temporalDate)).
    3.3.13 get Temporal.PlainDate.prototype.daysInMonth
    Temporal.PlainDate.prototype.daysInMonth is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

40. Let temporalDate be the this value.
41. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
42. Let calendar be temporalDate.[[Calendar]].
43. Return 𝔽(? CalendarDaysInMonth(calendar, temporalDate)).
    3.3.14 get Temporal.PlainDate.prototype.daysInYear
    Temporal.PlainDate.prototype.daysInYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

44. Let temporalDate be the this value.
45. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
46. Let calendar be temporalDate.[[Calendar]].
47. Return 𝔽(? CalendarDaysInYear(calendar, temporalDate)).
    3.3.15 get Temporal.PlainDate.prototype.monthsInYear
    Temporal.PlainDate.prototype.monthsInYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

48. Let temporalDate be the this value.
49. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
50. Let calendar be temporalDate.[[Calendar]].
51. Return 𝔽(? CalendarMonthsInYear(calendar, temporalDate)).
    3.3.16 get Temporal.PlainDate.prototype.inLeapYear
    Temporal.PlainDate.prototype.inLeapYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

52. Let temporalDate be the this value.
53. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
54. Let calendar be temporalDate.[[Calendar]].
55. Return ? CalendarInLeapYear(calendar, temporalDate).
    3.3.17 Temporal.PlainDate.prototype.toPlainYearMonth ( )
    This method performs the following steps when called:

56. Let temporalDate be the this value.
57. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
58. Let calendarRec be ? CreateCalendarMethodsRecord(temporalDate.[[Calendar]], « FIELDS, YEAR-MONTH-FROM-FIELDS »).
59. Let fieldNames be ? CalendarFields(calendarRec, « "monthCode", "year" »).
60. Let fields be ? PrepareTemporalFields(temporalDate, fieldNames, «»).
61. Return ? CalendarYearMonthFromFields(calendarRec, fields).
62. NOTE: The call to CalendarYearMonthFromFields is necessary in order to create a PlainYearMonth object with the [[ISOYear]], [[ISOMonth]], and [[ISODay]] internal slots set correctly.
    3.3.18 Temporal.PlainDate.prototype.toPlainMonthDay ( )
    This method performs the following steps when called:

63. Let temporalDate be the this value.
64. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
65. Let calendarRec be ? CreateCalendarMethodsRecord(temporalDate.[[Calendar]], « FIELDS, MONTH-DAY-FROM-FIELDS »).
66. Let fieldNames be ? CalendarFields(calendarRec, « "day", "monthCode" »).
67. Let fields be ? PrepareTemporalFields(temporalDate, fieldNames, «»).
68. Return ? CalendarMonthDayFromFields(calendarRec, fields).
69. NOTE: The call to CalendarMonthDayFromFields is necessary in order to create a PlainMonthDay object with the [[ISOYear]], [[ISOMonth]], and [[ISODay]] internal slots set correctly.
    3.3.19 Temporal.PlainDate.prototype.getISOFields ( )
    This method performs the following steps when called:

70. Let temporalDate be the this value.
71. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
72. Let fields be OrdinaryObjectCreate(%Object.prototype%).
73. Perform ! CreateDataPropertyOrThrow(fields, "calendar", temporalDate.[[Calendar]]).
74. Perform ! CreateDataPropertyOrThrow(fields, "isoDay", 𝔽(temporalDate.[[ISODay]])).
75. Perform ! CreateDataPropertyOrThrow(fields, "isoMonth", 𝔽(temporalDate.[[ISOMonth]])).
76. Perform ! CreateDataPropertyOrThrow(fields, "isoYear", 𝔽(temporalDate.[[ISOYear]])).
77. Return fields.
    3.3.20 Temporal.PlainDate.prototype.getCalendar ( )
    This method performs the following steps when called:

78. Let temporalDate be the this value.
79. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
80. Return ToTemporalCalendarObject(temporalDate.[[Calendar]]).
    3.3.21 Temporal.PlainDate.prototype.add ( temporalDurationLike [ , options ] )
    This method performs the following steps when called:

81. Let temporalDate be the this value.
82. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
83. Let duration be ? ToTemporalDuration(temporalDurationLike).
84. Set options to ? GetOptionsObject(options).
85. Let calendarRec be ? CreateCalendarMethodsRecord(temporalDate.[[Calendar]], « DATE-ADD »).
86. Return ? AddDate(calendarRec, temporalDate, duration, options).
    3.3.22 Temporal.PlainDate.prototype.subtract ( temporalDurationLike [ , options ] )
    This method performs the following steps when called:

87. Let temporalDate be the this value.
88. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
89. Let duration be ? ToTemporalDuration(temporalDurationLike).
90. Set options to ? GetOptionsObject(options).
91. Let negatedDuration be ! CreateNegatedTemporalDuration(duration).
92. Let calendarRec be ? CreateCalendarMethodsRecord(temporalDate.[[Calendar]], « DATE-ADD »).
93. Return ? AddDate(calendarRec, temporalDate, negatedDuration, options).
    3.3.23 Temporal.PlainDate.prototype.with ( temporalDateLike [ , options ] )
    This method performs the following steps when called:

94. Let temporalDate be the this value.
95. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
96. If ? IsPartialTemporalObject(temporalDateLike) is false, throw a TypeError exception.
97. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
98. Let calendarRec be ? CreateCalendarMethodsRecord(temporalDate.[[Calendar]], « DATE-FROM-FIELDS, FIELDS, MERGE-FIELDS »).
99. Let fieldNames be ? CalendarFields(calendarRec, « "day", "month", "monthCode", "year" »).
100. Let fields be ? PrepareTemporalFields(temporalDate, fieldNames, «»).
101. Let partialDate be ? PrepareTemporalFields(temporalDateLike, fieldNames, PARTIAL).
102. Set fields to ? CalendarMergeFields(calendarRec, fields, partialDate).
103. Set fields to ? PrepareTemporalFields(fields, fieldNames, «»).
104. Return ? CalendarDateFromFields(calendarRec, fields, resolvedOptions).
     3.3.24 Temporal.PlainDate.prototype.withCalendar ( calendarLike )
     This method performs the following steps when called:

105. Let temporalDate be the this value.
106. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
107. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike).
108. Return ! CreateTemporalDate(temporalDate.[[ISOYear]], temporalDate.[[ISOMonth]], temporalDate.[[ISODay]], calendar).
     3.3.25 Temporal.PlainDate.prototype.until ( other [ , options ] )
     This method performs the following steps when called:

109. Let temporalDate be the this value.
110. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
111. Return ? DifferenceTemporalPlainDate(UNTIL, temporalDate, other, options).
     3.3.26 Temporal.PlainDate.prototype.since ( other [ , options ] )
     This method performs the following steps when called:

112. Let temporalDate be the this value.
113. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
114. Return ? DifferenceTemporalPlainDate(SINCE, temporalDate, other, options).
     3.3.27 Temporal.PlainDate.prototype.equals ( other )
     This method performs the following steps when called:

115. Let temporalDate be the this value.
116. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
117. Set other to ? ToTemporalDate(other).
118. If temporalDate.[[ISOYear]] ≠ other.[[ISOYear]], return false.
119. If temporalDate.[[ISOMonth]] ≠ other.[[ISOMonth]], return false.
120. If temporalDate.[[ISODay]] ≠ other.[[ISODay]], return false.
121. Return ? CalendarEquals(temporalDate.[[Calendar]], other.[[Calendar]]).
     3.3.28 Temporal.PlainDate.prototype.toPlainDateTime ( [ temporalTime ] )
     This method performs the following steps when called:

122. Let temporalDate be the this value.
123. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
124. Set temporalTime to ? ToTemporalTimeOrMidnight(temporalTime).
125. Return ? CreateTemporalDateTime(temporalDate.[[ISOYear]], temporalDate.[[ISOMonth]], temporalDate.[[ISODay]], temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], temporalDate.[[Calendar]]).
     3.3.29 Temporal.PlainDate.prototype.toZonedDateTime ( item )
     This method performs the following steps when called:

126. Let temporalDate be the this value.
127. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
128. If Type(item) is Object, then
     a. If item has an [[InitializedTemporalTimeZone]] internal slot, then
     i. Let timeZone be item.
     ii. Let temporalTime be undefined.
     b. Else,
     i. Let timeZoneLike be ? Get(item, "timeZone").
     ii. If timeZoneLike is undefined, then
129. Let timeZone be ? ToTemporalTimeZoneSlotValue(item).
130. Let temporalTime be undefined.
     iii. Else,
131. Let timeZone be ? ToTemporalTimeZoneSlotValue(timeZoneLike).
132. Let temporalTime be ? Get(item, "plainTime").
133. Else,
     a. Let timeZone be ? ToTemporalTimeZoneSlotValue(item).
     b. Let temporalTime be undefined.
134. Set temporalTime to ? ToTemporalTimeOrMidnight(temporalTime).
135. Let temporalDateTime be ? CreateTemporalDateTime(temporalDate.[[ISOYear]], temporalDate.[[ISOMonth]], temporalDate.[[ISODay]], temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], temporalDate.[[Calendar]]).
136. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
137. Let instant be ? GetInstantFor(timeZoneRec, temporalDateTime, "compatible").
138. Return ! CreateTemporalZonedDateTime(instant.[[Nanoseconds]], timeZone, temporalDate.[[Calendar]]).
     3.3.30 Temporal.PlainDate.prototype.toString ( [ options ] )
     This method performs the following steps when called:

139. Let temporalDate be the this value.
140. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
141. Set options to ? GetOptionsObject(options).
142. Let showCalendar be ? ToCalendarNameOption(options).
143. Return ? TemporalDateToString(temporalDate, showCalendar).
     3.3.31 Temporal.PlainDate.prototype.toLocaleString ( [ locales [ , options ] ] )
     An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

This method performs the following steps when called:

1. Let temporalDate be the this value.
2. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
3. Return ? TemporalDateToString(temporalDate, "auto").
   3.3.32 Temporal.PlainDate.prototype.toJSON ( )
   This method performs the following steps when called:

4. Let temporalDate be the this value.
5. Perform ? RequireInternalSlot(temporalDate, [[InitializedTemporalDate]]).
6. Return ? TemporalDateToString(temporalDate, "auto").
   3.3.33 Temporal.PlainDate.prototype.valueOf ( )
   This method performs the following steps when called:

7. Throw a TypeError exception.
   NOTE
   This method always throws, because in the absence of valueOf(), expressions with arithmetic operators such as plainDate1 > plainDate2 would fall back to being equivalent to plainDate1.toString() > plainDate2.toString(). Lexicographical comparison of serialized strings might not seem obviously wrong, because the result would sometimes be correct. Implementations are encouraged to phrase the error message to point users to Temporal.PlainDate.compare(), Temporal.PlainDate.prototype.equals(), and/or Temporal.PlainDate.prototype.toString().

3.4 Properties of Temporal.PlainDate Instances
Temporal.PlainDate instances are ordinary objects that inherit properties from the %Temporal.PlainDate.prototype% intrinsic object. Temporal.PlainDate instances are initially created with the internal slots described in Table 1.

Table 1: Internal Slots of Temporal.PlainDate Instances
Internal Slot Description
[[InitializedTemporalDate]] The only specified use of this slot is for distinguishing Temporal.PlainDate instances from other objects.
[[ISOYear]] An integer representing the year in the ISO 8601 calendar.
[[ISOMonth]] An integer between 1 and 12, inclusive, representing the month of the year in the ISO 8601 calendar.
[[ISODay]] An integer between 1 and ISODaysInMonth([[ISOYear]], [[ISOMonth]]), inclusive, representing the day of the month in the ISO 8601 calendar.
[[Calendar]] A String or Object representing the calendar.
3.5 Abstract Operations for Temporal.PlainDate Objects
3.5.1 ISO Date Records
An ISO Date Record is a Record value used to represent a valid calendar date in the ISO 8601 calendar, although the year may be outside of the allowed range for Temporal. ISO Date Records are produced by the abstract operation CreateISODateRecord.

ISO Date Records have the fields listed in Table 2.

Table 2: ISO Date Record Fields
Field Name Value Meaning
[[Year]] an integer The year in the ISO 8601 calendar.
[[Month]] an integer between 1 and 12, inclusive The number of the month in the ISO 8601 calendar.
[[Day]] an integer between 1 and 31, inclusive The number of the day of the month in the ISO 8601 calendar.
3.5.2 CreateISODateRecord ( year, month, day )
The abstract operation CreateISODateRecord takes arguments year (an integer), month (an integer between 1 and 12 inclusive), and day (an integer between 1 and 31 inclusive) and returns an ISO Date Record. It performs the following steps when called:

1. Assert: IsValidISODate(year, month, day) is true.
2. Return the Record { [[Year]]: year, [[Month]]: month, [[Day]]: day }.
   3.5.3 CreateTemporalDate ( isoYear, isoMonth, isoDay, calendar [ , newTarget ] )
   The abstract operation CreateTemporalDate takes arguments isoYear (an integer), isoMonth (an integer), isoDay (an integer), and calendar (a String or Object) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.PlainDate, or an abrupt completion. It creates a Temporal.PlainDate instance and fills the internal slots with valid values. It performs the following steps when called:

3. If IsValidISODate(isoYear, isoMonth, isoDay) is false, throw a RangeError exception.
4. If ISODateTimeWithinLimits(isoYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0) is false, throw a RangeError exception.
5. If newTarget is not present, set newTarget to %Temporal.PlainDate%.
6. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.PlainDate.prototype%", « [[InitializedTemporalDate]], [[ISOYear]], [[ISOMonth]], [[ISODay]], [[Calendar]] »).
7. Set object.[[ISOYear]] to isoYear.
8. Set object.[[ISOMonth]] to isoMonth.
9. Set object.[[ISODay]] to isoDay.
10. Set object.[[Calendar]] to calendar.
11. Return object.
    NOTE
    Deferring to ISODateTimeWithinLimits with an hour of 12 avoids trouble at the extremes of the representable range of dates, which stop just before midnight on each end.

3.5.4 ToTemporalDate ( item [ , options ] )
The abstract operation ToTemporalDate takes argument item (an ECMAScript language value) and optional argument options (an Object or undefined) and returns either a normal completion containing a Temporal.PlainDate, or a throw completion. It returns its argument item if it is already a Temporal.PlainDate instance, converts item to a new Temporal.PlainDate instance if possible, and throws otherwise. It performs the following steps when called:

1. If options is not present, set options to undefined.
2. If options is not undefined, set options to ? SnapshotOwnProperties(! GetOptionsObject(options), null).
3. If Type(item) is Object, then
   a. If item has an [[InitializedTemporalDate]] internal slot, then
   i. Return item.
   b. If item has an [[InitializedTemporalZonedDateTime]] internal slot, then
   i. Perform ? ToTemporalOverflow(options).
   ii. Let instant be ! CreateTemporalInstant(item.[[Nanoseconds]]).
   iii. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(item.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
   iv. Let plainDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, item.[[Calendar]]).
   v. Return ! CreateTemporalDate(plainDateTime.[[ISOYear]], plainDateTime.[[ISOMonth]], plainDateTime.[[ISODay]], plainDateTime.[[Calendar]]).
   c. If item has an [[InitializedTemporalDateTime]] internal slot, then
   i. Perform ? ToTemporalOverflow(options).
   ii. Return ! CreateTemporalDate(item.[[ISOYear]], item.[[ISOMonth]], item.[[ISODay]], item.[[Calendar]]).
   d. Let calendar be ? GetTemporalCalendarSlotValueWithISODefault(item).
   e. Let calendarRec be ? CreateCalendarMethodsRecord(calendar, « DATE-FROM-FIELDS, FIELDS »).
   f. Let fieldNames be ? CalendarFields(calendarRec, « "day", "month", "monthCode", "year" »).
   g. Let fields be ? PrepareTemporalFields(item, fieldNames, «»).
   h. Return ? CalendarDateFromFields(calendarRec, fields, options).
4. If item is not a String, throw a TypeError exception.
5. Let result be ? ParseTemporalDateString(item).
6. Assert: IsValidISODate(result.[[Year]], result.[[Month]], result.[[Day]]) is true.
7. Let calendar be result.[[Calendar]].
8. If calendar is undefined, set calendar to "iso8601".
9. If IsBuiltinCalendar(calendar) is false, throw a RangeError exception.
10. Set calendar to the ASCII-lowercase of calendar.
11. Perform ? ToTemporalOverflow(options).
12. Return ? CreateTemporalDate(result.[[Year]], result.[[Month]], result.[[Day]], calendar).
    3.5.5 ISODateSurpasses ( sign, y1, m1, d1, y2, m2, d2 )
    The abstract operation ISODateSurpasses takes arguments sign (-1 or 1), y1 (an integer), m1 (an integer), d1 (an integer), y2 (an integer), m2 (an integer in the inclusive interval from 1 to 12), and d2 (an integer in the inclusive interval from 1 to ISODaysInMonth(m2)) and returns a Boolean. The return value indicates whether the date denoted by y1, m1, d1 surpasses that denoted by y2, m2, d2 in the direction denoted by sign. The former date does not have to exist. Note that this operation is specific to date difference calculations and is not the same as CompareISODate. It performs the following steps when called:

13. Let comparison be CompareISODate(y1, m1, d1, y2, m2, d2).
14. If sign × comparison is 1, return true.
15. Return false.
    3.5.6 DifferenceISODate ( y1, m1, d1, y2, m2, d2, largestUnit )
    The abstract operation DifferenceISODate takes arguments y1 (an integer), m1 (an integer), d1 (an integer), y2 (an integer), m2 (an integer), d2 (an integer), and largestUnit ("year", "month", "week", or "day") and returns a Date Duration Record. The return value is the elapsed duration from a first date until a second date, according to the reckoning of the ISO 8601 calendar. No fields larger than largestUnit will be non-zero in the resulting Date Duration Record. It performs the following steps when called:

16. Assert: IsValidISODate(y1, m1, d1) is true.
17. Assert: IsValidISODate(y2, m2, d2) is true.
18. Let sign be -CompareISODate(y1, m1, d1, y2, m2, d2).
19. If sign = 0, return ! CreateDateDurationRecord(0, 0, 0, 0).
20. Let years be 0.
21. If largestUnit is "year", then
    a. Let candidateYears be sign.
    b. Repeat, while ISODateSurpasses(sign, y1 + candidateYears, m1, d1, y2, m2, d2) is false,
    i. Set years to candidateYears.
    ii. Set candidateYears to candidateYears + sign.
22. Let months be 0.
23. If largestUnit is "year" or largestUnit is "month", then
    a. Let candidateMonths be sign.
    b. Let intermediate be BalanceISOYearMonth(y1 + years, m1 + candidateMonths).
    c. Repeat, while ISODateSurpasses(sign, intermediate.[[Year]], intermediate.[[Month]], d1, y2, m2, d2) is false,
    i. Set months to candidateMonths.
    ii. Set candidateMonths to candidateMonths + sign.
    iii. Set intermediate to BalanceISOYearMonth(intermediate.[[Year]], intermediate.[[Month]] + sign).
24. Set intermediate to BalanceISOYearMonth(y1 + years, m1 + months).
25. Let constrained be ! RegulateISODate(intermediate.[[Year]], intermediate.[[Month]], d1, "constrain").
26. Let weeks be 0.
27. If largestUnit is "week", then
    a. Let candidateWeeks be sign.
    b. Set intermediate to BalanceISODate(constrained.[[Year]], constrained.[[Month]], constrained.[[Day]] + 7 × candidateWeeks).
    c. Repeat, while ISODateSurpasses(sign, intermediate.[[Year]], intermediate.[[Month]], intermediate.[[Day]], y2, m2, d2) is false,
    i. Set weeks to candidateWeeks.
    ii. Set candidateWeeks to candidateWeeks + sign.
    iii. Set intermediate to BalanceISODate(intermediate.[[Year]], intermediate.[[Month]], intermediate.[[Day]] + 7 × sign).
28. Let days be 0.
29. Let candidateDays be sign.
30. Set intermediate to BalanceISODate(constrained.[[Year]], constrained.[[Month]], constrained.[[Day]] + 7 × weeks + candidateDays).
31. Repeat, while ISODateSurpasses(sign, intermediate.[[Year]], intermediate.[[Month]], intermediate.[[Day]], y2, m2, d2) is false,
    a. Set days to candidateDays.
    b. Set candidateDays to candidateDays + sign.
    c. Set intermediate to BalanceISODate(intermediate.[[Year]], intermediate.[[Month]], intermediate.[[Day]] + sign).
32. Return ! CreateDateDurationRecord(years, months, weeks, days).
    3.5.7 DifferenceDate ( calendarRec, one, two, options )
    The abstract operation DifferenceDate takes arguments calendarRec (a Calendar Methods Record), one (a Temporal.PlainDate), two (a Temporal.PlainDate), and options (an Object) and returns either a normal completion containing a Temporal.Duration, or an abrupt completion. It determines the difference between the dates one and two. Usually this is accomplished by calling the dateUntil method of the given calendar as in CalendarDateUntil, but if the dates are equal or no units greater than days are needed in the difference, the computation will not cause an observable method call. It performs the following steps when called:

33. Assert: one.[[Calendar]] and two.[[Calendar]] have been determined to be equivalent as with CalendarEquals.
34. Assert: options is an ordinary Object.
35. Assert: options.[[Prototype]] is null.
36. Assert: options has a "largestUnit" data property.
37. If one.[[ISOYear]] = two.[[ISOYear]] and one.[[ISOMonth]] = two.[[ISOMonth]] and one.[[ISODay]] = two.[[ISODay]], then
    a. Return ! CreateTemporalDuration(0, 0, 0, 0, 0, 0, 0, 0, 0, 0).
38. If ! Get(options, "largestUnit") is "day", then
    a. Let days be DaysUntil(one, two).
    b. Return ! CreateTemporalDuration(0, 0, 0, days, 0, 0, 0, 0, 0, 0).
39. Return ? CalendarDateUntil(calendarRec, one, two, options).
    3.5.8 RegulateISODate ( year, month, day, overflow )
    The abstract operation RegulateISODate takes arguments year (an integer), month (an integer), day (an integer), and overflow ("constrain" or "reject") and returns either a normal completion containing an ISO Date Record, or an abrupt completion. It performs the overflow correction given by overflow on the values year, month, and day, in order to arrive at a valid date in the ISO 8601 calendar, as determined by IsValidISODate. For "reject", values that do not form a valid date cause an exception to be thrown. For "constrain", values that do not form a valid date are clamped to the correct range. It performs the following steps when called:

40. If overflow is "constrain", then
    a. Set month to the result of clamping month between 1 and 12.
    b. Let daysInMonth be ISODaysInMonth(year, month).
    c. Set day to the result of clamping day between 1 and daysInMonth.
    d. Return CreateISODateRecord(year, month, day).
41. Else,
    a. Assert: overflow is "reject".
    b. If IsValidISODate(year, month, day) is false, throw a RangeError exception.
    c. Return CreateISODateRecord(year, month, day).
    3.5.9 IsValidISODate ( year, month, day )
    The abstract operation IsValidISODate takes arguments year (an integer), month (an integer), and day (an integer) and returns a Boolean. The return value is true if its arguments form a valid date in the ISO 8601 calendar, and false otherwise. This includes dates that may fall outside of the allowed range for Temporal. It performs the following steps when called:

42. If month < 1 or month > 12, then
    a. Return false.
43. Let daysInMonth be ISODaysInMonth(year, month).
44. If day < 1 or day > daysInMonth, then
    a. Return false.
45. Return true.
    3.5.10 BalanceISODate ( year, month, day )
    The abstract operation BalanceISODate takes arguments year (an integer), month (an integer), and day (an integer) and returns an ISO Date Record. It converts the given year, month, and day into a valid calendar date in the ISO 8601 calendar as given by IsValidISODate, by overflowing out-of-range month or day values into the next-highest unit. This date may be outside the range given by ISODateTimeWithinLimits. It performs the following steps when called:

46. Let epochDays be ISODateToEpochDays(year, month - 1, day).
47. Let ms be EpochDaysToEpochMs(epochDays, 0).
48. Return CreateISODateRecord(EpochTimeToEpochYear(ms), EpochTimeToMonthInYear(ms) + 1, EpochTimeToDate(ms)).
    3.5.11 PadISOYear ( y )
    The abstract operation PadISOYear takes argument y (an integer) and returns a String. It returns a String representation of y suitable for inclusion in an ISO 8601 string, either in 4-digit format or 6-digit format with sign. It performs the following steps when called:

49. If y ≥ 0 and y ≤ 9999, then
    a. Return ToZeroPaddedDecimalString(y, 4).
50. If y > 0, let yearSign be "+"; otherwise, let yearSign be "-".
51. Let year be ToZeroPaddedDecimalString(abs(y), 6).
52. Return the string-concatenation of yearSign and year.
    3.5.12 TemporalDateToString ( temporalDate, showCalendar )
53. Assert: Type(temporalDate) is Object.
54. Assert: temporalDate has an [[InitializedTemporalDate]] internal slot.
55. Let year be PadISOYear(temporalDate.[[ISOYear]]).
56. Let month be ToZeroPaddedDecimalString(temporalDate.[[ISOMonth]], 2).
57. Let day be ToZeroPaddedDecimalString(temporalDate.[[ISODay]], 2).
58. Let calendar be ? MaybeFormatCalendarAnnotation(temporalDate.[[Calendar]], showCalendar).
59. Return the string-concatenation of year, the code unit 0x002D (HYPHEN-MINUS), month, the code unit 0x002D (HYPHEN-MINUS), day, and calendar.
    3.5.13 AddISODate ( year, month, day, years, months, weeks, days, overflow )
60. Assert: year, month, day, years, months, weeks, and days are integers.
61. Assert: overflow is either "constrain" or "reject".
62. Let intermediate be ! BalanceISOYearMonth(year + years, month + months).
63. Set intermediate to ? RegulateISODate(intermediate.[[Year]], intermediate.[[Month]], day, overflow).
64. Set days to days + 7 × weeks.
65. Let d be intermediate.[[Day]] + days.
66. Return BalanceISODate(intermediate.[[Year]], intermediate.[[Month]], d).
    3.5.14 AddDate ( calendarRec, plainDate, duration [ , options ] )
    The abstract operation AddDate takes arguments calendarRec (a Calendar Methods Record), plainDate (a Temporal.PlainDate), and duration (a Temporal.Duration) and optional argument options (an Object or undefined) and returns either a normal completion containing a Temporal.PlainDate, or an abrupt completion. It adds duration to plainDate. Usually this is accomplished by calling the dateAdd method of the given calendar as in CalendarDateAdd, but if the duration only contains days, the computation will not cause an observable method call. It performs the following steps when called:

67. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-ADD) is true.
68. If options is not present, set options to undefined.
69. If duration.[[Years]] ≠ 0, or duration.[[Months]] ≠ 0, or duration.[[Weeks]] ≠ 0, then
    a. Return ? CalendarDateAdd(calendarRec, plainDate, duration, options).
70. Let overflow be ? ToTemporalOverflow(options).
71. Let norm be NormalizeTimeDuration(duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
72. Let days be duration.[[Days]] + BalanceTimeDuration(norm, "day").[[Days]].
73. Let result be ? AddISODate(plainDate.[[ISOYear]], plainDate.[[ISOMonth]], plainDate.[[ISODay]], 0, 0, 0, days, overflow).
74. Return ! CreateTemporalDate(result.[[Year]], result.[[Month]], result.[[Day]], calendarRec.[[Receiver]]).
    3.5.15 CompareISODate ( y1, m1, d1, y2, m2, d2 )
75. Assert: y1, m1, d1, y2, m2, and d2 are integers.
76. If y1 > y2, return 1.
77. If y1 < y2, return -1.
78. If m1 > m2, return 1.
79. If m1 < m2, return -1.
80. If d1 > d2, return 1.
81. If d1 < d2, return -1.
82. Return 0.
    3.5.16 DifferenceTemporalPlainDate ( operation, temporalDate, other, options )
    The abstract operation DifferenceTemporalPlainDate takes arguments operation (SINCE or UNTIL), temporalDate (a Temporal.PlainDate), other (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.Duration or an abrupt completion. It computes the difference between the two times represented by temporalDate and other, optionally rounds it, and returns it as a Temporal.Duration object. It performs the following steps when called:

83. If operation is SINCE, let sign be -1. Otherwise, let sign be 1.
84. Set other to ? ToTemporalDate(other).
85. If ? CalendarEquals(temporalDate.[[Calendar]], other.[[Calendar]]) is false, throw a RangeError exception.
86. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
87. Let settings be ? GetDifferenceSettings(operation, resolvedOptions, DATE, « », "day", "day").
88. If temporalDate.[[ISOYear]] = other.[[ISOYear]], and temporalDate.[[ISOMonth]] = other.[[ISOMonth]], and temporalDate.[[ISODay]] = other.[[ISODay]], then
    a. Return ! CreateTemporalDuration(0, 0, 0, 0, 0, 0, 0, 0, 0, 0).
89. Let calendarRec be ? CreateCalendarMethodsRecord(temporalDate.[[Calendar]], « DATE-ADD, DATE-UNTIL »).
90. Perform ! CreateDataPropertyOrThrow(resolvedOptions, "largestUnit", settings.[[LargestUnit]]).
91. Let result be ? DifferenceDate(calendarRec, temporalDate, other, resolvedOptions).
92. If settings.[[SmallestUnit]] is "day" and settings.[[RoundingIncrement]] = 1, let roundingGranularityIsNoop be true; else let roundingGranularityIsNoop be false.
93. If roundingGranularityIsNoop is false, then
    a. Let roundRecord be ? RoundDuration(result.[[Years]], result.[[Months]], result.[[Weeks]], result.[[Days]], ZeroTimeDuration(), settings.[[RoundingIncrement]], settings.[[SmallestUnit]], settings.[[RoundingMode]], temporalDate, calendarRec).
    b. Let roundResult be roundRecord.[[NormalizedDuration]].
    c. Set result to ? BalanceDateDurationRelative(roundResult.[[Years]], roundResult.[[Months]], roundResult.[[Weeks]], roundResult.[[Days]], settings.[[LargestUnit]], settings.[[SmallestUnit]], temporalDate, calendarRec).
94. Return ! CreateTemporalDuration(sign × result.[[Years]], sign × result.[[Months]], sign × result.[[Weeks]], sign × result.[[Days]], 0, 0, 0, 0, 0, 0).
    4 Temporal.PlainTime Objects
    A Temporal.PlainTime object is an Object that contains integers corresponding to a particular hour, minute, second, millisecond, microsecond, and nanosecond.

4.1 The Temporal.PlainTime Constructor
The Temporal.PlainTime constructor:

creates and initializes a new Temporal.PlainTime object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.PlainTime behaviour must include a super call to the %Temporal.PlainTime% constructor to create and initialize subclass instances with the necessary internal slots.
4.1.1 Temporal.PlainTime ( [ hour [ , minute [ , second [ , millisecond [ , microsecond [ , nanosecond ] ] ] ] ] ] )
This function performs the following steps when called:

1. If NewTarget is undefined, then
   a. Throw a TypeError exception.
2. If hour is undefined, set hour to 0; else set hour to ? ToIntegerWithTruncation(hour).
3. If minute is undefined, set minute to 0; else set minute to ? ToIntegerWithTruncation(minute).
4. If second is undefined, set second to 0; else set second to ? ToIntegerWithTruncation(second).
5. If millisecond is undefined, set millisecond to 0; else set millisecond to ? ToIntegerWithTruncation(millisecond).
6. If microsecond is undefined, set microsecond to 0; else set microsecond to ? ToIntegerWithTruncation(microsecond).
7. If nanosecond is undefined, set nanosecond to 0; else set nanosecond to ? ToIntegerWithTruncation(nanosecond).
8. Return ? CreateTemporalTime(hour, minute, second, millisecond, microsecond, nanosecond, NewTarget).
   4.2 Properties of the Temporal.PlainTime Constructor
   The value of the [[Prototype]] internal slot of the Temporal.PlainTime constructor is the intrinsic object %Function.prototype%.

The Temporal.PlainTime constructor has the following properties:

4.2.1 Temporal.PlainTime.prototype
The initial value of Temporal.PlainTime.prototype is %Temporal.PlainTime.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

4.2.2 Temporal.PlainTime.from ( item [ , options ] )
This function performs the following steps when called:

1. Set options to ? GetOptionsObject(options).
2. Let overflow be ? ToTemporalOverflow(options).
3. If Type(item) is Object and item has an [[InitializedTemporalTime]] internal slot, then
   a. Return ! CreateTemporalTime(item.[[ISOHour]], item.[[ISOMinute]], item.[[ISOSecond]], item.[[ISOMillisecond]], item.[[ISOMicrosecond]], item.[[ISONanosecond]]).
4. Return ? ToTemporalTime(item, overflow).
   4.2.3 Temporal.PlainTime.compare ( one, two )
   This function performs the following steps when called:

5. Set one to ? ToTemporalTime(one).
6. Set two to ? ToTemporalTime(two).
7. Return 𝔽(! CompareTemporalTime(one.[[ISOHour]], one.[[ISOMinute]], one.[[ISOSecond]], one.[[ISOMillisecond]], one.[[ISOMicrosecond]], one.[[ISONanosecond]], two.[[ISOHour]], two.[[ISOMinute]], two.[[ISOSecond]], two.[[ISOMillisecond]], two.[[ISOMicrosecond]], two.[[ISONanosecond]])).
   4.3 Properties of the Temporal.PlainTime Prototype Object
   The Temporal.PlainTime prototype object

is itself an ordinary object.
is not a Temporal.PlainTime instance and does not have a [[InitializedTemporalTime]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
4.3.1 Temporal.PlainTime.prototype.constructor
The initial value of Temporal.PlainTime.prototype.constructor is %Temporal.PlainTime%.

4.3.2 Temporal.PlainTime.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.PlainTime".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

4.3.3 get Temporal.PlainTime.prototype.hour
Temporal.PlainTime.prototype.hour is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let temporalTime be the this value.
2. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
3. Return 𝔽(temporalTime.[[ISOHour]]).
   4.3.4 get Temporal.PlainTime.prototype.minute
   Temporal.PlainTime.prototype.minute is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

4. Let temporalTime be the this value.
5. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
6. Return 𝔽(temporalTime.[[ISOMinute]]).
   4.3.5 get Temporal.PlainTime.prototype.second
   Temporal.PlainTime.prototype.second is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

7. Let temporalTime be the this value.
8. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
9. Return 𝔽(temporalTime.[[ISOSecond]]).
   4.3.6 get Temporal.PlainTime.prototype.millisecond
   Temporal.PlainTime.prototype.millisecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

10. Let temporalTime be the this value.
11. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
12. Return 𝔽(temporalTime.[[ISOMillisecond]]).
    4.3.7 get Temporal.PlainTime.prototype.microsecond
    Temporal.PlainTime.prototype.microsecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

13. Let temporalTime be the this value.
14. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
15. Return 𝔽(temporalTime.[[ISOMicrosecond]]).
    4.3.8 get Temporal.PlainTime.prototype.nanosecond
    Temporal.PlainTime.prototype.nanosecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

16. Let temporalTime be the this value.
17. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
18. Return 𝔽(temporalTime.[[ISONanosecond]]).
    4.3.9 Temporal.PlainTime.prototype.add ( temporalDurationLike )
    This method performs the following steps when called:

19. Let temporalTime be the this value.
20. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
21. Return ? AddDurationToOrSubtractDurationFromPlainTime(ADD, temporalTime, temporalDurationLike).
    4.3.10 Temporal.PlainTime.prototype.subtract ( temporalDurationLike )
    This method performs the following steps when called:

22. Let temporalTime be the this value.
23. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
24. Return ? AddDurationToOrSubtractDurationFromPlainTime(SUBTRACT, temporalTime, temporalDurationLike).
    4.3.11 Temporal.PlainTime.prototype.with ( temporalTimeLike [ , options ] )
    This method performs the following steps when called:

25. Let temporalTime be the this value.
26. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
27. If ? IsPartialTemporalObject(temporalTimeLike) is false, throw a TypeError exception.
28. Set options to ? GetOptionsObject(options).
29. Let overflow be ? ToTemporalOverflow(options).
30. Let partialTime be ? ToTemporalTimeRecord(temporalTimeLike, PARTIAL).
31. If partialTime.[[Hour]] is not undefined, then
    a. Let hour be partialTime.[[Hour]].
32. Else,
    a. Let hour be temporalTime.[[ISOHour]].
33. If partialTime.[[Minute]] is not undefined, then
    a. Let minute be partialTime.[[Minute]].
34. Else,
    a. Let minute be temporalTime.[[ISOMinute]].
35. If partialTime.[[Second]] is not undefined, then
    a. Let second be partialTime.[[Second]].
36. Else,
    a. Let second be temporalTime.[[ISOSecond]].
37. If partialTime.[[Millisecond]] is not undefined, then
    a. Let millisecond be partialTime.[[Millisecond]].
38. Else,
    a. Let millisecond be temporalTime.[[ISOMillisecond]].
39. If partialTime.[[Microsecond]] is not undefined, then
    a. Let microsecond be partialTime.[[Microsecond]].
40. Else,
    a. Let microsecond be temporalTime.[[ISOMicrosecond]].
41. If partialTime.[[Nanosecond]] is not undefined, then
    a. Let nanosecond be partialTime.[[Nanosecond]].
42. Else,
    a. Let nanosecond be temporalTime.[[ISONanosecond]].
43. Let result be ? RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow).
44. Return ! CreateTemporalTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]]).
    4.3.12 Temporal.PlainTime.prototype.until ( other [ , options ] )
    This method performs the following steps when called:

45. Let temporalTime be the this value.
46. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
47. Return ? DifferenceTemporalPlainTime(UNTIL, temporalTime, other, options).
    4.3.13 Temporal.PlainTime.prototype.since ( other [ , options ] )
    This method performs the following steps when called:

48. Let temporalTime be the this value.
49. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
50. Return ? DifferenceTemporalPlainTime(SINCE, temporalTime, other, options).
    4.3.14 Temporal.PlainTime.prototype.round ( roundTo )
    This method performs the following steps when called:

51. Let temporalTime be the this value.
52. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
53. If roundTo is undefined, then
    a. Throw a TypeError exception.
54. If Type(roundTo) is String, then
    a. Let paramString be roundTo.
    b. Set roundTo to OrdinaryObjectCreate(null).
    c. Perform ! CreateDataPropertyOrThrow(roundTo, "smallestUnit", paramString).
55. Else,
    a. Set roundTo to ? GetOptionsObject(roundTo).
56. NOTE: The following steps read options and perform independent validation in alphabetical order (ToTemporalRoundingIncrement reads "roundingIncrement" and ToTemporalRoundingMode reads "roundingMode").
57. Let roundingIncrement be ? ToTemporalRoundingIncrement(roundTo).
58. Let roundingMode be ? ToTemporalRoundingMode(roundTo, "halfExpand").
59. Let smallestUnit be ? GetTemporalUnit(roundTo, "smallestUnit", TIME, REQUIRED).
60. Let maximum be MaximumTemporalDurationRoundingIncrement(smallestUnit).
61. Assert: maximum is not undefined.
62. Perform ? ValidateTemporalRoundingIncrement(roundingIncrement, maximum, false).
63. Let result be RoundTime(temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], roundingIncrement, smallestUnit, roundingMode).
64. Return ! CreateTemporalTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]]).
    4.3.15 Temporal.PlainTime.prototype.equals ( other )
    This method performs the following steps when called:

65. Let temporalTime be the this value.
66. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
67. Set other to ? ToTemporalTime(other).
68. If temporalTime.[[ISOHour]] ≠ other.[[ISOHour]], return false.
69. If temporalTime.[[ISOMinute]] ≠ other.[[ISOMinute]], return false.
70. If temporalTime.[[ISOSecond]] ≠ other.[[ISOSecond]], return false.
71. If temporalTime.[[ISOMillisecond]] ≠ other.[[ISOMillisecond]], return false.
72. If temporalTime.[[ISOMicrosecond]] ≠ other.[[ISOMicrosecond]], return false.
73. If temporalTime.[[ISONanosecond]] ≠ other.[[ISONanosecond]], return false.
74. Return true.
    4.3.16 Temporal.PlainTime.prototype.toPlainDateTime ( temporalDate )
    This method performs the following steps when called:

75. Let temporalTime be the this value.
76. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
77. Set temporalDate to ? ToTemporalDate(temporalDate).
78. Return ? CreateTemporalDateTime(temporalDate.[[ISOYear]], temporalDate.[[ISOMonth]], temporalDate.[[ISODay]], temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], temporalDate.[[Calendar]]).
    4.3.17 Temporal.PlainTime.prototype.toZonedDateTime ( item )
    This method performs the following steps when called:

79. Let temporalTime be the this value.
80. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
81. If Type(item) is not Object, then
    a. Throw a TypeError exception.
82. Let temporalDateLike be ? Get(item, "plainDate").
83. If temporalDateLike is undefined, then
    a. Throw a TypeError exception.
84. Let temporalDate be ? ToTemporalDate(temporalDateLike).
85. Let temporalTimeZoneLike be ? Get(item, "timeZone").
86. If temporalTimeZoneLike is undefined, then
    a. Throw a TypeError exception.
87. Let timeZone be ? ToTemporalTimeZoneSlotValue(temporalTimeZoneLike).
88. Let temporalDateTime be ? CreateTemporalDateTime(temporalDate.[[ISOYear]], temporalDate.[[ISOMonth]], temporalDate.[[ISODay]], temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], temporalDate.[[Calendar]]).
89. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
90. Let instant be ? GetInstantFor(timeZoneRec, temporalDateTime, "compatible").
91. Return ! CreateTemporalZonedDateTime(instant.[[Nanoseconds]], timeZone, temporalDate.[[Calendar]]).
    4.3.18 Temporal.PlainTime.prototype.getISOFields ( )
    This method performs the following steps when called:

92. Let temporalTime be the this value.
93. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
94. Let fields be OrdinaryObjectCreate(%Object.prototype%).
95. Perform ! CreateDataPropertyOrThrow(fields, "isoHour", 𝔽(temporalTime.[[ISOHour]])).
96. Perform ! CreateDataPropertyOrThrow(fields, "isoMicrosecond", 𝔽(temporalTime.[[ISOMicrosecond]])).
97. Perform ! CreateDataPropertyOrThrow(fields, "isoMillisecond", 𝔽(temporalTime.[[ISOMillisecond]])).
98. Perform ! CreateDataPropertyOrThrow(fields, "isoMinute", 𝔽(temporalTime.[[ISOMinute]])).
99. Perform ! CreateDataPropertyOrThrow(fields, "isoNanosecond", 𝔽(temporalTime.[[ISONanosecond]])).
100. Perform ! CreateDataPropertyOrThrow(fields, "isoSecond", 𝔽(temporalTime.[[ISOSecond]])).
101. Return fields.
     4.3.19 Temporal.PlainTime.prototype.toString ( [ options ] )
     This method performs the following steps when called:

102. Let temporalTime be the this value.
103. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
104. Set options to ? GetOptionsObject(options).
105. NOTE: The following steps read options and perform independent validation in alphabetical order (ToFractionalSecondDigits reads "fractionalSecondDigits" and ToTemporalRoundingMode reads "roundingMode").
106. Let digits be ? ToFractionalSecondDigits(options).
107. Let roundingMode be ? ToTemporalRoundingMode(options, "trunc").
108. Let smallestUnit be ? GetTemporalUnit(options, "smallestUnit", TIME, undefined).
109. If smallestUnit is "hour", throw a RangeError exception.
110. Let precision be ToSecondsStringPrecisionRecord(smallestUnit, digits).
111. Let roundResult be RoundTime(temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], precision.[[Increment]], precision.[[Unit]], roundingMode).
112. Return ! TemporalTimeToString(roundResult.[[Hour]], roundResult.[[Minute]], roundResult.[[Second]], roundResult.[[Millisecond]], roundResult.[[Microsecond]], roundResult.[[Nanosecond]], precision.[[Precision]]).
     4.3.20 Temporal.PlainTime.prototype.toLocaleString ( [ locales [ , options ] ] )
     An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

This method performs the following steps when called:

1. Let temporalTime be the this value.
2. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
3. Return ! TemporalTimeToString(temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], "auto").
   4.3.21 Temporal.PlainTime.prototype.toJSON ( )
   This method performs the following steps when called:

4. Let temporalTime be the this value.
5. Perform ? RequireInternalSlot(temporalTime, [[InitializedTemporalTime]]).
6. Return ! TemporalTimeToString(temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], "auto").
   4.3.22 Temporal.PlainTime.prototype.valueOf ( )
   This method performs the following steps when called:

7. Throw a TypeError exception.
   NOTE
   This method always throws, because in the absence of valueOf(), expressions with arithmetic operators such as plainTime1 > plainTime2 would fall back to being equivalent to plainTime1.toString() > plainTime2.toString(). Lexicographical comparison of serialized strings might not seem obviously wrong, because the result would sometimes be correct. Implementations are encouraged to phrase the error message to point users to Temporal.PlainTime.compare(), Temporal.PlainTime.prototype.equals(), and/or Temporal.PlainTime.prototype.toString().

4.4 Properties of Temporal.PlainTime Instances
Temporal.PlainTime instances are ordinary objects that inherit properties from the %Temporal.PlainTime.prototype% intrinsic object. Temporal.PlainTime instances are initially created with the internal slots described in Table 3.

Table 3: Internal Slots of Temporal.PlainTime Instances
Internal Slot Description
[[InitializedTemporalTime]] The only specified use of this slot is for distinguishing Temporal.PlainTime instances from other objects.
[[ISOHour]] An integer between 0 and 23, inclusive, representing the hour of the day.
[[ISOMinute]] An integer between 0 and 59, inclusive, representing the minute of the hour.
[[ISOSecond]] An integer between 0 and 59, inclusive, representing the second within the minute.
[[ISOMillisecond]] An integer between 0 and 999, inclusive, representing the millisecond within the second.
[[ISOMicrosecond]] An integer between 0 and 999, inclusive, representing the microsecond within the millisecond.
[[ISONanosecond]] An integer between 0 and 999, inclusive, representing the nanosecond within the microsecond.
4.5 Abstract Operations
4.5.1 Time Records
A Time Record is a Record value used to represent a valid clock time, together with a number of overflow days such as might occur in BalanceTime. For any Time Record t, IsValidTime(t.[[Hour]], t.[[Minute]], t.[[Second]], t.[[Millisecond]], t.[[Microsecond]], t.[[Nanosecond]]) must return true.

Time Records have the fields listed in Table 4.

Table 4: Time Record Fields
Field Name Value Meaning
[[Days]] an integer ≥ 0 A number of overflow days.
[[Hour]] an integer in the inclusive range 0 to 23 The number of the hour.
[[Minute]] an integer in the inclusive range 0 to 59 The number of the minute.
[[Second]] an integer in the inclusive range 0 to 59 The number of the second.
[[Millisecond]] an integer in the inclusive range 0 to 999 The number of the millisecond.
[[Microsecond]] an integer in the inclusive range 0 to 999 The number of the microsecond.
[[Nanosecond]] an integer in the inclusive range 0 to 999 The number of the nanosecond.
4.5.2 DifferenceTime ( h1, min1, s1, ms1, mus1, ns1, h2, min2, s2, ms2, mus2, ns2 )
The abstract operation DifferenceTime takes arguments h1 (an integer between 0 and 23 inclusive), min1 (an integer between 0 and 59 inclusive), s1 (an integer between 0 and 59 inclusive), ms1 (an integer between 0 and 999 inclusive), mus1 (an integer between 0 and 999 inclusive), ns1 (an integer between 0 and 999 inclusive), h2 (an integer between 0 and 23 inclusive), min2 (an integer between 0 and 59 inclusive), s2 (an integer between 0 and 59 inclusive), ms2 (an integer between 0 and 999 inclusive), mus2 (an integer between 0 and 999 inclusive), and ns2 (an integer between 0 and 999 inclusive). It returns a Normalized Time Duration Record with the elapsed duration from a first wall-clock time, until a second wall-clock time. It performs the following steps when called:

1. Let hours be h2 - h1.
2. Let minutes be min2 - min1.
3. Let seconds be s2 - s1.
4. Let milliseconds be ms2 - ms1.
5. Let microseconds be mus2 - mus1.
6. Let nanoseconds be ns2 - ns1.
7. Let norm be NormalizeTimeDuration(hours, minutes, seconds, milliseconds, microseconds, nanoseconds).
8. Assert: NormalizedTimeDurationAbs(norm).[[TotalNanoseconds]] < nsPerDay.
9. Return norm.
   4.5.3 ToTemporalTime ( item [ , overflow ] )
   The abstract operation ToTemporalTime returns its argument item if it is already a Temporal.PlainTime instance, converts item to a new Temporal.PlainTime instance if possible, and throws otherwise.

10. If overflow is not present, set overflow to "constrain".
11. Assert: overflow is either "constrain" or "reject".
12. If Type(item) is Object, then
    a. If item has an [[InitializedTemporalTime]] internal slot, then
    i. Return item.
    b. If item has an [[InitializedTemporalZonedDateTime]] internal slot, then
    i. Let instant be ! CreateTemporalInstant(item.[[Nanoseconds]]).
    ii. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(item.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
    iii. Let plainDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, item.[[Calendar]]).
    iv. Return ! CreateTemporalTime(plainDateTime.[[ISOHour]], plainDateTime.[[ISOMinute]], plainDateTime.[[ISOSecond]], plainDateTime.[[ISOMillisecond]], plainDateTime.[[ISOMicrosecond]], plainDateTime.[[ISONanosecond]]).
    c. If item has an [[InitializedTemporalDateTime]] internal slot, then
    i. Return ! CreateTemporalTime(item.[[ISOHour]], item.[[ISOMinute]], item.[[ISOSecond]], item.[[ISOMillisecond]], item.[[ISOMicrosecond]], item.[[ISONanosecond]]).
    d. Let result be ? ToTemporalTimeRecord(item).
    e. Set result to ? RegulateTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]], overflow).
13. Else,
    a. If item is not a String, throw a TypeError exception.
    b. Let result be ? ParseTemporalTimeString(item).
    c. Assert: IsValidTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]]) is true.
14. Return ! CreateTemporalTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]]).
    4.5.4 ToTemporalTimeOrMidnight ( item )
    The abstract operation ToTemporalTimeOrMidnight takes argument item (an ECMAScript language value) and returns either a normal completion containing a Temporal.PlainTime or a throw completion. It returns its argument item if it is already a Temporal.PlainTime instance, converts item to a new Temporal.PlainTime instance if possible, considering undefined to be the same as midnight, and throws otherwise. It performs the following steps when called:

15. If item is undefined, return ! CreateTemporalTime(0, 0, 0, 0, 0, 0).
16. Return ? ToTemporalTime(item).
    4.5.5 RegulateTime ( hour, minute, second, millisecond, microsecond, nanosecond, overflow )
17. Assert: hour, minute, second, millisecond, microsecond and nanosecond are integers.
18. Assert: overflow is either "constrain" or "reject".
19. If overflow is "constrain", then
    a. Return ! ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond).
20. Else,
    a. Assert: overflow is "reject".
    b. If IsValidTime(hour, minute, second, millisecond, microsecond, nanosecond) is false, throw a RangeError exception.
    c. Return the Record { [[Hour]]: hour, [[Minute]]: minute, [[Second]]: second, [[Millisecond]]: millisecond, [[Microsecond]]: microsecond, [[Nanosecond]]: nanosecond }.
    4.5.6 IsValidTime ( hour, minute, second, millisecond, microsecond, nanosecond )
    The abstract operation IsValidTime takes arguments hour (an integer), minute (an integer), second (an integer), millisecond (an integer), microsecond (an integer), and nanosecond (an integer) and returns a Boolean. The return value is true if its arguments form a valid time of day, and false otherwise. Leap seconds are not taken into account. It performs the following steps when called:

21. If hour < 0 or hour > 23, then
    a. Return false.
22. If minute < 0 or minute > 59, then
    a. Return false.
23. If second < 0 or second > 59, then
    a. Return false.
24. If millisecond < 0 or millisecond > 999, then
    a. Return false.
25. If microsecond < 0 or microsecond > 999, then
    a. Return false.
26. If nanosecond < 0 or nanosecond > 999, then
    a. Return false.
27. Return true.
    4.5.7 BalanceTime ( hour, minute, second, millisecond, microsecond, nanosecond )
    The abstract operation BalanceTime takes arguments hour (an integer), minute (an integer), second (an integer), millisecond (an integer), microsecond (an integer), and nanosecond (an integer) and returns a Time Record. It performs the following steps when called:

28. Set microsecond to microsecond + floor(nanosecond / 1000).
29. Set nanosecond to nanosecond modulo 1000.
30. Set millisecond to millisecond + floor(microsecond / 1000).
31. Set microsecond to microsecond modulo 1000.
32. Set second to second + floor(millisecond / 1000).
33. Set millisecond to millisecond modulo 1000.
34. Set minute to minute + floor(second / 60).
35. Set second to second modulo 60.
36. Set hour to hour + floor(minute / 60).
37. Set minute to minute modulo 60.
38. Let days be floor(hour / 24).
39. Set hour to hour modulo 24.
40. Return the Record { [[Days]]: days, [[Hour]]: hour, [[Minute]]: minute, [[Second]]: second, [[Millisecond]]: millisecond, [[Microsecond]]: microsecond, [[Nanosecond]]: nanosecond }.
    4.5.8 ConstrainTime ( hour, minute, second, millisecond, microsecond, nanosecond )
41. Assert: hour, minute, second, millisecond, microsecond, and nanosecond are integers.
42. Set hour to the result of clamping hour between 0 and 23.
43. Set minute to the result of clamping minute between 0 and 59.
44. Set second to the result of clamping second between 0 and 59.
45. Set millisecond to the result of clamping millisecond between 0 and 999.
46. Set microsecond to the result of clamping microsecond between 0 and 999.
47. Set nanosecond to the result of clamping nanosecond between 0 and 999.
48. Return the Record { [[Hour]]: hour, [[Minute]]: minute, [[Second]]: second, [[Millisecond]]: millisecond, [[Microsecond]]: microsecond, [[Nanosecond]]: nanosecond }.
    4.5.9 CreateTemporalTime ( hour, minute, second, millisecond, microsecond, nanosecond [ , newTarget ] )
    The abstract operation CreateTemporalTime takes arguments hour (an integer), minute (an integer), second (an integer), millisecond (an integer), microsecond (an integer), and nanosecond (an integer) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.PlainTime, or an abrupt completion. It creates a new Temporal.PlainTime instance and fills the internal slots with valid values. It performs the following steps when called:

49. If IsValidTime(hour, minute, second, millisecond, microsecond, nanosecond) is false, throw a RangeError exception.
50. If newTarget is not present, set newTarget to %Temporal.PlainTime%.
51. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.PlainTime.prototype%", « [[InitializedTemporalTime]], [[ISOHour]], [[ISOMinute]], [[ISOSecond]], [[ISOMillisecond]], [[ISOMicrosecond]], [[ISONanosecond]] »).
52. Set object.[[ISOHour]] to hour.
53. Set object.[[ISOMinute]] to minute.
54. Set object.[[ISOSecond]] to second.
55. Set object.[[ISOMillisecond]] to millisecond.
56. Set object.[[ISOMicrosecond]] to microsecond.
57. Set object.[[ISONanosecond]] to nanosecond.
58. Return object.
    4.5.10 ToTemporalTimeRecord ( temporalTimeLike [ , completeness ] )
    The abstract operation ToTemporalTimeRecord takes argument temporalTimeLike (an Object) and optional argument completeness (PARTIAL or COMPLETE) and returns either a normal completion containing a TemporalTimeLike Record, or an abrupt completion. It performs the following steps when called:

59. If completeness is not present, set completeness to COMPLETE.
60. Let partial be ? PrepareTemporalFields(temporalTimeLike, « "hour", "microsecond", "millisecond", "minute", "nanosecond", "second" », PARTIAL).
61. If completeness is COMPLETE, then
    a. Let result be a new TemporalTimeLike Record with each field set to 0.
62. Else,
    a. Let result be a new TemporalTimeLike Record with each field set to undefined.
63. Let hourDesc be OrdinaryGetOwnProperty(partial, "hour").
64. If hourDesc is not undefined, then
    a. Assert: hourDesc is a data Property Descriptor.
    b. Set result.[[Hour]] to ℝ(hourDesc.[[Value]]).
65. Let minuteDesc be OrdinaryGetOwnProperty(partial, "minute").
66. If minuteDesc is not undefined, then
    a. Assert: minuteDesc is a data Property Descriptor.
    b. Set result.[[Minute]] to ℝ(minuteDesc.[[Value]]).
67. Let secondDesc be OrdinaryGetOwnProperty(partial, "second").
68. If secondDesc is not undefined, then
    a. Assert: secondDesc is a data Property Descriptor.
    b. Set result.[[Second]] to ℝ(secondDesc.[[Value]]).
69. Let millisecondDesc be OrdinaryGetOwnProperty(partial, "millisecond").
70. If millisecondDesc is not undefined, then
    a. Assert: millisecondDesc is a data Property Descriptor.
    b. Set result.[[Millisecond]] to ℝ(millisecondDesc.[[Value]]).
71. Let microsecondDesc be OrdinaryGetOwnProperty(partial, "microsecond").
72. If microsecondDesc is not undefined, then
    a. Assert: microsecondDesc is a data Property Descriptor.
    b. Set result.[[Microsecond]] to ℝ(microsecondDesc.[[Value]]).
73. Let nanosecondDesc be OrdinaryGetOwnProperty(partial, "nanosecond").
74. If nanosecondDesc is not undefined, then
    a. Assert: nanosecondDesc is a data Property Descriptor.
    b. Set result.[[Nanosecond]] to ℝ(nanosecondDesc.[[Value]]).
75. Return result.
    Table 5: TemporalTimeLike Record Fields
    Field Name Property Name
    [[Hour]] "hour"
    [[Minute]] "minute"
    [[Second]] "second"
    [[Millisecond]] "millisecond"
    [[Microsecond]] "microsecond"
    [[Nanosecond]] "nanosecond"
    4.5.11 TemporalTimeToString ( hour, minute, second, millisecond, microsecond, nanosecond, precision )
76. Assert: hour, minute, second, millisecond, microsecond and nanosecond are integers.
77. Let subSecondNanoseconds be millisecond × 10**6 + microsecond × 10**3 + nanosecond.
78. Return FormatTimeString(hour, minute, second, subSecondNanoseconds, precision).
    4.5.12 CompareTemporalTime ( h1, min1, s1, ms1, mus1, ns1, h2, min2, s2, ms2, mus2, ns2 )
79. Assert: h1, min1, s1, ms1, mus1, ns1, h2, min2, s2, ms2, mus2, and ns2 are integers.
80. If h1 > h2, return 1.
81. If h1 < h2, return -1.
82. If min1 > min2, return 1.
83. If min1 < min2, return -1.
84. If s1 > s2, return 1.
85. If s1 < s2, return -1.
86. If ms1 > ms2, return 1.
87. If ms1 < ms2, return -1.
88. If mus1 > mus2, return 1.
89. If mus1 < mus2, return -1.
90. If ns1 > ns2, return 1.
91. If ns1 < ns2, return -1.
92. Return 0.
    4.5.13 AddTime ( hour, minute, second, millisecond, microsecond, nanosecond, norm )
    The abstract operation AddTime takes arguments hour (an integer in the inclusive range 0 to 23), minute (an integer in the inclusive range 0 to 59), second (an integer in the inclusive range 0 to 59), millisecond (an integer in the inclusive range 0 to 999), microsecond (an integer in the inclusive range 0 to 999), nanosecond (an integer in the inclusive range 0 to 999), and norm (a Normalized Time Duration Record) and returns a Time Record. It performs the following steps when called:

93. Set second to second + NormalizedTimeDurationSeconds(norm).
94. Set nanosecond to nanosecond + NormalizedTimeDurationSubseconds(norm).
95. Return BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond).
    4.5.14 RoundTime ( hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode [ , dayLengthNs ] )
    The abstract operation RoundTime takes arguments hour (an integer in the inclusive range 0 to 23), minute (an integer in the inclusive range 0 to 59), second (an integer in the inclusive range 0 to 59), millisecond (an integer in the inclusive range 0 to 999), microsecond (an integer in the inclusive range 0 to 999), nanosecond (an integer in the inclusive range 0 to 999), increment (an integer), unit ("day", "hour", "minute", "second", "millisecond", "microsecond", or "nanosecond"), and roundingMode (a String from the Identifier column of Table 19) and optional argument dayLengthNs (an integer) and returns a Time Record. It rounds a time to the given increment, optionally adjusting for a non-24-hour day. It performs the following steps when called:

96. Let fractionalSecond be nanosecond × 10**-9 + microsecond × 10**-6 + millisecond × 10\*\*-3 + second.
97. If unit is "day", then
    a. If dayLengthNs is not present, set dayLengthNs to nsPerDay.
    b. Let quantity be (((((hour × 60 + minute) × 60 + second) × 1000 + millisecond) × 1000 + microsecond) × 1000 + nanosecond) / dayLengthNs.
98. Else if unit is "hour", then
    a. Let quantity be (fractionalSecond / 60 + minute) / 60 + hour.
99. Else if unit is "minute", then
    a. Let quantity be fractionalSecond / 60 + minute.
100. Else if unit is "second", then
     a. Let quantity be fractionalSecond.
101. Else if unit is "millisecond", then
     a. Let quantity be nanosecond × 10**-6 + microsecond × 10**-3 + millisecond.
102. Else if unit is "microsecond", then
     a. Let quantity be nanosecond × 10\*\*-3 + microsecond.
103. Else,
     a. Assert: unit is "nanosecond".
     b. Let quantity be nanosecond.
104. Let result be RoundNumberToIncrement(quantity, increment, roundingMode).
105. If unit is "day", then
     a. Return the Record { [[Days]]: result, [[Hour]]: 0, [[Minute]]: 0, [[Second]]: 0, [[Millisecond]]: 0, [[Microsecond]]: 0, [[Nanosecond]]: 0 }.
106. If unit is "hour", then
     a. Return BalanceTime(result, 0, 0, 0, 0, 0).
107. If unit is "minute", then
     a. Return BalanceTime(hour, result, 0, 0, 0, 0).
108. If unit is "second", then
     a. Return BalanceTime(hour, minute, result, 0, 0, 0).
109. If unit is "millisecond", then
     a. Return BalanceTime(hour, minute, second, result, 0, 0).
110. If unit is "microsecond", then
     a. Return BalanceTime(hour, minute, second, millisecond, result, 0).
111. Assert: unit is "nanosecond".
112. Return BalanceTime(hour, minute, second, millisecond, microsecond, result).
     4.5.15 DifferenceTemporalPlainTime ( operation, temporalTime, other, options )
     The abstract operation DifferenceTemporalPlainTime takes arguments operation (SINCE or UNTIL), temporalTime (a Temporal.PlainTime), other (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.Duration or an abrupt completion. It computes the difference between the two times represented by temporalTime and other, optionally rounds it, and returns it as a Temporal.Duration object. It performs the following steps when called:

113. If operation is SINCE, let sign be -1. Otherwise, let sign be 1.
114. Set other to ? ToTemporalTime(other).
115. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
116. Let settings be ? GetDifferenceSettings(operation, resolvedOptions, TIME, « », "nanosecond", "hour").
117. Let norm be ! DifferenceTime(temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], other.[[ISOHour]], other.[[ISOMinute]], other.[[ISOSecond]], other.[[ISOMillisecond]], other.[[ISOMicrosecond]], other.[[ISONanosecond]]).
118. If settings.[[SmallestUnit]] is not "nanosecond" or settings.[[RoundingIncrement]] ≠ 1, then
     a. Let roundRecord be ! RoundDuration(0, 0, 0, 0, norm, settings.[[RoundingIncrement]], settings.[[SmallestUnit]], settings.[[RoundingMode]]).
     b. Set norm to roundRecord.[[NormalizedDuration]].[[NormalizedTime]].
119. Let result be BalanceTimeDuration(norm, settings.[[LargestUnit]]).
120. Return ! CreateTemporalDuration(0, 0, 0, 0, sign × result.[[Hours]], sign × result.[[Minutes]], sign × result.[[Seconds]], sign × result.[[Milliseconds]], sign × result.[[Microseconds]], sign × result.[[Nanoseconds]]).
     4.5.16 AddDurationToOrSubtractDurationFromPlainTime ( operation, temporalTime, temporalDurationLike )
     The abstract operation AddDurationToOrSubtractDurationFromPlainTime takes arguments operation (ADD or SUBTRACT), temporalTime (a Temporal.PlainTime), and temporalDurationLike (an ECMAScript language value) and returns either a normal completion containing a Temporal.PlainTime or an abrupt completion. It adds/subtracts temporalDurationLike to/from temporalTime, returning a point in time that is in the future/past relative to temporalTime. It performs the following steps when called:

121. If operation is SUBTRACT, let sign be -1. Otherwise, let sign be 1.
122. Let duration be ? ToTemporalDurationRecord(temporalDurationLike).
123. Let norm be NormalizeTimeDuration(sign × duration.[[Hours]], sign × duration.[[Minutes]], sign × duration.[[Seconds]], sign × duration.[[Milliseconds]], sign × duration.[[Microseconds]], sign × duration.[[Nanoseconds]]).
124. Let result be AddTime(temporalTime.[[ISOHour]], temporalTime.[[ISOMinute]], temporalTime.[[ISOSecond]], temporalTime.[[ISOMillisecond]], temporalTime.[[ISOMicrosecond]], temporalTime.[[ISONanosecond]], norm).
125. Return ! CreateTemporalTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]]).
     5 Temporal.PlainDateTime Objects
     A Temporal.PlainDateTime object is an Object that contains integers corresponding to a particular year, month, day, hour, minute, second, millisecond, microsecond, and nanosecond.

5.1 The Temporal.PlainDateTime Constructor
The Temporal.PlainDateTime constructor:

creates and initializes a new Temporal.PlainDateTime object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.PlainDateTime behaviour must include a super call to the %Temporal.PlainDateTime% constructor to create and initialize subclass instances with the necessary internal slots.
5.1.1 Temporal.PlainDateTime ( isoYear, isoMonth, isoDay [ , hour [ , minute [ , second [ , millisecond [ , microsecond [ , nanosecond [ , calendarLike ] ] ] ] ] ] ] )
This function performs the following steps when called:

1. If NewTarget is undefined, then
   a. Throw a TypeError exception.
2. Set isoYear to ? ToIntegerWithTruncation(isoYear).
3. Set isoMonth to ? ToIntegerWithTruncation(isoMonth).
4. Set isoDay to ? ToIntegerWithTruncation(isoDay).
5. If hour is undefined, set hour to 0; else set hour to ? ToIntegerWithTruncation(hour).
6. If minute is undefined, set minute to 0; else set minute to ? ToIntegerWithTruncation(minute).
7. If second is undefined, set second to 0; else set second to ? ToIntegerWithTruncation(second).
8. If millisecond is undefined, set millisecond to 0; else set millisecond to ? ToIntegerWithTruncation(millisecond).
9. If microsecond is undefined, set microsecond to 0; else set microsecond to ? ToIntegerWithTruncation(microsecond).
10. If nanosecond is undefined, set nanosecond to 0; else set nanosecond to ? ToIntegerWithTruncation(nanosecond).
11. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike, "iso8601").
12. Return ? CreateTemporalDateTime(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, calendar, NewTarget).
    5.2 Properties of the Temporal.PlainDateTime Constructor
    The value of the [[Prototype]] internal slot of the Temporal.PlainDateTime constructor is the intrinsic object %Function.prototype%.

The Temporal.PlainDateTime constructor has the following properties:

5.2.1 Temporal.PlainDateTime.prototype
The initial value of Temporal.PlainDateTime.prototype is %Temporal.PlainDateTime.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

5.2.2 Temporal.PlainDateTime.from ( item [ , options ] )
This function performs the following steps when called:

1. Set options to ? GetOptionsObject(options).
2. If Type(item) is Object and item has an [[InitializedTemporalDateTime]] internal slot, then
   a. Perform ? ToTemporalOverflow(options).
   b. Return ! CreateTemporalDateTime(item.[[ISOYear]], item.[[ISOMonth]], item.[[ISODay]], item.[[ISOHour]], item.[[ISOMinute]], item.[[ISOSecond]], item.[[ISOMillisecond]], item.[[ISOMicrosecond]], item.[[ISONanosecond]], item.[[Calendar]]).
3. Return ? ToTemporalDateTime(item, options).
   5.2.3 Temporal.PlainDateTime.compare ( one, two )
   This function performs the following steps when called:

4. Set one to ? ToTemporalDateTime(one).
5. Set two to ? ToTemporalDateTime(two).
6. Return 𝔽(! CompareISODateTime(one.[[ISOYear]], one.[[ISOMonth]], one.[[ISODay]], one.[[ISOHour]], one.[[ISOMinute]], one.[[ISOSecond]], one.[[ISOMillisecond]], one.[[ISOMicrosecond]], one.[[ISONanosecond]], two.[[ISOYear]], two.[[ISOMonth]], two.[[ISODay]], two.[[ISOHour]], two.[[ISOMinute]], two.[[ISOSecond]], two.[[ISOMillisecond]], two.[[ISOMicrosecond]], two.[[ISONanosecond]])).
   5.3 Properties of the Temporal.PlainDateTime Prototype Object
   The Temporal.PlainDateTime prototype object

is the intrinsic object %Temporal.PlainDateTime.prototype%.
is itself an ordinary object.
is not a Temporal.PlainDateTime instance and does not have a [[InitializedTemporalDateTime]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
NOTE
An ECMAScript implementation that includes the ECMA-402 Internationalization API extends this prototype with additional properties in order to represent calendar data.
5.3.1 Temporal.PlainDateTime.prototype.constructor
The initial value of Temporal.PlainDateTime.prototype.constructor is %Temporal.PlainDateTime%.

5.3.2 Temporal.PlainDateTime.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.PlainDateTime".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

5.3.3 get Temporal.PlainDateTime.prototype.calendarId
Temporal.PlainDateTime.prototype.calendarId is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let dateTime be the this value.
2. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
3. Return ? ToTemporalCalendarIdentifier(dateTime.[[Calendar]]).
   5.3.4 get Temporal.PlainDateTime.prototype.year
   Temporal.PlainDateTime.prototype.year is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

4. Let dateTime be the this value.
5. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
6. Let calendar be dateTime.[[Calendar]].
7. Return 𝔽(? CalendarYear(calendar, dateTime)).
   5.3.5 get Temporal.PlainDateTime.prototype.month
   Temporal.PlainDateTime.prototype.month is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

8. Let dateTime be the this value.
9. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
10. Let calendar be dateTime.[[Calendar]].
11. Return 𝔽(? CalendarMonth(calendar, dateTime)).
    5.3.6 get Temporal.PlainDateTime.prototype.monthCode
    Temporal.PlainDateTime.prototype.monthCode is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

12. Let dateTime be the this value.
13. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
14. Let calendar be dateTime.[[Calendar]].
15. Return ? CalendarMonthCode(calendar, dateTime).
    5.3.7 get Temporal.PlainDateTime.prototype.day
    Temporal.PlainDateTime.prototype.day is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

16. Let dateTime be the this value.
17. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
18. Let calendarRec be ? CreateCalendarMethodsRecord(dateTime.[[Calendar]], « DAY »).
19. Return 𝔽(? CalendarDay(calendarRec, dateTime)).
    5.3.8 get Temporal.PlainDateTime.prototype.hour
    Temporal.PlainDateTime.prototype.hour is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

20. Let dateTime be the this value.
21. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
22. Return 𝔽(dateTime.[[ISOHour]]).
    5.3.9 get Temporal.PlainDateTime.prototype.minute
    Temporal.PlainDateTime.prototype.minute is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

23. Let dateTime be the this value.
24. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
25. Return 𝔽(dateTime.[[ISOMinute]]).
    5.3.10 get Temporal.PlainDateTime.prototype.second
    Temporal.PlainDateTime.prototype.second is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

26. Let dateTime be the this value.
27. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
28. Return 𝔽(dateTime.[[ISOSecond]]).
    5.3.11 get Temporal.PlainDateTime.prototype.millisecond
    Temporal.PlainDateTime.prototype.millisecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

29. Let dateTime be the this value.
30. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
31. Return 𝔽(dateTime.[[ISOMillisecond]]).
    5.3.12 get Temporal.PlainDateTime.prototype.microsecond
    Temporal.PlainDateTime.prototype.microsecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

32. Let dateTime be the this value.
33. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
34. Return 𝔽(dateTime.[[ISOMicrosecond]]).
    5.3.13 get Temporal.PlainDateTime.prototype.nanosecond
    Temporal.PlainDateTime.prototype.nanosecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

35. Let dateTime be the this value.
36. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
37. Return 𝔽(dateTime.[[ISONanosecond]]).
    5.3.14 get Temporal.PlainDateTime.prototype.dayOfWeek
    Temporal.PlainDateTime.prototype.dayOfWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

38. Let dateTime be the this value.
39. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
40. Let calendar be dateTime.[[Calendar]].
41. Return 𝔽(? CalendarDayOfWeek(calendar, dateTime)).
    5.3.15 get Temporal.PlainDateTime.prototype.dayOfYear
    Temporal.PlainDateTime.prototype.dayOfYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

42. Let dateTime be the this value.
43. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
44. Let calendar be dateTime.[[Calendar]].
45. Return 𝔽(? CalendarDayOfYear(calendar, dateTime)).
    5.3.16 get Temporal.PlainDateTime.prototype.weekOfYear
    Temporal.PlainDateTime.prototype.weekOfYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

46. Let dateTime be the this value.
47. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
48. Let calendar be dateTime.[[Calendar]].
49. Return 𝔽(? CalendarWeekOfYear(calendar, dateTime)).
    5.3.17 get Temporal.PlainDateTime.prototype.yearOfWeek
    Temporal.PlainDateTime.prototype.yearOfWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

50. Let dateTime be the this value.
51. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
52. Let calendar be dateTime.[[Calendar]].
53. Return 𝔽(? CalendarYearOfWeek(calendar, dateTime)).
    5.3.18 get Temporal.PlainDateTime.prototype.daysInWeek
    Temporal.PlainDateTime.prototype.daysInWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

54. Let dateTime be the this value.
55. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
56. Let calendar be dateTime.[[Calendar]].
57. Return 𝔽(? CalendarDaysInWeek(calendar, dateTime)).
    5.3.19 get Temporal.PlainDateTime.prototype.daysInMonth
    Temporal.PlainDateTime.prototype.daysInMonth is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

58. Let dateTime be the this value.
59. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
60. Let calendar be dateTime.[[Calendar]].
61. Return 𝔽(? CalendarDaysInMonth(calendar, dateTime)).
    5.3.20 get Temporal.PlainDateTime.prototype.daysInYear
    Temporal.PlainDateTime.prototype.daysInYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

62. Let dateTime be the this value.
63. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
64. Let calendar be dateTime.[[Calendar]].
65. Return 𝔽(? CalendarDaysInYear(calendar, dateTime)).
    5.3.21 get Temporal.PlainDateTime.prototype.monthsInYear
    Temporal.PlainDateTime.prototype.monthsInYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

66. Let dateTime be the this value.
67. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
68. Let calendar be dateTime.[[Calendar]].
69. Return 𝔽(? CalendarMonthsInYear(calendar, dateTime)).
    5.3.22 get Temporal.PlainDateTime.prototype.inLeapYear
    Temporal.PlainDateTime.prototype.inLeapYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

70. Let dateTime be the this value.
71. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
72. Let calendar be dateTime.[[Calendar]].
73. Return ? CalendarInLeapYear(calendar, dateTime).
    5.3.23 Temporal.PlainDateTime.prototype.with ( temporalDateTimeLike [ , options ] )
    This method performs the following steps when called:

74. Let dateTime be the this value.
75. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
76. If ? IsPartialTemporalObject(temporalDateTimeLike) is false, throw a TypeError exception.
77. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
78. Let calendarRec be ? CreateCalendarMethodsRecord(dateTime.[[Calendar]], « DATE-FROM-FIELDS, FIELDS, MERGE-FIELDS »).
79. Let fieldNames be ? CalendarFields(calendarRec, « "day", "month", "monthCode", "year" »).
80. Let fields be ? PrepareTemporalFields(dateTime, fieldNames, «»).
81. Perform ! CreateDataPropertyOrThrow(fields, "hour", dateTime.[[ISOHour]]).
82. Perform ! CreateDataPropertyOrThrow(fields, "minute", dateTime.[[ISOMinute]]).
83. Perform ! CreateDataPropertyOrThrow(fields, "second", dateTime.[[ISOSecond]]).
84. Perform ! CreateDataPropertyOrThrow(fields, "millisecond", dateTime.[[ISOMillisecond]]).
85. Perform ! CreateDataPropertyOrThrow(fields, "microsecond", dateTime.[[ISOMicrosecond]]).
86. Perform ! CreateDataPropertyOrThrow(fields, "nanosecond", dateTime.[[ISONanosecond]]).
87. Append "hour", "microsecond", "millisecond", "minute", "nanosecond", and "second" to fieldNames.
88. Let partialDateTime be ? PrepareTemporalFields(temporalDateTimeLike, fieldNames, PARTIAL).
89. Set fields to ? CalendarMergeFields(calendarRec, fields, partialDateTime).
90. Set fields to ? PrepareTemporalFields(fields, fieldNames, «»).
91. Let result be ? InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions).
92. Assert: IsValidISODate(result.[[Year]], result.[[Month]], result.[[Day]]) is true.
93. Assert: IsValidTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]]) is true.
94. Return ? CreateTemporalDateTime(result.[[Year]], result.[[Month]], result.[[Day]], result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]], calendarRec.[[Receiver]]).
    5.3.24 Temporal.PlainDateTime.prototype.withPlainTime ( [ plainTimeLike ] )
    This method performs the following steps when called:

95. Let dateTime be the this value.
96. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
97. Let plainTime be ? ToTemporalTimeOrMidnight(plainTimeLike).
98. Return ? CreateTemporalDateTime(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], plainTime.[[ISOHour]], plainTime.[[ISOMinute]], plainTime.[[ISOSecond]], plainTime.[[ISOMillisecond]], plainTime.[[ISOMicrosecond]], plainTime.[[ISONanosecond]], dateTime.[[Calendar]]).
    5.3.25 Temporal.PlainDateTime.prototype.withPlainDate ( plainDateLike )
    This method performs the following steps when called:

99. Let dateTime be the this value.
100. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
101. Let plainDate be ? ToTemporalDate(plainDateLike).
102. Let calendar be ? ConsolidateCalendars(dateTime.[[Calendar]], plainDate.[[Calendar]]).
103. Return ? CreateTemporalDateTime(plainDate.[[ISOYear]], plainDate.[[ISOMonth]], plainDate.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], calendar).
     5.3.26 Temporal.PlainDateTime.prototype.withCalendar ( calendarLike )
     This method performs the following steps when called:

104. Let dateTime be the this value.
105. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
106. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike).
107. Return ? CreateTemporalDateTime(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], calendar).
     5.3.27 Temporal.PlainDateTime.prototype.add ( temporalDurationLike [ , options ] )
     This method performs the following steps when called:

108. Let dateTime be the this value.
109. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
110. Return ? AddDurationToOrSubtractDurationFromPlainDateTime(ADD, dateTime, temporalDurationLike, options).
     5.3.28 Temporal.PlainDateTime.prototype.subtract ( temporalDurationLike [ , options ] )
     This method performs the following steps when called:

111. Let dateTime be the this value.
112. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
113. Return ? AddDurationToOrSubtractDurationFromPlainDateTime(SUBTRACT, dateTime, temporalDurationLike, options).
     5.3.29 Temporal.PlainDateTime.prototype.until ( other [ , options ] )
     This method performs the following steps when called:

114. Let dateTime be the this value.
115. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
116. Return ? DifferenceTemporalPlainDateTime(UNTIL, dateTime, other, options).
     5.3.30 Temporal.PlainDateTime.prototype.since ( other [ , options ] )
     This method performs the following steps when called:

117. Let dateTime be the this value.
118. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
119. Return ? DifferenceTemporalPlainDateTime(SINCE, dateTime, other, options).
     5.3.31 Temporal.PlainDateTime.prototype.round ( roundTo )
     This method performs the following steps when called:

120. Let dateTime be the this value.
121. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
122. If roundTo is undefined, then
     a. Throw a TypeError exception.
123. If Type(roundTo) is String, then
     a. Let paramString be roundTo.
     b. Set roundTo to OrdinaryObjectCreate(null).
     c. Perform ! CreateDataPropertyOrThrow(roundTo, "smallestUnit", paramString).
124. Else,
     a. Set roundTo to ? GetOptionsObject(roundTo).
125. NOTE: The following steps read options and perform independent validation in alphabetical order (ToTemporalRoundingIncrement reads "roundingIncrement" and ToTemporalRoundingMode reads "roundingMode").
126. Let roundingIncrement be ? ToTemporalRoundingIncrement(roundTo).
127. Let roundingMode be ? ToTemporalRoundingMode(roundTo, "halfExpand").
128. Let smallestUnit be ? GetTemporalUnit(roundTo, "smallestUnit", TIME, REQUIRED, « "day" »).
129. If smallestUnit is "day", then
     a. Let maximum be 1.
     b. Let inclusive be true.
130. Else,
     a. Let maximum be MaximumTemporalDurationRoundingIncrement(smallestUnit).
     b. Assert: maximum is not undefined.
     c. Let inclusive be false.
131. Perform ? ValidateTemporalRoundingIncrement(roundingIncrement, maximum, inclusive).
132. If smallestUnit is "nanosecond" and roundingIncrement is 1, then
     a. Return ! CreateTemporalDateTime(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], dateTime.[[Calendar]]).
133. Let result be RoundISODateTime(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], roundingIncrement, smallestUnit, roundingMode).
134. Return ? CreateTemporalDateTime(result.[[Year]], result.[[Month]], result.[[Day]], result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]], dateTime.[[Calendar]]).
     5.3.32 Temporal.PlainDateTime.prototype.equals ( other )
     This method performs the following steps when called:

135. Let dateTime be the this value.
136. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
137. Set other to ? ToTemporalDateTime(other).
138. Let result be ! CompareISODateTime(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], other.[[ISOYear]], other.[[ISOMonth]], other.[[ISODay]], other.[[ISOHour]], other.[[ISOMinute]], other.[[ISOSecond]], other.[[ISOMillisecond]], other.[[ISOMicrosecond]], other.[[ISONanosecond]]).
139. If result is not 0, return false.
140. Return ? CalendarEquals(dateTime.[[Calendar]], other.[[Calendar]]).
     5.3.33 Temporal.PlainDateTime.prototype.toString ( [ options ] )
     This method performs the following steps when called:

141. Let dateTime be the this value.
142. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
143. Set options to ? GetOptionsObject(options).
144. NOTE: The following steps read options and perform independent validation in alphabetical order (ToCalendarNameOption reads "calendarName", ToFractionalSecondDigits reads "fractionalSecondDigits", and ToTemporalRoundingMode reads "roundingMode").
145. Let showCalendar be ? ToCalendarNameOption(options).
146. Let digits be ? ToFractionalSecondDigits(options).
147. Let roundingMode be ? ToTemporalRoundingMode(options, "trunc").
148. Let smallestUnit be ? GetTemporalUnit(options, "smallestUnit", TIME, undefined).
149. If smallestUnit is "hour", throw a RangeError exception.
150. Let precision be ToSecondsStringPrecisionRecord(smallestUnit, digits).
151. Let result be RoundISODateTime(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], precision.[[Increment]], precision.[[Unit]], roundingMode).
152. Return ? TemporalDateTimeToString(result.[[Year]], result.[[Month]], result.[[Day]], result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]], dateTime.[[Calendar]], precision.[[Precision]], showCalendar).
     5.3.34 Temporal.PlainDateTime.prototype.toLocaleString ( [ locales [ , options ] ] )
     An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

This method performs the following steps when called:

1. Let dateTime be the this value.
2. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
3. Return ? TemporalDateTimeToString(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], dateTime.[[Calendar]], "auto", "auto").
   5.3.35 Temporal.PlainDateTime.prototype.toJSON ( )
   This method performs the following steps when called:

4. Let dateTime be the this value.
5. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
6. Return ? TemporalDateTimeToString(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], dateTime.[[Calendar]], "auto", "auto").
   5.3.36 Temporal.PlainDateTime.prototype.valueOf ( )
   This method performs the following steps when called:

7. Throw a TypeError exception.
   NOTE
   This method always throws, because in the absence of valueOf(), expressions with arithmetic operators such as plainDateTime1 > plainDateTime2 would fall back to being equivalent to plainDateTime1.toString() > plainDateTime2.toString(). Lexicographical comparison of serialized strings might not seem obviously wrong, because the result would sometimes be correct. Implementations are encouraged to phrase the error message to point users to Temporal.PlainDateTime.compare(), Temporal.PlainDateTime.prototype.equals(), and/or Temporal.PlainDateTime.prototype.toString().

5.3.37 Temporal.PlainDateTime.prototype.toZonedDateTime ( temporalTimeZoneLike [ , options ] )
This method performs the following steps when called:

1. Let dateTime be the this value.
2. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
3. Let timeZone be ? ToTemporalTimeZoneSlotValue(temporalTimeZoneLike).
4. Set options to ? GetOptionsObject(options).
5. Let disambiguation be ? ToTemporalDisambiguation(options).
6. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
7. Let instant be ? GetInstantFor(timeZoneRec, dateTime, disambiguation).
8. Return ! CreateTemporalZonedDateTime(instant.[[Nanoseconds]], timeZone, dateTime.[[Calendar]]).
   5.3.38 Temporal.PlainDateTime.prototype.toPlainDate ( )
   This method performs the following steps when called:

9. Let dateTime be the this value.
10. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
11. Return ! CreateTemporalDate(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[Calendar]]).
    5.3.39 Temporal.PlainDateTime.prototype.toPlainYearMonth ( )
    This method performs the following steps when called:

12. Let dateTime be the this value.
13. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
14. Let calendarRec be ? CreateCalendarMethodsRecord(dateTime.[[Calendar]], « FIELDS, YEAR-MONTH-FROM-FIELDS »).
15. Let fieldNames be ? CalendarFields(calendarRec, « "monthCode", "year" »).
16. Let fields be ? PrepareTemporalFields(dateTime, fieldNames, «»).
17. Return ? CalendarYearMonthFromFields(calendarRec, fields).
18. NOTE: The call to CalendarYearMonthFromFields is necessary in order to create a PlainYearMonth object with the [[ISOYear]], [[ISOMonth]], and [[ISODay]] internal slots set correctly.
    5.3.40 Temporal.PlainDateTime.prototype.toPlainMonthDay ( )
    This method performs the following steps when called:

19. Let dateTime be the this value.
20. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
21. Let calendarRec be ? CreateCalendarMethodsRecord(dateTime.[[Calendar]], « FIELDS, MONTH-DAY-FROM-FIELDS »).
22. Let fieldNames be ? CalendarFields(calendarRec, « "day", "monthCode" »).
23. Let fields be ? PrepareTemporalFields(dateTime, fieldNames, «»).
24. Return ? CalendarMonthDayFromFields(calendarRec, fields).
25. NOTE: The call to CalendarMonthDayFromFields is necessary in order to create a PlainMonthDay object with the [[ISOYear]], [[ISOMonth]], and [[ISODay]] internal slots set correctly.
    5.3.41 Temporal.PlainDateTime.prototype.toPlainTime ( )
    This method performs the following steps when called:

26. Let dateTime be the this value.
27. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
28. Return ! CreateTemporalTime(dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]]).
    5.3.42 Temporal.PlainDateTime.prototype.getISOFields ( )
    This method performs the following steps when called:

29. Let dateTime be the this value.
30. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
31. Let fields be OrdinaryObjectCreate(%Object.prototype%).
32. Perform ! CreateDataPropertyOrThrow(fields, "calendar", dateTime.[[Calendar]]).
33. Perform ! CreateDataPropertyOrThrow(fields, "isoDay", 𝔽(dateTime.[[ISODay]])).
34. Perform ! CreateDataPropertyOrThrow(fields, "isoHour", 𝔽(dateTime.[[ISOHour]])).
35. Perform ! CreateDataPropertyOrThrow(fields, "isoMicrosecond", 𝔽(dateTime.[[ISOMicrosecond]])).
36. Perform ! CreateDataPropertyOrThrow(fields, "isoMillisecond", 𝔽(dateTime.[[ISOMillisecond]])).
37. Perform ! CreateDataPropertyOrThrow(fields, "isoMinute", 𝔽(dateTime.[[ISOMinute]])).
38. Perform ! CreateDataPropertyOrThrow(fields, "isoMonth", 𝔽(dateTime.[[ISOMonth]])).
39. Perform ! CreateDataPropertyOrThrow(fields, "isoNanosecond", 𝔽(dateTime.[[ISONanosecond]])).
40. Perform ! CreateDataPropertyOrThrow(fields, "isoSecond", 𝔽(dateTime.[[ISOSecond]])).
41. Perform ! CreateDataPropertyOrThrow(fields, "isoYear", 𝔽(dateTime.[[ISOYear]])).
42. Return fields.
    5.3.43 Temporal.PlainDateTime.prototype.getCalendar ( )
    This method performs the following steps when called:

43. Let dateTime be the this value.
44. Perform ? RequireInternalSlot(dateTime, [[InitializedTemporalDateTime]]).
45. Return ToTemporalCalendarObject(dateTime).
    5.4 Properties of Temporal.PlainDateTime Instances
    Temporal.PlainDateTime instances are ordinary objects that inherit properties from the %Temporal.PlainDateTime.prototype% intrinsic object. Temporal.PlainDateTime instances are initially created with the internal slots described in Table 6.

Table 6: Internal Slots of Temporal.PlainDateTime Instances
Internal Slot Description
[[InitializedTemporalDateTime]] The only specified use of this slot is for distinguishing Temporal.PlainDateTime instances from other objects.
[[ISOYear]] An integer representing the year in the ISO 8601 calendar.
[[ISOMonth]] An integer between 1 and 12, inclusive, representing the month of the year in the ISO 8601 calendar.
[[ISODay]] An integer between 1 and ISODaysInMonth([[ISOYear]], [[ISOMonth]]), inclusive, representing the day of the month in the ISO 8601 calendar.
[[ISOHour]] An integer between 0 and 23, inclusive, representing the hour of the day.
[[ISOMinute]] An integer between 0 and 59, inclusive, representing the minute of the hour.
[[ISOSecond]] An integer between 0 and 59, inclusive, representing the second within the minute.
[[ISOMillisecond]] An integer between 0 and 999, inclusive, representing the millisecond within the second.
[[ISOMicrosecond]] An integer between 0 and 999, inclusive, representing the microsecond within the millisecond.
[[ISONanosecond]] An integer between 0 and 999, inclusive, representing the nanosecond within the microsecond.
[[Calendar]] A String or Object representing the calendar.
5.5 Abstract Operations
5.5.1 ISO Date-Time Records
An ISO Date-Time Record is a Record value used to represent a valid calendar date in the ISO 8601 calendar together with a clock time. For any ISO Date-Time Record r, IsValidISODate(r.[[Year]], r.[[Month]], r.[[Day]]) must return true, and IsValidTime(r.[[Hour]], r.[[Minute]], r.[[Second]], r.[[Millisecond]], r.[[Microsecond]], r.[[Nanosecond]]) must return true. It is not necessary for ISODateTimeWithinLimits(r.[[Year]], r.[[Month]], r.[[Day]], r.[[Hour]], r.[[Minute]], r.[[Second]], r.[[Millisecond]], r.[[Microsecond]], r.[[Nanosecond]]) to return true.

ISO Date-Time Records have the fields listed in Table 7.

Table 7: ISO Date-Time Record Fields
Field Name Value Meaning
[[Year]] an integer The year in the ISO 8601 calendar.
[[Month]] an integer between 1 and 12, inclusive The number of the month in the ISO 8601 calendar.
[[Day]] an integer between 1 and 31, inclusive The number of the day of the month in the ISO 8601 calendar.
[[Hour]] an integer in the inclusive range 0 to 23 The number of the hour.
[[Minute]] an integer in the inclusive range 0 to 59 The number of the minute.
[[Second]] an integer in the inclusive range 0 to 59 The number of the second.
[[Millisecond]] an integer in the inclusive range 0 to 999 The number of the millisecond.
[[Microsecond]] an integer in the inclusive range 0 to 999 The number of the microsecond.
[[Nanosecond]] an integer in the inclusive range 0 to 999 The number of the nanosecond.
5.5.2 ISODateTimeWithinLimits ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )
The abstract operation ISODateTimeWithinLimits takes arguments year (an integer), month (an integer between 1 and 12 inclusive), day (an integer between 1 and 31 inclusive), hour (an integer between 0 and 23 inclusive), minute (an integer between 0 and 59 inclusive), second (an integer between 0 and 59 inclusive), millisecond (an integer between 0 and 999 inclusive), microsecond (an integer between 0 and 999 inclusive), and nanosecond (an integer between 0 and 999 inclusive) and returns a Boolean. The return value is true if the combination of a date in the ISO 8601 calendar with a wall-clock time, given by the arguments, is within the representable range of Temporal.PlainDateTime, and false otherwise.

NOTE
Temporal.PlainDateTime objects can represent points in time within 24 hours (8.64 × 10\*\*13 nanoseconds) of the Temporal.Instant boundaries. This ensures that a Temporal.Instant object can be converted into a Temporal.PlainDateTime object using any time zone.

It performs the following steps when called:

1. Assert: IsValidISODate(year, month, day) is true.
2. If abs(ISODateToEpochDays(year, month - 1, day)) > 10\*\*8 + 1, return false.
3. Let ns be ℝ(GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond)).
4. If ns ≤ nsMinInstant - nsPerDay, then
   a. Return false.
5. If ns ≥ nsMaxInstant + nsPerDay, then
   a. Return false.
6. Return true.
   5.5.3 InterpretTemporalDateTimeFields ( calendarRec, fields, options )
   The abstract operation InterpretTemporalDateTimeFields takes arguments calendarRec (a Calendar Methods Record), fields (an Object), and options (an Object) and returns either a normal completion containing an ISO Date-Time Record, or a throw completion. It interprets the date/time fields in the object fields using the given calendar, and returns a Record with the fields according to the ISO 8601 calendar. It performs the following steps when called:

7. Assert: options is an ordinary extensible Object that is not directly observable from ECMAScript code and for which the value of the [[Prototype]] internal slot is null and every property is a configurable data property.
8. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-FROM-FIELDS) is true.
9. Let timeResult be ? ToTemporalTimeRecord(fields).
10. Let overflow be ? ToTemporalOverflow(options).
11. NOTE: The following step is guaranteed to complete normally despite the "overflow" property existing, because of the assertion in the first step.
12. Perform ! CreateDataPropertyOrThrow(options, "overflow", overflow).
13. Let temporalDate be ? CalendarDateFromFields(calendarRec, fields, options).
14. Set timeResult to ? RegulateTime(timeResult.[[Hour]], timeResult.[[Minute]], timeResult.[[Second]], timeResult.[[Millisecond]], timeResult.[[Microsecond]], timeResult.[[Nanosecond]], overflow).
15. Return the Record { [[Year]]: temporalDate.[[ISOYear]], [[Month]]: temporalDate.[[ISOMonth]], [[Day]]: temporalDate.[[ISODay]], [[Hour]]: timeResult.[[Hour]], [[Minute]]: timeResult.[[Minute]], [[Second]]: timeResult.[[Second]], [[Millisecond]]: timeResult.[[Millisecond]], [[Microsecond]]: timeResult.[[Microsecond]], [[Nanosecond]]: timeResult.[[Nanosecond]] }.
    5.5.4 ToTemporalDateTime ( item [ , options ] )
    The abstract operation ToTemporalDateTime takes argument item (an ECMAScript language value) and optional argument options (an Object or undefined) and returns either a normal completion containing a Temporal.PlainDateTime, or a throw completion. It returns its argument item if it is already a Temporal.PlainDateTime instance, converts item to a new Temporal.PlainDateTime instance if possible, and throws otherwise. It performs the following steps when called:

16. If options is not present, set options to undefined.
17. Let resolvedOptions be ? SnapshotOwnProperties(! GetOptionsObject(options), null).
18. If Type(item) is Object, then
    a. If item has an [[InitializedTemporalDateTime]] internal slot, then
    i. Return item.
    b. If item has an [[InitializedTemporalZonedDateTime]] internal slot, then
    i. Perform ? ToTemporalOverflow(resolvedOptions).
    ii. Let instant be ! CreateTemporalInstant(item.[[Nanoseconds]]).
    iii. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(item.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
    iv. Return ? GetPlainDateTimeFor(timeZoneRec, instant, item.[[Calendar]]).
    c. If item has an [[InitializedTemporalDate]] internal slot, then
    i. Perform ? ToTemporalOverflow(resolvedOptions).
    ii. Return ? CreateTemporalDateTime(item.[[ISOYear]], item.[[ISOMonth]], item.[[ISODay]], 0, 0, 0, 0, 0, 0, item.[[Calendar]]).
    d. Let calendar be ? GetTemporalCalendarSlotValueWithISODefault(item).
    e. Let calendarRec be ? CreateCalendarMethodsRecord(calendar, « DATE-FROM-FIELDS, FIELDS »).
    f. Let fieldNames be ? CalendarFields(calendarRec, « "day", "month", "monthCode", "year" »).
    g. Append "hour", "microsecond", "millisecond", "minute", "nanosecond", and "second" to fieldNames.
    h. Let fields be ? PrepareTemporalFields(item, fieldNames, «»).
    i. Let result be ? InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions).
19. Else,
    a. If item is not a String, throw a TypeError exception.
    b. Let result be ? ParseTemporalDateTimeString(item).
    c. Assert: IsValidISODate(result.[[Year]], result.[[Month]], result.[[Day]]) is true.
    d. Assert: IsValidTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]]) is true.
    e. Let calendar be result.[[Calendar]].
    f. If calendar is undefined, set calendar to "iso8601".
    g. If IsBuiltinCalendar(calendar) is false, throw a RangeError exception.
    h. Set calendar to the ASCII-lowercase of calendar.
    i. Perform ? ToTemporalOverflow(resolvedOptions).
20. Return ? CreateTemporalDateTime(result.[[Year]], result.[[Month]], result.[[Day]], result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]], calendar).
    5.5.5 BalanceISODateTime ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )
    The abstract operation BalanceISODateTime takes arguments year (an integer), month (an integer), day (an integer), hour (an integer), minute (an integer), second (an integer), millisecond (an integer), microsecond (an integer), and nanosecond (an integer) and returns an ISO Date-Time Record. It performs the following steps when called:

21. Let balancedTime be BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond).
22. Let balancedDate be BalanceISODate(year, month, day + balancedTime.[[Days]]).
23. Return the Record { [[Year]]: balancedDate.[[Year]], [[Month]]: balancedDate.[[Month]], [[Day]]: balancedDate.[[Day]], [[Hour]]: balancedTime.[[Hour]], [[Minute]]: balancedTime.[[Minute]], [[Second]]: balancedTime.[[Second]], [[Millisecond]]: balancedTime.[[Millisecond]], [[Microsecond]]: balancedTime.[[Microsecond]], [[Nanosecond]]: balancedTime.[[Nanosecond]] }.
    5.5.6 CreateTemporalDateTime ( isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, calendar [ , newTarget ] )
    The abstract operation CreateTemporalDateTime takes arguments isoYear (an integer), isoMonth (an integer), isoDay (an integer), hour (an integer), minute (an integer), second (an integer), millisecond (an integer), microsecond (an integer), nanosecond (an integer), and calendar (a String or Object) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.PlainDateTime instance, or an abrupt completion. It creates a Temporal.PlainDateTime instance and fills the internal slots with valid values. It performs the following steps when called:

24. If IsValidISODate(isoYear, isoMonth, isoDay) is false, throw a RangeError exception.
25. If IsValidTime(hour, minute, second, millisecond, microsecond, nanosecond) is false, throw a RangeError exception.
26. If ISODateTimeWithinLimits(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond) is false, then
    a. Throw a RangeError exception.
27. If newTarget is not present, set newTarget to %Temporal.PlainDateTime%.
28. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.PlainDateTime.prototype%", « [[InitializedTemporalDateTime]], [[ISOYear]], [[ISOMonth]], [[ISODay]], [[ISOHour]], [[ISOMinute]], [[ISOSecond]], [[ISOMillisecond]], [[ISOMicrosecond]], [[ISONanosecond]], [[Calendar]] »).
29. Set object.[[ISOYear]] to isoYear.
30. Set object.[[ISOMonth]] to isoMonth.
31. Set object.[[ISODay]] to isoDay.
32. Set object.[[ISOHour]] to hour.
33. Set object.[[ISOMinute]] to minute.
34. Set object.[[ISOSecond]] to second.
35. Set object.[[ISOMillisecond]] to millisecond.
36. Set object.[[ISOMicrosecond]] to microsecond.
37. Set object.[[ISONanosecond]] to nanosecond.
38. Set object.[[Calendar]] to calendar.
39. Return object.
    5.5.7 TemporalDateTimeToString ( isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, calendar, precision, showCalendar )
40. Assert: isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, and nanosecond are integers.
41. Let yearString be PadISOYear(isoYear).
42. Let monthString be ToZeroPaddedDecimalString(isoMonth, 2).
43. Let dayString be ToZeroPaddedDecimalString(isoDay, 2).
44. Let subSecondNanoseconds be millisecond × 10**6 + microsecond × 10**3 + nanosecond.
45. Let timeString be FormatTimeString(hour, minute, second, subSecondNanoseconds, precision).
46. Let calendarString be ? MaybeFormatCalendarAnnotation(calendar, showCalendar).
47. Return the string-concatenation of yearString, the code unit 0x002D (HYPHEN-MINUS), monthString, the code unit 0x002D (HYPHEN-MINUS), dayString, 0x0054 (LATIN CAPITAL LETTER T), timeString, and calendarString.
    5.5.8 CompareISODateTime ( y1, mon1, d1, h1, min1, s1, ms1, mus1, ns1, y2, mon2, d2, h2, min2, s2, ms2, mus2, ns2 )
48. Assert: y1, mon1, d1, h1, min1, s1, ms1, mus1, ns1, y2, mon2, d2, h2, min2, s2, ms2, mus2, and ns2 are integers.
49. Let dateResult be ! CompareISODate(y1, mon1, d1, y2, mon2, d2).
50. If dateResult is not 0, then
    a. Return dateResult.
51. Return ! CompareTemporalTime(h1, min1, s1, ms1, mus1, ns1, h2, min2, s2, ms2, mus2, ns2).
    5.5.9 AddDateTime ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendarRec, years, months, weeks, days, norm, options )
    The abstract operation AddDateTime takes arguments year (an integer), month (an integer in the inclusive interval from 1 to 12), day (an integer in the inclusive interval from 1 to 31), hour (an integer in the inclusive interval from 0 to 23), minute (an integer in the inclusive interval from 0 to 59), second (an integer in the inclusive interval from 0 to 59), millisecond (an integer in the inclusive interval from 0 to 999), microsecond (an integer in the inclusive interval from 0 to 999), nanosecond (an integer in the inclusive interval from 0 to 999), calendarRec (a Calendar Methods Record), years (an integer), months (an integer), weeks (an integer), days (an integer), norm (a Normalized Time Duration Record), and options (an Object or undefined) and returns either a normal completion containing an ISO Date-Time Record, or a throw completion. It adds a duration to a combined date and time, according to the reckoning of the given calendar, and returns the result as a Record. It performs the following steps when called:

52. Assert: ISODateTimeWithinLimits(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) is true.
53. Let timeResult be AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm).
54. Let datePart be ! CreateTemporalDate(year, month, day, calendarRec.[[Receiver]]).
55. Let dateDuration be ? CreateTemporalDuration(years, months, weeks, days + timeResult.[[Days]], 0, 0, 0, 0, 0, 0).
56. Let addedDate be ? AddDate(calendarRec, datePart, dateDuration, options).
57. Return the Record { [[Year]]: addedDate.[[ISOYear]], [[Month]]: addedDate.[[ISOMonth]], [[Day]]: addedDate.[[ISODay]], [[Hour]]: timeResult.[[Hour]], [[Minute]]: timeResult.[[Minute]], [[Second]]: timeResult.[[Second]], [[Millisecond]]: timeResult.[[Millisecond]], [[Microsecond]]: timeResult.[[Microsecond]], [[Nanosecond]]: timeResult.[[Nanosecond]] }.
    5.5.10 RoundISODateTime ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode [ , dayLength ] )
    The abstract operation RoundISODateTime takes arguments year (an integer), month (an integer in the inclusive interval from 1 to 12), day (an integer in the inclusive interval from 1 to 31), hour (an integer in the inclusive interval from 0 to 23), minute (an integer in the inclusive interval from 0 to 59), second (an integer in the inclusive interval from 0 to 59), millisecond (an integer in the inclusive interval from 0 to 999), microsecond (an integer in the inclusive interval from 0 to 999), nanosecond (an integer in the inclusive interval from 0 to 999), increment (an integer), unit ("day", "hour", "minute", "second", "millisecond", "microsecond", or "nanosecond"), and roundingMode (a String from the Identifier column of Table 19) and optional argument dayLength (an integer) and returns an ISO Date-Time Record. It rounds the time part of a combined date and time, carrying over any excess into the date part. It performs the following steps when called:

58. Assert: ISODateTimeWithinLimits(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) is true.
59. If dayLength is not present, set dayLength to nsPerDay.
60. Let roundedTime be RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode, dayLength).
61. Let balanceResult be BalanceISODate(year, month, day + roundedTime.[[Days]]).
62. Return the Record { [[Year]]: balanceResult.[[Year]], [[Month]]: balanceResult.[[Month]], [[Day]]: balanceResult.[[Day]], [[Hour]]: roundedTime.[[Hour]], [[Minute]]: roundedTime.[[Minute]], [[Second]]: roundedTime.[[Second]], [[Millisecond]]: roundedTime.[[Millisecond]], [[Microsecond]]: roundedTime.[[Microsecond]], [[Nanosecond]]: roundedTime.[[Nanosecond]] }.
    5.5.11 DifferenceISODateTime ( y1, mon1, d1, h1, min1, s1, ms1, mus1, ns1, y2, mon2, d2, h2, min2, s2, ms2, mus2, ns2, calendarRec, largestUnit, options )
    The abstract operation DifferenceISODateTime takes arguments y1 (an integer), mon1 (an integer between 1 and 12 inclusive), d1 (an integer between 1 and 31 inclusive), h1 (an integer between 0 and 23 inclusive), min1 (an integer between 0 and 59 inclusive), s1 (an integer between 0 and 59 inclusive), ms1 (an integer between 0 and 999 inclusive), mus1 (an integer between 0 and 999 inclusive), ns1 (an integer between 0 and 999 inclusive), y2 (an integer), mon2 (an integer between 1 and 12 inclusive), d2 (an integer between 1 and 31 inclusive), h2 (an integer between 0 and 23 inclusive), min2 (an integer between 0 and 59 inclusive), s2 (an integer between 0 and 59 inclusive), ms2 (an integer between 0 and 999 inclusive), mus2 (an integer between 0 and 999 inclusive), ns2 (an integer between 0 and 999 inclusive), calendarRec (a Calendar Methods Record), largestUnit (a String), and options (an ordinary Object for which the value of the [[Prototype]] internal slot is null and every property is a data property) and returns either a normal completion containing a Normalized Duration Record, or a throw completion. The returned Duration Record contains the elapsed duration from a first date and time, until a second date and time, according to the reckoning of the given calendar. The given date and time units are all in the ISO 8601 calendar. The largestUnit and options arguments are used in calendar's dateUntil method. It performs the following steps when called:

63. Assert: ISODateTimeWithinLimits(y1, mon1, d1, h1, min1, s1, ms1, mus1, ns1) is true.
64. Assert: ISODateTimeWithinLimits(y2, mon2, d2, h2, min2, s2, ms2, mus2, ns2) is true.
65. Assert: If y1 ≠ y2, and mon1 ≠ mon2, and d1 ≠ d2, and LargerOfTwoTemporalUnits(largestUnit, "day") is not "day", CalendarMethodsRecordHasLookedUp(calendarRec, DATE-UNTIL) is true.
66. Let timeDuration be ! DifferenceTime(h1, min1, s1, ms1, mus1, ns1, h2, min2, s2, ms2, mus2, ns2).
67. Let timeSign be NormalizedTimeDurationSign(timeDuration).
68. Let dateSign be ! CompareISODate(y2, mon2, d2, y1, mon1, d1).
69. Let adjustedDate be CreateISODateRecord(y1, mon1, d1).
70. If timeSign is -dateSign, then
    a. Set adjustedDate to BalanceISODate(adjustedDate.[[Year]], adjustedDate.[[Month]], adjustedDate.[[Day]] - timeSign).
    b. Set timeDuration to ? Add24HourDaysToNormalizedTimeDuration(timeDuration, -timeSign).
71. Let date1 be ! CreateTemporalDate(adjustedDate.[[Year]], adjustedDate.[[Month]], adjustedDate.[[Day]], calendarRec.[[Receiver]]).
72. Let date2 be ! CreateTemporalDate(y2, mon2, d2, calendarRec.[[Receiver]]).
73. Let dateLargestUnit be LargerOfTwoTemporalUnits("day", largestUnit).
74. Let untilOptions be ! SnapshotOwnProperties(options, null).
75. Perform ! CreateDataPropertyOrThrow(untilOptions, "largestUnit", dateLargestUnit).
76. Let dateDifference be ? DifferenceDate(calendarRec, date1, date2, untilOptions).
77. Return ? CreateNormalizedDurationRecord(dateDifference.[[Years]], dateDifference.[[Months]], dateDifference.[[Weeks]], dateDifference.[[Days]], timeDuration).
    5.5.12 DifferenceTemporalPlainDateTime ( operation, dateTime, other, options )
    The abstract operation DifferenceTemporalPlainDateTime takes arguments operation (SINCE or UNTIL), dateTime (a Temporal.PlainDateTime), other (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.Duration or an abrupt completion. It computes the difference between the two times represented by dateTime and other, optionally rounds it, and returns it as a Temporal.Duration object. It performs the following steps when called:

78. If operation is SINCE, let sign be -1. Otherwise, let sign be 1.
79. Set other to ? ToTemporalDateTime(other).
80. If ? CalendarEquals(dateTime.[[Calendar]], other.[[Calendar]]) is false, throw a RangeError exception.
81. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
82. Let settings be ? GetDifferenceSettings(operation, resolvedOptions, DATETIME, « », "nanosecond", "day").
83. Let datePartsIdentical be false.
84. If dateTime.[[ISOYear]] = other.[[ISOYear]], and dateTime.[[ISOMonth]] = other.[[ISOMonth]], and dateTime.[[ISODay]] = other.[[ISODay]], then
    a. Set datePartsIdentical to true.
85. If datePartsIdentical is true, and dateTime.[[ISOHour]] = other.[[ISOHour]], and dateTime.[[ISOMinute]] = other.[[ISOMinute]], and dateTime.[[ISOSecond]] = other.[[ISOSecond]], and dateTime.[[ISOMillisecond]] = other.[[ISOMillisecond]], and dateTime.[[ISOMicrosecond]] = other.[[ISOMicrosecond]], and dateTime.[[ISONanosecond]] = other.[[ISONanosecond]], then
    a. Return ! CreateTemporalDuration(0, 0, 0, 0, 0, 0, 0, 0, 0, 0).
86. Let calendarRec be ? CreateCalendarMethodsRecord(dateTime.[[Calendar]], « DATE-ADD, DATE-UNTIL »).
87. Let result be ? DifferenceISODateTime(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], other.[[ISOYear]], other.[[ISOMonth]], other.[[ISODay]], other.[[ISOHour]], other.[[ISOMinute]], other.[[ISOSecond]], other.[[ISOMillisecond]], other.[[ISOMicrosecond]], other.[[ISONanosecond]], calendarRec, settings.[[LargestUnit]], resolvedOptions).
88. If settings.[[SmallestUnit]] is "nanosecond" and settings.[[RoundingIncrement]] = 1, let roundingGranularityIsNoop be true; else let roundingGranularityIsNoop be false.
89. If roundingGranularityIsNoop is false, then
    a. Let relativeTo be ! CreateTemporalDate(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[Calendar]]).
    b. Let roundRecord be ? RoundDuration(result.[[Years]], result.[[Months]], result.[[Weeks]], result.[[Days]], result.[[NormalizedTime]], settings.[[RoundingIncrement]], settings.[[SmallestUnit]], settings.[[RoundingMode]], relativeTo, calendarRec).
    c. Let roundResult be roundRecord.[[NormalizedDuration]].
    d. Let normWithDays be ? Add24HourDaysToNormalizedTimeDuration(roundResult.[[NormalizedTime]], roundResult.[[Days]]).
    e. Let timeResult be BalanceTimeDuration(normWithDays, settings.[[LargestUnit]]).
    f. Let balanceResult be ? BalanceDateDurationRelative(roundResult.[[Years]], roundResult.[[Months]], roundResult.[[Weeks]], timeResult.[[Days]], settings.[[LargestUnit]], settings.[[SmallestUnit]], relativeTo, calendarRec).
90. Else,
    a. Let normWithDays be ? Add24HourDaysToNormalizedTimeDuration(result.[[NormalizedTime]], result.[[Days]]).
    b. Let timeResult be BalanceTimeDuration(normWithDays, settings.[[LargestUnit]]).
    c. Let balanceResult be ! CreateDateDurationRecord(result.[[Years]], result.[[Months]], result.[[Weeks]], timeResult.[[Days]]).
91. Return ? CreateTemporalDuration(sign × balanceResult.[[Years]], sign × balanceResult.[[Months]], sign × balanceResult.[[Weeks]], sign × balanceResult.[[Days]], sign × timeResult.[[Hours]], sign × timeResult.[[Minutes]], sign × timeResult.[[Seconds]], sign × timeResult.[[Milliseconds]], sign × timeResult.[[Microseconds]], sign × timeResult.[[Nanoseconds]]).
    5.5.13 AddDurationToOrSubtractDurationFromPlainDateTime ( operation, dateTime, temporalDurationLike, options )
    The abstract operation AddDurationToOrSubtractDurationFromPlainDateTime takes arguments operation (ADD or SUBTRACT), dateTime (a Temporal.PlainDateTime), temporalDurationLike (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.PlainDateTime or an abrupt completion. It adds/subtracts temporalDurationLike to/from dateTime, returning a point in time that is in the future/past relative to datetime. It performs the following steps when called:

92. If operation is SUBTRACT, let sign be -1. Otherwise, let sign be 1.
93. Let duration be ? ToTemporalDurationRecord(temporalDurationLike).
94. Set options to ? GetOptionsObject(options).
95. Let calendarRec be ? CreateCalendarMethodsRecord(dateTime.[[Calendar]], « DATE-ADD »).
96. Let norm be NormalizeTimeDuration(sign × duration.[[Hours]], sign × duration.[[Minutes]], sign × duration.[[Seconds]], sign × duration.[[Milliseconds]], sign × duration.[[Microseconds]], sign × duration.[[Nanoseconds]]).
97. Let result be ? AddDateTime(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], calendarRec, sign × duration.[[Years]], sign × duration.[[Months]], sign × duration.[[Weeks]], sign × duration.[[Days]], norm, options).
98. Assert: IsValidISODate(result.[[Year]], result.[[Month]], result.[[Day]]) is true.
99. Assert: IsValidTime(result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]]) is true.
100. Return ? CreateTemporalDateTime(result.[[Year]], result.[[Month]], result.[[Day]], result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]], dateTime.[[Calendar]]).
     6 Temporal.ZonedDateTime Objects
     A Temporal.ZonedDateTime object is an Object referencing a fixed point in time with nanoseconds precision, and containing Object values corresponding to a particular time zone and calendar system.

6.1 The Temporal.ZonedDateTime Constructor
The Temporal.ZonedDateTime constructor:

creates and initializes a new Temporal.ZonedDateTime object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.ZonedDateTime behaviour must include a super call to the %Temporal.ZonedDateTime% constructor to create and initialize subclass instances with the necessary internal slots.
6.1.1 Temporal.ZonedDateTime ( epochNanoseconds, timeZoneLike [ , calendarLike ] )
This function performs the following steps when called:

1. If NewTarget is undefined, then
   a. Throw a TypeError exception.
2. Set epochNanoseconds to ? ToBigInt(epochNanoseconds).
3. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
4. Let timeZone be ? ToTemporalTimeZoneSlotValue(timeZoneLike).
5. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike, "iso8601").
6. Return ? CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar, NewTarget).
   6.2 Properties of the Temporal.ZonedDateTime Constructor
   The value of the [[Prototype]] internal slot of the Temporal.ZonedDateTime constructor is the intrinsic object %Function.prototype%.

The Temporal.ZonedDateTime constructor has the following properties:

6.2.1 Temporal.ZonedDateTime.prototype
The initial value of Temporal.ZonedDateTime.prototype is %Temporal.ZonedDateTime.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

6.2.2 Temporal.ZonedDateTime.from ( item [ , options ] )
This function performs the following steps when called:

1. Set options to ? GetOptionsObject(options).
2. If Type(item) is Object and item has an [[InitializedTemporalZonedDateTime]] internal slot, then
   a. NOTE: The following steps read options and perform independent validation in alphabetical order (ToTemporalDisambiguation reads "disambiguation", ToTemporalOffset reads "offset", and ToTemporalOverflow reads "overflow").
   b. Perform ? ToTemporalDisambiguation(options).
   c. Perform ? ToTemporalOffset(options, "reject").
   d. Perform ? ToTemporalOverflow(options).
   e. Return ! CreateTemporalZonedDateTime(item.[[Nanoseconds]], item.[[TimeZone]], item.[[Calendar]]).
3. Return ? ToTemporalZonedDateTime(item, options).
   6.2.3 Temporal.ZonedDateTime.compare ( one, two )
   This function performs the following steps when called:

4. Set one to ? ToTemporalZonedDateTime(one).
5. Set two to ? ToTemporalZonedDateTime(two).
6. Return 𝔽(CompareEpochNanoseconds(one.[[Nanoseconds]], two.[[Nanoseconds]])).
   6.3 Properties of the Temporal.ZonedDateTime Prototype Object
   The Temporal.ZonedDateTime prototype object

is itself an ordinary object.
is not a Temporal.ZonedDateTime instance and does not have a [[InitializedTemporalZonedDateTime]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
NOTE
An ECMAScript implementation that includes the ECMA-402 Internationalization API extends this prototype with additional properties in order to represent calendar data.
6.3.1 Temporal.ZonedDateTime.prototype.constructor
The initial value of Temporal.ZonedDateTime.prototype.constructor is %Temporal.ZonedDateTime%.

6.3.2 Temporal.ZonedDateTime.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.ZonedDateTime".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

6.3.3 get Temporal.ZonedDateTime.prototype.calendarId
Temporal.ZonedDateTime.prototype.calendarId is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let zonedDateTime be the this value.
2. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
3. Return ? ToTemporalCalendarIdentifier(zonedDateTime.[[Calendar]]).
   6.3.4 get Temporal.ZonedDateTime.prototype.timeZoneId
   Temporal.ZonedDateTime.prototype.timeZoneId is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

4. Let zonedDateTime be the this value.
5. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
6. Return ? ToTemporalTimeZoneIdentifier(zonedDateTime.[[TimeZone]]).
   6.3.5 get Temporal.ZonedDateTime.prototype.year
   Temporal.ZonedDateTime.prototype.year is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

7. Let zonedDateTime be the this value.
8. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
9. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
10. Let calendar be zonedDateTime.[[Calendar]].
11. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
12. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
13. Return 𝔽(? CalendarYear(calendar, temporalDateTime)).
    6.3.6 get Temporal.ZonedDateTime.prototype.month
    Temporal.ZonedDateTime.prototype.month is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

14. Let zonedDateTime be the this value.
15. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
16. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
17. Let calendar be zonedDateTime.[[Calendar]].
18. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
19. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
20. Return 𝔽(? CalendarMonth(calendar, temporalDateTime)).
    6.3.7 get Temporal.ZonedDateTime.prototype.monthCode
    Temporal.ZonedDateTime.prototype.monthCode is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

21. Let zonedDateTime be the this value.
22. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
23. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
24. Let calendar be zonedDateTime.[[Calendar]].
25. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
26. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
27. Return ? CalendarMonthCode(calendar, temporalDateTime).
    6.3.8 get Temporal.ZonedDateTime.prototype.day
    Temporal.ZonedDateTime.prototype.day is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

28. Let zonedDateTime be the this value.
29. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
30. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
31. Let calendarRec be ? CreateCalendarMethodsRecord(zonedDateTime.[[Calendar]], « DAY »).
32. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
33. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.[[Receiver]]).
34. Return 𝔽(? CalendarDay(calendarRec, temporalDateTime)).
    6.3.9 get Temporal.ZonedDateTime.prototype.hour
    Temporal.ZonedDateTime.prototype.hour is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

35. Let zonedDateTime be the this value.
36. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
37. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
38. Let calendar be zonedDateTime.[[Calendar]].
39. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
40. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
41. Return 𝔽(temporalDateTime.[[ISOHour]]).
    6.3.10 get Temporal.ZonedDateTime.prototype.minute
    Temporal.ZonedDateTime.prototype.minute is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

42. Let zonedDateTime be the this value.
43. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
44. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
45. Let calendar be zonedDateTime.[[Calendar]].
46. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
47. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
48. Return 𝔽(temporalDateTime.[[ISOMinute]]).
    6.3.11 get Temporal.ZonedDateTime.prototype.second
    Temporal.ZonedDateTime.prototype.second is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

49. Let zonedDateTime be the this value.
50. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
51. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
52. Let calendar be zonedDateTime.[[Calendar]].
53. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
54. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
55. Return 𝔽(temporalDateTime.[[ISOSecond]]).
    6.3.12 get Temporal.ZonedDateTime.prototype.millisecond
    Temporal.ZonedDateTime.prototype.millisecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

56. Let zonedDateTime be the this value.
57. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
58. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
59. Let calendar be zonedDateTime.[[Calendar]].
60. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
61. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
62. Return 𝔽(temporalDateTime.[[ISOMillisecond]]).
    6.3.13 get Temporal.ZonedDateTime.prototype.microsecond
    Temporal.ZonedDateTime.prototype.microsecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

63. Let zonedDateTime be the this value.
64. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
65. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
66. Let calendar be zonedDateTime.[[Calendar]].
67. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
68. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
69. Return 𝔽(temporalDateTime.[[ISOMicrosecond]]).
    6.3.14 get Temporal.ZonedDateTime.prototype.nanosecond
    Temporal.ZonedDateTime.prototype.nanosecond is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

70. Let zonedDateTime be the this value.
71. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
72. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
73. Let calendar be zonedDateTime.[[Calendar]].
74. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
75. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
76. Return 𝔽(temporalDateTime.[[ISONanosecond]]).
    6.3.15 get Temporal.ZonedDateTime.prototype.epochSeconds
    Temporal.ZonedDateTime.prototype.epochSeconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

77. Let zonedDateTime be the this value.
78. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
79. Let ns be zonedDateTime.[[Nanoseconds]].
80. Let s be floor(ℝ(ns) / 10\*\*9).
81. Return 𝔽(s).
    6.3.16 get Temporal.ZonedDateTime.prototype.epochMilliseconds
    Temporal.ZonedDateTime.prototype.epochMilliseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

82. Let zonedDateTime be the this value.
83. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
84. Let ns be zonedDateTime.[[Nanoseconds]].
85. Let ms be floor(ℝ(ns) / 10\*\*6).
86. Return 𝔽(ms).
    6.3.17 get Temporal.ZonedDateTime.prototype.epochMicroseconds
    Temporal.ZonedDateTime.prototype.epochMicroseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

87. Let zonedDateTime be the this value.
88. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
89. Let ns be zonedDateTime.[[Nanoseconds]].
90. Let µs be floor(ℝ(ns) / 10\*\*3).
91. Return ℤ(µs).
    6.3.18 get Temporal.ZonedDateTime.prototype.epochNanoseconds
    Temporal.ZonedDateTime.prototype.epochNanoseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

92. Let zonedDateTime be the this value.
93. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
94. Return zonedDateTime.[[Nanoseconds]].
    6.3.19 get Temporal.ZonedDateTime.prototype.dayOfWeek
    Temporal.ZonedDateTime.prototype.dayOfWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

95. Let zonedDateTime be the this value.
96. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
97. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
98. Let calendar be zonedDateTime.[[Calendar]].
99. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
100. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
101. Return 𝔽(? CalendarDayOfWeek(calendar, temporalDateTime)).
     6.3.20 get Temporal.ZonedDateTime.prototype.dayOfYear
     Temporal.ZonedDateTime.prototype.dayOfYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

102. Let zonedDateTime be the this value.
103. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
104. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
105. Let calendar be zonedDateTime.[[Calendar]].
106. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
107. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
108. Return 𝔽(? CalendarDayOfYear(calendar, temporalDateTime)).
     6.3.21 get Temporal.ZonedDateTime.prototype.weekOfYear
     Temporal.ZonedDateTime.prototype.weekOfYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

109. Let zonedDateTime be the this value.
110. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
111. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
112. Let calendar be zonedDateTime.[[Calendar]].
113. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
114. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
115. Return 𝔽(? CalendarWeekOfYear(calendar, temporalDateTime)).
     6.3.22 get Temporal.ZonedDateTime.prototype.yearOfWeek
     Temporal.ZonedDateTime.prototype.yearOfWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

116. Let zonedDateTime be the this value.
117. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
118. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
119. Let calendar be zonedDateTime.[[Calendar]].
120. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
121. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
122. Return 𝔽(? CalendarYearOfWeek(calendar, temporalDateTime)).
     6.3.23 get Temporal.ZonedDateTime.prototype.hoursInDay
     Temporal.ZonedDateTime.prototype.hoursInDay is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

123. Let zonedDateTime be the this value.
124. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
125. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
126. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
127. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, "iso8601").
128. Let year be temporalDateTime.[[ISOYear]].
129. Let month be temporalDateTime.[[ISOMonth]].
130. Let day be temporalDateTime.[[ISODay]].
131. Let today be ? CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, "iso8601").
132. Let tomorrowFields be BalanceISODate(year, month, day + 1).
133. Let tomorrow be ? CreateTemporalDateTime(tomorrowFields.[[Year]], tomorrowFields.[[Month]], tomorrowFields.[[Day]], 0, 0, 0, 0, 0, 0, "iso8601").
134. Let todayInstant be ? GetInstantFor(timeZoneRec, today, "compatible").
135. Let tomorrowInstant be ? GetInstantFor(timeZoneRec, tomorrow, "compatible").
136. Let diff be NormalizedTimeDurationFromEpochNanosecondsDifference(tomorrowInstant.[[Nanoseconds]], todayInstant.[[Nanoseconds]]).
137. Return 𝔽(DivideNormalizedTimeDuration(diff, 3.6 × 10\*\*12)).
     6.3.24 get Temporal.ZonedDateTime.prototype.daysInWeek
     Temporal.ZonedDateTime.prototype.daysInWeek is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

138. Let zonedDateTime be the this value.
139. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
140. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
141. Let calendar be zonedDateTime.[[Calendar]].
142. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
143. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
144. Return 𝔽(? CalendarDaysInWeek(calendar, temporalDateTime)).
     6.3.25 get Temporal.ZonedDateTime.prototype.daysInMonth
     Temporal.ZonedDateTime.prototype.daysInMonth is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

145. Let zonedDateTime be the this value.
146. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
147. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
148. Let calendar be zonedDateTime.[[Calendar]].
149. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
150. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
151. Return 𝔽(? CalendarDaysInMonth(calendar, temporalDateTime)).
     6.3.26 get Temporal.ZonedDateTime.prototype.daysInYear
     Temporal.ZonedDateTime.prototype.daysInYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

152. Let zonedDateTime be the this value.
153. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
154. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
155. Let calendar be zonedDateTime.[[Calendar]].
156. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
157. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
158. Return 𝔽(? CalendarDaysInYear(calendar, temporalDateTime)).
     6.3.27 get Temporal.ZonedDateTime.prototype.monthsInYear
     Temporal.ZonedDateTime.prototype.monthsInYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

159. Let zonedDateTime be the this value.
160. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
161. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
162. Let calendar be zonedDateTime.[[Calendar]].
163. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
164. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
165. Return 𝔽(? CalendarMonthsInYear(calendar, temporalDateTime)).
     6.3.28 get Temporal.ZonedDateTime.prototype.inLeapYear
     Temporal.ZonedDateTime.prototype.inLeapYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

166. Let zonedDateTime be the this value.
167. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
168. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
169. Let calendar be zonedDateTime.[[Calendar]].
170. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
171. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
172. Return ? CalendarInLeapYear(calendar, temporalDateTime).
     6.3.29 get Temporal.ZonedDateTime.prototype.offsetNanoseconds
     Temporal.ZonedDateTime.prototype.offsetNanoseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

173. Let zonedDateTime be the this value.
174. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
175. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
176. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
177. Return 𝔽(? GetOffsetNanosecondsFor(timeZoneRec, instant)).
     6.3.30 get Temporal.ZonedDateTime.prototype.offset
     Temporal.ZonedDateTime.prototype.offset is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

178. Let zonedDateTime be the this value.
179. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
180. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
181. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
182. Return ? GetOffsetStringFor(timeZoneRec, instant).
     6.3.31 Temporal.ZonedDateTime.prototype.with ( temporalZonedDateTimeLike [ , options ] )
     This method performs the following steps when called:

183. Let zonedDateTime be the this value.
184. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
185. If ? IsPartialTemporalObject(temporalZonedDateTimeLike) is false, throw a TypeError exception.
186. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
187. Let calendarRec be ? CreateCalendarMethodsRecord(zonedDateTime.[[Calendar]], « DATE-FROM-FIELDS, FIELDS, MERGE-FIELDS »).
188. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
189. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
190. Let offsetNanoseconds be ? GetOffsetNanosecondsFor(timeZoneRec, instant).
191. Let dateTime be ! GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.[[Receiver]], offsetNanoseconds).
192. Let fieldNames be ? CalendarFields(calendarRec, « "day", "month", "monthCode", "year" »).
193. Let fields be ? PrepareTemporalFields(dateTime, fieldNames, « »).
194. Perform ! CreateDataPropertyOrThrow(fields, "hour", dateTime.[[ISOHour]]).
195. Perform ! CreateDataPropertyOrThrow(fields, "minute", dateTime.[[ISOMinute]]).
196. Perform ! CreateDataPropertyOrThrow(fields, "second", dateTime.[[ISOSecond]]).
197. Perform ! CreateDataPropertyOrThrow(fields, "millisecond", dateTime.[[ISOMillisecond]]).
198. Perform ! CreateDataPropertyOrThrow(fields, "microsecond", dateTime.[[ISOMicrosecond]]).
199. Perform ! CreateDataPropertyOrThrow(fields, "nanosecond", dateTime.[[ISONanosecond]]).
200. Perform ! CreateDataPropertyOrThrow(fields, "offset", FormatUTCOffsetNanoseconds(offsetNanoseconds)).
201. Append "hour", "microsecond", "millisecond", "minute", "nanosecond", "offset", and "second" to fieldNames.
202. Let partialZonedDateTime be ? PrepareTemporalFields(temporalZonedDateTimeLike, fieldNames, PARTIAL).
203. Set fields to ? CalendarMergeFields(calendarRec, fields, partialZonedDateTime).
204. Set fields to ? PrepareTemporalFields(fields, fieldNames, « "offset" »).
205. NOTE: The following steps read options and perform independent validation in alphabetical order (ToTemporalDisambiguation reads "disambiguation", ToTemporalOffset reads "offset", and InterpretTemporalDateTimeFields reads "overflow").
206. Let disambiguation be ? ToTemporalDisambiguation(resolvedOptions).
207. Let offset be ? ToTemporalOffset(resolvedOptions, "prefer").
208. Let dateTimeResult be ? InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions).
209. Let offsetString be ! Get(fields, "offset").
210. Assert: Type(offsetString) is String.
211. Let newOffsetNanoseconds be ? ParseDateTimeUTCOffset(offsetString).
212. Let epochNanoseconds be ? InterpretISODateTimeOffset(dateTimeResult.[[Year]], dateTimeResult.[[Month]], dateTimeResult.[[Day]], dateTimeResult.[[Hour]], dateTimeResult.[[Minute]], dateTimeResult.[[Second]], dateTimeResult.[[Millisecond]], dateTimeResult.[[Microsecond]], dateTimeResult.[[Nanosecond]], OPTION, newOffsetNanoseconds, timeZoneRec, disambiguation, offset, MATCH-EXACTLY).
213. Return ! CreateTemporalZonedDateTime(epochNanoseconds, timeZoneRec.[[Receiver]], calendarRec.[[Receiver]]).
     6.3.32 Temporal.ZonedDateTime.prototype.withPlainTime ( [ plainTimeLike ] )
     This method performs the following steps when called:

214. Let zonedDateTime be the this value.
215. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
216. Let plainTime be ? ToTemporalTimeOrMidnight(plainTimeLike).
217. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
218. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
219. Let calendar be zonedDateTime.[[Calendar]].
220. Let plainDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
221. Let resultPlainDateTime be ? CreateTemporalDateTime(plainDateTime.[[ISOYear]], plainDateTime.[[ISOMonth]], plainDateTime.[[ISODay]], plainTime.[[ISOHour]], plainTime.[[ISOMinute]], plainTime.[[ISOSecond]], plainTime.[[ISOMillisecond]], plainTime.[[ISOMicrosecond]], plainTime.[[ISONanosecond]], calendar).
222. Set instant to ? GetInstantFor(timeZoneRec, resultPlainDateTime, "compatible").
223. Return ! CreateTemporalZonedDateTime(instant.[[Nanoseconds]], timeZoneRec.[[Receiver]], calendar).
     6.3.33 Temporal.ZonedDateTime.prototype.withPlainDate ( plainDateLike )
     This method performs the following steps when called:

224. Let zonedDateTime be the this value.
225. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
226. Let plainDate be ? ToTemporalDate(plainDateLike).
227. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
228. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
229. Let plainDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, zonedDateTime.[[Calendar]]).
230. Let calendar be ? ConsolidateCalendars(zonedDateTime.[[Calendar]], plainDate.[[Calendar]]).
231. Let resultPlainDateTime be ? CreateTemporalDateTime(plainDate.[[ISOYear]], plainDate.[[ISOMonth]], plainDate.[[ISODay]], plainDateTime.[[ISOHour]], plainDateTime.[[ISOMinute]], plainDateTime.[[ISOSecond]], plainDateTime.[[ISOMillisecond]], plainDateTime.[[ISOMicrosecond]], plainDateTime.[[ISONanosecond]], calendar).
232. Set instant to ? GetInstantFor(timeZoneRec, resultPlainDateTime, "compatible").
233. Return ! CreateTemporalZonedDateTime(instant.[[Nanoseconds]], timeZoneRec.[[Receiver]], calendar).
     6.3.34 Temporal.ZonedDateTime.prototype.withTimeZone ( timeZoneLike )
     This method performs the following steps when called:

234. Let zonedDateTime be the this value.
235. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
236. Let timeZone be ? ToTemporalTimeZoneSlotValue(timeZoneLike).
237. Return ! CreateTemporalZonedDateTime(zonedDateTime.[[Nanoseconds]], timeZone, zonedDateTime.[[Calendar]]).
     6.3.35 Temporal.ZonedDateTime.prototype.withCalendar ( calendarLike )
     This method performs the following steps when called:

238. Let zonedDateTime be the this value.
239. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
240. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike).
241. Return ! CreateTemporalZonedDateTime(zonedDateTime.[[Nanoseconds]], zonedDateTime.[[TimeZone]], calendar).
     6.3.36 Temporal.ZonedDateTime.prototype.add ( temporalDurationLike [ , options ] )
     This method performs the following steps when called:

242. Let zonedDateTime be the this value.
243. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
244. Return ? AddDurationToOrSubtractDurationFromZonedDateTime(ADD, zonedDateTime, temporalDurationLike, options).
     6.3.37 Temporal.ZonedDateTime.prototype.subtract ( temporalDurationLike [ , options ] )
     This method performs the following steps when called:

245. Let zonedDateTime be the this value.
246. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
247. Return ? AddDurationToOrSubtractDurationFromZonedDateTime(SUBTRACT, zonedDateTime, temporalDurationLike, options).
     6.3.38 Temporal.ZonedDateTime.prototype.until ( other [ , options ] )
     This method performs the following steps when called:

248. Let zonedDateTime be the this value.
249. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
250. Return ? DifferenceTemporalZonedDateTime(UNTIL, zonedDateTime, other, options).
     6.3.39 Temporal.ZonedDateTime.prototype.since ( other [ , options ] )
     This method performs the following steps when called:

251. Let zonedDateTime be the this value.
252. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
253. Return ? DifferenceTemporalZonedDateTime(SINCE, zonedDateTime, other, options).
     6.3.40 Temporal.ZonedDateTime.prototype.round ( roundTo )
     This method performs the following steps when called:

254. Let zonedDateTime be the this value.
255. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
256. If roundTo is undefined, then
     a. Throw a TypeError exception.
257. If Type(roundTo) is String, then
     a. Let paramString be roundTo.
     b. Set roundTo to OrdinaryObjectCreate(null).
     c. Perform ! CreateDataPropertyOrThrow(roundTo, "smallestUnit", paramString).
258. Else,
     a. Set roundTo to ? GetOptionsObject(roundTo).
259. NOTE: The following steps read options and perform independent validation in alphabetical order (ToTemporalRoundingIncrement reads "roundingIncrement" and ToTemporalRoundingMode reads "roundingMode").
260. Let roundingIncrement be ? ToTemporalRoundingIncrement(roundTo).
261. Let roundingMode be ? ToTemporalRoundingMode(roundTo, "halfExpand").
262. Let smallestUnit be ? GetTemporalUnit(roundTo, "smallestUnit", TIME, REQUIRED, « "day" »).
263. If smallestUnit is "day", then
     a. Let maximum be 1.
     b. Let inclusive be true.
264. Else,
     a. Let maximum be MaximumTemporalDurationRoundingIncrement(smallestUnit).
     b. Assert: maximum is not undefined.
     c. Let inclusive be false.
265. Perform ? ValidateTemporalRoundingIncrement(roundingIncrement, maximum, inclusive).
266. If smallestUnit is "nanosecond" and roundingIncrement is 1, then
     a. Return ! CreateTemporalZonedDateTime(zonedDateTime.[[Nanoseconds]], zonedDateTime.[[TimeZone]], zonedDateTime.[[Calendar]]).
267. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
268. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
269. Let calendar be zonedDateTime.[[Calendar]].
270. Let offsetNanoseconds be ? GetOffsetNanosecondsFor(timeZoneRec, instant).
271. Let temporalDateTime be ! GetPlainDateTimeFor(timeZoneRec, instant, calendar, offsetNanoseconds).
272. Let dtStart be ? CreateTemporalDateTime(temporalDateTime.[[ISOYear]], temporalDateTime.[[ISOMonth]], temporalDateTime.[[ISODay]], 0, 0, 0, 0, 0, 0, "iso8601").
273. Let instantStart be ? GetInstantFor(timeZoneRec, dtStart, "compatible").
274. Let startNs be instantStart.[[Nanoseconds]].
275. Let endNs be ? AddDaysToZonedDateTime(instantStart, dtStart, timeZoneRec, calendar, 1).[[EpochNanoseconds]].
276. Let dayLengthNs be ℝ(endNs - startNs).
277. If dayLengthNs ≤ 0, then
     a. Throw a RangeError exception.
278. Let roundResult be RoundISODateTime(temporalDateTime.[[ISOYear]], temporalDateTime.[[ISOMonth]], temporalDateTime.[[ISODay]], temporalDateTime.[[ISOHour]], temporalDateTime.[[ISOMinute]], temporalDateTime.[[ISOSecond]], temporalDateTime.[[ISOMillisecond]], temporalDateTime.[[ISOMicrosecond]], temporalDateTime.[[ISONanosecond]], roundingIncrement, smallestUnit, roundingMode, dayLengthNs).
279. Let epochNanoseconds be ? InterpretISODateTimeOffset(roundResult.[[Year]], roundResult.[[Month]], roundResult.[[Day]], roundResult.[[Hour]], roundResult.[[Minute]], roundResult.[[Second]], roundResult.[[Millisecond]], roundResult.[[Microsecond]], roundResult.[[Nanosecond]], OPTION, offsetNanoseconds, timeZoneRec, "compatible", "prefer", MATCH-EXACTLY).
280. Return ! CreateTemporalZonedDateTime(epochNanoseconds, timeZoneRec.[[Receiver]], calendar).
     6.3.41 Temporal.ZonedDateTime.prototype.equals ( other )
     This method performs the following steps when called:

281. Let zonedDateTime be the this value.
282. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
283. Set other to ? ToTemporalZonedDateTime(other).
284. If zonedDateTime.[[Nanoseconds]] ≠ other.[[Nanoseconds]], return false.
285. If ? TimeZoneEquals(zonedDateTime.[[TimeZone]], other.[[TimeZone]]) is false, return false.
286. Return ? CalendarEquals(zonedDateTime.[[Calendar]], other.[[Calendar]]).
     6.3.42 Temporal.ZonedDateTime.prototype.toString ( [ options ] )
     This method performs the following steps when called:

287. Let zonedDateTime be the this value.
288. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
289. Set options to ? GetOptionsObject(options).
290. NOTE: The following steps read options and perform independent validation in alphabetical order (ToCalendarNameOption reads "calendarName", ToFractionalSecondDigits reads "fractionalSecondDigits", ToShowOffsetOption reads "offset", and ToTemporalRoundingMode reads "roundingMode").
291. Let showCalendar be ? ToCalendarNameOption(options).
292. Let digits be ? ToFractionalSecondDigits(options).
293. Let showOffset be ? ToShowOffsetOption(options).
294. Let roundingMode be ? ToTemporalRoundingMode(options, "trunc").
295. Let smallestUnit be ? GetTemporalUnit(options, "smallestUnit", TIME, undefined).
296. If smallestUnit is "hour", throw a RangeError exception.
297. Let showTimeZone be ? ToTimeZoneNameOption(options).
298. Let precision be ToSecondsStringPrecisionRecord(smallestUnit, digits).
299. Return ? TemporalZonedDateTimeToString(zonedDateTime, precision.[[Precision]], showCalendar, showTimeZone, showOffset, precision.[[Increment]], precision.[[Unit]], roundingMode).
     6.3.43 Temporal.ZonedDateTime.prototype.toLocaleString ( [ locales [ , options ] ] )
     An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

This method performs the following steps when called:

1. Let zonedDateTime be the this value.
2. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
3. Return ? TemporalZonedDateTimeToString(zonedDateTime, "auto", "auto", "auto", "auto").
   6.3.44 Temporal.ZonedDateTime.prototype.toJSON ( )
   This method performs the following steps when called:

4. Let zonedDateTime be the this value.
5. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
6. Return ? TemporalZonedDateTimeToString(zonedDateTime, "auto", "auto", "auto", "auto").
   6.3.45 Temporal.ZonedDateTime.prototype.valueOf ( )
   This method performs the following steps when called:

7. Throw a TypeError exception.
   NOTE
   This method always throws, because in the absence of valueOf(), expressions with arithmetic operators such as zonedDateTime1 > zonedDateTime2 would fall back to being equivalent to zonedDateTime1.toString() > zonedDateTime2.toString(). Lexicographical comparison of serialized strings might not seem obviously wrong, because the result would sometimes be correct. Implementations are encouraged to phrase the error message to point users to Temporal.ZonedDateTime.compare(), Temporal.ZonedDateTime.prototype.equals(), and/or Temporal.ZonedDateTime.prototype.toString().

6.3.46 Temporal.ZonedDateTime.prototype.startOfDay ( )
This method performs the following steps when called:

1. Let zonedDateTime be the this value.
2. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
3. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
4. Let calendar be zonedDateTime.[[Calendar]].
5. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
6. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
7. Let startDateTime be ? CreateTemporalDateTime(temporalDateTime.[[ISOYear]], temporalDateTime.[[ISOMonth]], temporalDateTime.[[ISODay]], 0, 0, 0, 0, 0, 0, calendar).
8. Let startInstant be ? GetInstantFor(timeZoneRec, startDateTime, "compatible").
9. Return ! CreateTemporalZonedDateTime(startInstant.[[Nanoseconds]], timeZoneRec,[[Receiver]], calendar).
   6.3.47 Temporal.ZonedDateTime.prototype.toInstant ( )
   This method performs the following steps when called:

10. Let zonedDateTime be the this value.
11. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
12. Return ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
    6.3.48 Temporal.ZonedDateTime.prototype.toPlainDate ( )
    This method performs the following steps when called:

13. Let zonedDateTime be the this value.
14. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
15. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
16. Let calendar be zonedDateTime.[[Calendar]].
17. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
18. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
19. Return ! CreateTemporalDate(temporalDateTime.[[ISOYear]], temporalDateTime.[[ISOMonth]], temporalDateTime.[[ISODay]], calendar).
    6.3.49 Temporal.ZonedDateTime.prototype.toPlainTime ( )
    This method performs the following steps when called:

20. Let zonedDateTime be the this value.
21. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
22. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
23. Let calendar be zonedDateTime.[[Calendar]].
24. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
25. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
26. Return ! CreateTemporalTime(temporalDateTime.[[ISOHour]], temporalDateTime.[[ISOMinute]], temporalDateTime.[[ISOSecond]], temporalDateTime.[[ISOMillisecond]], temporalDateTime.[[ISOMicrosecond]], temporalDateTime.[[ISONanosecond]]).
    6.3.50 Temporal.ZonedDateTime.prototype.toPlainDateTime ( )
    This method performs the following steps when called:

27. Let zonedDateTime be the this value.
28. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
29. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
30. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
31. Return ? GetPlainDateTimeFor(timeZoneRec, instant, zonedDateTime.[[Calendar]]).
    6.3.51 Temporal.ZonedDateTime.prototype.toPlainYearMonth ( )
    This method performs the following steps when called:

32. Let zonedDateTime be the this value.
33. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
34. Let calendarRec be ? CreateCalendarMethodsRecord(zonedDateTime.[[Calendar]], « FIELDS, YEAR-MONTH-FROM-FIELDS »).
35. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
36. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
37. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.[[Receiver]]).
38. Let fieldNames be ? CalendarFields(calendarRec, « "monthCode", "year" »).
39. Let fields be ? PrepareTemporalFields(temporalDateTime, fieldNames, «»).
40. Return ? CalendarYearMonthFromFields(calendarRec, fields).
41. NOTE: The call to CalendarYearMonthFromFields is necessary in order to create a PlainYearMonth object with the [[ISOYear]], [[ISOMonth]], and [[ISODay]] internal slots set correctly.
    6.3.52 Temporal.ZonedDateTime.prototype.toPlainMonthDay ( )
    This method performs the following steps when called:

42. Let zonedDateTime be the this value.
43. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
44. Let calendarRec be ? CreateCalendarMethodsRecord(zonedDateTime.[[Calendar]], « FIELDS, MONTH-DAY-FROM-FIELDS »).
45. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
46. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
47. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.[[Receiver]]).
48. Let fieldNames be ? CalendarFields(calendarRec, « "day", "monthCode" »).
49. Let fields be ? PrepareTemporalFields(temporalDateTime, fieldNames, «»).
50. Return ? CalendarMonthDayFromFields(calendarRec, fields).
51. NOTE: The call to CalendarMonthDayFromFields is necessary in order to create a PlainMonthDay object with the [[ISOYear]], [[ISOMonth]], and [[ISODay]] internal slots set correctly.
    6.3.53 Temporal.ZonedDateTime.prototype.getISOFields ( )
    This method performs the following steps when called:

52. Let zonedDateTime be the this value.
53. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
54. Let fields be OrdinaryObjectCreate(%Object.prototype%).
55. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
56. Let calendar be zonedDateTime.[[Calendar]].
57. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR »).
58. Let offsetNanoseconds be ? GetOffsetNanosecondsFor(timeZoneRec, instant).
59. Let dateTime be ! GetPlainDateTimeFor(timeZoneRec, instant, calendar, offsetNanoseconds).
60. Let offset be FormatUTCOffsetNanoseconds(offsetNanoseconds).
61. Perform ! CreateDataPropertyOrThrow(fields, "calendar", calendar).
62. Perform ! CreateDataPropertyOrThrow(fields, "isoDay", 𝔽(dateTime.[[ISODay]])).
63. Perform ! CreateDataPropertyOrThrow(fields, "isoHour", 𝔽(dateTime.[[ISOHour]])).
64. Perform ! CreateDataPropertyOrThrow(fields, "isoMicrosecond", 𝔽(dateTime.[[ISOMicrosecond]])).
65. Perform ! CreateDataPropertyOrThrow(fields, "isoMillisecond", 𝔽(dateTime.[[ISOMillisecond]])).
66. Perform ! CreateDataPropertyOrThrow(fields, "isoMinute", 𝔽(dateTime.[[ISOMinute]])).
67. Perform ! CreateDataPropertyOrThrow(fields, "isoMonth", 𝔽(dateTime.[[ISOMonth]])).
68. Perform ! CreateDataPropertyOrThrow(fields, "isoNanosecond", 𝔽(dateTime.[[ISONanosecond]])).
69. Perform ! CreateDataPropertyOrThrow(fields, "isoSecond", 𝔽(dateTime.[[ISOSecond]])).
70. Perform ! CreateDataPropertyOrThrow(fields, "isoYear", 𝔽(dateTime.[[ISOYear]])).
71. Perform ! CreateDataPropertyOrThrow(fields, "offset", offset).
72. Perform ! CreateDataPropertyOrThrow(fields, "timeZone", timeZoneRec.[[Receiver]]).
73. Return fields.
    6.3.54 Temporal.ZonedDateTime.prototype.getCalendar ( )
    This method performs the following steps when called:

74. Let zonedDateTime be the this value.
75. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
76. Return ToTemporalCalendarObject(zonedDateTime.[[Calendar]]).
    6.3.55 Temporal.ZonedDateTime.prototype.getTimeZone ( )
    This method performs the following steps when called:

77. Let zonedDateTime be the this value.
78. Perform ? RequireInternalSlot(zonedDateTime, [[InitializedTemporalZonedDateTime]]).
79. Return ToTemporalTimeZoneObject(zonedDateTime.[[TimeZone]]).
    6.4 Properties of Temporal.ZonedDateTime Instances
    Temporal.ZonedDateTime instances are ordinary objects that inherit properties from the %Temporal.ZonedDateTime.prototype% intrinsic object. Temporal.ZonedDateTime instances are initially created with the internal slots described in Table 8.

Table 8: Internal Slots of Temporal.ZonedDateTime Instances
Internal Slot Description
[[InitializedTemporalZonedDateTime]] The only specified use of this slot is for distinguishing Temporal.ZonedDateTime instances from other objects.
[[Nanoseconds]] A BigInt value representing the number of nanoseconds since the epoch.
[[TimeZone]] A String or Object representing the time zone.
[[Calendar]] A String or Object representing the calendar.
6.5 Abstract Operations
6.5.1 InterpretISODateTimeOffset ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNanoseconds, timeZoneRec, disambiguation, offsetOption, matchBehaviour )
The abstract operation InterpretISODateTimeOffset takes arguments year (an integer), month (an integer), day (an integer), hour (an integer), minute (an integer), second (an integer), millisecond (an integer), microsecond (an integer), nanosecond (an integer), offsetBehaviour (one of OPTION, EXACT, or WALL), offsetNanoseconds (an integer), timeZoneRec (a Time Zone Methods Record), disambiguation (one of "earlier", "later", "compatible", or "reject"), offsetOption (one of "ignore", "use", "prefer", or "reject"), and matchBehaviour (one of MATCH-EXACTLY or MATCH-MINUTES) and returns either a normal completion containing a BigInt or an abrupt completion.

It determines the exact time in timeZone corresponding to the given calendar date and time, and the given UTC offset in nanoseconds. In the case of more than one possible exact time, or no possible exact time, an answer is determined using offsetBehaviour, disambiguation and offsetOption.

As a special case when parsing ISO 8601 strings which are only required to specify time zone offsets to minutes precision, if matchBehaviour is MATCH MINUTES, then a value for offsetNanoseconds that is rounded to the nearest minute will be accepted in those cases where offsetNanoseconds is compared against timeZone's offset. If matchBehaviour is MATCH EXACTLY, then this does not happen.

It performs the following steps when called:

1. Assert: IsValidISODate(year, month, day) is true.
2. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-OFFSET-NANOSECONDS-FOR) is true.
3. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-POSSIBLE-INSTANTS-FOR) is true.
4. Let dateTime be ? CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, "iso8601").
5. If offsetBehaviour is WALL, or offsetBehaviour is OPTION and offsetOption is "ignore", then
   a. Let instant be ? GetInstantFor(timeZoneRec, dateTime, disambiguation).
   b. Return instant.[[Nanoseconds]].
6. If offsetBehaviour is EXACT, or offsetBehaviour is OPTION and offsetOption is "use", then
   a. Let epochNanoseconds be GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetNanoseconds).
   b. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
   c. Return epochNanoseconds.
7. Assert: offsetBehaviour is OPTION.
8. Assert: offsetOption is "prefer" or "reject".
9. Let possibleInstants be ? GetPossibleInstantsFor(timeZoneRec, dateTime).
10. If possibleInstants is not empty, then
    a. For each element candidate of possibleInstants, do
    i. Let candidateNanoseconds be ? GetOffsetNanosecondsFor(timeZoneRec, candidate).
    ii. If candidateNanoseconds = offsetNanoseconds, then
11. Return candidate.[[Nanoseconds]].
    iii. If matchBehaviour is MATCH-MINUTES, then
12. Let roundedCandidateNanoseconds be RoundNumberToIncrement(candidateNanoseconds, 60 × 10\*\*9, "halfExpand").
13. If roundedCandidateNanoseconds = offsetNanoseconds, then
    a. Return candidate.[[Nanoseconds]].
14. If offsetOption is "reject", throw a RangeError exception.
15. Let instant be ? DisambiguatePossibleInstants(possibleInstants, timeZoneRec, dateTime, disambiguation).
16. Return instant.[[Nanoseconds]].
    6.5.2 ToTemporalZonedDateTime ( item [ , options ] )
    The abstract operation ToTemporalZonedDateTime takes argument item (an ECMAScript language value) and optional argument options (an Object) and returns either a normal completion containing a Temporal.ZonedDateTime, or a throw completion. It returns its argument item if it is already a Temporal.ZonedDateTime instance, converts item to a new Temporal.ZonedDateTime instance if possible, and throws otherwise. It performs the following steps when called:

17. If options is not present, set options to undefined.
18. Let resolvedOptions be ? SnapshotOwnProperties(! GetOptionsObject(options), null).
19. Let offsetBehaviour be OPTION.
20. Let matchBehaviour be MATCH-EXACTLY.
21. If Type(item) is Object, then
    a. If item has an [[InitializedTemporalZonedDateTime]] internal slot, then
    i. Return item.
    b. Let calendar be ? GetTemporalCalendarSlotValueWithISODefault(item).
    c. Let calendarRec be ? CreateCalendarMethodsRecord(calendar, « DATE-FROM-FIELDS, FIELDS »).
    d. Let fieldNames be ? CalendarFields(calendarRec, « "day", "month", "monthCode", "year" »).
    e. Append "hour", "microsecond", "millisecond", "minute", "nanosecond", "offset", "second", and "timeZone" to fieldNames.
    f. Let fields be ? PrepareTemporalFields(item, fieldNames, « "timeZone" »).
    g. Let timeZone be ! Get(fields, "timeZone").
    h. Set timeZone to ? ToTemporalTimeZoneSlotValue(timeZone).
    i. Let offsetString be ! Get(fields, "offset").
    j. Assert: offsetString is a String or undefined.
    k. If offsetString is undefined, then
    i. Set offsetBehaviour to WALL.
    l. NOTE: The following steps read options and perform independent validation in alphabetical order (ToTemporalDisambiguation reads "disambiguation", ToTemporalOffset reads "offset", and InterpretTemporalDateTimeFields reads "overflow").
    m. Let disambiguation be ? ToTemporalDisambiguation(resolvedOptions).
    n. Let offsetOption be ? ToTemporalOffset(resolvedOptions, "reject").
    o. Let result be ? InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions).
22. Else,
    a. If item is not a String, throw a TypeError exception.
    b. Let result be ? ParseTemporalZonedDateTimeString(item).
    c. Let annotation be result.[[TimeZone]].[[TimeZoneAnnotation]].
    d. Assert: annotation is not undefined.
    e. Let timeZone be ? ToTemporalTimeZoneSlotValue(annotation).
    f. Let offsetString be result.[[TimeZone]].[[OffsetString]].
    g. If result.[[TimeZone]].[[Z]] is true, then
    i. Set offsetBehaviour to EXACT.
    h. Else if offsetString is undefined, then
    i. Set offsetBehaviour to WALL.
    i. Let calendar be result.[[Calendar]].
    j. If calendar is undefined, set calendar to "iso8601".
    k. If IsBuiltinCalendar(calendar) is false, throw a RangeError exception.
    l. Set calendar to the ASCII-lowercase of calendar.
    m. Set matchBehaviour to MATCH-MINUTES.
    n. Let disambiguation be ? ToTemporalDisambiguation(resolvedOptions).
    o. Let offsetOption be ? ToTemporalOffset(resolvedOptions, "reject").
    p. Perform ? ToTemporalOverflow(resolvedOptions).
23. Let offsetNanoseconds be 0.
24. If offsetBehaviour is OPTION, then
    a. Set offsetNanoseconds to ? ParseDateTimeUTCOffset(offsetString).
25. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
26. Let epochNanoseconds be ? InterpretISODateTimeOffset(result.[[Year]], result.[[Month]], result.[[Day]], result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]], offsetBehaviour, offsetNanoseconds, timeZoneRec, disambiguation, offsetOption, matchBehaviour).
27. Return ! CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar).
    6.5.3 CreateTemporalZonedDateTime ( epochNanoseconds, timeZone, calendar [ , newTarget ] )
    The abstract operation CreateTemporalZonedDateTime takes arguments epochNanoseconds (a BigInt), timeZone (a String or Object), and calendar (a String or Object) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.ZonedDateTime, or an abrupt completion. It creates a Temporal.ZonedDateTime instance and fills the internal slots with valid values. It performs the following steps when called:

28. Assert: ! IsValidEpochNanoseconds(epochNanoseconds) is true.
29. If newTarget is not present, set newTarget to %Temporal.ZonedDateTime%.
30. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.ZonedDateTime.prototype%", « [[InitializedTemporalZonedDateTime]], [[Nanoseconds]], [[TimeZone]], [[Calendar]] »).
31. Set object.[[Nanoseconds]] to epochNanoseconds.
32. Set object.[[TimeZone]] to timeZone.
33. Set object.[[Calendar]] to calendar.
34. Return object.
    6.5.4 TemporalZonedDateTimeToString ( zonedDateTime, precision, showCalendar, showTimeZone, showOffset [ , increment [ , unit [ , roundingMode ] ] ] )
    The abstract operation TemporalZonedDateTimeToString takes arguments zonedDateTime (a Temporal.ZonedDateTime), precision (one of "auto", "minute", or an integer between 0 and 9 inclusive), showCalendar (one of "auto", "always", "never", or "critical"), showTimeZone (one of "auto", "never", or "critical"), and showOffset (one of "auto" or "never") and optional arguments increment (an integer), unit (one of "minute", "second", "millisecond", "microsecond", or "nanosecond"), and roundingMode (a String from the Identifier column of Table 19) and returns either a normal completion containing a String or an abrupt completion. It returns an ISO 8601 string representation of its argument, including a time zone name annotation and calendar annotation, which are extensions to the ISO 8601 format. It performs the following steps when called:

35. If increment is not present, set increment to 1.
36. If unit is not present, set unit to "nanosecond".
37. If roundingMode is not present, set roundingMode to "trunc".
38. Let ns be RoundTemporalInstant(zonedDateTime.[[Nanoseconds]], increment, unit, roundingMode).
39. Let timeZone be zonedDateTime.[[TimeZone]].
40. Let instant be ! CreateTemporalInstant(ns).
41. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR »).
42. Let offsetNanoseconds be ? GetOffsetNanosecondsFor(timeZoneRec, instant).
43. Let temporalDateTime be ! GetPlainDateTimeFor(timeZoneRec, instant, "iso8601", offsetNanoseconds).
44. Let dateTimeString be ! TemporalDateTimeToString(temporalDateTime.[[ISOYear]], temporalDateTime.[[ISOMonth]], temporalDateTime.[[ISODay]], temporalDateTime.[[ISOHour]], temporalDateTime.[[ISOMinute]], temporalDateTime.[[ISOSecond]], temporalDateTime.[[ISOMillisecond]], temporalDateTime.[[ISOMicrosecond]], temporalDateTime.[[ISONanosecond]], "iso8601", precision, "never").
45. If showOffset is "never", then
    a. Let offsetString be the empty String.
46. Else,
    a. Let offsetString be FormatDateTimeUTCOffsetRounded(offsetNanoseconds).
47. If showTimeZone is "never", then
    a. Let timeZoneString be the empty String.
48. Else,
    a. Let timeZoneIdentifier be ? ToTemporalTimeZoneIdentifier(timeZone).
    b. If showTimeZone is "critical", let flag be "!"; else let flag be the empty String.
    c. Let timeZoneString be the string-concatenation of the code unit 0x005B (LEFT SQUARE BRACKET), flag, timeZoneIdentifier, and the code unit 0x005D (RIGHT SQUARE BRACKET).
49. Let calendarString be ? MaybeFormatCalendarAnnotation(zonedDateTime.[[Calendar]], showCalendar).
50. Return the string-concatenation of dateTimeString, offsetString, timeZoneString, and calendarString.
    6.5.5 AddZonedDateTime ( epochNanoseconds, timeZoneRec, calendarRec, years, months, weeks, days, norm [ , precalculatedPlainDateTime [ , options ] ] )
    The abstract operation AddZonedDateTime takes arguments epochNanoseconds (a BigInt), timeZoneRec (a Time Zone Methods Record), calendarRec (a Calendar Methods Record), years (an integer), months (an integer), weeks (an integer), days (an integer), and norm (a Normalized Time Duration Record) and optional arguments precalculatedPlainDateTime (a Temporal.PlainDateTime or undefined) and options (an Object) and returns either a normal completion containing a BigInt or an abrupt completion. It adds a duration in various units to a number of nanoseconds epochNanoseconds since the epoch, subject to the rules of the time zone and calendar, and returns the result as a BigInt value. As specified in RFC 5545, the date portion of the duration is added in calendar days, and the time portion is added in exact time.

Unless precalculatedPlainDateTime is supplied, the given timeZone's getOffsetNanosecondsFor method will be called to convert epochNanoseconds to a wall-clock time, and timeZoneRec must have looked up getOffsetNanosecondsFor. getPossibleInstantsFor will always be called and must have been looked up.

1. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-POSSIBLE-INSTANTS-FOR) is true.
2. If precalculatedPlainDateTime is not present, set precalculatedPlainDateTime to undefined.
3. Assert: If precalculatedPlainDateTime is undefined, TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-OFFSET-NANOSECONDS-FOR) is true.
4. If options is not present, set options to undefined.
5. Assert: Type(options) is Object or Undefined.
6. If years = 0, months = 0, weeks = 0, and days = 0, then
   a. Return ? AddInstant(epochNanoseconds, norm).
7. Let instant be ! CreateTemporalInstant(epochNanoseconds).
8. If precalculatedPlainDateTime is not undefined, then
   a. Let temporalDateTime be precalculatedPlainDateTime.
9. Else,
   a. Let temporalDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.[[Receiver]]).
10. If years = 0, and months = 0, and weeks = 0, then
    a. Let overflow be ? ToTemporalOverflow(options).
    b. Let intermediate be ? AddDaysToZonedDateTime(instant, temporalDateTime, timeZoneRec, calendarRec.[[Receiver]], days, overflow).[[EpochNanoseconds]].
    c. Return ? AddInstant(intermediate, norm).
11. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-ADD) is true.
12. Let datePart be ! CreateTemporalDate(temporalDateTime.[[ISOYear]], temporalDateTime.[[ISOMonth]], temporalDateTime.[[ISODay]], calendarRec.[[Receiver]]).
13. Let dateDuration be ! CreateTemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0).
14. Let addedDate be ? CalendarDateAdd(calendarRec, datePart, dateDuration, options).
15. Let intermediateDateTime be ? CreateTemporalDateTime(addedDate.[[ISOYear]], addedDate.[[ISOMonth]], addedDate.[[ISODay]], temporalDateTime.[[ISOHour]], temporalDateTime.[[ISOMinute]], temporalDateTime.[[ISOSecond]], temporalDateTime.[[ISOMillisecond]], temporalDateTime.[[ISOMicrosecond]], temporalDateTime.[[ISONanosecond]], calendarRec.[[Receiver]]).
16. Let intermediateInstant be ? GetInstantFor(timeZoneRec, intermediateDateTime, "compatible").
17. Return ? AddInstant(intermediateInstant.[[Nanoseconds]], norm).
    6.5.6 AddDaysToZonedDateTime ( instant, dateTime, timeZoneRec, calendar, days [ , overflow ] )
    The abstract operation AddDaysToZonedDateTime takes arguments instant (a Temporal.Instant), dateTime (a Temporal.PlainDateTime), timeZoneRec (a Time Zone Methods Record), calendar (a String or Object), and days (an integer) and optional argument overflow ("constrain" or "reject") and returns either a normal completion containing a Record, or an abrupt completion. The returned Record has fields [[EpochNanoseconds]] (a BigInt), [[Instant]] (a Temporal.Instant), and [[DateTime]] (a Temporal.PlainDateTime).

This operation is similar to AddZonedDateTime, but adds only a number of days instead of a full duration, which allows performing fewer observable operations.

1. Assert: If TimeZoneMethodsRecordIsBuiltin(timeZoneRec) is true, dateTime's internal slots are the same as those of the Object returned from ! GetPlainDateTimeFor(timeZoneRec, instant, calendar).
2. If overflow is not present, set overflow to "constrain".
3. If days = 0, then
   a. Return the Record { [[EpochNanoseconds]]: instant.[[Nanoseconds]], [[Instant]]: instant, [[DateTime]]: dateTime }.
4. Let addedDate be ? AddISODate(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], 0, 0, 0, days, overflow).
5. Let dateTimeResult be ? CreateTemporalDateTime(addedDate.[[Year]], addedDate.[[Month]], addedDate.[[Day]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], calendar).
6. Let instantResult be ? GetInstantFor(timeZoneRec, dateTimeResult, "compatible").
7. Return the Record { [[EpochNanoseconds]]: instantResult.[[Nanoseconds]], [[Instant]]: instantResult, [[DateTime]]: dateTimeResult }.
   6.5.7 DifferenceZonedDateTime ( ns1, ns2, timeZoneRec, calendarRec, largestUnit, options, precalculatedPlainDateTime )
   The abstract operation DifferenceZonedDateTime takes arguments ns1 (a BigInt), ns2 (a BigInt), timeZoneRec (a Time Zone Methods Record), calendarRec (a Calendar Methods Record), largestUnit (a String), options (an ordinary Object for which the value of the [[Prototype]] internal slot is null and every property is a data property), and precalculatedPlainDateTime (a Temporal.PlainDateTime or undefined) and returns either a normal completion containing a Normalized Duration Record, or a throw completion. It computes the difference between two exact times expressed in nanoseconds since the epoch, and balances the result so that there is no non-zero unit larger than largestUnit in the result, taking calendar reckoning and time zone offset changes into account.

Unless ns1 and ns2 are equal, timeZoneRec must have looked up both getOffsetNanosecondsFor and getPossibleInstantsFor.

1. If ns1 is ns2, then
   a. Return ! CreateNormalizedDurationRecord(0, 0, 0, 0, ZeroTimeDuration()).
2. If precalculatedPlainDateTime is undefined, then
   a. Let startInstant be ! CreateTemporalInstant(ns1).
   b. Let startDateTime be ? GetPlainDateTimeFor(timeZoneRec, startInstant, calendarRec.[[Receiver]]).
3. Else,
   a. Let startDateTime be precalculatedPlainDateTime.
4. Let endInstant be ! CreateTemporalInstant(ns2).
5. Let endDateTime be ? GetPlainDateTimeFor(timeZoneRec, endInstant, calendarRec.[[Receiver]]).
6. Let dateDifference be ? DifferenceISODateTime(startDateTime.[[ISOYear]], startDateTime.[[ISOMonth]], startDateTime.[[ISODay]], startDateTime.[[ISOHour]], startDateTime.[[ISOMinute]], startDateTime.[[ISOSecond]], startDateTime.[[ISOMillisecond]], startDateTime.[[ISOMicrosecond]], startDateTime.[[ISONanosecond]], endDateTime.[[ISOYear]], endDateTime.[[ISOMonth]], endDateTime.[[ISODay]], endDateTime.[[ISOHour]], endDateTime.[[ISOMinute]], endDateTime.[[ISOSecond]], endDateTime.[[ISOMillisecond]], endDateTime.[[ISOMicrosecond]], endDateTime.[[ISONanosecond]], calendarRec, largestUnit, options).
7. Let intermediateNs be ? AddZonedDateTime(ns1, timeZoneRec, calendarRec, dateDifference.[[Years]], dateDifference.[[Months]], dateDifference.[[Weeks]], 0, ZeroTimeDuration(), startDateTime).
8. Let norm be NormalizedTimeDurationFromEpochNanosecondsDifference(ns2, intermediateNs).
9. Let intermediate be ! CreateTemporalZonedDateTime(intermediateNs, timeZoneRec.[[Receiver]], calendarRec.[[Receiver]]).
10. Let result be ? NormalizedTimeDurationToDays(norm, intermediate, timeZoneRec).
11. Return ! CreateNormalizedDurationRecord(dateDifference.[[Years]], dateDifference.[[Months]], dateDifference.[[Weeks]], result.[[Days]], result.[[Remainder]]).
    6.5.8 NormalizedTimeDurationToDays ( norm, zonedRelativeTo, timeZoneRec [ , precalculatedPlainDateTime ] )
    The abstract operation NormalizedTimeDurationToDays takes arguments norm (a Normalized Time Duration Record), zonedRelativeTo (a Temporal.ZonedDateTime), and timeZoneRec (a Time Zone Methods Record) and optional argument precalculatedPlainDateTime (a Temporal.PlainDateTime) and returns either a normal completion containing a Record with fields [[Days]] (an integer), [[Remainder]] (a Normalized Time Duration Record), and [[DayLength]] (an integer), or an abrupt completion. It converts a normalized time duration norm relative to a Temporal.ZonedDateTime zonedRelativeTo into a number of days and a remainder normalized time duration, taking into account any offset changes in the time zone of zonedRelativeTo. It also returns the length of the last day in nanoseconds, for rounding purposes.

Unless nanoseconds = 0, timeZoneRec must have looked up both getOffsetNanosecondsFor and getPossibleInstantsFor.

1. Let sign be NormalizedTimeDurationSign(norm).
2. If sign = 0, then
   a. Return the Record { [[Days]]: 0, [[Remainder]]: norm, [[DayLength]]: nsPerDay }.
3. Let startNs be zonedRelativeTo.[[Nanoseconds]].
4. Let startInstant be ! CreateTemporalInstant(startNs).
5. Let endNs be ? AddInstant(startNs, norm).
6. Let endInstant be ! CreateTemporalInstant(endNs).
7. If precalculatedPlainDateTime is present, let startDateTime be precalculatedPlainDateTime; else let startDateTime be ? GetPlainDateTimeFor(timeZoneRec, startInstant, "iso8601").
8. Let endDateTime be ? GetPlainDateTimeFor(timeZoneRec, endInstant, "iso8601").
9. Let date1 be ! CreateTemporalDate(startDateTime.[[ISOYear]], startDateTime.[[ISOMonth]], startDateTime.[[ISODay]], "iso8601").
10. Let date2 be ! CreateTemporalDate(endDateTime.[[ISOYear]], endDateTime.[[ISOMonth]], endDateTime.[[ISODay]], "iso8601").
11. Let days be DaysUntil(date1, date2).
12. Let timeSign be CompareTemporalTime(startDateTime.[[ISOHour]], startDateTime.[[ISOMinute]], startDateTime.[[ISOSecond]], startDateTime.[[ISOMillisecond]], startDateTime.[[ISOMicrosecond]], startDateTime.[[ISONanosecond]], endDateTime.[[ISOHour]], endDateTime.[[ISOMinute]], endDateTime.[[ISOSecond]], endDateTime.[[ISOMillisecond]], endDateTime.[[ISOMicrosecond]], endDateTime.[[ISONanosecond]]).
13. If days > 0 and timeSign > 0, then
    a. Set days to days - 1.
14. Else if days < 0 and timeSign < 0, then
    a. Set days to days + 1.
15. Let relativeResult be ? AddDaysToZonedDateTime(startInstant, startDateTime, timeZoneRec, zonedRelativeTo.[[Calendar]], days).
16. If sign = 1, and days > 0, and ℝ(relativeResult.[[EpochNanoseconds]]) > endNs, then
    a. Set days to days - 1.
    b. Set relativeResult to ? AddDaysToZonedDateTime(startInstant, startDateTime, timeZoneRec, zonedRelativeTo.[[Calendar]], days).
    c. If days > 0 and ℝ(relativeResult.[[EpochNanoseconds]]) > endNs, throw a RangeError exception.
17. Set norm to NormalizedTimeDurationFromEpochNanosecondsDifference(endNs, relativeResult.[[EpochNanoseconds]]).
18. Let oneDayFarther be ? AddDaysToZonedDateTime(relativeResult.[[Instant]], relativeResult.[[DateTime]], timeZoneRec, zonedRelativeTo.[[Calendar]], sign).
19. Let dayLengthNs be NormalizedTimeDurationFromEpochNanosecondsDifference(oneDayFarther.[[EpochNanoseconds]], relativeResult.[[EpochNanoseconds]]).
20. Let oneDayLess be ! SubtractNormalizedTimeDuration(norm, dayLengthNs).
21. If NormalizedTimeDurationSign(oneDayLess) × sign ≥ 0, then
    a. Set norm to oneDayLess.
    b. Set relativeResult to oneDayFarther.
    c. Set days to days + sign.
    d. Set oneDayFarther to ? AddDaysToZonedDateTime(relativeResult.[[Instant]], relativeResult.[[DateTime]], timeZoneRec, zonedRelativeTo.[[Calendar]], sign).
    e. Set dayLengthNs to NormalizedTimeDurationFromEpochNanosecondsDifference(oneDayFarther.[[EpochNanoseconds]], relativeResult.[[EpochNanoseconds]]).
    f. If NormalizedTimeDurationSign(! SubtractNormalizedTimeDuration(norm, dayLengthNs)) × sign ≥ 0, then
    i. Throw a RangeError exception.
22. If days < 0 and sign = 1, throw a RangeError exception.
23. If days > 0 and sign = -1, throw a RangeError exception.
24. If sign = -1, then
    a. If NormalizedTimeDurationSign(norm) = 1, throw a RangeError exception.
25. Else,
    a. Assert: NormalizedTimeDurationSign(norm) ≥ 0.
26. Assert: CompareNormalizedTimeDuration(NormalizedTimeDurationAbs(norm), NormalizedTimeDurationAbs(dayLengthNs)) = -1.
27. Let dayLength be abs(ℝ(dayLengthNs.[[TotalNanoseconds]])).
28. If dayLength ≥ 2\*\*53, throw a RangeError exception.
29. Assert: abs(days) < 2\*\*53 / (HoursPerDay × MinutesPerHour × SecondsPerMinute).
30. Return the Record { [[Days]]: days, [[Remainder]]: norm, [[DayLength]]: dayLength }.
    6.5.9 DifferenceTemporalZonedDateTime ( operation, zonedDateTime, other, options )
    The abstract operation DifferenceTemporalZonedDateTime takes arguments operation (UNTIL or SINCE), zonedDateTime (a Temporal.ZonedDateTime), other (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.Duration or an abrupt completion. It computes the difference between the two times represented by zonedDateTime and other, optionally rounds it, and returns it as a Temporal.Duration object. It performs the following steps when called:

31. If operation is SINCE, let sign be -1. Otherwise, let sign be 1.
32. Set other to ? ToTemporalZonedDateTime(other).
33. If ? CalendarEquals(zonedDateTime.[[Calendar]], other.[[Calendar]]) is false, then
    a. Throw a RangeError exception.
34. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
35. Let settings be ? GetDifferenceSettings(operation, resolvedOptions, DATETIME, « », "nanosecond", "hour").
36. If settings.[[LargestUnit]] is not one of "year", "month", "week", or "day", then
    a. Let norm be DifferenceInstant(zonedDateTime.[[Nanoseconds]], other.[[Nanoseconds]], settings.[[RoundingIncrement]], settings.[[SmallestUnit]], settings.[[RoundingMode]]).
    b. Let result be BalanceTimeDuration(norm, settings.[[LargestUnit]]).
    c. Return ! CreateTemporalDuration(0, 0, 0, 0, sign × result.[[Hours]], sign × result.[[Minutes]], sign × result.[[Seconds]], sign × result.[[Milliseconds]], sign × result.[[Microseconds]], sign × result.[[Nanoseconds]]).
37. NOTE: To calculate differences in two different time zones, settings.[[LargestUnit]] must be "hour" or smaller, because day lengths can vary between time zones due to DST and other UTC offset shifts.
38. If ? TimeZoneEquals(zonedDateTime.[[TimeZone]], other.[[TimeZone]]) is false, then
    a. Throw a RangeError exception.
39. If zonedDateTime.[[Nanoseconds]] = other.[[Nanoseconds]], then
    a. Return ! CreateTemporalDuration(0, 0, 0, 0, 0, 0, 0, 0, 0, 0).
40. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
41. Let calendarRec be ? CreateCalendarMethodsRecord(zonedDateTime.[[Calendar]], « DATE-ADD, DATE-UNTIL »).
42. Let instant be ! CreateTemporalInstant(zonedDateTime.[[Nanoseconds]]).
43. Let precalculatedPlainDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.[[Receiver]]).
44. Let plainRelativeTo be ! CreateTemporalDate(precalculatedPlainDateTime.[[ISOYear]], precalculatedPlainDateTime.[[ISOMonth]], precalculatedPlainDateTime.[[ISODay]], calendarRec.[[Receiver]]).
45. Let result be ? DifferenceZonedDateTime(zonedDateTime.[[Nanoseconds]], other.[[Nanoseconds]], timeZoneRec, calendarRec, settings.[[LargestUnit]], resolvedOptions, precalculatedPlainDateTime).
46. If settings.[[SmallestUnit]] is "nanosecond" and settings.[[RoundingIncrement]] is 1, let roundingGranularityIsNoop be true; else let roundingGranularityIsNoop be false.
47. If roundingGranularityIsNoop is false, then
    a. Let roundRecord be ? RoundDuration(result.[[Years]], result.[[Months]], result.[[Weeks]], result.[[Days]], result.[[NormalizedTime]], settings.[[RoundingIncrement]], settings.[[SmallestUnit]], settings.[[RoundingMode]], plainRelativeTo, calendarRec, zonedDateTime, timeZoneRec, precalculatedPlainDateTime).
    b. Let roundResult be roundRecord.[[NormalizedDuration]].
    c. Let daysResult be ! NormalizedTimeDurationToDays(roundResult.[[NormalizedTime]], zonedDateTime, timeZoneRec).
    d. Let days be roundResult.[[Days]] + daysResult.[[Days]].
    e. Let adjustResult be ? AdjustRoundedDurationDays(roundResult.[[Years]], roundResult.[[Months]], roundResult.[[Weeks]], days, daysResult.[[NormalizedTime]], settings.[[RoundingIncrement]], settings.[[SmallestUnit]], settings.[[RoundingMode]], zonedDateTime, calendarRec, timeZoneRec, precalculatedPlainDateTime).
    f. Let balanceResult be ? BalanceDateDurationRelative(adjustResult.[[Years]], adjustResult.[[Months]], adjustResult.[[Weeks]], adjustResult.[[Days]], settings.[[LargestUnit]], settings.[[SmallestUnit]], plainRelativeTo, calendarRec).
    g. Set result to ? CombineDateAndNormalizedTimeDuration(balanceResult, adjustResult.[[NormalizedTime]]).
48. Let timeResult be BalanceTimeDuration(result.[[NormalizedTime]], "hour").
49. Return ! CreateTemporalDuration(sign × result.[[Years]], sign × result.[[Months]], sign × result.[[Weeks]], sign × result.[[Days]], sign × timeResult.[[Hours]], sign × timeResult.[[Minutes]], sign × timeResult.[[Seconds]], sign × timeResult.[[Milliseconds]], sign × timeResult.[[Microseconds]], sign × timeResult.[[Nanoseconds]]).
    6.5.10 AddDurationToOrSubtractDurationFromZonedDateTime ( operation, zonedDateTime, temporalDurationLike, options )
    The abstract operation AddDurationToOrSubtractDurationFromZonedDateTime takes arguments operation (ADD or SUBTRACT), zonedDateTime (a Temporal.ZonedDateTime), temporalDurationLike (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.ZonedDateTime or an abrupt completion. It adds/subtracts temporalDurationLike to/from zonedDateTime. It performs the following steps when called:

50. If operation is SUBTRACT, let sign be -1. Otherwise, let sign be 1.
51. Let duration be ? ToTemporalDurationRecord(temporalDurationLike).
52. Set options to ? GetOptionsObject(options).
53. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(zonedDateTime.[[TimeZone]], « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
54. Let calendarRec be ? CreateCalendarMethodsRecord(zonedDateTime.[[Calendar]], « DATE-ADD »).
55. Let norm be NormalizeTimeDuration(sign × duration.[[Hours]], sign × duration.[[Minutes]], sign × duration.[[Seconds]], sign × duration.[[Milliseconds]], sign × duration.[[Microseconds]], sign × duration.[[Nanoseconds]]).
56. Let epochNanoseconds be ? AddZonedDateTime(zonedDateTime.[[Nanoseconds]], timeZoneRec, calendarRec, sign × duration.[[Years]], sign × duration.[[Months]], sign × duration.[[Weeks]], sign × duration.[[Days]], norm, undefined, options).
57. Return ! CreateTemporalZonedDateTime(epochNanoseconds, timeZoneRec.[[Receiver]], calendarRec.[[Receiver]]).
    7 Temporal.Duration Objects
    A Temporal.Duration object describes the difference in elapsed time between two other Temporal objects of the same type: Instant, PlainDate, PlainDateTime, PlainTime, PlainYearMonth, or ZonedDateTime. Objects of this type are only created via the .since() and .until() methods of these objects.

7.1 The Temporal.Duration Constructor
The Temporal.Duration constructor:

creates and initializes a new Temporal.Duration object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.Duration behaviour must include a super call to the %Temporal.Duration% constructor to create and initialize subclass instances with the necessary internal slots.
7.1.1 Temporal.Duration ( [ years [ , months [ , weeks [ , days [ , hours [ , minutes [ , seconds [ , milliseconds [ , microseconds [ , nanoseconds ] ] ] ] ] ] ] ] ] ] )
The Temporal.Duration function performs the following steps when called:

1. If NewTarget is undefined, then
   a. Throw a TypeError exception.
2. If years is undefined, let y be 0; else let y be ? ToIntegerIfIntegral(years).
3. If months is undefined, let mo be 0; else let mo be ? ToIntegerIfIntegral(months).
4. If weeks is undefined, let w be 0; else let w be ? ToIntegerIfIntegral(weeks).
5. If days is undefined, let d be 0; else let d be ? ToIntegerIfIntegral(days).
6. If hours is undefined, let h be 0; else let h be ? ToIntegerIfIntegral(hours).
7. If minutes is undefined, let m be 0; else let m be ? ToIntegerIfIntegral(minutes).
8. If seconds is undefined, let s be 0; else let s be ? ToIntegerIfIntegral(seconds).
9. If milliseconds is undefined, let ms be 0; else let ms be ? ToIntegerIfIntegral(milliseconds).
10. If microseconds is undefined, let mis be 0; else let mis be ? ToIntegerIfIntegral(microseconds).
11. If nanoseconds is undefined, let ns be 0; else let ns be ? ToIntegerIfIntegral(nanoseconds).
12. Return ? CreateTemporalDuration(y, mo, w, d, h, m, s, ms, mis, ns, NewTarget).
    7.2 Properties of the Temporal.Duration Constructor
    The value of the [[Prototype]] internal slot of the Temporal.Duration constructor is the intrinsic object %Function.prototype%.

The Temporal.Duration constructor has the following properties:

7.2.1 Temporal.Duration.prototype
The initial value of Temporal.Duration.prototype is %Temporal.Duration.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

7.2.2 Temporal.Duration.from ( item )
The Temporal.Duration.from function performs the following steps when called:

1. If Type(item) is Object and item has an [[InitializedTemporalDuration]] internal slot, then
   a. Return ! CreateTemporalDuration(item.[[Years]], item.[[Months]], item.[[Weeks]], item.[[Days]], item.[[Hours]], item.[[Minutes]], item.[[Seconds]], item.[[Milliseconds]], item.[[Microseconds]], item.[[Nanoseconds]]).
2. Return ? ToTemporalDuration(item).
   7.2.3 Temporal.Duration.compare ( one, two [ , options ] )
   The Temporal.Duration.compare function performs the following steps when called:

3. Set one to ? ToTemporalDuration(one).
4. Set two to ? ToTemporalDuration(two).
5. Set options to ? GetOptionsObject(options).
6. If one.[[Years]] = two.[[Years]], and one.[[Months]] = two.[[Months]], and one.[[Weeks]] = two.[[Weeks]], and one.[[Days]] = two.[[Days]], and one.[[Hours]] = two.[[Hours]], and one.[[Minutes]] = two.[[Minutes]], and one.[[Seconds]] = two.[[Seconds]], and one.[[Millieconds]] = two.[[Millieconds]], and one.[[Microseconds]] = two.[[Microseconds]], and one.[[Nanoseconds]] = two.[[Nanoseconds]], then
   a. Return +0𝔽.
7. Let relativeToRecord be ? ToRelativeTemporalObject(options).
8. Let zonedRelativeTo be relativeToRecord.[[ZonedRelativeTo]].
9. Let plainRelativeTo be relativeToRecord.[[PlainRelativeTo]].
10. Let timeZoneRec be relativeToRecord.[[TimeZoneRec]].
11. Let calendarUnitsPresent be false.
12. If one.[[Years]] ≠ 0, or two.[[Years]] ≠ 0, or one.[[Months]] ≠ 0, or two.[[Months]] ≠ 0, or one.[[Weeks]] ≠ 0, or two.[[Weeks]] ≠ 0, set calendarUnitsPresent to true.
13. Let calendarRec be ? CreateCalendarMethodsRecordFromRelativeTo(plainRelativeTo, zonedRelativeTo, « DATE-ADD »).
14. If zonedRelativeTo is not undefined, and either calendarUnitsPresent is true, or one.[[Days]] ≠ 0, or two.[[Days]] ≠ 0, then
    a. Let instant be ! CreateTemporalInstant(zonedRelativeTo.[[Nanoseconds]]).
    b. Let precalculatedPlainDateTime be ? GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.[[Receiver]]).
    c. Let norm1 be NormalizeTimeDuration(one.[[Hours]], one.[[Minutes]], one.[[Seconds]], one.[[Milliseconds]], one.[[Microseconds]], one.[[Nanoseconds]]).
    d. Let norm2 be NormalizeTimeDuration(two.[[Hours]], two.[[Minutes]], two.[[Seconds]], two.[[Milliseconds]], two.[[Microseconds]], two.[[Nanoseconds]]).
    e. Let after1 be ? AddZonedDateTime(zonedRelativeTo.[[Nanoseconds]], timeZoneRec, calendarRec, one.[[Years]], one.[[Months]], one.[[Weeks]], one.[[Days]], norm1, precalculatedPlainDateTime).
    f. Let after2 be ? AddZonedDateTime(zonedRelativeTo.[[Nanoseconds]], timeZoneRec, calendarRec, two.[[Years]], two.[[Months]], two.[[Weeks]], two.[[Days]], norm2, precalculatedPlainDateTime).
    g. If after1 > after2, return 1𝔽.
    h. If after1 < after2, return -1𝔽.
    i. Return +0𝔽.
15. If calendarUnitsPresent is true, then
    a. Let unbalanceResult1 be ? UnbalanceDateDurationRelative(one.[[Years]], one.[[Months]], one.[[Weeks]], one.[[Days]], "day", plainRelativeTo, calendarRec).
    b. Let unbalanceResult2 be ? UnbalanceDateDurationRelative(two.[[Years]], two.[[Months]], two.[[Weeks]], two.[[Days]], "day", plainRelativeTo, calendarRec).
    c. Let days1 be unbalanceResult1.[[Days]].
    d. Let days2 be unbalanceResult2.[[Days]].
16. Else,
    a. Let days1 be one.[[Days]].
    b. Let days2 be two.[[Days]].
17. Let norm1 be NormalizeTimeDuration(one.[[Hours]], one.[[Minutes]], one.[[Seconds]], one.[[Milliseconds]], one.[[Microseconds]], one.[[Nanoseconds]]).
18. Set norm1 to ? Add24HourDaysToNormalizedTimeDuration(norm1, days1).
19. Let norm2 be NormalizeTimeDuration(two.[[Hours]], two.[[Minutes]], two.[[Seconds]], two.[[Milliseconds]], two.[[Microseconds]], two.[[Nanoseconds]]).
20. Set norm2 to ? Add24HourDaysToNormalizedTimeDuration(norm2, days2).
21. Return 𝔽(CompareNormalizedTimeDuration(norm1, norm2)).
    7.3 Properties of the Temporal.Duration Prototype Object
    The Temporal.Duration prototype object

is itself an ordinary object.
is not a Temporal.Duration instance and doesn't have an [[InitializedTemporalDuration]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
7.3.1 Temporal.Duration.prototype.constructor
The initial value of Temporal.Duration.prototype.constructor is %Temporal.Duration%.

7.3.2 Temporal.Duration.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.Duration".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

7.3.3 get Temporal.Duration.prototype.years
Temporal.Duration.prototype.years is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let duration be the this value.
2. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
3. Return 𝔽(duration.[[Years]]).
   7.3.4 get Temporal.Duration.prototype.months
   Temporal.Duration.prototype.months is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

4. Let duration be the this value.
5. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
6. Return 𝔽(duration.[[Months]]).
   7.3.5 get Temporal.Duration.prototype.weeks
   Temporal.Duration.prototype.weeks is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

7. Let duration be the this value.
8. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
9. Return 𝔽(duration.[[Weeks]]).
   7.3.6 get Temporal.Duration.prototype.days
   Temporal.Duration.prototype.days is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

10. Let duration be the this value.
11. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
12. Return 𝔽(duration.[[Days]]).
    7.3.7 get Temporal.Duration.prototype.hours
    Temporal.Duration.prototype.hours is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

13. Let duration be the this value.
14. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
15. Return 𝔽(duration.[[Hours]]).
    7.3.8 get Temporal.Duration.prototype.minutes
    Temporal.Duration.prototype.minutes is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

16. Let duration be the this value.
17. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
18. Return 𝔽(duration.[[Minutes]]).
    7.3.9 get Temporal.Duration.prototype.seconds
    Temporal.Duration.prototype.seconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

19. Let duration be the this value.
20. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
21. Return 𝔽(duration.[[Seconds]]).
    7.3.10 get Temporal.Duration.prototype.milliseconds
    Temporal.Duration.prototype.milliseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

22. Let duration be the this value.
23. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
24. Return 𝔽(duration.[[Milliseconds]]).
    7.3.11 get Temporal.Duration.prototype.microseconds
    Temporal.Duration.prototype.microseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

25. Let duration be the this value.
26. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
27. Return 𝔽(duration.[[Microseconds]]).
    7.3.12 get Temporal.Duration.prototype.nanoseconds
    Temporal.Duration.prototype.nanoseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

28. Let duration be the this value.
29. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
30. Return 𝔽(duration.[[Nanoseconds]]).
    7.3.13 get Temporal.Duration.prototype.sign
    Temporal.Duration.prototype.sign is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

31. Let duration be the this value.
32. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
33. Return 𝔽(! DurationSign(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]])).
    7.3.14 get Temporal.Duration.prototype.blank
    Temporal.Duration.prototype.blank is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

34. Let duration be the this value.
35. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
36. Let sign be ! DurationSign(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
37. If sign = 0, return true.
38. Return false.
    7.3.15 Temporal.Duration.prototype.with ( temporalDurationLike )
    The Temporal.Duration.prototype.with method performs the following steps when called:

39. Let duration be the this value.
40. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
41. Let temporalDurationLike be ? ToTemporalPartialDurationRecord(temporalDurationLike).
42. If temporalDurationLike.[[Years]] is not undefined, then
    a. Let years be temporalDurationLike.[[Years]].
43. Else,
    a. Let years be duration.[[Years]].
44. If temporalDurationLike.[[Months]] is not undefined, then
    a. Let months be temporalDurationLike.[[Months]].
45. Else,
    a. Let months be duration.[[Months]].
46. If temporalDurationLike.[[Weeks]] is not undefined, then
    a. Let weeks be temporalDurationLike.[[Weeks]].
47. Else,
    a. Let weeks be duration.[[Weeks]].
48. If temporalDurationLike.[[Days]] is not undefined, then
    a. Let days be temporalDurationLike.[[Days]].
49. Else,
    a. Let days be duration.[[Days]].
50. If temporalDurationLike.[[Hours]] is not undefined, then
    a. Let hours be temporalDurationLike.[[Hours]].
51. Else,
    a. Let hours be duration.[[Hours]].
52. If temporalDurationLike.[[Minutes]] is not undefined, then
    a. Let minutes be temporalDurationLike.[[Minutes]].
53. Else,
    a. Let minutes be duration.[[Minutes]].
54. If temporalDurationLike.[[Seconds]] is not undefined, then
    a. Let seconds be temporalDurationLike.[[Seconds]].
55. Else,
    a. Let seconds be duration.[[Seconds]].
56. If temporalDurationLike.[[Milliseconds]] is not undefined, then
    a. Let milliseconds be temporalDurationLike.[[Milliseconds]].
57. Else,
    a. Let milliseconds be duration.[[Milliseconds]].
58. If temporalDurationLike.[[Microseconds]] is not undefined, then
    a. Let microseconds be temporalDurationLike.[[Microseconds]].
59. Else,
    a. Let microseconds be duration.[[Microseconds]].
60. If temporalDurationLike.[[Nanoseconds]] is not undefined, then
    a. Let nanoseconds be temporalDurationLike.[[Nanoseconds]].
61. Else,
    a. Let nanoseconds be duration.[[Nanoseconds]].
62. Return ? CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds).
    7.3.16 Temporal.Duration.prototype.negated ( )
    The Temporal.Duration.prototype.negated method performs the following steps when called:

63. Let duration be the this value.
64. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
65. Return ! CreateNegatedTemporalDuration(duration).
    7.3.17 Temporal.Duration.prototype.abs ( )
    The Temporal.Duration.prototype.abs method performs the following steps when called:

66. Let duration be the this value.
67. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
68. Return ! CreateTemporalDuration(abs(duration.[[Years]]), abs(duration.[[Months]]), abs(duration.[[Weeks]]), abs(duration.[[Days]]), abs(duration.[[Hours]]), abs(duration.[[Minutes]]), abs(duration.[[Seconds]]), abs(duration.[[Milliseconds]]), abs(duration.[[Microseconds]]), abs(duration.[[Nanoseconds]])).
    7.3.18 Temporal.Duration.prototype.add ( other [ , options ] )
    The Temporal.Duration.prototype.add method performs the following steps when called:

69. Let duration be the this value.
70. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
71. Return ? AddDurationToOrSubtractDurationFromDuration(ADD, duration, other, options).
    7.3.19 Temporal.Duration.prototype.subtract ( other [ , options ] )
    The Temporal.Duration.prototype.subtract method performs the following steps when called:

72. Let duration be the this value.
73. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
74. Return ? AddDurationToOrSubtractDurationFromDuration(SUBTRACT, duration, other, options).
    7.3.20 Temporal.Duration.prototype.round ( roundTo )
    The Temporal.Duration.prototype.round method performs the following steps when called:

75. Let duration be the this value.
76. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
77. If roundTo is undefined, then
    a. Throw a TypeError exception.
78. If Type(roundTo) is String, then
    a. Let paramString be roundTo.
    b. Set roundTo to OrdinaryObjectCreate(null).
    c. Perform ! CreateDataPropertyOrThrow(roundTo, "smallestUnit", paramString).
79. Else,
    a. Set roundTo to ? GetOptionsObject(roundTo).
80. Let smallestUnitPresent be true.
81. Let largestUnitPresent be true.
82. NOTE: The following steps read options and perform independent validation in alphabetical order (ToRelativeTemporalObject reads "relativeTo", ToTemporalRoundingIncrement reads "roundingIncrement" and ToTemporalRoundingMode reads "roundingMode").
83. Let largestUnit be ? GetTemporalUnit(roundTo, "largestUnit", DATETIME, undefined, « "auto" »).
84. Let relativeToRecord be ? ToRelativeTemporalObject(roundTo).
85. Let zonedRelativeTo be relativeToRecord.[[ZonedRelativeTo]].
86. Let plainRelativeTo be relativeToRecord.[[PlainRelativeTo]].
87. Let timeZoneRec be relativeToRecord.[[TimeZoneRec]].
88. Let roundingIncrement be ? ToTemporalRoundingIncrement(roundTo).
89. Let roundingMode be ? ToTemporalRoundingMode(roundTo, "halfExpand").
90. Let smallestUnit be ? GetTemporalUnit(roundTo, "smallestUnit", DATETIME, undefined).
91. If smallestUnit is undefined, then
    a. Set smallestUnitPresent to false.
    b. Set smallestUnit to "nanosecond".
92. Let existingLargestUnit be ! DefaultTemporalLargestUnit(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]]).
93. Let defaultLargestUnit be LargerOfTwoTemporalUnits(existingLargestUnit, smallestUnit).
94. If largestUnit is undefined, then
    a. Set largestUnitPresent to false.
    b. Set largestUnit to defaultLargestUnit.
95. Else if largestUnit is "auto", then
    a. Set largestUnit to defaultLargestUnit.
96. If smallestUnitPresent is false and largestUnitPresent is false, then
    a. Throw a RangeError exception.
97. If LargerOfTwoTemporalUnits(largestUnit, smallestUnit) is not largestUnit, throw a RangeError exception.
98. Let maximum be MaximumTemporalDurationRoundingIncrement(smallestUnit).
99. If maximum is not undefined, perform ? ValidateTemporalRoundingIncrement(roundingIncrement, maximum, false).
100. Let hoursToDaysConversionMayOccur be false.
101. If duration.[[Days]] ≠ 0 and zonedRelativeTo is not undefined, set hoursToDaysConversionMayOccur to true.
102. Else if abs(duration.[[Hours]]) ≥ 24, set hoursToDaysConversionMayOccur to true.
103. If smallestUnit is "nanosecond" and roundingIncrement = 1, let roundingGranularityIsNoop be true; else let roundingGranularityIsNoop be false.
104. If duration.[[Years]] = 0 and duration.[[Months]] = 0 and duration.[[Weeks]] = 0, let calendarUnitsPresent be false; else let calendarUnitsPresent be true.
105. If roundingGranularityIsNoop is true, and largestUnit is existingLargestUnit, and calendarUnitsPresent is false, and hoursToDaysConversionMayOccur is false, and abs(duration.[[Minutes]]) < 60, and abs(duration.[[Seconds]]) < 60, and abs(duration.[[Milliseconds]]) < 1000, and abs(duration.[[Microseconds]]) < 1000, and abs(duration.[[Nanoseconds]]) < 1000, then
     a. NOTE: The above conditions mean that the operation will have no effect: the smallest unit and rounding increment will leave the total duration unchanged, and it can be determined without calling a calendar or time zone method that no balancing will take place.
     b. Return ! CreateTemporalDuration(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
106. Let precalculatedPlainDateTime be undefined.
107. If roundingGranularityIsNoop is false, or IsCalendarUnit(largestUnit) is true, or largestUnit is "day", or calendarUnitsPresent is true, or duration.[[Days]] ≠ 0, let plainDateTimeOrRelativeToWillBeUsed be true; else let plainDateTimeOrRelativeToWillBeUsed be false.
108. If zonedRelativeTo is not undefined and plainDateTimeOrRelativeToWillBeUsed is true, then
     a. NOTE: The above conditions mean that the corresponding Temporal.PlainDateTime or Temporal.PlainDate for zonedRelativeTo will be used in one of the operations below.
     b. Let instant be ! CreateTemporalInstant(zonedRelativeTo.[[Nanoseconds]]).
     c. Set precalculatedPlainDateTime to ? GetPlainDateTimeFor(timeZoneRec, instant, zonedRelativeTo.[[Calendar]]).
     d. Set plainRelativeTo to ! CreateTemporalDate(precalculatedPlainDateTime.[[ISOYear]], precalculatedPlainDateTime.[[ISOMonth]], precalculatedPlainDateTime.[[ISODay]], zonedRelativeTo.[[Calendar]]).
109. Let calendarRec be ? CreateCalendarMethodsRecordFromRelativeTo(plainRelativeTo, zonedRelativeTo, « DATE-ADD, DATE-UNTIL »).
110. Let unbalanceResult be ? UnbalanceDateDurationRelative(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], largestUnit, plainRelativeTo, calendarRec).
111. Let norm be NormalizeTimeDuration(duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
112. Let roundRecord be ? RoundDuration(unbalanceResult.[[Years]], unbalanceResult.[[Months]], unbalanceResult.[[Weeks]], unbalanceResult.[[Days]], norm, roundingIncrement, smallestUnit, roundingMode, plainRelativeTo, calendarRec, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime).
113. Let roundResult be roundRecord.[[NormalizedDuration]].
114. If zonedRelativeTo is not undefined, then
     a. Set roundResult to ? AdjustRoundedDurationDays(roundResult.[[Years]], roundResult.[[Months]], roundResult.[[Weeks]], roundResult.[[Days]], roundResult.[[NormalizedTime]], roundingIncrement, smallestUnit, roundingMode, zonedRelativeTo, calendarRec, timeZoneRec, precalculatedPlainDateTime).
     b. Let balanceResult be ? BalanceTimeDurationRelative(roundResult.[[Days]], roundResult.[[NormalizedTime]], largestUnit, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime).
115. Else,
     a. Let normWithDays be ? Add24HourDaysToNormalizedTimeDuration(roundResult.[[NormalizedTime]], roundResult.[[Days]]).
     b. Let balanceResult be BalanceTimeDuration(normWithDays, largestUnit).
116. Let result be ? BalanceDateDurationRelative(roundResult.[[Years]], roundResult.[[Months]], roundResult.[[Weeks]], balanceResult.[[Days]], largestUnit, smallestUnit, plainRelativeTo, calendarRec).
117. Return ? CreateTemporalDuration(result.[[Years]], result.[[Months]], result.[[Weeks]], result.[[Days]], balanceResult.[[Hours]], balanceResult.[[Minutes]], balanceResult.[[Seconds]], balanceResult.[[Milliseconds]], balanceResult.[[Microseconds]], balanceResult.[[Nanoseconds]]).
     7.3.21 Temporal.Duration.prototype.total ( totalOf )
     The Temporal.Duration.prototype.total method performs the following steps when called:

118. Let duration be the this value.
119. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
120. If totalOf is undefined, throw a TypeError exception.
121. If Type(totalOf) is String, then
     a. Let paramString be totalOf.
     b. Set totalOf to OrdinaryObjectCreate(null).
     c. Perform ! CreateDataPropertyOrThrow(totalOf, "unit", paramString).
122. Else,
     a. Set totalOf to ? GetOptionsObject(totalOf).
123. NOTE: The following steps read options and perform independent validation in alphabetical order (ToRelativeTemporalObject reads "relativeTo").
124. Let relativeToRecord be ? ToRelativeTemporalObject(totalOf).
125. Let zonedRelativeTo be relativeToRecord.[[ZonedRelativeTo]].
126. Let plainRelativeTo be relativeToRecord.[[PlainRelativeTo]].
127. Let timeZoneRec be relativeToRecord.[[TimeZoneRec]].
128. Let unit be ? GetTemporalUnit(totalOf, "unit", DATETIME, REQUIRED).
129. Let precalculatedPlainDateTime be undefined.
130. If IsCalendarUnit(unit) is true, or unit is "day", or duration.[[Years]] ≠ 0, or duration.[[Months]] ≠ 0, or duration.[[Weeks]] ≠ 0, or duration.[[Days]] ≠ 0, let plainDateTimeOrRelativeToWillBeUsed be true; else let plainDateTimeOrRelativeToWillBeUsed be false.
131. If zonedRelativeTo is not undefined and plainDateTimeOrRelativeToWillBeUsed is true, then
     a. NOTE: The above conditions mean that the corresponding Temporal.PlainDateTime or Temporal.PlainDate for zonedRelativeTo will be used in one of the operations below.
     b. Let instant be ! CreateTemporalInstant(zonedRelativeTo.[[Nanoseconds]]).
     c. Set precalculatedPlainDateTime to ? GetPlainDateTimeFor(timeZoneRec, instant, zonedRelativeTo.[[Calendar]]).
     d. Set plainRelativeTo to ! CreateTemporalDate(precalculatedPlainDateTime.[[ISOYear]], precalculatedPlainDateTime.[[ISOMonth]], precalculatedPlainDateTime.[[ISODay]], zonedRelativeTo.[[Calendar]]).
132. Let calendarRec be ? CreateCalendarMethodsRecordFromRelativeTo(plainRelativeTo, zonedRelativeTo, « DATE-ADD, DATE-UNTIL »).
133. Let unbalanceResult be ? UnbalanceDateDurationRelative(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], unit, plainRelativeTo, calendarRec).
134. Let days be unbalanceResult.[[Days]].
135. If zonedRelativeTo is not undefined, then
     a. Let intermediate be ? MoveRelativeZonedDateTime(zonedRelativeTo, calendarRec, timeZoneRec, unbalanceResult.[[Years]], unbalanceResult.[[Months]], unbalanceResult.[[Weeks]], 0, precalculatedPlainDateTime).
     b. Let norm be NormalizeTimeDuration(duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
     c. Let startNs be intermediate.[[Nanoseconds]].
     d. Let startInstant be ! CreateTemporalInstant(startNs).
     e. Let startDateTime be undefined.
     f. If days ≠ 0, then
     i. Set startDateTime to ? GetPlainDateTimeFor(timeZoneRec, startInstant, "iso8601").
     ii. Let addResult be ? AddDaysToZonedDateTime(startInstant, startDateTime, timeZoneRec, "iso8601", days).
     iii. Let intermediateNs be addResult.[[EpochNanoseconds]].
     g. Else,
     i. Let intermediateNs be startNs.
     h. Let endNs be ? AddInstant(intermediateNs, norm).
     i. Set norm to NormalizedTimeDurationFromEpochNanosecondsDifference(endNs, startNs).
     j. If IsCalendarUnit(unit) is true or unit is "day", then
     i. If NormalizedTimeDurationIsZero(norm) is false and startDateTime is undefined, set startDateTime to ? GetPlainDateTimeFor(timeZoneRec, startInstant, "iso8601").
     ii. Let result be ? NormalizedTimeDurationToDays(norm, intermediate, timeZoneRec, startDateTime).
     iii. Set norm to result.[[Remainder]].
     iv. Set days to result.[[Days]].
     k. Else,
     i. Set days to 0.
136. Else,
     a. Let norm be NormalizeTimeDuration(duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
     b. Set norm to ? Add24HourDaysToNormalizedTimeDuration(norm, days).
     c. Set days to 0.
137. Let roundRecord be ? RoundDuration(unbalanceResult.[[Years]], unbalanceResult.[[Months]], unbalanceResult.[[Weeks]], days, norm, 1, unit, "trunc", plainRelativeTo, calendarRec, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime).
138. Return 𝔽(roundRecord.[[Total]]).
     7.3.22 Temporal.Duration.prototype.toString ( [ options ] )
     The Temporal.Duration.prototype.toString method performs the following steps when called:

139. Let duration be the this value.
140. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
141. Set options to ? GetOptionsObject(options).
142. NOTE: The following steps read options and perform independent validation in alphabetical order (ToFractionalSecondDigits reads "fractionalSecondDigits" and ToTemporalRoundingMode reads "roundingMode").
143. Let digits be ? ToFractionalSecondDigits(options).
144. Let roundingMode be ? ToTemporalRoundingMode(options, "trunc").
145. Let smallestUnit be ? GetTemporalUnit(options, "smallestUnit", TIME, undefined).
146. If smallestUnit is "hour" or "minute", throw a RangeError exception.
147. Let precision be ToSecondsStringPrecisionRecord(smallestUnit, digits).
148. If precision.[[Unit]] is not "nanosecond" or precision.[[Increment]] ≠ 1, then
     a. Let norm be NormalizeTimeDuration(duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
     b. Let largestUnit be DefaultTemporalLargestUnit(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]]).
     c. Let roundRecord be ? RoundDuration(0, 0, 0, 0, norm, precision.[[Increment]], precision.[[Unit]], roundingMode).
     d. Set norm to roundRecord.[[NormalizedDuration]].[[NormalizedTime]].
     e. Let result be BalanceTimeDuration(norm, LargerOfTwoTemporalUnits(largestUnit, "second")).
     f. Set result to CreateDurationRecord(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]] + result.[[Days]], result.[[Hours]], result.[[Minutes]], result.[[Seconds]], result.[[Milliseconds]], result.[[Microseconds]], result.[[Nanoseconds]]).
149. Else,
     a. Let result be duration.
150. Let normSeconds be NormalizeTimeDuration(0, 0, result.[[Seconds]], result.[[Milliseconds]], result.[[Microseconds]], result.[[Nanoseconds]]).
151. Return ! TemporalDurationToString(result.[[Years]], result.[[Months]], result.[[Weeks]], result.[[Days]], result.[[Hours]], result.[[Minutes]], normSeconds, precision.[[Precision]]).
     7.3.23 Temporal.Duration.prototype.toJSON ( )
     The Temporal.Duration.prototype.toJSON method performs the following steps when called:

152. Let duration be the this value.
153. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
154. Let normSeconds be NormalizeTimeDuration(0, 0, duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
155. Return ! TemporalDurationToString(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], duration.[[Hours]], duration.[[Minutes]], normSeconds, "auto").
     7.3.24 Temporal.Duration.prototype.toLocaleString ( [ locales [ , options ] ] )
     An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement the Temporal.Duration.prototype.toLocaleString method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of the Temporal.Duration.prototype.toLocaleString method is used.

The Temporal.Duration.prototype.toLocaleString method performs the following steps when called:

1. Let duration be the this value.
2. Perform ? RequireInternalSlot(duration, [[InitializedTemporalDuration]]).
3. Let normSeconds be NormalizeTimeDuration(0, 0, duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
4. Return ! TemporalDurationToString(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], duration.[[Hours]], duration.[[Minutes]], normSeconds, "auto").
   7.3.25 Temporal.Duration.prototype.valueOf ( )
   The Temporal.Duration.prototype.valueOf method performs the following steps when called:

5. Throw a TypeError exception.
   NOTE
   This method always throws, because in the absence of valueOf(), expressions with arithmetic operators such as duration1 > duration2 would fall back to being equivalent to duration1.toString() > duration2.toString(). Lexicographical comparison of serialized strings might not seem obviously wrong, because the result would sometimes be correct. Implementations are encouraged to phrase the error message to point users to Temporal.Duration.compare() and/or Temporal.Duration.prototype.toString().

7.4 Properties of Temporal.Duration Instances
Temporal.Duration instances are ordinary objects that inherit properties from the %Temporal.Duration.prototype% intrinsic object. Temporal.Duration instances are initially created with the internal slots described in Table 9.

A float64-representable integer is an integer that is exactly representable as a Number value. That is, for a float64-representable integer x, it must hold that ℝ(𝔽(x)) = x.

NOTE
The use of float64-representable integers here is intended so that implementations can store and do arithmetic on Duration fields using 64-bit floating-point values.
Table 9: Internal Slots of Temporal.Duration Instances
Internal Slot Description
[[InitializedTemporalDuration]] The only specified use of this slot is for distinguishing Temporal.Duration instances from other objects.
[[Years]] A float64-representable integer representing the number of years in the duration.
[[Months]] A float64-representable integer representing the number of months in the duration.
[[Weeks]] A float64-representable integer representing the number of weeks in the duration.
[[Days]] A float64-representable integer representing the number of days in the duration.
[[Hours]] A float64-representable integer representing the number of hours in the duration.
[[Minutes]] A float64-representable integer representing the number of minutes in the duration.
[[Seconds]] A float64-representable integer representing the number of seconds in the duration.
[[Milliseconds]] A float64-representable integer representing the number of milliseconds in the duration.
[[Microseconds]] A float64-representable integer representing the number of microseconds in the duration.
[[Nanoseconds]] A float64-representable integer representing the number of nanoseconds in the duration.
7.5 Abstract Operations
7.5.1 Duration Records
A Duration Record is a Record value used to represent a Temporal.Duration object. Duration Records are produced by the abstract operation CreateDurationRecord, among others.

Duration Records have the fields listed in Table 10.

Table 10: Duration Record Fields
Field Name Property Name Value Meaning
[[Years]] "years" a float64-representable integer The number of years in the duration.
[[Months]] "months" a float64-representable integer The number of months in the duration.
[[Weeks]] "weeks" a float64-representable integer The number of weeks in the duration.
[[Days]] "days" a float64-representable integer The number of days in the duration.
[[Hours]] "hours" a float64-representable integer The number of hours in the duration.
[[Minutes]] "minutes" a float64-representable integer The number of minutes in the duration.
[[Seconds]] "seconds" a float64-representable integer The number of seconds in the duration.
[[Milliseconds]] "milliseconds" a float64-representable integer The number of milliseconds in the duration.
[[Microseconds]] "microseconds" a float64-representable integer The number of microseconds in the duration.
[[Nanoseconds]] "nanoseconds" a float64-representable integer The number of nanoseconds in the duration.
7.5.2 Date Duration Records
A Date Duration Record is a Record value used to represent the portion of a Temporal.Duration object that deals with calendar date units. Date Duration Records are produced by the abstract operation CreateDateDurationRecord, among others.

Of the fields listed in Table 10, Date Duration Records have [[Years]], [[Months]], [[Weeks]], and [[Days]].

7.5.3 Time Duration Records
A Time Duration Record is a Record value used to represent the portion of a Temporal.Duration object that deals with exact time units. Time Duration Records are produced by the abstract operation CreateTimeDurationRecord, among others.

Of the fields listed in Table 10, Time Duration Records have [[Days]], [[Hours]], [[Minutes]], [[Seconds]], [[Milliseconds]], [[Microseconds]], and [[Nanoseconds]].

7.5.4 Partial Duration Records
A partial Duration Record is a Record value used to represent a portion of a Temporal.Duration object, in which it is not required that all the fields be specified.

Partial Duration Records have the same fields listed in Table 10. Unlike Duration Records, each field of a partial Duration Record may also have the value undefined as long as there is at least one field that is not undefined.

7.5.5 Normalized Time Duration Records
A Normalized Time Duration Record is a Record value used to represent the portion of a Temporal.Duration object that deals with time units, but as a combined value. Normalized Time Duration Records are produced by the abstract operation NormalizeTimeDuration, among others.

Normalized Time Duration Records have the fields listed in Table 11.

Table 11: Normalized Time Duration Record Fields
Field Name Value Meaning
[[TotalNanoseconds]] an integer in the inclusive interval from -maxTimeDuration to maxTimeDuration, where maxTimeDuration = 2**53 × 10**9 - 1 = 9,007,199,254,740,991,999,999,999 The number of nanoseconds in the duration.
7.5.6 Normalized Duration Records
A Normalized Duration Record is a Record value used to represent the combination of a Date Duration Record with a Normalized Time Duration Record. Such Records are used by operations that deal with both date and time portions of durations, such as RoundDuration.

Normalized Duration Records have the fields listed in Table 12.

Table 12: Normalized Duration Record Fields
Field Name Value Meaning
[[Years]] a float64-representable integer The number of years in the duration.
[[Months]] a float64-representable integer The number of months in the duration.
[[Weeks]] a float64-representable integer The number of weeks in the duration.
[[Days]] a float64-representable integer The number of days in the duration.
[[NormalizedTime]] a Normalized Time Duration Record The time portion of the duration.
7.5.7 CreateDurationRecord ( years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds )
The abstract operation CreateDurationRecord takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), hours (an integer), minutes (an integer), seconds (an integer), milliseconds (an integer), microseconds (an integer), and nanoseconds (an integer) and returns a Duration Record. It performs the following steps when called:

1. Assert: ! IsValidDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) is true.
2. Return the Record { [[Years]]: ℝ(𝔽(years)), [[Months]]: ℝ(𝔽(months)), [[Weeks]]: ℝ(𝔽(weeks)), [[Days]]: ℝ(𝔽(days)), [[Hours]]: ℝ(𝔽(hours)), [[Minutes]]: ℝ(𝔽(minutes)), [[Seconds]]: ℝ(𝔽(seconds)), [[Milliseconds]]: ℝ(𝔽(milliseconds)), [[Microseconds]]: ℝ(𝔽(microseconds)), [[Nanoseconds]]: ℝ(𝔽(nanoseconds)) }.
   7.5.8 CreateDateDurationRecord ( years, months, weeks, days )
   The abstract operation CreateDateDurationRecord takes arguments years (an integer), months (an integer), weeks (an integer), and days (an integer). It returns a Date Duration Record. It performs the following steps when called:

3. If ! IsValidDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0) is false, throw a RangeError exception.
4. Return the Record { [[Years]]: ℝ(𝔽(years)), [[Months]]: ℝ(𝔽(months)), [[Weeks]]: ℝ(𝔽(weeks)), [[Days]]: ℝ(𝔽(days)) }.
   7.5.9 CreateTimeDurationRecord ( days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds )
   The abstract operation CreateTimeDurationRecord takes arguments days (an integer), hours (an integer), minutes (an integer), seconds (an integer), milliseconds (an integer), microseconds (an integer), and nanoseconds (an integer). It returns a Time Duration Record. It performs the following steps when called:

5. Assert: ! IsValidDuration(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) is true.
6. Return the Record { [[Days]]: ℝ(𝔽(days)), [[Hours]]: ℝ(𝔽(hours)), [[Minutes]]: ℝ(𝔽(minutes)), [[Seconds]]: ℝ(𝔽(seconds)), [[Milliseconds]]: ℝ(𝔽(milliseconds)), [[Microseconds]]: ℝ(𝔽(microseconds)), [[Nanoseconds]]: ℝ(𝔽(nanoseconds)) }.
   7.5.10 CreateNormalizedDurationRecord ( years, months, weeks, days, norm )
   The abstract operation CreateNormalizedDurationRecord takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), and norm (a Normalized Time Duration Record) and returns either a normal completion containing a Normalized Duration Record, or a throw completion. It performs the following steps when called:

7. Let dateDurationRecord be ? CreateDateDurationRecord(years, months, weeks, days).
8. Return ? CombineDateAndNormalizedTimeDuration(dateDurationRecord, norm).
   7.5.11 CombineDateAndNormalizedTimeDuration ( dateDurationRecord, norm )
   The abstract operation CombineDateAndNormalizedTimeDuration takes arguments dateDurationRecord (a Date Duration Record) and norm (a Normalized Time Duration Record) and returns either a normal completion containing a Normalized Duration Record, or a throw completion. It performs the following steps when called:

9. Let dateSign be DurationSign(dateDurationRecord.[[Years]], dateDurationRecord.[[Months]], dateDurationRecord.[[Weeks]], dateDurationRecord.[[Days]], 0, 0, 0, 0, 0, 0).
10. Let timeSign be NormalizedTimeDurationSign(norm).
11. If dateSign ≠ 0 and timeSign ≠ 0 and dateSign ≠ timeSign, throw a RangeError exception.
12. Return the Record { [[Years]]: dateDurationRecord.[[Years]], [[Months]]: dateDurationRecord.[[Months]], [[Weeks]]: dateDurationRecord.[[Weeks]], [[Days]]: dateDurationRecord.[[Days]], [[NormalizedTime]]: norm }.
    7.5.12 ToTemporalDuration ( item )
    The abstract operation ToTemporalDuration takes argument item (an ECMAScript language value) and returns either a normal completion containing a Temporal.Duration, or a throw completion. It returns its argument item if it is already a Temporal.Duration instance, converts item to a new Temporal.Duration instance if possible and returns that, and throws otherwise. It performs the following steps when called:

13. If Type(item) is Object and item has an [[InitializedTemporalDuration]] internal slot, then
    a. Return item.
14. Let result be ? ToTemporalDurationRecord(item).
15. Return ! CreateTemporalDuration(result.[[Years]], result.[[Months]], result.[[Weeks]], result.[[Days]], result.[[Hours]], result.[[Minutes]], result.[[Seconds]], result.[[Milliseconds]], result.[[Microseconds]], result.[[Nanoseconds]]).
    7.5.13 ToTemporalDurationRecord ( temporalDurationLike )
    The abstract operation ToTemporalDurationRecord takes argument temporalDurationLike (an ECMAScript language value) and returns either a normal completion containing a Duration Record, or an abrupt completion. The returned Record has its fields set according to the properties of temporalDurationLike, with absent or undefined properties corresponding to fields containing 0. It performs the following steps when called:

16. If Type(temporalDurationLike) is not Object, then
    a. If temporalDurationLike is not a String, throw a TypeError exception.
    b. Return ? ParseTemporalDurationString(temporalDurationLike).
17. If temporalDurationLike has an [[InitializedTemporalDuration]] internal slot, then
    a. Return CreateDurationRecord(temporalDurationLike.[[Years]], temporalDurationLike.[[Months]], temporalDurationLike.[[Weeks]], temporalDurationLike.[[Days]], temporalDurationLike.[[Hours]], temporalDurationLike.[[Minutes]], temporalDurationLike.[[Seconds]], temporalDurationLike.[[Milliseconds]], temporalDurationLike.[[Microseconds]], temporalDurationLike.[[Nanoseconds]]).
18. Let result be a new Duration Record with each field set to 0.
19. Let partial be ? ToTemporalPartialDurationRecord(temporalDurationLike).
20. If partial.[[Years]] is not undefined, set result.[[Years]] to partial.[[Years]].
21. If partial.[[Months]] is not undefined, set result.[[Months]] to partial.[[Months]].
22. If partial.[[Weeks]] is not undefined, set result.[[Weeks]] to partial.[[Weeks]].
23. If partial.[[Days]] is not undefined, set result.[[Days]] to partial.[[Days]].
24. If partial.[[Hours]] is not undefined, set result.[[Hours]] to partial.[[Hours]].
25. If partial.[[Minutes]] is not undefined, set result.[[Minutes]] to partial.[[Minutes]].
26. If partial.[[Seconds]] is not undefined, set result.[[Seconds]] to partial.[[Seconds]].
27. If partial.[[Milliseconds]] is not undefined, set result.[[Milliseconds]] to partial.[[Milliseconds]].
28. If partial.[[Microseconds]] is not undefined, set result.[[Microseconds]] to partial.[[Microseconds]].
29. If partial.[[Nanoseconds]] is not undefined, set result.[[Nanoseconds]] to partial.[[Nanoseconds]].
30. If ! IsValidDuration(result.[[Years]], result.[[Months]], result.[[Weeks]], result.[[Days]], result.[[Hours]], result.[[Minutes]], result.[[Seconds]], result.[[Milliseconds]], result.[[Microseconds]], result.[[Nanoseconds]]) is false, then
    a. Throw a RangeError exception.
31. Return result.
    7.5.14 DurationSign ( years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds )
    The abstract operation DurationSign takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), hours (an integer), minutes (an integer), seconds (an integer), milliseconds (an integer), microseconds (an integer), and nanoseconds (an integer). It returns 1 if the most significant non-zero element in its arguments is positive, and -1 if the most significant non-zero element is negative. If all of its arguments are zero, it returns 0. It performs the following steps when called:

32. For each value v of « years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds », do
    a. If v < 0, return -1.
    b. If v > 0, return 1.
33. Return 0.
    7.5.15 IsValidDuration ( years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds )
    The abstract operation IsValidDuration takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), hours (an integer), minutes (an integer), seconds (an integer), milliseconds (an integer), microseconds (an integer), and nanoseconds (an integer). It returns true if its arguments form valid input from which to construct a Temporal.Duration, and false otherwise. It performs the following steps when called:

34. Let sign be ! DurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds).
35. For each value v of « years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds », do
    a. If 𝔽(v) is not finite, return false.
    b. If v < 0 and sign > 0, return false.
    c. If v > 0 and sign < 0, return false.
36. If abs(years) ≥ 2\*\*32, return false.
37. If abs(months) ≥ 2\*\*32, return false.
38. If abs(weeks) ≥ 2\*\*32, return false.
39. Let normalizedSeconds be days × 86,400 + hours × 3600 + minutes × 60 + seconds + ℝ(𝔽(milliseconds)) × 10**-3 + ℝ(𝔽(microseconds)) × 10**-6 + ℝ(𝔽(nanoseconds)) × 10\*\*-9.
40. NOTE: The above step cannot be implemented directly using floating-point arithmetic. Multiplying by 10**-3, 10**-6, and 10\*\*-9 respectively may be imprecise when milliseconds, microseconds, or nanoseconds is an unsafe integer. This multiplication can be implemented in C++ with an implementation of std::remquo() with sufficient bits in the quotient. String manipulation will also give an exact result, since the multiplication is by a power of 10.
41. If abs(normalizedSeconds) ≥ 2\*\*53, return false.
42. Return true.
    7.5.16 DefaultTemporalLargestUnit ( years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds )
    The abstract operation DefaultTemporalLargestUnit takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), hours (an integer), minutes (an integer), seconds (an integer), milliseconds (an integer), and microseconds (an integer). It implements the logic used in the Temporal.Duration.prototype.round() method and elsewhere, where the largestUnit option, if not given explicitly, is set to the largest non-zero unit in the input Temporal.Duration. It performs the following steps when called:

43. If years ≠ 0, return "year".
44. If months ≠ 0, return "month".
45. If weeks ≠ 0, return "week".
46. If days ≠ 0, return "day".
47. If hours ≠ 0, return "hour".
48. If minutes ≠ 0, return "minute".
49. If seconds ≠ 0, return "second".
50. If milliseconds ≠ 0, return "millisecond".
51. If microseconds ≠ 0, return "microsecond".
52. Return "nanosecond".
    7.5.17 ToTemporalPartialDurationRecord ( temporalDurationLike )
    The abstract operation ToTemporalPartialDurationRecord takes argument temporalDurationLike (an ECMAScript language value) and returns either a normal completion containing a partial Duration Record, or an abrupt completion. The returned Record has its fields set according to the properties of temporalDurationLike. It performs the following steps when called:

53. If Type(temporalDurationLike) is not Object, then
    a. Throw a TypeError exception.
54. Let result be a new partial Duration Record with each field set to undefined.
55. NOTE: The following steps read properties and perform independent validation in alphabetical order.
56. Let days be ? Get(temporalDurationLike, "days").
57. If days is not undefined, set result.[[Days]] to ? ToIntegerIfIntegral(days).
58. Let hours be ? Get(temporalDurationLike, "hours").
59. If hours is not undefined, set result.[[Hours]] to ? ToIntegerIfIntegral(hours).
60. Let microseconds be ? Get(temporalDurationLike, "microseconds").
61. If microseconds is not undefined, set result.[[Microseconds]] to ? ToIntegerIfIntegral(microseconds).
62. Let milliseconds be ? Get(temporalDurationLike, "milliseconds").
63. If milliseconds is not undefined, set result.[[Milliseconds]] to ? ToIntegerIfIntegral(milliseconds).
64. Let minutes be ? Get(temporalDurationLike, "minutes").
65. If minutes is not undefined, set result.[[Minutes]] to ? ToIntegerIfIntegral(minutes).
66. Let months be ? Get(temporalDurationLike, "months").
67. If months is not undefined, set result.[[Months]] to ? ToIntegerIfIntegral(months).
68. Let nanoseconds be ? Get(temporalDurationLike, "nanoseconds").
69. If nanoseconds is not undefined, set result.[[Nanoseconds]] to ? ToIntegerIfIntegral(nanoseconds).
70. Let seconds be ? Get(temporalDurationLike, "seconds").
71. If seconds is not undefined, set result.[[Seconds]] to ? ToIntegerIfIntegral(seconds).
72. Let weeks be ? Get(temporalDurationLike, "weeks").
73. If weeks is not undefined, set result.[[Weeks]] to ? ToIntegerIfIntegral(weeks).
74. Let years be ? Get(temporalDurationLike, "years").
75. If years is not undefined, set result.[[Years]] to ? ToIntegerIfIntegral(years).
76. If years is undefined, and months is undefined, and weeks is undefined, and days is undefined, and hours is undefined, and minutes is undefined, and seconds is undefined, and milliseconds is undefined, and microseconds is undefined, and nanoseconds is undefined, throw a TypeError exception.
77. Return result.
    7.5.18 CreateTemporalDuration ( years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds [ , newTarget ] )
    The abstract operation CreateTemporalDuration takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), hours (an integer), minutes (an integer), seconds (an integer), milliseconds (an integer), microseconds (an integer), and nanoseconds (an integer) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.Duration, or an abrupt completion. It creates a Temporal.Duration instance and fills the internal slots with valid values. It performs the following steps when called:

78. If ! IsValidDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) is false, throw a RangeError exception.
79. If newTarget is not present, set newTarget to %Temporal.Duration%.
80. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.Duration.prototype%", « [[InitializedTemporalDuration]], [[Years]], [[Months]], [[Weeks]], [[Days]], [[Hours]], [[Minutes]], [[Seconds]], [[Milliseconds]], [[Microseconds]], [[Nanoseconds]] »).
81. Set object.[[Years]] to ℝ(𝔽(years)).
82. Set object.[[Months]] to ℝ(𝔽(months)).
83. Set object.[[Weeks]] to ℝ(𝔽(weeks)).
84. Set object.[[Days]] to ℝ(𝔽(days)).
85. Set object.[[Hours]] to ℝ(𝔽(hours)).
86. Set object.[[Minutes]] to ℝ(𝔽(minutes)).
87. Set object.[[Seconds]] to ℝ(𝔽(seconds)).
88. Set object.[[Milliseconds]] to ℝ(𝔽(milliseconds)).
89. Set object.[[Microseconds]] to ℝ(𝔽(microseconds)).
90. Set object.[[Nanoseconds]] to ℝ(𝔽(nanoseconds)).
91. Return object.
    7.5.19 CreateNegatedTemporalDuration ( duration )
    The abstract operation CreateNegatedTemporalDuration takes argument duration (a Temporal.Duration). It returns a new Temporal.Duration instance that is the negation of duration. It performs the following steps when called:

92. Return ! CreateTemporalDuration(-duration.[[Years]], -duration.[[Months]], -duration.[[Weeks]], -duration.[[Days]], -duration.[[Hours]], -duration.[[Minutes]], -duration.[[Seconds]], -duration.[[Milliseconds]], -duration.[[Microseconds]], -duration.[[Nanoseconds]]).
    7.5.20 NormalizeTimeDuration ( hours, minutes, seconds, milliseconds, microseconds, nanoseconds )
    The abstract operation NormalizeTimeDuration takes arguments hours (an integer), minutes (an integer), seconds (an integer), milliseconds (an integer), microseconds (an integer), and nanoseconds (an integer) and returns a Normalized Time Duration Record. From the given units, it computes a normalized time duration consisting of whole seconds, and subseconds expressed in nanoseconds. The normalized time duration can be stored losslessly in two 64-bit floating point numbers. Alternatively, normalizedSeconds × 10\*\*9 + subseconds can be stored as a 96-bit integer. It performs the following steps when called:

93. Set minutes to minutes + hours × 60.
94. Set seconds to seconds + minutes × 60.
95. Set milliseconds to milliseconds + seconds × 1000.
96. Set microseconds to microseconds + milliseconds × 1000.
97. Set nanoseconds to nanoseconds + microseconds × 1000.
98. Assert: abs(nanoseconds) ≤ maxTimeDuration.
99. Return the Record { [[TotalNanoseconds]]: nanoseconds }.
    7.5.21 NormalizedTimeDurationAbs ( d )
    The abstract operation NormalizedTimeDurationAbs takes argument d (a Normalized Time Duration Record) and returns a Normalized Time Duration Record. It returns a new normalized time duration that is the absolute value of d. It performs the following steps when called:

100. Return the Record { [[TotalNanoseconds]]: abs(d.[[TotalNanoseconds]]) }.
     7.5.22 AddNormalizedTimeDuration ( one, two )
     The abstract operation AddNormalizedTimeDuration takes arguments one (a Normalized Time Duration Record) and two (a Normalized Time Duration Record) and returns either a normal completion containing a Normalized Time Duration Record, or a throw completion. It returns a normalized time duration that is the sum of one and two, throwing an exception if the result is greater than the maximum normalized time duration. It performs the following steps when called:

101. Let result be one.[[TotalNanoseconds]] + two.[[TotalNanoseconds]].
102. If abs(result) > maxTimeDuration, throw a RangeError exception.
103. Return the Record { [[TotalNanoseconds]]: result }.
     7.5.23 Add24HourDaysToNormalizedTimeDuration ( d, days )
     The abstract operation Add24HourDaysToNormalizedTimeDuration takes arguments d (a Normalized Time Duration Record) and days (an integer) and returns either a normal completion containing a Normalized Time Duration Record, or a throw completion. It returns a normalized time duration that is the sum of d and the number of 24-hour days indicated by days, throwing an exception if the result is greater than the maximum normalized time duration. This operation should not be used when adding days relative to a Temporal.ZonedDateTime, since the days may not be 24 hours long. It performs the following steps when called:

104. Let result be d.[[TotalNanoseconds]] + days × nsPerDay.
105. If abs(result) > maxTimeDuration, throw a RangeError exception.
106. Return the Record { [[TotalNanoseconds]]: result }.
     7.5.24 AddNormalizedTimeDurationToEpochNanoseconds ( d, epochNs )
     The abstract operation AddNormalizedTimeDurationToEpochNanoseconds takes arguments d (a Normalized Time Duration Record) and epochNs (a BigInt) and returns a BigInt. It adds a normalized time duration d to an exact time in nanoseconds since the epoch, epochNs, and returns a new exact time. The returned exact time is not required to be valid according to IsValidEpochNanoseconds. It performs the following steps when called:

107. Return epochNs + ℤ(d.[[TotalNanoseconds]]).
     7.5.25 CompareNormalizedTimeDuration ( one, two )
     The abstract operation CompareNormalizedTimeDuration takes arguments one (a Normalized Time Duration Record) and two (a Normalized Time Duration Record) and returns -1, 0, or 1. It performs a comparison of two Normalized Time Duration Records. It performs the following steps when called:

108. If one.[[TotalNanoseconds]] > two.[[TotalNanoseconds]], return 1.
109. If one.[[TotalNanoseconds]] < two.[[TotalNanoseconds]], return -1.
110. Return 0.
     7.5.26 DivideNormalizedTimeDuration ( d, divisor )
     The abstract operation DivideNormalizedTimeDuration takes arguments d (a Normalized Time Duration Record) and divisor (an integer) and returns a mathematical value. It divides the total number of nanoseconds in the normalized time duration d by divisor. It performs the following steps when called:

111. Assert: divisor ≠ 0.
112. NOTE: The following step cannot be implemented directly using floating-point arithmetic when 𝔽(d.[[TotalNanoseconds]]) is not a safe integer. The division can be implemented in C++ with the \_\_float128 type if the compiler supports it, or with software emulation such as in the SoftFP library.
113. Return d.[[TotalNanoseconds]] / divisor.
     7.5.27 NormalizedTimeDurationFromEpochNanosecondsDifference ( one, two )
     The abstract operation NormalizedTimeDurationFromEpochNanosecondsDifference takes arguments one (a BigInt) and two (a BigInt) and returns a Normalized Time Duration Record. It creates a Normalized Time Duration Record with the difference between two exact times in nanoseconds since the epoch, which must not be greater than the maximum normalized time duration. It performs the following steps when called:

114. Let result be ℝ(one) - ℝ(two).
115. Assert: abs(result) ≤ maxTimeDuration.
116. Return the Record { [[TotalNanoseconds]]: result }.
     7.5.28 NormalizedTimeDurationIsZero ( d )
     The abstract operation NormalizedTimeDurationIsZero takes argument d (a Normalized Time Duration Record) and returns a Boolean. It returns true if d is a zero duration, false otherwise. It performs the following steps when called:

117. If d.[[TotalNanoseconds]] = 0, return true.
118. Return false.
     7.5.29 RoundNormalizedTimeDurationToIncrement ( d, increment, roundingMode )
     The abstract operation RoundNormalizedTimeDurationToIncrement takes arguments d (a Normalized Time Duration Record), increment (an integer), and roundingMode (a String from the Identifier column of Table 19) and returns either a normal completion containing a Normalized Time Duration Record, or a throw completion. It rounds the total number of nanoseconds in the normalized time duration d to the nearest multiple of increment, up or down according to roundingMode. It performs the following steps when called:

119. Let rounded be RoundNumberToIncrement(d.[[TotalNanoseconds]], increment, roundingMode).
120. If abs(rounded) > maxTimeDuration, throw a RangeError exception.
121. Return the Record { [[TotalNanoseconds]]: rounded }.
     7.5.30 NormalizedTimeDurationSeconds ( d )
     The abstract operation NormalizedTimeDurationSeconds takes argument d (a Normalized Time Duration Record) and returns an integer in the interval from -2**53 (exclusive) to 2**53 (exclusive). It returns the integer number of seconds in d. It performs the following steps when called:

122. Return truncate(d.[[TotalNanoseconds]] / 10\*\*9).
     7.5.31 NormalizedTimeDurationSign ( d )
     The abstract operation NormalizedTimeDurationSign takes argument d (a Normalized Time Duration Record) and returns -1, 0, or 1. It returns 0 if the duration is zero, or ±1 depending on the sign of the duration. It performs the following steps when called:

123. If d.[[TotalNanoseconds]] < 0, return -1.
124. If d.[[TotalNanoseconds]] > 0, return 1.
125. Return 0.
     7.5.32 NormalizedTimeDurationSubseconds ( d )
     The abstract operation NormalizedTimeDurationSubseconds takes argument d (a Normalized Time Duration Record) and returns an integer in the interval from -10**9 (exclusive) to 10**9 (exclusive). It returns the integer number of nanoseconds in the subsecond part of d. It performs the following steps when called:

126. Return remainder(d.[[TotalNanoseconds]], 10\*\*9).
     7.5.33 SubtractNormalizedTimeDuration ( one, two )
     The abstract operation SubtractNormalizedTimeDuration takes arguments one (a Normalized Time Duration Record) and two (a Normalized Time Duration Record) and returns either a normal completion containing a Normalized Time Duration Record, or a throw completion. It returns a normalized time duration that is the difference between one and two, throwing an exception if the result is greater than the maximum normalized time duration. It performs the following steps when called:

127. Let result be one.[[TotalNanoseconds]] - two.[[TotalNanoseconds]].
128. If abs(result) > maxTimeDuration, throw a RangeError exception.
129. Return the Record { [[TotalNanoseconds]]: result }.
     7.5.34 ZeroTimeDuration ( )
     The abstract operation ZeroTimeDuration takes no arguments and returns a Normalized Time Duration Record. It returns a normalized time duration of zero length. It performs the following steps when called:

130. Return the Record { [[TotalNanoseconds]]: 0 }.
     7.5.35 BalanceTimeDuration ( norm, largestUnit )
     The abstract operation BalanceTimeDuration takes arguments norm (a Normalized Time Duration Record) and largestUnit (a String) and returns a Time Duration Record. It converts a normalized time duration into a time duration with separated units, up to largestUnit. It performs the following steps when called:

131. Let days, hours, minutes, seconds, milliseconds, and microseconds be 0.
132. Let sign be NormalizedTimeDurationSign(norm).
133. Let nanoseconds be NormalizedTimeDurationAbs(norm).[[TotalNanoseconds]].
134. If largestUnit is "year", "month", "week", or "day", then
     a. Set microseconds to floor(nanoseconds / 1000).
     b. Set nanoseconds to nanoseconds modulo 1000.
     c. Set milliseconds to floor(microseconds / 1000).
     d. Set microseconds to microseconds modulo 1000.
     e. Set seconds to floor(milliseconds / 1000).
     f. Set milliseconds to milliseconds modulo 1000.
     g. Set minutes to floor(seconds / 60).
     h. Set seconds to seconds modulo 60.
     i. Set hours to floor(minutes / 60).
     j. Set minutes to minutes modulo 60.
     k. Set days to floor(hours / 24).
     l. Set hours to hours modulo 24.
135. Else if largestUnit is "hour", then
     a. Set microseconds to floor(nanoseconds / 1000).
     b. Set nanoseconds to nanoseconds modulo 1000.
     c. Set milliseconds to floor(microseconds / 1000).
     d. Set microseconds to microseconds modulo 1000.
     e. Set seconds to floor(milliseconds / 1000).
     f. Set milliseconds to milliseconds modulo 1000.
     g. Set minutes to floor(seconds / 60).
     h. Set seconds to seconds modulo 60.
     i. Set hours to floor(minutes / 60).
     j. Set minutes to minutes modulo 60.
136. Else if largestUnit is "minute", then
     a. Set microseconds to floor(nanoseconds / 1000).
     b. Set nanoseconds to nanoseconds modulo 1000.
     c. Set milliseconds to floor(microseconds / 1000).
     d. Set microseconds to microseconds modulo 1000.
     e. Set seconds to floor(milliseconds / 1000).
     f. Set milliseconds to milliseconds modulo 1000.
     g. Set minutes to floor(seconds / 60).
     h. Set seconds to seconds modulo 60.
137. Else if largestUnit is "second", then
     a. Set microseconds to floor(nanoseconds / 1000).
     b. Set nanoseconds to nanoseconds modulo 1000.
     c. Set milliseconds to floor(microseconds / 1000).
     d. Set microseconds to microseconds modulo 1000.
     e. Set seconds to floor(milliseconds / 1000).
     f. Set milliseconds to milliseconds modulo 1000.
138. Else if largestUnit is "millisecond", then
     a. Set microseconds to floor(nanoseconds / 1000).
     b. Set nanoseconds to nanoseconds modulo 1000.
     c. Set milliseconds to floor(microseconds / 1000).
     d. Set microseconds to microseconds modulo 1000.
139. Else if largestUnit is "microsecond", then
     a. Set microseconds to floor(nanoseconds / 1000).
     b. Set nanoseconds to nanoseconds modulo 1000.
140. Else,
     a. Assert: largestUnit is "nanosecond".
141. NOTE: When largestUnit is "millisecond", "microsecond", or "nanosecond", milliseconds, microseconds, or nanoseconds may be an unsafe integer. In this case, care must be taken when implementing the calculation using floating point arithmetic. It can be implemented in C++ using std::fma(). String manipulation will also give an exact result, since the multiplication is by a power of 10.
142. Return ! CreateTimeDurationRecord(days × sign, hours × sign, minutes × sign, seconds × sign, milliseconds × sign, microseconds × sign, nanoseconds × sign).
     7.5.36 BalanceTimeDurationRelative ( days, norm, largestUnit, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime )
     The abstract operation BalanceTimeDurationRelative takes arguments days (an integer), norm (a Normalized Time Duration Record), largestUnit (a String), zonedRelativeTo (a Temporal.ZonedDateTime), timeZoneRec (a Time Zone Methods Record), and precalculatedPlainDateTime (a Temporal.PlainDateTime or undefined) and returns either a normal completion containing a Time Duration Record, or an abrupt completion. It converts the time units of a duration into a form where lower units are converted into higher units as much as possible, up to largestUnit, taking day length of zonedRelativeTo into account. If the Number value for any unit is infinite, it returns abruptly with a RangeError.

This operation observably calls time zone and calendar methods.

1. Let startNs be zonedRelativeTo.[[Nanoseconds]].
2. Let startInstant be ! CreateTemporalInstant(startNs).
3. Let intermediateNs be startNs.
4. If days ≠ 0, then
   a. If precalculatedPlainDateTime is undefined, set precalculatedPlainDateTime to ? GetPlainDateTimeFor(timeZoneRec, startInstant, "iso8601").
   b. Let intermediateResult be ? AddDaysToZonedDateTime(startInstant, precalculatedPlainDateTime, timeZoneRec, "iso8601", days).
   c. Set intermediateNs to intermediateResult.[[EpochNanoseconds]].
5. Let endNs be ? AddInstant(intermediateNs, norm).
6. Set norm to NormalizedTimeDurationFromEpochNanosecondsDifference(endNs, startNs).
7. If NormalizedTimeDurationIsZero(norm) is true, return ! CreateTimeDurationRecord(0, 0, 0, 0, 0, 0, 0).
8. If IsCalendarUnit(largestUnit) is true or largestUnit is "day", then
   a. If precalculatedPlainDateTime is undefined, set precalculatedPlainDateTime to ? GetPlainDateTimeFor(timeZoneRec, startInstant, "iso8601").
   b. Let result be ? NormalizedTimeDurationToDays(norm, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime).
   c. Set days to result.[[Days]].
   d. Set norm to result.[[NormalizedTime]].
   e. Set largestUnit to "hour".
9. Else,
   a. Set days to 0.
10. Let balanceResult be BalanceTimeDuration(norm, largestUnit).
11. Return ! CreateTimeDurationRecord(days, balanceResult.[[Hours]], balanceResult.[[Minutes]], balanceResult.[[Seconds]], balanceResult.[[Milliseconds]], balanceResult.[[Microseconds]], balanceResult.[[Nanoseconds]]).
    7.5.37 UnbalanceDateDurationRelative ( years, months, weeks, days, largestUnit, plainRelativeTo, calendarRec )
    The abstract operation UnbalanceDateDurationRelative takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), largestUnit (a String), plainRelativeTo (undefined or a Temporal.PlainDate), and calendarRec (undefined or a Calendar Methods Record). It converts the calendar units of a duration into a form where no unit is larger than largestUnit, and returns the result as a Date Duration Record. It performs the following steps when called:

12. Assert: If plainRelativeTo is not undefined, calendarRec is not undefined.
13. Let defaultLargestUnit be DefaultTemporalLargestUnit(years, months, weeks, days, 0, 0, 0, 0, 0).
14. Let effectiveLargestUnit be LargerOfTwoTemporalUnits(largestUnit, "day").
15. If effectiveLargestUnit is LargerOfTwoTemporalUnits(defaultLargestUnit, effectiveLargestUnit), then
    a. Return ! CreateDateDurationRecord(years, months, weeks, days).
16. Assert: effectiveLargestUnit is not "year".
17. If calendarRec is undefined, then
    a. Throw a RangeError exception.
18. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-ADD) is true.
19. If effectiveLargestUnit is "month", then
    a. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-UNTIL) is true.
    b. Let yearsDuration be ! CreateTemporalDuration(years, 0, 0, 0, 0, 0, 0, 0, 0, 0).
    c. Let later be ? CalendarDateAdd(calendarRec, plainRelativeTo, yearsDuration).
    d. Let untilOptions be OrdinaryObjectCreate(null).
    e. Perform ! CreateDataPropertyOrThrow(untilOptions, "largestUnit", "month").
    f. Let untilResult be ? CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions).
    g. Let yearsInMonths be untilResult.[[Months]].
    h. Return ? CreateDateDurationRecord(0, months + yearsInMonths, weeks, days).
20. If effectiveLargestUnit is "week", then
    a. Let yearsMonthsDuration be ! CreateTemporalDuration(years, months, 0, 0, 0, 0, 0, 0, 0, 0).
    b. Let later be ? CalendarDateAdd(calendarRec, plainRelativeTo, yearsMonthsDuration).
    c. Let yearsMonthsInDays be DaysUntil(plainRelativeTo, later).
    d. Return ? CreateDateDurationRecord(0, 0, weeks, days + yearsMonthsInDays).
21. NOTE: largestUnit can be any time unit as well as "day".
22. Let yearsMonthsWeeksDuration be ! CreateTemporalDuration(years, months, weeks, 0, 0, 0, 0, 0, 0, 0).
23. Let later be ? CalendarDateAdd(calendarRec, plainRelativeTo, yearsMonthsWeeksDuration).
24. Let yearsMonthsWeeksInDays be DaysUntil(plainRelativeTo, later).
25. Return ? CreateDateDurationRecord(0, 0, 0, days + yearsMonthsWeeksInDays).
    7.5.38 BalanceDateDurationRelative ( years, months, weeks, days, largestUnit, smallestUnit, plainRelativeTo, calendarRec )
    The abstract operation BalanceDateDurationRelative takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), largestUnit (a String), smallestUnit (a String), plainRelativeTo (undefined or a Temporal.PlainDate), and calendarRec (undefined or a Calendar Methods Record). It converts the calendar units of a duration into a form where lower units are converted into higher units as much as possible, up to largestUnit and not lower than smallestUnit, and returns the result as a Date Duration Record. It performs the following steps when called:

26. Assert: If plainRelativeTo is not undefined, calendarRec is not undefined.
27. Let allZero be false.
28. If years = 0, and months = 0, and weeks = 0, and days = 0, set allZero to true.
29. If largestUnit is not one of "year", "month", or "week", or allZero is true, then
    a. Return ! CreateDateDurationRecord(years, months, weeks, days).
30. If plainRelativeTo is undefined, then
    a. Throw a RangeError exception.
31. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-ADD) is true.
32. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-UNTIL) is true.
33. Let untilOptions be OrdinaryObjectCreate(null).
34. Perform ! CreateDataPropertyOrThrow(untilOptions, "largestUnit", largestUnit).
35. If largestUnit is "year", then
    a. If smallestUnit is "week", then
    i. Assert: days = 0.
    ii. Let yearsMonthsDuration be ! CreateTemporalDuration(years, months, 0, 0, 0, 0, 0, 0, 0, 0).
    iii. Let later be ? AddDate(calendarRec, plainRelativeTo, yearsMonthsDuration).
    iv. Let untilResult be ? CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions).
    v. Return ? CreateDateDurationRecord(untilResult.[[Years]], untilResult.[[Months]], weeks, 0).
    b. Let yearsMonthsWeeksDaysDuration be ! CreateTemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0).
    c. Let later be ? AddDate(calendarRec, plainRelativeTo, yearsMonthsWeeksDaysDuration).
    d. Let untilResult be ? CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions).
    e. Return ! CreateDateDurationRecord(untilResult.[[Years]], untilResult.[[Months]], untilResult.[[Weeks]], untilResult.[[Days]]).
36. If largestUnit is "month", then
    a. Assert: years = 0.
    b. If smallestUnit is "week", then
    i. Assert: days = 0.
    ii. Return ! CreateDateDurationRecord(0, months, weeks, 0).
    c. Let monthsWeeksDaysDuration be ! CreateTemporalDuration(0, months, weeks, days, 0, 0, 0, 0, 0, 0).
    d. Let later be ? AddDate(calendarRec, plainRelativeTo, monthsWeeksDaysDuration).
    e. Let untilResult be ? CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions).
    f. Return ! CreateDateDurationRecord(0, untilResult.[[Months]], untilResult.[[Weeks]], untilResult.[[Days]]).
37. Assert: largestUnit is "week".
38. Assert: years = 0.
39. Assert: months = 0.
40. Let weeksDaysDuration be ! CreateTemporalDuration(0, 0, weeks, days, 0, 0, 0, 0, 0, 0).
41. Let later be ? AddDate(calendarRec, plainRelativeTo, weeksDaysDuration).
42. Let untilResult be ? CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions).
43. Return ! CreateDateDurationRecord(0, 0, untilResult.[[Weeks]], untilResult.[[Days]]).
    7.5.39 AddDuration ( y1, mon1, w1, d1, h1, min1, s1, ms1, mus1, ns1, y2, mon2, w2, d2, h2, min2, s2, ms2, mus2, ns2, plainRelativeTo, calendarRec, zonedRelativeTo, timeZoneRec [ , precalculatedPlainDateTime ] )
    The abstract operation AddDuration takes arguments y1 (an integer), mon1 (an integer), w1 (an integer), d1 (an integer), h1 (an integer), min1 (an integer), s1 (an integer), ms1 (an integer), mus1 (an integer), ns1 (an integer), y2 (an integer), mon2 (an integer), w2 (an integer), d2 (an integer), h2 (an integer), min2 (an integer), s2 (an integer), ms2 (an integer), mus2 (an integer), ns2 (an integer), plainRelativeTo (a Temporal.PlainDate or undefined), calendarRec (a Calendar Methods Record or undefined), zonedRelativeTo (a Temporal.ZonedDateTime or undefined), and timeZoneRec (a Time Zone Methods Record or undefined) and optional argument precalculatedPlainDateTime (a Temporal.PlainDateTime or undefined) and returns either a normal completion containing a Duration Record, or a throw completion. It adds the components of a second duration represented by y2 through ns2 to those of a first duration represented by y1 through ns1, and balances the duration relative to the given date zonedRelativeTo or plainRelativeTo, to ensure that no mixed signs remain in the result. It performs the following steps when called:

44. Assert: If zonedRelativeTo is not undefined, or plainRelativeTo is not undefined, calendarRec is not undefined.
45. Assert: If zonedRelativeTo is not undefined, timeZoneRec is not undefined.
46. Let largestUnit1 be ! DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, mus1).
47. Let largestUnit2 be ! DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, mus2).
48. Let largestUnit be LargerOfTwoTemporalUnits(largestUnit1, largestUnit2).
49. If zonedRelativeTo is undefined and plainRelativeTo is undefined, then
    a. If largestUnit is one of "year", "month", or "week", then
    i. Throw a RangeError exception.
    b. Let norm1 be NormalizeTimeDuration(h1, min1, s1, ms1, mus1, ns1).
    c. Let norm2 be NormalizeTimeDuration(h2, min2, s2, ms2, mus2, ns2).
    d. Let normResult be ? AddNormalizedTimeDuration(norm1, norm2).
    e. Set normResult to ? Add24HourDaysToNormalizedTimeDuration(normResult, d1 + d2).
    f. Let result be BalanceTimeDuration(normResult, largestUnit).
    g. Return CreateDurationRecord(0, 0, 0, result.[[Days]], result.[[Hours]], result.[[Minutes]], result.[[Seconds]], result.[[Milliseconds]], result.[[Microseconds]], result.[[Nanoseconds]]).
50. If plainRelativeTo is not undefined, then
    a. Assert: zonedRelativeTo is undefined.
    b. Let dateDuration1 be ! CreateTemporalDuration(y1, mon1, w1, d1, 0, 0, 0, 0, 0, 0).
    c. Let dateDuration2 be ! CreateTemporalDuration(y2, mon2, w2, d2, 0, 0, 0, 0, 0, 0).
    d. Let intermediate be ? AddDate(calendarRec, plainRelativeTo, dateDuration1).
    e. Let end be ? AddDate(calendarRec, intermediate, dateDuration2).
    f. Let dateLargestUnit be LargerOfTwoTemporalUnits("day", largestUnit).
    g. Let differenceOptions be OrdinaryObjectCreate(null).
    h. Perform ! CreateDataPropertyOrThrow(differenceOptions, "largestUnit", dateLargestUnit).
    i. Let dateDifference be ? DifferenceDate(calendarRec, plainRelativeTo, end, differenceOptions).
    j. Let norm1 be NormalizeTimeDuration(h1, min1, s1, ms1, mus1, ns1).
    k. Let norm2 be NormalizeTimeDuration(h2, min2, s2, ms2, mus2, ns2).
    l. Let norm1WithDays be ? Add24HourDaysToNormalizedTimeDuration(norm1, dateDifference.[[Days]]).
    m. Let normResult be ? AddNormalizedTimeDuration(norm1WithDays, norm2).
    n. Let result be BalanceTimeDuration(normResult, largestUnit).
    o. Return CreateDurationRecord(dateDifference.[[Years]], dateDifference.[[Months]], dateDifference.[[Weeks]], result.[[Days]], result.[[Hours]], result.[[Minutes]], result.[[Seconds]], result.[[Milliseconds]], result.[[Microseconds]], result.[[Nanoseconds]]).
51. Assert: zonedRelativeTo is not undefined.
52. If precalculatedPlainDateTime is not present, let precalculatedPlainDateTime be undefined.
53. If IsCalendarUnit(largestUnit) is true, or largestUnit is "day", let startDateTimeNeeded be true; else let startDateTimeNeeded be false.
54. If precalculatedPlainDateTime is undefined and startDateTimeNeeded is true, then
    a. Let startDateTime be ? GetPlainDateTimeFor(timeZoneRec, zonedRelativeTo.[[Nanoseconds]], calendarRec.[[Receiver]]).
55. Else,
    a. Let startDateTime be precalculatedPlainDateTime.
56. Let norm1 be NormalizeTimeDuration(h1, min1, s1, ms1, mus1, ns1).
57. Let norm2 be NormalizeTimeDuration(h2, min2, s2, ms2, mus2, ns2).
58. Let intermediateNs be ? AddZonedDateTime(zonedRelativeTo.[[Nanoseconds]], timeZoneRec, calendarRec, y1, mon1, w1, d1, norm1, startDateTime).
59. Let endNs be ? AddZonedDateTime(intermediateNs, timeZoneRec, calendarRec, y2, mon2, w2, d2, norm2).
60. If largestUnit is not one of "year", "month", "week", or "day", then
    a. Let norm be NormalizedTimeDurationFromEpochNanosecondsDifference(endNs, zonedRelativeTo.[[Nanoseconds]]).
    b. Let result be BalanceTimeDuration(norm, largestUnit).
    c. Return CreateDurationRecord(0, 0, 0, 0, result.[[Hours]], result.[[Minutes]], result.[[Seconds]], result.[[Milliseconds]], result.[[Microseconds]], result.[[Nanoseconds]]).
61. Let diffResult be ? DifferenceZonedDateTime(zonedRelativeTo.[[Nanoseconds]], endNs, timeZoneRec, calendarRec, largestUnit, OrdinaryObjectCreate(null), startDateTime).
62. Let timeResult be BalanceTimeDuration(diffResult.[[NormalizedTime]], "hour").
63. Return CreateDurationRecord(diffResult.[[Years]], diffResult.[[Months]], diffResult.[[Weeks]], diffResult.[[Days]], timeResult.[[Hours]], timeResult.[[Minutes]], timeResult.[[Seconds]], timeResult.[[Milliseconds]], timeResult.[[Microseconds]], timeResult.[[Nanoseconds]]).
    7.5.40 DaysUntil ( earlier, later )
    The abstract operation DaysUntil takes arguments earlier (a Temporal.PlainDate) and later (a Temporal.PlainDate) and returns an integer. The returned value is the number of days elapsed between the calendar dates of two Temporal.PlainDate instances earlier and later. If earlier is later than later, then the result is negative. It performs the following steps when called:

64. Let epochDays1 be ISODateToEpochDays(earlier.[[ISOYear]], earlier.[[ISOMonth]] - 1, earlier.[[ISODay]]).
65. Let epochDays2 be ISODateToEpochDays(later.[[ISOYear]], later.[[ISOMonth]] - 1, later.[[ISODay]]).
66. Return epochDays2 - epochDays1.
    7.5.41 MoveRelativeDate ( calendarRec, relativeTo, duration )
    The abstract operation MoveRelativeDate takes arguments calendarRec (a Calendar Methods Record), relativeTo (a Temporal.PlainDate), and duration (a Temporal.Duration). It adds duration to relativeTo, returning a Record with a field [[RelativeTo]] (a Temporal.PlainDate) containing the result, as well as a [[Days]] field (an integer) containing the number of days added according to the calendar reckoning of calendar. This is used when balancing or rounding durations relative to a particular date. It performs the following steps when called:

67. Let newDate be ? AddDate(calendarRec, relativeTo, duration).
68. Let days be DaysUntil(relativeTo, newDate).
69. Return the Record { [[RelativeTo]]: newDate, [[Days]]: days }.
    7.5.42 MoveRelativeZonedDateTime ( zonedDateTime, calendarRec, timeZoneRec, years, months, weeks, days, precalculatedPlainDateTime )
    The abstract operation MoveRelativeZonedDateTime takes arguments zonedDateTime (a Temporal.ZonedDateTime), calendarRec (a Calendar Methods Record), timeZoneRec (a Time Zone Methods Record), years (an integer), months (an integer), weeks (an integer), days (an integer), and precalculatedPlainDateTime (a Temporal.PlainDateTime or undefined) and returns either a normal completion containing a Temporal.ZonedDateTime, or a throw completion. It adjusts the calendar part of zonedDateTime for use as the "relative-to" parameter of another operation and returns a new Temporal.ZonedDateTime instance. It performs the following steps when called:

70. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-OFFSET-NANOSECONDS-FOR) is true.
71. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-POSSIBLE-INSTANTS-FOR) is true.
72. Let intermediateNs be ? AddZonedDateTime(zonedDateTime.[[Nanoseconds]], timeZoneRec, calendarRec, years, months, weeks, days, ZeroTimeDuration(), precalculatedPlainDateTime).
73. Return ! CreateTemporalZonedDateTime(intermediateNs, zonedDateTime.[[TimeZone]], zonedDateTime.[[Calendar]]).
    7.5.43 RoundDuration ( years, months, weeks, days, norm, increment, unit, roundingMode [ , plainRelativeTo [ , calendarRec [ , zonedRelativeTo [ , timeZoneRec [ , precalculatedPlainDateTime ] ] ] ] ] )
    The abstract operation RoundDuration takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), norm (a Normalized Time Duration Record), increment (an integer), unit (a String), and roundingMode (a String from the Identifier column of Table 19) and optional arguments plainRelativeTo (undefined or a Temporal.PlainDate), calendarRec (undefined or a Calendar Methods Record), zonedRelativeTo (undefined or a Temporal.ZonedDateTime), timeZoneRec (undefined or a Time Zone Methods Record), and precalculatedPlainDateTime (undefined or a Temporal.PlainDateTime) and returns either a normal completion containing a Record with fields [[NormalizedDuration]] (a Normalized Duration Record) and [[Total]] (a mathematical value), or a throw completion. It rounds a duration (denoted by years through nanoseconds) according to the rounding parameters unit, increment, and roundingMode, and returns a Record with the Normalized Duration Record result in its [[NormalizedDuration]] field. It also returns the total of the smallest unit before the rounding operation in its [[Total]] field, for use in Temporal.Duration.prototype.total. For rounding involving calendar units, the relativeTo parameter is required. It performs the following steps when called:

74. Assert: If either of plainRelativeTo or zonedRelativeTo are present and not undefined, calendarRec is not undefined.
75. Assert: If zonedRelativeTo is present and not undefined, timeZoneRec is not undefined.
76. If plainRelativeTo is not present, set plainRelativeTo to undefined.
77. If zonedRelativeTo is not present, set zonedRelativeTo to undefined.
78. If precalculatedPlainDateTime is not present, set precalculatedPlainDateTime to undefined.
79. If IsCalendarUnit(unit) is true, then
    a. If plainRelativeTo is undefined, throw a RangeError exception.
    b. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-ADD) is true.
    c. Assert: CalendarMethodsRecordHasLookedUp(calendarRec, DATE-UNTIL) is true.
80. If IsCalendarUnit(unit) is true or unit is "day", then
    a. If zonedRelativeTo is not undefined, then
    i. Let intermediate be ? MoveRelativeZonedDateTime(zonedRelativeTo, calendarRec, timeZoneRec, years, months, weeks, days, precalculatedPlainDateTime).
    ii. Let result be ? NormalizedTimeDurationToDays(norm, intermediate, timeZoneRec).
    iii. Let fractionalDays be days + result.[[Days]] + DivideNormalizedTimeDuration(result.[[Remainder]], result.[[DayLength]]).
    b. Else,
    i. Let fractionalDays be days + DivideNormalizedTimeDuration(norm, nsPerDay).
    c. Set days to 0.
81. Else,
    a. Assert: fractionalDays is not used below.
82. If unit is "year", then
    a. Let yearsDuration be ! CreateTemporalDuration(years, 0, 0, 0, 0, 0, 0, 0, 0, 0).
    b. Let yearsLater be ? AddDate(calendarRec, plainRelativeTo, yearsDuration).
    c. Let yearsMonthsWeeks be ! CreateTemporalDuration(years, months, weeks, 0, 0, 0, 0, 0, 0, 0).
    d. Let yearsMonthsWeeksLater be ? AddDate(calendarRec, plainRelativeTo, yearsMonthsWeeks).
    e. Let monthsWeeksInDays be DaysUntil(yearsLater, yearsMonthsWeeksLater).
    f. Set plainRelativeTo to yearsLater.
    g. Set fractionalDays to fractionalDays + monthsWeeksInDays.
    h. Let isoResult be BalanceISODate(plainRelativeTo.[[ISOYear]], plainRelativeTo.[[ISOMonth]], plainRelativeTo.[[ISODay]] + truncate(fractionalDays)).
    i. Let wholeDaysLater be ? CreateTemporalDate(isoResult.[[Year]], isoResult.[[Month]], isoResult.[[Day]], calendarRec.[[Receiver]]).
    j. Let untilOptions be OrdinaryObjectCreate(null).
    k. Perform ! CreateDataPropertyOrThrow(untilOptions, "largestUnit", "year").
    l. Let timePassed be ? DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions).
    m. Let yearsPassed be timePassed.[[Years]].
    n. Set years to years + yearsPassed.
    o. Set yearsDuration to ! CreateTemporalDuration(yearsPassed, 0, 0, 0, 0, 0, 0, 0, 0, 0).
    p. Let moveResult be ? MoveRelativeDate(calendarRec, plainRelativeTo, yearsDuration).
    q. Set plainRelativeTo to moveResult.[[RelativeTo]].
    r. Let daysPassed be moveResult.[[Days]].
    s. Set fractionalDays to fractionalDays - daysPassed.
    t. If fractionalDays < 0, let sign be -1; else, let sign be 1.
    u. Let oneYear be ! CreateTemporalDuration(sign, 0, 0, 0, 0, 0, 0, 0, 0, 0).
    v. Set moveResult to ? MoveRelativeDate(calendarRec, plainRelativeTo, oneYear).
    w. Let oneYearDays be moveResult.[[Days]].
    x. If oneYearDays = 0, throw a RangeError exception.
    y. Let fractionalYears be years + fractionalDays / abs(oneYearDays).
    z. Set years to RoundNumberToIncrement(fractionalYears, increment, roundingMode).
    aa. Let total be fractionalYears.
    ab. Set months and weeks to 0.
    ac. Set norm to ZeroTimeDuration().
83. Else if unit is "month", then
    a. Let yearsMonths be ! CreateTemporalDuration(years, months, 0, 0, 0, 0, 0, 0, 0, 0).
    b. Let yearsMonthsLater be ? AddDate(calendarRec, plainRelativeTo, yearsMonths).
    c. Let yearsMonthsWeeks be ! CreateTemporalDuration(years, months, weeks, 0, 0, 0, 0, 0, 0, 0).
    d. Let yearsMonthsWeeksLater be ? AddDate(calendarRec, plainRelativeTo, yearsMonthsWeeks).
    e. Let weeksInDays be DaysUntil(yearsMonthsLater, yearsMonthsWeeksLater).
    f. Set plainRelativeTo to yearsMonthsLater.
    g. Set fractionalDays to fractionalDays + weeksInDays.
    h. Let isoResult be BalanceISODate(plainRelativeTo.[[ISOYear]], plainRelativeTo.[[ISOMonth]], plainRelativeTo.[[ISODay]] + truncate(fractionalDays)).
    i. Let wholeDaysLater be ? CreateTemporalDate(isoResult.[[Year]], isoResult.[[Month]], isoResult.[[Day]], calendarRec.[[Receiver]]).
    j. Let untilOptions be OrdinaryObjectCreate(null).
    k. Perform ! CreateDataPropertyOrThrow(untilOptions, "largestUnit", "month").
    l. Let timePassed be ? DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions).
    m. Let monthsPassed be timePassed.[[Months]].
    n. Set months to months + monthsPassed.
    o. Let monthsPassedDuration be ! CreateTemporalDuration(0, monthsPassed, 0, 0, 0, 0, 0, 0, 0, 0).
    p. Let moveResult be ? MoveRelativeDate(calendarRec, plainRelativeTo, monthsPassedDuration).
    q. Set plainRelativeTo to moveResult.[[RelativeTo]].
    r. Let daysPassed be moveResult.[[Days]].
    s. Set fractionalDays to fractionalDays - daysPassed.
    t. If fractionalDays < 0, let sign be -1; else, let sign be 1.
    u. Let oneMonth be ! CreateTemporalDuration(0, sign, 0, 0, 0, 0, 0, 0, 0, 0).
    v. Set moveResult to ? MoveRelativeDate(calendarRec, plainRelativeTo, oneMonth).
    w. Let oneMonthDays be moveResult.[[Days]].
    x. If oneMonthDays = 0, throw a RangeError exception.
    y. Let fractionalMonths be months + fractionalDays / abs(oneMonthDays).
    z. Set months to RoundNumberToIncrement(fractionalMonths, increment, roundingMode).
    aa. Let total be fractionalMonths.
    ab. Set weeks to 0.
    ac. Set norm to ZeroTimeDuration().
84. Else if unit is "week", then
    a. Let isoResult be BalanceISODate(plainRelativeTo.[[ISOYear]], plainRelativeTo.[[ISOMonth]], plainRelativeTo.[[ISODay]] + truncate(fractionalDays)).
    b. Let wholeDaysLater be ? CreateTemporalDate(isoResult.[[Year]], isoResult.[[Month]], isoResult.[[Day]], calendarRec.[[Receiver]]).
    c. Let untilOptions be OrdinaryObjectCreate(null).
    d. Perform ! CreateDataPropertyOrThrow(untilOptions, "largestUnit", "week").
    e. Let timePassed be ? DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions).
    f. Let weeksPassed be timePassed.[[Weeks]].
    g. Set weeks to weeks + weeksPassed.
    h. Let weeksPassedDuration be ! CreateTemporalDuration(0, 0, weeksPassed, 0, 0, 0, 0, 0, 0, 0).
    i. Let moveResult be ? MoveRelativeDate(calendarRec, plainRelativeTo, weeksPassedDuration).
    j. Set plainRelativeTo to moveResult.[[RelativeTo]].
    k. Let daysPassed be moveResult.[[Days]].
    l. Set fractionalDays to fractionalDays - daysPassed.
    m. If fractionalDays < 0, let sign be -1; else, let sign be 1.
    n. Let oneWeek be ! CreateTemporalDuration(0, 0, sign, 0, 0, 0, 0, 0, 0, 0).
    o. Set moveResult to ? MoveRelativeDate(calendarRec, plainRelativeTo, oneWeek).
    p. Let oneWeekDays be moveResult.[[Days]].
    q. If oneWeekDays = 0, throw a RangeError exception.
    r. Let fractionalWeeks be weeks + fractionalDays / abs(oneWeekDays).
    s. Set weeks to RoundNumberToIncrement(fractionalWeeks, increment, roundingMode).
    t. Let total be fractionalWeeks.
    u. Set norm to ZeroTimeDuration().
85. Else if unit is "day", then
    a. Set days to RoundNumberToIncrement(fractionalDays, increment, roundingMode).
    b. Let total be fractionalDays.
    c. Set norm to ZeroTimeDuration().
86. Else if unit is "hour", then
    a. Let divisor be 3.6 × 10\*\*12.
    b. Let total be DivideNormalizedTimeDuration(norm, divisor).
    c. Set norm to ? RoundNormalizedTimeDurationToIncrement(norm, divisor × increment, roundingMode).
87. Else if unit is "minute", then
    a. Let divisor be 6 × 10\*\*10.
    b. Let total be DivideNormalizedTimeDuration(norm, divisor).
    c. Set norm to ? RoundNormalizedTimeDurationToIncrement(norm, divisor × increment, roundingMode).
88. Else if unit is "second", then
    a. Let divisor be 10\*\*9.
    b. Let total be DivideNormalizedTimeDuration(norm, divisor).
    c. Set norm to ? RoundNormalizedTimeDurationToIncrement(norm, divisor × increment, roundingMode).
89. Else if unit is "millisecond", then
    a. Let divisor be 10\*\*6.
    b. Let total be DivideNormalizedTimeDuration(norm, divisor).
    c. Set norm to ? RoundNormalizedTimeDurationToIncrement(norm, divisor × increment, roundingMode).
90. Else if unit is "microsecond", then
    a. Let divisor be 10\*\*3.
    b. Let total be DivideNormalizedTimeDuration(norm, divisor).
    c. Set norm to ? RoundNormalizedTimeDurationToIncrement(norm, divisor × increment, roundingMode).
91. Else,
    a. Assert: unit is "nanosecond".
    b. Let total be NormalizedTimeDurationSeconds(norm) × 10\*\*9 + NormalizedTimeDurationSubseconds(norm).
    c. Set norm to ? RoundNormalizedTimeDurationToIncrement(norm, increment, roundingMode).
92. Return the Record { [[NormalizedDuration]]: ? CreateNormalizedDurationRecord(years, months, weeks, days, norm), [[Total]]: total }.
    7.5.44 AdjustRoundedDurationDays ( years, months, weeks, days, norm, increment, unit, roundingMode, zonedRelativeTo, calendarRec, timeZoneRec, precalculatedPlainDateTime )
    The abstract operation AdjustRoundedDurationDays takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), norm (a Normalized Time Duration Record), increment (an integer), unit (a String), roundingMode (a String from the Identifier column of Table 19), zonedRelativeTo (a Temporal.ZonedDateTime), calendarRec (a Calendar Methods Record), timeZoneRec (a Time Zone Methods Record), and precalculatedPlainDateTime (a Temporal.PlainDateTime or undefined) and returns either a normal completion containing a Normalized Duration Record, or a throw completion. It adjusts, if necessary, a duration that was rounded to a unit of hours or lower relative to a Temporal.ZonedDateTime, and returns the result. On a calendar day that is not 24 hours in length due to time zone offset changes, it is possible for a duration's time units to round up to exceed the day's length. In this case, the days part of the duration is adjusted by one, and the time part is re-rounded. It performs the following steps when called:

93. If IsCalendarUnit(unit) is true; or unit is "day"; or unit is "nanosecond" and increment is 1, then
    a. Return ! CreateNormalizedDurationRecord(years, months, weeks, days, norm).
94. Assert: precalculatedPlainDateTime is not undefined.
95. Let direction be NormalizedTimeDurationSign(norm).
96. Let dayStart be ? AddZonedDateTime(zonedRelativeTo.[[Nanoseconds]], timeZoneRec, calendarRec, years, months, weeks, days, ZeroTimeDuration(), precalculatedPlainDateTime).
97. Let dayStartInstant be ! CreateTemporalInstant(dayStart).
98. Let dayStartDateTime be ? GetPlainDateTimeFor(timeZoneRec, dayStartInstant, zonedRelativeTo.[[Calendar]]).
99. Let dayEnd be ? AddDaysToZonedDateTime(dayStartInstant, dayStartDateTime, timeZoneRec, zonedRelativeTo.[[Calendar]], direction).[[EpochNanoseconds]].
100. Let dayLengthNs be NormalizedTimeDurationFromEpochNanosecondsDifference(dayEnd, dayStart).
101. Let oneDayLess be ? SubtractNormalizedTimeDuration(norm, dayLengthNs).
102. If NormalizedTimeDurationSign(oneDayLess) × direction < 0, then
     a. Return ! CreateNormalizedDurationRecord(years, months, weeks, days, norm).
103. Let adjustedDateDuration be ? AddDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0, 0, 0, 0, direction, 0, 0, 0, 0, 0, 0, undefined, zonedRelativeTo, calendarRec, timeZoneRec, precalculatedPlainDateTime).
104. Let roundRecord be ? RoundDuration(0, 0, 0, 0, oneDayLess, increment, unit, roundingMode).
105. Return ? CombineDateAndNormalizedTimeDuration(adjustedDateDuration, roundRecord.[[NormalizedDuration]].[[NormalizedTime]]).
     7.5.45 TemporalDurationToString ( years, months, weeks, days, hours, minutes, normSeconds, precision )
     The abstract operation TemporalDurationToString takes arguments years (an integer), months (an integer), weeks (an integer), days (an integer), hours (an integer), minutes (an integer), normSeconds (a Normalized Time Duration Record), and precision (an integer between 0 and 9 inclusive, or "auto"). It returns a String which is the ISO 8601 representation of the duration denoted by years through nanoseconds, with the number of decimal places in the seconds value controlled by precision. It performs the following steps when called:

106. Let sign be ! DurationSign(years, months, weeks, days, hours, minutes, NormalizedTimeDurationSeconds(normSeconds), 0, 0, NormalizedTimeDurationSubseconds(normSeconds)).
107. Let datePart be "".
108. If years is not 0, then
     a. Set datePart to the string concatenation of abs(years) formatted as a decimal number and the code unit 0x0059 (LATIN CAPITAL LETTER Y).
109. If months is not 0, then
     a. Set datePart to the string concatenation of datePart, abs(months) formatted as a decimal number, and the code unit 0x004D (LATIN CAPITAL LETTER M).
110. If weeks is not 0, then
     a. Set datePart to the string concatenation of datePart, abs(weeks) formatted as a decimal number, and the code unit 0x0057 (LATIN CAPITAL LETTER W).
111. If days is not 0, then
     a. Set datePart to the string concatenation of datePart, abs(days) formatted as a decimal number, and the code unit 0x0044 (LATIN CAPITAL LETTER D).
112. Let timePart be "".
113. If hours is not 0, then
     a. Set timePart to the string concatenation of abs(hours) formatted as a decimal number and the code unit 0x0048 (LATIN CAPITAL LETTER H).
114. If minutes is not 0, then
     a. Set timePart to the string concatenation of timePart, abs(minutes) formatted as a decimal number, and the code unit 0x004D (LATIN CAPITAL LETTER M).
115. Let zeroMinutesAndHigher be false.
116. If years = 0, and months = 0, and weeks = 0, and days = 0, and hours = 0, and minutes = 0, set zeroMinutesAndHigher to true.
117. If NormalizedTimeDurationIsZero(normSeconds) is false, or zeroMinutesAndHigher is true, or precision is not "auto", then
     a. Let secondsPart be abs(NormalizedTimeDurationSeconds(normSeconds)) formatted as a decimal number.
     b. Let subSecondsPart be FormatFractionalSeconds(abs(NormalizedTimeDurationSubseconds(normSeconds)), precision).
     c. Set timePart to the string concatenation of timePart, secondsPart, subSecondsPart, and the code unit 0x0053 (LATIN CAPITAL LETTER S).
118. Let signPart be the code unit 0x002D (HYPHEN-MINUS) if sign < 0, and otherwise the empty String.
119. Let result be the string concatenation of signPart, the code unit 0x0050 (LATIN CAPITAL LETTER P) and datePart.
120. If timePart is not "", then
     a. Set result to the string concatenation of result, the code unit 0x0054 (LATIN CAPITAL LETTER T), and timePart.
121. Return result.
     7.5.46 AddDurationToOrSubtractDurationFromDuration ( operation, duration, other, options )
     The abstract operation AddDurationToOrSubtractDurationFromDuration takes arguments operation (ADD or SUBTRACT), duration (a Temporal.Duration), other (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.Duration or an abrupt completion. It adds/subtracts other to/from duration, resulting in a longer/shorter duration. It performs the following steps when called:

122. If operation is SUBTRACT, let sign be -1. Otherwise, let sign be 1.
123. Set other to ? ToTemporalDurationRecord(other).
124. Set options to ? GetOptionsObject(options).
125. Let relativeToRecord be ? ToRelativeTemporalObject(options).
126. Let plainRelativeTo be relativeToRecord.[[PlainRelativeTo]].
127. Let zonedRelativeTo be relativeToRecord.[[ZonedRelativeTo]].
128. Let timeZoneRec be relativeToRecord.[[TimeZoneRec]].
129. Let calendarRec be ? CreateCalendarMethodsRecordFromRelativeTo(plainRelativeTo, zonedRelativeTo, « DATE-ADD, DATE-UNTIL »).
130. Let result be ? AddDuration(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], duration.[[Days]], duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]], sign × other.[[Years]], sign × other.[[Months]], sign × other.[[Weeks]], sign × other.[[Days]], sign × other.[[Hours]], sign × other.[[Minutes]], sign × other.[[Seconds]], sign × other.[[Milliseconds]], sign × other.[[Microseconds]], sign × other.[[Nanoseconds]], plainRelativeTo, calendarRec, zonedRelativeTo, timeZoneRec).
131. Return ! CreateTemporalDuration(result.[[Years]], result.[[Months]], result.[[Weeks]], result.[[Days]], result.[[Hours]], result.[[Minutes]], result.[[Seconds]], result.[[Milliseconds]], result.[[Microseconds]], result.[[Nanoseconds]]).
     8 Temporal.Instant Objects
     A Temporal.Instant object is an Object referencing a fixed point in time with nanoseconds precision.

8.1 The Temporal.Instant Constructor
The Temporal.Instant constructor:

creates and initializes a new Temporal.Instant object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.Instant behaviour must include a super call to the %Temporal.Instant% constructor to create and initialize subclass instances with the necessary internal slots.
8.1.1 Temporal.Instant ( epochNanoseconds )
This function performs the following steps when called:

1. If NewTarget is undefined, then
   a. Throw a TypeError exception.
2. Let epochNanoseconds be ? ToBigInt(epochNanoseconds).
3. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
4. Return ? CreateTemporalInstant(epochNanoseconds, NewTarget).
   8.2 Properties of the Temporal.Instant Constructor
   The value of the [[Prototype]] internal slot of the Temporal.Instant constructor is the intrinsic object %Function.prototype%.

The Temporal.Instant constructor has the following properties:

8.2.1 Temporal.Instant.prototype
The initial value of Temporal.Instant.prototype is %Temporal.Instant.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

8.2.2 Temporal.Instant.from ( item )
This function performs the following steps when called:

1. If Type(item) is Object and item has an [[InitializedTemporalInstant]] internal slot, then
   a. Return ! CreateTemporalInstant(item.[[Nanoseconds]]).
2. Return ? ToTemporalInstant(item).
   8.2.3 Temporal.Instant.fromEpochSeconds ( epochSeconds )
   This function performs the following steps when called:

3. Set epochSeconds to ? ToNumber(epochSeconds).
4. Set epochSeconds to ? NumberToBigInt(epochSeconds).
5. Let epochNanoseconds be epochSeconds × ℤ(10\*\*9).
6. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
7. Return ! CreateTemporalInstant(epochNanoseconds).
   8.2.4 Temporal.Instant.fromEpochMilliseconds ( epochMilliseconds )
   This function performs the following steps when called:

8. Set epochMilliseconds to ? ToNumber(epochMilliseconds).
9. Set epochMilliseconds to ? NumberToBigInt(epochMilliseconds).
10. Let epochNanoseconds be epochMilliseconds × ℤ(10\*\*6).
11. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
12. Return ! CreateTemporalInstant(epochNanoseconds).
    8.2.5 Temporal.Instant.fromEpochMicroseconds ( epochMicroseconds )
    This function performs the following steps when called:

13. Set epochMicroseconds to ? ToBigInt(epochMicroseconds).
14. Let epochNanoseconds be epochMicroseconds × 1000ℤ.
15. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
16. Return ! CreateTemporalInstant(epochNanoseconds).
    8.2.6 Temporal.Instant.fromEpochNanoseconds ( epochNanoseconds )
    This function performs the following steps when called:

17. Set epochNanoseconds to ? ToBigInt(epochNanoseconds).
18. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
19. Return ! CreateTemporalInstant(epochNanoseconds).
    8.2.7 Temporal.Instant.compare ( one, two )
    This function performs the following steps when called:

20. Set one to ? ToTemporalInstant(one).
21. Set two to ? ToTemporalInstant(two).
22. Return 𝔽(CompareEpochNanoseconds(one.[[Nanoseconds]], two.[[Nanoseconds]])).
    8.3 Properties of the Temporal.Instant Prototype Object
    The Temporal.Instant prototype object

is itself an ordinary object.
is not a Temporal.Instant instance and does not have a [[InitializedTemporalInstant]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
8.3.1 Temporal.Instant.prototype.constructor
The initial value of Temporal.Instant.prototype.constructor is %Temporal.Instant%.

8.3.2 Temporal.Instant.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.Instant".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

8.3.3 get Temporal.Instant.prototype.epochSeconds
Temporal.Instant.prototype.epochSeconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let instant be the this value.
2. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
3. Let ns be instant.[[Nanoseconds]].
4. Let s be floor(ℝ(ns) / 10\*\*9).
5. Return 𝔽(s).
   8.3.4 get Temporal.Instant.prototype.epochMilliseconds
   Temporal.Instant.prototype.epochMilliseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

6. Let instant be the this value.
7. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
8. Let ns be instant.[[Nanoseconds]].
9. Let ms be floor(ℝ(ns) / 10\*\*6).
10. Return 𝔽(ms).
    8.3.5 get Temporal.Instant.prototype.epochMicroseconds
    Temporal.Instant.prototype.epochMicroseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

11. Let instant be the this value.
12. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
13. Let ns be instant.[[Nanoseconds]].
14. Let µs be floor(ℝ(ns) / 10\*\*3).
15. Return ℤ(µs).
    8.3.6 get Temporal.Instant.prototype.epochNanoseconds
    Temporal.Instant.prototype.epochNanoseconds is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

16. Let instant be the this value.
17. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
18. Let ns be instant.[[Nanoseconds]].
19. Return ns.
    8.3.7 Temporal.Instant.prototype.add ( temporalDurationLike )
    This method performs the following steps when called:

20. Let instant be the this value.
21. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
22. Return ? AddDurationToOrSubtractDurationFromInstant(ADD, instant, temporalDurationLike).
    8.3.8 Temporal.Instant.prototype.subtract ( temporalDurationLike )
    This method performs the following steps when called:

23. Let instant be the this value.
24. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
25. Return ? AddDurationToOrSubtractDurationFromInstant(SUBTRACT, instant, temporalDurationLike).
    8.3.9 Temporal.Instant.prototype.until ( other [ , options ] )
    This method performs the following steps when called:

26. Let instant be the this value.
27. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
28. Return ? DifferenceTemporalInstant(UNTIL, instant, other, options).
    8.3.10 Temporal.Instant.prototype.since ( other [ , options ] )
    This method performs the following steps when called:

29. Let instant be the this value.
30. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
31. Return ? DifferenceTemporalInstant(SINCE, instant, other, options).
    8.3.11 Temporal.Instant.prototype.round ( roundTo )
    This method performs the following steps when called:

32. Let instant be the this value.
33. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
34. If roundTo is undefined, then
    a. Throw a TypeError exception.
35. If Type(roundTo) is String, then
    a. Let paramString be roundTo.
    b. Set roundTo to OrdinaryObjectCreate(null).
    c. Perform ! CreateDataPropertyOrThrow(roundTo, "smallestUnit", paramString).
36. Else,
    a. Set roundTo to ? GetOptionsObject(roundTo).
37. NOTE: The following steps read options and perform independent validation in alphabetical order (ToTemporalRoundingIncrement reads "roundingIncrement" and ToTemporalRoundingMode reads "roundingMode").
38. Let roundingIncrement be ? ToTemporalRoundingIncrement(roundTo).
39. Let roundingMode be ? ToTemporalRoundingMode(roundTo, "halfExpand").
40. Let smallestUnit be ? GetTemporalUnit(roundTo, "smallestUnit", TIME, REQUIRED).
41. If smallestUnit is "hour", then
    a. Let maximum be HoursPerDay.
42. Else if smallestUnit is "minute", then
    a. Let maximum be MinutesPerHour × HoursPerDay.
43. Else if smallestUnit is "second", then
    a. Let maximum be SecondsPerMinute × MinutesPerHour × HoursPerDay.
44. Else if smallestUnit is "millisecond", then
    a. Let maximum be ℝ(msPerDay).
45. Else if smallestUnit is "microsecond", then
    a. Let maximum be 10\*\*3 × ℝ(msPerDay).
46. Else,
    a. Assert: smallestUnit is "nanosecond".
    b. Let maximum be nsPerDay.
47. Perform ? ValidateTemporalRoundingIncrement(roundingIncrement, maximum, true).
48. Let roundedNs be RoundTemporalInstant(instant.[[Nanoseconds]], roundingIncrement, smallestUnit, roundingMode).
49. Return ! CreateTemporalInstant(roundedNs).
    8.3.12 Temporal.Instant.prototype.equals ( other )
    This method performs the following steps when called:

50. Let instant be the this value.
51. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
52. Set other to ? ToTemporalInstant(other).
53. If instant.[[Nanoseconds]] ≠ other.[[Nanoseconds]], return false.
54. Return true.
    8.3.13 Temporal.Instant.prototype.toString ( [ options ] )
    This method performs the following steps when called:

55. Let instant be the this value.
56. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
57. Set options to ? GetOptionsObject(options).
58. NOTE: The following steps read options and perform independent validation in alphabetical order (ToFractionalSecondDigits reads "fractionalSecondDigits" and ToTemporalRoundingMode reads "roundingMode").
59. Let digits be ? ToFractionalSecondDigits(options).
60. Let roundingMode be ? ToTemporalRoundingMode(options, "trunc").
61. Let smallestUnit be ? GetTemporalUnit(options, "smallestUnit", TIME, undefined).
62. If smallestUnit is "hour", throw a RangeError exception.
63. Let timeZone be ? Get(options, "timeZone").
64. If timeZone is not undefined, then
    a. Set timeZone to ? ToTemporalTimeZoneSlotValue(timeZone).
65. Let precision be ToSecondsStringPrecisionRecord(smallestUnit, digits).
66. Let roundedNs be RoundTemporalInstant(instant.[[Nanoseconds]], precision.[[Increment]], precision.[[Unit]], roundingMode).
67. Let roundedInstant be ! CreateTemporalInstant(roundedNs).
68. Return ? TemporalInstantToString(roundedInstant, timeZone, precision.[[Precision]]).
    8.3.14 Temporal.Instant.prototype.toLocaleString ( [ locales [ , options ] ] )
    An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

This method performs the following steps when called:

1. Let instant be the this value.
2. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
3. Return ? TemporalInstantToString(instant, undefined, "auto").
   8.3.15 Temporal.Instant.prototype.toJSON ( )
   This method performs the following steps when called:

4. Let instant be the this value.
5. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
6. Return ? TemporalInstantToString(instant, undefined, "auto").
   8.3.16 Temporal.Instant.prototype.valueOf ( )
   This method performs the following steps when called:

7. Throw a TypeError exception.
   NOTE
   This method always throws, because in the absence of valueOf(), expressions with arithmetic operators such as instant1 > instant2 would fall back to being equivalent to instant1.toString() > instant2.toString(). Lexicographical comparison of serialized strings might not seem obviously wrong, because the result would sometimes be correct. Implementations are encouraged to phrase the error message to point users to Temporal.Instant.compare(), Temporal.Instant.prototype.equals(), and/or Temporal.Instant.prototype.toString().

8.3.17 Temporal.Instant.prototype.toZonedDateTime ( item )
This method performs the following steps when called:

1. Let instant be the this value.
2. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
3. If Type(item) is not Object, then
   a. Throw a TypeError exception.
4. Let calendarLike be ? Get(item, "calendar").
5. If calendarLike is undefined, then
   a. Throw a TypeError exception.
6. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike).
7. Let temporalTimeZoneLike be ? Get(item, "timeZone").
8. If temporalTimeZoneLike is undefined, then
   a. Throw a TypeError exception.
9. Let timeZone be ? ToTemporalTimeZoneSlotValue(temporalTimeZoneLike).
10. Return ! CreateTemporalZonedDateTime(instant.[[Nanoseconds]], timeZone, calendar).
    8.3.18 Temporal.Instant.prototype.toZonedDateTimeISO ( timeZone )
    This method performs the following steps when called:

11. Let instant be the this value.
12. Perform ? RequireInternalSlot(instant, [[InitializedTemporalInstant]]).
13. Set timeZone to ? ToTemporalTimeZoneSlotValue(timeZone).
14. Return ! CreateTemporalZonedDateTime(instant.[[Nanoseconds]], timeZone, "iso8601").
    8.4 Properties of Temporal.Instant Instances
    Temporal.Instant instances are ordinary objects that inherit properties from the %Temporal.Instant.prototype% intrinsic object. Temporal.Instant instances are initially created with the internal slots described in Table 13.

Table 13: Internal Slots of Temporal.Instant Instances
Internal Slot Description
[[InitializedTemporalInstant]] The only specified use of this slot is for distinguishing Temporal.Instant instances from other objects.
[[Nanoseconds]] A BigInt value representing the number of nanoseconds since the epoch.
8.4.1 Temporal.Instant range
The [[Nanoseconds]] internal slot of a Temporal.Instant object supports a range of exactly -100,000,000 to 100,000,000 days relative to midnight at the beginning of 1 January 1970 UTC, as in 21.4.1.1.

The exact moment of midnight at the beginning of 1 January 1970 UTC is represented by the value 0ℤ.

The maximum value is ℤ(nsMaxInstant), where

nsMaxInstant = 10**8 × nsPerDay = 8.64 × 10**21
where the number of nanoseconds per day is

nsPerDay = 10**6 × ℝ(msPerDay) = 8.64 × 10**13
The minimum value is ℤ(nsMinInstant), where

nsMinInstant = -nsMaxInstant = -8.64 × 10\*\*21
8.5 Abstract Operations
8.5.1 IsValidEpochNanoseconds ( epochNanoseconds )
The abstract operation IsValidEpochNanoseconds returns true if its argument epochNanoseconds is within the allowed range of nanoseconds since the epoch for a Temporal.Instant and Temporal.ZonedDateTime, and false otherwise.

1. Assert: Type(epochNanoseconds) is BigInt.
2. If ℝ(epochNanoseconds) < nsMinInstant or ℝ(epochNanoseconds) > nsMaxInstant, then
   a. Return false.
3. Return true.
   8.5.2 CreateTemporalInstant ( epochNanoseconds [ , newTarget ] )
   The abstract operation CreateTemporalInstant takes argument epochNanoseconds (a BigInt) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.Instant, or an abrupt completion. It creates a Temporal.Instant instance and fills the internal slots with valid values. It performs the following steps when called:

4. Assert: ! IsValidEpochNanoseconds(epochNanoseconds) is true.
5. If newTarget is not present, set newTarget to %Temporal.Instant%.
6. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.Instant.prototype%", « [[InitializedTemporalInstant]], [[Nanoseconds]] »).
7. Set object.[[Nanoseconds]] to epochNanoseconds.
8. Return object.
   8.5.3 ToTemporalInstant ( item )
   The abstract operation ToTemporalInstant returns its argument item if it is already a Temporal.Instant instance, converts item to a new Temporal.Instant instance if possible, and throws otherwise.

9. If Type(item) is Object, then
   a. If item has an [[InitializedTemporalInstant]] internal slot, then
   i. Return item.
   b. If item has an [[InitializedTemporalZonedDateTime]] internal slot, then
   i. Return ! CreateTemporalInstant(item.[[Nanoseconds]]).
   c. NOTE: This use of ToPrimitive allows Instant-like objects to be converted.
   d. Set item to ? ToPrimitive(item, STRING).
10. If item is not a String, throw a TypeError exception.
11. Let parsed be ? ParseTemporalInstantString(item).
12. If parsed.[[Z]] is true, let offsetNanoseconds be 0; otherwise, let offsetNanoseconds be ! ParseDateTimeUTCOffset(parsed.[[OffsetString]]).
13. If abs(ISODateToEpochDays(parsed.[[Year]], parsed.[[Month]] - 1, parsed.[[Day]])) > 10\*\*8, throw a RangeError exception.
14. Let epochNanoseconds be GetUTCEpochNanoseconds(parsed.[[Year]], parsed.[[Month]], parsed.[[Day]], parsed.[[Hour]], parsed.[[Minute]], parsed.[[Second]], parsed.[[Millisecond]], parsed.[[Microsecond]], parsed.[[Nanosecond]], offsetNanoseconds).
15. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
16. Return ! CreateTemporalInstant(epochNanoseconds).
    8.5.4 CompareEpochNanoseconds ( epochNanosecondsOne, epochNanosecondsTwo )
    The abstract operation CompareEpochNanoseconds takes arguments epochNanosecondsOne (a BigInt) and epochNanosecondsTwo (a BigInt) and returns either -1, 0, or 1. It performs the following steps when called:

17. If epochNanosecondsOne > epochNanosecondsTwo, return 1.
18. If epochNanosecondsOne < epochNanosecondsTwo, return -1.
19. Return 0.
    8.5.5 AddInstant ( epochNanoseconds, norm )
    The abstract operation AddInstant takes arguments epochNanoseconds (a BigInt value) and norm (a Normalized Time Duration Record) and returns either a normal completion containing a BigInt, or a throw completion. It adds a duration in various time units to a number of nanoseconds since the epoch. It performs the following steps when called:

20. Let result be AddNormalizedTimeDurationToEpochNanoseconds(norm, epochNanoseconds).
21. If ! IsValidEpochNanoseconds(result) is false, throw a RangeError exception.
22. Return result.
    8.5.6 DifferenceInstant ( ns1, ns2, roundingIncrement, smallestUnit, roundingMode )
    The abstract operation DifferenceInstant takes arguments ns1 (a BigInt), ns2 (a BigInt), roundingIncrement (a positive integer), smallestUnit (a String), and roundingMode (a String from the Identifier column of Table 19) and returns a Normalized Time Duration Record. It computes the difference between two exact times ns1 and ns2 expressed in nanoseconds since the epoch, and rounds the result according to the parameters roundingIncrement, smallestUnit, and roundingMode. It performs the following steps when called:

23. Let difference be NormalizedTimeDurationFromEpochNanosecondsDifference(ns2, ns1).
24. If smallestUnit is "nanosecond" and roundingIncrement is 1, then
    a. Return difference.
25. Let roundRecord be ! RoundDuration(0, 0, 0, 0, difference, roundingIncrement, smallestUnit, roundingMode).
26. Return roundRecord.[[NormalizedDuration]].[[NormalizedTime]].
    8.5.7 RoundTemporalInstant ( ns, increment, unit, roundingMode )
    The abstract operation RoundTemporalInstant takes arguments ns (a BigInt), increment (a positive integer), unit (a String), and roundingMode (a String from the Identifier column of Table 19) and returns a BigInt. It rounds a number of nanoseconds ns since the epoch to the given rounding increment. It performs the following steps when called:

27. If unit is "hour", then
    a. Let incrementNs be increment × 3.6 × 10\*\*12.
28. Else if unit is "minute", then
    a. Let incrementNs be increment × 6 × 10\*\*10.
29. Else if unit is "second", then
    a. Let incrementNs be increment × 10\*\*9.
30. Else if unit is "millisecond", then
    a. Let incrementNs be increment × 10\*\*6.
31. Else if unit is "microsecond", then
    a. Let incrementNs be increment × 10\*\*3.
32. Else,
    a. Assert: unit is "nanosecond".
    b. Let incrementNs be increment.
33. Return ℤ(RoundNumberToIncrementAsIfPositive(ℝ(ns), incrementNs, roundingMode)).
    8.5.8 TemporalInstantToString ( instant, timeZone, precision )
34. Assert: Type(instant) is Object.
35. Assert: instant has an [[InitializedTemporalInstant]] internal slot.
36. Let outputTimeZone be timeZone.
37. If outputTimeZone is undefined, set outputTimeZone to "UTC".
38. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(outputTimeZone, « GET-OFFSET-NANOSECONDS-FOR »).
39. Let offsetNanoseconds be ? GetOffsetNanosecondsFor(timeZoneRec, instant).
40. Let dateTime be ! GetPlainDateTimeFor(timeZoneRec, instant, "iso8601", offsetNanoseconds).
41. Let dateTimeString be ! TemporalDateTimeToString(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], "iso8601", precision, "never").
42. If timeZone is undefined, then
    a. Let timeZoneString be "Z".
43. Else,
    a. Let timeZoneString be FormatDateTimeUTCOffsetRounded(offsetNanoseconds).
44. Return the string-concatenation of dateTimeString and timeZoneString.
    8.5.9 DifferenceTemporalInstant ( operation, instant, other, options )
    The abstract operation DifferenceTemporalInstant takes arguments operation (SINCE or UNTIL), instant (a Temporal.Instant), other (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.Duration or an abrupt completion. It computes the difference between the two times represented by instant and other, optionally rounds it, and returns it as a Temporal.Duration object. It performs the following steps when called:

45. If operation is SINCE, let sign be -1. Otherwise, let sign be 1.
46. Set other to ? ToTemporalInstant(other).
47. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
48. Let settings be ? GetDifferenceSettings(operation, resolvedOptions, TIME, « », "nanosecond", "second").
49. Let norm be DifferenceInstant(instant.[[Nanoseconds]], other.[[Nanoseconds]], settings.[[RoundingIncrement]], settings.[[SmallestUnit]], settings.[[RoundingMode]]).
50. Let result be BalanceTimeDuration(norm, settings.[[LargestUnit]]).
51. Return ! CreateTemporalDuration(0, 0, 0, 0, sign × result.[[Hours]], sign × result.[[Minutes]], sign × result.[[Seconds]], sign × result.[[Milliseconds]], sign × result.[[Microseconds]], sign × result.[[Nanoseconds]]).
    8.5.10 AddDurationToOrSubtractDurationFromInstant ( operation, instant, temporalDurationLike )
    The abstract operation AddDurationToOrSubtractDurationFromInstant takes arguments operation (ADD or SUBTRACT), instant (a Temporal.Instant), and temporalDurationLike (an ECMAScript language value) and returns either a normal completion containing a Temporal.Instant or an abrupt completion. It adds/subtracts temporalDurationLike to/from instant. It performs the following steps when called:

52. If operation is SUBTRACT, let sign be -1. Otherwise, let sign be 1.
53. Let duration be ? ToTemporalDurationRecord(temporalDurationLike).
54. If duration.[[Days]] is not 0, throw a RangeError exception.
55. If duration.[[Months]] is not 0, throw a RangeError exception.
56. If duration.[[Weeks]] is not 0, throw a RangeError exception.
57. If duration.[[Years]] is not 0, throw a RangeError exception.
58. Let norm be NormalizeTimeDuration(sign × duration.[[Hours]], sign × duration.[[Minutes]], sign × duration.[[Seconds]], sign × duration.[[Milliseconds]], sign × duration.[[Microseconds]], sign × duration.[[Nanoseconds]]).
59. Let ns be ? AddInstant(instant.[[Nanoseconds]], norm).
60. Return ! CreateTemporalInstant(ns).
    9 Temporal.PlainYearMonth Objects
    A Temporal.PlainYearMonth object is an Object that contains integers corresponding to a particular year and month in a particular calendar.

9.1 The Temporal.PlainYearMonth Constructor
The Temporal.PlainYearMonth constructor:

creates and initializes a new Temporal.PlainYearMonth object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.PlainYearMonth behaviour must include a super call to the %Temporal.PlainYearMonth% constructor to create and initialize subclass instances with the necessary internal slots.
9.1.1 Temporal.PlainYearMonth ( isoYear, isoMonth [ , calendarLike [ , referenceISODay ] ] )
This function performs the following steps when called:

1. If NewTarget is undefined, then
   a. Throw a TypeError exception.
2. If referenceISODay is undefined, then
   a. Set referenceISODay to 1𝔽.
3. Let y be ? ToIntegerWithTruncation(isoYear).
4. Let m be ? ToIntegerWithTruncation(isoMonth).
5. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike, "iso8601").
6. Let ref be ? ToIntegerWithTruncation(referenceISODay).
7. Return ? CreateTemporalYearMonth(y, m, calendar, ref, NewTarget).
   9.2 Properties of the Temporal.PlainYearMonth Constructor
   The value of the [[Prototype]] internal slot of the Temporal.PlainYearMonth constructor is the intrinsic object %Function.prototype%.

The Temporal.PlainYearMonth constructor has the following properties:

9.2.1 Temporal.PlainYearMonth.prototype
The initial value of Temporal.PlainYearMonth.prototype is %Temporal.PlainYearMonth.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

9.2.2 Temporal.PlainYearMonth.from ( item [ , options ] )
This function performs the following steps when called:

1. Set options to ? GetOptionsObject(options).
2. If Type(item) is Object and item has an [[InitializedTemporalYearMonth]] internal slot, then
   a. Perform ? ToTemporalOverflow(options).
   b. Return ! CreateTemporalYearMonth(item.[[ISOYear]], item.[[ISOMonth]], item.[[Calendar]], item.[[ISODay]]).
3. Return ? ToTemporalYearMonth(item, options).
   9.2.3 Temporal.PlainYearMonth.compare ( one, two )
   This function performs the following steps when called:

4. Set one to ? ToTemporalYearMonth(one).
5. Set two to ? ToTemporalYearMonth(two).
6. Return 𝔽(! CompareISODate(one.[[ISOYear]], one.[[ISOMonth]], one.[[ISODay]], two.[[ISOYear]], two.[[ISOMonth]], two.[[ISODay]])).
   9.3 Properties of the Temporal.PlainYearMonth Prototype Object
   The Temporal.PlainYearMonth prototype object

is itself an ordinary object.
is not a Temporal.PlainYearMonth instance and does not have a [[InitializedTemporalYearMonth]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
NOTE
An ECMAScript implementation that includes the ECMA-402 Internationalization API extends this prototype with additional properties in order to represent calendar data.
9.3.1 Temporal.PlainYearMonth.prototype.constructor
The initial value of Temporal.PlainYearMonth.prototype.constructor is %Temporal.PlainYearMonth%.

9.3.2 Temporal.PlainYearMonth.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.PlainYearMonth".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

9.3.3 get Temporal.PlainYearMonth.prototype.calendarId
Temporal.PlainYearMonth.prototype.calendarId is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let yearMonth be the this value.
2. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
3. Return ? ToTemporalCalendarIdentifier(yearMonth.[[Calendar]]).
   9.3.4 get Temporal.PlainYearMonth.prototype.year
   Temporal.PlainYearMonth.prototype.year is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

4. Let yearMonth be the this value.
5. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
6. Let calendar be yearMonth.[[Calendar]].
7. Return 𝔽(? CalendarYear(calendar, yearMonth)).
   9.3.5 get Temporal.PlainYearMonth.prototype.month
   Temporal.PlainYearMonth.prototype.month is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

8. Let yearMonth be the this value.
9. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
10. Let calendar be yearMonth.[[Calendar]].
11. Return 𝔽(? CalendarMonth(calendar, yearMonth)).
    9.3.6 get Temporal.PlainYearMonth.prototype.monthCode
    Temporal.PlainYearMonth.prototype.monthCode is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

12. Let yearMonth be the this value.
13. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
14. Let calendar be yearMonth.[[Calendar]].
15. Return ? CalendarMonthCode(calendar, yearMonth).
    9.3.7 get Temporal.PlainYearMonth.prototype.daysInYear
    Temporal.PlainYearMonth.prototype.daysInYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

16. Let yearMonth be the this value.
17. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
18. Let calendar be yearMonth.[[Calendar]].
19. Return 𝔽(? CalendarDaysInYear(calendar, yearMonth)).
    9.3.8 get Temporal.PlainYearMonth.prototype.daysInMonth
    Temporal.PlainYearMonth.prototype.daysInMonth is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

20. Let yearMonth be the this value.
21. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
22. Let calendar be yearMonth.[[Calendar]].
23. Return 𝔽(? CalendarDaysInMonth(calendar, yearMonth)).
    9.3.9 get Temporal.PlainYearMonth.prototype.monthsInYear
    Temporal.PlainYearMonth.prototype.monthsInYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

24. Let yearMonth be the this value.
25. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
26. Let calendar be yearMonth.[[Calendar]].
27. Return 𝔽(? CalendarMonthsInYear(calendar, yearMonth)).
    9.3.10 get Temporal.PlainYearMonth.prototype.inLeapYear
    Temporal.PlainYearMonth.prototype.inLeapYear is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

28. Let yearMonth be the this value.
29. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
30. Let calendar be yearMonth.[[Calendar]].
31. Return ? CalendarInLeapYear(calendar, yearMonth).
    9.3.11 Temporal.PlainYearMonth.prototype.with ( temporalYearMonthLike [ , options ] )
    This method performs the following steps when called:

32. Let yearMonth be the this value.
33. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
34. If ? IsPartialTemporalObject(temporalYearMonthLike) is false, throw a TypeError exception.
35. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
36. Let calendarRec be ? CreateCalendarMethodsRecord(yearMonth.[[Calendar]], « FIELDS, MERGE-FIELDS, YEAR-MONTH-FROM-FIELDS »).
37. Let fieldNames be ? CalendarFields(calendarRec, « "month", "monthCode", "year" »).
38. Let fields be ? PrepareTemporalFields(yearMonth, fieldNames, «»).
39. Let partialYearMonth be ? PrepareTemporalFields(temporalYearMonthLike, fieldNames, PARTIAL).
40. Set fields to ? CalendarMergeFields(calendarRec, fields, partialYearMonth).
41. Set fields to ? PrepareTemporalFields(fields, fieldNames, «»).
42. Return ? CalendarYearMonthFromFields(calendarRec, fields, resolvedOptions).
    9.3.12 Temporal.PlainYearMonth.prototype.add ( temporalDurationLike [ , options ] )
    This method performs the following steps when called:

43. Let yearMonth be the this value.
44. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
45. Return ? AddDurationToOrSubtractDurationFromPlainYearMonth(ADD, yearMonth, temporalDurationLike, options).
    9.3.13 Temporal.PlainYearMonth.prototype.subtract ( temporalDurationLike [ , options ] )
    This method performs the following steps when called:

46. Let yearMonth be the this value.
47. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
48. Return ? AddDurationToOrSubtractDurationFromPlainYearMonth(SUBTRACT, yearMonth, temporalDurationLike, options).
    9.3.14 Temporal.PlainYearMonth.prototype.until ( other [ , options ] )
    This method performs the following steps when called:

49. Let yearMonth be the this value.
50. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
51. Return ? DifferenceTemporalPlainYearMonth(UNTIL, yearMonth, other, options).
    9.3.15 Temporal.PlainYearMonth.prototype.since ( other [ , options ] )
    This method performs the following steps when called:

52. Let yearMonth be the this value.
53. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
54. Return ? DifferenceTemporalPlainYearMonth(SINCE, yearMonth, other, options).
    9.3.16 Temporal.PlainYearMonth.prototype.equals ( other )
    This method performs the following steps when called:

55. Let yearMonth be the this value.
56. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
57. Set other to ? ToTemporalYearMonth(other).
58. If yearMonth.[[ISOYear]] ≠ other.[[ISOYear]], return false.
59. If yearMonth.[[ISOMonth]] ≠ other.[[ISOMonth]], return false.
60. If yearMonth.[[ISODay]] ≠ other.[[ISODay]], return false.
61. Return ? CalendarEquals(yearMonth.[[Calendar]], other.[[Calendar]]).
    9.3.17 Temporal.PlainYearMonth.prototype.toString ( [ options ] )
    This method performs the following steps when called:

62. Let yearMonth be the this value.
63. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
64. Set options to ? GetOptionsObject(options).
65. Let showCalendar be ? ToCalendarNameOption(options).
66. Return ? TemporalYearMonthToString(yearMonth, showCalendar).
    9.3.18 Temporal.PlainYearMonth.prototype.toLocaleString ( [ locales [ , options ] ] )
    An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

This method performs the following steps when called:

1. Let yearMonth be the this value.
2. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
3. Return ? TemporalYearMonthToString(yearMonth, "auto").
   9.3.19 Temporal.PlainYearMonth.prototype.toJSON ( )
   This method performs the following steps when called:

4. Let yearMonth be the this value.
5. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
6. Return ? TemporalYearMonthToString(yearMonth, "auto").
   9.3.20 Temporal.PlainYearMonth.prototype.valueOf ( )
   This method performs the following steps when called:

7. Throw a TypeError exception.
   NOTE
   This method always throws, because in the absence of valueOf(), expressions with arithmetic operators such as plainYearMonth1 > plainYearMonth2 would fall back to being equivalent to plainYearMonth1.toString() > plainYearMonth2.toString(). Lexicographical comparison of serialized strings might not seem obviously wrong, because the result would sometimes be correct. Implementations are encouraged to phrase the error message to point users to Temporal.PlainYearMonth.compare(), Temporal.PlainYearMonth.prototype.equals(), and/or Temporal.PlainYearMonth.prototype.toString().

9.3.21 Temporal.PlainYearMonth.prototype.toPlainDate ( item )
This method performs the following steps when called:

1. Let yearMonth be the this value.
2. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
3. If Type(item) is not Object, then
   a. Throw a TypeError exception.
4. Let calendarRec be ? CreateCalendarMethodsRecord(yearMonth.[[Calendar]], « DATE-FROM-FIELDS, FIELDS, MERGE-FIELDS »).
5. Let receiverFieldNames be ? CalendarFields(calendarRec, « "monthCode", "year" »).
6. Let fields be ? PrepareTemporalFields(yearMonth, receiverFieldNames, «»).
7. Let inputFieldNames be ? CalendarFields(calendarRec, « "day" »).
8. Let inputFields be ? PrepareTemporalFields(item, inputFieldNames, «»).
9. Let mergedFields be ? CalendarMergeFields(calendarRec, fields, inputFields).
10. Let concatenatedFieldNames be the list-concatenation of receiverFieldNames and inputFieldNames.
11. Set mergedFields to ? PrepareTemporalFields(mergedFields, concatenatedFieldNames, «», «», IGNORE).
12. Let options be OrdinaryObjectCreate(null).
13. Perform ! CreateDataPropertyOrThrow(options, "overflow", "constrain").
14. Return ? CalendarDateFromFields(calendarRec, mergedFields, options).
    9.3.22 Temporal.PlainYearMonth.prototype.getISOFields ( )
    This method performs the following steps when called:

15. Let yearMonth be the this value.
16. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
17. Let fields be OrdinaryObjectCreate(%Object.prototype%).
18. Perform ! CreateDataPropertyOrThrow(fields, "calendar", yearMonth.[[Calendar]]).
19. Perform ! CreateDataPropertyOrThrow(fields, "isoDay", 𝔽(yearMonth.[[ISODay]])).
20. Perform ! CreateDataPropertyOrThrow(fields, "isoMonth", 𝔽(yearMonth.[[ISOMonth]])).
21. Perform ! CreateDataPropertyOrThrow(fields, "isoYear", 𝔽(yearMonth.[[ISOYear]])).
22. Return fields.
    9.3.23 Temporal.PlainYearMonth.prototype.getCalendar ( )
    This method performs the following steps when called:

23. Let yearMonth be the this value.
24. Perform ? RequireInternalSlot(yearMonth, [[InitializedTemporalYearMonth]]).
25. Return ToTemporalCalendarObject(yearMonth.[[Calendar]]).
    9.4 Properties of Temporal.PlainYearMonth Instances
    Temporal.PlainYearMonth instances are ordinary objects that inherit properties from the %Temporal.PlainYearMonth.prototype% intrinsic object. Temporal.PlainYearMonth instances are initially created with the internal slots described in Table 14.

Table 14: Internal Slots of Temporal.PlainYearMonth Instances
Internal Slot Description
[[InitializedTemporalYearMonth]] The only specified use of this slot is for distinguishing Temporal.PlainYearMonth instances from other objects.
[[ISOYear]] An integer representing the year in the ISO 8601 calendar.
[[ISOMonth]] An integer between 1 and 12, inclusive, representing the month of the year in the ISO 8601 calendar.
[[ISODay]] An integer between 1 and ISODaysInMonth([[ISOYear]], [[ISOMonth]]), inclusive, representing a reference day of the month in the ISO 8601 calendar. This slot is used by the calendar object in the [[Calendar]] slot to disambiguate if the [[ISOYear]] and [[ISOMonth]] slots are not enough to uniquely identify a year and month in that calendar.
[[Calendar]] A String or Object representing the calendar.
9.5 Abstract Operations
9.5.1 ToTemporalYearMonth ( item [ , options ] )
The abstract operation ToTemporalYearMonth takes argument item (an ECMAScript language value) and optional argument options (an Object or undefined) and returns either a normal completion containing a Temporal.PlainYearMonth, or a throw completion. It returns its argument item if it is already a Temporal.PlainYearMonth instance, converts item to a new Temporal.PlainYearMonth instance if possible, and throws otherwise. It performs the following steps when called:

1. If options is not present, set options to undefined.
2. If options is not undefined, set options to ? SnapshotOwnProperties(! GetOptionsObject(options), null).
3. If Type(item) is Object, then
   a. If item has an [[InitializedTemporalYearMonth]] internal slot, then
   i. Return item.
   b. Let calendar be ? GetTemporalCalendarSlotValueWithISODefault(item).
   c. Let calendarRec be ? CreateCalendarMethodsRecord(calendar, « FIELDS, YEAR-MONTH-FROM-FIELDS »).
   d. Let fieldNames be ? CalendarFields(calendarRec, « "month", "monthCode", "year" »).
   e. Let fields be ? PrepareTemporalFields(item, fieldNames, «»).
   f. Return ? CalendarYearMonthFromFields(calendarRec, fields, options).
4. If item is not a String, throw a TypeError exception.
5. Let result be ? ParseTemporalYearMonthString(item).
6. Let calendar be result.[[Calendar]].
7. If calendar is undefined, set calendar to "iso8601".
8. If IsBuiltinCalendar(calendar) is false, throw a RangeError exception.
9. Set calendar to the ASCII-lowercase of calendar.
10. Perform ? ToTemporalOverflow(options).
11. Set result to ? CreateTemporalYearMonth(result.[[Year]], result.[[Month]], calendar, result.[[Day]]).
12. NOTE: The following operation is called without options, in order for the calendar to store a canonical value in the [[ISODay]] internal slot of the result.
13. Let calendarRec be ? CreateCalendarMethodsRecord(calendar, « YEAR-MONTH-FROM-FIELDS »).
14. Return ? CalendarYearMonthFromFields(calendarRec, result).
    9.5.2 RegulateISOYearMonth ( year, month, overflow )
15. Assert: year and month are integers.
16. Assert: overflow is either "constrain" or "reject".
17. If overflow is "constrain", then
    a. Set month to the result of clamping month between 1 and 12.
    b. Return the Record { [[Year]]: year, [[Month]]: month }.
18. Else,
    a. Assert: overflow is "reject".
    b. If month < 1 or month > 12, throw a RangeError exception.
    c. Return the Record { [[Year]]: year, [[Month]]: month }.
    9.5.3 ISOYearMonthWithinLimits ( year, month )
    The abstract operation ISOYearMonthWithinLimits returns true if its arguments represent a month within the range that a Temporal.PlainYearMonth object can represent, and false otherwise.

NOTE
Temporal.PlainYearMonth objects can represent any month that contains a day that a Temporal.PlainDate can represent. This ensures that a Temporal.PlainDate object can always be converted into a Temporal.PlainYearMonth object.

1. Assert: year and month are integers.
2. If year < -271821 or year > 275760, then
   a. Return false.
3. If year is -271821 and month < 4, then
   a. Return false.
4. If year is 275760 and month > 9, then
   a. Return false.
5. Return true.
   9.5.4 BalanceISOYearMonth ( year, month )
6. Assert: year and month are integers.
7. Set year to year + floor((month - 1) / 12).
8. Set month to ((month - 1) modulo 12) + 1.
9. Return the Record { [[Year]]: year, [[Month]]: month }.
   9.5.5 CreateTemporalYearMonth ( isoYear, isoMonth, calendar, referenceISODay [ , newTarget ] )
   The abstract operation CreateTemporalYearMonth takes arguments isoYear (an integer), isoMonth (an integer), calendar (a String or Object), and referenceISODay (an integer) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.PlainYearMonth, or an abrupt completion. It creates a Temporal.PlainYearMonth instance and fills the internal slots with valid values. It performs the following steps when called:

10. If IsValidISODate(isoYear, isoMonth, referenceISODay) is false, throw a RangeError exception.
11. If ! ISOYearMonthWithinLimits(isoYear, isoMonth) is false, throw a RangeError exception.
12. If newTarget is not present, set newTarget to %Temporal.PlainYearMonth%.
13. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.PlainYearMonth.prototype%", « [[InitializedTemporalYearMonth]], [[ISOYear]], [[ISOMonth]], [[ISODay]], [[Calendar]] »).
14. Set object.[[ISOYear]] to isoYear.
15. Set object.[[ISOMonth]] to isoMonth.
16. Set object.[[Calendar]] to calendar.
17. Set object.[[ISODay]] to referenceISODay.
18. Return object.
    9.5.6 TemporalYearMonthToString ( yearMonth, showCalendar )
19. Assert: Type(yearMonth) is Object.
20. Assert: yearMonth has an [[InitializedTemporalYearMonth]] internal slot.
21. Let year be PadISOYear(yearMonth.[[ISOYear]]).
22. Let month be ToZeroPaddedDecimalString(yearMonth.[[ISOMonth]], 2).
23. Let result be the string-concatenation of year, the code unit 0x002D (HYPHEN-MINUS), and month.
24. Let calendarIdentifier be ? ToTemporalCalendarIdentifier(yearMonth.[[Calendar]]).
25. If showCalendar is one of "always" or "critical", or if calendarIdentifier is not "iso8601", then
    a. Let day be ToZeroPaddedDecimalString(yearMonth.[[ISODay]], 2).
    b. Set result to the string-concatenation of result, the code unit 0x002D (HYPHEN-MINUS), and day.
26. Let calendarString be FormatCalendarAnnotation(calendarIdentifier, showCalendar).
27. Set result to the string-concatenation of result and calendarString.
28. Return result.
    9.5.7 DifferenceTemporalPlainYearMonth ( operation, yearMonth, other, options )
    The abstract operation DifferenceTemporalPlainYearMonth takes arguments operation (SINCE or UNTIL), yearMonth (a Temporal.PlainYearMonth), other (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.Duration or an abrupt completion. It computes the difference between the two times represented by yearMonth and other, optionally rounds it, and returns it as a Temporal.Duration object. It performs the following steps when called:

29. If operation is SINCE, let sign be -1. Otherwise, let sign be 1.
30. Set other to ? ToTemporalYearMonth(other).
31. Let calendar be yearMonth.[[Calendar]].
32. If ? CalendarEquals(calendar, other.[[Calendar]]) is false, throw a RangeError exception.
33. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
34. Let settings be ? GetDifferenceSettings(operation, resolvedOptions, DATE, « "week", "day" », "month", "year").
35. If yearMonth.[[ISOYear]] = other.[[ISOYear]] and yearMonth.[[ISOMonth]] = other.[[ISOMonth]] and yearMonth.[[ISODay]] = other.[[ISODay]], then
    a. Return ! CreateTemporalDuration(0, 0, 0, 0, 0, 0, 0, 0, 0, 0).
36. Let calendarRec be ? CreateCalendarMethodsRecord(calendar, « DATE-ADD, DATE-FROM-FIELDS, DATE-UNTIL, FIELDS »).
37. Let fieldNames be ? CalendarFields(calendarRec, « "monthCode", "year" »).
38. Let thisFields be ? PrepareTemporalFields(yearMonth, fieldNames, «»).
39. Perform ! CreateDataPropertyOrThrow(thisFields, "day", 1𝔽).
40. Let thisDate be ? CalendarDateFromFields(calendarRec, thisFields).
41. Let otherFields be ? PrepareTemporalFields(other, fieldNames, «»).
42. Perform ! CreateDataPropertyOrThrow(otherFields, "day", 1𝔽).
43. Let otherDate be ? CalendarDateFromFields(calendarRec, otherFields).
44. Perform ! CreateDataPropertyOrThrow(resolvedOptions, "largestUnit", settings.[[LargestUnit]]).
45. Let result be ? CalendarDateUntil(calendarRec, thisDate, otherDate, resolvedOptions).
46. If settings.[[SmallestUnit]] is not "month" or settings.[[RoundingIncrement]] ≠ 1, then
    a. Let roundRecord be ? RoundDuration(result.[[Years]], result.[[Months]], 0, 0, ZeroTimeDuration(), settings.[[RoundingIncrement]], settings.[[SmallestUnit]], settings.[[RoundingMode]], thisDate, calendarRec).
    b. Let roundResult be roundRecord.[[NormalizedDuration]].
    c. Set result to ? BalanceDateDurationRelative(roundResult.[[Years]], roundResult.[[Months]], 0, 0, settings.[[LargestUnit]], settings.[[SmallestUnit]], thisDate, calendarRec).
47. Return ! CreateTemporalDuration(sign × result.[[Years]], sign × result.[[Months]], 0, 0, 0, 0, 0, 0, 0, 0).
    9.5.8 AddDurationToOrSubtractDurationFromPlainYearMonth ( operation, yearMonth, temporalDurationLike, options )
    The abstract operation AddDurationToOrSubtractDurationFromPlainYearMonth takes arguments operation (ADD or SUBTRACT), yearMonth (a Temporal.PlainYearMonth), temporalDurationLike (an ECMAScript language value), and options (an ECMAScript language value) and returns either a normal completion containing a Temporal.PlainYearMonth or an abrupt completion. It adds/subtracts temporalDurationLike to/from yearMonth, returning a point in time that is in the future/past relative to yearMonth. It performs the following steps when called:

48. Let duration be ? ToTemporalDuration(temporalDurationLike).
49. If operation is SUBTRACT, then
    a. Set duration to ! CreateNegatedTemporalDuration(duration).
50. Set options to ? GetOptionsObject(options).
51. Let norm be NormalizeTimeDuration(duration.[[Hours]], duration.[[Minutes]], duration.[[Seconds]], duration.[[Milliseconds]], duration.[[Microseconds]], duration.[[Nanoseconds]]).
52. Let balanceResult be BalanceTimeDuration(norm, "day").
53. Let days be duration.[[Days]] + balanceResult.[[Days]].
54. Let sign be ! DurationSign(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], days, 0, 0, 0, 0, 0, 0).
55. Let calendarRec be ? CreateCalendarMethodsRecord(yearMonth.[[Calendar]], « DATE-ADD, DATE-FROM-FIELDS, DAY, FIELDS, YEAR-MONTH-FROM-FIELDS »).
56. Let fieldNames be ? CalendarFields(calendarRec, « "monthCode", "year" »).
57. Let fields be ? PrepareTemporalFields(yearMonth, fieldNames, «»).
58. Let fieldsCopy be ! SnapshotOwnProperties(fields, null).
59. Perform ! CreateDataPropertyOrThrow(fields, "day", 1𝔽).
60. Let intermediateDate be ? CalendarDateFromFields(calendarRec, fields).
61. If sign < 0, then
    a. Let oneMonthDuration be ! CreateTemporalDuration(0, 1, 0, 0, 0, 0, 0, 0, 0, 0).
    b. Let nextMonth be ? CalendarDateAdd(calendarRec, intermediateDate, oneMonthDuration).
    c. Let endOfMonthISO be BalanceISODate(nextMonth.[[ISOYear]], nextMonth.[[ISOMonth]], nextMonth.[[ISODay]] - 1).
    d. Let endOfMonth be ? CreateTemporalDate(endOfMonthISO.[[Year]], endOfMonthISO.[[Month]], endOfMonthISO.[[Day]], calendarRec.[[Receiver]]).
    e. Let day be ? CalendarDay(calendarRec, endOfMonth).
    f. Perform ! CreateDataPropertyOrThrow(fieldsCopy, "day", day).
    g. Let date be ? CalendarDateFromFields(calendarRec, fieldsCopy).
62. Else,
    a. Let date be intermediateDate.
63. Let durationToAdd be ! CreateTemporalDuration(duration.[[Years]], duration.[[Months]], duration.[[Weeks]], days, 0, 0, 0, 0, 0, 0).
64. Let optionsCopy be ? SnapshotOwnProperties(options, null).
65. Let addedDate be ? AddDate(calendarRec, date, durationToAdd, options).
66. Let addedDateFields be ? PrepareTemporalFields(addedDate, fieldNames, «»).
67. Return ? CalendarYearMonthFromFields(calendarRec, addedDateFields, optionsCopy).
    10 Temporal.PlainMonthDay Objects
    A Temporal.PlainMonthDay object is an Object that contains integers corresponding to a particular month and day in a particular calendar.

10.1 The Temporal.PlainMonthDay Constructor
The Temporal.PlainMonthDay constructor:

creates and initializes a new Temporal.PlainMonthDay object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.PlainMonthDay behaviour must include a super call to the %Temporal.PlainMonthDay% constructor to create and initialize subclass instances with the necessary internal slots.
10.1.1 Temporal.PlainMonthDay ( isoMonth, isoDay [ , calendarLike [ , referenceISOYear ] ] )
This function performs the following steps when called:

1. If NewTarget is undefined, then
   a. Throw a TypeError exception.
2. If referenceISOYear is undefined, then
   a. Set referenceISOYear to 1972𝔽 (the first ISO 8601 leap year after the epoch).
3. Let m be ? ToIntegerWithTruncation(isoMonth).
4. Let d be ? ToIntegerWithTruncation(isoDay).
5. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike, "iso8601").
6. Let y be ? ToIntegerWithTruncation(referenceISOYear).
7. Return ? CreateTemporalMonthDay(m, d, calendar, y, NewTarget).
   10.2 Properties of the Temporal.PlainMonthDay Constructor
   The value of the [[Prototype]] internal slot of the Temporal.PlainMonthDay constructor is the intrinsic object %Function.prototype%.

The Temporal.PlainMonthDay constructor has the following properties:

10.2.1 Temporal.PlainMonthDay.prototype
The initial value of Temporal.PlainMonthDay.prototype is %Temporal.PlainMonthDay.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

10.2.2 Temporal.PlainMonthDay.from ( item [ , options ] )
This function performs the following steps when called:

1. Set options to ? GetOptionsObject(options).
2. If Type(item) is Object and item has an [[InitializedTemporalMonthDay]] internal slot, then
   a. Perform ? ToTemporalOverflow(options).
   b. Return ! CreateTemporalMonthDay(item.[[ISOMonth]], item.[[ISODay]], item.[[Calendar]], item.[[ISOYear]]).
3. Return ? ToTemporalMonthDay(item, options).
   10.3 Properties of the Temporal.PlainMonthDay Prototype Object
   The Temporal.PlainMonthDay prototype object

is itself an ordinary object.
is not a Temporal.PlainMonthDay instance and does not have a [[InitializedTemporalMonthDay]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
NOTE
An ECMAScript implementation that includes the ECMA-402 Internationalization API extends this prototype with additional properties in order to represent calendar data.
10.3.1 Temporal.PlainMonthDay.prototype.constructor
The initial value of Temporal.PlainMonthDay.prototype.constructor is %Temporal.PlainMonthDay%.

10.3.2 Temporal.PlainMonthDay.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.PlainMonthDay".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

10.3.3 get Temporal.PlainMonthDay.prototype.calendarId
Temporal.PlainMonthDay.prototype.calendarId is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let monthDay be the this value.
2. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
3. Return ? ToTemporalCalendarIdentifier(monthDay.[[Calendar]]).
   10.3.4 get Temporal.PlainMonthDay.prototype.monthCode
   Temporal.PlainMonthDay.prototype.monthCode is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

4. Let monthDay be the this value.
5. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
6. Let calendar be monthDay.[[Calendar]].
7. Return ? CalendarMonthCode(calendar, monthDay).
   10.3.5 get Temporal.PlainMonthDay.prototype.day
   Temporal.PlainMonthDay.prototype.day is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

8. Let monthDay be the this value.
9. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
10. Let calendarRec be ? CreateCalendarMethodsRecord(monthDay.[[Calendar]], « DAY »).
11. Return 𝔽(? CalendarDay(calendarRec, monthDay)).
    10.3.6 Temporal.PlainMonthDay.prototype.with ( temporalMonthDayLike [ , options ] )
    This method performs the following steps when called:

12. Let monthDay be the this value.
13. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
14. If ? IsPartialTemporalObject(temporalMonthDayLike) is false, throw a TypeError exception.
15. Let resolvedOptions be ? SnapshotOwnProperties(? GetOptionsObject(options), null).
16. Let calendarRec be ? CreateCalendarMethodsRecord(monthDay.[[Calendar]], « FIELDS, MERGE-FIELDS, MONTH-DAY-FROM-FIELDS »).
17. Let fieldNames be ? CalendarFields(calendarRec, « "day", "month", "monthCode", "year" »).
18. Let fields be ? PrepareTemporalFields(monthDay, fieldNames, «»).
19. Let partialMonthDay be ? PrepareTemporalFields(temporalMonthDayLike, fieldNames, PARTIAL).
20. Set fields to ? CalendarMergeFields(calendarRec, fields, partialMonthDay).
21. Set fields to ? PrepareTemporalFields(fields, fieldNames, «»).
22. Return ? CalendarMonthDayFromFields(calendarRec, fields, resolvedOptions).
    10.3.7 Temporal.PlainMonthDay.prototype.equals ( other )
    This method performs the following steps when called:

23. Let monthDay be the this value.
24. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
25. Set other to ? ToTemporalMonthDay(other).
26. If monthDay.[[ISOMonth]] ≠ other.[[ISOMonth]], return false.
27. If monthDay.[[ISODay]] ≠ other.[[ISODay]], return false.
28. If monthDay.[[ISOYear]] ≠ other.[[ISOYear]], return false.
29. Return ? CalendarEquals(monthDay.[[Calendar]], other.[[Calendar]]).
    10.3.8 Temporal.PlainMonthDay.prototype.toString ( [ options ] )
    This method performs the following steps when called:

30. Let monthDay be the this value.
31. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
32. Set options to ? GetOptionsObject(options).
33. Let showCalendar be ? ToCalendarNameOption(options).
34. Return ? TemporalMonthDayToString(monthDay, showCalendar).
    10.3.9 Temporal.PlainMonthDay.prototype.toLocaleString ( [ locales [ , options ] ] )
    An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

This method performs the following steps when called:

1. Let monthDay be the this value.
2. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
3. Return ? TemporalMonthDayToString(monthDay, "auto").
   10.3.10 Temporal.PlainMonthDay.prototype.toJSON ( )
   This method performs the following steps when called:

4. Let monthDay be the this value.
5. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
6. Return ? TemporalMonthDayToString(monthDay, "auto").
   10.3.11 Temporal.PlainMonthDay.prototype.valueOf ( )
   This method performs the following steps when called:

7. Throw a TypeError exception.
   NOTE
   This method always throws, because in the absence of valueOf(), expressions with arithmetic operators such as plainMonthDay1 > plainMonthDay2 would fall back to being equivalent to plainMonthDay1.toString() > plainMonthDay2.toString(). Lexicographical comparison of serialized strings might not seem obviously wrong, because the result would sometimes be correct. Implementations are encouraged to phrase the error message to point users to Temporal.PlainDate.compare() on the corresponding PlainDate objects, Temporal.PlainMonthDay.prototype.equals(), and/or Temporal.PlainMonthDay.prototype.toString().

   10.3.12 Temporal.PlainMonthDay.prototype.toPlainDate ( item )
   This method performs the following steps when called:

8. Let monthDay be the this value.
9. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
10. If Type(item) is not Object, then
    a. Throw a TypeError exception.
11. Let calendarRec be ? CreateCalendarMethodsRecord(monthDay.[[Calendar]], « DATE-FROM-FIELDS, FIELDS, MERGE-FIELDS »).
12. Let receiverFieldNames be ? CalendarFields(calendarRec, « "day", "monthCode" »).
13. Let fields be ? PrepareTemporalFields(monthDay, receiverFieldNames, «»).
14. Let inputFieldNames be ? CalendarFields(calendarRec, « "year" »).
15. Let inputFields be ? PrepareTemporalFields(item, inputFieldNames, «»).
16. Let mergedFields be ? CalendarMergeFields(calendarRec, fields, inputFields).
17. Let concatenatedFieldNames be the list-concatenation of receiverFieldNames and inputFieldNames.
18. Set mergedFields to ? PrepareTemporalFields(mergedFields, concatenatedFieldNames, «», «», IGNORE).
19. Let options be OrdinaryObjectCreate(null).
20. Perform ! CreateDataPropertyOrThrow(options, "overflow", "constrain").
21. Return ? CalendarDateFromFields(calendarRec, mergedFields, options).
    10.3.13 Temporal.PlainMonthDay.prototype.getISOFields ( )
    This method performs the following steps when called:

22. Let monthDay be the this value.
23. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
24. Let fields be OrdinaryObjectCreate(%Object.prototype%).
25. Perform ! CreateDataPropertyOrThrow(fields, "calendar", monthDay.[[Calendar]]).
26. Perform ! CreateDataPropertyOrThrow(fields, "isoDay", 𝔽(monthDay.[[ISODay]])).
27. Perform ! CreateDataPropertyOrThrow(fields, "isoMonth", 𝔽(monthDay.[[ISOMonth]])).
28. Perform ! CreateDataPropertyOrThrow(fields, "isoYear", 𝔽(monthDay.[[ISOYear]])).
29. Return fields.
    10.3.14 Temporal.PlainMonthDay.prototype.getCalendar ( )
    This method performs the following steps when called:

30. Let monthDay be the this value.
31. Perform ? RequireInternalSlot(monthDay, [[InitializedTemporalMonthDay]]).
32. Return ToTemporalCalendarObject(monthDay.[[Calendar]]).
    10.4 Properties of Temporal.PlainMonthDay Instances
    Temporal.PlainMonthDay instances are ordinary objects that inherit properties from the %Temporal.PlainMonthDay.prototype% intrinsic object. Temporal.PlainMonthDay instances are initially created with the internal slots described in Table 15.

Table 15: Internal Slots of Temporal.PlainMonthDay Instances
Internal Slot Description
[[InitializedTemporalMonthDay]] The only specified use of this slot is for distinguishing Temporal.PlainMonthDay instances from other objects.
[[ISOYear]] An integer representing the year in the ISO 8601 calendar. This slot is used by the calendar object in the [[Calendar]] slot to disambiguate if the [[ISOMonth]] and [[ISODay]] slots are not enough to uniquely identify a month and day in that calendar.
[[ISOMonth]] An integer between 1 and 12, inclusive, representing the month of the year in the ISO 8601 calendar.
[[ISODay]] An integer between 1 and ISODaysInMonth([[ISOYear]], [[ISOMonth]]), inclusive, representing the day of the month in the ISO 8601 calendar.
[[Calendar]] A String or Object representing the calendar.
10.5 Abstract Operations
10.5.1 ToTemporalMonthDay ( item [ , options ] )
The abstract operation ToTemporalMonthDay takes argument item (an ECMAScript language value) and optional argument options (an Object or undefined) and returns either a normal completion containing a Temporal.PlainMonthDay, or a throw completion. It returns its argument item if it is already a Temporal.PlainMonthDay instance, converts item to a new Temporal.PlainMonthDay instance if possible, and throws otherwise. It performs the following steps when called:

1. If options is not present, set options to undefined.
2. If options is not undefined, set options to ? SnapshotOwnProperties(! GetOptionsObject(options), null).
3. If Type(item) is Object, then
   a. If item has an [[InitializedTemporalMonthDay]] internal slot, then
   i. Return item.
   b. If item has an [[InitializedTemporalDate]], [[InitializedTemporalDateTime]], [[InitializedTemporalYearMonth]], or [[InitializedTemporalZonedDateTime]] internal slot, then
   i. Let calendar be item.[[Calendar]].
   c. Else,
   i. Let calendarLike be ? Get(item, "calendar").
   ii. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike, "iso8601").
   d. Let calendarRec be ? CreateCalendarMethodsRecord(calendar, « FIELDS, MONTH-DAY-FROM-FIELDS »).
   e. Let fieldNames be ? CalendarFields(calendarRec, « "day", "month", "monthCode", "year" »).
   f. Let fields be ? PrepareTemporalFields(item, fieldNames, «»).
   g. Return ? CalendarMonthDayFromFields(calendarRec, fields, options).
4. If item is not a String, throw a TypeError exception.
5. Let result be ? ParseTemporalMonthDayString(item).
6. Let calendar be result.[[Calendar]].
7. If calendar is undefined, set calendar to "iso8601".
8. If IsBuiltinCalendar(calendar) is false, throw a RangeError exception.
9. Set calendar to the ASCII-lowercase of calendar.
10. Perform ? ToTemporalOverflow(options).
11. If result.[[Year]] is undefined, then
    a. Assert: calendar is "iso8601".
    b. Let referenceISOYear be 1972 (the first ISO 8601 leap year after the epoch).
    c. Return ? CreateTemporalMonthDay(result.[[Month]], result.[[Day]], calendar, referenceISOYear).
12. Set result to ? CreateTemporalMonthDay(result.[[Month]], result.[[Day]], calendar, result.[[Year]]).
13. Let calendarRec be ! CreateCalendarMethodsRecord(calendar, « MONTH-DAY-FROM-FIELDS »).
14. NOTE: The following operation is called without options, in order for the calendar to store a canonical value in the [[ISOYear]] internal slot of the result.
15. Return ? CalendarMonthDayFromFields(calendarRec, result).
    10.5.2 CreateTemporalMonthDay ( isoMonth, isoDay, calendar, referenceISOYear [ , newTarget ] )
    The abstract operation CreateTemporalMonthDay takes arguments isoMonth (an integer), isoDay (an integer), calendar (a String or Object), and referenceISOYear (an integer) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.PlainMonthDay, or an abrupt completion. It creates a Temporal.PlainMonthDay instance and fills the internal slots with valid values. It performs the following steps when called:

16. If IsValidISODate(referenceISOYear, isoMonth, isoDay) is false, throw a RangeError exception.
17. If ISODateTimeWithinLimits(referenceISOYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0) is false, throw a RangeError exception.
18. If newTarget is not present, set newTarget to %Temporal.PlainMonthDay%.
19. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.PlainMonthDay.prototype%", « [[InitializedTemporalMonthDay]], [[ISOMonth]], [[ISODay]], [[ISOYear]], [[Calendar]] »).
20. Set object.[[ISOMonth]] to isoMonth.
21. Set object.[[ISODay]] to isoDay.
22. Set object.[[Calendar]] to calendar.
23. Set object.[[ISOYear]] to referenceISOYear.
24. Return object.
    NOTE
    Deferring to ISODateTimeWithinLimits with an hour of 12 avoids trouble at the extremes of the representable range of dates, which stop just before midnight on each end.

    10.5.3 TemporalMonthDayToString ( monthDay, showCalendar )

25. Assert: Type(monthDay) is Object.
26. Assert: monthDay has an [[InitializedTemporalMonthDay]] internal slot.
27. Let month be ToZeroPaddedDecimalString(monthDay.[[ISOMonth]], 2).
28. Let day be ToZeroPaddedDecimalString(monthDay.[[ISODay]], 2).
29. Let result be the string-concatenation of month, the code unit 0x002D (HYPHEN-MINUS), and day.
30. Let calendarIdentifier be ? ToTemporalCalendarIdentifier(monthDay.[[Calendar]]).
31. If showCalendar is one of "always" or "critical", or if calendarIdentifier is not "iso8601", then
    a. Let year be PadISOYear(monthDay.[[ISOYear]]).
    b. Set result to the string-concatenation of year, the code unit 0x002D (HYPHEN-MINUS), and result.
32. Let calendarString be FormatCalendarAnnotation(calendarIdentifier, showCalendar).
33. Set result to the string-concatenation of result and calendarString.
34. Return result.
    11 Temporal.TimeZone Objects
    A Temporal.TimeZone object is an Object referencing a time zone.

11.1 The Temporal.TimeZone Constructor
The Temporal.TimeZone constructor:

creates and initializes a new Temporal.TimeZone object when called as a constructor.
is not intended to be called as a function and will throw an exception when called in that manner.
may be used as the value of an extends clause of a class definition. Subclass constructors that intend to inherit the specified Temporal.TimeZone behaviour must include a super call to the %Temporal.TimeZone% constructor to create and initialize subclass instances with the necessary internal slots.
11.1.1 Temporal.TimeZone ( identifier )
This function performs the following steps when called:

1. If NewTarget is undefined, then
   a. Throw a TypeError exception.
2. If identifier is not a String, throw a TypeError exception.
3. Let parseResult be ? ParseTimeZoneIdentifier(identifier).
4. If parseResult.[[OffsetMinutes]] is not EMPTY, then
   a. Set identifier to FormatOffsetTimeZoneIdentifier(parseResult.[[OffsetMinutes]]).
5. Else,
   a. Let timeZoneIdentifierRecord be GetAvailableNamedTimeZoneIdentifier(identifier).
   b. If timeZoneIdentifierRecord is EMPTY, throw a RangeError exception.
   c. Set identifier to timeZoneIdentifierRecord.[[Identifier]].
6. Return ? CreateTemporalTimeZone(identifier, NewTarget).
   11.2 Properties of the Temporal.TimeZone Constructor
   The value of the [[Prototype]] internal slot of the Temporal.TimeZone constructor is the intrinsic object %Function.prototype%.

The Temporal.TimeZone constructor has the following properties:

11.2.1 Temporal.TimeZone.prototype
The initial value of Temporal.TimeZone.prototype is %Temporal.TimeZone.prototype%.

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

11.2.2 Temporal.TimeZone.from ( item )
This function performs the following steps when called:

1. Let slotValue be ? ToTemporalTimeZoneSlotValue(item).
2. Return ToTemporalTimeZoneObject(slotValue).
   11.3 Properties of the Temporal.TimeZone Prototype Object
   The Temporal.TimeZone prototype object

is itself an ordinary object.
is not a Temporal.TimeZone instance and does not have a [[InitializedTemporalTimeZone]] internal slot.
has a [[Prototype]] internal slot whose value is %Object.prototype%.
11.3.1 Temporal.TimeZone.prototype.constructor
The initial value of Temporal.TimeZone.prototype.constructor is %Temporal.TimeZone%.

11.3.2 Temporal.TimeZone.prototype[ @@toStringTag ]
The initial value of the @@toStringTag property is the String value "Temporal.TimeZone".

This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.

11.3.3 get Temporal.TimeZone.prototype.id
Temporal.TimeZone.prototype.id is an accessor property whose set accessor function is undefined. Its get accessor function performs the following steps:

1. Let timeZone be the this value.
2. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
3. If timeZone.[[OffsetMinutes]] is not EMPTY, return FormatOffsetTimeZoneIdentifier(timeZone.[[OffsetMinutes]]).
4. Return timeZone.[[Identifier]].
   11.3.4 Temporal.TimeZone.prototype.equals ( timeZoneLike )
   This method performs the following steps when called:

5. Let timeZone be the this value.
6. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
7. Let other be ? ToTemporalTimeZoneSlotValue(timeZoneLike).
8. Return ? TimeZoneEquals(timeZone, other).
   11.3.5 Temporal.TimeZone.prototype.getOffsetNanosecondsFor ( instant )
   This method performs the following steps when called:

9. Let timeZone be the this value.
10. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
11. Set instant to ? ToTemporalInstant(instant).
12. If timeZone.[[OffsetMinutes]] is not EMPTY, return 𝔽(timeZone.[[OffsetMinutes]] × (60 × 10\*\*9)).
13. Return 𝔽(GetNamedTimeZoneOffsetNanoseconds(timeZone.[[Identifier]], instant.[[Nanoseconds]])).
    11.3.6 Temporal.TimeZone.prototype.getOffsetStringFor ( instant )
    This method performs the following steps when called:

14. Let timeZone be the this value.
15. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
16. Set instant to ? ToTemporalInstant(instant).
17. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR »).
18. Return ? GetOffsetStringFor(timeZoneRec, instant).
    11.3.7 Temporal.TimeZone.prototype.getPlainDateTimeFor ( instant [ , calendarLike ] )
    This method performs the following steps when called:

19. Let timeZone be the this value.
20. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
21. Set instant to ? ToTemporalInstant(instant).
22. Let calendar be ? ToTemporalCalendarSlotValue(calendarLike, "iso8601").
23. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR »).
24. Return ? GetPlainDateTimeFor(timeZoneRec, instant, calendar).
    11.3.8 Temporal.TimeZone.prototype.getInstantFor ( dateTime [ , options ] )
    This method performs the following steps when called:

25. Let timeZone be the this value.
26. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
27. Set dateTime to ? ToTemporalDateTime(dateTime).
28. Set options to ? GetOptionsObject(options).
29. Let disambiguation be ? ToTemporalDisambiguation(options).
30. Let timeZoneRec be ? CreateTimeZoneMethodsRecord(timeZone, « GET-OFFSET-NANOSECONDS-FOR, GET-POSSIBLE-INSTANTS-FOR »).
31. Return ? GetInstantFor(timeZoneRec, dateTime, disambiguation).
    11.3.9 Temporal.TimeZone.prototype.getPossibleInstantsFor ( dateTime )
    This method performs the following steps when called:

32. Let timeZone be the this value.
33. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
34. Set dateTime to ? ToTemporalDateTime(dateTime).
35. If timeZone.[[OffsetMinutes]] is not EMPTY, then
    a. Let epochNanoseconds be GetUTCEpochNanoseconds(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], timeZone.[[OffsetMinutes]] × (60 × 10\*\*9)).
    b. Let possibleEpochNanoseconds be « epochNanoseconds ».
36. Else,
    a. Let possibleEpochNanoseconds be GetNamedTimeZoneEpochNanoseconds(timeZone.[[Identifier]], dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]]).
37. Let possibleInstants be a new empty List.
38. For each value epochNanoseconds in possibleEpochNanoseconds, do
    a. If IsValidEpochNanoseconds(epochNanoseconds) is false, throw a RangeError exception.
    b. Let instant be ! CreateTemporalInstant(epochNanoseconds).
    c. Append instant to possibleInstants.
39. Return CreateArrayFromList(possibleInstants).
    11.3.10 Temporal.TimeZone.prototype.getNextTransition ( startingPoint )
    This method performs the following steps when called:

40. Let timeZone be the this value.
41. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
42. Set startingPoint to ? ToTemporalInstant(startingPoint).
43. If timeZone.[[OffsetMinutes]] is not EMPTY, return null.
44. Let transition be GetNamedTimeZoneNextTransition(timeZone.[[Identifier]], startingPoint.[[Nanoseconds]]).
45. If transition is null, return null.
46. Return ! CreateTemporalInstant(transition).
    11.3.11 Temporal.TimeZone.prototype.getPreviousTransition ( startingPoint )
    This method performs the following steps when called:

47. Let timeZone be the this value.
48. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
49. Set startingPoint to ? ToTemporalInstant(startingPoint).
50. If timeZone.[[OffsetMinutes]] is not EMPTY, return null.
51. Let transition be GetNamedTimeZonePreviousTransition(timeZone.[[Identifier]], startingPoint.[[Nanoseconds]]).
52. If transition is null, return null.
53. Return ! CreateTemporalInstant(transition).
    11.3.12 Temporal.TimeZone.prototype.toString ( )
    This method performs the following steps when called:

54. Let timeZone be the this value.
55. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
56. If timeZone.[[OffsetMinutes]] is not EMPTY, return FormatOffsetTimeZoneIdentifier(timeZone.[[OffsetMinutes]]).
57. Return timeZone.[[Identifier]].
    11.3.13 Temporal.TimeZone.prototype.toJSON ( )
    This method performs the following steps when called:

58. Let timeZone be the this value.
59. Perform ? RequireInternalSlot(timeZone, [[InitializedTemporalTimeZone]]).
60. If timeZone.[[OffsetMinutes]] is not EMPTY, return FormatOffsetTimeZoneIdentifier(timeZone.[[OffsetMinutes]]).
61. Return timeZone.[[Identifier]].
    11.4 Properties of Temporal.TimeZone Instances
    Temporal.TimeZone instances are ordinary objects that inherit properties from the %Temporal.TimeZone.prototype% intrinsic object. Temporal.TimeZone instances are initially created with the internal slots described in Table 16.

Table 16: Internal Slots of Temporal.TimeZone Instances
Internal Slot Description
[[InitializedTemporalTimeZone]] The only specified use of this slot is for distinguishing Temporal.TimeZone instances from other objects.
[[Identifier]] A String value representing the identifier of an available named time zone, or EMPTY if the instance represents an offset time zone.
[[OffsetMinutes]] An integer for minutes representing the constant offset of this time zone relative to UTC, or EMPTY if the instance represents a named time zone. If not EMPTY, this value must be in the interval from -1440 (exclusive) to 1440 (exclusive) (i.e., strictly less than 24 hours in magnitude).
11.5 Abstract Operations
EDITOR'S NOTE
In ECMA-262, many time-zone-related sections and abstract operations are contained in the Date Objects section of the specification. Now that ECMAScript has a built-in %Temporal.TimeZone% object, it may be appropriate to move those sections here, for example:
Time Zone Identifiers
AvailableNamedTimeZoneIdentifiers
SystemTimeZoneIdentifier
IsTimeZoneOffsetString
GetNamedTimeZoneEpochNanoseconds
GetNamedTimeZoneOffsetNanoseconds
11.5.1 Time Zone Methods Records
A Time Zone Methods Record is a Record value used to store a Temporal.TimeZone object, or an Object implementing the time zone protocol, along with any methods that have been observably looked up on that object during the current operation. Time Zone Methods Records are produced by the abstract operation CreateTimeZoneMethodsRecord.

Time Zone Methods Records have the fields listed in Table 17.

Table 17: Time Zone Methods Record Fields
Field Name Value Meaning
[[Receiver]] a String or Object The time zone object, or a string indicating a built-in time zone.
[[GetOffsetNanosecondsFor]] a function object or undefined The time zone's getOffsetNanosecondsFor method. For a built-in time zone this is always %Temporal.TimeZone.prototype.getOffsetNanosecondsFor%.
[[GetPossibleInstantsFor]] a function object or undefined The time zone's getPossibleInstantsFor method. For a built-in time zone this is always %Temporal.TimeZone.prototype.getPossibleInstantsFor%.
11.5.2 CreateTimeZoneMethodsRecord ( timeZone, methods )
The abstract operation CreateTimeZoneMethodsRecord takes arguments timeZone (a String or Object) and methods (a List of either GET-OFFSET-NANOSECONDS-FOR or GET-POSSIBLE-INSTANTS-FOR) and returns either a normal completion containing a Time Zone Methods Record, or a throw completion. It creates a Time Zone Methods Record from the given timeZone, looking up the methods given in methods. It performs the following steps when called:

1. Let record be the Time Zone Methods Record { [[Receiver]]: timeZone, [[GetOffsetNanosecondsFor]]: undefined, [[GetPossibleInstantsFor]]: undefined }.
2. For each element methodName in methods, do
   a. Perform ? TimeZoneMethodsRecordLookup(record, methodName).
3. Return record.
   11.5.3 TimeZoneMethodsRecordLookup ( timeZoneRec, methodName )
   The abstract operation TimeZoneMethodsRecordLookup takes arguments timeZoneRec (a Time Zone Methods Record) and methodName (GET-OFFSET-NANOSECONDS-FOR or GET-POSSIBLE-INSTANTS-FOR) and returns either a normal completion containing UNUSED, or a throw completion. It looks up the given method on the given time zone. For a built-in time zone, this lookup is unobservable and results in the intrinsic method. If the time zone is an Object, the lookup is observable and may result in a user-code method. It performs the following steps when called:

4. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, methodName) is false.
5. If methodName is GET-OFFSET-NANOSECONDS-FOR, then
   a. If timeZoneRec.[[Receiver]] is a String, then
   i. Set timeZoneRec.[[GetOffsetNanosecondsFor]] to %Temporal.TimeZone.prototype.getOffsetNanosecondsFor%.
   b. Else,
   i. Set timeZoneRec.[[GetOffsetNanosecondsFor]] to ? GetMethod(timeZoneRec.[[Receiver]], "getOffsetNanosecondsFor").
   ii. If timeZoneRec.[[GetOffsetNanosecondsFor]] is undefined, throw a TypeError exception.
6. Else if methodName is GET-POSSIBLE-INSTANTS-FOR, then
   a. If timeZoneRec.[[Receiver]] is a String, then
   i. Set timeZoneRec.[[GetPossibleInstantsFor]] to %Temporal.TimeZone.prototype.getPossibleInstantsFor%.
   b. Else,
   i. Set timeZoneRec.[[GetPossibleInstantsFor]] to ? GetMethod(timeZoneRec.[[Receiver]], "getPossibleInstantsFor").
   ii. If timeZoneRec.[[GetPossibleInstantsFor]] is undefined, throw a TypeError exception.
7. Return UNUSED.
   11.5.4 TimeZoneMethodsRecordHasLookedUp ( timeZoneRec, methodName )
   The abstract operation TimeZoneMethodsRecordHasLookedUp takes arguments timeZoneRec (a Time Zone Methods Record) and methodName (GET-OFFSET-NANOSECONDS-FOR or GET-POSSIBLE-INSTANTS-FOR) and returns true or false. It determines whether the given Time Zone Methods Record has already looked up the given method. It performs the following steps when called:

8. If methodName is GET-OFFSET-NANOSECONDS-FOR, then
   a. Let method be timeZoneRec.[[GetOffsetNanosecondsFor]].
9. Else if methodName is GET-POSSIBLE-INSTANTS-FOR, then
   a. Let method be timeZoneRec.[[GetPossibleInstantsFor]].
10. If method is undefined, return false.
11. Return true.
    11.5.5 TimeZoneMethodsRecordIsBuiltin ( timeZoneRec )
    The abstract operation TimeZoneMethodsRecordIsBuiltin takes argument timeZoneRec (a Time Zone Methods Record) and returns true or false. It determines whether the given Time Zone Methods Record represents a built-in time zone (that is never exposed to user code.) It performs the following steps when called:

12. If timeZoneRec.[[Receiver]] is a String, return true.
13. Return false.
    11.5.6 TimeZoneMethodsRecordCall ( timeZoneRec, methodName, arguments )
    The abstract operation TimeZoneMethodsRecordCall takes arguments timeZoneRec (a Time Zone Methods Record), methodName (GET-OFFSET-NANOSECONDS-FOR or GET-POSSIBLE-INSTANTS-FOR), and arguments (a List of ECMAScript language values) and returns either a normal completion containing an ECMAScript language value, or a throw completion. It calls the method methodName stored in the Time Zone Methods Record, with the stored receiver as the receiver, and the given arguments, and returns the result. It performs the following steps when called:

14. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, methodName) is true.
15. Let receiver be timeZoneRec.[[Receiver]].
16. If TimeZoneMethodsRecordIsBuiltin(timeZoneRec) is true, then
    a. Set receiver to ! CreateTemporalTimeZone(timeZoneRec.[[Receiver]]).
17. If methodName is GET-OFFSET-NANOSECONDS-FOR, then
    a. Return ? Call(timeZoneRec.[[GetOffsetNanosecondsFor]], receiver, arguments).
18. If methodName is GET-POSSIBLE-INSTANTS-FOR, then
    a. Return ? Call(timeZoneRec.[[GetPossibleInstantsFor]], receiver, arguments).
    11.5.7 CreateTemporalTimeZone ( identifier [ , newTarget ] )
    The abstract operation CreateTemporalTimeZone takes argument identifier (a String) and optional argument newTarget (a constructor) and returns either a normal completion containing a Temporal.TimeZone, or an abrupt completion. It creates a new Temporal.TimeZone instance and fills the internal slots with valid values. It performs the following steps when called:

19. If newTarget is not present, set newTarget to %Temporal.TimeZone%.
20. Let object be ? OrdinaryCreateFromConstructor(newTarget, "%Temporal.TimeZone.prototype%", « [[InitializedTemporalTimeZone]], [[Identifier]], [[OffsetMinutes]] »).
21. Assert: identifier is an available named time zone identifier or an offset time zone identifier.
22. Let parseResult be ! ParseTimeZoneIdentifier(identifier).
23. If parseResult.[[OffsetMinutes]] is not EMPTY, then
    a. Set object.[[Identifier]] to EMPTY.
    b. Set object.[[OffsetMinutes]] to parseResult.[[OffsetMinutes]].
24. Else,
    a. Assert: parseResult.[[Name]] is not EMPTY.
    b. Assert: GetAvailableNamedTimeZoneIdentifier(identifier).[[Identifier]] is identifier.
    c. Set object.[[Identifier]] to identifier.
    d. Set object.[[OffsetMinutes]] to EMPTY.
25. Return object.
    NOTE
    Most implementations support only a short, fixed list of available named time zone identifiers. For example, the IANA Time Zone Database in 2022 contained fewer than 600 identifiers. Although the [[Identifier]] internal slot is a String in this specification, implementations may choose to store named time zone identifiers it in any other form (for example as an enumeration or index into a List of identifier strings) as long as the String can be regenerated when needed.

Similar flexibility exists for the storage of the [[OffsetMinutes]] internal slot, which can be interchangeably represented as a 12-bit signed integer or as a 6-character ±HH:MM String value. ParseTimeZoneIdentifier and FormatOffsetTimeZoneIdentifier may be used to losslessly convert one representation to the other. Implementations are free to store either or both representations.

11.5.8 GetAvailableNamedTimeZoneIdentifier ( timeZoneIdentifier )
The abstract operation GetAvailableNamedTimeZoneIdentifier takes argument timeZoneIdentifier (a String) and returns either a Time Zone Identifier Record or EMPTY. If timeZoneIdentifier is an available named time zone identifier, then it returns one of the records in the List returned by AvailableNamedTimeZoneIdentifiers. Otherwise, EMPTY will be returned. It performs the following steps when called:

1. For each element record of AvailableNamedTimeZoneIdentifiers(), do
   a. If record.[[Identifier]] is an ASCII-case-insensitive match for timeZoneIdentifier, return record.
2. Return EMPTY.
   NOTE
   For any timeZoneIdentifier, or any value that is an ASCII-case-insensitive match for it, the result of this operation must remain the same for the lifetime of the surrounding agent. Specifically, if that result is a Time Zone Identifier Record, its fields must contain the same values.

Furthermore, time zone identifiers must not dynamically change from primary to non-primary or vice versa during the lifetime of the surrounding agent, meaning that if timeZoneIdentifier is an ASCII-case-insensitive match for the [[PrimaryIdentifier]] field of the result of a previous call to GetAvailableNamedTimeZoneIdentifier, then GetAvailableNamedTimeZoneIdentifier(timeZoneIdentifier) must return a record where [[Identifier]] is [[PrimaryIdentifier]].

Due to the complexity of supporting these requirements, it is recommended that the result of AvailableNamedTimeZoneIdentifiers (and therefore GetAvailableNamedTimeZoneIdentifier) remains the same for the lifetime of the surrounding agent.

11.5.9 GetISOPartsFromEpoch ( epochNanoseconds )
The abstract operation GetISOPartsFromEpoch takes argument epochNanoseconds (an integer). It returns the components of a date in UTC corresponding to the given number of nanoseconds since the epoch. It performs the following steps when called:

1. Assert: ! IsValidEpochNanoseconds(ℤ(epochNanoseconds)) is true.
2. Let remainderNs be epochNanoseconds modulo 10\*\*6.
3. Let epochMilliseconds be 𝔽((epochNanoseconds - remainderNs) / 10\*\*6).
4. Let year be EpochTimeToEpochYear(epochMilliseconds).
5. Let month be EpochTimeToMonthInYear(epochMilliseconds) + 1.
6. Let day be EpochTimeToDate(epochMilliseconds).
7. Let hour be ℝ(HourFromTime(epochMilliseconds)).
8. Let minute be ℝ(MinFromTime(epochMilliseconds)).
9. Let second be ℝ(SecFromTime(epochMilliseconds)).
10. Let millisecond be ℝ(msFromTime(epochMilliseconds)).
11. Let microsecond be floor(remainderNs / 1000).
12. Assert: microsecond < 1000.
13. Let nanosecond be remainderNs modulo 1000.
14. Return the Record { [[Year]]: year, [[Month]]: month, [[Day]]: day, [[Hour]]: hour, [[Minute]]: minute, [[Second]]: second, [[Millisecond]]: millisecond, [[Microsecond]]: microsecond, [[Nanosecond]]: nanosecond }.
    11.5.10 GetNamedTimeZoneNextTransition ( timeZoneIdentifier, epochNanoseconds )
    The implementation-defined abstract operation GetNamedTimeZoneNextTransition takes arguments timeZoneIdentifier (a String) and epochNanoseconds (a BigInt) and returns a BigInt or null.

The returned value t represents the number of nanoseconds since the epoch that corresponds to the first time zone transition after epochNanoseconds in the IANA time zone identified by timeZoneIdentifier. The operation returns null if no such transition exists for which t ≤ ℤ(nsMaxInstant).

A transition is a point in time where the UTC offset of a time zone changes, for example when Daylight Saving Time starts or stops. The returned value t represents the first nanosecond where the new UTC offset is used in this time zone, not the last nanosecond where the previous UTC offset is used.

Given the same values of timeZoneIdentifier and epochNanoseconds, the result must be the same for the lifetime of the surrounding agent.

The minimum implementation of GetNamedTimeZoneNextTransition for ECMAScript implementations that do not include local political rules for any time zones performs the following steps when called:

1. Assert: timeZoneIdentifier is "UTC".
2. Return null.
   11.5.11 GetNamedTimeZonePreviousTransition ( timeZoneIdentifier, epochNanoseconds )
   The implementation-defined abstract operation GetNamedTimeZonePreviousTransition takes arguments timeZoneIdentifier (a String) and epochNanoseconds (a BigInt) and returns a BigInt or null.

The returned value t represents the number of nanoseconds since the epoch that corresponds to the last time zone transition before epochNanoseconds in the IANA time zone identified by timeZoneIdentifier. The operation returns null if no such transition exists for which t ≥ ℤ(nsMinInstant).

A transition is a point in time where the UTC offset of a time zone changes, for example when Daylight Saving Time starts or stops. The returned value t represents the first nanosecond where the new UTC offset is used in this time zone, not the last nanosecond where the previous UTC offset is used.

Given the same values of timeZoneIdentifier and epochNanoseconds, the result must be the same for the lifetime of the surrounding agent.

The minimum implementation of GetNamedTimeZonePreviousTransition for ECMAScript implementations that do not include local political rules for any time zones performs the following steps when called:

1. Assert: timeZoneIdentifier is "UTC".
2. Return null.
   11.5.12 FormatOffsetTimeZoneIdentifier ( offsetMinutes [ , style ] )
   The abstract operation FormatOffsetTimeZoneIdentifier takes argument offsetMinutes (an integer) and optional argument style (SEPARATED or UNSEPARATED) and returns a String. It formats a UTC offset, in minutes, into a UTC offset string. If style is SEPARATED or not present, then the output will be formatted like ±HH:MM. If style is UNSEPARATED, then the output will be formatted like ±HHMM. It performs the following steps when called:

3. If offsetMinutes ≥ 0, let sign be the code unit 0x002B (PLUS SIGN); otherwise, let sign be the code unit 0x002D (HYPHEN-MINUS).
4. Let absoluteMinutes be abs(offsetMinutes).
5. Let hour be floor(absoluteMinutes / 60).
6. Let minute be absoluteMinutes modulo 60.
7. Let timeString be FormatTimeString(hour, minute, 0, 0, "minute", style).
8. Return the string-concatenation of sign and timeString.
   11.5.13 FormatUTCOffsetNanoseconds ( offsetNanoseconds )
   The abstract operation FormatUTCOffsetNanoseconds takes argument offsetNanoseconds (an integer) and returns a String. If the offset represents an integer number of minutes, then the output will be formatted like ±HH:MM. Otherwise, the output will be formatted like ±HH:MM:SS or (if the offset does not evenly divide into seconds) ±HH:MM:SS.fff… where the "fff" part is a sequence of at least 1 and at most 9 fractional seconds digits with no trailing zeroes. It performs the following steps when called:

9. If offsetNanoseconds ≥ 0, let sign be the code unit 0x002B (PLUS SIGN); otherwise, let sign be the code unit 0x002D (HYPHEN-MINUS).
10. Let absoluteNanoseconds be abs(offsetNanoseconds).
11. Let hour be floor(absoluteNanoseconds / (3600 × 10\*\*9)).
12. Let minute be floor(absoluteNanoseconds / (60 × 10\*\*9)) modulo 60.
13. Let second be floor(absoluteNanoseconds / 10\*\*9) modulo 60.
14. Let subSecondNanoseconds be absoluteNanoseconds modulo 10\*\*9.
15. If second = 0 and subSecondNanoseconds = 0, let precision be "minute"; otherwise, let precision be "auto".
16. Let timeString be FormatTimeString(hour, minute, second, subSecondNanoseconds, precision).
17. Return the string-concatenation of sign and timeString.
    11.5.14 FormatDateTimeUTCOffsetRounded ( offsetNanoseconds )
    The abstract operation FormatDateTimeUTCOffsetRounded takes argument offsetNanoseconds (an integer) and returns a String. It rounds offsetNanoseconds to the nearest minute boundary and formats the rounded value into a ±HH:MM format, to support available named time zones that may have sub-minute offsets. It performs the following steps when called:

18. Set offsetNanoseconds to RoundNumberToIncrement(offsetNanoseconds, 60 × 10\*\*9, "halfExpand").
19. Let offsetMinutes be offsetNanoseconds / (60 × 10\*\*9).
20. Assert: offsetMinutes is an integer.
21. Return FormatOffsetTimeZoneIdentifier(offsetMinutes).
    11.5.15 ObjectImplementsTemporalTimeZoneProtocol ( object )
    The abstract operation ObjectImplementsTemporalTimeZoneProtocol takes argument object (an Object) and returns either a normal completion containing a Boolean, or a throw completion. It determines whether the given object is a Temporal.TimeZone instance or implements the required methods from the Temporal.TimeZone protocol. For ordinary objects, and some exotic objects, this operation is infallible and will always return a normal completion. However, if object is a Proxy or has one in its prototype chain, user code may be called. It performs the following steps when called:

22. If object has an [[InitializedTemporalTimeZone]] internal slot, return true.
23. For each property key key of « "getOffsetNanosecondsFor", "getPossibleInstantsFor", "id" », do
    a. If ? HasProperty(object, key) is false, return false.
24. Return true.
    NOTE
    This operation is a convenience which makes it easier to catch bugs in custom time zones. For web compatibility reasons, the list of required property keys will not be extended in future editions, even if the Temporal.TimeZone protocol gains more methods.
    11.5.16 ToTemporalTimeZoneSlotValue ( temporalTimeZoneLike )
    The abstract operation ToTemporalTimeZoneSlotValue takes argument temporalTimeZoneLike (an ECMAScript value) and returns either a normal completion containing either a String or an Object, or a throw completion. It attempts to derive a value from temporalTimeZoneLike that is suitable for storing in a Temporal.ZonedDateTime's [[TimeZone]] internal slot, and returns that value if found or throws an exception if not. It performs the following steps when called:

25. If Type(temporalTimeZoneLike) is Object, then
    a. If temporalTimeZoneLike has an [[InitializedTemporalZonedDateTime]] internal slot, then
    i. Return temporalTimeZoneLike.[[TimeZone]].
    b. If ? ObjectImplementsTemporalTimeZoneProtocol(temporalTimeZoneLike) is false, throw a TypeError exception.
    c. Return temporalTimeZoneLike.
26. If temporalTimeZoneLike is not a String, throw a TypeError exception.
27. Let parseResult be ? ParseTemporalTimeZoneString(temporalTimeZoneLike).
28. Let offsetMinutes be parseResult.[[OffsetMinutes]].
29. If offsetMinutes is not EMPTY, return FormatOffsetTimeZoneIdentifier(offsetMinutes).
30. Let name be parseResult.[[Name]].
31. Let timeZoneIdentifierRecord be GetAvailableNamedTimeZoneIdentifier(name).
32. If timeZoneIdentifierRecord is EMPTY, throw a RangeError exception.
33. Return timeZoneIdentifierRecord.[[Identifier]].
    11.5.17 ToTemporalTimeZoneIdentifier ( timeZoneSlotValue )
    The abstract operation ToTemporalTimeZoneIdentifier takes argument timeZoneSlotValue (a String or Object) and returns either a normal completion containing a String, or a throw completion. It obtains the identifier string for a value timeZoneSlotValue stored in a Temporal.ZonedDateTime's [[TimeZone]] internal slot. It performs the following steps when called:

34. If timeZoneSlotValue is a String, then
    a. Assert: Either IsOffsetTimeZoneIdentifier(timeZoneSlotValue) is true, or GetAvailableNamedTimeZoneIdentifier(timeZoneSlotValue) is not EMPTY.
    b. Return timeZoneSlotValue.
35. Let identifier be ? Get(timeZoneSlotValue, "id").
36. If identifier is not a String, throw a TypeError exception.
37. Return identifier.
    11.5.18 ToTemporalTimeZoneObject ( timeZoneSlotValue )
    The abstract operation ToTemporalTimeZoneObject takes argument timeZoneSlotValue (a String or Object) and returns an Object. It obtains a time zone object for a value timeZoneSlotValue stored in a Temporal.ZonedDateTime's [[TimeZone]] internal slot. It performs the following steps when called:

38. If timeZoneSlotValue is an Object, return timeZoneSlotValue.
39. Return ! CreateTemporalTimeZone(timeZoneSlotValue).
    11.5.19 GetOffsetNanosecondsFor ( timeZoneRec, instant )
    The abstract operation GetOffsetNanosecondsFor takes arguments timeZoneRec (a Time Zone Methods Record) and instant (a Temporal.Instant) and returns either a normal completion containing an integer, or an abrupt completion. It determines the UTC offset of an instant, in nanoseconds, by calling the getOffsetNanosecondsFor method of the given time zone. It performs the following steps when called:

40. Let offsetNanoseconds be ? TimeZoneMethodsRecordCall(timeZoneRec, GET-OFFSET-NANOSECONDS-FOR, « instant »).
41. If TimeZoneMethodsRecordIsBuiltin(timeZoneRec), return ℝ(offsetNanoseconds).
42. If Type(offsetNanoseconds) is not Number, throw a TypeError exception.
43. If IsIntegralNumber(offsetNanoseconds) is false, throw a RangeError exception.
44. Set offsetNanoseconds to ℝ(offsetNanoseconds).
45. If abs(offsetNanoseconds) ≥ nsPerDay, throw a RangeError exception.
46. Return offsetNanoseconds.
    11.5.20 GetOffsetStringFor ( timeZoneRec, instant )
    The abstract operation GetOffsetStringFor takes arguments timeZoneRec (a Time Zone Methods Record) and instant (a Temporal.Instant) and returns either a normal completion containing a String, or an abrupt completion. This operation is the internal implementation of the Temporal.TimeZone.prototype.getOffsetStringFor method. If the given time zone is not built-in, it observably calls the time zone's getOffsetNanosecondsFor method. It performs the following steps when called:

47. Let offsetNanoseconds be ? GetOffsetNanosecondsFor(timeZoneRec, instant).
48. Return FormatUTCOffsetNanoseconds(offsetNanoseconds).
    11.5.21 GetPlainDateTimeFor ( timeZoneRec, instant, calendar [ , precalculatedOffsetNanoseconds ] )
    The abstract operation GetPlainDateTimeFor takes arguments timeZoneRec (a Time Zone Methods Record), instant (a Temporal.Instant), and calendar (a String or Object) and optional argument precalculatedOffsetNanoseconds (an integer) and returns either a normal completion containing a Temporal.PlainDateTime, or an abrupt completion. This operation is the internal implementation of the Temporal.TimeZone.prototype.getPlainDateTimeFor method. If the given time zone is not built-in, it observably calls timeZone's getOffsetNanosecondsFor method unless precalculatedOffsetNanoseconds is supplied. It performs the following steps when called:

49. Assert: If precalculatedOffsetNanoseconds is not present, TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-OFFSET-NANOSECONDS-FOR) is true.
50. If precalculatedOffsetNanoseconds is present, let offsetNanoseconds be precalculatedOffsetNanoseconds.
51. Else, let offsetNanoseconds be ? GetOffsetNanosecondsFor(timeZoneRec, instant).
52. Assert: abs(offsetNanoseconds) < nsPerDay.
53. Let result be ! GetISOPartsFromEpoch(ℝ(instant.[[Nanoseconds]])).
54. Set result to BalanceISODateTime(result.[[Year]], result.[[Month]], result.[[Day]], result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]] + offsetNanoseconds).
55. Return ! CreateTemporalDateTime(result.[[Year]], result.[[Month]], result.[[Day]], result.[[Hour]], result.[[Minute]], result.[[Second]], result.[[Millisecond]], result.[[Microsecond]], result.[[Nanosecond]], calendar).
    11.5.22 GetInstantFor ( timeZoneRec, dateTime, disambiguation )
    The abstract operation GetInstantFor takes arguments timeZoneRec (a Time Zone Methods Record), dateTime (a Temporal.PlainDateTime), and disambiguation ("compatible", "earlier", "later", or "reject") and returns either a normal completion containing a Temporal.Instant, or an abrupt completion. It is the internal implementation of the Temporal.TimeZone.prototype.getInstantFor method. It calls the timeZoneRec's getPossibleInstantsFor method at least once. If that call returns an empty array and disambiguation is not "reject", it calls timeZoneRec's getOffsetNanosecondsFor method twice, and getPossibleInstantsFor an additional time. It performs the following steps when called:

56. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-OFFSET-NANOSECONDS-FOR) is true.
57. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-POSSIBLE-INSTANTS-FOR) is true.
58. Let possibleInstants be ? GetPossibleInstantsFor(timeZoneRec, dateTime).
59. Return ? DisambiguatePossibleInstants(possibleInstants, timeZoneRec, dateTime, disambiguation).
    11.5.23 DisambiguatePossibleInstants ( possibleInstants, timeZoneRec, dateTime, disambiguation )
    The abstract operation DisambiguatePossibleInstants takes arguments possibleInstants (a List of Temporal.Instant objects), timeZoneRec (a Time Zone Methods Record), dateTime (a Temporal.PlainDateTime), and disambiguation ("compatible", "earlier", "later", or "reject") and returns either a normal completion containing a Temporal.Instant, or an abrupt completion. It chooses from a List of possible Temporal.Instant instances the one indicated by the disambiguation parameter.

The possibleInstants List may be empty, in which case it calls the time zone's getOffsetNanosecondsFor method twice, and getPossibleInstantsFor once, if disambiguation is not "reject".

1. Assert: TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-POSSIBLE-INSTANTS-FOR) is true.
2. Assert: If possibleInstants is empty, and disambiguation is not "reject", TimeZoneMethodsRecordHasLookedUp(timeZoneRec, GET-OFFSET-NANOSECONDS-FOR) is true.
3. Let n be possibleInstants's length.
4. If n = 1, then
   a. Return possibleInstants[0].
5. If n ≠ 0, then
   a. If disambiguation is "earlier" or "compatible", then
   i. Return possibleInstants[0].
   b. If disambiguation is "later", then
   i. Return possibleInstants[n - 1].
   c. Assert: disambiguation is "reject".
   d. Throw a RangeError exception.
6. Assert: n = 0.
7. If disambiguation is "reject", then
   a. Throw a RangeError exception.
8. Let epochNanoseconds be GetUTCEpochNanoseconds(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]], dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]]).
9. Let dayBeforeNs be epochNanoseconds - ℤ(nsPerDay).
10. If IsValidEpochNanoseconds(dayBeforeNs) is false, throw a RangeError exception.
11. Let dayBefore be ! CreateTemporalInstant(dayBeforeNs).
12. Let dayAfterNs be epochNanoseconds + ℤ(nsPerDay).
13. If IsValidEpochNanoseconds(dayAfterNs) is false, throw a RangeError exception.
14. Let dayAfter be ! CreateTemporalInstant(dayAfterNs).
15. Let offsetBefore be ? GetOffsetNanosecondsFor(timeZoneRec, dayBefore).
16. Let offsetAfter be ? GetOffsetNanosecondsFor(timeZoneRec, dayAfter).
17. Let nanoseconds be offsetAfter - offsetBefore.
18. If abs(nanoseconds) > nsPerDay, throw a RangeError exception.
19. If disambiguation is "earlier", then
    a. Let norm be NormalizeTimeDuration(0, 0, 0, 0, 0, -nanoseconds).
    b. Let earlierTime be AddTime(dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], norm).
    c. Let earlierDate be BalanceISODate(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]] + earlierTime.[[Days]]).
    d. Let earlierDateTime be ! CreateTemporalDateTime(earlierDate.[[Year]], earlierDate.[[Month]], earlierDate.[[Day]], earlierTime.[[Hour]], earlierTime.[[Minute]], earlierTime.[[Second]], earlierTime.[[Millisecond]], earlierTime.[[Microsecond]], earlierTime.[[Nanosecond]], "iso8601").
    e. Set possibleInstants to ? GetPossibleInstantsFor(timeZoneRec, earlierDateTime).
    f. If possibleInstants is empty, throw a RangeError exception.
    g. Return possibleInstants[0].
20. Assert: disambiguation is "compatible" or "later".
21. Let norm be NormalizeTimeDuration(0, 0, 0, 0, 0, nanoseconds).
22. Let laterTime be AddTime(dateTime.[[ISOHour]], dateTime.[[ISOMinute]], dateTime.[[ISOSecond]], dateTime.[[ISOMillisecond]], dateTime.[[ISOMicrosecond]], dateTime.[[ISONanosecond]], norm).
23. Let laterDate be BalanceISODate(dateTime.[[ISOYear]], dateTime.[[ISOMonth]], dateTime.[[ISODay]] + laterTime.[[Days]]).
24. Let laterDateTime be ! CreateTemporalDateTime(laterDate.[[Year]], laterDate.[[Month]], laterDate.[[Day]], laterTime.[[Hour]], laterTime.[[Minute]], laterTime.[[Second]], laterTime.[[Millisecond]], laterTime.[[Microsecond]], laterTime.[[Nanosecond]], "iso8601").
25. Set possibleInstants to ? GetPossibleInstantsFor(timeZoneRec, laterDateTime).
26. Set n to possibleInstants's length.
27. If n = 0, throw a RangeError exception.
28. Return possibleInstants[n - 1].
    11.5.24 GetPossibleInstantsFor ( timeZoneRec, dateTime )
    The abstract operation GetPossibleInstantsFor takes arguments timeZoneRec (a Time Zone Methods Record) and dateTime (a Temporal.PlainDateTime) and returns either a normal completion containing a List of Temporal.Instant objects, or an abrupt completion. It determines the possible Temporal.Instant exact times that may correspond to dateTime, by calling the getPossibleInstantsFor method of the given time zone. It performs the following steps when called:

29. Let possibleInstants be ? TimeZoneMethodsRecordCall(timeZoneRec, GET-POSSIBLE-INSTANTS-FOR, « dateTime »).
30. If TimeZoneMethodsRecordIsBuiltin(timeZoneRec), return ! CreateListFromArrayLike(possibleInstants, « Object »).
31. Let iteratorRecord be ? GetIterator(possibleInstants, SYNC).
32. Let list be a new empty List.
33. Repeat,
    a. Let value be ? IteratorStepValue(iteratorRecord).
    b. If value is DONE, then
    i. Let numResults be list's length.
    ii. If numResults > 1, then
34. Let epochNs be a new empty List.
35. For each value instant in list, do
    a. Append instant.[[EpochNanoseconds]] to the end of the List epochNs.
36. Let min be the least element of the List epochNs.
37. Let max be the greatest element of the List epochNs.
38. If abs(ℝ(max - min)) > nsPerDay, throw a RangeError exception.
    iii. Return list.
    c. If value is not an Object or value does not have an [[InitializedTemporalInstant]] internal slot, then
    i. Let completion be ThrowCompletion(a newly created TypeError object).
    ii. Return ? IteratorClose(iteratorRecord, completion).
    d. Append value to the end of the List list.
    11.5.25 TimeZoneEquals ( one, two )
    The abstract operation TimeZoneEquals takes arguments one (a String or Object) and two (a String or Object) and returns either a normal completion containing either true or false, or a throw completion. It returns true if its arguments represent time zones using the same identifier. It performs the following steps when called:

39. If one and two are the same Object value, return true.
40. Let timeZoneOne be ? ToTemporalTimeZoneIdentifier(one).
41. Let timeZoneTwo be ? ToTemporalTimeZoneIdentifier(two).
42. If timeZoneOne is timeZoneTwo, return true.
43. Let offsetMinutesOne be ? ParseTimeZoneIdentifier(timeZoneOne).[[OffsetMinutes]].
44. Let offsetMinutesTwo be ? ParseTimeZoneIdentifier(timeZoneTwo).[[OffsetMinutes]].
45. If offsetMinutesOne is EMPTY and offsetMinutesTwo is EMPTY, then
    a. Let recordOne be GetAvailableNamedTimeZoneIdentifier(timeZoneOne).
    b. Let recordTwo be GetAvailableNamedTimeZoneIdentifier(timeZoneTwo).
    c. If recordOne is not EMPTY and recordTwo is not EMPTY and recordOne.[[PrimaryIdentifier]] is recordTwo.[[PrimaryIdentifier]], return true.
46. Else,
    a. If offsetMinutesOne is not EMPTY and offsetMinutesTwo is not EMPTY and offsetMinutesOne = offsetMinutesTwo, return true.
47. Return false.
    11.5.26 ParseTimeZoneIdentifier ( identifier )
    The abstract operation ParseTimeZoneIdentifier takes argument identifier (a String) and returns either a normal completion containing a Record containing [[Name]] and [[OffsetMinutes]] fields, or a throw completion. If identifier is a named time zone identifier, [[Name]] will be identifier and [[OffsetMinutes]] will be EMPTY. If identifier is an offset time zone identifier, [[Name]] will be EMPTY and [[OffsetMinutes]] will be a signed integer. Otherwise, a RangeError will be thrown. It performs the following steps when called:

48. Let parseResult be ParseText(StringToCodePoints(identifier), TimeZoneIdentifier).
49. If parseResult is a List of errors, throw a RangeError exception.
50. If parseResult contains a TimeZoneIANAName Parse Node, then
    a. Let name be the source text matched by the TimeZoneIANAName Parse Node contained within parseResult.
    b. NOTE: name is syntactically valid, but does not necessarily conform to IANA Time Zone Database naming guidelines or correspond with an available named time zone identifier.
    c. Return the Record { [[Name]]: name, [[OffsetMinutes]]: EMPTY }.
51. Else,
    a. Assert: parseResult contains a TimeZoneUTCOffsetName Parse Node.
    b. Let offsetString be the source text matched by the TimeZoneUTCOffsetName Parse Node contained within parseResult.
    c. Let offsetNanoseconds be ! ParseDateTimeUTCOffset(offsetString).
    d. Let offsetMinutes be offsetNanoseconds / (60 × 10\*\*9).
    e. Assert: offsetMinutes is an integer.
    f. Return the Record { [[Name]]: EMPTY, [[OffsetMinutes]]: offsetMinutes }.
