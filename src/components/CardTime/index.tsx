import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import { DateComponent } from '../../components/common';

import styles from './styles';

interface CardTimeProps {
  date: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const CardTime = ({ date, style = {} }: CardTimeProps) => (
  <DateComponent
    style={[styles.time, style]}
    date={date}
    format="LT"
    dateAtTIme={true}
  />
);

export default CardTime;
