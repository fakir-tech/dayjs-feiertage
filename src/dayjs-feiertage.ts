import {
  getHolidays,
  Holiday,
  HolidayType,
  isHoliday,
  isSpecificHoliday,
  isSunOrHoliday,
  Region,
} from "feiertagejs";

// add custom plugin to dayjs' types
declare module "dayjs" {
  interface Dayjs {
    isSunOrHoliday(region: Region): boolean;
    isHoliday(region: Region): boolean;
    isSpecificHoliday(holidayName: string, region: Region): boolean;
    getHolidaysOfYear(region: Region): Holiday[];
    
  }
}

export default (option = {}, dayjsClass) => {
  dayjsClass.prototype.isHoliday = function (region: Region | null): boolean {
    return isHoliday(this.toDate(), region);
  };
  dayjsClass.prototype.isSpecificHoliday = function (
    holidayName: HolidayType,
    region: Region
  ) {
    return isSpecificHoliday(this.toDate(), holidayName, region);
  };
  dayjsClass.prototype.isSunOrHoliday = function (region: Region): boolean {
    return isSunOrHoliday(this.toDate(), region);
  };
  dayjsClass.prototype.getHolidaysOfYear = function (
    region: Region
  ): Holiday[] {
    return getHolidays(this.year(), region);
  };
};
