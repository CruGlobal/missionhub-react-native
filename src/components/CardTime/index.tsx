import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import { DateComponent } from '../../components/common';

import styles from './styles';

interface CardTimeProps {
  date: string;
  commentFormatting?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const CardTime = ({
  date,
  commentFormatting = false,
  style = {},
}: CardTimeProps) => (
  <DateComponent
    style={[styles.time, style]}
    date={date}
    format="LT"
    commentFormatting={commentFormatting}
  />
);

export default CardTime;
