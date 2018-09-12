import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
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
import { isAndroid, locale } from '../../utils/common';

import styles from './styles';

const FORMATS = {
  date: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm',
  time: 'HH:mm',
};

@translate()
class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.getDate(),
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      allowPointerEvents: true,
    };

    this.getDate = this.getDate.bind(this);
    this.getDateStr = this.getDateStr.bind(this);
    this.datePicked = this.datePicked.bind(this);
    this.onPressDate = this.onPressDate.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onPressMask = this.onPressMask.bind(this);
    this.onDatePicked = this.onDatePicked.bind(this);
    this.onTimePicked = this.onTimePicked.bind(this);
    this.onDatetimePicked = this.onDatetimePicked.bind(this);
    this.onDatetimeTimePicked = this.onDatetimeTimePicked.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      this.setState({ date: this.getDate(nextProps.date) });
    }
  }

  setModalVisible(visible) {
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
  }

  onPressMask() {
    if (typeof this.props.onPressMask === 'function') {
      this.props.onPressMask();
    } else {
      this.onPressCancel();
    }
  }

  closeModal = () => this.setModalVisible(false);

  onPressCancel() {
    this.closeModal();

    if (typeof this.props.onCloseModal === 'function') {
      this.props.onCloseModal();
    }
  }

  onPressConfirm() {
    this.datePicked();
    this.closeModal();

    if (typeof this.props.onCloseModal === 'function') {
      this.props.onCloseModal();
    }
  }

  getDate(date = this.props.date) {
    const { mode, minDate, maxDate, format = FORMATS[mode] } = this.props;

    if (!date) {
      let now = new Date();
      if (minDate) {
        let _minDate = this.getDate(minDate);

        if (now < _minDate) {
          return _minDate;
        }
      }

      if (maxDate) {
        let _maxDate = this.getDate(maxDate);

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
    const { mode, format = FORMATS[mode] } = this.props;

    const dateInstance = date instanceof Date ? date : this.getDate(date);

    if (typeof this.props.getDateStr === 'function') {
      return this.props.getDateStr(dateInstance);
    }

    return moment(dateInstance).format(format);
  }

  datePicked() {
    if (typeof this.props.onDateChange === 'function') {
      this.props.onDateChange(
        this.getDateStr(this.state.date),
        this.state.date,
      );
    }
  }

  getTitleElement() {
    const { date, placeholder, customStyles } = this.props;

    return (
      <Text style={[styles.dateText, customStyles.dateText]}>
        {!date && placeholder ? placeholder : this.getDateStr()}
      </Text>
    );
  }

  onDateChange(date) {
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
  }

  onDatePicked({ action, year, month, day }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  }

  onTimePicked({ action, hour, minute }) {
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

  onDatetimePicked({ action, year, month, day }) {
    const {
      mode,
      androidMode,
      format = FORMATS[mode],
      is24Hour = !format.match(/h|a/),
    } = this.props;

    if (action !== DatePickerAndroid.dismissedAction) {
      let timeMoment = moment(this.state.date);

      TimePickerAndroid.open({
        hour: timeMoment.hour(),
        minute: timeMoment.minutes(),
        is24Hour: is24Hour,
        mode: androidMode,
      }).then(this.onDatetimeTimePicked.bind(this, year, month, day));
    } else {
      this.onPressCancel();
    }
  }

  onDatetimeTimePicked(year, month, day, { action, hour, minute }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day, hour, minute),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  }

  onPressDate() {
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
        let timeMoment = moment(this.state.date);

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

    if (typeof this.props.onOpenModal === 'function') {
      this.props.onOpenModal();
    }
  }

  renderIcon() {
    const { showIcon, iconSource, iconComponent, customStyles } = this.props;

    if (showIcon) {
      if (iconComponent) {
        return iconComponent;
      }
      return (
        <Image
          style={[styles.dateIcon, customStyles.dateIcon]}
          source={iconSource}
        />
      );
    }

    return null;
  }

  render() {
    const {
      t,
      mode,
      style,
      customStyles,
      disabled,
      minDate,
      maxDate,
      minuteInterval,
      timeZoneOffsetInMinutes,
      cancelBtnText,
      doneBtnText,
      allowFontScaling,
    } = this.props;

    const dateInputStyle = [
      styles.dateInput,
      customStyles.dateInput,
      disabled && styles.disabled,
      disabled && customStyles.disabled,
    ];

    return (
      <Touchable
        style={[styles.dateTouch, style]}
        underlayColor={'transparent'}
        onPress={this.onPressDate}
      >
        <View style={[styles.dateTouchBody, customStyles.dateTouchBody]}>
          {!this.props.hideText ? (
            <View style={dateInputStyle}>{this.getTitleElement()}</View>
          ) : (
            <View />
          )}
          {this.renderIcon()}
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
                  underlayColor={'#00000077'}
                  onPress={this.onPressMask}
                >
                  <Touchable underlayColor={'#fff'} style={{ flex: 1 }}>
                    <Animated.View
                      style={[
                        styles.datePickerCon,
                        { height: this.state.animatedHeight },
                        customStyles.datePickerCon,
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
                      <Touchable
                        underlayColor={'transparent'}
                        onPress={this.onPressCancel}
                        style={[
                          styles.btnText,
                          styles.btnCancel,
                          customStyles.btnCancel,
                        ]}
                      >
                        <Text
                          allowFontScaling={allowFontScaling}
                          style={[
                            styles.btnTextText,
                            styles.btnTextCancel,
                            customStyles.btnTextCancel,
                          ]}
                        >
                          {cancelBtnText || t('cancel')}
                        </Text>
                      </Touchable>
                      <Touchable
                        underlayColor={'transparent'}
                        onPress={this.onPressConfirm}
                        style={[
                          styles.btnText,
                          styles.btnConfirm,
                          customStyles.btnConfirm,
                        ]}
                      >
                        <Text
                          allowFontScaling={allowFontScaling}
                          style={[
                            styles.btnTextText,
                            customStyles.btnTextConfirm,
                          ]}
                        >
                          {doneBtnText || t('done')}
                        </Text>
                      </Touchable>
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
  // iconSource: require('./date_icon.png'),
  customStyles: {},

  // whether or not show the icon
  showIcon: false,
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
  iconSource: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  iconComponent: PropTypes.element,
  customStyles: PropTypes.object,
  showIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  allowFontScaling: PropTypes.bool,
  onDateChange: PropTypes.func,
  onOpenModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  onPressMask: PropTypes.func,
  placeholder: PropTypes.string,
  is24Hour: PropTypes.bool,
  getDateStr: PropTypes.func,
};

export default DatePicker;
