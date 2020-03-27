import React from 'react';

import { DateComponent } from '../../components/common';

import styles from './styles';

interface CardTimeProps {
  date: string;
  commentFormatting?: boolean;
  testID?: string;
}

const CardTime = ({ date, commentFormatting = false }: CardTimeProps) => (
  <DateComponent
    style={styles.time}
    date={date}
    commentFormatting={commentFormatting}
  />
);

export default CardTime;
