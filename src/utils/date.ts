import moment from 'moment';

// @ts-ignore
export function getDate(date) {
  if (!date) {
    return new Date();
  }

  if (date instanceof Date) {
    return date;
  }

  return moment(date).toDate();
}

// @ts-ignore
export function modeIs24Hour(format) {
  return !!format.match(/H|k/);
}
