# dayjs-feiertage


This is a wrapperlib for [feiertage.js](https://github.com/sfakir/feiertagejs) for dayjs to access German feiertage easily.


## Installation

- [yarn](https://yarnpkg.com/en/): `yarn add dayjs-feiertage`
- [npm](https://www.npmjs.com/): `npm install dayjs-feiertage`

## Quick Examples

```javascript
import dayjs from 'dayjs';
import dayjsFeiertage from './src/dayjs-feiertage';

dayjs.extend(dayjsFeiertage);

// check if a day is a Holiday (in Germany)
dayjs('2020-12-25').isHoliday('BUND') // true

// check if a day is a specific holiday
dayjs('2020-12-25').isSpecificHoliday( 'CHRISTIHIMMELFAHRT', 'ALL'); //false

// get all holidays of a year
dayjs('2020-12-25').getHolidaysOfYear( 'ALL'); // returns list of Holiday, see next nty
```

One entry of the array contains:

```javascript
[{
    name: 'CHRISTIHIMMELFAHRT',
    date: new Date('2023-05-17T22:00:00.000Z'),
    dateString: '2023-05-18',
    regions: [
      'BW',  'BY',   'BE',
      'BB',  'HB',   'HE',
      'HH',  'MV',   'NI',
      'NW',  'RP',   'SL',
      'SN',  'ST',   'SH',
      'TH',  'BUND', 'AUGSBURG',
      'ALL'
    ],
    translate: [Function: translate],
    getNormalizedDate: [Function: getNormalizedDate],
    equals: [Function: equals]
  }
]

```
## Feedback and Questions

You have two options two give feedback or ask questions:

- Comment the official release [post](https://fakir.tech/de/feiertage-js-deutsche-feiertage-fuer-node-js-und-browser-javascript/)
- Open issues or pullrequests on [github](https://github.com/fakir-tech/dayjs-feiertage)


## Feedback

If you have any questions, feel free to open an issue.
