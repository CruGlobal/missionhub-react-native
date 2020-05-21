import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import Text from '../Text';
import { dateFormat, getMomentDate, dateAtTimeFormat } from '../../utils/date';

interface DateComponentProps {
  date: string | Date;
  format?: dateFormat;
  dateAtTIme?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const DateComponent = ({
  date,
  format = 'ddd, lll',
  dateAtTIme = false,
  style,
}: DateComponentProps) => {
  const momentDate = getMomentDate(date);
  const text = dateAtTIme
    ? dateAtTimeFormat(momentDate)
    : momentDate.format(format);

  return (
    <Text testID="Text" style={style}>
      {text}
    </Text>
  );
};

export default DateComponent;
