import moment from 'moment';

export function getDate(date) {
  if (!date) {
    return new Date();
  }

  if (date instanceof Date) {
    return date;
  }

  return moment(date).toDate();
}

export function modeIs24Hour(format) {
  return format.match(/H|k/);
}
