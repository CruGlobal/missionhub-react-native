import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

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

function getMomentDate(date) {
  if (isString(date) && date.indexOf('UTC') >= 0) {
    return momentUtc(date).local();
  }
  return moment(date);
}
function isYesterday(momentDate) {
  return momentDate.isSame(moment().subtract(1, 'days'), 'day');
}
function isToday(momentDate) {
  return momentDate.isSame(moment(), 'day');
}
function inLastWeek(momentDate) {
  return momentDate.isBetween(
    moment().subtract(7, 'days'),
    moment(),
    'day',
    '[]',
  );
}

function formatComment(date, t) {
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

@withTranslation()
export default class DateComponent extends Component {
  render() {
    const { t, date, format, style } = this.props;
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
  }
}

DateComponent.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  format: PropTypes.string,
};

DateComponent.defaultProps = {
  format: 'ddd, lll',
};

const relativeFormat = date => {
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
