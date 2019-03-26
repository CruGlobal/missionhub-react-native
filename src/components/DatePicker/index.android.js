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

  componentWillReceiveProps({ date }) {
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

  showAndroidModal() {
    const { mode } = this.props;

    if (mode === 'date') {
      this.androidPickDate();
    } else if (mode === 'time') {
      this.androidPickTime();
    } else if (mode === 'datetime') {
      this.androidPickDateTime();
    }
  }

  async androidPickDate() {
    const { androidMode, minDate, maxDate } = this.props;

    const { action, year, month, day } = await DatePickerAndroid.open({
      date: this.state.date,
      minDate: minDate && getDate(minDate),
      maxDate: maxDate && getDate(maxDate),
      mode: androidMode,
    });

    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  }

  async androidPickTime() {
    const {
      mode,
      format = FORMATS[mode],
      androidMode,
      is24Hour = modeIs24Hour(format),
    } = this.props;

    const timeMoment = moment(this.state.date);

    const { action, hour, minute } = await TimePickerAndroid.open({
      hour: timeMoment.hour(),
      minute: timeMoment.minutes(),
      is24Hour,
      mode: androidMode,
    });

    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: moment()
          .hour(hour)
          .minute(minute)
          .toDate(),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  }

  async androidPickDateTime() {
    const {
      mode,
      format = FORMATS[mode],
      androidMode,
      minDate,
      maxDate,
      is24Hour = modeIs24Hour(format),
    } = this.props;

    const {
      action: dateAction,
      year,
      month,
      day,
    } = await DatePickerAndroid.open({
      date: this.state.date,
      minDate: minDate && getDate(minDate),
      maxDate: maxDate && getDate(maxDate),
      mode: androidMode,
    });

    if (dateAction !== DatePickerAndroid.dismissedAction) {
      const timeMoment = moment(this.state.date);

      const { action: timeAction, hour, minute } = await TimePickerAndroid.open(
        {
          hour: timeMoment.hour(),
          minute: timeMoment.minutes(),
          is24Hour,
          mode: androidMode,
        },
      );

      if (timeAction !== DatePickerAndroid.dismissedAction) {
        this.setState({
          date: new Date(year, month, day, hour, minute),
        });
        return this.datePicked();
      }
    }
    this.onPressCancel();
  }

  onPressDate = () => {
    const { disabled, onPressAndroid, date } = this.props;

    if (disabled) {
      return true;
    }

    Keyboard.dismiss();

    this.setState({
      date: getDate(date),
    });

    return isFunction(onPressAndroid)
      ? onPressAndroid()
      : this.showAndroidModal();
  };

  render() {
    const { children } = this.props;

    //todo set min date
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
  onDateChange: PropTypes.func,
  onCloseModal: PropTypes.func,
  is24Hour: PropTypes.bool,
  onPressAndroid: PropTypes.func,
  children: PropTypes.element,
};

export default MyDatePickerAndroid;
