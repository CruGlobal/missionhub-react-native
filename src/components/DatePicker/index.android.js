import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  DatePickerAndroid,
  TimePickerAndroid,
  Keyboard,
} from 'react-native';
import moment from 'moment';
import { translate } from 'react-i18next';

import { Touchable } from '../common';
import { getDate, modeIs24Hour } from '../../utils/date';
import { isFunction } from '../../utils/common';

const FORMATS = {
  date: 'LL',
  datetime: 'YYYY-MM-DD HH:mm',
  time: 'HH:mm',
};

@translate('datePicker')
class MyDatePickerAndroid extends Component {
  state = {
    date: getDate(this.props.date),
  };

  UNSAFE_componentWillReceiveProps({ date }) {
    if (date !== this.props.date) {
      this.setState({ date: getDate(date) });
    }
  }

  onPressCancel = () => {
    const { onCloseModal } = this.props;

    isFunction(onCloseModal) && onCloseModal();
  };

  datePicked() {
    const { onDateChange } = this.props;
    const { date } = this.state;

    isFunction(onDateChange) && onDateChange(date);
  }

  async showPicker() {
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
      year = today.year(),
      month = today.month(),
      day = today.date(),
      hour = today.hour(),
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
    const { androidMode, minDate, maxDate } = this.props;

    return DatePickerAndroid.open({
      date: this.state.date,
      minDate: minDate && getDate(minDate),
      maxDate: maxDate && getDate(maxDate),
      mode: androidMode,
    });
  }

  launchTimePicker() {
    const {
      androidMode,
      mode,
      format = FORMATS[mode],
      is24Hour = modeIs24Hour(format),
    } = this.props;

    const timeMoment = moment(this.state.date);

    return TimePickerAndroid.open({
      hour: timeMoment.hour(),
      minute: timeMoment.minutes(),
      is24Hour,
      mode: androidMode,
    });
  }

  async launchDateThenTimePicker() {
    const {
      action: dateAction,
      year,
      month,
      day,
    } = await this.launchDatePicker();

    if (dateAction === DatePickerAndroid.dismissedAction) {
      return { action: dateAction };
    }

    const { action: timeAction, hour, minute } = await this.launchTimePicker();

    return { action: timeAction, year, month, day, hour, minute };
  }

  onPressDate = async () => {
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

MyDatePickerAndroid.defaultProps = {
  mode: 'date',
  androidMode: 'default',
  date: '',
  disabled: false,
};

MyDatePickerAndroid.propTypes = {
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  androidMode: PropTypes.oneOf(['clock', 'calendar', 'spinner', 'default']),
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.object,
  ]),
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  disabled: PropTypes.bool,
  beforeShowModal: PropTypes.func,
  onDateChange: PropTypes.func,
  onCloseModal: PropTypes.func,
  is24Hour: PropTypes.bool,
  onPressAndroid: PropTypes.func,
  children: PropTypes.element,
};

export default MyDatePickerAndroid;
