import dayjs from "dayjs";
import dayjsFeiertage from "../src/dayjs-feiertage";

test("it detects an holiday correctly", () => {
  dayjs.extend(dayjsFeiertage);
  const result = dayjs("2020-12-25").isHoliday("BUND");
  expect(result).toBe(true);
});
