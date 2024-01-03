// import * as dayjs from 'dayjs'
import dayjs from 'dayjs';
import dayjsFeiertage from './src/dayjs-feiertage';

dayjs.extend(dayjsFeiertage);


dayjs('2020-12-25').isHoliday('BUND')


console.log(dayjs('2020-12-25').isHoliday('BUND'));

console.log(dayjs('2020-12-28').isHoliday('BUND'));

console.log(dayjs('2020-12-28').getHolidaysOfYear('BUND'));
