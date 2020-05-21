import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import Text from '../Text';
import { dateFormat, getMomentDate, dateAtTimeFormat } from '../../utils/date';

interface DateComponentProps {
  date: string | Date;
  format?: dateFormat;
  dateAtTime?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const DateComponent = ({
  date,
  format = 'ddd, lll',
  dateAtTime = false,
  style,
}: DateComponentProps) => {
  const momentDate = getMomentDate(date);
  const text = dateAtTime
    ? dateAtTimeFormat(momentDate)
    : momentDate.format(format);

  return (
    <Text testID="Text" style={style}>
      {text}
    </Text>
  );
};

export default DateComponent;
