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
* Pull from external calendar(s), e.g.
  * Google Calendar
  * iCal
  * Outlook
* Settings:
  * What time is the "end" of your day?
  * When are your breaks?
  * What commitments do you have today?

## Plan
* v1: display as countdown timer
* v2: display graphically:
  * as bar, going lower/shorter as time progresses to visualize the time diminishing
  * circle? although I don't like that as much
* Plain JavaScript or React?
* Data storage? 
  * MongoDB (or Firebase)
  * LocalStorage
  * Flat files
  * SQL (host?)
* Auth/login?
  * need logins for calendars?
### Plan: MVP
* countdown timer
* hard-code values:
  * end of day
  * total break time
  * total scheduled time
* only one user
* no calendar login 

## TODO - MVP 0.1
- [ ] Display current date and time
- [ ] Hard-code settings
  - [ ] end of day
  - [ ] total break time
  - [ ] total scheduled time
- [ ] Display countdown

### TODO - MVP 0.2
- [ ] Form to enter settings
- [ ] Settings: Basic:
  - [ ] end of day
  - [ ] total break time
  - [ ] total scheduled time

## TODO - v2


# Future/Maybe
* maybe: show different categories of time in different colors, for example, blue for clear, red for meetings, purple for breaks that might be optional, and have these stacked, so not just your free time
* Tech: Standalone app (Electron? React Native?)
* Be able to have as a component on a separate dashboard
  