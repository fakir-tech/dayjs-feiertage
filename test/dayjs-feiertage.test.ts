import { describe, it, expect, beforeAll, afterEach } from "vitest";
import dayjs from "dayjs";
import dayjsFeiertage from "../src/dayjs-feiertage";

beforeAll(() => {
  dayjs.extend(dayjsFeiertage);
});

afterEach(() => {
  // Reset language to German after each test
  dayjs.setHolidayLanguage("de");
});

describe("dayjs-feiertage plugin", () => {
  describe("isHoliday()", () => {
    it("detects Christmas (Dec 25) as holiday in BUND", () => {
      expect(dayjs("2025-12-25").isHoliday("BUND")).toBe(true);
    });

    it("detects New Year's Day as holiday", () => {
      expect(dayjs("2025-01-01").isHoliday("BUND")).toBe(true);
    });

    it("returns false for regular weekday", () => {
      expect(dayjs("2025-07-15").isHoliday("BUND")).toBe(false);
    });

    it("detects regional holiday (Heilige Drei Könige) in BW", () => {
      expect(dayjs("2025-01-06").isHoliday("BW")).toBe(true);
    });

    it("does not detect regional holiday in non-applicable region", () => {
      // Heilige Drei Könige is not a holiday in Niedersachsen
      expect(dayjs("2025-01-06").isHoliday("NI")).toBe(false);
    });

    it("works with ALL region", () => {
      expect(dayjs("2025-12-25").isHoliday("ALL")).toBe(true);
    });
  });

  describe("isSunOrHoliday()", () => {
    it("returns true for Sunday", () => {
      // January 26, 2025 is a Sunday
      expect(dayjs("2025-01-26").isSunOrHoliday("BUND")).toBe(true);
    });

    it("returns true for holiday on weekday", () => {
      // December 25, 2025 is a Thursday and a holiday
      expect(dayjs("2025-12-25").isSunOrHoliday("BUND")).toBe(true);
    });

    it("returns false for regular weekday", () => {
      // January 27, 2025 is a Monday
      expect(dayjs("2025-01-27").isSunOrHoliday("BUND")).toBe(false);
    });
  });

  describe("isSpecificHoliday()", () => {
    it("correctly identifies Christi Himmelfahrt", () => {
      // Christi Himmelfahrt 2025 is May 29
      expect(
        dayjs("2025-05-29").isSpecificHoliday("CHRISTIHIMMELFAHRT", "ALL")
      ).toBe(true);
    });

    it("returns false when date is wrong holiday", () => {
      expect(
        dayjs("2025-12-25").isSpecificHoliday("CHRISTIHIMMELFAHRT", "ALL")
      ).toBe(false);
    });

    it("correctly identifies Karfreitag", () => {
      // Karfreitag 2025 is April 18
      expect(dayjs("2025-04-18").isSpecificHoliday("KARFREITAG", "BUND")).toBe(
        true
      );
    });

    it("correctly identifies Tag der Deutschen Einheit", () => {
      expect(
        dayjs("2025-10-03").isSpecificHoliday("DEUTSCHEEINHEIT", "BUND")
      ).toBe(true);
    });

    it("uses ALL as default region", () => {
      expect(dayjs("2025-10-03").isSpecificHoliday("DEUTSCHEEINHEIT")).toBe(
        true
      );
    });
  });

  describe("getHolidayByDate()", () => {
    it("returns Holiday object for Christmas", () => {
      const holiday = dayjs("2025-12-25").getHolidayByDate("BUND");
      expect(holiday).toBeDefined();
      expect(holiday?.name).toBe("ERSTERWEIHNACHTSFEIERTAG");
    });

    it("returns undefined for non-holiday", () => {
      const holiday = dayjs("2025-07-15").getHolidayByDate("BUND");
      expect(holiday).toBeUndefined();
    });

    it("holiday object has translate function", () => {
      const holiday = dayjs("2025-12-25").getHolidayByDate("BUND");
      expect(holiday?.translate("de")).toBe("1. Weihnachtstag");
    });

    it("holiday object has dateString property", () => {
      const holiday = dayjs("2025-12-25").getHolidayByDate("BUND");
      expect(holiday?.dateString).toBe("2025-12-25");
    });

    it("uses ALL as default region", () => {
      const holiday = dayjs("2025-12-25").getHolidayByDate();
      expect(holiday).toBeDefined();
      expect(holiday?.name).toBe("ERSTERWEIHNACHTSFEIERTAG");
    });
  });

  describe("getHolidaysOfYear()", () => {
    it("returns array of holidays for BUND", () => {
      const holidays = dayjs("2025-06-15").getHolidaysOfYear("BUND");
      expect(Array.isArray(holidays)).toBe(true);
      expect(holidays.length).toBeGreaterThan(0);
    });

    it("BUND has 9 nationwide holidays", () => {
      const holidays = dayjs("2025-01-01").getHolidaysOfYear("BUND");
      expect(holidays.length).toBe(9);
    });

    it("ALL region has more holidays than BUND", () => {
      const bundHolidays = dayjs("2025-01-01").getHolidaysOfYear("BUND");
      const allHolidays = dayjs("2025-01-01").getHolidaysOfYear("ALL");
      expect(allHolidays.length).toBeGreaterThan(bundHolidays.length);
    });

    it("holidays have required properties", () => {
      const holidays = dayjs("2025-01-01").getHolidaysOfYear("BUND");
      const holiday = holidays[0];
      expect(holiday).toHaveProperty("name");
      expect(holiday).toHaveProperty("date");
      expect(holiday).toHaveProperty("dateString");
      expect(holiday).toHaveProperty("regions");
      expect(holiday).toHaveProperty("translate");
    });

    it("uses the year from the dayjs instance", () => {
      const holidays2024 = dayjs("2024-06-15").getHolidaysOfYear("BUND");
      const holidays2025 = dayjs("2025-06-15").getHolidaysOfYear("BUND");

      // Christi Himmelfahrt dates differ between years (Easter-dependent)
      const himmelfahrt2024 = holidays2024.find(
        (h) => h.name === "CHRISTIHIMMELFAHRT"
      );
      const himmelfahrt2025 = holidays2025.find(
        (h) => h.name === "CHRISTIHIMMELFAHRT"
      );

      expect(himmelfahrt2024?.dateString).not.toBe(himmelfahrt2025?.dateString);
    });
  });

  describe("static methods", () => {
    describe("setHolidayLanguage() / getHolidayLanguage()", () => {
      it("gets default language", () => {
        expect(dayjs.getHolidayLanguage()).toBe("de");
      });

      it("sets and gets language", () => {
        dayjs.setHolidayLanguage("en");
        expect(dayjs.getHolidayLanguage()).toBe("en");
      });
    });

    describe("addHolidayTranslation()", () => {
      it("adds custom translation", () => {
        dayjs.addHolidayTranslation("en", {
          NEUJAHRSTAG: "New Year's Day",
          ERSTERWEIHNACHTSFEIERTAG: "Christmas Day",
        });
        dayjs.setHolidayLanguage("en");

        const holiday = dayjs("2025-12-25").getHolidayByDate("BUND");
        expect(holiday?.translate("en")).toBe("Christmas Day");
      });
    });
  });

  describe("edge cases", () => {
    it("handles leap year correctly", () => {
      // 2024 is a leap year, Feb 29 is not a holiday
      expect(dayjs("2024-02-29").isHoliday("BUND")).toBe(false);
    });

    it("works with Date object input", () => {
      expect(dayjs(new Date(2025, 11, 25)).isHoliday("BUND")).toBe(true);
    });

    it("works with ISO string with time", () => {
      expect(dayjs("2025-12-25T12:00:00").isHoliday("BUND")).toBe(true);
    });

    it("handles year boundaries - New Year's Eve is not a holiday", () => {
      expect(dayjs("2025-12-31").isHoliday("BUND")).toBe(false);
    });

    it("handles year boundaries - New Year's Day is a holiday", () => {
      expect(dayjs("2026-01-01").isHoliday("BUND")).toBe(true);
    });
  });
});
