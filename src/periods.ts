import { Temporal } from "temporal-polyfill";

export const periods = {
  day: {
    start: Temporal.PlainTime.from("00:00:00"),
    end: Temporal.PlainTime.from("23:59:59"),
    color: "#FFFFFF",
  },
  pre: {
    start: Temporal.PlainTime.from("00:00:00"),
    end: Temporal.PlainTime.from("06:59:59"),
    color: "#000000",
  },
  early: {
    start: Temporal.PlainTime.from("07:00:00"),
    end: Temporal.PlainTime.from("08:59:59"),
    color: "#FFA500", //
  },
  prime: {
    start: Temporal.PlainTime.from("09:00:00"),
    end: Temporal.PlainTime.from("16:59:59"),
    color: "#00FF00",
  },
  late: {
    start: Temporal.PlainTime.from("17:00:00"),
    end: Temporal.PlainTime.from("22:59:59"),
    color: "#0000FF",
  },
  after: {
    start: Temporal.PlainTime.from("23:00:00"),
    end: Temporal.PlainTime.from("23:59:59"),
    color: "#FF0000",
  },
};
