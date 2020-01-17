/* eslint max-lines-per-function: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, DatePickerIOS, Animated, Keyboard } from 'react-native';
import { withTranslation } from 'react-i18next';
import { getLocales } from 'react-native-localize';

import { Text, Touchable, Button } from '../common';
import { getDate } from '../../utils/date';
import { isFunction } from '../../utils/common';

import styles from './styles';

// @ts-ignore
@withTranslation('datePicker')
class MyDatePickerIOS extends Component {
  state = {
    // @ts-ignore
    date: getDate(this.props.date),
    modalVisible: false,
    animatedHeight: new Animated.Value(0),
    allowPointerEvents: true,
  };

  // @ts-ignore
  UNSAFE_componentWillReceiveProps({ date }) {
    // @ts-ignore
    if (date !== this.props.date) {
      this.setState({ date: getDate(date) });
    }
  }

  // @ts-ignore
  setModalVisible = visible => {
    // @ts-ignore
    const { height, duration } = this.props;

    this.setState({ modalVisible: visible });

    // slide animation
    return Animated.timing(this.state.animatedHeight, {
      toValue: visible ? height : 0,
      duration: duration,
    }).start();
  };

  closeModal = () => this.setModalVisible(false);

  showPicker = () => this.setModalVisible(true);

  onPressCancel = () => {
    // @ts-ignore
    const { onCloseModal } = this.props;

    this.closeModal();
    isFunction(onCloseModal) && onCloseModal();
  };

  onPressConfirm = () => {
    // @ts-ignore
    const { onCloseModal } = this.props;

    this.datePicked();
    this.closeModal();
    isFunction(onCloseModal) && onCloseModal();
  };

  datePicked() {
    // @ts-ignore
    const { onDateChange } = this.props;
    const { date } = this.state;

    isFunction(onDateChange) && onDateChange(date);
  }

  // @ts-ignore
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
    // @ts-ignore
    const { disabled, onPressIOS, date } = this.props;

    if (disabled) {
      return true;
    }

    Keyboard.dismiss();

    this.setState({
      date: getDate(date),
    });

    return isFunction(onPressIOS)
      ? onPressIOS({ showPicker: this.showPicker })
      : this.showPicker();
  };

  render() {
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      mode,
      // @ts-ignore
      customStyles,
      // @ts-ignore
      minDate,
      // @ts-ignore
      maxDate,
      // @ts-ignore
      minuteInterval,
      // @ts-ignore
      timeZoneOffsetInMinutes,
      // @ts-ignore
      cancelBtnText,
      // @ts-ignore
      doneBtnText,
      // @ts-ignore
      title,
      children,
      // @ts-ignore
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
          // @ts-ignore
          style={styles.datePickerContainer}
        >
          <Touchable
            style={datePickerMask}
            activeOpacity={1}
            onPress={this.onPressCancel}
          />
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
              locale={(getLocales()[0] || {}).languageTag}
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
        </Modal>
      </View>
    );
  }
}

// @ts-ignore
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

// @ts-ignore
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
  onDateChange: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func,
  onPressIOS: PropTypes.func,
  minuteInterval: PropTypes.number,
  timeZoneOffsetInMinutes: PropTypes.number,
  title: PropTypes.string,
  children: PropTypes.element,
  iOSModalContent: PropTypes.element,
};

export default MyDatePickerIOS;
