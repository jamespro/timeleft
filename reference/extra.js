import { Temporal } from "temporal-polyfill";
/*
// set the variables for all of the periods and start and end times in javascript:
const timePeriods = ["early", "prime", "late"]; // set the variables for all of the periods and start and end times in javascript:

function getCurrentTime() {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${hour}:${minute}:${second}`;
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

*/

function debugTimes() {
  console.log("Since:");
  console.warn(
    `periodStart since now: ${Temporal.Duration.from(
      periodStart.since(now)
    ).total("seconds")}`
  );
  console.warn(
    `periodEnd since now: ${Temporal.Duration.from(periodEnd.since(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `dayStart since now: ${Temporal.Duration.from(dayStart.since(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `earlyStart since now: ${Temporal.Duration.from(
      earlyStart.since(now)
    ).total("seconds")}`
  );
  console.warn(
    `earlyEnd since now: ${Temporal.Duration.from(earlyEnd.since(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `primeStart since now: ${Temporal.Duration.from(
      primeStart.since(now)
    ).total("seconds")}`
  );
  console.warn(
    `primeEnd since now: ${Temporal.Duration.from(primeEnd.since(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `lateStart since now: ${Temporal.Duration.from(lateStart.since(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `lateEnd since now: ${Temporal.Duration.from(lateEnd.since(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `dayEnd since now: ${Temporal.Duration.from(dayEnd.since(now)).total(
      "seconds"
    )}`
  );

  console.log("Until:");
  console.warn(
    `periodStart until now: ${Temporal.Duration.from(
      periodStart.until(now)
    ).total("seconds")}`
  );
  console.warn(
    `periodEnd until now: ${Temporal.Duration.from(periodEnd.until(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `dayStart until now: ${Temporal.Duration.from(dayStart.until(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `earlyStart until now: ${Temporal.Duration.from(
      earlyStart.until(now)
    ).total("seconds")}`
  );
  console.warn(
    `earlyEnd until now: ${Temporal.Duration.from(earlyEnd.until(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `primeStart until now: ${Temporal.Duration.from(
      primeStart.until(now)
    ).total("seconds")}`
  );
  console.warn(
    `primeEnd until now: ${Temporal.Duration.from(primeEnd.until(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `lateStart until now: ${Temporal.Duration.from(lateStart.until(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `lateEnd until now: ${Temporal.Duration.from(lateEnd.until(now)).total(
      "seconds"
    )}`
  );
  console.warn(
    `dayEnd until now: ${Temporal.Duration.from(dayEnd.until(now)).total(
      "seconds"
    )}`
  );

  // Subgoal: Is the duration of time from now until primeStart a negative number?
  // Subgoal: If so, set periodStart to primeStart.

  // Subgoal: Is the time from now until primeEnd a positive number?
  // Subgoal: If so, set periodEnd to primeEnd.

  // define a variable as the Duration since periodStart until now?
  // log periodStart and periodEnd before the function
  console.log(`periodStart: ${periodStart.toString()}`);
  console.log(`periodEnd: ${periodEnd.toString()}`);
}

adjustPeriods(nowTime);

function adjustPeriods(time: Temporal.PlainTime): void {
  // if (!(time instanceof Temporal.PlainTime)) {
  //   console.log("time is not a Temporal.PlainTime object");
  //   throw new Error(
  //     "Invalid parameter: time must be a Temporal.PlainTime object"
  //   );
  // }
  // if (!(earlyStart instanceof Temporal.PlainTime)) {
  //   console.log("earlyStart is not a Temporal.PlainTime object");
  //   throw new Error(
  //     "Invalid parameter: earlyStart must be a Temporal.PlainTime object"
  //   );
  // }

  // adjustStart
  // compare periodStart to earlyStart
  // if periodStart is less than earlyStart, set periodStart to earlyStart
  if (
    Temporal.Duration.from(periodStart.since(now)).total("milliseconds") <
    Temporal.Duration.from(earlyStart.since(now)).total("milliseconds")
  ) {
    periodStart = earlyStart;
  }
  // compare periodStart to primeStart
  // if periodStart is less than primeStart, set periodStart to primeStart
  if (
    Temporal.Duration.from(periodStart.since(now)).total("milliseconds") <
    Temporal.Duration.from(primeStart.since(now)).total("milliseconds")
  ) {
    periodStart = primeStart;
  }
  // compare periodStart to lateStart
  // if periodStart is less than lateStart, set periodStart to lateStart

  if (
    Temporal.Duration.from(periodStart.since(now)).total("milliseconds") <
    Temporal.Duration.from(lateStart.since(now)).total("milliseconds")
  ) {
    periodStart = lateStart;
  }
  // adjustEnd
}
