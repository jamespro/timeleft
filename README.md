# timeleft

## Description

Show you the actual amount of useful time you have left.

### Features

- subtracts time you have committed for other things. Examples:
  - breaks
  - meals
  - meetings
  - travel time
  - other commitments
  - "gray" time - time where things are going on but you could skip if you had to
- Pull from external calendar(s), e.g.
  - Google Calendar
  - iCal
  - Outlook
- Settings:
  - What time is the "end" of your day?
  - When are your breaks?
  - What commitments do you have today?
  - What is the max time to show?
- **NOTE! AS BREAKS AND MEETINGS PASS, THEY NO LONGER NEED TO BE SUBTRACTED FROM YOUR AVAILABLE TIME!!**

### Key Technical Issues

- A) How to get the reserved time from the person's calendar and actually multiple calendars?
  - How technically to code this
  - Authorization
  - Storing the person's authorization
- B) How to store these events. And when do you update your copy?
- C) Dealing with partial time (see below)
- D) Is it draining a lot of resources to have it update every second? Change it to every minute? Or not a big deal? Or change it to every minute anyway because I don't personally need it?
- E) I think there was something else
- **NOTE! AS BREAKS AND MEETINGS PASS, THEY NO LONGER NEED TO BE SUBTRACTED FROM YOUR AVAILABLE TIME!!**
  - So do we need to know the start/end times of each thing that is being removed?
  - How do we remove part of the time? e.g. if it is halfway through lunch, only 30 minutes have passed but not the whole thing?
- If I generate a new block for each hour of time, plus one for partial hour, it will illustrate number of hours
  - or do this with background? SVG background? But I'd want it to scale

### Design

- Should draw this on a whiteboard and use that as the guide
- What is the total height to show/ total time is out of what?
  - Have this be a user setting
  - What is the max time to show?
    - Or set a start time for the day? e.g. 9am
    - 8 hours? (a workday)
    - 12 hours? (a full day)
    - 5 hours? (a work period that you have)
    - Current time until end?
      - Does this get set whenever you start the app?
      - Does it save the start time?
      - Have a reset button to set start time to current time?
- Break up the block into hours visually. (maybe quarter-hours also?)
- What happens when time left goes negative? Should stop counting, but a bug happened when time left is negative (cannot divide by negative)
  - OR?? should it count up, and be adding to "overtime"? Or subtract from "overtime"? We currently don't show "overtime" so I would need to design for that.

## Plan

- v1: display as countdown timer
- v2: display graphically:
  - as bar, going lower/shorter as time progresses to visualize the time diminishing
  - circle? although I don't like that as much
- Plain JavaScript or React?
  - React would make it easier to switch between layouts
  - and to switch to a settings panel
- Data storage?
  - MongoDB (or Firebase)
  - LocalStorage
  - Flat files
  - SQL (host?)
- Auth/login?
  - need logins for calendars?
- Can use the todo-mvc-auth to save user settings to MongoDB (uses EJS though)
- Date Time formats
  - NOTE: USING ISO 8601 - GOOGLE CALENDAR API FORMAT (TO START)
  - .ics - TBD

### Plan: MVP

- countdown timer
- hard-code values:
  - start of day: default: 9am
  - end of day: default: 9pm
  - total break time default: 4.0
    - lunch: 1
    - dinner: 2
    - breaks: 1
  - total scheduled time: default: 0.0
- only one user
- no calendar login

## TODO - MVP 0.1

_IS THERE A DIFFERENT WAY TO CALCULATE THESE? AN ALGORITHM?_
_MAKE AN ARRAY OR DATA STRUCTURE THAT ACCUMULATES THE TIMES, THAT MERGES ANY OVERLAPPINGntheCa_

- [x] Display countdown
- [ ] Hard-code settings
  - [x] start of day
  - [x] end of day
  - [x] total break time
  - [x] total scheduled time
- [ ] Smaller steps:
  - [ ] calc/show:
    - [ ] totalTime = periodEnd - periodStart
      - //NOTE: "period" = the SCALE which also = "totalTime". "period" does not start from "now"
      - [ ] periodEnd = dayEnd, then lateEnd, then workEnd
        - if now > that End, use the next End
        - //NOTE: \* (perodEnd is never earlier than workEnd)
    - [ ] passedTime = now - periodStart
    - [ ] availableTime = totalTime - passedTime
      - _EVERYTHING IS SUBTRACTED FROM TOTALTIME_
      - subtract time elapsed since start //(now to periodEnd)
    - [ ] percentAvailable = availableTime/totalTime
      - so now we have the scale and we can show it relative to the total
    - [ ] unavailableTime = sum of time of all events during period
      - that start before periodEnd
      - that do not end before periodStart
      - _for each Event, you'll subtract any time that is before periodStart or after periodEnd_
      - ?: _subtract any time before "now"?_
    - [ ] then subtract Event1
      - TestEvent is always in the future
    - RULES TO INCLUDE AN EVENT'S TIME IN THE CALC
      - [ ] RULE: start is before period END; end is after period START - it must start BEFORE the end, and it must end AFTER it starts
        - ^^^ THIS RULE WILL TAKE CARE OF THESE CASES BELOW, RIGHT?
          - [ ] start and end are both before period start - exclude
          - [ ] start and end are both after period end - exclude
    - [ ] EXAMPLE EVENTS
      - [ ] "TOO EARLY" - start and end are both before period start - exclude
      - [ ] "TOO LATE" - start and end are both after period end - exclude
      - [ ] "DURING" - start is after period start; end is before period end - subtract
      - [ ] "DURING FUTURE" - simplest: start and end are both after now (in the future) and both after period start and before period end (and do not overlap)
      - [ ] "DURING PAST" - start and end are both in this period before now
      - [ ] "DURING OVERLAP START"
      - [ ] "DURING OVERLAP END"
      - CASES involving "NOW"
      - [ ] "DURING OVERLAP NOW"
      - [ ] - start before now
      - [ ] - start before now; end after period
    - [ ] SPECIAL CASES
      - [ ] If EventEnd has passed, do not subtract EventTime
      - [ ] what if Event has already started - and not passed
        - subtract: now - eventStart from totalTime
      - [ ] _WHAT IF TWO EVENTS OVERLAP?_
- USING GOOGLE CALENDAR API FORMAT (TO START)
- ?: passing the times as milliseconds and subtracting?
- ?: What happens when time left goes negative? Should stop counting, but a bug happened when time left is negative (cannot divide by negative)
  - ?: OR?? should it count up, and be adding to "overtime"? Or subtract from "overtime"? We currently don't show "overtime" so I would need to design for that.
- IDEA: DISPLAY: What if you just have two rectangles of size = totalTime, but rectangle 2 moves down or "starts" at the current time. Then at the end (bottom), either it moves off the viewable area, or the color is different because it's no longer overlapping rectangle 1 (the totalTime), making the "used up time" look different.
  - you still need to calculate the periodTime, and have a way to know where to start "now"
  - it doesn't take "unavailableTime" into account (like meetings or lunch) - you would still need to calculate rectangle 2 size separately

## TODO - MVP 0.2

- [ ] Display current date and time (optional)
- [ ] Form to enter settings
- [ ] Settings: Basic:
  - [ ] end of day
  - [ ] total break time
  - [ ] total scheduled time

## TODO - v2

- [ ] Show number of hours, to the side (or top if it's horizontal)
- [ ] Visual display: Bar with size decreasing
- [ ] Bar height = total time (starting when??)

# Future/Maybe

- maybe: show different categories of time in different colors, for example, blue for clear, red for meetings, purple for breaks that might be optional, and have these stacked, so not just your free time
- Tech: Standalone app (Electron? React Native?)
- Be able to have as a component on a separate dashboard
- Different layouts?
  - Just available time
  - Available time plus other types of time
  - Available time above a line, other types below the line
- What if able to show a week? How much time for each day for 7 days?

# Log

## 2024-04-09

- can login with google for the calendar

### TODO

- Google API: How qualify to verify, for non-experimental access? e.g. privacy policy. Check my other project to see if I did it for that.
  - what was the other project?
- login to thinkabout, by github/discord, to fix???
- how to organize the JS into modules, files?
- PassportJS? check other project to see how that's done. probably a different project
- To remember be and not need full login
- Calendar: Pick the calendar(s), or do all calendars? Also, put FocusMate onto different default calendar
- UI: render HTML another way? Template engine? Put into HTML and just update parts?
- UI: colors for different periods of the day. dark at night, yellow/orange before.
- UI: more height 50%. How make it proportional to viewport?
- UI: less space above
- UI: timer not move.

## 2024-03-26

2024-03-26 notes APP TimeLeft

TOTALTIME =
PeriodEnd -
PeriodStart

difference (as DURATION)

converts to total Scale as type? PlainTime or seconds, milli, nano seconds?

RESULTS, TURNED INTO:

- CLOCK as HH: MM: SS
- GAUGE as 100%
  gave up needing seconds to convert across functions? use Plain Time as common format? but need more Type script?
  Clock- subtract HH MM SS

subtracting from total time

ELAPSED = elapsed tine since period Start
= nowTime -period Start as Duration

- output in PlainTime

BUSY =

- CLIP events data at nowTime - periodEnd then
- MERGE then
- calculate/SUM durations
- output in Plain Time (?)

AVAILABLE =
TOTALTIME - ELAPSED - BUSY

## 2024-03-20

### tick: thinking

- do I need to reorganize the code or maybe not?
- on tick, what needs to happen?
  - re-run... basically the entire thing

### Which next step today?

_FUNCTION OVER LOOKS (right now)_

- SUBTRACTING EVENT TIME??
- tick
- - ACTUAL EVENTS from Google Calendar?
- layout: center, color, size
- Refactoring? (see other list)
- hosting: put it live, where? fly.io? vercel? replace Vercel app (no that's a T3 app)
- T3 app-- just put this code onto the T3 app?? because that can just be live already
- multiple timers? early, prime, late, after, and they all go down to nothing?

#### Refactoring list

- Refactor code... separate files & importing?
- Refactor code... use functions better?
- Refactor code... templating? Svelte? T3?
- Refactor code... JSDoc? take out, leave in?

## 2024-03-19

### Status

- now have vertical time gauge with time live in the current period
- and display time left in hh:mm:ss

## 2024-03-18

### NEXT

- [ ] tick function to update the time and gauge
- [ ] design (larger, adjust to screen size, dark mode or leave light mode?)

### Status

#### Date/Time functions

- Temporal: temporal-polyfill
- now as ZonedDateTimeISO
- nowTime is PlainTime - from now (so not a new time)
- nowTimeZone

#### Event Data

- eventsDataJSON
  - not using this yet, it's empty

#### Periods

- start and end times are set
  - PlainTime
- periodStart, periodEnd defaults to day
- [ ] ?? MUST BE SOME COMPARE FUNCTION in TEMPORAL??? INSTEAD OF since / until??
- DURATION - SINCE / UNTIL - work to compare
  - and TOTAL to convert to "seconds" / "milliseconds
- [ ] adjustPeriods - its own function?
- [ ] what should it take as params? and output?
- [ ] after output, needs to set the values right?
  - like it shouldn't update periods inside the function, it should be outside??
  - return an object?
  - periods = { "periodStart": "17:00:00", "periodEnd": "22:59:59" }
  - OR ARE THEY SUPPOSED TO BE Temporal.PlainTime ??

### Timer / updating

- tick function
- call itself using setTimeout 100ms (NOT SETINTERVAL)
- updates time left on all timers
- & checks if a timer has expired

### NEW! Added / updated

- use `now.toPlainTime();` instead

#### Checklist

- [ ] check console
- [ ] Today's date being used?
- [ ] current periodStart correct?
- [ ] current periodEnd correct?
- [ ] duration time now until periodEnd? DISPLAY IT
