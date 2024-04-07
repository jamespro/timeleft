import { Temporal } from "temporal-polyfill";

export const periods = {
  day: {
    start: Temporal.PlainTime.from("00:00:00"),
    end: Temporal.PlainTime.from("23:59:59"),
  },
  pre: {
    start: Temporal.PlainTime.from("00:00:00"),
    end: Temporal.PlainTime.from("06:59:59"),
  },
  early: {
    start: Temporal.PlainTime.from("07:00:00"),
    end: Temporal.PlainTime.from("08:59:59"),
  },
  prime: {
    start: Temporal.PlainTime.from("09:00:00"),
    end: Temporal.PlainTime.from("16:59:59"),
  },
  late: {
    start: Temporal.PlainTime.from("17:00:00"),
    end: Temporal.PlainTime.from("22:59:59"),
  },
  after: {
    start: Temporal.PlainTime.from("23:00:00"),
    end: Temporal.PlainTime.from("23:59:59"),
  },
};
