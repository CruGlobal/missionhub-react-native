import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import moment, * as MomentTypes from 'moment';
import { useTranslation } from 'react-i18next';

import { isString, momentUtc } from '../../utils/common';
import Text from '../Text';

export const DateConstants = {
  today: 'today',
  yesterday: 'yesterday',
  comment: 'comment',
  relative: 'relative',
  Formats: {
    dayOnly: 'dddd',
    dayMonthDate: 'dddd, MMMM D',
    fullDate: 'dddd, MMMM D YYYY',
    monthDayYearAtTime: 'MMMM D, YYYY @ h:mm A',
    monthDayAtTime: 'MMMM D @ h:mm A',
    dayAtTime: 'dddd @ h:mm A',
    timeOnly: 'h:mm A',
  },
};

function getMomentDate(date: string | Date) {
  // This ts-ignore can be removed once the utils/common file is converted to typescript
  // @ts-ignore:
  if (isString(date) && date.indexOf('UTC') >= 0) {
    return momentUtc(date).local();
  }
  return moment(date);
}

function isYesterday(momentDate: MomentTypes.Moment) {
  return momentDate.isSame(moment().subtract(1, 'days'), 'day');
}

function isToday(momentDate: MomentTypes.Moment) {
  return momentDate.isSame(moment(), 'day');
}

function inLastWeek(momentDate: MomentTypes.Moment) {
  return momentDate.isBetween(
    moment().subtract(7, 'days'),
    moment(),
    'day',
    '[]',
  );
}

function formatComment(date: string | Date, t: Function) {
  const momentDate = getMomentDate(date);
  const now = moment();
  if (isToday(momentDate)) {
    return momentDate.format(DateConstants.Formats.timeOnly);
  }
  // Check if yesterday
  if (isYesterday(momentDate)) {
    return `${t('dates.yesterday')} @ ${momentDate.format(
      DateConstants.Formats.timeOnly,
    )}`;
  }
  // Check if within the last week
  if (inLastWeek(momentDate)) {
    return momentDate.format(DateConstants.Formats.dayAtTime);
  }
  if (momentDate.year() !== now.year()) {
    return momentDate.format(DateConstants.Formats.monthDayYearAtTime);
  }
  return momentDate.format(DateConstants.Formats.monthDayAtTime);
}

interface DateComponentProps {
  date: string | Date;
  format?: string;
  style?: StyleProp<TextStyle>;
}

const relativeFormat = (date: string | Date) => {
  const today = moment();
  const other = getMomentDate(date);
  if (other.isSame(today, 'year')) {
    if (inLastWeek(other)) {
      if (isYesterday(other)) {
        return DateConstants.yesterday;
      }
      if (isToday(other)) {
        return DateConstants.today;
      }
      return DateConstants.Formats.dayOnly;
    }
    return DateConstants.Formats.dayMonthDate;
  }
  return DateConstants.Formats.fullDate;
};

const DateComponent = ({
  date,
  format = 'ddd, lll',
  style,
}: DateComponentProps) => {
  const { t } = useTranslation();
  const { relative, yesterday, comment, today } = DateConstants;
  let dateFormat = format;
  if (format === relative) {
    dateFormat = relativeFormat(date);
  }
  let text;
  if (dateFormat === today) {
    text = t('dates.today');
  } else if (dateFormat === yesterday) {
    text = t('dates.yesterday');
  } else if (dateFormat === comment) {
    text = formatComment(date, t);
  } else {
    text = getMomentDate(date).format(dateFormat);
  }
  return <Text style={style}>{text}</Text>;
};

export default DateComponent;
