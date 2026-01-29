import type { PluginFunc } from "dayjs";
import {
  getHolidays,
  getHolidayByDate,
  Holiday,
  HolidayType,
  isHoliday,
  isSpecificHoliday,
  isSunOrHoliday,
  Region,
  addTranslation,
  setLanguage,
  getLanguage,
} from "feiertagejs";

// Re-export types for consumers
export type { Holiday, HolidayType, Region } from "feiertagejs";

// Region constants for type-safe usage (instead of string literals)
export const Regions = {
  BW: "BW",
  BY: "BY",
  BE: "BE",
  BB: "BB",
  HB: "HB",
  HE: "HE",
  HH: "HH",
  MV: "MV",
  NI: "NI",
  NW: "NW",
  RP: "RP",
  SL: "SL",
  SN: "SN",
  ST: "ST",
  SH: "SH",
  TH: "TH",
  BUND: "BUND",
  AUGSBURG: "AUGSBURG",
  ALL: "ALL",
} as const satisfies Record<string, Region>;

// Holiday type constants for type-safe usage (instead of string literals)
export const HolidayTypes = {
  NEUJAHRSTAG: "NEUJAHRSTAG",
  HEILIGEDREIKOENIGE: "HEILIGEDREIKOENIGE",
  KARFREITAG: "KARFREITAG",
  OSTERSONNTAG: "OSTERSONNTAG",
  OSTERMONTAG: "OSTERMONTAG",
  TAG_DER_ARBEIT: "TAG_DER_ARBEIT",
  CHRISTIHIMMELFAHRT: "CHRISTIHIMMELFAHRT",
  MARIAHIMMELFAHRT: "MARIAHIMMELFAHRT",
  PFINGSTSONNTAG: "PFINGSTSONNTAG",
  PFINGSTMONTAG: "PFINGSTMONTAG",
  FRONLEICHNAM: "FRONLEICHNAM",
  DEUTSCHEEINHEIT: "DEUTSCHEEINHEIT",
  REFORMATIONSTAG: "REFORMATIONSTAG",
  ALLERHEILIGEN: "ALLERHEILIGEN",
  BUBETAG: "BUBETAG",
  ERSTERWEIHNACHTSFEIERTAG: "ERSTERWEIHNACHTSFEIERTAG",
  ZWEITERWEIHNACHTSFEIERTAG: "ZWEITERWEIHNACHTSFEIERTAG",
} as const satisfies Record<string, HolidayType>;

// TranslationTable type (partial record of HolidayType to string)
export type TranslationTable = Partial<Record<HolidayType, string>>;

// Augment dayjs module with plugin methods
declare module "dayjs" {
  interface Dayjs {
    /**
     * Check if the date is a holiday in the specified region
     * @param region - Use {@link Regions} constants (e.g. Regions.BY, Regions.BUND)
     */
    isHoliday(region: Region): boolean;

    /**
     * Check if the date is a Sunday or a holiday in the specified region
     * @param region - Use {@link Regions} constants (e.g. Regions.BY, Regions.BUND)
     */
    isSunOrHoliday(region: Region): boolean;

    /**
     * Check if the date is a specific holiday
     * @param holidayName - Use {@link HolidayTypes} constants (e.g. HolidayTypes.CHRISTIHIMMELFAHRT)
     * @param region - Use {@link Regions} constants; defaults to Regions.ALL
     */
    isSpecificHoliday(holidayName: HolidayType, region?: Region): boolean;

    /**
     * Get the holiday object for this date if it is a holiday
     * @param region - Use {@link Regions} constants; defaults to Regions.ALL
     */
    getHolidayByDate(region?: Region): Holiday | undefined;

    /**
     * Get all holidays for the year of this date
     * @param region - Use {@link Regions} constants (e.g. Regions.BUND)
     */
    getHolidaysOfYear(region: Region): Holiday[];
  }

  // Static methods on dayjs
  interface DayjsStatic {
    /**
     * Add a translation for holiday names
     * @param isoCode - Language code (e.g., 'en', 'fr')
     * @param translation - Map of HolidayType to translated string
     */
    addHolidayTranslation(isoCode: string, translation: TranslationTable): void;

    /**
     * Set the default language for holiday translations
     * @param lng - Language code (e.g., 'de', 'en')
     */
    setHolidayLanguage(lng: string): void;

    /**
     * Get the currently set language for holiday translations
     */
    getHolidayLanguage(): string;
  }
}

// Define the interface for dayjsFactory to include static methods
interface DayjsFactory {
  addHolidayTranslation: (isoCode: string, translation: TranslationTable) => void;
  setHolidayLanguage: (lng: string) => void;
  getHolidayLanguage: () => string;
}

const dayjsFeiertage: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  // Instance methods
  dayjsClass.prototype.isHoliday = function (region: Region): boolean {
    return isHoliday(this.toDate(), region);
  };

  dayjsClass.prototype.isSunOrHoliday = function (region: Region): boolean {
    return isSunOrHoliday(this.toDate(), region);
  };

  dayjsClass.prototype.isSpecificHoliday = function (
    holidayName: HolidayType,
    region: Region = Regions.ALL
  ): boolean {
    return isSpecificHoliday(this.toDate(), holidayName, region);
  };

  dayjsClass.prototype.getHolidayByDate = function (
    region: Region = Regions.ALL
  ): Holiday | undefined {
    return getHolidayByDate(this.toDate(), region) || undefined;
  };

  dayjsClass.prototype.getHolidaysOfYear = function (region: Region): Holiday[] {
    return getHolidays(this.year(), region);
  };

  // Static methods on dayjs factory
  const factory = dayjsFactory as unknown as DayjsFactory;

  factory.addHolidayTranslation = (
    isoCode: string,
    translation: TranslationTable
  ): void => {
    addTranslation(isoCode, translation);
  };

  factory.setHolidayLanguage = (lng: string): void => {
    setLanguage(lng);
  };

  factory.getHolidayLanguage = (): string => {
    return getLanguage();
  };
};

export default dayjsFeiertage;
