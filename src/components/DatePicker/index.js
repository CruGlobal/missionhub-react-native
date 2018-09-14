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
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      allowPointerEvents: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      this.setState({ date: this.getDate(nextProps.date) });
    }
  }

  setModalVisible = visible => {
    const { height, duration } = this.props;

    // slide animation
    if (visible) {
      this.setState({ modalVisible: visible });
      return Animated.timing(this.state.animatedHeight, {
        toValue: height,
        duration: duration,
      }).start();
    } else {
      return Animated.timing(this.state.animatedHeight, {
        toValue: 0,
        duration: duration,
      }).start(() => {
        this.setState({ modalVisible: visible });
      });
    }
  };

  closeModal = () => this.setModalVisible(false);

  onPressCancel = () => {
    this.closeModal();

    if (isFunction(this.props.onCloseModal)) {
      this.props.onCloseModal();
    }
  };

  onPressConfirm = () => {
    this.datePicked();
    this.closeModal();

    if (isFunction(this.props.onCloseModal)) {
      this.props.onCloseModal();
    }
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
    if (isFunction(this.props.onDateChange)) {
      this.props.onDateChange(
        this.getDateStr(this.state.date),
        this.state.date,
      );
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

  onDatetimePicked = ({ action, year, month, day }) => {
    const {
      mode,
      androidMode,
      format = FORMATS[mode],
      is24Hour = !format.match(/h|a/),
    } = this.props;

    if (action !== DatePickerAndroid.dismissedAction) {
      const timeMoment = moment(this.state.date);

      TimePickerAndroid.open({
        hour: timeMoment.hour(),
        minute: timeMoment.minutes(),
        is24Hour: is24Hour,
        mode: androidMode,
      }).then(() => this.onDatetimeTimePicked(year, month, day));
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

  renderInput() {
    const { date, placeholder, customStyles, disabled } = this.props;

    const dateInputStyle = [
      styles.dateInput,
      customStyles.dateInput,
      disabled && styles.disabled,
      disabled && customStyles.disabled,
    ];
    return (
      <View style={dateInputStyle}>
        <Text style={[styles.dateText, customStyles.dateText]}>
          {!date && placeholder ? placeholder : this.getDateStr()}
        </Text>
      </View>
    );
  }

  render() {
    const {
      t,
      mode,
      style,
      customStyles,
      minDate,
      maxDate,
      minuteInterval,
      timeZoneOffsetInMinutes,
      cancelBtnText,
      doneBtnText,
      title,
    } = this.props;

    return (
      <Touchable
        style={style}
        underlayColor={'transparent'}
        onPress={this.onPressDate}
      >
        <View>
          {!this.props.hideText ? this.renderInput() : <View />}
          {!isAndroid ? (
            <Modal
              transparent={true}
              animationType="none"
              visible={this.state.modalVisible}
              onRequestClose={this.closeModal}
            >
              <View style={{ flex: 1 }}>
                <Touchable
                  style={styles.datePickerMask}
                  activeOpacity={1}
                  onPress={this.onPressCancel}
                >
                  <Touchable activeOpacity={1} style={{ flex: 1 }}>
                    <Animated.View
                      style={[
                        styles.datePickerBox,
                        { height: this.state.animatedHeight },
                      ]}
                    >
                      <View
                        pointerEvents={
                          this.state.allowPointerEvents ? 'auto' : 'none'
                        }
                      >
                        <DatePickerIOS
                          date={this.state.date}
                          mode={mode}
                          minimumDate={minDate && this.getDate(minDate)}
                          maximumDate={maxDate && this.getDate(maxDate)}
                          onDateChange={this.onDateChange}
                          minuteInterval={minuteInterval}
                          timeZoneOffsetInMinutes={
                            timeZoneOffsetInMinutes
                              ? timeZoneOffsetInMinutes
                              : null
                          }
                          style={[styles.datePicker, customStyles.datePicker]}
                          locale={locale}
                        />
                      </View>
                      <View style={styles.topWrap}>
                        <Touchable onPress={this.onPressCancel}>
                          <Text style={[styles.btnText, styles.btnTextCancel]}>
                            {cancelBtnText || t('cancel')}
                          </Text>
                        </Touchable>
                        <Text style={styles.titleText}>
                          {title || t('date')}
                        </Text>
                        <Touchable onPress={this.onPressConfirm}>
                          <Text
                            style={[
                              styles.btnText,
                              customStyles.btnTextConfirm,
                            ]}
                          >
                            {doneBtnText || t('done')}
                          </Text>
                        </Touchable>
                      </View>
                    </Animated.View>
                  </Touchable>
                </Touchable>
              </View>
            </Modal>
          ) : null}
        </View>
      </Touchable>
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
