import React from 'react';

import { DateComponent } from '../../components/common';

import styles from './styles';

interface CardTimeProps {
  date: string;
  format?: string;
  testID?: string;
}

const CardTime = ({ date, format = 'LT' }: CardTimeProps) => (
  <DateComponent style={styles.time} date={date} format={format} />
);

export default CardTime;
