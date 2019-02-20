/* eslint max-lines: 0, max-lines-per-function: 0, max-params: 0 */

// Based off of https://github.com/xgfe/react-native-datepicker v1.7.2
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Modal,
  DatePickerAndroid,
  TimePickerAndroid,
  DatePickerIOS,
  Animated,
  Keyboard,
} from 'react-native';
import moment from 'moment';
import { translate } from 'react-i18next';

import { Text, Touchable } from '../common';
import { isAndroid, locale, isFunction } from '../../utils/common';

import styles from './styles';

const FORMATS = {
  date: 'LL',
  datetime: 'YYYY-MM-DD HH:mm',
  time: 'HH:mm',
};

@translate('datePicker')
class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.getDate(),
    };
  }

  handlePickDate = () => {};

  handlePickTime = () => {};

  handlePickDateTime = () => {};

  handleChangeDate = () => {};

  getDate(date = this.props.date) {
    const { mode, minDate, maxDate, format = FORMATS[mode] } = this.props;

    if (!date) {
      const now = new Date();
      if (minDate) {
        const _minDate = this.getDate(minDate);

        if (now < _minDate) {
          return _minDate;
        }
      }

      if (maxDate) {
        const _maxDate = this.getDate(maxDate);

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

  launchAndroidPicker = () => {
    if (isAndroid) {
      const {
        disabled,
        mode,
        androidMode,
        format = FORMATS[mode],
        minDate,
        maxDate,
        is24Hour = !format.match(/h|a/),
      } = this.props;

      if (this.props.disabled) {
        return true;
      }

      Keyboard.dismiss();

      const date = this.getDate();

      if (mode === 'date') {
        DatePickerAndroid.open({
          date,
          minDate: minDate && this.getDate(minDate),
          maxDate: maxDate && this.getDate(maxDate),
          mode: androidMode,
        }).then(this.handlePickDate);
      } else if (mode === 'time') {
        const timeMoment = moment(date);

        TimePickerAndroid.open({
          hour: timeMoment.hour(),
          minute: timeMoment.minutes(),
          is24Hour: is24Hour,
          mode: androidMode,
        }).then(this.handlePickTime);
      } else if (mode === 'datetime') {
        DatePickerAndroid.open({
          date,
          minDate: minDate && this.getDate(minDate),
          maxDate: maxDate && this.getDate(maxDate),
          mode: androidMode,
        }).then(this.handlePickDateTime);
      }
    }
  };

  render() {
    const {
      mode,
      minDate,
      maxDate,
      minuteInterval,
      timeZoneOffsetInMinutes,
      customStyles,
    } = this.props;

    const date = this.getDate();

    return isAndroid ? (
      <View flex={1} />
    ) : (
      <DatePickerIOS
        date={date}
        mode={mode}
        minimumDate={minDate && this.getDate(minDate)}
        maximumDate={maxDate && this.getDate(maxDate)}
        onDateChange={this.handleChangeDate}
        minuteInterval={minuteInterval}
        timeZoneOffsetInMinutes={
          timeZoneOffsetInMinutes ? timeZoneOffsetInMinutes : null
        }
        style={[customStyles]}
        locale={locale}
      />
    );
  }
}

DatePicker.defaultProps = {
  mode: 'date',
  androidMode: 'default',
  date: '',
  customStyles: {},
  disabled: false,
};

DatePicker.propTypes = {
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  androidMode: PropTypes.oneOf(['clock', 'calendar', 'spinner', 'default']),
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.object,
  ]),
  format: PropTypes.string,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  customStyles: PropTypes.object,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  is24Hour: PropTypes.bool,
};

export default DatePicker;
