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
  TextInput,
} from 'react-native';
import moment from 'moment';
import { translate } from 'react-i18next';

import { Text, Touchable, Button } from '../common';
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
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      allowPointerEvents: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.date !== this.props.date) {
      this.setState({
        date: this.getDate(nextProps.date),
      });
    }
    if (nextProps.visible !== this.props.visible) {
      this.setModalVisible(nextProps.visible);
    }
  }

  setModalVisible = visible => {
    const { height, duration } = this.props;

    this.setState({ modalVisible: visible });

    // slide animation
    if (visible) {
      return Animated.timing(this.state.animatedHeight, {
        toValue: height,
        duration: duration,
      }).start();
    } else {
      return Animated.timing(this.state.animatedHeight, {
        toValue: 0,
        duration: duration,
      }).start();
    }
  };

  closeModal = () => this.setModalVisible(false);

  onPressCancel = () => {
    const { onCloseModal } = this.props;

    this.closeModal();
    isFunction(onCloseModal) && onCloseModal();
  };

  onPressConfirm = () => {
    const { onCloseModal } = this.props;

    this.datePicked();
    this.closeModal();
    isFunction(onCloseModal) && onCloseModal();
  };

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

  getDateStr(date = this.props.date) {
    const { mode, format = FORMATS[mode], getDateStr } = this.props;

    const dateInstance = date instanceof Date ? date : this.getDate(date);

    if (isFunction(getDateStr)) {
      return getDateStr(dateInstance);
    }

    return moment(dateInstance).format(format);
  }

  datePicked() {
    const { onDateChange } = this.props;
    const { date } = this.state;

    if (isFunction(onDateChange)) {
      onDateChange(this.getDateStr(date), date);
    }
  }

  onDateChange = date => {
    this.setState({
      allowPointerEvents: false,
      date: date,
    });
    const timeoutId = setTimeout(() => {
      this.setState({
        allowPointerEvents: true,
      });
      clearTimeout(timeoutId);
    }, 200);
  };

  onDatePicked = ({ action, year, month, day }) => {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  };

  onTimePicked = ({ action, hour, minute }) => {
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
  };

  onDatetimePicked = async ({ action, year, month, day }) => {
    const {
      mode,
      androidMode,
      format = FORMATS[mode],
      is24Hour = !format.match(/h|a/),
    } = this.props;

    if (action !== DatePickerAndroid.dismissedAction) {
      const timeMoment = moment(this.state.date);

      await TimePickerAndroid.open({
        hour: timeMoment.hour(),
        minute: timeMoment.minutes(),
        is24Hour: is24Hour,
        mode: androidMode,
      });
      this.onDatetimeTimePicked(year, month, day);
    } else {
      this.onPressCancel();
    }
  };

  onDatetimeTimePicked = (year, month, day, { action, hour, minute }) => {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day, hour, minute),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  };

  onPressDate = () => {
    if (this.props.disabled) {
      return true;
    }

    Keyboard.dismiss();

    this.setState({
      date: this.getDate(),
    });

    if (!isAndroid) {
      this.setModalVisible(true);
    } else {
      const {
        mode,
        androidMode,
        format = FORMATS[mode],
        minDate,
        maxDate,
        is24Hour = !format.match(/h|a/),
      } = this.props;

      if (mode === 'date') {
        DatePickerAndroid.open({
          date: this.state.date,
          minDate: minDate && this.getDate(minDate),
          maxDate: maxDate && this.getDate(maxDate),
          mode: androidMode,
        }).then(this.onDatePicked);
      } else if (mode === 'time') {
        const timeMoment = moment(this.state.date);

        TimePickerAndroid.open({
          hour: timeMoment.hour(),
          minute: timeMoment.minutes(),
          is24Hour: is24Hour,
          mode: androidMode,
        }).then(this.onTimePicked);
      } else if (mode === 'datetime') {
        DatePickerAndroid.open({
          date: this.state.date,
          minDate: minDate && this.getDate(minDate),
          maxDate: maxDate && this.getDate(maxDate),
          mode: androidMode,
        }).then(this.onDatetimePicked);
      }
    }
  };

  render() {
    const {
      t,
      mode,
      minDate,
      maxDate,
      minuteInterval,
      timeZoneOffsetInMinutes,
      customStyles,
      cancelBtnText,
      doneBtnText,
      locale,
      title,
    } = this.props;
    const {
      modalVisible,
      animatedHeight,
      date,
      allowPointerEvents,
    } = this.state;
    const {
      datePickerMask,
      datePickerBox,
      topWrap,
      btnText,
      btnTextCancel,
      titleText,
    } = styles;

    console.log(modalVisible);
    return (
      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={this.closeModal}
      >
        <Touchable
          style={datePickerMask}
          activeOpacity={1}
          onPress={this.onPressCancel}
        >
          <Animated.View
            style={[datePickerBox, { height: animatedHeight }]}
            pointerEvents={allowPointerEvents ? 'auto' : 'none'}
          >
            <DatePickerIOS
              date={date}
              mode={mode}
              minimumDate={minDate && this.getDate(minDate)}
              maximumDate={maxDate && this.getDate(maxDate)}
              onDateChange={this.onDateChange}
              minuteInterval={minuteInterval}
              timeZoneOffsetInMinutes={
                timeZoneOffsetInMinutes ? timeZoneOffsetInMinutes : null
              }
              style={[styles.datePicker, customStyles.datePicker]}
              locale={locale}
            />
            <View style={topWrap}>
              <Button
                type={'transparent'}
                onPress={this.onPressCancel}
                text={cancelBtnText || t('cancel')}
                buttonTextStyle={[btnText, btnTextCancel]}
              />
              <Text style={titleText}>{title || t('date')}</Text>
              <Button
                type={'transparent'}
                onPress={this.onPressConfirm}
                text={doneBtnText || t('done')}
                buttonTextStyle={[btnText, customStyles.btnTextConfirm]}
              />
            </View>
          </Animated.View>
        </Touchable>
      </Modal>
    );
  }
}

DatePicker.defaultProps = {
  mode: 'date',
  androidMode: 'default',
  date: '',
  // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
  height: 259,

  // slide animation duration time, default to 300ms, IOS only
  duration: 300,
  customStyles: {},
  disabled: false,
  hideText: false,
  placeholder: '',
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
  height: PropTypes.number,
  duration: PropTypes.number,
  doneBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  customStyles: PropTypes.object,
  disabled: PropTypes.bool,
  onDateChange: PropTypes.func,
  onCloseModal: PropTypes.func,
  placeholder: PropTypes.string,
  is24Hour: PropTypes.bool,
  getDateStr: PropTypes.func,
};

export default DatePicker;
