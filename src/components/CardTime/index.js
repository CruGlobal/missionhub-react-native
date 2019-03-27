import React from 'react';
import PropTypes from 'prop-types';

import { DateComponent } from '../../components/common';

import styles from './styles';

export default function CardTime({ date, format }) {
  return (
    <DateComponent style={styles.time} date={date} format={format || 'LT'} />
  );
}

CardTime.propTypes = {
  date: PropTypes.string.isRequired,
  format: PropTypes.string,
};
