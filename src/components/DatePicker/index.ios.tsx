import React, { useState, useEffect, useRef, ReactNode } from 'react';
import {
  View,
  Modal,
  Animated,
  Keyboard,
  StyleProp,
  ViewProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import DateTimePicker, {
  Event,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';

import { Text, Touchable, Button } from '../common';
import { getDate } from '../../utils/date';
import { isFunction } from '../../utils/common';

import styles from './styles';

export interface MyDatePickerIOSProps {
  date?: Date | string;
  height?: number;
  duration?: number;
  onCloseModal?: () => void;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
  onPressIOS?: ({ showPicker }: { showPicker: () => void }) => void;
  mode?: IOSNativeProps['mode'];
  customStyles?: {
    datePicker: StyleProp<ViewProps>;
    btnTextConfirm: StyleProp<ViewProps>;
  };
  minDate?: Date | string;
  maxDate?: Date | string;
  minuteInterval?: IOSNativeProps['minuteInterval'];
  timeZoneOffsetInMinutes?: number;
  cancelBtnText?: string;
  doneBtnText?: string;
  title?: string;
  children?: ReactNode;
  iOSModalContent?: ReactNode;
  testID?: string;
}

const MyDatePickerIOS = ({
  date: dateProp,
  // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
  height = 259,
  // slide animation duration time, default to 300ms, IOS only
  duration = 300,
  onCloseModal,
  onDateChange,
  disabled = false,
  onPressIOS,
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
}: MyDatePickerIOSProps) => {
  const { t } = useTranslation('datePicker');

  const [date, setDate] = useState<Date>(getDate(dateProp));
  const [modalVisible, setModalVisible] = useState(false);
  const animatedHeight = useRef(new Animated.Value(height));
  const [allowPointerEvents, setAllowPointerEvents] = useState(true);

  useEffect(() => {
    setDate(getDate(dateProp));
  }, [dateProp]);

  const updateModalVisible = (visible: boolean) => {
    setModalVisible(visible);

    // slide animation
    return Animated.timing(animatedHeight.current, {
      toValue: visible ? 0 : height,
      duration: duration,
    }).start();
  };

  const closeModal = () => updateModalVisible(false);

  const showPicker = () => updateModalVisible(true);

  const onPressCancel = () => {
    closeModal();
    isFunction(onCloseModal) && onCloseModal();
  };

  const onPressConfirm = () => {
    datePicked();
    closeModal();
    isFunction(onCloseModal) && onCloseModal();
  };

  const datePicked = () => {
    isFunction(onDateChange) && onDateChange(date);
  };

  const onChange = (event: Event, date?: Date) => {
    setAllowPointerEvents(false);
    setDate(getDate(date));
    const timeoutId = setTimeout(() => {
      setAllowPointerEvents(true);
      clearTimeout(timeoutId);
    }, 200);
  };

  const onPressDate = () => {
    if (disabled) {
      return true;
    }

    Keyboard.dismiss();

    setDate(getDate(dateProp));

    return isFunction(onPressIOS) ? onPressIOS({ showPicker }) : showPicker();
  };

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
      <Touchable onPress={onPressDate}>{children}</Touchable>
      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Touchable
          style={datePickerMask}
          activeOpacity={1}
          onPress={onPressCancel}
        />
        <Animated.View
          style={[
            datePickerBox,
            { transform: [{ translateY: animatedHeight.current }] },
          ]}
          pointerEvents={allowPointerEvents ? 'auto' : 'none'}
        >
          <DateTimePicker
            value={date}
            mode={mode}
            minimumDate={minDate ? getDate(minDate) : undefined}
            maximumDate={maxDate ? getDate(maxDate) : undefined}
            onChange={onChange}
            minuteInterval={minuteInterval}
            timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
            style={[datePicker, customStyles?.datePicker]}
            locale={(getLocales()[0] || {}).languageTag}
          />
          {iOSModalContent}
          <View style={topWrap}>
            <Button
              type={'transparent'}
              onPress={onPressCancel}
              text={cancelBtnText || t('cancel')}
              buttonTextStyle={[btnText, btnTextCancel]}
            />
            <Text style={titleText}>{title || t('date')}</Text>
            <Button
              type={'transparent'}
              onPress={onPressConfirm}
              text={doneBtnText || t('done')}
              buttonTextStyle={[btnText, customStyles?.btnTextConfirm]}
            />
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default MyDatePickerIOS;
