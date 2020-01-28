import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  DatePickerAndroid,
  TimePickerAndroid,
  Keyboard,
} from 'react-native';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

import { Touchable } from '../common';
import { getDate, modeIs24Hour } from '../../utils/date';
import { isFunction } from '../../utils/common';

const FORMATS = {
  date: 'LL',
  datetime: 'YYYY-MM-DD LT',
  time: 'LT',
};

// @ts-ignore
@withTranslation('datePicker')
class MyDatePickerAndroid extends Component {
  state = {
    // @ts-ignore
    date: getDate(this.props.date),
  };

  // @ts-ignore
  UNSAFE_componentWillReceiveProps({ date }) {
    // @ts-ignore
    if (date !== this.props.date) {
      this.setState({ date: getDate(date) });
    }
  }

  onPressCancel = () => {
    // @ts-ignore
    const { onCloseModal } = this.props;

    isFunction(onCloseModal) && onCloseModal();
  };

  datePicked() {
    // @ts-ignore
    const { onDateChange } = this.props;
    const { date } = this.state;

    isFunction(onDateChange) && onDateChange(date);
  }

  async showPicker() {
    // @ts-ignore
    const { mode } = this.props;

    const today = moment();
    let dateTimeSelections;

    switch (mode) {
      case 'date':
        dateTimeSelections = await this.launchDatePicker();
        break;
      case 'time':
        dateTimeSelections = await this.launchTimePicker();
        break;
      case 'datetime':
        dateTimeSelections = await this.launchDateThenTimePicker();
        break;
      default:
        dateTimeSelections = {};
    }

    const {
      action,
      // @ts-ignore
      year = today.year(),
      // @ts-ignore
      month = today.month(),
      // @ts-ignore
      day = today.date(),
      // @ts-ignore
      hour = today.hour(),
      // @ts-ignore
      minute = today.minutes(),
    } = dateTimeSelections;

    if (action === DatePickerAndroid.dismissedAction) {
      return this.onPressCancel();
    }

    this.setState({
      date: new Date(year, month, day, hour, minute),
    });
    return this.datePicked();
  }

  launchDatePicker() {
    // @ts-ignore
    const { androidDateMode, minDate, maxDate } = this.props;

    return DatePickerAndroid.open({
      date: this.state.date,
      minDate: minDate && getDate(minDate),
      maxDate: maxDate && getDate(maxDate),
      mode: androidDateMode,
    });
  }

  launchTimePicker() {
    const {
      // @ts-ignore
      androidTimeMode,
      // @ts-ignore
      mode,
      // @ts-ignore
      format = FORMATS[mode],
      // @ts-ignore
      is24Hour = modeIs24Hour(format),
    } = this.props;

    const timeMoment = moment(this.state.date);

    return TimePickerAndroid.open({
      hour: timeMoment.hour(),
      minute: timeMoment.minutes(),
      is24Hour,
      mode: androidTimeMode,
    });
  }

  async launchDateThenTimePicker() {
    const {
      action: dateAction,
      // @ts-ignore
      year,
      // @ts-ignore
      month,
      // @ts-ignore
      day,
    } = await this.launchDatePicker();

    if (dateAction === DatePickerAndroid.dismissedAction) {
      return { action: dateAction };
    }

    // @ts-ignore
    const { action: timeAction, hour, minute } = await this.launchTimePicker();

    return { action: timeAction, year, month, day, hour, minute };
  }

  onPressDate = () => {
    // @ts-ignore
    const { disabled, onPressAndroid, date } = this.props;

    if (disabled) {
      return true;
    }

    Keyboard.dismiss();

    this.setState({
      date: getDate(date),
    });

    return isFunction(onPressAndroid)
      ? onPressAndroid({ showPicker: this.showPicker })
      : this.showPicker();
  };

  render() {
    const { children } = this.props;

    return (
      <View>
        <Touchable onPress={this.onPressDate}>{children}</Touchable>
      </View>
    );
  }
}

// @ts-ignore
MyDatePickerAndroid.defaultProps = {
  mode: 'date',
  androidDateMode: 'default',
  androidTimeMode: 'spinner',
  date: '',
  disabled: false,
};

// @ts-ignore
MyDatePickerAndroid.propTypes = {
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  androidDateMode: PropTypes.oneOf(['calendar', 'spinner', 'default']),
  androidTimeMode: PropTypes.oneOf(['clock', 'spinner', 'default']),
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.object,
  ]),
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  disabled: PropTypes.bool,
  onDateChange: PropTypes.func,
  onCloseModal: PropTypes.func,
  is24Hour: PropTypes.bool,
  onPressAndroid: PropTypes.func,
  children: PropTypes.element,
};

export default MyDatePickerAndroid;
