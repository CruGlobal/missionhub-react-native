import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { translate } from 'react-i18next';

import { isString, momentUtc } from '../../utils/common';
import Text from '../Text';

const Constants = {
  today: 'today',
  yesterday: 'yesterday',
  relative: 'relative',
  Formats: {
    dayOnly: 'dddd',
    dayMonthDate: 'dddd, MMMM D',
    fullDate: 'dddd, MMMM D YYYY',
  },
};

@translate()
export default class DateComponent extends Component {
  render() {
    const { t, date, format, ...rest } = this.props;
    const { relative, yesterday, today } = Constants;

    let dateFormat = format;
    if (format === relative) {
      dateFormat = relativeFormat(date);
    }

    let text;
    if (dateFormat === today) {
      text = t('dates.today');
    } else if (dateFormat === yesterday) {
      text = t('dates.yesterday');
    } else if (isString(date) && date.indexOf('UTC') >= 0) {
      text = momentUtc(date)
        .local()
        .format(dateFormat);
    } else {
      text = moment(date).format(dateFormat);
    }
    return <Text {...rest}>{text}</Text>;
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
  const other = momentUtc(date);

  const lastWeek = moment().subtract(7, 'days');
  const yesterday = moment().subtract(1, 'days');

  if (other.isSame(today, 'year')) {
    if (other.isBetween(lastWeek, today, 'day', '[]')) {
      if (other.isSame(yesterday, 'day')) {
        return Constants.yesterday;
      }
      if (other.isSame(today, 'day')) {
        return Constants.today;
      }
      return Constants.Formats.dayOnly;
    }
    return Constants.Formats.dayMonthDate;
  }
  return Constants.Formats.fullDate;
};
