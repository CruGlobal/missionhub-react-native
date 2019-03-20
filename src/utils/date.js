import moment from 'moment';

const FORMATS = {
  date: 'LL',
  datetime: 'YYYY-MM-DD HH:mm',
  time: 'HH:mm',
};

export function getDate(date, minDate, maxDate, mode, format = FORMATS[mode]) {
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

export function modeIs24Hour(mode) {
  return !FORMATS[mode].match(/h|a/);
}
