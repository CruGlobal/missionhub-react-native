import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import Text from '../Text';
import {
  dateFormat,
  getMomentDate,
  relativeDateFormat,
  commentDateFormat,
} from '../../utils/date';

interface DateComponentProps {
  date: string | Date;
  format?: dateFormat;
  relativeFormatting?: boolean;
  commentFormatting?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const DateComponent = ({
  date,
  format = 'ddd, lll',
  relativeFormatting = false,
  commentFormatting = false,
  style,
}: DateComponentProps) => {
  const momentDate = getMomentDate(date);
  const text = relativeFormatting
    ? relativeDateFormat(momentDate)
    : commentFormatting
    ? commentDateFormat(momentDate)
    : momentDate.format(format);

  return (
    <Text testID="Text" style={style}>
      {text}
    </Text>
  );
};

export default DateComponent;
