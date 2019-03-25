/* eslint max-params: 0 */
import moment from 'moment';

export function getDate(date, minDate, maxDate, format) {
  if (!date) {
    const now = new Date();
    if (minDate) {
      const _minDate = getDate(minDate);

      if (now < _minDate) {
        return _minDate;
      }
    }

    if (maxDate) {
      const _maxDate = getDate(maxDate);

      if (now > _maxDate) {
        return _maxDate;
      }
    }

    return now;
  }

  if (date instanceof Date) {
    return date;
  }

  return moment(date, format).toDate();
}

export function modeIs24Hour(format) {
  return !format.match(/h|a/);
}
