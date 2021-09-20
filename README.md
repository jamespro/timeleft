# timeleft

## Description
Show you the actual amount of useful time you have left.

### Features

* subtracts time you have committed for other things. Examples:
  * breaks
  * meals
  * meetings
  * travel time
  * other commitments
  * "gray" time - time where things are going on but you could skip if you had to
* Pull from external calendar(s), e.g.
  * Google Calendar
  * iCal
  * Outlook
* Settings:
  * What time is the "end" of your day?
  * When are your breaks?
  * What commitments do you have today?
  * What is the max time to show? 
* **NOTE! AS BREAKS AND MEETINGS PASS, THEY NO LONGER NEED TO BE SUBTRACTED FROM YOUR AVAILABLE TIME!!**

### Key Technical Issues
* A) How to get the reserved time from the person's calendar and actually multiple calendars?
  * How technically to code this
  * Authorization
  * Storing the person's authorization
* B) How to store these events. And when do you update your copy?
* C) Dealing with partial time (see below)
* D) I think there was something else
* **NOTE! AS BREAKS AND MEETINGS PASS, THEY NO LONGER NEED TO BE SUBTRACTED FROM YOUR AVAILABLE TIME!!**
  * So do we need to know the start/end times of each thing that is being removed?
  * How do we remove part of the time? e.g. if it is halfway through lunch, only 30 minutes have passed but not the whole thing?
* If I generate a new block for each hour of time, plus one for partial hour, it will illustrate number of hours
  * or do this with background? SVG background? But I'd want it to scale

### Design
* Should draw this on a whiteboard and use that as the guide
* What is the total height to show/ total time is out of what?
  * Have this be a user setting
  * What is the max time to show? 
    * Or set a start time for the day? e.g. 9am
    * 8 hours? (a workday)
    * 12 hours? (a full day)
    * 5 hours? (a work period that you have)
    * Current time until end? 
      * Does this get set whenever you start the app?
      * Does it save the start time?
      * Have a reset button to set start time to current time?
* Break up the block into hours visually. (maybe quarter-hours also?)

## Plan
* v1: display as countdown timer
* v2: display graphically:
  * as bar, going lower/shorter as time progresses to visualize the time diminishing
  * circle? although I don't like that as much
* Plain JavaScript or React?
  * React would make it easier to switch between layouts
  * and to switch to a settings panel
* Data storage? 
  * MongoDB (or Firebase)
  * LocalStorage
  * Flat files
  * SQL (host?)
* Auth/login?
  * need logins for calendars?
* Can use the todo-mvc-auth to save user settings to MongoDB (uses EJS though) 

### Plan: MVP
* countdown timer
* hard-code values:
  * start of day: default: 9am
  * end of day: default: 9pm
  * total break time default: 4.0 
    * lunch: 1
    * dinner: 2
    * breaks: 1
  * total scheduled time: default: 0.0
* only one user
* no calendar login 

## TODO - MVP 0.1
- [x] Display countdown
- [ ] Hard-code settings
  - [x] start of day
  - [x] end of day
  - [x] total break time
  - [x] total scheduled time

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
* maybe: show different categories of time in different colors, for example, blue for clear, red for meetings, purple for breaks that might be optional, and have these stacked, so not just your free time
* Tech: Standalone app (Electron? React Native?)
* Be able to have as a component on a separate dashboard
* Different layouts?
  * Just available time
  * Available time plus other types of time
  * Available time above a line, other types below the line
* What if able to show a week? How much time for each day for 7 days?
  