# dayjs-feiertage

A dayjs plugin for German holidays (Feiertage) using [feiertagejs](https://github.com/sfakir/feiertagejs).

## Installation

```bash
# pnpm
pnpm add dayjs-feiertage dayjs

# npm
npm install dayjs-feiertage dayjs

# yarn
yarn add dayjs-feiertage dayjs
```

## Quick Start

```javascript
import dayjs from "dayjs";
import dayjsFeiertage from "dayjs-feiertage";

// Extend dayjs with the plugin
dayjs.extend(dayjsFeiertage);

// Check if a date is a holiday
dayjs("2025-12-25").isHoliday("BUND"); // true

// Check if a date is a Sunday or holiday
dayjs("2025-12-25").isSunOrHoliday("BUND"); // true

// Get all holidays for a year
dayjs("2025-01-01").getHolidaysOfYear("BY"); // Array of Holiday objects
```

## API Reference

### Instance Methods

#### `isHoliday(region: Region): boolean`

Check if the date is a holiday in the specified region.

```javascript
dayjs("2025-12-25").isHoliday("BUND"); // true - Christmas
dayjs("2025-01-06").isHoliday("BW"); // true - Heilige Drei Könige (Baden-Württemberg)
dayjs("2025-01-06").isHoliday("NI"); // false - Not a holiday in Niedersachsen
```

#### `isSunOrHoliday(region: Region): boolean`

Check if the date is a Sunday or a holiday in the specified region.

```javascript
dayjs("2025-01-26").isSunOrHoliday("BUND"); // true - Sunday
dayjs("2025-12-25").isSunOrHoliday("BUND"); // true - Holiday
dayjs("2025-01-27").isSunOrHoliday("BUND"); // false - Regular Monday
```

#### `isSpecificHoliday(holidayName: HolidayType, region?: Region): boolean`

Check if the date is a specific holiday. Region defaults to "ALL".

```javascript
dayjs("2025-05-29").isSpecificHoliday("CHRISTIHIMMELFAHRT"); // true
dayjs("2025-12-25").isSpecificHoliday("ERSTERWEIHNACHTSFEIERTAG", "BUND"); // true
dayjs("2025-10-03").isSpecificHoliday("DEUTSCHEEINHEIT"); // true
```

#### `getHolidayByDate(region?: Region): Holiday | undefined`

Get the holiday object for this date. Returns `undefined` if not a holiday. Region defaults to "ALL".

```javascript
const holiday = dayjs("2025-12-25").getHolidayByDate("BUND");
console.log(holiday?.name); // "ERSTERWEIHNACHTSFEIERTAG"
console.log(holiday?.translate("de")); // "Erster Weihnachtsfeiertag"
console.log(holiday?.dateString); // "2025-12-25"
```

#### `getHolidaysOfYear(region: Region): Holiday[]`

Get all holidays for the year of this date in the specified region.

```javascript
const holidays = dayjs("2025-01-01").getHolidaysOfYear("BUND");
holidays.forEach((h) => {
  console.log(`${h.dateString}: ${h.translate("de")}`);
});
```

### Static Methods

#### `dayjs.addHolidayTranslation(isoCode: string, translation: TranslationTable): void`

Add custom translations for holiday names.

```javascript
dayjs.addHolidayTranslation("en", {
  NEUJAHRSTAG: "New Year's Day",
  ERSTERWEIHNACHTSFEIERTAG: "Christmas Day",
  CHRISTIHIMMELFAHRT: "Ascension Day",
});
```

#### `dayjs.setHolidayLanguage(lng: string): void`

Set the default language for holiday translations.

```javascript
dayjs.setHolidayLanguage("en");
```

#### `dayjs.getHolidayLanguage(): string`

Get the currently set language.

```javascript
console.log(dayjs.getHolidayLanguage()); // "de"
```

## Types

### Region

German state codes and special regions:

| Code      | State/Region                  |
| --------- | ----------------------------- |
| `BW`      | Baden-Württemberg             |
| `BY`      | Bavaria (Bayern)              |
| `BE`      | Berlin                        |
| `BB`      | Brandenburg                   |
| `HB`      | Bremen                        |
| `HH`      | Hamburg                       |
| `HE`      | Hesse (Hessen)                |
| `MV`      | Mecklenburg-Vorpommern        |
| `NI`      | Lower Saxony (Niedersachsen)  |
| `NW`      | North Rhine-Westphalia        |
| `RP`      | Rhineland-Palatinate          |
| `SL`      | Saarland                      |
| `SN`      | Saxony (Sachsen)              |
| `ST`      | Saxony-Anhalt                 |
| `SH`      | Schleswig-Holstein            |
| `TH`      | Thuringia (Thüringen)         |
| `BUND`    | Nationwide holidays only      |
| `ALL`     | All holidays (any region)     |
| `AUGSBURG`| City of Augsburg              |

### HolidayType

Available holiday identifiers:

- `NEUJAHRSTAG` - New Year's Day
- `HEILIGEDREIKOENIGE` - Epiphany
- `KARFREITAG` - Good Friday
- `OSTERSONNTAG` - Easter Sunday
- `OSTERMONTAG` - Easter Monday
- `TAG_DER_ARBEIT` - Labour Day
- `CHRISTIHIMMELFAHRT` - Ascension Day
- `PFINGSTSONNTAG` - Whit Sunday
- `PFINGSTMONTAG` - Whit Monday
- `FRONLEICHNAM` - Corpus Christi
- `MARIAHIMMELFAHRT` - Assumption of Mary
- `DEUTSCHEEINHEIT` - German Unity Day
- `REFORMATIONSTAG` - Reformation Day
- `ALLERHEILIGEN` - All Saints' Day
- `BUBETAG` - Day of Repentance and Prayer
- `ERSTERWEIHNACHTSFEIERTAG` - Christmas Day
- `ZWEITERWEIHNACHTSFEIERTAG` - Boxing Day
- `WELTKINDERTAG` - World Children's Day
- `WELTFRAUENTAG` - International Women's Day
- `AUGSBURGER_FRIEDENSFEST` - Augsburg Peace Festival

### Holiday Object

```typescript
interface Holiday {
  name: HolidayType;
  date: Date;
  dateString: string; // YYYY-MM-DD format
  regions: Region[];
  translate(lang?: string): string | undefined;
  equals(date: Date): boolean;
  getNormalizedDate(): number;
}
```

## Timezone Handling

All dates are interpreted in German timezone (Europe/Berlin). The underlying feiertagejs library automatically converts any Date object to German timezone before checking holidays.

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build
pnpm build

# Type check
pnpm lint
```

## License

MIT

## Related

- [feiertagejs](https://github.com/sfakir/feiertagejs) - The underlying library for German holiday calculations
- [dayjs](https://day.js.org/) - Fast 2kB alternative to Moment.js
