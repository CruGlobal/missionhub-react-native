import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import moment, * as MomentTypes from 'moment';

import { momentUtc } from '../../utils/common';
import Text from '../Text';

function getMomentDate(date: string | Date) {
  if (typeof date === 'string' && date.indexOf('UTC') >= 0) {
    return momentUtc(date).local();
  }
  return moment(date);
}

const isYesterday = (momentDate: MomentTypes.Moment) =>
  momentDate.isSame(moment().subtract(1, 'days'), 'day');

const isToday = (momentDate: moment.Moment) =>
  momentDate.isSame(moment(), 'day');

const inLastWeek = (momentDate: moment.Moment) =>
  momentDate.isBetween(moment().subtract(7, 'days'), moment(), 'day', '[]');

const inThisYear = (momentDate: moment.Moment) =>
  momentDate.isSame(moment(), 'year');

export enum dateFormat {
  dayOnly,
  dayMonthDate,
  fullDate,
  monthDayYearAtTime,
  monthDayAtTime,
  dayAtTime,
  timeOnly,
  dayTime,
}

const formats = {
  [dateFormat.dayOnly]: 'dddd',
  [dateFormat.dayMonthDate]: 'dddd, MMMM D',
  [dateFormat.fullDate]: 'dddd, MMMM D YYYY',
  [dateFormat.monthDayYearAtTime]: 'MMMM D, YYYY @ h:mm A',
  [dateFormat.monthDayAtTime]: 'MMMM D @ h:mm A',
  [dateFormat.dayAtTime]: 'dddd @ h:mm A',
  [dateFormat.timeOnly]: 'h:mm A',
  [dateFormat.dayTime]: 'ddd, lll',
};

const commentFormat = (date: moment.Moment) =>
  isToday(date)
    ? date.format(formats[dateFormat.timeOnly])
    : isYesterday(date)
    ? `${date.calendar().split(' ')[0]} @ ${date.format(
        formats[dateFormat.timeOnly],
      )}`
    : inLastWeek(date)
    ? date.format(formats[dateFormat.dayAtTime])
    : inThisYear(date)
    ? date.format(formats[dateFormat.monthDayAtTime])
    : date.format(formats[dateFormat.monthDayYearAtTime]);

const relativeFormat = (date: moment.Moment) =>
  isToday(date)
    ? date.calendar().split(' ')[0]
    : isYesterday(date)
    ? date.calendar().split(' ')[0]
    : inLastWeek(date)
    ? date.format(formats[dateFormat.dayOnly])
    : inThisYear(date)
    ? date.format(formats[dateFormat.dayMonthDate])
    : date.format(formats[dateFormat.fullDate]);

interface DateComponentProps {
  date: string | Date;
  format?: dateFormat;
  relativeFormatting?: boolean;
  commentFormatting?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const DateComponent = ({
  date,
  format = dateFormat.dayTime,
  relativeFormatting = false,
  commentFormatting = false,
  style,
}: DateComponentProps) => {
  const momentDate = getMomentDate(date);
  const text = relativeFormatting
    ? relativeFormat(momentDate)
    : commentFormatting
    ? commentFormat(momentDate)
    : momentDate.format(formats[format]);

  return (
    <Text testID="Text" style={style}>
      {text}
    </Text>
  );
};

export default DateComponent;
