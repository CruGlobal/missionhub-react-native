import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import DateTimePicker, {
  Event,
  AndroidNativeProps,
} from '@react-native-community/datetimepicker';

import { Touchable } from '../common';
import { getDate } from '../../utils/date';
import { isFunction } from '../../utils/common';

import { DateTimePickerButtonProps } from './shared';

const covertIosToAndroidMode = (
  mode: DateTimePickerButtonProps['mode'],
): AndroidNativeProps['mode'] =>
  mode === 'countdown' ? 'time' : mode === 'datetime' ? 'date' : mode;

const DatePickerAndroid = ({
  date: dateProp,
  mode = 'datetime',
  onDateChange,
  onPress,
  minimumDate,
  children,
}: DateTimePickerButtonProps) => {
  const [date, setDate] = useState<Date>(getDate(dateProp));
  const [currentMode, setCurrentMode] = useState<AndroidNativeProps['mode']>(
    covertIosToAndroidMode(mode),
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    setDate(getDate(dateProp));
  }, [dateProp]);

  const onChange = (event: Event, date?: Date) => {
    if (date === undefined) {
      closeModal();
    } else {
      const newDate = getDate(date);
      if (mode === 'datetime' && currentMode === 'date') {
        setDate(newDate);
        setCurrentMode('time');
      } else {
        closeModal();
        onDateChange(newDate);
      }
    }
  };

  const showPicker = () => {
    setDatePickerVisible(true);
  };

  const openModal = () => {
    Keyboard.dismiss();

    setDate(getDate(dateProp));
    setCurrentMode(covertIosToAndroidMode(mode));

    return isFunction(onPress) ? onPress({ showPicker }) : showPicker();
  };

  const closeModal = () => {
    setDatePickerVisible(false);
  };

  return (
    <>
      <Touchable onPress={openModal}>{children}</Touchable>
      {datePickerVisible && (
        <DateTimePicker
          mode={currentMode}
          value={date}
          onChange={onChange}
          minimumDate={minimumDate}
        />
      )}
    </>
  );
};

export default DatePickerAndroid;
