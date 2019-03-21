/* eslint max-lines-per-function: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, DatePickerIOS, Animated, Keyboard } from 'react-native';
import { translate } from 'react-i18next';

import { Text, Touchable, Button } from '../common';
import { getDate } from '../../utils/date';
import { locale, isFunction } from '../../utils/common';

import styles from './styles';

@translate('datePicker')
class MyDatePickerIOS extends Component {
  state = {
    date: getDate(this.props.date),
    modalVisible: false,
    animatedHeight: new Animated.Value(0),
    allowPointerEvents: true,
  };

  componentWillReceiveProps({ date }) {
    if (date !== this.props.date) {
      this.setState({ date: getDate(date) });
    }
  }

  setModalVisible = visible => {
    const { height, duration } = this.props;

    this.setState({ modalVisible: visible });

    // slide animation
    return Animated.timing(this.state.animatedHeight, {
      toValue: visible ? height : 0,
      duration: duration,
    }).start();
  };

  closeModal = () => this.setModalVisible(false);

  showIOSModal = () => this.setModalVisible(true);

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

  datePicked() {
    const { onDateChange } = this.props;
    const { date } = this.state;

    isFunction(onDateChange) && onDateChange(date);
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

  onPressDate = () => {
    const { disabled, onPressIOS, date } = this.props;

    if (disabled) {
      return true;
    }

    Keyboard.dismiss();

    this.setState({
      date: getDate(date),
    });

    return isFunction(onPressIOS) ? onPressIOS() : this.showIOSModal();
  };

  render() {
    const {
      t,
      mode,
      customStyles,
      minDate,
      maxDate,
      minuteInterval,
      timeZoneOffsetInMinutes,
      cancelBtnText,
      doneBtnText,
      title,
      children,
      iOSModalContent,
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
      datePicker,
      topWrap,
      btnText,
      btnTextCancel,
      titleText,
    } = styles;

    return (
      <View>
        <Touchable onPress={this.onPressDate}>{children}</Touchable>
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
                minimumDate={minDate && getDate(minDate)}
                maximumDate={maxDate && getDate(maxDate)}
                onDateChange={this.onDateChange}
                minuteInterval={minuteInterval}
                timeZoneOffsetInMinutes={
                  timeZoneOffsetInMinutes ? timeZoneOffsetInMinutes : null
                }
                style={[datePicker, customStyles.datePicker]}
                locale={locale}
              />
              {iOSModalContent}
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
      </View>
    );
  }
}

MyDatePickerIOS.defaultProps = {
  mode: 'date',
  date: '',
  // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
  height: 259,

  // slide animation duration time, default to 300ms, IOS only
  duration: 300,
  customStyles: {},
  disabled: false,
};

MyDatePickerIOS.propTypes = {
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.object,
  ]),
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
  onPressIOS: PropTypes.func,
  minuteInterval: PropTypes.number,
  timeZoneOffsetInMinutes: PropTypes.number,
  title: PropTypes.string,
  children: PropTypes.element,
  iOSModalContent: PropTypes.element,
};

export default MyDatePickerIOS;
