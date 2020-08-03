import React, { ReactNode, useState, useEffect } from 'react';
import {
  View,
  DatePickerAndroid,
  TimePickerAndroid,
  Keyboard,
  StyleProp,
  ViewProps,
} from 'react-native';
import moment from 'moment';

import { Touchable } from '../common';
import { getDate, modeIs24Hour } from '../../utils/date';
import { isFunction } from '../../utils/common';

const FORMATS = {
  date: 'LL',
  datetime: 'YYYY-MM-DD LT',
  time: 'LT',
};

type Mode = 'date' | 'time' | 'datetime';

export interface MyDatePickerAndroidProps {
  date?: Date | string;
  height?: number;
  duration?: number;
  onCloseModal?: () => void;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
  onPressAndroid?: ({ showPicker }: { showPicker: () => void }) => void;
  mode?: Mode;
  customStyles?: {
    datePicker: StyleProp<ViewProps>;
    btnTextConfirm: StyleProp<ViewProps>;
  };
  minDate?: Date | string;
  maxDate?: Date | string;
  timeZoneOffsetInMinutes?: number;
  cancelBtnText?: string;
  doneBtnText?: string;
  title?: string;
  children?: ReactNode;
  androidDateMode?: 'calendar' | 'spinner' | 'default';
  androidTimeMode?: 'clock' | 'spinner' | 'default';
  format: typeof FORMATS[keyof typeof FORMATS];
  is24Hour: boolean;
  testID?: string;
}

const MyDatePickerAndroid = ({
  date: dateProp,
  onCloseModal,
  onDateChange,
  disabled = false,
  onPressAndroid,
  mode = 'date',
  minDate,
  maxDate,
  children,
  androidDateMode = 'default',
  androidTimeMode = 'spinner',
  format = FORMATS[mode],
  is24Hour = modeIs24Hour(format),
}: MyDatePickerAndroidProps) => {
  const [date, setDate] = useState<Date>(getDate(dateProp));

  useEffect(() => {
    setDate(getDate(dateProp));
  }, [dateProp]);

  const onPressCancel = () => {
    isFunction(onCloseModal) && onCloseModal();
  };

  const datePicked = () => {
    isFunction(onDateChange) && onDateChange(date);
  };

  const showPicker = async () => {
    const today = moment();
    let dateTimeSelections;

    switch (mode) {
      case 'date':
        dateTimeSelections = await launchDatePicker();
        break;
      case 'time':
        dateTimeSelections = await launchTimePicker();
        break;
      case 'datetime':
        dateTimeSelections = await launchDateThenTimePicker();
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
      return onPressCancel();
    }

    setDate(new Date(year, month, day, hour, minute));
    return datePicked();
  };

  const launchDatePicker = () => {
    return DatePickerAndroid.open({
      date,
      minDate: minDate ? getDate(minDate) : undefined,
      maxDate: maxDate ? getDate(maxDate) : undefined,
      mode: androidDateMode,
    });
  };

  const launchTimePicker = () => {
    const timeMoment = moment(date);

    return TimePickerAndroid.open({
      hour: timeMoment.hour(),
      minute: timeMoment.minutes(),
      is24Hour,
      mode: androidTimeMode,
    });
  };

  const launchDateThenTimePicker = async () => {
    const {
      action: dateAction,
      // @ts-ignore
      year,
      // @ts-ignore
      month,
      // @ts-ignore
      day,
    } = await launchDatePicker();

    if (dateAction === DatePickerAndroid.dismissedAction) {
      return { action: dateAction };
    }

    // @ts-ignore
    const { action: timeAction, hour, minute } = await launchTimePicker();

    return { action: timeAction, year, month, day, hour, minute };
  };

  const onPressDate = () => {
    if (disabled) {
      return true;
    }

    Keyboard.dismiss();

    setDate(getDate(date));

    return isFunction(onPressAndroid)
      ? onPressAndroid({ showPicker })
      : showPicker();
  };

  return (
    <View>
      <Touchable onPress={onPressDate}>{children}</Touchable>
    </View>
  );
};

export default MyDatePickerAndroid;
