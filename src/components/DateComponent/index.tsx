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

export type dateFormat =
  | 'LT'
  | 'LL'
  | 'LLL'
  | 'ddd, lll'
  | 'dddd'
  | 'dddd, LL'
  | 'dddd @ LT'
  | 'dddd, MMMM D'
  | 'dddd, MMMM D YYYY'
  | 'MMM D @ LT'
  | 'LL @ LT';

const commentFormat = (date: moment.Moment) =>
  isToday(date)
    ? date.format('LT')
    : isYesterday(date)
    ? `${date.calendar().split(' ')[0]} @ ${date.format('LT')}`
    : inLastWeek(date)
    ? date.format('dddd @ LT')
    : inThisYear(date)
    ? date.format('MMM D @ LT')
    : date.format('LL @ LT');

const relativeFormat = (date: moment.Moment) =>
  isToday(date)
    ? date.calendar().split(' ')[0]
    : isYesterday(date)
    ? date.calendar().split(' ')[0]
    : inLastWeek(date)
    ? date.format('dddd')
    : inThisYear(date)
    ? date.format('dddd, MMMM D')
    : date.format('dddd, MMMM D YYYY');

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
  format = 'ddd, lll',
  relativeFormatting = false,
  commentFormatting = false,
  style,
}: DateComponentProps) => {
  const momentDate = getMomentDate(date);
  const text = relativeFormatting
    ? relativeFormat(momentDate)
    : commentFormatting
    ? commentFormat(momentDate)
    : momentDate.format(format);

  return (
    <Text testID="Text" style={style}>
      {text}
    </Text>
  );
};

export default DateComponent;
