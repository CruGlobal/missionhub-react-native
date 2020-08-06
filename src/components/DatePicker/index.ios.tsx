import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, Animated, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';

import { Text, Touchable, Button } from '../common';
import { getDate } from '../../utils/date';
import { isFunction } from '../../utils/common';

import styles from './styles';
import { DateTimePickerButtonProps } from './shared';

const DatePickerIos = ({
  date: dateProp,
  // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
  height = 259,
  onDateChange,
  onPress,
  mode = 'datetime',
  minimumDate,
  children,
  iOSModalContent,
}: DateTimePickerButtonProps) => {
  const { t } = useTranslation('datePicker');

  const [date, setDate] = useState<Date>(getDate(dateProp));
  const [modalVisible, setModalVisible] = useState(false);
  const animatedHeight = useRef(new Animated.Value(height));

  useEffect(() => {
    setDate(getDate(dateProp));
  }, [dateProp]);

  const updateModalVisible = (visible: boolean) => {
    setModalVisible(visible);

    // slide animation
    return Animated.timing(animatedHeight.current, {
      toValue: visible ? 0 : height,
      duration: 300,
    }).start();
  };

  const closeModal = () => updateModalVisible(false);

  const showPicker = () => updateModalVisible(true);

  const onPressConfirm = () => {
    datePicked();
    closeModal();
  };

  const datePicked = () => {
    onDateChange(date);
  };

  const onChange = (event: Event, date?: Date) => {
    setDate(getDate(date));
  };

  const openModal = () => {
    Keyboard.dismiss();

    setDate(getDate(dateProp));

    return isFunction(onPress) ? onPress({ showPicker }) : showPicker();
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
    <>
      <Touchable onPress={openModal}>{children}</Touchable>
      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Touchable
          style={datePickerMask}
          activeOpacity={1}
          onPress={closeModal}
        />
        <Animated.View
          style={[
            datePickerBox,
            { transform: [{ translateY: animatedHeight.current }] },
          ]}
        >
          <DateTimePicker
            testID="DateTimePicker"
            value={date}
            mode={mode}
            minimumDate={minimumDate ? getDate(minimumDate) : undefined}
            onChange={onChange}
            style={datePicker}
            locale={(getLocales()[0] || {}).languageTag}
          />
          {iOSModalContent}
          <View style={topWrap}>
            <Button
              type={'transparent'}
              onPress={closeModal}
              text={t('cancel')}
              buttonTextStyle={[btnText, btnTextCancel]}
            />
            <Text style={titleText}>{t('date')}</Text>
            <Button
              type={'transparent'}
              onPress={onPressConfirm}
              text={t('done')}
              buttonTextStyle={btnText}
            />
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default DatePickerIos;
